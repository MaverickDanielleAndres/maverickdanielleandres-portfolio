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
    // Skip the whole effect on touch devices — there is no mouse cursor to
    // follow, but the canvas + rAF + global listener were eating main-thread
    // time on phones for no visual gain.
    const coarse =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(pointer: coarse)").matches;
    if (coarse) return;

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

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };
    window.addEventListener("resize", handleResize);

    const dots: { x: number; y: number; createdAt: number }[] = [];
    const MAX_DOTS = 24; // hard cap — high-frequency moves would otherwise queue an unbounded array
    let isLooping = false;
    let animationFrameId: number;

    const fadeStep = (now: number) => {
      ctx.clearRect(0, 0, width, height);

      // Prune expired dots
      for (let i = dots.length - 1; i >= 0; i--) {
        if (now - dots[i].createdAt >= fadeDuration) {
          dots.splice(i, 1);
        }
      }

      for (const dot of dots) {
        const age = now - dot.createdAt;
        const opacity = Math.max(0, 1 - age / fadeDuration);
        ctx.fillStyle = trailColor;
        ctx.globalAlpha = opacity;
        ctx.fillRect(dot.x - dotSize / 2, dot.y - dotSize / 2, dotSize, dotSize);
      }

      ctx.globalAlpha = 1;

      if (dots.length > 0) {
        animationFrameId = requestAnimationFrame(fadeStep);
      } else {
        isLooping = false;
        ctx.clearRect(0, 0, width, height);
      }
    };

    const paintDot = (x: number, y: number) => {
      dots.push({ x, y, createdAt: performance.now() });
      // Drop oldest dots to keep the array bounded
      while (dots.length > MAX_DOTS) dots.shift();
      if (!isLooping) {
        isLooping = true;
        animationFrameId = requestAnimationFrame(fadeStep);
      }
    };

    // The global mousemove listener is ONLY attached while the trail is
    // active. When isActive=false the listener is removed, so the rest of
    // the page never competes with a background canvas paint loop.
    if (!isActive) {
      return () => {
        window.removeEventListener("resize", handleResize);
        if (isLooping) cancelAnimationFrame(animationFrameId);
      };
    }

    const onMove = (e: MouseEvent) => {
      paintDot(e.clientX, e.clientY);
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", handleResize);
      if (isLooping) {
        cancelAnimationFrame(animationFrameId);
      }
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
