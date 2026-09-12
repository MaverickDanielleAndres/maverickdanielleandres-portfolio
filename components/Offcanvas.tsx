'use client';

import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence, m, type Variants } from 'framer-motion';
import Link from 'next/link';
import { X, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import ThemeToggle from './ThemeToggle';

/* Inline SVG icons. Replacing the react-icons/fa import for these two
   cuts the entire `react-icons` FontAwesome subset (10-30 KiB) out of
   the critical-path JS bundle — Offcanvas is mounted statically and
   the menu buttons must be interactive on first paint. */
const WhatsAppIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.262l-.999 3.648 3.978-.609zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
  </svg>
);

const MessengerIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.195 5.44 3.178 7.221.39.354.626.85.652 1.378l.097 1.817a.75.75 0 0 0 1.064.643l2.018-.997a.795.795 0 0 1 .586-.067 12.41 12.41 0 0 0 2.405.234c5.64 0 10-4.13 10-9.67C22 6.13 17.64 2 12 2zm-3.42 11.18c-.32 0-.59-.27-.59-.6v-.16c0-1.61 1.32-2.94 2.94-2.94h.16c.33 0 .6.27.6.6s-.27.6-.6.6h-.16c-.96 0-1.74.78-1.74 1.74v.16c0 .33-.27.6-.6.6zm4.84-1.86h-.16c-1.62 0-2.94-1.32-2.94-2.94v-.16c0-.33.27-.6.6-.6s.6.27.6.6v.16c0 .96.78 1.74 1.74 1.74h.16c.33 0 .6.27.6.6s-.27.6-.6.6zm3.66-1.7h-.16c-.33 0-.6-.27-.6-.6v-.16c0-.96-.78-1.74-1.74-1.74h-.16c-.33 0-.6-.27-.6-.6s.27-.6.6-.6h.16c1.62 0 2.94 1.32 2.94 2.94v.16c0 .33-.27.6-.6.6z" />
  </svg>
);

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
          <MessengerIcon size={18} />
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
          <WhatsAppIcon size={19} />
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
