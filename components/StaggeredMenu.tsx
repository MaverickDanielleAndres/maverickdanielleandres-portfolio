"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

/* ─── Types ─── */
export interface StaggeredMenuItem {
  label: string;
  ariaLabel?: string;
  link: string;
}

export interface StaggeredMenuSocialItem {
  label: string;
  link: string;
}

interface StaggeredMenuProps {
  position?: "left" | "right";
  items?: StaggeredMenuItem[];
  socialItems?: StaggeredMenuSocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  colors?: string[];
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  changeMenuColorOnOpen?: boolean;
  accentColor?: string;
  logoUrl?: string;
  isFixed?: boolean;
  closeOnClickAway?: boolean;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
}

/* ─── Component ─── */
export default function StaggeredMenu({
  position = "right",
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  colors = ["#B19EEF", "#5227FF"],
  menuButtonColor = "#fff",
  openMenuButtonColor = "#fff",
  changeMenuColorOnOpen = true,
  accentColor = "#5227FF",
  logoUrl,
  isFixed = false,
  closeOnClickAway = true,
  onMenuOpen,
  onMenuClose,
}: StaggeredMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<HTMLDivElement[]>([]);
  const linksRef = useRef<HTMLAnchorElement[]>([]);
  const socialsRef = useRef<HTMLAnchorElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const isRight = position === "right";

  /* ─── Build GSAP timeline (once) ─── */
  useEffect(() => {
    if (!panelRef.current) return;

    const tl = gsap.timeline({ paused: true });
    const layers = layersRef.current.filter(Boolean);
    const links = linksRef.current.filter(Boolean);
    const socials = socialsRef.current.filter(Boolean);

    // Slide colour layers in
    tl.to(layers, {
      x: 0,
      duration: 0.45,
      stagger: 0.08,
      ease: "power3.inOut",
    });

    // Fade-in + stagger links
    tl.fromTo(
      links,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.35, stagger: 0.06, ease: "power2.out" },
      "-=0.15"
    );

    // Social links
    if (socials.length > 0) {
      tl.fromTo(
        socials,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.25, stagger: 0.04, ease: "power2.out" },
        "-=0.2"
      );
    }

    tlRef.current = tl;

    return () => {
      tl.kill();
    };
  }, [items.length, socialItems.length]);

  /* ─── Open / Close ─── */
  const openMenu = useCallback(() => {
    setIsOpen(true);
    tlRef.current?.play();
    onMenuOpen?.();
    document.body.style.overflow = "hidden";
  }, [onMenuOpen]);

  const closeMenu = useCallback(() => {
    tlRef.current?.reverse();
    setTimeout(() => {
      setIsOpen(false);
      onMenuClose?.();
      document.body.style.overflow = "";
    }, 600);
  }, [onMenuClose]);

  const toggle = useCallback(() => {
    isOpen ? closeMenu() : openMenu();
  }, [isOpen, closeMenu, openMenu]);

  /* ─── Close on click-away ─── */
  useEffect(() => {
    if (!closeOnClickAway || !isOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, closeOnClickAway, closeMenu]);

  /* ─── ESC key ─── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeMenu();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, closeMenu]);

  const btnColor = isOpen && changeMenuColorOnOpen ? openMenuButtonColor : menuButtonColor;

  return (
    <div
      ref={menuRef}
      className={cn("z-1100", isFixed ? "fixed" : "absolute", "inset-x-0 top-0")}
    >
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-6 py-4 md:px-8 md:py-6">
        {/* Logo */}
        {logoUrl ? (
          <Link href="/" className="relative z-1200">
            <Image
              src={logoUrl}
              alt="Logo"
              width={40}
              height={40}
              className="h-8 w-auto md:h-10 hover:scale-110 transition-transform duration-300"
            />
          </Link>
        ) : (
          <span />
        )}

        {/* Toggle button */}
        <button
          onClick={toggle}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="relative z-1200 flex flex-col items-center justify-center gap-1.25 w-10 h-10 cursor-pointer group"
        >
          <span
            className="block h-0.5 w-6 rounded transition-all duration-300 origin-center"
            style={{
              backgroundColor: btnColor,
              transform: isOpen ? "rotate(45deg) translateY(3.5px)" : "none",
            }}
          />
          <span
            className="block h-0.5 w-6 rounded transition-all duration-300 origin-center"
            style={{
              backgroundColor: btnColor,
              opacity: isOpen ? 0 : 1,
            }}
          />
          <span
            className="block h-0.5 w-6 rounded transition-all duration-300 origin-center"
            style={{
              backgroundColor: btnColor,
              transform: isOpen ? "rotate(-45deg) translateY(-3.5px)" : "none",
            }}
          />
        </button>
      </div>

      {/* ── Panel ── */}
      <div
        ref={panelRef}
        className={cn(
          "fixed inset-0 pointer-events-none",
          isOpen && "pointer-events-auto"
        )}
        style={{ zIndex: 1099 }}
      >
        {/* Colour layers */}
        {colors.map((color, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) layersRef.current[i] = el;
            }}
            className="absolute inset-0"
            style={{
              backgroundColor: color,
              transform: isRight ? "translateX(100%)" : "translateX(-100%)",
              zIndex: i,
            }}
          />
        ))}

        {/* Main panel content */}
        <div
          className="absolute inset-0 flex flex-col justify-center"
          style={{
            backgroundColor: colors[colors.length - 1],
            transform: isRight ? "translateX(100%)" : "translateX(-100%)",
            zIndex: colors.length,
          }}
          ref={(el) => {
            if (el) layersRef.current[colors.length] = el;
          }}
        >
          <nav 
            className="flex flex-col items-center px-8"
            style={{ gap: "clamp(0.5rem, 2.5vh, 1.5rem)" }}
          >
            {items.map((item, i) => (
              <Link
                key={item.label}
                href={item.link}
                aria-label={item.ariaLabel || item.label}
                ref={(el) => {
                  if (el) linksRef.current[i] = el;
                }}
                onClick={closeMenu}
                className="group relative flex items-center gap-4 text-white opacity-0"
              >
                {displayItemNumbering && (
                  <span
                    className="font-light opacity-60"
                    style={{ color: accentColor, fontSize: "clamp(0.8rem, 1.5vh, 1.2rem)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                )}
                <span 
                  className="font-light tracking-tight transition-all duration-300 group-hover:tracking-wide group-hover:opacity-80"
                  style={{ fontSize: "clamp(1.5rem, 6vh, 3.5rem)" }}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Socials */}
          {displaySocials && socialItems.length > 0 && (
            <div 
              className="flex items-center justify-center gap-4 md:gap-6"
              style={{ marginTop: "clamp(1.5rem, 5vh, 3rem)" }}
            >
              {socialItems.map((social, i) => (
                <a
                  key={social.label}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  ref={(el) => {
                    if (el) socialsRef.current[i] = el;
                  }}
                  className="text-sm md:text-base text-white/70 opacity-0 transition-colors duration-200 hover:text-white"
                  style={{ "--accent": accentColor } as React.CSSProperties}
                >
                  {social.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
