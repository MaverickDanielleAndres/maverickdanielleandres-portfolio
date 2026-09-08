/**
 * HTML / plain-text escaping helpers for safe interpolation into email
 * templates.
 *
 * Server-only — never import from a client component.
 *
 * Visitor-supplied content must ALWAYS be escaped before being placed
 * inside an HTML attribute or body, or before being inserted into a
 * plain-text context that downstream tooling might render as HTML.
 */

const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Escape characters that have special meaning in HTML. */
export function escapeHtml(input: string): string {
  if (typeof input !== "string") return "";
  return input.replace(/[&<>"']/g, (ch) => HTML_ESCAPE_MAP[ch] ?? ch);
}

/**
 * Collapse interior whitespace and strip ASCII control characters.
 *
 * Use for plain-text subjects and previews where extra spaces and
 * line-break abuse would degrade deliverability.
 */
export function cleanPlainText(
  input: string,
  options: { maxLength?: number; preserveNewlines?: boolean } = {},
): string {
  if (typeof input !== "string") return "";
  const { maxLength, preserveNewlines = false } = options;
  // Strip ASCII control characters (0x00–0x08, 0x0B, 0x0C, 0x0E–0x1F and 0x7F)
  // but preserve \n (\x0A) and \r (\x0D) when preserveNewlines is true.
  const stripped = preserveNewlines
    ? input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    : input.replace(/[\x00-\x1F\x7F]/g, "");
  let text = preserveNewlines
    ? stripped.replace(/[ \t]+/g, " ")
    : stripped.replace(/\s+/g, " ");
  text = text.trim();
  if (maxLength !== undefined && text.length > maxLength) {
    text = text.slice(0, maxLength);
  }
  return text;
}

/**
 * Normalize line endings and trim each line so pasted-from-PDF content
 * doesn't blow up the HTML <pre> block.
 */
export function normalizeForPre(input: string, maxLength = 5000): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .slice(0, maxLength);
}

/**
 * RFC 5322-lite email validation. Matches the common "good enough" cases
 * (no quoted local-part, no IP-literal domain) and rejects obvious
 * garbage. Use as a sanity check before sending — not as a deliverability
 * guarantee.
 */
export function isLikelyEmail(input: string): boolean {
  if (typeof input !== "string") return false;
  const trimmed = input.trim();
  if (trimmed.length === 0 || trimmed.length > 254) return false;
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/.test(
    trimmed,
  );
}
