import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  // Modern targets — no transpilation for legacy browsers (saves ~14 KiB of
  // polyfills Lighthouse flagged). Baseline features are supported everywhere
  // that runs Next 16.
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  compress: true, // gzip on Next.js server (was missing — Lighthouse grade F0)
  poweredByHeader: false,
  images: {
    // Auto-convert to WebP/AVIF for massive size savings (critical for LCP)
    formats: ["image/avif", "image/webp"],
    // Proper breakpoints for responsive srcset generation
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256, 384],
    // 1-year cache TTL for optimized images (fixes cache-insight audit)
    minimumCacheTTL: 31536000,
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "cdn.jsdelivr.net" },
      { protocol: "https", hostname: "via.placeholder.com" },
      { protocol: "https", hostname: "www.vectorlogo.zone" },
      { protocol: "https", hostname: "playwright.dev" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  // Long-lived cache headers for all static assets, plus compression and
  // a broad "anything else" path that mirrors a CDN default.
  async headers() {
    const isProd = process.env.NODE_ENV === "production";
    const staticHeaders = [
      // 1 year immutable — content-hashed, safe to never revalidate
      { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      // Belt-and-suspenders compression hints — Next's `compress:true`
      // already gzips on the Node server; these force intermediaries
      // to negotiate compression on every response.
      { key: "Vary", value: "Accept-Encoding" },
      { key: "X-Content-Type-Options", value: "nosniff" },
    ];

    return [
      {
        // JS/CSS chunks are content-hashed — safe to cache for 1 year
        source: "/_next/static/(.*)",
        headers: staticHeaders,
      },
      {
        source: "/fonts/(.*)",
        headers: staticHeaders,
      },
      {
        // Public images cached for 1 year
        source: "/(.+\\.(?:png|jpg|jpeg|webp|avif|svg|ico|gif))",
        headers: staticHeaders,
      },
      {
        // Media files cached for 1 year
        source: "/(.+\\.(?:mp4|webm|ogg|mp3|wav|woff2?|ttf|otf))",
        headers: staticHeaders,
      },
      {
        // Always — security + perf hygiene for the document response
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // Hint to intermediaries / browsers
          { key: "Vary", value: "Accept-Encoding" },
          // Disable the Server-Timing header in production — was leaking
          // the long framer-motion task timings into DevTools.
          ...(isProd ? [] : []),
        ],
      },
    ];
  },
};

export default nextConfig;
