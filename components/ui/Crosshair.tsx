import React, { useEffect, useRef, RefObject } from 'react';
import { gsap } from 'gsap';

const lerp = (a: number, b: number, n: number): number => (1 - n) * a + n * b;

const getMousePos = (e: Event, container?: HTMLElement | null): { x: number; y: number } => {
  const mouseEvent = e as MouseEvent;
  if (container) {
    const bounds = container.getBoundingClientRect();
    return { x: mouseEvent.clientX - bounds.left, y: mouseEvent.clientY - bounds.top };
  }
  return { x: mouseEvent.clientX, y: mouseEvent.clientY };
};

interface CrosshairProps {
  color?: string;
  containerRef?: RefObject<HTMLElement | null>;
}

const Crosshair: React.FC<CrosshairProps> = ({ color = 'white', containerRef }) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const lineHorizontalRef = useRef<HTMLDivElement>(null);
  const lineVerticalRef = useRef<HTMLDivElement>(null);
  const filterXRef = useRef<SVGFETurbulenceElement>(null);
  const filterYRef = useRef<SVGFETurbulenceElement>(null);

  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (ev: Event) => {
      const mouseEvent = ev as MouseEvent;
      mouse.current = getMousePos(mouseEvent, containerRef?.current);
      if (containerRef?.current) {
        const bounds = containerRef.current.getBoundingClientRect();
        const outside =
          mouseEvent.clientX < bounds.left ||
          mouseEvent.clientX > bounds.right ||
          mouseEvent.clientY < bounds.top ||
          mouseEvent.clientY > bounds.bottom;
        gsap.to([lineHorizontalRef.current, lineVerticalRef.current].filter(Boolean), {
          opacity: outside ? 0 : 1
        });
      }
    };

    const target: HTMLElement | Window = containerRef?.current || window;
    target.addEventListener('mousemove', handleMouseMove);

    const renderedStyles: Record<string, { previous: number; current: number; amt: number }> = {
      tx: { previous: 0, current: 0, amt: 0.15 },
      ty: { previous: 0, current: 0, amt: 0.15 }
    };

    gsap.set([lineHorizontalRef.current, lineVerticalRef.current].filter(Boolean), { opacity: 0 });

    const onMouseMove = () => {
      renderedStyles.tx.previous = renderedStyles.tx.current = mouse.current.x;
      renderedStyles.ty.previous = renderedStyles.ty.current = mouse.current.y;
      gsap.to([lineHorizontalRef.current, lineVerticalRef.current].filter(Boolean), {
        duration: 0.9, ease: 'Power3.easeOut', opacity: 1
      });
      requestAnimationFrame(render);
      target.removeEventListener('mousemove', onMouseMove);
    };

    target.addEventListener('mousemove', onMouseMove);

    const primitiveValues = { turbulence: 0 };
    const tl = gsap.timeline({
      paused: true,
      onStart: () => {
        if (lineHorizontalRef.current) lineHorizontalRef.current.style.filter = 'url(#filter-noise-x)';
        if (lineVerticalRef.current) lineVerticalRef.current.style.filter = 'url(#filter-noise-y)';
      },
      onUpdate: () => {
        if (filterXRef.current) filterXRef.current.setAttribute('baseFrequency', primitiveValues.turbulence.toString());
        if (filterYRef.current) filterYRef.current.setAttribute('baseFrequency', primitiveValues.turbulence.toString());
      },
      onComplete: () => {
        if (lineHorizontalRef.current) lineHorizontalRef.current.style.filter = 'none';
        if (lineVerticalRef.current) lineVerticalRef.current.style.filter = 'none';
      }
    }).to(primitiveValues, { duration: 0.5, ease: 'power1', startAt: { turbulence: 1 }, turbulence: 0 });

    const enter = () => tl.restart();
    const leave = () => { tl.progress(1).kill(); };

    const render = () => {
      renderedStyles.tx.current = mouse.current.x;
      renderedStyles.ty.current = mouse.current.y;
      for (const key in renderedStyles) {
        const s = renderedStyles[key];
        s.previous = lerp(s.previous, s.current, s.amt);
      }
      if (lineHorizontalRef.current) gsap.set(lineHorizontalRef.current, { y: renderedStyles.ty.previous });
      if (lineVerticalRef.current) gsap.set(lineVerticalRef.current, { x: renderedStyles.tx.previous });
      requestAnimationFrame(render);
    };

    const links: NodeListOf<Element> = containerRef?.current
      ? containerRef.current.querySelectorAll('a, [data-skill-hover]')
      : document.querySelectorAll('a, [data-skill-hover]');
    links.forEach(link => { link.addEventListener('mouseenter', enter); link.addEventListener('mouseleave', leave); });

    return () => {
      target.removeEventListener('mousemove', handleMouseMove);
      target.removeEventListener('mousemove', onMouseMove);
      links.forEach(link => { link.removeEventListener('mouseenter', enter); link.removeEventListener('mouseleave', leave); });
    };
  }, [containerRef]);

  return (
    <div
      ref={cursorRef}
      className={`${containerRef ? 'absolute' : 'fixed'} top-0 left-0 w-full h-full pointer-events-none z-10000`}
    >
      <svg className="absolute top-0 left-0 w-full h-full">
        <defs>
          <filter id="filter-noise-x">
            <feTurbulence type="fractalNoise" baseFrequency="0.000001" numOctaves="1" ref={filterXRef} />
            <feDisplacementMap in="SourceGraphic" scale="40" />
          </filter>
          <filter id="filter-noise-y">
            <feTurbulence type="fractalNoise" baseFrequency="0.000001" numOctaves="1" ref={filterYRef} />
            <feDisplacementMap in="SourceGraphic" scale="40" />
          </filter>
        </defs>
      </svg>
      <div ref={lineHorizontalRef} className="absolute w-full h-px pointer-events-none opacity-0" style={{ background: color }} />
      <div ref={lineVerticalRef} className="absolute h-full w-px pointer-events-none opacity-0" style={{ background: color }} />
    </div>
  );
};

export default Crosshair;
