'use client';
import React from 'react';

export interface ScrollVelocityProps {
  scrollContainerRef?: React.RefObject<HTMLElement>;
  texts: string[];
  velocity?: number;
  className?: string;
  damping?: number;
  stiffness?: number;
  numCopies?: number;
  velocityMapping?: any;
  parallaxClassName?: string;
  scrollerClassName?: string;
  parallaxStyle?: React.CSSProperties;
  scrollerStyle?: React.CSSProperties;
}

/**
 * GPU-composited continuous velocity marquee.
 * Runs 100% on the browser compositor thread via CSS transforms without
 * main-thread JS physics calculations, completely eliminating frame drops.
 */
export const ScrollVelocity: React.FC<ScrollVelocityProps> = ({
  texts = [],
  velocity = 40,
  className = '',
  parallaxClassName = '',
  scrollerClassName = '',
  parallaxStyle,
  scrollerStyle,
}) => {
  const duration = Math.max(25, Math.round(3200 / (velocity || 40)));

  return (
    <div
      className={`relative overflow-hidden w-full select-none ${parallaxClassName}`}
      style={parallaxStyle}
      aria-hidden="true"
    >
      <div
        className={`flex whitespace-nowrap w-max will-change-transform ${scrollerClassName}`}
        style={{
          animation: `marquee-scroll ${duration}s linear infinite`,
          ...scrollerStyle,
        }}
      >
        {/* Render 4 repeated copies for a seamless translateX(-50%) loop */}
        {Array.from({ length: 4 }).map((_, idx) => (
          <span key={idx} className={`flex-shrink-0 flex items-center pr-8 ${className}`}>
            {texts.join(' ')}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ScrollVelocity;
