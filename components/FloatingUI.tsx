"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Offcanvas } from "@/components/Offcanvas";

const GlobalInquiry = dynamic(
  () => import("@/components/GlobalInquiry"),
  { ssr: false, loading: () => null }
);
const PortfolioChat = dynamic(
  () => import("@/components/portfolio-chat/portfolio-chat"),
  { ssr: false, loading: () => null }
);

export default function FloatingUI() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Instant wake-up if user triggers inquiry or chat modal
    const onTrigger = () => setMounted(true);
    window.addEventListener("open-inquiry-modal", onTrigger, { once: true });
    window.addEventListener("open-chat-modal", onTrigger, { once: true });

    // Mount when browser main thread is idle
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const id = (window as any).requestIdleCallback(() => setMounted(true), { timeout: 2500 });
      return () => {
        (window as any).cancelIdleCallback?.(id);
        window.removeEventListener("open-inquiry-modal", onTrigger);
        window.removeEventListener("open-chat-modal", onTrigger);
      };
    } else {
      const timer = setTimeout(() => setMounted(true), 2000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("open-inquiry-modal", onTrigger);
        window.removeEventListener("open-chat-modal", onTrigger);
      };
    }
  }, []);

  return (
    <>
      <Offcanvas />
      {mounted && (
        <>
          <GlobalInquiry />
          <PortfolioChat />
        </>
      )}
    </>
  );
}

