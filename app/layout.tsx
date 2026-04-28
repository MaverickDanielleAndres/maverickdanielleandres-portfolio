import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Offcanvas } from "@/components/Offcanvas";
import { Toaster } from "@/components/ui/sonner";

const neueMontrealFont = localFont({
  src: "../public/fonts/neue-montreal/index.woff2",
  variable: "--font-neue-montreal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Maverick Danielle | Portfolio",
  description:
    "Full-stack developer, designer, and networking specialist. Explore my projects, skills, and certificates.",
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
        </ThemeProvider>
      </body>
    </html>
  );
}
