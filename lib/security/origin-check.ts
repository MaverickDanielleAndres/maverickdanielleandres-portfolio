/**
 * Same-origin POST enforcement.
 *
 * Browsers send an `Origin` header on cross-origin POSTs that cannot be
 * spoofed from JavaScript. We compare it to the request's own host so a
 * simple curl with a forged `Host` (or a misconfigured proxy) cannot
 * trick our endpoints into running on behalf of an attacker site.
 *
 * Behaviour:
 *   - GET / HEAD / OPTIONS pass through.
 *   - POST / PUT / DELETE require Origin to match the request host.
 *   - Missing Origin (e.g. server-to-server curl with no Origin header)
 *     is treated as same-origin so legitimate health checks still work.
 *
 * Returns `null` when the request is acceptable, or a `NextResponse` with
 * status 403 otherwise.
 */

import { NextResponse } from "next/server";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function getRequestHost(request: Request): string | null {
  try {
    return new URL(request.url).host;
  } catch {
    return null;
  }
}

function getOriginFromRequest(request: Request): string | null {
  const origin = request.headers.get("origin");
  if (origin) return origin;
  const referer = request.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).origin;
    } catch {
      // Malformed referer — fall through.
    }
  }
  return null;
}

function safeOriginHost(origin: string): string | null {
  try {
    return new URL(origin).host;
  } catch {
    return null;
  }
}

export function assertSameOrigin(request: Request): NextResponse | null {
  const method = request.method.toUpperCase();
  if (SAFE_METHODS.has(method)) return null;

  // Browsers always send Origin on cross-origin POSTs. If Origin is
  // missing we treat it as same-origin (e.g. server-to-server curls,
  // same-origin form posts in older browsers).
  const origin = getOriginFromRequest(request);
  if (!origin) return null;

  const host = getRequestHost(request);
  if (!host) return null;

  // Compare host only (allow http/https mismatch behind local proxies).
  const originHost = safeOriginHost(origin);
  if (originHost && originHost === host) return null;

  return NextResponse.json(
    { error: "Cross-origin requests are not allowed." },
    { status: 403 },
  );
}
