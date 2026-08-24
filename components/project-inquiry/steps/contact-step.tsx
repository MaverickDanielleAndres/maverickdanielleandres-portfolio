'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ContactStepProps {
  name: string;
  contactMethod: 'email' | 'phone';
  email: string;
  phone: string;
  company: string;
  message: string;
  onFieldChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}

export default function ContactStep({
  name,
  contactMethod,
  email,
  phone,
  company,
  message,
  onFieldChange,
  errors,
}: ContactStepProps) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const showError = (field: string) => touched[field] && errors[field];

  return (
    <div className="space-y-5">
      <div>
        <h2
          className="text-xl font-semibold tracking-tight"
          style={{ color: 'var(--fg)' }}
        >
          Let&apos;s talk about it.
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--fg-muted)' }}>
          Leave your details and a short note about what you have in mind.
        </p>
      </div>

      {/* Name */}
      <div>
        <label
          htmlFor="inquiry-name"
          className="block text-xs uppercase tracking-[0.12em] mb-2 font-medium"
          style={{ color: 'var(--fg-muted)' }}
        >
          Name <span className="text-[var(--accent)]">*</span>
        </label>
        <input
          id="inquiry-name"
          type="text"
          value={name}
          onChange={(e) => onFieldChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}
          placeholder="Your name"
          className="w-full bg-transparent border-b text-sm outline-none transition-colors"
          style={{
            borderColor: showError('name') ? 'var(--accent)' : 'var(--border-subtle)',
            color: 'var(--fg)',
            paddingBlock: '0.65rem',
          }}
          autoComplete="name"
        />
        {showError('name') && (
          <p className="text-xs mt-1.5" style={{ color: 'var(--accent)' }}>
            {errors.name}
          </p>
        )}
      </div>

      {/* Contact Method Toggle */}
      <div>
        <label
          className="block text-xs uppercase tracking-[0.12em] mb-2 font-medium"
          style={{ color: 'var(--fg-muted)' }}
        >
          Preferred contact <span className="text-[var(--accent)]">*</span>
        </label>
        <div
          className="inline-flex rounded-lg p-0.5 mb-3"
          style={{ border: '1px solid var(--border-subtle)' }}
          role="radiogroup"
          aria-label="Contact method"
        >
          {(['email', 'phone'] as const).map((method) => (
            <button
              key={method}
              type="button"
              role="radio"
              aria-checked={contactMethod === method}
              onClick={() => onFieldChange('contactMethod', method)}
              className={cn(
                'px-4 py-1.5 text-xs font-medium rounded-md transition-all duration-200 capitalize',
                contactMethod === method
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-[var(--fg-muted)] hover:text-[var(--fg)]'
              )}
            >
              {method}
            </button>
          ))}
        </div>

        {/* Conditional contact field */}
        {contactMethod === 'email' ? (
          <div>
            <input
              id="inquiry-email"
              type="email"
              value={email}
              onChange={(e) => onFieldChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="Email address"
              className="w-full bg-transparent border-b text-sm outline-none transition-colors"
              style={{
                borderColor: showError('email') ? 'var(--accent)' : 'var(--border-subtle)',
                color: 'var(--fg)',
                paddingBlock: '0.65rem',
              }}
              autoComplete="email"
              aria-label="Email address"
            />
            {showError('email') && (
              <p className="text-xs mt-1.5" style={{ color: 'var(--accent)' }}>
                {errors.email}
              </p>
            )}
          </div>
        ) : (
          <div>
            <input
              id="inquiry-phone"
              type="tel"
              value={phone}
              onChange={(e) => onFieldChange('phone', e.target.value)}
              onBlur={() => handleBlur('phone')}
              placeholder="Phone number"
              className="w-full bg-transparent border-b text-sm outline-none transition-colors"
              style={{
                borderColor: showError('phone') ? 'var(--accent)' : 'var(--border-subtle)',
                color: 'var(--fg)',
                paddingBlock: '0.65rem',
              }}
              autoComplete="tel"
              aria-label="Phone number"
            />
            {showError('phone') && (
              <p className="text-xs mt-1.5" style={{ color: 'var(--accent)' }}>
                {errors.phone}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Company (optional) */}
      <div>
        <label
          htmlFor="inquiry-company"
          className="block text-xs uppercase tracking-[0.12em] mb-2 font-medium"
          style={{ color: 'var(--fg-muted)' }}
        >
          Company / Organization
        </label>
        <input
          id="inquiry-company"
          type="text"
          value={company}
          onChange={(e) => onFieldChange('company', e.target.value)}
          placeholder="Company or organization (optional)"
          className="w-full bg-transparent border-b text-sm outline-none transition-colors"
          style={{
            borderColor: 'var(--border-subtle)',
            color: 'var(--fg)',
            paddingBlock: '0.65rem',
          }}
          autoComplete="organization"
        />
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="inquiry-message"
          className="block text-xs uppercase tracking-[0.12em] mb-2 font-medium"
          style={{ color: 'var(--fg-muted)' }}
        >
          Anything I should know?
        </label>
        <textarea
          id="inquiry-message"
          value={message}
          onChange={(e) => onFieldChange('message', e.target.value)}
          placeholder="Tell me a little about the project, problem, or idea..."
          rows={3}
          className="w-full bg-transparent border-b text-sm resize-none outline-none transition-colors"
          style={{
            borderColor: 'var(--border-subtle)',
            color: 'var(--fg)',
            paddingBlock: '0.65rem',
          }}
        />
      </div>
    </div>
  );
}
