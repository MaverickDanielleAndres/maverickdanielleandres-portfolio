"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function OverlapWrapper({
  children,
  zIndex,
}: {
  children: React.ReactNode;
  zIndex: number;
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
    <motion.div
      ref={ref}
      style={{
        y,
        opacity,
        zIndex,
        position: "relative",
        background: "var(--bg)", // ensures solid background so it covers previous sections
      }}
      className="shadow-2xl"
    >
      {children}
    </motion.div>
  );
}
