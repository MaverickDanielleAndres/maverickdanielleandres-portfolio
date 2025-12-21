"use client";

import { Suspense, lazy } from "react";

// Lazy load chatbot to not impact initial page load
const PortfolioChatbot = lazy(() => import("@/components/PortfolioChatbot"));

export default function ChatbotWrapper() {
  return (
    <Suspense fallback={null}>
      <PortfolioChatbot />
    </Suspense>
  );
}
