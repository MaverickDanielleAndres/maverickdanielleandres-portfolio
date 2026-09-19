"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { m } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  quote: string;
  avatar: string;
  signature: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Natalie",
    role: "Founder & Creative Director",
    company: "Shimmeur",
    avatar: "/testimonials/natalie.webp",
    signature: "Natalie",
    quote:
      "Working with Maverick on shimmeur.co across the full stack was exceptional. His creativity, clear communication, and feel for the brand consistently elevated the work. When challenges arose, his problem-solving was calm and solution-focused. The result is polished, cohesive, and alive — I'd work with him again without hesitation.",
  },
  {
    id: 2,
    name: "Pete Tricklebank",
    role: "Managing Director",
    company: "All Fire Services Australia",
    avatar: "/testimonials/pete.webp",
    signature: "Pete Tricklebank",
    quote:
      "Mav has been an absolute legend to work with across multiple web builds, from custom WordPress setups to modern Next.js stacks. He just gets on with the job, turns things around super fast, and the code quality is always rock solid. Nothing is ever too much trouble for him — whenever we throw a tricky requirement or tight deadline his way, he delivers spot on every single time.",
  },
  {
    id: 3,
    name: "Steve",
    role: "Owner & Founder",
    company: "Maranello's Concord",
    avatar: "/testimonials/steve.webp",
    signature: "Steve",
    quote:
      "Maverick sorted out our WordPress site when we were running into all sorts of speed and layout headaches. He diagnosed the issues right away, rebuilt the responsive flow, and got our booking forms and local SEO working seamlessly. Honest, reliable, and seriously good at what he does — couldn't be happier with the results.",
  },
  {
    id: 4,
    name: "Mozhde Marivani",
    role: "President & Lead Full Stack Developer",
    company: "Mojde Beauty",
    avatar: "/testimonials/mozhde.webp",
    signature: "Mozhde Marivani",
    quote:
      "Maverick's technical dedication and work ethic during his time with us stood out from day one. Whether architecting full-stack workflows or refining custom e-commerce features, he approaches every task with precision, curiosity, and immense focus. He doesn't just write code; he takes true ownership of the product experience.",
  },
  {
    id: 5,
    name: "Ali Asadi",
    role: "CEO & Lead Full Stack Developer",
    company: "Internship Leadership",
    avatar: "/testimonials/ali.webp",
    signature: "Ali Asadi",
    quote:
      "Working alongside Maverick has been a pleasure. He has a rare combination of strong architectural intuition and rapid execution speed. He handles complex requirements with ease, adapts immediately to new tech stacks, and consistently delivers high-impact results with zero hand-holding required.",
  },
  {
    id: 6,
    name: "Lawrence Babelonia",
    role: "Project Lead & Senior Developer",
    company: "Engineering Team",
    avatar: "/testimonials/lawrence.webp",
    signature: "Lawrence Babelonia",
    quote:
      "As a senior lead, you always hope for engineers who are proactive, clean with their code, and quick to grasp complex architecture — and Maverick is exactly that. He takes feedback constructively, writes scalable, maintainable components, and reliably delivers production-grade work ahead of schedule. A truly dependable teammate.",
  },
  {
    id: 7,
    name: "Jay Neil Pagalunan",
    role: "Full Stack Developer",
    company: "NexVision Innovations",
    avatar: "/testimonials/jay.webp",
    signature: "Jay Neil Pagalunan",
    quote:
      "Mav is hands down one of the easiest people to collaborate with. Whenever the team is in a crunch or facing a roadblock, he's always ready to jump in and lend a hand with a great attitude. His front-end taste and speed in shipping features make building together a breeze.",
  },
  {
    id: 8,
    name: "Imogen Inocentes",
    role: "Lead Full Stack Developer",
    company: "NexVision Innovations",
    avatar: "/testimonials/imogen.webp",
    signature: "Imogen Inocentes",
    quote:
      "Guiding Maverick has been great because he picks up advanced concepts faster than most developers I know. He doesn't settle for 'just working' — he cares about performance, clean abstractions, and user delight. He has grown into a formidable full-stack engineer who raises the standard for the whole team.",
  },
];

// Memoized Testimonial Card Component
const TestimonialCard = React.memo(function TestimonialCard({
  item,
}: {
  item: Testimonial;
  index: number;
}) {
  return (
    <article
      className="testimonial-card group relative flex flex-col justify-between"
      aria-label={`Testimonial from ${item.name}`}
    >
      {/* Top Row: Avatar & Subtle Quote Icon */}
      <div className="flex items-center justify-between mb-5">
        <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-border/80 shadow-sm bg-secondary/60 shrink-0">
          <Image
            src={item.avatar}
            alt={`${item.name} profile`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="56px"
            loading="lazy"
            onError={(e: any) => {
              const target = e.currentTarget as HTMLImageElement;
              if (target.dataset.fallback === "1") return;
              target.dataset.fallback = "1";
              target.src =
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200";
            }}
          />
        </div>
        <Quote className="w-5 h-5 text-muted-foreground/30 group-hover:text-accent/60 transition-colors" />
      </div>

      {/* Quote Message */}
      <div className="flex-1 mb-6">
        <blockquote className="text-[0.875rem] sm:text-[0.9125rem] leading-[1.65] text-foreground/85 font-normal tracking-normal">
          &ldquo;{item.quote}&rdquo;
        </blockquote>
      </div>

      {/* Author Footer: Cursive Signature + Role */}
      <div className="pt-4 border-t border-border/50 flex flex-col justify-end">
        <span
          className="font-signature text-2xl sm:text-3xl font-medium tracking-wide text-foreground group-hover:text-accent transition-colors leading-tight"
          style={{ letterSpacing: "0.02em" }}
        >
          {item.signature}
        </span>
        <cite className="not-italic text-[11px] sm:text-xs text-muted-foreground mt-0.5 tracking-tight">
          {item.role} &middot; <span className="text-foreground/75 font-medium">{item.company}</span>
        </cite>
      </div>
    </article>
  );
});

// Tripled set for true seamless infinite wrapping on any viewport
const MARQUEE_ITEMS = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];
const AUTO_SPEED_PPS = 40; // Pixels per second (right to left continuous movement)

export default function Testimonials() {
  const [centerIndex, setCenterIndex] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const currentIndexRef = useRef(1);

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);

  const isVisibleRef = useRef(false);
  const hasEnteredViewRef = useRef(false);

  // Position, physics, glide, and drag tracking (all in refs for 120fps GPU updates)
  const posRef = useRef(0);
  const glideRef = useRef(0);
  const velocityRef = useRef(0);
  const isHoveredRef = useRef(false);
  const dragRef = useRef({
    active: false,
    startX: 0,
    lastX: 0,
    lastTime: 0,
    hasMoved: false,
  });

  // Visibility tracking via IntersectionObserver
  useEffect(() => {
    if (!sectionRef.current || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting && !hasEnteredViewRef.current) {
          hasEnteredViewRef.current = true;
          setHasEnteredView(true);
        }
      },
      { rootMargin: "250px 0px" }
    );
    obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  // Main continuous auto-scroll and physics ticker
  useEffect(() => {
    let animId: number;
    let lastTimestamp = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTimestamp) / 1000, 0.1);
      lastTimestamp = now;

      if (isVisibleRef.current && trackRef.current) {
        const track = trackRef.current;
        const totalWidth = track.scrollWidth || 1;
        const oneSetWidth = totalWidth / 3;

        // When not user-dragging:
        if (!dragRef.current.active) {
          // 1. Smooth button glide absorption (spring-damped)
          if (Math.abs(glideRef.current) > 0.5) {
            const step = glideRef.current * 0.14;
            posRef.current += step;
            glideRef.current -= step;
          } else {
            glideRef.current = 0;
            // 2. Continuous automatic right-to-left motion
            // Gently slow down on card hover so user can read, but never stop completely
            const speed = isHoveredRef.current ? 20 : AUTO_SPEED_PPS;
            posRef.current -= speed * dt;
          }

          // 3. Momentum inertia decay after dragging
          if (Math.abs(velocityRef.current) > 5) {
            posRef.current += velocityRef.current * dt;
            velocityRef.current *= 0.92;
          }
        }

        // 4. Seamless infinite wrapping across the middle set
        while (posRef.current <= -oneSetWidth * 2) {
          posRef.current += oneSetWidth;
        }
        while (posRef.current > -oneSetWidth) {
          posRef.current -= oneSetWidth;
        }

        // 5. Hardware-accelerated translate3d transform
        track.style.transform = `translate3d(${posRef.current}px, 0, 0)`;

        // 6. Real-time Center Item Counter calculation
        const containerWidth = outerRef.current?.clientWidth || window.innerWidth;
        const centerOffset = containerWidth / 2 - posRef.current;
        const normalized = ((centerOffset % oneSetWidth) + oneSetWidth) % oneSetWidth;
        const stride = oneSetWidth / TESTIMONIALS.length;
        const floatIdx = (normalized / stride) - 0.5;
        const nearest = Math.round(floatIdx);
        const displayIndex = ((nearest % TESTIMONIALS.length) + TESTIMONIALS.length) % TESTIMONIALS.length + 1;

        if (displayIndex !== currentIndexRef.current) {
          currentIndexRef.current = displayIndex;
          setCenterIndex(displayIndex);
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Card stride helper
  const getCardStep = useCallback(() => {
    if (!trackRef.current) return 400;
    const first = trackRef.current.firstElementChild as HTMLElement;
    return first ? first.offsetWidth + 24 : 400;
  }, []);

  // Navigation handlers (< and > buttons)
  const handlePrev = useCallback(() => {
    glideRef.current += getCardStep();
    velocityRef.current = 0;
  }, [getCardStep]);

  const handleNext = useCallback(() => {
    glideRef.current -= getCardStep();
    velocityRef.current = 0;
  }, [getCardStep]);

  // Pointer drag mechanics
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const track = trackRef.current;
    if (!track) return;

    glideRef.current = 0;
    velocityRef.current = 0;

    dragRef.current = {
      active: true,
      startX: e.clientX,
      lastX: e.clientX,
      lastTime: performance.now(),
      hasMoved: false,
    };
    setIsDragging(true);

    const onMove = (ev: PointerEvent) => {
      if (!dragRef.current.active) return;
      const now = performance.now();
      const dtMs = now - dragRef.current.lastTime;
      const deltaX = ev.clientX - dragRef.current.lastX;
      if (dtMs > 0) {
        velocityRef.current = (deltaX / dtMs) * 1000;
      }
      dragRef.current.lastX = ev.clientX;
      dragRef.current.lastTime = now;
      if (Math.abs(ev.clientX - dragRef.current.startX) > 6) {
        dragRef.current.hasMoved = true;
      }

      posRef.current += deltaX;
    };

    const onUp = () => {
      if (!dragRef.current.active) return;
      dragRef.current.active = false;
      setIsDragging(false);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  const inView = hasEnteredView;

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      style={{
        paddingTop: "1.5rem",
        paddingBottom: "clamp(2rem, 5vh, 4rem)",
        position: "relative",
        overflow: "hidden",
      }}
      aria-label="Client & Colleague Testimonials"
    >
      {/* ── Section Header */}
      <div
        style={{
          paddingInline: "var(--container-px)",
          marginBottom: "clamp(2rem, 4vh, 3rem)",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <div>
          <m.p
            className="text-xs uppercase tracking-[0.18em] mb-4"
            style={{ color: "var(--fg-muted)" }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            Testimonials
          </m.p>
          <m.h2
            style={{
              fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
              fontWeight: 400,
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            What people say about me
          </m.h2>
        </div>

        {/* Navigation Controls & Center Indicator */}
        <m.div
          className="marquee-nav-wrapper"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          {/* Live Center Counter Badge */}
          <div
            className="marquee-counter"
            aria-label={`Showing testimonial ${centerIndex} of ${TESTIMONIALS.length}`}
            role="status"
          >
            <div className="marquee-counter__digits">
              <span className="marquee-counter__current">
                {String(centerIndex).padStart(2, "0")}
              </span>
              <span className="marquee-counter__divider">/</span>
              <span className="marquee-counter__total">
                {String(TESTIMONIALS.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="marquee-nav-group">
            <button
              onClick={handlePrev}
              className="marquee-nav-btn"
              aria-label="Previous testimonials"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNext}
              className="marquee-nav-btn"
              aria-label="Next testimonials"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </m.div>
      </div>

      {/* ── Marquee Carousel Track */}
      <m.div
        ref={outerRef}
        className={`testimonials-marquee-outer${isDragging ? " is-dragging" : ""}`}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.25 }}
        onPointerDown={onPointerDown}
        onMouseEnter={() => { isHoveredRef.current = true; }}
        onMouseLeave={() => { isHoveredRef.current = false; }}
        style={{ paddingBlock: "1rem", userSelect: "none" }}
        aria-label="Testimonials showcase — drag or use arrows to browse"
      >
        <div className="testimonials-track" ref={trackRef}>
          {MARQUEE_ITEMS.map((item, i) => (
            <TestimonialCard
              key={`${item.id}-${i}`}
              item={item}
              index={i % TESTIMONIALS.length}
            />
          ))}
        </div>
      </m.div>
    </section>
  );
}
