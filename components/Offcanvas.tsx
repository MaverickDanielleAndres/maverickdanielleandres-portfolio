'use client';

import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence, m, type Variants } from 'framer-motion';
import Link from 'next/link';
import { X, Menu } from 'lucide-react';
import { FaWhatsapp, FaFacebookMessenger } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import ThemeToggle from './ThemeToggle';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Work' },
  { href: '#certificates', label: 'Certs' },
  { href: '#contact', label: 'Contact Me' },
];

const SOCIAL_LINKS = [
  { href: 'https://github.com/MaverickDanielleAndres', label: 'GitHub' },
  { href: 'https://linkedin.com/in/maverick-danielle-andres-641564373', label: 'LinkedIn' },
  { href: 'https://www.facebook.com/maverickdanielle.andres', label: 'Facebook' },
  { href: 'https://www.instagram.com/mavs_verick/', label: 'Instagram' },
];

const easeOut: [number, number, number, number] = [0.76, 0, 0.24, 1];

/* ── Panel animation (GPU-only transform, no blur during slide) ──────── */
const panelVariants: Variants = {
  initial: { x: '100%' },
  enter: { x: 0, transition: { duration: 0.5, ease: easeOut } },
  exit: { x: '100%', transition: { duration: 0.4, ease: easeOut } },
};

const backdropVariants: Variants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3, delay: 0.1 } },
};

export function Offcanvas() {
  const [isOpen, setOpen] = useState(false);
  const pathname = usePathname();
  const [activeHref, setActiveHref] = useState(pathname);

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === 'dark';

  // Close on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  const [scrollbarWidth, setScrollbarWidth] = useState(0);

  useEffect(() => {
    // Cache the scrollbar width to prevent forced layout shifts on every open
    setScrollbarWidth(window.innerWidth - document.documentElement.clientWidth);
  }, []);

  // Lock body scroll and prevent layout shift
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen, scrollbarWidth]);

  const toggle = useCallback(() => setOpen(v => !v), []);

  /* ── Shared button style matching ThemeToggle ─────────── */
  const btnStyle: React.CSSProperties = {
    background: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.85)',
    border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
    color: isDark ? '#ffffff' : '#111111',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  };

  /* ── Menu button: accent background when open, theme-aware otherwise ─ */
  const menuBtnStyle: React.CSSProperties = isOpen
    ? {
        background: 'var(--accent)',
        border: '1px solid var(--accent)',
        color: '#ffffff',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      }
    : btnStyle;

  const btnClasses =
    'flex h-10 w-10 sm:h-11 sm:w-11 lg:h-12 lg:w-12 items-center justify-center rounded-full transition-transform duration-200 hover:scale-105 cursor-pointer';

  return (
    <>
      {/* ── Fixed top action buttons (centered on mobile, right on desktop) ── */}
      <div className="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-6 lg:top-5 z-50 flex items-center justify-center lg:justify-end gap-2.5 sm:gap-3">
        <ThemeToggle />

        {/* Messenger */}
        <a
          href="https://m.me/maverickdanielle.andres"
          target="_blank"
          rel="noopener noreferrer"
          className={btnClasses}
          style={btnStyle}
          aria-label="Messenger"
        >
          <FaFacebookMessenger size={18} />
        </a>

        {/* WhatsApp */}
        <a
          href="https://wa.me/639632968188"
          target="_blank"
          rel="noopener noreferrer"
          className={btnClasses}
          style={btnStyle}
          aria-label="WhatsApp"
        >
          <FaWhatsapp size={19} />
        </a>

        {/* Menu toggle — instant responsive click with no delay */}
        <button
          suppressHydrationWarning
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          onClick={toggle}
          className={btnClasses}
          style={menuBtnStyle}
        >
          {isOpen ? (
            <X size={18} strokeWidth={2} />
          ) : (
            <Menu size={18} strokeWidth={2} />
          )}
        </button>
      </div>

      {/* ── Offcanvas overlay ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop — GPU composited */}
            <m.div
              key="backdrop"
              className="fixed inset-0 z-40 bg-black/40"
              variants={backdropVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              onClick={() => setOpen(false)}
            />

            {/* Panel — GPU-composited slide via translateX */}
            <m.div
              key="panel"
              className="fixed top-0 right-0 z-40 h-screen w-full max-w-sm flex flex-col justify-start gap-8 overflow-y-auto"
              style={{
                background: 'var(--bg)',
                color: 'var(--fg)',
                padding: 'clamp(4rem, 10vh, 6rem) 3rem 3rem',
                borderLeft: '1px solid var(--border-subtle)',
                willChange: 'transform',
              }}
              variants={panelVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              data-lenis-prevent="true"
            >
              {/* Nav links */}
              <div>
                <p className="mb-4 sm:mb-8 text-xs uppercase tracking-[0.12em] opacity-40">Navigation</p>
                <ul className="flex flex-col gap-1" onMouseLeave={() => setActiveHref(pathname)}>
                  {NAV_LINKS.map(({ href, label }, i) => (
                    <m.li
                      key={href}
                      className="relative flex items-center"
                      initial={{ y: 60, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 40, opacity: 0 }}
                      transition={{ duration: 0.55, delay: 0.1 + i * 0.06, ease: [0.16, 1, 0.3, 1] as const }}
                      onMouseEnter={() => setActiveHref(href)}
                    >
                      {/* Active dot */}
                      <m.span
                        className="absolute -left-5 h-1.5 w-1.5 rounded-full bg-current"
                        animate={{ scale: activeHref === href ? 1 : 0, opacity: activeHref === href ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                      />
                      <Link
                        href={href}
                        onClick={() => setOpen(false)}
                        className="font-light capitalize tracking-tight hover:opacity-70 transition-opacity duration-200"
                        style={{ fontSize: 'clamp(2.25rem, 6.5vh, 3.5rem)', lineHeight: 1.15 }}
                      >
                        {label}
                      </Link>
                    </m.li>
                  ))}
                </ul>
              </div>

              {/* Social links */}
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.12em] opacity-40">Social</p>
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  {SOCIAL_LINKS.map(({ href, label }) => (
                    <a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm opacity-60 hover:opacity-100 transition-opacity"
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
