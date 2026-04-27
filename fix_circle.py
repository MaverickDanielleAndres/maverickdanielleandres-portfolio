"""Fix useCircleReveal.ts"""
path = r"d:\portfolio\maverickdanielleandres-portfolio\lib\useCircleReveal.ts"

code = r'''"use client";

import { useRef, useCallback } from "react";
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
        setTheme(nextTheme);
        return;
      }

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

      const x = e.clientX;
      const y = e.clientY;

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
            setTimeout(() => setTheme(nextTheme), 350);
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
    },
    [resolvedTheme, setTheme]
  );

  return { toggleTheme };
}
'''

with open(path, "w", encoding="utf-8") as f:
    f.write(code)
print("useCircleReveal.ts", len(code), "bytes")
