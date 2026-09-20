"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Offcanvas } from "@/components/Offcanvas";
import GlobalInquiry from "@/components/GlobalInquiry";

const PortfolioChat = dynamic(
  () => import("@/components/portfolio-chat/portfolio-chat"),
  { ssr: false, loading: () => null }
);

export default function FloatingUI() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Instant wake-up if user triggers chat modal
    const onTrigger = () => setMounted(true);
    window.addEventListener("open-chat-modal", onTrigger, { once: true });

    // Mount when browser main thread is idle
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const id = (window as any).requestIdleCallback(() => setMounted(true), { timeout: 2500 });
      return () => {
        (window as any).cancelIdleCallback?.(id);
        window.removeEventListener("open-chat-modal", onTrigger);
      };
    } else {
      const timer = setTimeout(() => setMounted(true), 2000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("open-chat-modal", onTrigger);
      };
    }
  }, []);

  return (
    <>
      <Offcanvas />
      <GlobalInquiry />
      {mounted && <PortfolioChat />}
    </>
  );
}

