/**
 * POST /api/portfolio-chat
 *
 * Server endpoint that forwards the visitor's message to Google Gemini
 * together with the strict portfolio assistant instructions and the
 * contents of `knowledge/portfolio-knowledge.md`. The API key never
 * leaves the server.
 */

import { NextResponse } from "next/server";
import { runPortfolioChat, type ChatMessage } from "@/lib/ai/gemini";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 32_000;

type RequestBody = {
  message?: unknown;
  history?: unknown;
};

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(request: Request) {
  // ── Body validation ──────────────────────────────────────────────
  let body: RequestBody;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return badRequest("Request too large.");
    }
    body = JSON.parse(raw) as RequestBody;
  } catch {
    return badRequest("Invalid JSON payload.");
  }

  if (!body || typeof body !== "object") {
    return badRequest("Invalid request body.");
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) {
    return badRequest("Message is required.");
  }

  // history is optional, but if present must be an array of messages
  let history: ChatMessage[] = [];
  if (Array.isArray(body.history)) {
    history = body.history
      .map((m): ChatMessage | null => {
        if (!m || typeof m !== "object") return null;
        const obj = m as Record<string, unknown>;
        const role =
          obj.role === "assistant" || obj.role === "model"
            ? "assistant"
            : "user";
        const content =
          typeof obj.content === "string" ? obj.content.trim() : "";
        if (!content) return null;
        return { role, content };
      })
      .filter((m): m is ChatMessage => m !== null);
  }

  // ── Call Gemini server-side ──────────────────────────────────────
  try {
    const { reply, unavailable } = await runPortfolioChat({ message, history });
    return NextResponse.json({ reply, unavailable });
  } catch (err) {
    // Avoid leaking internal error details to the client.
    if (process.env.NODE_ENV !== "production") {
      console.error("[portfolio-chat] Gemini error:", err);
    } else {
      console.error("[portfolio-chat] Gemini error");
    }
    return NextResponse.json(
      {
        error:
          "I couldn't answer that right now. Please try again in a moment.",
      },
      { status: 502 },
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST." },
    { status: 405 },
  );
}