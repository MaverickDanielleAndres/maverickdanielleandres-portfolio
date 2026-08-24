'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import About from '@/components/About';

const ProjectInquiryModal = dynamic(
  () => import('@/components/project-inquiry/project-inquiry-modal'),
  { ssr: false }
);

export default function AboutWithInquiry() {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <>
      <About onStartProject={() => setInquiryOpen(true)} />
      <ProjectInquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
      />
    </>
  );
}
