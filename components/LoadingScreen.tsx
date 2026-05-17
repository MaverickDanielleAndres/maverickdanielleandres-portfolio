"use client";
import { motion } from "framer-motion";
import CountUp from "@/components/ui/CountUp";

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const handleEnd = () => {
    // Small delay at 100% for visual confirmation
    setTimeout(onComplete, 200);
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{
        y: "-100%",
        opacity: 0,
        transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] }
      }}
      className="fixed inset-0 flex items-center justify-center bg-[#111111] overflow-hidden"
      style={{ zIndex: 9999 }}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Modern minimal counter */}
        <div className="flex items-baseline gap-2">
          <CountUp
            from={0}
            to={100}
            duration={0.8}
            onEnd={handleEnd}
            className="text-7xl md:text-9xl font-medium tracking-tighter text-white tabular-nums inline-block min-w-[3ch] text-right"
          />
          <span className="text-2xl md:text-3xl text-white/30 font-light">%</span>
        </div>

        {/* Subtle progress indicator */}
        <div className="flex flex-col items-center gap-2">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-bold"
          >
            Digital Portfolio 2026
          </motion.p>

          <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 bg-white/40"
            />
          </div>
        </div>
      </div>

      {/* Aesthetic corner text */}
      <div className="absolute bottom-10 left-10 hidden md:block">
        <p className="text-[10px] uppercase tracking-widest text-white/20 font-medium">
          Maverick Danielle Andres ©
        </p>
      </div>
    </motion.div>
  );
}

