'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, ArrowUpRight, Loader2 } from 'lucide-react';
import ProjectInquiryStepper from './project-inquiry-stepper';
import IntentStep from './steps/intent-step';
import ProjectStep from './steps/project-step';
import ScopeStep from './steps/scope-step';
import ContactStep from './steps/contact-step';
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

/* ── Animation variants ────────────────────────────────────────────────────── */

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2, delay: 0.05 } },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 8,
    transition: { duration: 0.2 },
  },
};

const stepVariants = (direction: number): Variants => ({
  enter: {
    x: direction > 0 ? 40 : -40,
    opacity: 0,
  },
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    x: direction > 0 ? -40 : 40,
    opacity: 0,
    transition: { duration: 0.18 },
  },
});

/* ── Helpers ───────────────────────────────────────────────────────────────── */

const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validatePhone = (phone: string) =>
  /^[\d\s\-+()]{7,}$/.test(phone.trim());

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

  /* ── Focus management ──────────────────────────────────────────────────── */

  useEffect(() => {
    if (isOpen) {
      // Store the trigger element
      triggerRef.current = document.activeElement as HTMLElement;
      // Focus modal after animation
      const timer = setTimeout(() => modalRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    } else if (triggerRef.current) {
      triggerRef.current.focus();
      triggerRef.current = null;
    }
  }, [isOpen]);

  /* ── Body scroll lock ──────────────────────────────────────────────────── */

  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
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

      // Focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
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
    setData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  /* ── Validation ────────────────────────────────────────────────────────── */

  const canContinue = (): boolean => {
    switch (step) {
      case 0:
        return !!data.intent;
      case 1:
        return !!data.projectType;
      case 2:
        return !!data.budget && !!data.timeline;
      case 3: {
        if (!data.name.trim()) return false;
        if (data.contactMethod === 'email') return validateEmail(data.email);
        return validatePhone(data.phone);
      }
      default:
        return false;
    }
  };

  const validateContactStep = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!data.name.trim()) errs.name = 'Please enter your name.';
    if (data.contactMethod === 'email') {
      if (!data.email.trim()) errs.email = 'Please enter your email.';
      else if (!validateEmail(data.email)) errs.email = 'Please enter a valid email address.';
    } else {
      if (!data.phone.trim()) errs.phone = 'Please enter your phone number.';
      else if (!validatePhone(data.phone)) errs.phone = 'Please enter a valid phone number.';
    }
    return errs;
  };

  /* ── Navigation ────────────────────────────────────────────────────────── */

  const goNext = () => {
    if (step === TOTAL_STEPS - 1) return;
    setDirection(1);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    if (step === 0) return;
    setDirection(-1);
    setStep((s) => s - 1);
  };

  /* ── Submit ────────────────────────────────────────────────────────────── */

  const handleSubmit = async () => {
    const contactErrors = validateContactStep();
    if (Object.keys(contactErrors).length > 0) {
      setErrors(contactErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/project-inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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
  };

  /* ── Close & reset ─────────────────────────────────────────────────────── */

  const handleClose = useCallback(() => {
    onClose();
    // Reset after animation completes
    if (submitted) {
      setTimeout(() => {
        setData(INITIAL_STATE);
        setStep(0);
        setDirection(1);
        setSubmitted(false);
        setSubmitError(null);
        setErrors({});
      }, 300);
    }
  }, [onClose, submitted]);

  /* ── Render ────────────────────────────────────────────────────────────── */

  const currentStepVariants = stepVariants(direction);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="inquiry-backdrop"
            className="fixed inset-0 z-[9999]"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            key="inquiry-modal"
            ref={modalRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Project inquiry"
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 outline-none"
            style={{ pointerEvents: 'none' }}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div
              className="relative w-full max-w-xl rounded-2xl overflow-hidden flex flex-col"
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
                pointerEvents: 'auto',
                maxHeight: 'min(calc(100vh - 2rem), calc(100dvh - 2rem))',
              }}
              onClick={(e) => e.stopPropagation()}
              data-lenis-prevent="true"
            >
              {/* ── Header ──────────────────────────────────────────────── */}
              {!submitted && (
                <div className="px-6 pt-5 pb-0 flex-shrink-0">
                  {/* Top row: title + close */}
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
                      className="flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 -mt-1 -mr-1 shrink-0"
                      style={{
                        color: 'var(--fg-muted)',
                        border: '1px solid var(--border-subtle)',
                      }}
                      aria-label="Close"
                    >
                      <X size={15} strokeWidth={2} />
                    </button>
                  </div>

                  {/* Stepper */}
                  <div className="mt-3 mb-4">
                    <ProjectInquiryStepper currentStep={step} totalSteps={TOTAL_STEPS} />
                  </div>
                </div>
              )}

              {/* ── Content ─────────────────────────────────────────────── */}
              <div className="flex-1 overflow-y-auto px-6 pb-2 min-h-0">
                {submitted ? (
                  <Welcome onClose={handleClose} />
                ) : (
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={step}
                      variants={currentStepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
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
                          name={data.name}
                          contactMethod={data.contactMethod}
                          email={data.email}
                          phone={data.phone}
                          company={data.company}
                          message={data.message}
                          onFieldChange={updateField}
                          errors={errors}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>

              {/* ── Footer navigation ───────────────────────────────────── */}
              {!submitted && (
                <div
                  className="flex flex-col px-6 py-4 flex-shrink-0"
                  style={{ borderTop: '1px solid var(--border-subtle)' }}
                >
                  <div className="flex items-center justify-between w-full">
                    {/* Back button */}
                    {step > 0 ? (
                      <button
                        type="button"
                        onClick={goBack}
                        disabled={submitting}
                        className="inline-flex items-center gap-1.5 text-sm transition-opacity duration-200 hover:opacity-70 disabled:opacity-40"
                        style={{ color: 'var(--fg-muted)' }}
                      >
                        <ArrowLeft size={15} />
                        Back
                      </button>
                    ) : (
                      <span />
                    )}

                    {/* Continue / Submit */}
                    {step < TOTAL_STEPS - 1 ? (
                      <button
                        type="button"
                        onClick={goNext}
                        disabled={!canContinue() || submitting}
                        className="group inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
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
                        className="group inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
