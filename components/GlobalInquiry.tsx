'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';

const ProjectInquiryModal = dynamic(
  () => import('@/components/project-inquiry/project-inquiry-modal'),
  { ssr: false }
);

export function openInquiryModal() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-inquiry-modal'));
  }
}

const AUTO_POPUP_DELAY_MS = 90 * 1000; // 1 min 30 sec (90,000 ms)

export default function GlobalInquiry() {
  const [isOpen, setIsOpen] = useState(false);
  const userClosedRef = useRef(false);
  const isOpenRef = useRef(false);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  // Listen for manual trigger (e.g. clicking Get Started buttons)
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-inquiry-modal', handleOpen);
    return () => window.removeEventListener('open-inquiry-modal', handleOpen);
  }, []);

  // Pre-load the inquiry modal chunk in the background so it renders instantaneously
  useEffect(() => {
    const preloadTimer = setTimeout(() => {
      import('@/components/project-inquiry/project-inquiry-modal');
    }, 1500);
    return () => clearTimeout(preloadTimer);
  }, []);

  // Auto pop-up after 1 min 30 sec (90,000 ms) from initial page load / refresh
  useEffect(() => {
    const startTime = Date.now();

    const triggerAutoPopup = () => {
      if (!userClosedRef.current && !isOpenRef.current) {
        setIsOpen(true);
      }
    };

    // Main timer
    const timer = setTimeout(() => {
      triggerAutoPopup();
    }, AUTO_POPUP_DELAY_MS);

    // Visibility / focus listener to catch up if the browser tab was throttled in the background
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible' || document.hasFocus()) {
        const elapsed = Date.now() - startTime;
        if (elapsed >= AUTO_POPUP_DELAY_MS) {
          triggerAutoPopup();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityOrFocus);
    window.addEventListener('focus', handleVisibilityOrFocus);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('focus', handleVisibilityOrFocus);
    };
  }, []);

  const handleClose = useCallback(() => {
    userClosedRef.current = true;
    setIsOpen(false);
  }, []);

  return <ProjectInquiryModal isOpen={isOpen} onClose={handleClose} />;
}


