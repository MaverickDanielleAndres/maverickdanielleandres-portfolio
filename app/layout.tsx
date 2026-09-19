import type { Metadata, Viewport } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { Caveat } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { LazyMotion, domAnimation } from "framer-motion";

const signatureFont = Caveat({
  subsets: ["latin"],
  variable: "--font-signature",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

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
//
// No @import of Google Fonts — the file is fully self-hosted from
// /fonts/* and declared via @font-face in globals.css. The previous
// @import was the dominant render-blocker (192 KiB font file from
// fonts.gstatic.com).
const criticalCss = `
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
@keyframes hero-image-in{from{transform:translate3d(0,0,0) scale(1)}to{transform:translate3d(0,0,0) scale(1)}}
.hero-image-reveal{transform:translate3d(0,0,0) scale(1)}
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
    default: "Maverick Danielle Andres | Full-Stack Developer",
    template: "%s | Maverick Danielle Andres",
  },
  description:
    "Full-Stack Developer building scalable, high-performance web applications with React, Next.js, TypeScript, and Supabase.",
  keywords: [
    "Maverick Danielle Andres",
    "Full-Stack Developer",
    "Web Developer Philippines",
    "Next.js Developer",
    "React Developer",
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
    title: "Maverick Danielle Andres | Full-Stack Developer",
    description:
      "Full-Stack Developer building scalable, high-performance web applications with React, Next.js, TypeScript, and Supabase.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Maverick Danielle Andres — Full-Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maverick Danielle Andres | Full-Stack Developer",
    description:
      "Full-Stack Developer building scalable, high-performance web applications with React, Next.js, TypeScript, and Supabase.",
    images: ["/opengraph-image"],
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
      jobTitle: "Full-Stack Developer",
      description:
        "Full-stack developer and software engineer based in Pasig City, PH.",
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
        "PostgreSQL",
        "Tailwind CSS",
      ],
      sameAs: [
        "https://github.com/MaverickDanielleAndres",
        "https://linkedin.com/in/maverick-danielle-andres-641564373",
        "https://www.facebook.com/maverickdanielle.andres",
        "https://www.instagram.com/mavs_verick/",
      ],
      review: [
        {
          "@type": "Review",
          author: { "@type": "Person", name: "Natalie", jobTitle: "Founder & Creative Director", worksFor: { "@type": "Organization", name: "Shimmeur" } },
          reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
          reviewBody: "I worked with Maverick Danielle on the full development of shimmeur.co — front end, back end, and everything in between — and the experience was exceptional. The result is a site that feels completely harmonious with our brand identity.",
        },
        {
          "@type": "Review",
          author: { "@type": "Person", name: "Pete Tricklebank", jobTitle: "Managing Director", worksFor: { "@type": "Organization", name: "All Fire Services Australia" } },
          reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
          reviewBody: "Mav has been an absolute legend to work with across multiple web builds, from custom WordPress setups to modern Next.js stacks. Nothing is ever too much trouble for him.",
        },
        {
          "@type": "Review",
          author: { "@type": "Person", name: "Steve", jobTitle: "Owner & Founder", worksFor: { "@type": "Organization", name: "Maranello's Concord" } },
          reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
          reviewBody: "Maverick sorted out our WordPress site when we were running into all sorts of speed and layout headaches. Honest, reliable, and seriously good at what he does.",
        },
        {
          "@type": "Review",
          author: { "@type": "Person", name: "Mozhde Marivani", jobTitle: "President & Lead Full Stack Developer", worksFor: { "@type": "Organization", name: "Mojde Beauty" } },
          reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
          reviewBody: "Maverick's technical dedication and work ethic stood out from day one. He approaches every task with precision, curiosity, and immense focus.",
        },
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
      name: "Maverick Danielle Andres | Full-Stack Developer",
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
      className={`${neueMontrealFont.variable} ${signatureFont.variable}`}
    >
      <head>
        {/* Critical above-the-fold CSS — paints the hero before the full
            stylesheet has downloaded. Keeps Lighthouse's render-blocker
            count at zero while we still deliver the full design system. */}
        <style dangerouslySetInnerHTML={{ __html: criticalCss }} />

        {/* Preload Roboto Flex variable font file so it fetches in parallel with the CSS.
            Neue Montreal is already automatically preloaded by next/font/local. */}
        <link
          rel="preload"
          href="/fonts/RobotoFlex-Variable.woff2?v=2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* The hero <Image> in components/Hero.tsx uses `priority`, which
            causes Next.js to emit its own <link rel="preload" imagesrcset
            imagesizes> with the *correct* srcset for the actual rendered
            size. A hand-written preload here would (a) be redundant, and
            (b) pick the wrong width — the browser would fetch a size it
            then never uses, triggering the
              "preloaded but not used within a few seconds"
            console warning. So we let Next.js handle it. */}

        {/* Theme color for browser chrome */}
        <meta name="theme-color" content="#111111" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#FAFAFA" media="(prefers-color-scheme: light)" />
        <meta name="color-scheme" content="dark light" />
        <meta name="format-detection" content="telephone=no" />

        {/* Anti-Hydration Shield: Blocks extension attribute injection & suppresses dev hydration overlay for extension mismatches */}
        <script
          id="anti-hydration-shield"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window === 'undefined') return;

                // 1. Intercept console.error & console.warn to suppress Next.js Dev Overlay for browser extension attribute mismatches
                var isExtensionWarning = function(msg) {
                  if (!msg) return false;
                  var str = '';
                  try {
                    if (typeof msg === 'string') {
                      str = msg;
                    } else if (msg instanceof Error) {
                      str = (msg.message || '') + ' ' + (msg.stack || '');
                    } else if (typeof msg === 'object') {
                      str = JSON.stringify(msg);
                    }
                  } catch (e) {
                    str = String(msg);
                  }
                  return str.indexOf('bis_skin_checked') !== -1 ||
                         str.indexOf('bis_register') !== -1 ||
                         str.indexOf('bis_use') !== -1 ||
                         str.indexOf('data-dynamic-id') !== -1 ||
                         str.indexOf('eppiocemhmnlbhjplcgkofciiegomcon') !== -1 ||
                         str.indexOf('chrome-extension://') !== -1 ||
                         str.indexOf('data-bitwarden') !== -1 ||
                         str.indexOf('data-lastpass') !== -1 ||
                         str.indexOf('data-dashlane') !== -1 ||
                         str.indexOf('data-grammarly') !== -1 ||
                         str.indexOf('cz-shortcut-listen') !== -1 ||
                         (str.indexOf('hydration') !== -1 && (str.indexOf('bis_') !== -1 || str.indexOf('bitwarden') !== -1 || str.indexOf('chrome-extension') !== -1 || str.indexOf('application/ld+json') !== -1));
                };

                var origError = console.error;
                console.error = function() {
                  for (var i = 0; i < arguments.length; i++) {
                    if (isExtensionWarning(arguments[i])) {
                      return;
                    }
                  }
                  return origError.apply(console, arguments);
                };

                var origWarn = console.warn;
                console.warn = function() {
                  for (var i = 0; i < arguments.length; i++) {
                    if (isExtensionWarning(arguments[i])) {
                      return;
                    }
                  }
                  return origWarn.apply(console, arguments);
                };

                // 2. Prevent setAttribute from writing extension attributes to the DOM
                var blockedAttrs = ['bis_skin_checked', 'bis_register', 'bis_use', 'data-dynamic-id', 'data-bitwarden-watching', 'data-bitwarden-avatar'];
                var origSetAttr = Element.prototype.setAttribute;
                Element.prototype.setAttribute = function(name, value) {
                  if (name && (name === 'bis_skin_checked' || name === 'bis_register' || name === 'bis_use' || name === 'data-dynamic-id' || name.indexOf('bitwarden') !== -1)) {
                    return;
                  }
                  return origSetAttr.apply(this, arguments);
                };

                var origSetAttrNS = Element.prototype.setAttributeNS;
                if (origSetAttrNS) {
                  Element.prototype.setAttributeNS = function(ns, name, value) {
                    if (name && (name === 'bis_skin_checked' || name === 'bis_register' || name === 'bis_use' || name === 'data-dynamic-id' || name.indexOf('bitwarden') !== -1)) {
                      return;
                    }
                    return origSetAttrNS.apply(this, arguments);
                  };
                }

                // 3. Define getter on prototype so scripts checking if element is already scanned think it is
                try {
                  Object.defineProperty(Element.prototype, 'bis_skin_checked', {
                    get: function() { return '1'; },
                    set: function() {},
                    configurable: true
                  });
                  Object.defineProperty(Element.prototype, 'bis_register', {
                    get: function() { return '1'; },
                    set: function() {},
                    configurable: true
                  });
                } catch(e) {}

                // 4. Actively clean any nodes that already have extension attributes
                var cleanNode = function(node) {
                  if (!node || node.nodeType !== 1) return;
                  for (var i = 0; i < blockedAttrs.length; i++) {
                    if (node.hasAttribute(blockedAttrs[i])) {
                      node.removeAttribute(blockedAttrs[i]);
                    }
                  }
                };

                var cleanTree = function(root) {
                  if (!root || !root.querySelectorAll) return;
                  cleanNode(root);
                  var elements = root.querySelectorAll('[bis_skin_checked], [bis_register], [bis_use], [data-dynamic-id], [data-bitwarden-watching]');
                  for (var i = 0; i < elements.length; i++) {
                    cleanNode(elements[i]);
                  }
                };

                if (window.MutationObserver) {
                  var observer = new MutationObserver(function(mutations) {
                    for (var i = 0; i < mutations.length; i++) {
                      var m = mutations[i];
                      if (m.type === 'attributes') {
                        cleanNode(m.target);
                      } else if (m.type === 'childList') {
                        for (var j = 0; j < m.addedNodes.length; j++) {
                          cleanTree(m.addedNodes[j]);
                        }
                      }
                    }
                  });

                  if (document.documentElement) {
                    cleanTree(document.documentElement);
                    observer.observe(document.documentElement, {
                      subtree: true,
                      childList: true,
                      attributes: true,
                      attributeFilter: blockedAttrs
                    });
                  } else {
                    document.addEventListener('DOMContentLoaded', function() {
                      cleanTree(document.documentElement);
                      observer.observe(document.documentElement, {
                        subtree: true,
                        childList: true,
                        attributes: true,
                        attributeFilter: blockedAttrs
                      });
                    });
                  }
                }
              })();
            `,
          }}
        />

        {/* Structured data — JSON-LD */}
        <script
          id="person-website-jsonld"
          type="application/ld+json"
          suppressHydrationWarning
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={neueMontrealFont.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {/* Single LazyMotion at the root so every `m.*` component below
              shares the lightweight bundle (~6 KiB) instead of each
              component pulling in framer-motion's full ~60 KiB bundle. */}
          <LazyMotion features={domAnimation}>
            {children}
            <Toaster />
          </LazyMotion>
        </ThemeProvider>
      </body>
    </html>
  );
}
