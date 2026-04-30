"use client";
import React, { useEffect, useRef, useState } from 'react';

interface LogoItem {
  name: string;
  url?: string;
  icon: React.ReactNode;
}

interface LogoLoopProps {
  items: LogoItem[];
  speed?: number;
  className?: string;
  direction?: 'left' | 'right';
}

const LogoLoop: React.FC<LogoLoopProps> = ({
  items,
  speed = 1,
  className = '',
  direction = 'left'
}) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const animRef = useRef<number>(0);
  const offsetRef = useRef(0);
  const itemWidthRef = useRef(0);
  const totalWidthRef = useRef(0);
  const [copies, setCopies] = useState(3);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const firstItem = track.children[0] as HTMLElement | null;
    if (!firstItem) return;

    const observer = new ResizeObserver(() => {
      const containerWidth = track.parentElement?.getBoundingClientRect().width ?? window.innerWidth;
      const itemW = firstItem.getBoundingClientRect().width;
      itemWidthRef.current = itemW;
      const singleSetWidth = itemW * items.length;
      totalWidthRef.current = singleSetWidth;
      const needed = Math.ceil((containerWidth * 3) / singleSetWidth) + 2;
      setCopies(Math.max(3, needed));
    });
    observer.observe(track);
    return () => observer.disconnect();
  }, [items]);

  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!trackRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, { threshold: 0.01 });
    observer.observe(trackRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !isInView) return;
    let lastTime = performance.now();

    const animate = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;
      const step = speed * delta * 0.05;
      if (direction === 'left') {
        offsetRef.current -= step;
      } else {
        offsetRef.current += step;
      }
      const singleWidth = totalWidthRef.current;
      if (singleWidth > 0) {
        if (direction === 'left' && offsetRef.current <= -singleWidth) {
          offsetRef.current += singleWidth;
        } else if (direction === 'right' && offsetRef.current >= 0) {
          offsetRef.current -= singleWidth;
        }
      }
      track.style.transform = `translateX(${offsetRef.current}px)`;
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [speed, direction, isInView]);

  const allItems = Array.from({ length: copies }, () => items).flat();

  return (
    <div className={`overflow-hidden relative w-full ${className}`}>
      <div ref={trackRef} className="flex items-center gap-0 will-change-transform" style={{ width: 'max-content' }}>
        {allItems.map((item, i) => (
          <div
            key={i}
            className="group flex items-center gap-3 px-8 py-4 whitespace-nowrap cursor-default select-none transition-transform duration-200 hover:scale-125 hover:z-10"
            style={{ position: "relative" }}
          >
            <span className="w-8 h-8 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-all duration-200 group-hover:scale-110">
              {item.icon}
            </span>
            <span className="text-sm font-medium tracking-widest uppercase opacity-70 group-hover:opacity-100 transition-opacity duration-200">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoLoop;
