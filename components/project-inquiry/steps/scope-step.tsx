'use client';

import { memo, useMemo } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ── Configurable option arrays ────────────────────────────────────────────── */

const budgetOptions = [
  { id: 'under-25k', label: 'Under ₱25K' },
  { id: '25k-50k', label: '₱25K – ₱50K' },
  { id: '50k-100k', label: '₱50K – ₱100K' },
  { id: '100k-plus', label: '₱100K+' },
  { id: 'budget-unsure', label: 'Not sure yet' },
] as const;

const timelineOptions = [
  { id: 'asap', label: 'ASAP' },
  { id: '2-4-weeks', label: 'Within 2–4 weeks' },
  { id: '1-2-months', label: '1–2 months' },
  { id: '2-plus-months', label: '2+ months' },
  { id: 'flexible', label: 'Flexible / Just exploring' },
] as const;

/* ── Component ─────────────────────────────────────────────────────────────── */

interface ScopeStepProps {
  budget: string;
  timeline: string;
  onBudgetChange: (value: string) => void;
  onTimelineChange: (value: string) => void;
}

/**
 * Memoized pill button — re-renders only when its own `selected` flips.
 * Prevents the entire 5-button row from re-rendering when typing in the
 * later contact step updates the parent data object.
 */
const PillButton = memo(function PillButton({
  id,
  label,
  selected,
  onClick,
}: {
  id: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium transition-colors outline-none',
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
});

export default function ScopeStep({
  budget,
  timeline,
  onBudgetChange,
  onTimelineChange,
}: ScopeStepProps) {
  const budgetHandlers = useMemo(
    () => budgetOptions.reduce<Record<string, () => void>>((acc, opt) => {
      acc[opt.id] = () => onBudgetChange(opt.id);
      return acc;
    }, {}),
    [onBudgetChange]
  );

  const timelineHandlers = useMemo(
    () => timelineOptions.reduce<Record<string, () => void>>((acc, opt) => {
      acc[opt.id] = () => onTimelineChange(opt.id);
      return acc;
    }, {}),
    [onTimelineChange]
  );

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
          {budgetOptions.map((opt) => (
            <PillButton
              key={opt.id}
              id={opt.id}
              label={opt.label}
              selected={budget === opt.id}
              onClick={budgetHandlers[opt.id]}
            />
          ))}
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
          {timelineOptions.map((opt) => (
            <PillButton
              key={opt.id}
              id={opt.id}
              label={opt.label}
              selected={timeline === opt.id}
              onClick={timelineHandlers[opt.id]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}