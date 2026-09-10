/**
 * POST /api/portfolio-chat
 *
 * Server endpoint that streams the visitor's message to Google Gemini
 * together with the strict portfolio assistant instructions and the
 * contents of `knowledge/portfolio-knowledge.md`. The API key never
 * leaves the server.
 *
 * Defence in depth:
 *   - Same-origin POST enforcement (`lib/security/origin-check.ts`)
 *   - Sliding-window rate limit (`lib/chat/rate-limit.ts`)
 *   - Input sanitization (max content length, capped history)
 *   - Prompt-injection delimiters around visitor messages
 *   - First-byte timeout + fallback model
 *
 * Response shape:
 *   - Success: `text/plain; charset=utf-8` chunked stream. Each chunk is
 *     appended verbatim to the client's assistant bubble.
 *   - Validation failure: `application/json` with `{ error }` and a 4xx
 *     status — no streaming is started.
 *   - Rate limit: `application/json` with `{ error, retryAfterMs }` and
 *     a 429 status plus a `Retry-After` header.
 */

import { NextResponse } from "next/server";
import {
  sanitizeMessages,
  streamPortfolioChat,
} from "@/lib/ai/gemini";
import { assertSameOrigin } from "@/lib/security/origin-check";
import { checkRateLimit, getRequestIp } from "@/lib/chat/rate-limit";
import { classifyTopic } from "@/lib/chat/topic-classifier";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const maxDuration = 60;

const MAX_BODY_BYTES = 64_000;

type RequestBody = {
  message?: unknown;
  history?: unknown;
};

function badRequest(message: string) {
  return NextResponse.json(
    { error: message },
    {
      status: 400,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

function methodNotAllowed() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST." },
    {
      status: 405,
      headers: {
        "Cache-Control": "no-store",
        Allow: "POST",
      },
    },
  );
}

/**
 * ReadableStream writer with a small surface so we don't leak the
 * ReadableStreamDefaultController into the streaming callback.
 */
class StreamWriter {
  private encoder = new TextEncoder();
  private controller: ReadableStreamDefaultController<Uint8Array> | null = null;
  public readonly stream: ReadableStream<Uint8Array>;

  constructor() {
    this.stream = new ReadableStream<Uint8Array>({
      start: (controller) => {
        this.controller = controller;
      },
    });
  }

  write(text: string): void {
    if (this.controller) {
      try {
        this.controller.enqueue(this.encoder.encode(text));
      } catch {
        // Controller was closed/aborted underneath us — safe to ignore.
      }
    }
  }

  close(): void {
    if (!this.controller) return;
    try {
      this.controller.close();
    } catch {
      // already closed
    }
    this.controller = null;
  }

  abort(): void {
    if (!this.controller) return;
    try {
      this.controller.error(new Error("aborted"));
    } catch {
      // already errored
    }
    this.controller = null;
  }
}

export async function POST(request: Request) {
  // ── Same-origin POST enforcement ──────────────────────────────────
  const originGuard = assertSameOrigin(request);
  if (originGuard) return originGuard;

  // ── Rate limit (per visitor IP) ──────────────────────────────────
  const ip = getRequestIp(request) ?? "unknown";
  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    const retryAfterSec = Math.max(1, Math.ceil(limit.retryAfterMs / 1000));
    return NextResponse.json(
      {
        error:
          limit.reason === "hour"
            ? "You've reached the hourly chat limit. Please try again later or use the contact form."
            : "You're sending messages too quickly. Please wait a moment and try again.",
        retryAfterMs: limit.retryAfterMs,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSec),
          "Cache-Control": "no-store",
        },
      },
    );
  }

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

  // ── Pre-Gemini topic guard ────────────────────────────────────────
  // Reject clearly off-topic questions without paying for a Gemini call.
  // Conservative: only blocks when the message has an off-topic trigger
  // AND no Mav/portfolio signal. Everything else still reaches Gemini,
  // which has the full prompt-injection guard as the second line of
  // defence. We return a text/plain single chunk (the same shape Gemini
  // streams) and stamp an X-Chat-Intent header so the client knows the
  // whole reply arrived in one piece.
  const topic = classifyTopic(message);
  if (topic.kind === "reject") {
    return new Response(topic.reason, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Chat-Intent": "unrelated",
        "X-Accel-Buffering": "no",
        "Referrer-Policy": "no-referrer",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
      },
    });
  }

  const sanitized = sanitizeMessages(body.history);
  if (sanitized.messages.length > 0 && !sanitized.lastIsUser) {
    return badRequest(
      "Conversation history must end with a user message — the last turn belongs to the visitor.",
    );
  }

  // ── Streaming response ───────────────────────────────────────────
  const writer = new StreamWriter();
  const abortController = new AbortController();

  // If the client disconnects, abort the upstream Gemini call so we
  // don't keep paying for it.
  request.signal.addEventListener("abort", () => {
    abortController.abort();
    writer.abort();
  });

  // Kick off the chat work in the background — the response object is
  // already a valid ReadableStream that the client will read from.
  void streamPortfolioChat(
    {
      message,
      history: sanitized.messages,
      signal: abortController.signal,
    },
    {
      onChunk: (chunk) => writer.write(chunk),
    },
  )
    .then((outcome) => {
      if (!outcome.ok) {
        // Pre-stream validation failures (missing config, etc.) can't
        // be turned into JSON after we've already committed to a stream
        // — emit the error message as text so the client UI can show it.
        writer.write(outcome.error.message);
      }
    })
    .catch((err) => {
      console.error("[portfolio-chat] stream error:", err);
      try {
        writer.write("I couldn't answer that right now. Please try again in a moment.");
      } finally {
        writer.close();
      }
    })
    .finally(() => {
      writer.close();
    });

  return new Response(writer.stream, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      // Disable nginx response buffering so chunks reach the browser
      // as soon as Gemini emits them.
      "X-Accel-Buffering": "no",
      // Conservative security headers — chat responses are text only
      // and never embedded inside another origin's iframe.
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
    },
  });
}

export async function GET() {
  return methodNotAllowed();
}
