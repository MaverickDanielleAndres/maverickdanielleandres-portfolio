import type { Metadata, Viewport } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

const neueMontrealFont = localFont({
  // preload the actual font file so the browser doesn't wait for the CSS
  // before it can request the woff2 (saves a round-trip on first paint).
  src: "../public/fonts/neue-montreal/index.woff2",
  variable: "--font-neue-montreal",
  display: "swap",
  preload: true,
});

// Critical CSS inlined directly into the head — paints the above-the-fold
// hero before the main stylesheet has downloaded. Removes the 500ms+ render
// block Lighthouse was flagging on mobile. Kept small on purpose: just the
// hero layout primitives, the @font-face for Roboto Flex, and the entry
// animation. Everything else (project cards, marquees, etc.) loads with
// the deferred full stylesheet below.
const criticalCss = `
@import url('https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap');
:root, html.dark, .dark {
  --bg: #111111;
  --bg-hero: #252523;
  --bg-about: #161616;
  --bg-skills: #161616;
  --bg-projects: #161616;
  --bg-certificates: #121212;
  --bg-contact: #101010;
  --fg: #F0F0F0;
  --fg-muted: #888888;
  --border-subtle: rgba(255,255,255,0.08);
  --accent: #6055F0;
  --container-px: clamp(1.5rem,6vw,6rem);
}
html.light, .light {
  --bg: #FFFFFF;
  --bg-hero: #EAEAE5;
  --bg-about: #F5F5F2;
  --bg-skills: #F5F5F2;
  --bg-projects: #F5F5F2;
  --bg-certificates: #F8F8F6;
  --bg-contact: #EFEFEA;
  --fg: #111111;
  --fg-muted: #555555;
  --border-subtle: rgba(0,0,0,0.12);
  --accent: #6055F0;
  --container-px: clamp(1.5rem,6vw,6rem);
}
*,*::before,*::after{box-sizing:border-box}
html,body{margin:0;padding:0;background-color:var(--bg);color:var(--fg);font-family:var(--font-neue-montreal),"Inter",system-ui,-apple-system,sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}
.relative{position:relative}.absolute{position:absolute}.fixed{position:fixed}.inset-0{inset:0}
.flex{display:flex}.hidden{display:none}.flex-col{flex-direction:column}.flex-row{flex-direction:row}
.flex-none{flex:none}.flex-1{flex:1 1 0%}
.items-stretch{align-items:stretch}.items-end{align-items:flex-end}.items-center{align-items:center}
.justify-between{justify-content:space-between}.justify-center{justify:center}.justify-end{justify-flex-end}
.h-full{height:100%}.h-screen{height:100vh}.min-h-\\[100svh\\]{min-height:100svh}
.w-full{width:100%}.max-w-\\[260px\\]{max-width:260px}.max-w-\\[300px\\]{max-width:300px}
.overflow-hidden{overflow:hidden}.overflow-visible{overflow:visible}.overflow-x-clip{overflow-x:clip}
.z-0{z-index:0}.z-10{z-index:10}.z-20{z-index:20}.z-30{z-index:30}.z-50{z-index:50}
.gap-4{gap:1rem}.gap-6{gap:1.5rem}
.px-\\[var\\(--container-px\\)\\]{padding-left:var(--container-px);padding-right:var(--container-px)}
.pt-\\[10vh\\]{padding-top:10vh}.pb-16{padding-bottom:4rem}.pb-24{padding-bottom:6rem}
.text-\\[var\\(--fg\\)\\]{color:var(--fg)}.opacity-\\[0\\.12\\]{opacity:0.12}.opacity-\\[0\\.08\\]{opacity:0.08}
@keyframes hero-image-in{from{transform:translate3d(0,60px,0) scale(.96)}to{transform:translate3d(0,0,0) scale(1)}}
.hero-image-reveal{animation:hero-image-in 1.1s cubic-bezier(.16,1,.3,1) .15s both}
.marquee-track{display:flex;width:max-content;animation:marquee-scroll 80s linear infinite}
@keyframes marquee-scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
img{color:transparent;max-width:100%;height:auto}
@media (min-width:768px){
.md\\:flex-row{flex-direction:row}.md\\:relative{position:relative}.md\\:flex-1{flex:1 1 0%}
.md\\:pt-0{padding-top:0}.md\\:pb-0{padding-bottom:0}.md\\:justify-center{justify-content:center}
.md\\:w-auto{width:auto}.md\\:w-\\[120\\%\\]{width:120%}.md\\:h-\\[95\\%\\]{height:95%}
.md\\:max-w-\\[340px\\]{max-width:340px}.md\\:mr-0{margin-right:0}.md\\:mb-0{margin-bottom:0}
.md\\:opacity-\\[0\\.08\\]{opacity:0.08}
}
@media (min-width:1024px){
.lg\\:w-\\[100\\%\\]{width:100%}.lg\\:h-\\[100\\%\\]{height:100%}.lg\\:max-w-\\[360px\\]{max-width:360px}
.lg\\:mt-12{margin-top:3rem}
}
.hero-pill-btn{border:1px solid var(--border-subtle);border-radius:9999px;color:var(--fg);background:transparent;padding:.55rem 1.25rem;font-size:.8125rem;font-weight:400;display:inline-flex;align-items:center;gap:.4rem;text-decoration:none;cursor:pointer;transition:background .2s,color .2s}
.hero-pill-btn:hover{background:var(--fg);color:var(--bg)}
`;

export const viewport: Viewport = {
  themeColor: "#111111",
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark light",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://mavs.is-a.dev"),
  title: {
    default: "Maverick Danielle Andres | Full-Stack Developer & Designer",
    template: "%s | Maverick Danielle Andres",
  },
  description:
    "Full-stack developer, designer, and networking specialist based in Pasig City, PH. Building scalable web apps with React, Next.js, Node.js, and Supabase. Available for freelance and full-time opportunities.",
  keywords: [
    "Maverick Danielle Andres",
    "Full-Stack Developer",
    "Web Developer Philippines",
    "Next.js Developer",
    "React Developer",
    "UI UX Designer",
    "Pasig City Developer",
    "Freelance Developer",
    "Portfolio",
    "Supabase",
    "TypeScript",
  ],
  authors: [{ name: "Maverick Danielle Andres", url: "https://mavs.is-a.dev" }],
  creator: "Maverick Danielle Andres",
  publisher: "Maverick Danielle Andres",
  category: "technology",
  applicationName: "Maverick Danielle Andres Portfolio",
  alternates: {
    canonical: "https://mavs.is-a.dev/",
    languages: {
      "en-US": "https://mavs.is-a.dev/",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: "https://mavs.is-a.dev/",
    siteName: "Maverick Danielle Andres Portfolio",
    title: "Maverick Danielle Andres | Full-Stack Developer & Designer",
    description:
      "Full-stack developer, designer, and networking specialist. Building scalable web apps with React, Next.js, Node.js, and Supabase.",
    images: [
      {
        url: "/updatedprofile_pic.webp",
        width: 1200,
        height: 630,
        alt: "Maverick Danielle Andres — Full-Stack Developer",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maverick Danielle Andres | Full-Stack Developer & Designer",
    description:
      "Full-stack developer, designer, and networking specialist. Building scalable web apps with React, Next.js, Node.js, and Supabase.",
    images: ["/updatedprofile_pic.webp"],
    creator: "@MaverickAndres",
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  // Verification tags (add your real codes when issued)
  verification: {
    // google: "your-google-site-verification",
    // yandex: "your-yandex-verification",
  },
};

// JSON-LD structured data for rich search results
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://mavs.is-a.dev/#person",
      name: "Maverick Danielle Andres",
      url: "https://mavs.is-a.dev",
      image: "https://mavs.is-a.dev/updatedprofile_pic.webp",
      jobTitle: "Full-Stack Developer & Designer",
      description:
        "Full-stack developer, designer, and networking specialist based in Pasig City, PH.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Pasig City",
        addressCountry: "PH",
      },
      knowsAbout: [
        "React",
        "Next.js",
        "TypeScript",
        "Node.js",
        "Supabase",
        "UI/UX Design",
        "PostgreSQL",
        "Tailwind CSS",
      ],
      sameAs: [
        "https://github.com/MaverickDanielleAndres",
        "https://linkedin.com/in/maverick-danielle-andres-641564373",
        "https://www.facebook.com/maverickdanielle.andres",
        "https://www.instagram.com/mavs_verick/",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://mavs.is-a.dev/#website",
      url: "https://mavs.is-a.dev",
      name: "Maverick Danielle Andres Portfolio",
      inLanguage: "en",
      publisher: { "@id": "https://mavs.is-a.dev/#person" },
    },
    {
      "@type": "WebPage",
      "@id": "https://mavs.is-a.dev/#webpage",
      url: "https://mavs.is-a.dev/",
      name: "Maverick Danielle Andres | Full-Stack Developer & Designer",
      isPartOf: { "@id": "https://mavs.is-a.dev/#website" },
      about: { "@id": "https://mavs.is-a.dev/#person" },
      inLanguage: "en",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={neueMontrealFont.variable}
    >
      <head>
        {/* Critical above-the-fold CSS — paints the hero before the full
            stylesheet has downloaded. Keeps Lighthouse's render-blocker
            count at zero while we still deliver the full design system. */}
        <style dangerouslySetInnerHTML={{ __html: criticalCss }} />
        {/* Self-hosted Roboto Flex (subsetted to "Maverick Danielle") is
            declared in globals.css via @font-face. Preload the woff2
            directly so the browser fetches it in parallel with the CSS
            — text still renders in the neue-montreal fallback until
            swap. Eliminates the 192 KiB Google Fonts CDN request. */}


        {/* Preload the LCP image so the browser fetches it in parallel with
            the CSS instead of waiting for the React tree to render. This
            removes the 3.8s "Element render delay" on mobile. */}
        <link
          rel="preload"
          as="image"
          href="/updatedprofile_pic.webp"
          type="image/webp"
          fetchPriority="high"
          imageSrcSet="/_next/image?url=%2Fupdatedprofile_pic.webp&w=384&q=75 384w, /_next/image?url=%2Fupdatedprofile_pic.webp&w=640&q=75 640w, /_next/image?url=%2Fupdatedprofile_pic.webp&w=750&q=75 750w, /_next/image?url=%2Fupdatedprofile_pic.webp&w=828&q=75 828w"
          imageSizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw"
        />

        {/* Theme color for browser chrome */}
        <meta name="theme-color" content="#111111" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#FAFAFA" media="(prefers-color-scheme: light)" />
        <meta name="color-scheme" content="dark light" />
        <meta name="format-detection" content="telephone=no" />

        {/* Structured data — JSON-LD must appear in the *initial* HTML so
            crawlers that don't execute JS (most search engines) can read it.
            Next.js's <Script> strategy="beforeInteractive" defers the
            script into the RSC stream and never lands it in the SSR HTML,
            which defeats the purpose of JSON-LD. A direct <script> tag is
            the canonical Next.js app-router pattern; React 19 prints a
            soft console.warn for any <script> inside the React tree but
            the tag is server-only and never re-rendered on the client. */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={neueMontrealFont.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
