'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ── Configurable option arrays ────────────────────────────────────────────── */

const budgetOptions = [
  { id: 'under-25k', label: 'Under ₱25K' },
  { id: '25k-50k', label: '₱25K – ₱50K' },
  { id: '50k-100k', label: '₱50K – ₱100K' },
  { id: '100k-plus', label: '₱100K+' },
  { id: 'budget-unsure', label: 'Not sure yet' },
];

const timelineOptions = [
  { id: 'asap', label: 'ASAP' },
  { id: '2-4-weeks', label: 'Within 2–4 weeks' },
  { id: '1-2-months', label: '1–2 months' },
  { id: '2-plus-months', label: '2+ months' },
  { id: 'flexible', label: 'Flexible / Just exploring' },
];

/* ── Component ─────────────────────────────────────────────────────────────── */

interface ScopeStepProps {
  budget: string;
  timeline: string;
  onBudgetChange: (value: string) => void;
  onTimelineChange: (value: string) => void;
}

export default function ScopeStep({
  budget,
  timeline,
  onBudgetChange,
  onTimelineChange,
}: ScopeStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2
          className="text-xl font-semibold tracking-tight"
          style={{ color: 'var(--fg)' }}
        >
          What&apos;s the scope?
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--fg-muted)' }}>
          A rough estimate is completely fine.
        </p>
      </div>

      {/* Budget */}
      <div className="space-y-2.5">
        <p
          className="text-xs font-medium uppercase tracking-[0.12em]"
          style={{ color: 'var(--fg-muted)' }}
        >
          Estimated budget
        </p>
        <div className="flex flex-wrap gap-2">
          {budgetOptions.map(({ id, label }) => {
            const selected = budget === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onBudgetChange(id)}
                className={cn(
                  'relative inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium transition-all duration-200 outline-none',
                  'border focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-1',
                  selected
                    ? 'border-[var(--accent)] bg-[var(--accent)]/[0.1] text-[var(--accent)]'
                    : 'border-[var(--border-subtle)] text-[var(--fg-muted)] hover:border-[color-mix(in_srgb,var(--accent)_40%,transparent)] hover:text-[var(--fg)]'
                )}
                aria-pressed={selected}
              >
                {selected && <Check size={12} strokeWidth={2.5} />}
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-2.5">
        <p
          className="text-xs font-medium uppercase tracking-[0.12em]"
          style={{ color: 'var(--fg-muted)' }}
        >
          When do you want to start?
        </p>
        <div className="flex flex-wrap gap-2">
          {timelineOptions.map(({ id, label }) => {
            const selected = timeline === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onTimelineChange(id)}
                className={cn(
                  'relative inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium transition-all duration-200 outline-none',
                  'border focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-1',
                  selected
                    ? 'border-[var(--accent)] bg-[var(--accent)]/[0.1] text-[var(--accent)]'
                    : 'border-[var(--border-subtle)] text-[var(--fg-muted)] hover:border-[color-mix(in_srgb,var(--accent)_40%,transparent)] hover:text-[var(--fg)]'
                )}
                aria-pressed={selected}
              >
                {selected && <Check size={12} strokeWidth={2.5} />}
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
