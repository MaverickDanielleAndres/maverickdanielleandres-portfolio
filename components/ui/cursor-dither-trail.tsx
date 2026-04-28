"use client";

import React, { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export interface CursorDitherTrailProps {
  trailColor?: string; // monochrome colour of dots
  dotSize?: number; // side length of a pixel square (1‑4px)
  fadeDuration?: number; // milliseconds for a dot to vanish
  className?: string;
  isActive?: boolean;
}

export function Component({
  trailColor = "#8b5cf6", // violet by default
  dotSize = 4,
  fadeDuration = 600,
  className = "",
  isActive = true,
}: CursorDitherTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const resizeObserver = new ResizeObserver(() => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    });
    resizeObserver.observe(document.body);

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
      if (!isActive) return;
      const x = e.clientX - dotSize / 2;
      const y = e.clientY - dotSize / 2;
      paintDot(x, y);
    };
    window.addEventListener("mousemove", onMove);

    return () => {
      window.removeEventListener("mousemove", onMove);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [trailColor, dotSize, fadeDuration, isActive]);

  if (!mounted) return null;

  return createPortal(
    <canvas 
      ref={canvasRef} 
      className={`fixed inset-0 pointer-events-none w-screen h-screen z-0 ${className}`} 
    />,
    document.body
  );
}

export default Component;
