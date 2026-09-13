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

    // Suspend the rAF loop when Lenis isn't actively animating anything.
    // Without this, the loop runs at 60Hz forever and burns CPU even when
    // the user isn't scrolling. We re-arm on scroll/wheel/touch events.
    let rafId: number | null = null;

    const arm = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(loop);
    };
    function loop(time: number) {
      rafId = null;
      lenis.raf(time);
      // Keep the rAF chain alive while Lenis is animating (momentum,
      // smooth scroll interpolation). When it settles, we sleep until
      // the next user input re-arms us.
      if (lenis.isScrolling) {
        rafId = requestAnimationFrame(loop);
      } else {
        rafId = null;
      }
    }
    rafId = requestAnimationFrame(loop);

    const wake = () => arm();
    lenis.on("scroll", wake);
    window.addEventListener("wheel", wake, { passive: true });
    window.addEventListener("touchstart", wake, { passive: true });
    window.addEventListener("keydown", wake);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      lenis.off("scroll", wake);
      window.removeEventListener("wheel", wake);
      window.removeEventListener("touchstart", wake);
      window.removeEventListener("keydown", wake);
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
