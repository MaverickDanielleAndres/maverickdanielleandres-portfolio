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
  // user hasn't opted out of motion. Avoids 8× simultaneous useScroll overhead.
  const shouldAnimate = parallax && !prefersReducedMotion;

  const { scrollYProgress } = useScroll({
    target: shouldAnimate ? ref : undefined,
    offset: ["end end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0vh", "20vh"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.6]);

  return (
    <div ref={ref} className={cn("w-full", sticky ? "sticky top-0 h-screen overflow-hidden" : "relative")}>
      <motion.div
        style={{
          y: shouldAnimate ? y : undefined,
          opacity: shouldAnimate ? opacity : undefined,
          zIndex,
          position: "relative",
          background: bg,
        }}
        className={cn("w-full", sticky ? "h-screen" : "", shadowClassName)}
      >
        {children}
      </motion.div>
    </div>
  );
}
