import type { Metadata, Viewport } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import AsyncFont from "@/components/ui/AsyncFont";

const neueMontrealFont = localFont({
  // preload the actual font file so the browser doesn't wait for the CSS
  // before it can request the woff2 (saves a round-trip on first paint).
  src: "../public/fonts/neue-montreal/index.woff2",
  variable: "--font-neue-montreal",
  display: "swap",
  preload: true,
});

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
        {/* Preconnect/dns-prefetch the only 3rd-party origin the page uses.
            Roboto Flex is loaded by TextPressure; preconnect removes the
            ~750ms the Lighthouse trace spent on the TLS handshake. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

        {/* Roboto Flex used by the Hero TextPressure. Loaded via
            AsyncFont so the Google Fonts CSS is no longer render-blocking. */}
        <AsyncFont href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap" />

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

        {/* Structured data */}
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
