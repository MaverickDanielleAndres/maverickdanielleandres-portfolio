'use client';

import {
  Globe, PanelsTopLeft, Smartphone, Boxes,
  ShoppingBag, ChartNoAxesCombined, ServerCog, Plus, Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const projectOptions = [
  {
    id: 'website',
    icon: Globe,
    label: 'Website',
    description: 'Landing page, portfolio, corporate, marketing, or informational website.',
  },
  {
    id: 'web-app',
    icon: PanelsTopLeft,
    label: 'Web App',
    description: 'Interactive platforms, SaaS, portals, dashboards, or complex web applications.',
  },
  {
    id: 'mobile-app',
    icon: Smartphone,
    label: 'Mobile App',
    description: 'Mobile-first application or companion app.',
  },
  {
    id: 'custom-system',
    icon: Boxes,
    label: 'Custom System',
    description: 'Business systems, management systems, internal platforms, workflow systems.',
  },
  {
    id: 'ecommerce',
    icon: ShoppingBag,
    label: 'E-commerce',
    description: 'Online stores, marketplaces, ordering systems, or commerce platforms.',
  },
  {
    id: 'dashboard',
    icon: ChartNoAxesCombined,
    label: 'Dashboard / Internal Tool',
    description: 'Admin panels, analytics dashboards, CRM-like tools, internal applications.',
  },
  {
    id: 'backend-api',
    icon: ServerCog,
    label: 'Backend / API',
    description: 'APIs, databases, integrations, authentication, server-side development.',
  },
  {
    id: 'something-else',
    icon: Plus,
    label: 'Something Else',
    description: "For projects that don't fit neatly into the categories above.",
  },
];

interface ProjectStepProps {
  value: string;
  onChange: (value: string) => void;
  intent: string;
}

export default function ProjectStep({ value, onChange, intent }: ProjectStepProps) {
  const isHiring = intent === 'hire-me';

  return (
    <div className="space-y-4">
      <div>
        <h2
          className="text-xl font-semibold tracking-tight"
          style={{ color: 'var(--fg)' }}
        >
          {isHiring ? 'What kind of work are you hiring for?' : 'What are we working on?'}
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--fg-muted)' }}>
          Pick the option closest to your project.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[50vh] overflow-y-auto pr-1 scrollbar-hide">
        {projectOptions.map(({ id, icon: Icon, label, description }) => {
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
