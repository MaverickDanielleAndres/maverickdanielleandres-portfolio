"use client";

import React, { useRef, useEffect } from "react";

export interface CursorDitherTrailProps {
  trailColor?: string; // monochrome colour of dots
  dotSize?: number; // side length of a pixel square (1‑4px)
  fadeDuration?: number; // milliseconds for a dot to vanish
  className?: string;
}

export function Component({
  trailColor = "#8b5cf6", // violet by default
  dotSize = 4,
  fadeDuration = 600,
  className = "w-full h-full",
}: CursorDitherTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    canvas.width = width;
    canvas.height = height;

    const onResize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", onResize);

    // If trailColor is a HEX, we can parse it, but actually we can just use it directly.
    // The original code tried to parse it to rgba, but ctx.fillStyle = string works perfectly.
    const paintDot = (x: number, y: number) => {
      ctx.fillStyle = trailColor;
      ctx.fillRect(x, y, dotSize, dotSize);
    };

    let lastTime = performance.now();
    let animationFrameId: number;

    const fadeStep = () => {
      const now = performance.now();
      const delta = now - lastTime;
      lastTime = now;
      
      const fadeAlpha = delta / fadeDuration;
      ctx.fillStyle = `rgba(0,0,0,${fadeAlpha})`;
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";
      animationFrameId = requestAnimationFrame(fadeStep);
    };
    animationFrameId = requestAnimationFrame(fadeStep);

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      // Ensure we track relative to the container and avoid scrolling offsets if fixed
      const x = Math.floor((e.clientX - rect.left) / dotSize) * dotSize;
      const y = Math.floor((e.clientY - rect.top) / dotSize) * dotSize;
      paintDot(x, y);
    };
    window.addEventListener("mousemove", onMove);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [trailColor, dotSize, fadeDuration]);

  return <canvas ref={canvasRef} className={className} />;
}

export default Component;
