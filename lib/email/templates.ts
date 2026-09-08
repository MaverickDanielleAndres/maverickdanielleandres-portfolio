/**
 * Shared HTML email templates for the portfolio's contact + project
 * inquiry forms.
 *
 * Design goals:
 *   - Mobile-first, single column up to 600 px
 *   - High-contrast text on light backgrounds (works in Gmail, Apple Mail,
 *     Outlook web/desktop, mobile clients)
 *   - Semantic structure (h1 → sections → data rows)
 *   - Accessible labels and large tap targets
 *   - No external CSS or JS — works in clients that strip them
 *   - Inline CSS only — many clients ignore <style> tags in <head>
 *
 * Server-only — never import from a client component.
 */

const COLORS = {
  // Match the portfolio's accent (CSS variable --accent) with a fallback
  // that survives email-client CSS stripping.
  accent: "#f97316", // orange-500
  accentDark: "#ea580c", // orange-600
  ink: "#0f172a", // slate-900
  inkMuted: "#475569", // slate-600
  inkSubtle: "#64748b", // slate-500
  divider: "#e2e8f0", // slate-200
  bgSubtle: "#f8fafc", // slate-50
  bgPanel: "#ffffff",
  bgShell: "#f1f5f9", // slate-100
  success: "#16a34a", // green-600
} as const;

const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

/** Wraps an email body in the outer shell (header, container, footer). */
export function emailShell(opts: {
  eyebrow: string;
  title: string;
  subtitle: string;
  preheader?: string;
  bodyHtml: string;
  ctaHtml?: string;
}): string {
  const preheader =
    opts.preheader ??
    `${opts.title} — message from your portfolio contact form.`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>${escapeForHtml(opts.title)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:${COLORS.bgShell};font-family:${FONT_STACK};color:${COLORS.ink};-webkit-font-smoothing:antialiased;">
    <!-- Preheader (hidden in body, surfaced by clients as preview text) -->
    <span style="display:none;visibility:hidden;mso-hide:all;font-size:1px;color:${COLORS.bgShell};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escapeForHtml(preheader)}</span>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:${COLORS.bgShell};">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;background-color:${COLORS.bgPanel};border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(15,23,42,0.06);">

            <!-- Header band -->
            <tr>
              <td style="background:linear-gradient(135deg,${COLORS.accent} 0%,${COLORS.accentDark} 100%);padding:28px 32px;color:#ffffff;">
                <p style="margin:0;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;font-weight:600;opacity:0.85;">${escapeForHtml(opts.eyebrow)}</p>
                <h1 style="margin:6px 0 0;font-size:24px;line-height:1.2;font-weight:700;letter-spacing:-0.01em;">${escapeForHtml(opts.title)}</h1>
                <p style="margin:8px 0 0;font-size:14px;line-height:1.5;opacity:0.92;">${escapeForHtml(opts.subtitle)}</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:28px 32px 8px;">
                ${opts.bodyHtml}
              </td>
            </tr>

            ${opts.ctaHtml ? `
            <tr>
              <td style="padding:8px 32px 28px;">
                ${opts.ctaHtml}
              </td>
            </tr>
            ` : ""}

            <!-- Footer -->
            <tr>
              <td style="padding:18px 32px 24px;border-top:1px solid ${COLORS.divider};background-color:${COLORS.bgSubtle};">
                <p style="margin:0;font-size:12px;line-height:1.5;color:${COLORS.inkSubtle};">
                  Sent from your portfolio · Mavs Portfolio Assistant
                </p>
                <p style="margin:6px 0 0;font-size:11px;color:${COLORS.inkSubtle};">
                  Reply directly to this email to respond to the visitor.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** Renders a labelled key/value data row inside an email body. */
export function dataRow(label: string, valueHtml: string): string {
  return `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid ${COLORS.divider};color:${COLORS.inkSubtle};font-size:13px;width:36%;vertical-align:top;font-weight:600;letter-spacing:0.02em;">
        ${escapeForHtml(label)}
      </td>
      <td style="padding:10px 12px;border-bottom:1px solid ${COLORS.divider};color:${COLORS.ink};font-size:14px;line-height:1.55;vertical-align:top;">
        ${valueHtml}
      </td>
    </tr>`;
}

/** Renders a small uppercase section heading used between data groups. */
export function sectionHeading(label: string): string {
  return `
    <h2 style="margin:24px 0 12px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.16em;color:${COLORS.accentDark};">
      ${escapeForHtml(label)}
    </h2>`;
}

/** Wraps a data table in a consistent <table> shell. */
export function dataTable(rowsHtml: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;background-color:${COLORS.bgPanel};border:1px solid ${COLORS.divider};border-radius:10px;overflow:hidden;">
      ${rowsHtml}
    </table>`;
}

/** A subtle pill — used for status tags like "New" or "Strata". */
export function pill(label: string, color: string = COLORS.accent): string {
  return `<span style="display:inline-block;padding:3px 10px;background-color:${color};color:#ffffff;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;border-radius:999px;">${escapeForHtml(label)}</span>`;
}

/** Renders a call-to-action button. Falls back to a text link in
 *  clients that strip <a> styling. */
export function ctaButton(label: string, href: string, color: string = COLORS.accent): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td align="left">
          <a href="${escapeAttr(href)}" target="_blank" rel="noopener noreferrer"
             style="display:inline-block;padding:12px 22px;background-color:${color};color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;border-radius:10px;letter-spacing:0.01em;">
            ${escapeForHtml(label)}
          </a>
        </td>
      </tr>
    </table>`;
}

/** Renders the message body as a <pre>-like block but without using
 *  <pre> (which clients style inconsistently). */
export function messageBlock(messageHtml: string): string {
  return `
    <div style="background-color:${COLORS.bgSubtle};border:1px solid ${COLORS.divider};border-radius:10px;padding:18px 20px;margin-top:6px;color:${COLORS.ink};font-size:14px;line-height:1.65;white-space:normal;">
      ${messageHtml}
    </div>`;
}

/** Escape for safe HTML body interpolation. Delegates to the shared
 *  helper in sanitize.ts when possible. */
function escapeForHtml(input: string): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Escape for safe HTML attribute interpolation. */
function escapeAttr(input: string): string {
  return escapeForHtml(input);
}
