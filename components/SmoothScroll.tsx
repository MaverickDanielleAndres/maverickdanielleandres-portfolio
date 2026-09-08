"use client";

import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Store the ticker callback in a variable so cleanup can remove the exact same reference.
    // Previously, the cleanup created a new anonymous function which never matched
    // the original — causing a memory/animation leak.
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);

    // Leave lagSmoothing ENABLED with a generous threshold. The previous
    // `gsap.ticker.lagSmoothing(0)` disabled the browser's frame-skip
    // protection — when the page was busy, Lenis kept firing RAFs and the
    // scroll felt glued to the wheel. Now: if a frame takes >200ms we skip
    // the catch-up ticks, the next frame snaps to the current scrollY, and
    // the user sees the page catch up instantly instead of stuttering.
    gsap.ticker.lagSmoothing(500, 33);

    return () => {
      lenis.destroy();
      // Remove the exact same callback reference to properly deregister
      gsap.ticker.remove(tickerCallback);
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
