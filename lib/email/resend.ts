/**
 * Server-side Resend client and shared email configuration.
 *
 * Server-only — never import from a client component.
 *
 * Provides:
 *   - A singleton `Resend` client (cached across requests in production)
 *   - A `requireResendConfig()` helper that throws on missing config so
 *     route handlers can surface a clear 503 instead of silently sending
 *     to a test inbox.
 *   - Sensible defaults for the portfolio's "from" address.
 */

import { Resend } from "resend";

type ResendClient = Resend;

declare global {
  var __portfolioResendClient: ResendClient | undefined;
}

/** Fallback used when RESEND_FROM_EMAIL is unset. Resend's sandbox
 *  domain `onboarding@resend.dev` only delivers to the account owner,
 *  so real visitors' inquiries will be lost — we log a warning at
 *  boot. */
const SANDBOX_FROM = "onboarding@resend.dev";

/** Hard fallback for the recipient. Should match PROJECT_INQUIRY_EMAIL
 *  in `.env.local`; this only fires when both env vars are missing. */
const DEFAULT_RECIPIENT = "maverickdanielle@gmail.com";

export function getResendClient(): ResendClient {
  if (globalThis.__portfolioResendClient) {
    return globalThis.__portfolioResendClient;
  }
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY is not set. Add it to .env.local to enable email sending.",
    );
  }
  globalThis.__portfolioResendClient = new Resend(apiKey);
  return globalThis.__portfolioResendClient;
}

/** Resolved `from` address. Prefers RESEND_FROM_EMAIL. Logs a warning
 *  when falling back to the Resend sandbox domain. */
export function getFromAddress(): string {
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  if (from) return from;
  if (process.env.NODE_ENV !== "test") {
    console.warn(
      "[email] RESEND_FROM_EMAIL is not set — falling back to Resend's sandbox domain. Visitor emails may not be delivered outside the Resend account owner.",
    );
  }
  return SANDBOX_FROM;
}

/** Resolve the recipient. PROJECT_INQUIRY_EMAIL is preferred so the
 *  owner can route contact-form and inquiry-form messages separately
 *  if desired. */
export function getRecipientAddress(): string {
  return (
    process.env.PROJECT_INQUIRY_EMAIL?.trim() ||
    process.env.RESEND_FROM_EMAIL?.trim() ||
    DEFAULT_RECIPIENT
  );
}

export const EMAIL_CONFIG = {
  MAX_BODY_BYTES: 16_000,
  RATE_LIMIT_PER_MINUTE: 5,
  RATE_LIMIT_PER_HOUR: 30,
  // Stricter cap on the project-inquiry flow because it produces more
  // downstream work (calendar booking, quote drafting).
  INQUIRY_RATE_LIMIT_PER_MINUTE: 3,
  INQUIRY_RATE_LIMIT_PER_HOUR: 20,
} as const;
