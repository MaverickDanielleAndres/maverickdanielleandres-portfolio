"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function OverlapWrapper({
  children,
  zIndex,
  bg = "var(--bg)",
  shadowClassName = "shadow-2xl",
  parallax = false,
  sticky = false,
}: {
  children: React.ReactNode;
  zIndex: number;
  bg?: string;
  shadowClassName?: string;
  /** Enable scroll-driven parallax on this section. Off by default to reduce scroll listeners. */
  parallax?: boolean;
  sticky?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Only attach scroll listeners when parallax is explicitly enabled AND
  // user hasn't opted out of motion. Avoids 7× simultaneous useScroll overhead.
  const shouldAnimate = parallax && !prefersReducedMotion;

  const { scrollYProgress } = useScroll({
    target: shouldAnimate ? ref : undefined,
    offset: ["end end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0vh", "20vh"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.6]);

  // ── Parallax path: framer-motion `motion.div` driving `transform` & `opacity`.
  // ── Non-parallax path: plain `<div>` so framer-motion's per-frame style
  //    pipeline never runs for these sections. With 7 wrappers on the page,
  //    the saved work per scroll tick is meaningful.
  if (shouldAnimate) {
    return (
      <div
        ref={ref}
        className={cn(
          "w-full",
          sticky ? "sticky top-0 h-screen overflow-hidden" : "relative"
        )}
      >
        <motion.div
          style={{
            y,
            opacity,
            zIndex,
            position: "relative",
            background: bg,
            // Promote to its own compositor layer — parallax is the one path
            // where we know transform will animate every frame.
            willChange: "transform",
          }}
          className={cn("w-full", sticky ? "h-screen" : "", shadowClassName)}
        >
          {children}
        </motion.div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn(
        "w-full",
        sticky ? "sticky top-0 h-screen overflow-hidden" : "relative"
      )}
      style={{ zIndex, contain: "layout paint" }}
    >
      <div
        className={cn("w-full", sticky ? "h-screen" : "", shadowClassName)}
        style={{ position: "relative", background: bg }}
      >
        {children}
      </div>
    </div>
  );
}