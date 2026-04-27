"use client";
import { useEffect, useRef, useState } from "react";
import MetaBalls from "@/components/ui/MetaBalls";

type Phase = "loading" | "expanding" | "done";

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>("loading");
  const mouseRef = useRef({ x: 0, y: 0 });
  const [expandAt, setExpandAt] = useState({ x: 0, y: 0 });

  // Track cursor at all times
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    // Initialise to center
    mouseRef.current = {
      x: typeof window !== "undefined" ? window.innerWidth / 2 : 0,
      y: typeof window !== "undefined" ? window.innerHeight / 2 : 0,
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  // After 2.4 s, freeze cursor position and begin expansion
  useEffect(() => {
    const t = setTimeout(() => {
      setExpandAt({ x: mouseRef.current.x, y: mouseRef.current.y });
      setPhase("expanding");
    }, 2400);
    return () => clearTimeout(t);
  }, []);

  // After circle fully covers screen, call onComplete
  const handleTransitionEnd = () => {
    if (phase === "expanding") onComplete();
  };

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ zIndex: 9999, background: "#111111" }}
    >
      {/* MetaBalls — fade out when circle starts expanding */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: phase === "loading" ? 1 : 0,
          transition: "opacity 0.4s ease",
          pointerEvents: phase === "loading" ? "auto" : "none",
        }}
      >
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

      {/* Expanding circle that grows from cursor and covers the screen */}
      {phase !== "loading" && (
        <div
          onTransitionEnd={handleTransitionEnd}
          style={{
            position: "absolute",
            left: expandAt.x,
            top: expandAt.y,
            // Small circle matching the cursor ball visual size
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "var(--bg-hero)",
            // Start at scale(0), fly to scale that covers widest diagonal
            transform:
              phase === "expanding"
                ? "translate(-50%, -50%) scale(120)"
                : "translate(-50%, -50%) scale(0)",
            transition: "transform 0.85s cubic-bezier(0.22, 1, 0.36, 1)",
            pointerEvents: "none",
            zIndex: 10,
          }}
        />
      )}
    </div>
  );
}

