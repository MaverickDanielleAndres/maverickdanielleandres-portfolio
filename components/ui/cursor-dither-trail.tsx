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

    const dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const resizeObserver = new ResizeObserver(() => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    });
    resizeObserver.observe(document.body);

    const dots = { current: [] as { x: number; y: number; createdAt: number }[] };

    const paintDot = (x: number, y: number) => {
      dots.current.push({ x, y, createdAt: performance.now() });
    };

    let animationFrameId: number;

    const fadeStep = (now: number) => {
      ctx.clearRect(0, 0, width, height);
      
      dots.current = dots.current.filter(dot => now - dot.createdAt < fadeDuration);

      for (const dot of dots.current) {
        const age = now - dot.createdAt;
        const opacity = 1 - age / fadeDuration;
        ctx.fillStyle = trailColor;
        ctx.globalAlpha = opacity;
        ctx.fillRect(dot.x - dotSize / 2, dot.y - dotSize / 2, dotSize, dotSize);
      }
      
      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(fadeStep);
    };
    animationFrameId = requestAnimationFrame(fadeStep);

    const onMove = (e: MouseEvent) => {
      if (!isActive) return;
      const x = e.clientX;
      const y = e.clientY;
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
