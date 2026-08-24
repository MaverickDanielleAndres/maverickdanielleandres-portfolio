import type { Metadata, Viewport } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Offcanvas } from "@/components/Offcanvas";
import { Toaster } from "@/components/ui/sonner";
import PortfolioChat from "@/components/portfolio-chat/portfolio-chat";

const neueMontrealFont = localFont({
  src: "../public/fonts/neue-montreal/index.woff2",
  variable: "--font-neue-montreal",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#111111",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://maverickdanielleandres.vercel.app"),
  title: "Maverick Danielle Andres | Full-Stack Developer & Designer",
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
  ],
  authors: [{ name: "Maverick Danielle Andres" }],
  creator: "Maverick Danielle Andres",
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
    url: "https://maverickdanielleandres.vercel.app/",
    siteName: "Maverick Danielle Andres Portfolio",
    title: "Maverick Danielle Andres | Full-Stack Developer & Designer",
    description:
      "Full-stack developer, designer, and networking specialist. Building scalable web apps with React, Next.js, Node.js, and Supabase.",
    images: [
      {
        url: "/updatedprofile_pic.webp",
        width: 800,
        height: 900,
        alt: "Maverick Danielle Andres",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maverick Danielle Andres | Full-Stack Developer & Designer",
    description:
      "Full-stack developer, designer, and networking specialist. Building scalable web apps with React, Next.js, Node.js, and Supabase.",
    images: ["/updatedprofile_pic.webp"],
  },
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
      <body className={neueMontrealFont.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <Offcanvas />
          {children}
          <Toaster />
          <PortfolioChat />
        </ThemeProvider>
      </body>
    </html>
  );
}
