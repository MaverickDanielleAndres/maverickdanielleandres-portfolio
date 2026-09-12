import React, { useState, useEffect, useRef, ReactNode } from 'react';

interface MagnetProps extends React.ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
  padding?: number;
  disabled?: boolean;
  magnetStrength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  wrapperClassName?: string;
  innerClassName?: string;
}

const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 100,
  disabled = false,
  magnetStrength = 2,
  // Short transitions — the magnet still feels alive, but the inner span
  // responds to the cursor immediately instead of lagging ~250ms / 400ms.
  activeTransition = 'transform 0.1s ease-out',
  inactiveTransition = 'transform 0.15s ease-out',
  wrapperClassName = '',
  innerClassName = '',
  ...props
}) => {
  const magnetRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null);

  useEffect(() => {
    if (disabled) {
      if (innerRef.current) {
        innerRef.current.style.transform = 'translate3d(0, 0, 0)';
      }
      return;
    }

    const onMouseEnter = () => {
      if (!magnetRef.current) return;
      const r = magnetRef.current.getBoundingClientRect();
      rectRef.current = { left: r.left, top: r.top, width: r.width, height: r.height };
      if (innerRef.current) {
        innerRef.current.style.transition = activeTransition;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!magnetRef.current || !innerRef.current) return;
      if (!rectRef.current) {
        const r = magnetRef.current.getBoundingClientRect();
        rectRef.current = { left: r.left, top: r.top, width: r.width, height: r.height };
      }

      const { left, top, width, height } = rectRef.current;
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;

      if (Math.abs(distX) < width / 2 + padding && Math.abs(distY) < height / 2 + padding) {
        const offsetX = distX / magnetStrength;
        const offsetY = distY / magnetStrength;
        innerRef.current.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
      } else {
        innerRef.current.style.transform = 'translate3d(0, 0, 0)';
      }
    };

    const onMouseLeave = () => {
      rectRef.current = null;
      if (innerRef.current) {
        innerRef.current.style.transition = inactiveTransition;
        innerRef.current.style.transform = 'translate3d(0, 0, 0)';
      }
    };

    const el = magnetRef.current;
    if (!el) return;

    el.addEventListener('mouseenter', onMouseEnter);
    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseleave', onMouseLeave);

    return () => {
      el.removeEventListener('mouseenter', onMouseEnter);
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [padding, disabled, magnetStrength, activeTransition, inactiveTransition]);

  const { popover: _popover, ...safeProps } = props;

  return (
    <div
      ref={magnetRef}
      className={wrapperClassName}
      style={{ position: 'relative', display: 'inline-block' }}
      {...safeProps}
    >
      <div
        ref={innerRef}
        className={innerClassName}
        style={{
          transform: 'translate3d(0, 0, 0)',
          transition: inactiveTransition,
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Magnet;
