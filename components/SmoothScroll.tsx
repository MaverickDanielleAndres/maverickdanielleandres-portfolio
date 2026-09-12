"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Detect mobile touch devices — mobile users should get native 120Hz hardware momentum scrolling
    const isTouch =
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0) &&
      window.innerWidth < 1024;

    if (isTouch) {
      // On mobile screens, rely on native GPU-composited momentum scrolling
      return;
    }

    const lenis = new Lenis({
      duration: 0.35,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 0,
      syncTouch: false,
    });

    lenisRef.current = lenis;

    // Standard Lenis rAF loop. We tried an idle-pause optimization that
    // would release the main thread when the user wasn't scrolling, but
    // the resume-on-scroll logic raced with Lenis's own onMount "scroll"
    // event and left the page frozen. The plain 60Hz loop is the safest
    // baseline; idle-pause belongs in a future change after we've added
    // page-level instrumentation to validate the resume path.
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <div className="relative overflow-x-clip">
      {children}
    </div>
  );
}
