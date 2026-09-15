'use client';

import { useState, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ContactStepValues {
  name: string;
  contactMethod: 'email' | 'phone';
  email: string;
  phone: string;
  company: string;
  message: string;
}

export interface ContactStepHandle {
  /** Reads the current values from the underlying inputs/refs. */
  getValues: () => ContactStepValues;
  /** Whether the step's required fields are all valid (Continue enabled). */
  isValid: () => boolean;
}

interface ContactStepProps {
  name: string;
  contactMethod: 'email' | 'phone';
  email: string;
  phone: string;
  company: string;
  message: string;
  onFieldChange: (field: string, value: string) => void;
  /** Called whenever validity flips. Used by the parent to re-evaluate
   *  the Submit button's disabled state without forcing a parent re-render
   *  on every keystroke. */
  onValidityChange?: (valid: boolean) => void;
  errors: Record<string, string>;
}

const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone: string) =>
  /^[\d\s\-+()]{7,}$/.test(phone.trim());

/**
 * Contact step uses UNCONTROLLED inputs. Keystrokes no longer trigger parent
 * state updates — only blur events sync to the parent. This eliminates the
 * cascade of parent re-renders on every keystroke that was making the
 * contact step feel sluggish when typing in any of the 4+ fields.
 *
 * The parent reads the live values via the imperative `getValues()` handle
 * when the user clicks "Send Project Inquiry", and gets a boolean validity
 * change notification (cheap, just a setState in the parent) so the Submit
 * button can update its disabled state.
 */
const ContactStep = forwardRef<ContactStepHandle, ContactStepProps>(function ContactStep(
  {
    name,
    contactMethod,
    email,
    phone,
    company,
    message,
    onFieldChange,
    onValidityChange,
    errors,
  },
  ref
) {
  // Refs hold the live input values (uncontrolled). We mirror the prop value
  // into the ref once on mount via defaultValue, so the parent still controls
  // the initial render (important for server-rendered step state) but no
  // keystroke ever propagates back to it.
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const companyRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const methodRef = useRef<'email' | 'phone'>(contactMethod);

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Helper: compute live values from the uncontrolled inputs.
  const readValues = useCallback((): ContactStepValues => ({
    name: nameRef.current?.value ?? name,
    contactMethod: methodRef.current,
    email: emailRef.current?.value ?? email,
    phone: phoneRef.current?.value ?? phone,
    company: companyRef.current?.value ?? company,
    message: messageRef.current?.value ?? message,
  }), [name, email, phone, company, message]);

  const computeValid = useCallback((v: ContactStepValues): boolean => {
    if (!v.name.trim()) return false;
    if (v.contactMethod === 'email') return validateEmail(v.email);
    return validatePhone(v.phone);
  }, []);

  // Notify parent only when validity *flips*. No-op otherwise — avoids the
  // parent re-rendering on every keystroke just to recompute `disabled`.
  const lastValidRef = useRef<boolean>(false);
  const notifyValidity = useCallback(() => {
    if (!onValidityChange) return;
    const valid = computeValid(readValues());
    if (valid !== lastValidRef.current) {
      lastValidRef.current = valid;
      onValidityChange(valid);
    }
  }, [onValidityChange, readValues, computeValid]);

  const handleBlur = useCallback((field: string) => {
    setTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }));
    notifyValidity();
  }, [notifyValidity]);

  const handleMethodChange = useCallback((method: 'email' | 'phone') => {
    methodRef.current = method;
    onFieldChange('contactMethod', method);
    setTouched((prev) => ({ ...prev }));
    notifyValidity();
  }, [onFieldChange, notifyValidity]);

  const showError = (field: string) => touched[field] && errors[field];

  const getValues = useCallback((): ContactStepValues => readValues(), [readValues]);

  const isValid = useCallback((): boolean => computeValid(readValues()), [computeValid, readValues]);

  useImperativeHandle(ref, () => ({ getValues, isValid }), [getValues, isValid]);

  // Re-validate after every keystroke without committing it to state. We
  // listen on `input` (not `change`) so the parent knows within the same
  // paint whether the Submit button should be enabled.
  const handleInput = useCallback(() => {
    notifyValidity();
  }, [notifyValidity]);

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
          ref={nameRef}
          defaultValue={name}
          onInput={handleInput}
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
              onClick={() => handleMethodChange(method)}
              className={cn(
                'px-4 py-1.5 text-xs font-medium rounded-md transition-colors capitalize',
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
              ref={emailRef}
              defaultValue={email}
              onInput={handleInput}
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
              ref={phoneRef}
              defaultValue={phone}
              onInput={handleInput}
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
          ref={companyRef}
          defaultValue={company}
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
          ref={messageRef}
          defaultValue={message}
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
});

export default ContactStep;