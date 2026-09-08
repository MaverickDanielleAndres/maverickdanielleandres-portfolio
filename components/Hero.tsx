"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import TextPressure from "@/components/ui/TextPressure";
import ScrollVelocity from "@/components/ui/ScrollVelocity";
import { GetStartedButton } from "@/components/ui/get-started-button";

// ─── Animation variants ──────────────────────────────────────────────────────

// Staggered slide-up for text/UI elements.
// `filter: blur` was removed because Lighthouse flagged it as a
// non-composited animation (it triggers paint on every frame and breaks
// GPU compositing). We get the same reveal feel with translateY + opacity,
// which are both compositor-only properties and animate on the GPU.
const slideUp = {
  hidden: { opacity: 0, y: 48 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      delay,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

// Profile image: rises from below with a subtle scale
const imageReveal = {
  hidden: { opacity: 0, y: 60, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 1.1,
      delay: 0.15,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

// Background marquee: fades in last
const marqueeReveal = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1.4, delay: 0.8, ease: "easeOut" as const },
  },
};

// Horizontal line that draws across the screen before elements appear
const lineReveal = {
  hidden: { scaleX: 0, opacity: 1 },
  visible: {
    scaleX: 1,
    opacity: 0,
    transition: {
      scaleX: { duration: 0.55, ease: [0.76, 0, 0.24, 1] as const },
      opacity: { duration: 0.3, delay: 0.55, ease: "easeOut" as const },
    },
  },
};

export default function Hero() {
  const handleDownloadResume = () => {
    const link = document.createElement("a");
    link.href = "/Files/Resume.pdf";
    link.download = "Maverick_Danielle_Andres_Resume.pdf";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <LazyMotion features={domAnimation}>
    <section
      id="home"
      className="relative flex flex-col md:flex-row items-stretch justify-between h-screen min-h-[100svh] w-full overflow-hidden"
      style={{ background: "var(--bg-hero)", color: "var(--fg)" }}
      suppressHydrationWarning
    >
      {/* ── Sweeping reveal line (fires first) ─────────────────────────────── */}
      <m.div
        variants={lineReveal}
        initial="hidden"
        animate="visible"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
          transformOrigin: "left",
          zIndex: 50,
          pointerEvents: "none",
        }}
      />

      {/* ── Background Marquee Name ─────────────────────────────────────────── */}
      <div className="absolute bottom-2 md:bottom-[-1rem] left-0 w-full overflow-hidden select-none z-0">
        <m.div
          variants={marqueeReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="w-full"
        >
          <ScrollVelocity
            texts={["Maverick Danielle Andres"]}
            velocity={40}
            className="font-normal leading-tight tracking-[-0.02em] text-[var(--fg)] opacity-[0.12] md:opacity-[0.08]"
            parallaxStyle={{ fontSize: "clamp(3.5rem, 10vw, 15rem)" }}
          />
        </m.div>
      </div>

      {/* ── Main Content Container ──────────────────────────────────────────── */}
      <div className="relative z-[2] flex flex-col md:flex-row w-full h-full px-[var(--container-px)]">

        {/* Left Column: Text & CTA */}
        <div className="hero-text-col relative z-20 flex-none flex flex-col justify-start items-center h-full pt-[8vh] pb-4 w-full">

          {/* Name block */}
          <m.div
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.05}
            className="hero-name-block w-[85vw] max-w-[260px] sm:max-w-[300px] md:max-w-[340px] lg:max-w-[360px] flex flex-col gap-4 md:gap-6 overflow-hidden"
          >
            <div className="hero-name-row w-full overflow-hidden text-center" style={{ height: "clamp(2.5rem, 10vh, 5.5rem)" }}>
              <TextPressure
                text="Maverick"
                flex={true}
                alpha={false}
                stroke={false}
                width={true}
                weight={true}
                italic={true}
                scale={true}
                textColor="var(--fg)"
                minFontSize={20}
                className="w-full h-full"
              />
            </div>
            <div className="hero-name-row w-full overflow-hidden text-center" style={{ height: "clamp(2.5rem, 10vh, 5.5rem)" }}>
              <TextPressure
                text="Danielle"
                flex={true}
                alpha={false}
                stroke={false}
                width={true}
                weight={true}
                italic={true}
                scale={true}
                textColor="var(--fg)"
                minFontSize={20}
                className="w-full h-full"
              />
            </div>
          </m.div>

          {/* Subtitle */}
          <m.p
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.22}
            className="hero-subtitle mt-6 text-[0.95rem] font-medium leading-[1.5] tracking-wide text-[var(--fg)] drop-shadow-md text-center"
          >
            Full-Stack Web & App Developer
            <br />
            Based in Pasig City, PH
          </m.p>

          {/* Availability and Buttons Wrapper */}
          <div className="hero-buttons-wrapper flex flex-col w-full max-w-full items-center">
            {/* Availability and Get Started - side-by-side from sm+ (640px+), stacked on xs */}
            <m.div
              variants={slideUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.34}
              className="hero-availability-row mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4 sm:gap-6 text-left"
            >
              <div className="hero-availability-block flex flex-col gap-1.5 text-left">
                <p className="hero-availability-label text-[10px] tracking-[0.2em] uppercase font-semibold text-[var(--fg)] drop-shadow-md">
                  Available for work
                </p>
                <span className="inline-flex items-center gap-2 text-[11px] font-medium text-[var(--fg)] drop-shadow-md hero-availability-status">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Open to opportunities
                </span>
              </div>
              <GetStartedButton onClick={() => window.dispatchEvent(new CustomEvent('open-inquiry-modal'))} />
            </m.div>

            {/* Buttons */}
            <m.div
              variants={slideUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.46}
              className="hero-buttons-row mt-6 flex flex-wrap gap-2.5 sm:gap-3 justify-start"
            >
            {[
              { label: "Resume", href: null, onClick: true },
              { label: "GitHub", href: "https://github.com/MaverickDanielleAndres" },
              { label: "LinkedIn", href: "https://linkedin.com/in/maverick-danielle-andres-641564373" },
            ].map(({ label, href, onClick }) =>
              href ? (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-pill-btn !px-4 !py-2 text-[0.85rem] sm:!px-5 sm:!py-2.5 sm:!text-[0.95rem] !border-[var(--fg)] !text-[var(--fg)] bg-[var(--fg)]/10 backdrop-blur-sm hover:!bg-[var(--fg)] hover:!text-[var(--bg)]"
                >
                  {label} <ArrowUpRight size={14} />
                </a>
              ) : (
                <button
                  suppressHydrationWarning
                  key={label}
                  onClick={handleDownloadResume}
                  className="hero-pill-btn !px-4 !py-2 text-[0.85rem] sm:!px-5 sm:!py-2.5 sm:!text-[0.95rem] !border-[var(--fg)] !text-[var(--fg)] bg-[var(--fg)]/10 backdrop-blur-sm hover:!bg-[var(--fg)] hover:!text-[var(--bg)]"
                >
                  {label}
                </button>
              )
            )}
          </m.div>
          </div>
        </div>

        {/* Right Column / Background: Profile Image — LCP element.
            Intentionally NOT wrapped in motion.div with `initial="hidden"`:
            framer-motion's hidden state sets opacity:0, which made the image
            wait for hydration + a 4s element-render delay on mobile. The
            image now paints as soon as the bytes arrive; a CSS-only entry
            animation runs alongside (and after) the first paint. */}
        <div className="hero-image-col absolute bottom-0 left-0 right-0 flex justify-center items-end z-10 pointer-events-none overflow-hidden h-[55%] sm:h-[60%]">
          <div className="hero-image-wrap hero-image-reveal relative w-full min-w-0 sm:min-w-[420px] max-w-[800px] h-full flex justify-center items-end">
            <Image
              src="/updatedprofile_pic.webp"
              alt="Maverick Danielle Andres"
              fill
              className="object-contain object-bottom"
              style={{ top: "auto", bottom: 0, height: "100%" }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw"
              priority
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <m.a
        href="#about"
        className="absolute hidden lg:flex flex-col items-center gap-2 opacity-40 hover:opacity-70 transition-opacity"
        style={{
          bottom: "clamp(6rem, 12vh, 14rem)",
          right: "clamp(1rem, 4vw, 4.4rem)",
          zIndex: 4,
        }}
        variants={slideUp}
        initial="hidden"
        animate="visible"
        custom={0.75}
        aria-label="Scroll down"
      >
        <span className="text-xs tracking-[0.2em] uppercase">Scroll</span>
        <span className="w-px bg-[var(--fg)]/60" style={{ height: "clamp(2rem, 4vh, 3rem)" }} />
      </m.a>
    </section>
    </LazyMotion>
  );
}
