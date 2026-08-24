'use client';

import { Sparkles, RefreshCw, BriefcaseBusiness, Wrench, Gauge, MessageCircleQuestion, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const intentOptions = [
  {
    id: 'build-new',
    icon: Sparkles,
    label: 'Build Something New',
    description: "I have an idea or project I want developed.",
  },
  {
    id: 'improve-existing',
    icon: RefreshCw,
    label: 'Improve Existing',
    description: "I already have something but it needs improvements.",
  },
  {
    id: 'hire-me',
    icon: BriefcaseBusiness,
    label: 'Hire Me',
    description: "I'm looking for a developer to join a team or work with us.",
  },
  {
    id: 'fix-add',
    icon: Wrench,
    label: 'Fix / Add Features',
    description: "I need a feature, integration, bug fix, or technical improvement.",
  },
  {
    id: 'seo-performance',
    icon: Gauge,
    label: 'SEO & Performance',
    description: "I want my existing website to perform and rank better.",
  },
  {
    id: 'not-sure',
    icon: MessageCircleQuestion,
    label: 'Not Sure Yet',
    description: "I have an idea, but I need help figuring out the best approach.",
  },
];

interface IntentStepProps {
  value: string;
  onChange: (value: string) => void;
}

export default function IntentStep({ value, onChange }: IntentStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2
          className="text-xl font-semibold tracking-tight"
          style={{ color: 'var(--fg)' }}
        >
          How can I help?
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--fg-muted)' }}>
          Choose what best describes what you&apos;re looking for.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {intentOptions.map(({ id, icon: Icon, label, description }) => {
          const selected = value === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={cn(
                'relative flex items-start gap-3 rounded-xl p-3.5 text-left transition-all duration-200 outline-none',
                'border focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-1',
                'hover:border-[color-mix(in_srgb,var(--accent)_40%,transparent)]',
                selected
                  ? 'border-[var(--accent)] bg-[var(--accent)]/[0.08]'
                  : 'border-[var(--border-subtle)] bg-transparent hover:bg-[var(--fg)]/[0.03]'
              )}
              aria-pressed={selected}
            >
              <span
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-200',
                  selected
                    ? 'bg-[var(--accent)]/15 text-[var(--accent)]'
                    : 'bg-[var(--fg)]/[0.06] text-[var(--fg-muted)]'
                )}
              >
                <Icon size={18} strokeWidth={1.75} />
              </span>
              <div className="min-w-0 flex-1">
                <span
                  className="text-sm font-medium block leading-tight"
                  style={{ color: 'var(--fg)' }}
                >
                  {label}
                </span>
                <span
                  className="text-xs leading-snug mt-0.5 block"
                  style={{ color: 'var(--fg-muted)' }}
                >
                  {description}
                </span>
              </div>
              {selected && (
                <span className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent)] text-white">
                  <Check size={12} strokeWidth={2.5} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
