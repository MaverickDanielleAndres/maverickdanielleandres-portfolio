'use client';

interface ProjectInquiryStepperProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProjectInquiryStepper({
  currentStep,
  totalSteps,
}: ProjectInquiryStepperProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium tracking-wide" style={{ color: 'var(--fg-muted)' }}>
        Step{' '}
        <span style={{ color: 'var(--fg)' }}>{currentStep + 1}</span>
        {' '}of {totalSteps}
      </p>
      <div
        className="h-[3px] w-full rounded-full overflow-hidden"
        style={{ background: 'var(--border-subtle)' }}
        role="progressbar"
        aria-valuenow={currentStep + 1}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label={`Step ${currentStep + 1} of ${totalSteps}`}
      >
        <div
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${progress}%`,
            background: 'var(--accent)',
          }}
        />
      </div>
    </div>
  );
}
