'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import { X, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/',             label: 'Home' },
  { href: '#about',        label: 'About' },
  { href: '#skills',       label: 'Skills' },
  { href: '#projects',     label: 'Work' },
  { href: '#certificates', label: 'Certs' },
  { href: '#contact',      label: 'Contact' },
];

const SOCIAL_LINKS = [
  { href: 'https://github.com/MaverickDanielleAndres',        label: 'GitHub' },
  { href: 'https://linkedin.com/in/maverick-danielle-andres-641564373', label: 'LinkedIn' },
  { href: 'https://facebook.com',                             label: 'Facebook' },
  { href: 'https://instagram.com',                            label: 'Instagram' },
];

const easeOut: [number, number, number, number] = [0.76, 0, 0.24, 1];

const panelVariants: Variants = {
  initial: { x: '100%' },
  enter:   { x: 0,      transition: { duration: 0.7, ease: easeOut } },
  exit:    { x: '100%', transition: { duration: 0.6, ease: easeOut } },
};

const backdropVariants: Variants = {
  initial: { opacity: 0 },
  enter:   { opacity: 1, transition: { duration: 0.4 } },
  exit:    { opacity: 0, transition: { duration: 0.4, delay: 0.2 } },
};

const linkVariants: Variants = {
  initial: { y: 60, opacity: 0 },
  enter: { y: 0, opacity: 1 },
  exit:  { y: 40, opacity: 0 },
};

export function Offcanvas() {
  const [isOpen, setOpen] = useState(false);
  const [activeHref, setActiveHref] = useState('/');
  const pathname = usePathname();

  // Close on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* ── Hamburger toggle circle (fixed top-right) ── */}
      <button
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen(v => !v)}
        className="fixed top-4 right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 sm:top-5 sm:right-6 sm:h-12 sm:w-12"
        style={{
          background: isOpen ? 'var(--accent)' : 'var(--bg)',
          color: isOpen ? '#fff' : 'var(--fg)',
          border: isOpen ? 'none' : '1px solid var(--border-subtle)',
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span key="close"
              initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}
            >
              <X size={18} strokeWidth={1.8} />
            </motion.span>
          ) : (
            <motion.span key="open"
              initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}
            >
              <Menu size={18} strokeWidth={1.8} />
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* ── Offcanvas overlay ── */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-40"
              style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)' }}
              variants={backdropVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <motion.div
              key="panel"
              className="fixed top-0 right-0 z-40 h-screen w-full max-w-sm flex flex-col justify-between"
              style={{ background: 'var(--bg)', color: 'var(--fg)', padding: '6rem 3rem 3rem', borderLeft: '1px solid var(--border-subtle)' }}
              variants={panelVariants}
              initial="initial"
              animate="enter"
              exit="exit"
            >
              {/* Nav links */}
              <div>
                <p className="mb-8 text-xs uppercase tracking-[0.12em] opacity-40">Navigation</p>
                <ul className="flex flex-col gap-1" onMouseLeave={() => setActiveHref(pathname)}>
                  {NAV_LINKS.map(({ href, label }, i) => (
                    <motion.li
                      key={href}
                      className="relative flex items-center"
                      initial={{ y: 60, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 40, opacity: 0 }}
                      transition={{ duration: 0.55, delay: 0.1 + i * 0.06, ease: [0.16, 1, 0.3, 1] as const }}
                      onMouseEnter={() => setActiveHref(href)}
                    >
                      {/* Active dot */}
                      <motion.span
                        className="absolute -left-5 h-1.5 w-1.5 rounded-full bg-current"
                        animate={{ scale: activeHref === href ? 1 : 0, opacity: activeHref === href ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                      />
                      <Link
                        href={href}
                        onClick={() => setOpen(false)}
                        className="text-5xl font-light capitalize tracking-tight hover:opacity-70 transition-opacity duration-200"
                        style={{ lineHeight: 1.15 }}
                      >
                        {label}
                      </Link>
                    </motion.li>
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
