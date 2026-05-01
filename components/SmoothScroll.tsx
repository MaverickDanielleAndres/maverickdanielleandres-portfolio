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
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
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
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      // Remove the exact same callback reference to properly deregister
      gsap.ticker.remove(tickerCallback);
      lenisRef.current = null;
    };
  }, []);

  return <div className="relative overflow-x-hidden">{children}</div>;
}
