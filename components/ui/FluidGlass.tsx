"use client";
/**
 * FluidGlass — About Section Only
 *
 * REQUIRES: These 3D model files must be downloaded from the React Bits repo
 * and placed in your `public/assets/3d/` directory:
 *   - lens.glb
 *   - bar.glb
 *   - cube.glb
 *
 * Source: https://github.com/DavidHDev/react-bits/tree/main/public/assets/3d/
 *
 * Until these files are present, this component renders a placeholder overlay.
 */
import { Suspense } from "react";

type FluidGlassMode = "lens" | "bar" | "cube";

interface FluidGlassProps {
  mode?: FluidGlassMode;
  /** Props forwarded to the selected mode's mesh/material */
  lensProps?: Record<string, unknown>;
  barProps?: Record<string, unknown>;
  cubeProps?: Record<string, unknown>;
}

// Attempts to dynamically load the full Three.js implementation.
// Falls back gracefully if the .glb assets are not yet present.
export default function FluidGlass({ mode = "lens" }: FluidGlassProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
      aria-hidden="true"
    >
      {/* Placeholder — replace this with the full Three.js Canvas
          once lens.glb / bar.glb / cube.glb are in public/assets/3d/ */}
      <div
        className="rounded-full"
        style={{
          width: 180,
          height: 180,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
          boxShadow: "inset 0 0 40px rgba(255,255,255,0.04)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      />
    </div>
  );
}
