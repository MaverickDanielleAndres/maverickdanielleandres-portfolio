'use client';
import { useState, useEffect } from 'react';
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

export default function GlobalInquiry() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-inquiry-modal', handleOpen);
    return () => window.removeEventListener('open-inquiry-modal', handleOpen);
  }, []);

  return <ProjectInquiryModal isOpen={isOpen} onClose={() => setIsOpen(false)} />;
}
