"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useCircleReveal } from "@/lib/useCircleReveal";
import { SunIcon, MoonIcon } from "lucide-react";

export default function ThemeToggle() {
  const { resolvedTheme } = useTheme();
  const { toggleTheme } = useCircleReveal();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <div
      role="group"
      aria-label="Toggle theme"
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 9999,
        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
        background: isDark ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.8)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        padding: "3px",
        gap: 2,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      }}
    >
      {/* Light button */}
      <button
        onClick={(e) => isDark && toggleTheme(e)}
        aria-label="Switch to light mode"
        aria-pressed={!isDark}
        style={{
          width: 36,
          height: 36,
          borderRadius: 9999,
          border: "none",
          cursor: isDark ? "pointer" : "default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.25s, color 0.25s",
          background: !isDark ? "var(--fg)" : "transparent",
          color: !isDark ? "var(--bg)" : "var(--fg-muted)",
          flexShrink: 0,
        }}
      >
        <SunIcon size={15} strokeWidth={1.8} />
      </button>

      {/* Dark button */}
      <button
        onClick={(e) => !isDark && toggleTheme(e)}
        aria-label="Switch to dark mode"
        aria-pressed={isDark}
        style={{
          width: 36,
          height: 36,
          borderRadius: 9999,
          border: "none",
          cursor: !isDark ? "pointer" : "default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.25s, color 0.25s",
          background: isDark ? "var(--fg)" : "transparent",
          color: isDark ? "var(--bg)" : "var(--fg-muted)",
          flexShrink: 0,
        }}
      >
        <MoonIcon size={15} strokeWidth={1.8} />
      </button>
    </div>
  );
}
