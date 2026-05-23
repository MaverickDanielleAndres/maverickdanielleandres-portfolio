"use client";

import { useRef, useCallback, startTransition } from "react";
import { useTheme } from "next-themes";
import gsap from "gsap";

/**
 * Circle-reveal theme transition.
 * Dark → black circle expands from button.
 * Light → white circle expands from button.
 */
export function useCircleReveal() {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = useCallback(
    (e: React.MouseEvent) => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const nextTheme = resolvedTheme === "dark" ? "light" : "dark";

      if (reduceMotion) {
        startTransition(() => {
          setTheme(nextTheme);
        });
        return;
      }

      const x = e.clientX;
      const y = e.clientY;

      // Yield main thread so the button click visual state can paint instantly
      requestAnimationFrame(() => {
        const overlayColor = nextTheme === "dark" ? "#111111" : "#FAFAFA";

        let overlay = overlayRef.current;
        if (!overlay) {
          overlay = document.createElement("div");
          overlay.style.cssText =
            "position:fixed;inset:0;z-index:99999;pointer-events:none;will-change:clip-path;";
          document.body.appendChild(overlay);
          overlayRef.current = overlay;
        }
        overlay.style.background = overlayColor;
        overlay.style.opacity = "1";
        overlay.style.display = "block";

        const maxDist = Math.max(
          Math.hypot(x, y),
          Math.hypot(window.innerWidth - x, y),
          Math.hypot(x, window.innerHeight - y),
          Math.hypot(window.innerWidth - x, window.innerHeight - y)
        );

        gsap.fromTo(
          overlay,
          { clipPath: `circle(0px at ${x}px ${y}px)`, opacity: 1 },
          {
            clipPath: `circle(${maxDist + 50}px at ${x}px ${y}px)`,
            duration: 0.65,
            ease: "power3.inOut",
            onStart() {
              setTimeout(() => {
                startTransition(() => {
                  setTheme(nextTheme);
                });
              }, 350);
            },
            onComplete() {
              gsap.to(overlay!, {
                opacity: 0,
                duration: 0.35,
                delay: 0.05,
                onComplete() {
                  if (overlay) {
                    overlay.style.display = "none";
                    overlay.style.clipPath = "";
                  }
                },
              });
            },
          }
        );
      });
    },
    [resolvedTheme, setTheme]
  );

  return { toggleTheme };
}
