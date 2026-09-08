/**
 * POST /api/contact
 *
 * Sends the visitor's contact-form message to the owner via Resend.
 *
 * Defence in depth:
 *   - Same-origin POST enforcement (`lib/security/origin-check.ts`)
 *   - Sliding-window rate limit per IP (`lib/chat/rate-limit.ts`)
 *   - Body size limit + per-field length caps
 *   - HTML escaping on every visitor-supplied field before interpolation
 *   - Honeypot field rejects the most common bot submissions silently
 *   - RESEND_API_KEY / RESEND_FROM_EMAIL / PROJECT_INQUIRY_EMAIL read
 *     via `lib/email/resend.ts` with clear 503 when missing
 */

import { NextResponse } from "next/server";
import { assertSameOrigin } from "@/lib/security/origin-check";
import { checkRateLimit, getRequestIp } from "@/lib/chat/rate-limit";
import {
  EMAIL_CONFIG,
  getFromAddress,
  getRecipientAddress,
  getResendClient,
} from "@/lib/email/resend";
import {
  cleanPlainText,
  escapeHtml,
  isLikelyEmail,
  normalizeForPre,
} from "@/lib/email/sanitize";
import {
  ctaButton,
  dataRow,
  dataTable,
  emailShell,
  messageBlock,
  sectionHeading,
} from "@/lib/email/templates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const maxDuration = 30;

const MAX_BODY_BYTES = EMAIL_CONFIG.MAX_BODY_BYTES;
const MAX_NAME = 120;
const MAX_EMAIL = 254;
const MAX_SUBJECT = 200;
const MAX_MESSAGE = 5000;

type ContactBody = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  /** Honeypot field. Real visitors never fill this; bots usually do. */
  companyWebsite?: unknown;
  /** Time the form was mounted, in ms. Used to reject sub-3-second bots. */
  _t?: unknown;
};

function jsonError(status: number, error: string) {
  return NextResponse.json(
    { error },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

function getStringField(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return cleanPlainText(value, { maxLength: max, preserveNewlines: false });
}

export async function POST(request: Request) {
  // ── Same-origin POST enforcement ──────────────────────────────────
  const originGuard = assertSameOrigin(request);
  if (originGuard) return originGuard;

  // ── Rate limit (per visitor IP, stricter than chat) ──────────────
  const ip = getRequestIp(request) ?? "unknown";
  const limit = checkRateLimit(`contact:${ip}`, Date.now(), {
    perMinute: EMAIL_CONFIG.RATE_LIMIT_PER_MINUTE,
    perHour: EMAIL_CONFIG.RATE_LIMIT_PER_HOUR,
  });
  if (!limit.allowed) {
    const retryAfterSec = Math.max(1, Math.ceil(limit.retryAfterMs / 1000));
    return NextResponse.json(
      {
        error:
          limit.reason === "hour"
            ? "You've reached the contact-form limit. Please try again later or email directly."
            : "You're sending messages too quickly. Please wait a moment.",
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
  let body: ContactBody;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return jsonError(400, "Submission too large.");
    }
    body = JSON.parse(raw) as ContactBody;
  } catch {
    return jsonError(400, "Invalid JSON payload.");
  }

  if (!body || typeof body !== "object") {
    return jsonError(400, "Invalid request body.");
  }

  // Honeypot — silently accept and drop without sending anything.
  if (typeof body.companyWebsite === "string" && body.companyWebsite.trim().length > 0) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  // Time-trap — sub-3-second submissions are almost always bots.
  if (typeof body._t === "number" && Date.now() - body._t < 3000) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  const name = getStringField(body.name, MAX_NAME);
  const email = getStringField(body.email, MAX_EMAIL);
  const subject = getStringField(body.subject, MAX_SUBJECT);
  const message = cleanPlainText(
    typeof body.message === "string" ? body.message : "",
    { maxLength: MAX_MESSAGE, preserveNewlines: true },
  );

  if (!name) return jsonError(400, "Name is required.");
  if (!email) return jsonError(400, "Email is required.");
  if (!message) return jsonError(400, "Message is required.");
  if (!isLikelyEmail(email)) {
    return jsonError(400, "Please enter a valid email address.");
  }

  // ── Escape before any HTML interpolation ─────────────────────────
  const sName = escapeHtml(name);
  const sEmail = escapeHtml(email);
  const sSubject = escapeHtml(subject);
  const sMessageBlock = normalizeForPre(message, MAX_MESSAGE);
  const sMessage = escapeHtml(sMessageBlock).replace(/\n/g, "<br />");

  const receivedAt = new Date().toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });

  const senderTable = dataTable(
    dataRow("Name", sName) +
      dataRow(
        "Email",
        `<a href="mailto:${sEmail}" style="color:#ea580c;text-decoration:none;font-weight:600;">${sEmail}</a>`,
      ) +
      dataRow("Subject", sSubject || `<span style="color:#64748b;font-style:italic;">No subject</span>`) +
      dataRow("Received", `<span style="color:#475569;">${escapeHtml(receivedAt)}</span>`),
  );

  const bodyHtml = `
    ${sectionHeading("Sender")}
    ${senderTable}

    ${sectionHeading("Message")}
    ${messageBlock(sMessage)}
  `;

  const ctaHtml = ctaButton("Reply to " + name.split(" ")[0], `mailto:${sEmail}?subject=${encodeURIComponent(`Re: ${subject || "Your message"}`)}`);

  const htmlContent = emailShell({
    eyebrow: "Portfolio · Contact form",
    title: "New contact message",
    subtitle: `From ${name} — ${subject || "no subject"}`,
    preheader: `${name} just reached out: ${subject || "no subject"} — ${message.slice(0, 80)}`,
    bodyHtml,
    ctaHtml,
  });

  // ── Send via Resend ───────────────────────────────────────────────
  let resend;
  try {
    resend = getResendClient();
  } catch (err) {
    console.error("[contact] Missing Resend config:", err);
    return jsonError(503, "Email service is not configured right now.");
  }

  const fromAddress = getFromAddress();
  const toAddress = getRecipientAddress();
  const subjectLine = `Portfolio: ${subject || "New message"} from ${name}`;

  try {
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [toAddress],
      replyTo: email,
      subject: subjectLine.slice(0, 256),
      html: htmlContent,
    });

    if (error) {
      // Don't echo Resend's error message back to the visitor — log it
      // and return a generic 502.
      console.error("[contact] Resend API error:", error);
      return jsonError(
        502,
        "We couldn't send your message right now. Please try again in a moment.",
      );
    }

    return NextResponse.json({ success: true, id: data?.id ?? null });
  } catch (err) {
    console.error("[contact] Unexpected send error:", err);
    return jsonError(
      502,
      "We couldn't send your message right now. Please try again in a moment.",
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST." },
    {
      status: 405,
      headers: { Allow: "POST", "Cache-Control": "no-store" },
    },
  );
}
