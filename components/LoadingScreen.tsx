"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import MetaBalls from "@/components/ui/MetaBalls";

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const t = setTimeout(() => {
      onComplete();
    }, 2400);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <motion.div
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 overflow-hidden flex items-center justify-center bg-[#111111]"
      style={{ zIndex: 9999, position: "fixed" }}
    >
      <div style={{ position: "absolute", inset: 0 }}>
        <MetaBalls
          color="#ffffff"
          cursorBallColor="#ffffff"
          cursorBallSize={2}
          ballCount={15}
          animationSize={30}
          enableMouseInteraction={true}
          enableTransparency={true}
          hoverSmoothness={0.15}
          clumpFactor={1}
          speed={0.3}
        />
      </div>
      {/* Ensure preloaded font is marked as used immediately to silence browser warnings */}
      <span className="sr-only" style={{ fontFamily: 'var(--font-neue-montreal)' }}>
        Loading Maverick Danielle Portfolio
      </span>
    </motion.div>
  );
}

