/**
 * In-memory sliding-window rate limiter.
 *
 * Two windows per key (e.g. "chat:1.2.3.4", "contact:1.2.3.4"):
 *   - per-minute:  N requests
 *   - per-hour:    M requests
 *
 * Keys are stored in an LRU capped at 5 000 entries so a flood of
 * spoofed IPs cannot exhaust server memory.
 *
 * Server-only — do not import from a client component.
 */

const DEFAULT_PER_MINUTE = 10;
const DEFAULT_PER_HOUR = 80;
const MINUTE_MS = 60_000;
const HOUR_MS = 3_600_000;
const MAX_KEYS = 5_000;

type Bucket = number[]; // ascending timestamps in ms

const buckets = new Map<string, Bucket>();

function trimBucket(bucket: Bucket, windowMs: number, now: number): void {
  const cutoff = now - windowMs;
  let i = 0;
  while (i < bucket.length && bucket[i] < cutoff) i++;
  if (i > 0) bucket.splice(0, i);
}

function enforceLruCap(): void {
  if (buckets.size <= MAX_KEYS) return;
  const over = buckets.size - MAX_KEYS;
  let removed = 0;
  for (const key of buckets.keys()) {
    if (removed >= over + 500) break;
    buckets.delete(key);
    removed++;
  }
}

export type RateLimitOptions = {
  /** Per-minute cap. Defaults to 10. */
  perMinute?: number;
  /** Per-hour cap. Defaults to 80. */
  perHour?: number;
};

export type RateLimitResult = {
  allowed: boolean;
  retryAfterMs: number;
  reason: "ok" | "minute" | "hour";
};

export function checkRateLimit(
  key: string,
  now: number = Date.now(),
  options: RateLimitOptions = {},
): RateLimitResult {
  const perMinute = options.perMinute ?? DEFAULT_PER_MINUTE;
  const perHour = options.perHour ?? DEFAULT_PER_HOUR;

  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = [];
    buckets.set(key, bucket);
  }

  trimBucket(bucket, HOUR_MS, now);

  if (bucket.length >= perHour) {
    const retryAfter = (bucket[0] ?? now) + HOUR_MS - now;
    return { allowed: false, retryAfterMs: Math.max(retryAfter, 0), reason: "hour" };
  }

  let minuteCount = 0;
  for (const ts of bucket) {
    if (now - ts < MINUTE_MS) minuteCount++;
  }

  if (minuteCount >= perMinute) {
    const oldestInMinute = bucket.find((ts) => now - ts < MINUTE_MS) ?? now;
    const retryAfter = oldestInMinute + MINUTE_MS - now;
    return { allowed: false, retryAfterMs: Math.max(retryAfter, 0), reason: "minute" };
  }

  bucket.push(now);
  enforceLruCap();
  return { allowed: true, retryAfterMs: 0, reason: "ok" };
}

/**
 * Best-effort visitor IP from common proxy headers.
 *
 * Trust order: Cloudflare (CF-Connecting-IP) > first X-Forwarded-For hop >
 * X-Real-IP > null. Returns null when no header is set so the caller can
 * decide whether to drop the request or attribute it to "unknown".
 */
export function getRequestIp(request: Request): string | null {
  const cf = request.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();

  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }

  const xri = request.headers.get("x-real-ip");
  if (xri) return xri.trim();

  return null;
}
