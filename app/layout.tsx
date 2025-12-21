import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import ChatbotWrapper from "@/components/ChatbotWrapper";
import { Suspense } from "react";
import PortfolioChatbot from "@/components/PortfolioChatbot";

export const metadata: Metadata = {
  title: "Maverick Andres | Portfolio",
  description: "Full-Stack Web Developer & IT Specialist Portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Oxygen:wght@300;400;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Header />
        {children}
        
        {/* Chatbot - Lazy loaded and won't block initial render */}
        <Suspense fallback={null}>
          <PortfolioChatbot />
        </Suspense>
      </body>
    </html>
  );
}