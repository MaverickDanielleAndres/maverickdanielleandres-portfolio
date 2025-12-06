import { motion, Transition } from 'framer-motion'; // Confirmed correct import
import { useEffect, useRef, useState, useMemo } from 'react';

type BlurTextProps = {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  threshold?: number;
  rootMargin?: string;
  animationFrom?: Record<string, string | number>;
  animationTo?: Array<Record<string, string | number>>;
  // --- New Props for Exit Animation ---
  exitAnimationTo?: Record<string, string | number>; // Target state for exit
  exitEasing?: (t: number) => number; // Easing for exit
  exitStepDuration?: number; // Duration for exit animation
  // --- End New Props ---
  onAnimationComplete?: () => void;
  // onAnimationExitComplete is removed as it's not a standard prop
  stepDuration?: number;
};

const buildKeyframes = (
  from: Record<string, string | number>,
  steps: Array<Record<string, string | number>>
): Record<string, Array<string | number>> => {
  const keys = new Set<string>([
    ...Object.keys(from),
    ...steps.flatMap((s) => Object.keys(s)),
  ]);

  const keyframes: Record<string, Array<string | number>> = {};
  keys.forEach((k) => {
    keyframes[k] = [from[k], ...steps.map((s) => s[k])];
  });
  return keyframes;
};

const BlurText: React.FC<BlurTextProps> = ({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  // --- New Prop Defaults ---
  exitAnimationTo, // If not provided, will use animationFrom as the exit target
  exitEasing = (t) => t,
  exitStepDuration = 0.35, // Default exit duration
  // onAnimationExitComplete is removed
  // --- End New Prop Defaults ---
  onAnimationComplete,
  stepDuration = 0.35,
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);
  const hasAnimatedIn = useRef(false); // Track if initial animation played

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          hasAnimatedIn.current = true;
        } else {
          // Element is leaving the viewport
          if (hasAnimatedIn.current) {
            setInView(false);
          }
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const defaultFrom = useMemo(
    () =>
      direction === 'top'
        ? { filter: 'blur(10px)', opacity: 0, y: -50 }
        : { filter: 'blur(10px)', opacity: 0, y: 50 },
    [direction]
  );

  const defaultTo = useMemo(
    () => [
      {
        filter: 'blur(5px)',
        opacity: 0.5,
        y: direction === 'top' ? 5 : -5,
      },
      { filter: 'blur(0px)', opacity: 1, y: 0 },
    ],
    [direction]
  );

  // --- Define Default Exit Target ---
  const defaultExitTo = useMemo(() => defaultFrom, [defaultFrom]); // Default to initial state
  // --- End Define Default Exit Target ---

  const fromSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots = animationTo ?? defaultTo;
  // --- Use Provided or Default Exit Target ---
  const exitToSnapshot = exitAnimationTo ?? defaultExitTo;
  // --- End Use Provided or Default Exit Target ---

  const stepCount = toSnapshots.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, i) =>
    stepCount === 1 ? 0 : i / (stepCount - 1)
  );

  return (
    <p
      ref={ref}
      className={className}
      style={{ display: 'flex', flexWrap: 'wrap' }}
    >
      {elements.map((segment, index) => {
        const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);

        const spanTransition: Transition = {
          duration: totalDuration,
          times,
          delay: (index * delay) / 1000,
          ease: (t) => t, // Use linear easing here as keyframes handle easing
        };

        // --- Define Exit Transition ---
        const exitTransition: Transition = {
          duration: exitStepDuration,
          ease: exitEasing,
          delay: (index * delay) / 1000, // Apply delay to exit as well for a staggered effect
        };
        // --- End Define Exit Transition ---

        return (
          <motion.span
            key={index}
            initial={fromSnapshot} // Initial state
            animate={inView ? animateKeyframes : fromSnapshot} // Animate in or reset to initial
            // --- Add Exit Animation ---
            exit={exitToSnapshot} // Target state for exit
            transition={inView ? spanTransition : exitTransition} // Use appropriate transition
            // --- End Add Exit Animation ---
            onAnimationComplete={
              // This callback will be called for both entry and exit animations.
              // You can potentially use a flag or check `inView` within the callback
              // if you need distinct behavior, but a separate exit callback prop isn't standard.
              index === elements.length - 1 ? onAnimationComplete : undefined
            }
            // onAnimationExitComplete is removed
            style={{
              display: 'inline-block',
              willChange: 'transform, filter, opacity',
            }}
          >
            {segment === ' ' ? '\u00A0' : segment}
            {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
          </motion.span>
        );
      })}
    </p>
  );
};

export default BlurText;