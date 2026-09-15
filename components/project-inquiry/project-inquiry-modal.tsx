'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, ArrowUpRight, Loader2 } from 'lucide-react';
import ProjectInquiryStepper from './project-inquiry-stepper';
import IntentStep from './steps/intent-step';
import ProjectStep from './steps/project-step';
import ScopeStep from './steps/scope-step';
import ContactStep, { type ContactStepHandle, type ContactStepValues } from './steps/contact-step';
import Welcome from '@/components/ui/welcome';

/* ── Types ─────────────────────────────────────────────────────────────────── */

export type ProjectInquiry = {
  intent: string;
  projectType: string;
  budget: string;
  timeline: string;
  name: string;
  contactMethod: 'email' | 'phone';
  email: string;
  phone: string;
  company: string;
  message: string;
};

const INITIAL_STATE: ProjectInquiry = {
  intent: '',
  projectType: '',
  budget: '',
  timeline: '',
  name: '',
  contactMethod: 'email',
  email: '',
  phone: '',
  company: '',
  message: '',
};

const TOTAL_STEPS = 4;

/* ── Animation variants (memoized at module scope) ────────────────────────── */

const backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.12 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

const modalVariants = {
  initial: { opacity: 0, scale: 0.98, y: 6 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.16, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: {
    opacity: 0,
    scale: 0.99,
    y: 4,
    transition: { duration: 0.1 },
  },
};

/* ── Helpers ───────────────────────────────────────────────────────────────── */

const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validatePhone = (phone: string) =>
  /^[\d\s\-+()]{7,}$/.test(phone.trim());

/* ── Step transition (CSS-only, no nested AnimatePresence) ────────────────── */

const STEP_DIRECTION_CLASS = {
  forward: 'inquiry-step-forward',
  backward: 'inquiry-step-backward',
} as const;

/* ── Component ─────────────────────────────────────────────────────────────── */

interface ProjectInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectInquiryModal({
  isOpen,
  onClose,
}: ProjectInquiryModalProps) {
  const [data, setData] = useState<ProjectInquiry>(INITIAL_STATE);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const contactStepRef = useRef<ContactStepHandle>(null);
  // Live validity state for the (uncontrolled) contact step. The child
  // notifies us via onValidityChange whenever validity *flips* — not on
  // every keystroke — so this stays cheap.
  const [contactValid, setContactValid] = useState(false);

  /* ── Focus management (no setTimeout delay) ────────────────────────────── */

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      // Use rAF instead of setTimeout(100) — focus moves on the next frame,
      // well before the modal's first paint completes. setTimeout(100) was
      // artificially delaying focus by 100ms.
      const raf = requestAnimationFrame(() => modalRef.current?.focus());
      return () => cancelAnimationFrame(raf);
    } else if (triggerRef.current) {
      triggerRef.current.focus();
      triggerRef.current = null;
    }
  }, [isOpen]);

  /* ── Body scroll lock ──────────────────────────────────────────────────── */

  useEffect(() => {
    if (!isOpen) return;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPadding = document.body.style.paddingRight;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPadding;
    };
  }, [isOpen]);

  /* ── Keyboard handling ─────────────────────────────────────────────────── */

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  /* ── State updaters ────────────────────────────────────────────────────── */

  const updateField = useCallback((field: string, value: string) => {
    setData((prev) => {
      // Avoid re-renders when value hasn't changed
      if (prev[field as keyof ProjectInquiry] === value) return prev;
      return { ...prev, [field]: value };
    });
    // Only clear the error if one exists for this field — avoids useless state churn
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  /* ── Validation ────────────────────────────────────────────────────────── */

  const canContinue = useCallback((): boolean => {
    switch (step) {
      case 0:
        return !!data.intent;
      case 1:
        return !!data.projectType;
      case 2:
        return !!data.budget && !!data.timeline;
      case 3: {
        // Contact step uses uncontrolled inputs; validity is reported back
        // via the `onValidityChange` callback. This avoids forcing a parent
        // state update on every keystroke just to know if the Submit button
        // should be enabled.
        return contactValid;
      }
      default:
        return false;
    }
  }, [step, data, contactValid]);

  const handleContactValidityChange = useCallback((valid: boolean) => {
    setContactValid(valid);
  }, []);

  const validateContactStep = useCallback((values: ContactStepValues): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!values.name.trim()) errs.name = 'Please enter your name.';
    if (values.contactMethod === 'email') {
      if (!values.email.trim()) errs.email = 'Please enter your email.';
      else if (!validateEmail(values.email)) errs.email = 'Please enter a valid email address.';
    } else {
      if (!values.phone.trim()) errs.phone = 'Please enter your phone number.';
      else if (!validatePhone(values.phone)) errs.phone = 'Please enter a valid phone number.';
    }
    return errs;
  }, []);

  /* ── Navigation ────────────────────────────────────────────────────────── */

  const goNext = useCallback(() => {
    if (step === TOTAL_STEPS - 1) return;
    setDirection(1);
    setStep((s) => s + 1);
  }, [step]);

  const goBack = useCallback(() => {
    if (step === 0) return;
    setDirection(-1);
    setStep((s) => s - 1);
  }, [step]);

  /* ── Submit ────────────────────────────────────────────────────────────── */

  const handleSubmit = useCallback(async () => {
    // Pull live values from the uncontrolled contact step. Falls back to the
    // last-known `data` props if the ref hasn't attached yet (defensive).
    const contactValues: ContactStepValues =
      contactStepRef.current?.getValues() ?? {
        name: data.name,
        contactMethod: data.contactMethod,
        email: data.email,
        phone: data.phone,
        company: data.company,
        message: data.message,
      };

    const contactErrors = validateContactStep(contactValues);
    if (Object.keys(contactErrors).length > 0) {
      setErrors(contactErrors);
      return;
    }

    // Persist the contact fields into the parent state so the reset path
    // and any external listeners see the final values.
    setData((prev) => ({ ...prev, ...contactValues }));

    setSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/project-inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, ...contactValues }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to send inquiry.');
      }

      setSubmitted(true);
    } catch (error) {
      console.error(error);
      setSubmitError('Something went wrong while sending your inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [data, validateContactStep]);

  /* ── Close & reset ─────────────────────────────────────────────────────── */

  const handleClose = useCallback(() => {
    onClose();
    if (submitted) {
      // Reset after the exit animation completes so the user doesn't see
      // the form flicker back to step 0 before the modal fades out.
      setTimeout(() => {
        setData(INITIAL_STATE);
        setStep(0);
        setDirection(1);
        setSubmitted(false);
        setSubmitError(null);
        setErrors({});
      }, 200);
    }
  }, [onClose, submitted]);

  /* ── Memoized direction class for CSS step transition ───────────────────── */

  const stepAnimClass = useMemo(
    () => (direction > 0 ? STEP_DIRECTION_CLASS.forward : STEP_DIRECTION_CLASS.backward),
    [direction]
  );

  /* ── Render (no nested AnimatePresence — single motion layer) ──────────── */

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <m.div
            key="inquiry-backdrop"
            className="fixed inset-0 z-[9999]"
            style={{
              background: 'rgba(8, 8, 10, 0.7)',
              willChange: 'opacity',
            }}
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <m.div
            key="inquiry-modal"
            ref={modalRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Project inquiry"
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 outline-none"
            style={{ pointerEvents: 'none' }}
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div
              className="relative w-full max-w-xl rounded-2xl overflow-hidden flex flex-col inquiry-modal-card"
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 16px 48px rgba(0,0,0,0.35)',
                pointerEvents: 'auto',
                maxHeight: 'min(calc(100vh - 2rem), calc(100dvh - 2rem))',
                willChange: 'transform',
              }}
              onClick={(e) => e.stopPropagation()}
              data-lenis-prevent="true"
            >
              {/* ── Header ──────────────────────────────────────────────── */}
              {!submitted && (
                <div className="px-6 pt-5 pb-0 flex-shrink-0">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h1
                        className="text-lg font-semibold tracking-tight"
                        style={{ color: 'var(--fg)' }}
                      >
                        Let&apos;s build something.
                      </h1>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: 'var(--fg-muted)' }}
                      >
                        Tell me what you need and I&apos;ll get a better idea of how I can help.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex h-8 w-8 items-center justify-center rounded-full transition-colors -mt-1 -mr-1 shrink-0"
                      style={{
                        color: 'var(--fg-muted)',
                        border: '1px solid var(--border-subtle)',
                      }}
                      aria-label="Close"
                    >
                      <X size={15} strokeWidth={2} />
                    </button>
                  </div>

                  <div className="mt-3 mb-4">
                    <ProjectInquiryStepper currentStep={step} totalSteps={TOTAL_STEPS} />
                  </div>
                </div>
              )}

              {/* ── Content (CSS-only step transitions, no nested AnimatePresence) ── */}
              <div className="flex-1 overflow-y-auto px-6 pb-2 min-h-0 inquiry-content">
                {submitted ? (
                  <Welcome onClose={handleClose} />
                ) : (
                  <div
                    key={step}
                    className={`inquiry-step ${stepAnimClass}`}
                  >
                    {step === 0 && (
                      <IntentStep
                        value={data.intent}
                        onChange={(v) => updateField('intent', v)}
                      />
                    )}
                    {step === 1 && (
                      <ProjectStep
                        value={data.projectType}
                        onChange={(v) => updateField('projectType', v)}
                        intent={data.intent}
                      />
                    )}
                    {step === 2 && (
                      <ScopeStep
                        budget={data.budget}
                        timeline={data.timeline}
                        onBudgetChange={(v) => updateField('budget', v)}
                        onTimelineChange={(v) => updateField('timeline', v)}
                      />
                    )}
                    {step === 3 && (
                      <ContactStep
                        ref={contactStepRef}
                        name={data.name}
                        contactMethod={data.contactMethod}
                        email={data.email}
                        phone={data.phone}
                        company={data.company}
                        message={data.message}
                        onFieldChange={updateField}
                        onValidityChange={handleContactValidityChange}
                        errors={errors}
                      />
                    )}
                  </div>
                )}
              </div>

              {/* ── Footer navigation ───────────────────────────────────── */}
              {!submitted && (
                <div
                  className="flex flex-col px-6 py-4 flex-shrink-0"
                  style={{ borderTop: '1px solid var(--border-subtle)' }}
                >
                  <div className="flex items-center justify-between w-full">
                    {step > 0 ? (
                      <button
                        type="button"
                        onClick={goBack}
                        disabled={submitting}
                        className="inline-flex items-center gap-1.5 text-sm transition-opacity hover:opacity-70 disabled:opacity-40"
                        style={{ color: 'var(--fg-muted)' }}
                      >
                        <ArrowLeft size={15} />
                        Back
                      </button>
                    ) : (
                      <span />
                    )}

                    {step < TOTAL_STEPS - 1 ? (
                      <button
                        type="button"
                        onClick={goNext}
                        disabled={!canContinue() || submitting}
                        className="group inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
                        style={{
                          background: 'var(--fg)',
                          color: 'var(--bg)',
                        }}
                      >
                        Continue
                        <ArrowRight
                          size={15}
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!canContinue() || submitting}
                        className="group inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
                        style={{
                          background: 'var(--accent)',
                          color: '#fff',
                        }}
                      >
                        {submitting ? (
                          <>
                            <Loader2 size={15} className="animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            {submitError ? 'Try Again' : 'Send Project Inquiry'}
                            <ArrowUpRight
                              size={15}
                              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  {submitError && step === TOTAL_STEPS - 1 && (
                    <div className="mt-3 text-xs text-center w-full" style={{ color: 'var(--accent)' }}>
                      {submitError}
                    </div>
                  )}
                </div>
              )}
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
}