/**
 * POST /api/project-inquiry
 *
 * Sends a multi-step project inquiry (intent, type, budget, timeline,
 * contact preferences) to the owner via Resend.
 *
 * Defence in depth:
 *   - Same-origin POST enforcement
 *   - Sliding-window rate limit per IP (stricter than chat — inquiries
 *     are higher-friction, lower-frequency than casual chat)
 *   - Body size limit + per-field length caps
 *   - HTML escaping on every visitor-supplied field
 *   - Honeypot + time-trap for the most common bot submissions
 *   - Email / phone format validation
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
  pill,
  sectionHeading,
} from "@/lib/email/templates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const maxDuration = 30;

const MAX_BODY_BYTES = EMAIL_CONFIG.MAX_BODY_BYTES;
const MAX_NAME = 100;
const MAX_COMPANY = 150;
const MAX_EMAIL = 254;
const MAX_PHONE = 30;
const MAX_MESSAGE = 5000;

const INTENT_LABELS: Record<string, string> = {
  "build-new": "Build Something New",
  "improve-existing": "Improve Existing",
  "hire-me": "Hire Me",
  "fix-add": "Fix / Add Features",
  "seo-performance": "SEO & Performance",
  "not-sure": "Not Sure Yet",
};

const PROJECT_TYPE_LABELS: Record<string, string> = {
  website: "Website",
  "web-app": "Web App",
  "mobile-app": "Mobile App",
  "custom-system": "Custom System",
  ecommerce: "E-commerce",
  dashboard: "Dashboard / Internal Tool",
  "backend-api": "Backend / API",
  "something-else": "Something Else",
};

const BUDGET_LABELS: Record<string, string> = {
  "under-25k": "Under ₱25K",
  "25k-50k": "₱25K – ₱50K",
  "50k-100k": "₱50K – ₱100K",
  "100k-plus": "₱100K+",
  "budget-unsure": "Not sure yet",
};

const TIMELINE_LABELS: Record<string, string> = {
  asap: "ASAP",
  "2-4-weeks": "Within 2–4 weeks",
  "1-2-months": "1–2 months",
  "2-plus-months": "2+ months",
  flexible: "Flexible / Just exploring",
};

const ALLOWED_CONTACT_METHODS = new Set(["email", "phone", "messenger", "whatsapp"]);

type InquiryBody = {
  intent?: unknown;
  projectType?: unknown;
  budget?: unknown;
  timeline?: unknown;
  name?: unknown;
  contactMethod?: unknown;
  email?: unknown;
  phone?: unknown;
  company?: unknown;
  message?: unknown;
  /** Honeypot field. Real visitors never fill this; bots usually do. */
  website?: unknown;
  /** Time the form was mounted, in ms. Used to reject sub-3-second bots. */
  _t?: unknown;
};

function jsonError(status: number, message: string) {
  return NextResponse.json(
    { success: false, message },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

function lookupLabel(map: Record<string, string>, id: string, fallback: string): string {
  return map[id] ?? fallback;
}

export async function POST(request: Request) {
  // ── Same-origin POST enforcement ──────────────────────────────────
  const originGuard = assertSameOrigin(request);
  if (originGuard) return originGuard;

  // ── Rate limit ────────────────────────────────────────────────────
  const ip = getRequestIp(request) ?? "unknown";
  const limit = checkRateLimit(`inquiry:${ip}`, Date.now(), {
    perMinute: EMAIL_CONFIG.INQUIRY_RATE_LIMIT_PER_MINUTE,
    perHour: EMAIL_CONFIG.INQUIRY_RATE_LIMIT_PER_HOUR,
  });
  if (!limit.allowed) {
    const retryAfterSec = Math.max(1, Math.ceil(limit.retryAfterMs / 1000));
    return NextResponse.json(
      {
        success: false,
        message:
          limit.reason === "hour"
            ? "You've reached the inquiry limit. Please try again later or email directly."
            : "You're sending inquiries too quickly. Please wait a moment.",
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
  let body: InquiryBody;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return jsonError(400, "Submission too large.");
    }
    body = JSON.parse(raw) as InquiryBody;
  } catch {
    return jsonError(400, "Invalid JSON payload.");
  }

  if (!body || typeof body !== "object") {
    return jsonError(400, "Invalid request body.");
  }

  // Honeypot — silently accept and drop without sending anything.
  if (typeof body.website === "string" && body.website.trim().length > 0) {
    return NextResponse.json(
      { success: true, message: "Project inquiry sent successfully." },
      { status: 200 },
    );
  }

  // Time-trap — sub-3-second submissions are almost always bots.
  if (typeof body._t === "number" && Date.now() - body._t < 3000) {
    return NextResponse.json(
      { success: true, message: "Project inquiry sent successfully." },
      { status: 200 },
    );
  }

  const intent = typeof body.intent === "string" ? body.intent : "";
  const projectType = typeof body.projectType === "string" ? body.projectType : "";
  const budget = typeof body.budget === "string" ? body.budget : "";
  const timeline = typeof body.timeline === "string" ? body.timeline : "";
  const name = cleanPlainText(typeof body.name === "string" ? body.name : "", { maxLength: MAX_NAME });
  const contactMethod = typeof body.contactMethod === "string" ? body.contactMethod : "";
  const email = cleanPlainText(typeof body.email === "string" ? body.email : "", { maxLength: MAX_EMAIL });
  const phone = cleanPlainText(typeof body.phone === "string" ? body.phone : "", { maxLength: MAX_PHONE });
  const company = cleanPlainText(typeof body.company === "string" ? body.company : "", { maxLength: MAX_COMPANY });
  const message = cleanPlainText(typeof body.message === "string" ? body.message : "", {
    maxLength: MAX_MESSAGE,
    preserveNewlines: true,
  });

  if (!intent || !projectType || !budget || !timeline || !name || !contactMethod) {
    return jsonError(400, "Missing required fields.");
  }

  if (!ALLOWED_CONTACT_METHODS.has(contactMethod)) {
    return jsonError(400, "Invalid contact method.");
  }

  if (contactMethod === "email") {
    if (!email || !isLikelyEmail(email)) {
      return jsonError(400, "Invalid email address.");
    }
  } else if (contactMethod === "phone") {
    if (!phone || phone.length < 7 || phone.length > MAX_PHONE) {
      return jsonError(400, "Invalid phone number.");
    }
  }

  // ── Escape before any HTML interpolation ─────────────────────────
  const sName = escapeHtml(name);
  const sCompany = company ? escapeHtml(company) : "";
  const sEmail = email ? escapeHtml(email) : "";
  const sPhone = phone ? escapeHtml(phone) : "";
  const sMessageBlock = normalizeForPre(message, MAX_MESSAGE);
  const sMessage = escapeHtml(sMessageBlock).replace(/\n/g, "<br />");

  const intentLabel = escapeHtml(
    lookupLabel(INTENT_LABELS, intent, intent),
  );
  const typeLabel = escapeHtml(
    lookupLabel(PROJECT_TYPE_LABELS, projectType, projectType),
  );
  const budgetLabel = escapeHtml(
    lookupLabel(BUDGET_LABELS, budget, budget),
  );
  const timelineLabel = escapeHtml(
    lookupLabel(TIMELINE_LABELS, timeline, timeline),
  );

  const receivedAt = new Date().toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });

  const projectTable = dataTable(
    dataRow("Intent", pill(intentLabel, "#6055F0")) +
      dataRow("Type", typeLabel) +
      dataRow("Budget", budgetLabel) +
      dataRow("Timeline", timelineLabel),
  );

  const contactParts =
    dataRow("Name", sName) +
    (sCompany ? dataRow("Company", sCompany) : "") +
    dataRow("Preferred contact", `<span style="text-transform:capitalize;">${escapeHtml(contactMethod)}</span>`) +
    (contactMethod === "email"
      ? dataRow(
          "Email",
          `<a href="mailto:${sEmail}" style="color:#6055F0;text-decoration:none;font-weight:600;">${sEmail}</a>`,
        )
      : "") +
    (contactMethod === "phone"
      ? dataRow(
          "Phone",
          `<a href="tel:${sPhone}" style="color:#6055F0;text-decoration:none;font-weight:600;">${sPhone}</a>`,
        )
      : "") +
    dataRow("Received", `<span style="color:#94A3B8;">${escapeHtml(receivedAt)}</span>`);
  const contactTable = dataTable(contactParts);

  let bodyHtml = `
    ${sectionHeading("Project")}
    ${projectTable}

    ${sectionHeading("Contact")}
    ${contactTable}
  `;

  if (message && message.trim().length > 0) {
    bodyHtml += `
      ${sectionHeading("Additional message")}
      ${messageBlock(sMessage)}
    `;
  }

  // CTA: prefer email reply when the visitor left one; otherwise fall
  // back to a WhatsApp link so the owner can reach out fast.
  const firstName = name.split(/\s+/)[0] || name;
  let ctaHtml = "";
  if (contactMethod === "email" && email) {
    const replySubject = encodeURIComponent(
      `Re: Project inquiry — ${lookupLabel(PROJECT_TYPE_LABELS, projectType, projectType)}`,
    );
    ctaHtml = ctaButton(`Reply to ${firstName}`, `mailto:${email}?subject=${replySubject}`);
  } else if (contactMethod === "phone" && phone) {
    ctaHtml = ctaButton(`Call ${firstName}`, `tel:${phone}`);
  } else {
    ctaHtml = ctaButton("Open portfolio inbox", `mailto:${process.env.PROJECT_INQUIRY_EMAIL || "maverickdanielle@gmail.com"}`);
  }

  const htmlContent = emailShell({
    eyebrow: "Portfolio · Project inquiry",
    title: "New project inquiry",
    subtitle: `${name} — ${lookupLabel(PROJECT_TYPE_LABELS, projectType, projectType)}`,
    preheader: `${name} wants to ${lookupLabel(INTENT_LABELS, intent, intent).toLowerCase()} a ${lookupLabel(PROJECT_TYPE_LABELS, projectType, projectType).toLowerCase()}.`,
    bodyHtml,
    ctaHtml,
  });

  // ── Send via Resend ───────────────────────────────────────────────
  let resend;
  try {
    resend = getResendClient();
  } catch (err) {
    console.error("[project-inquiry] Missing Resend config:", err);
    return jsonError(503, "Email service is not configured right now.");
  }

  const fromAddress = getFromAddress();
  const toAddress = getRecipientAddress();
  const subject = `New Project Inquiry — ${name} — ${lookupLabel(PROJECT_TYPE_LABELS, projectType, projectType)}`.slice(0, 256);

  try {
    const { error } = await resend.emails.send({
      from: fromAddress,
      to: toAddress,
      ...(contactMethod === "email" ? { replyTo: email } : {}),
      subject,
      html: htmlContent,
    });

    if (error) {
      console.error("[project-inquiry] Resend API error:", error);
      return jsonError(
        502,
        "We couldn't send your inquiry right now. Please try again in a moment.",
      );
    }

    return NextResponse.json(
      { success: true, message: "Project inquiry sent successfully." },
      { status: 200 },
    );
  } catch (err) {
    console.error("[project-inquiry] Unexpected send error:", err);
    return jsonError(
      502,
      "We couldn't send your inquiry right now. Please try again in a moment.",
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { success: false, message: "Method not allowed. Use POST." },
    {
      status: 405,
      headers: { Allow: "POST", "Cache-Control": "no-store" },
    },
  );
}
