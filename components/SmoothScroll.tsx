"use client";

import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      // Lighter duration: 0.8s feels responsive without the rubber-band delay
      // of 1.2s, which was the main culprit behind wheel-input lag.
      duration: 0.8,
      // expo-out easing — fast initial acceleration, smooth settle.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      // wheelMultiplier scales the per-event scroll delta. 1 = native feel.
      wheelMultiplier: 1,
      // touchMultiplier same for trackpad/touch on mobile.
      touchMultiplier: 1.4,
    });

    lenisRef.current = lenis;

    // GSAP + ScrollTrigger are only needed because Lenis publishes a
    // "scroll" event that we forward to ScrollTrigger.update. Defer their
    // import until after first paint so they don't show up on the
    // synchronous bootstrap path (this was the source of the 132ms
    // long-task on the desktop report's chunk 10~x95jhs6ns3.js).
    let cleanup: (() => void) | undefined;
    const idle =
      (window as unknown as { requestIdleCallback?: (cb: () => void) => void })
        .requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 0));
    const handle = idle(async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      gsap.registerPlugin(ScrollTrigger);
      lenis.on("scroll", ScrollTrigger.update);
      const tickerCallback = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(tickerCallback);
      // Leave lagSmoothing ENABLED with a generous threshold so a busy
      // main thread doesn't pile up RAF callbacks and make scroll feel
      // glued to the wheel.
      gsap.ticker.lagSmoothing(500, 33);
      cleanup = () => {
        lenis.off("scroll", ScrollTrigger.update);
        gsap.ticker.remove(tickerCallback);
      };
    });

    return () => {
      if (typeof handle === "number" && (window as unknown as { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback) {
        (window as unknown as { cancelIdleCallback: (h: number) => void }).cancelIdleCallback(handle);
      } else if (typeof handle === "number") {
        clearTimeout(handle);
      }
      cleanup?.();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <div
      className="relative overflow-x-clip"
      style={{
        // Promote the scroll root to its own compositor layer so Lenis's
        // transform updates don't repaint the page background or trigger
        // layout in descendant trees.
        willChange: "transform",
        // Contain layout + paint — descendant repaints can't bleed up into
        // the scroll root.
        contain: "layout paint",
      }}
    >
      {children}
    </div>
  );
}
