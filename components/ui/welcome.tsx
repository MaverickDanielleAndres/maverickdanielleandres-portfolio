'use client';

import confetti from 'canvas-confetti';
import { Check, ArrowLeft } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface WelcomeProps {
  onClose: () => void;
}

export default function Welcome({ onClose }: WelcomeProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  // Check reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReducedMotion) return;
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, [prefersReducedMotion]);

  const canvasRef = useCallback(
    (canvas: HTMLCanvasElement | null) => {
      if (!canvas || prefersReducedMotion) return;
      const myConfetti = confetti.create(canvas, {
        resize: true,
        useWorker: true,
      });
      myConfetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#6055F0', '#8B7FF7', '#F0F0F0', '#A5A0FF'],
      });
    },
    [prefersReducedMotion]
  );

  return (
    <div className="relative flex items-center justify-center py-8 px-2">
      {showConfetti && (
        <canvas
          className="pointer-events-none absolute inset-0 h-full w-full"
          ref={canvasRef}
          style={{ zIndex: 10 }}
        />
      )}

      <div className="relative z-20 w-full max-w-sm space-y-6 text-center">
        <div className="space-y-4">
          {/* Check icon */}
          <div
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
            style={{ background: 'color-mix(in srgb, var(--accent) 15%, transparent)' }}
          >
            <Check
              className="h-7 w-7"
              style={{ color: 'var(--accent)' }}
              strokeWidth={2.5}
            />
          </div>

          {/* Heading & subtitle */}
          <div className="space-y-2">
            <h2
              className="text-xl font-semibold tracking-tight"
              style={{ color: 'var(--fg)' }}
            >
              Project inquiry sent.
            </h2>
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--fg-muted)' }}
            >
              Thanks for reaching out. I&apos;ll review your project details and get back to you soon.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="group inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-95 w-full"
            style={{
              background: 'var(--fg)',
              color: 'var(--bg)',
            }}
            aria-label="Back to Portfolio"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            Back to Portfolio
          </button>
        </div>
      </div>
    </div>
  );
}
