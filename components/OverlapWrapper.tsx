"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export default function OverlapWrapper({
  children,
  zIndex,
  bg = "var(--bg)",
  shadowClassName = "shadow-2xl",
}: {
  children: React.ReactNode;
  zIndex: number;
  bg?: string;
  shadowClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["end end", "end start"],
  });

  // Move this section slightly down as the next section scrolls up over it
  const y = useTransform(scrollYProgress, [0, 1], ["0vh", "20vh"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.6]);

  return (
    <div ref={ref} className="relative w-full">
      <motion.div
        style={{
          y,
          opacity,
          zIndex,
          position: "relative",
          background: bg, // ensures solid background so it covers previous sections
        }}
        className={cn("w-full", shadowClassName)}
      >
        {children}
      </motion.div>
    </div>
  );
}
