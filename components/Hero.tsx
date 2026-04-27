"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import TextPressure from "@/components/ui/TextPressure";

const enterVariants = {
  initial: { opacity: 0, y: 30 },
  enter: (delay: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function Hero() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentDuration = useRef(80);
  const targetDuration = useRef(80);
  const lastScrollYRef = useRef(0);

  // Smoothly adjust marquee speed with subtle interpolation.
  useEffect(() => {
    let raf: number;
    const loop = () => {
      currentDuration.current += (targetDuration.current - currentDuration.current) * 0.08;
      if (marqueeRef.current) {
        marqueeRef.current.style.animationDuration = `${currentDuration.current.toFixed(2)}s`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  // Accelerate only when scrolling down, then gently ease back.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollYRef.current;
      lastScrollYRef.current = y;

      if (delta <= 0 || Math.abs(delta) < 2) return;

      targetDuration.current = 76;
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
      resetTimeoutRef.current = setTimeout(() => {
        targetDuration.current = 80;
      }, 650);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <section
      id="home"
      className="relative h-screen min-h-[100svh] overflow-hidden"
      style={{ background: "var(--bg-hero)", color: "#fff" }}
    >
      {/* Profile photo centered */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 select-none pointer-events-none z-[1] w-[clamp(340px,79vw,500px)] sm:w-[clamp(390px,71vw,570px)] md:w-[clamp(440px,64vw,640px)] lg:w-[clamp(520px,42vw,760px)]"
      >
        <Image
          src="/profilepic.png"
          alt="Maverick Danielle Andres"
          width={700}
          height={900}
          className="h-full w-full object-contain object-bottom"
          style={{ filter: "brightness(0.97) contrast(1.02)" }}
          priority
        />
      </div>

      {/* Upper-left name + buttons */}
      <div
        className="absolute z-[2] top-[4.25rem] left-4 right-4 sm:top-[4.9rem] sm:left-[var(--container-px)] sm:right-auto md:top-[5.4rem] lg:top-[clamp(5rem,14vh,9rem)] pb-[36svh] sm:pb-[34svh] md:pb-[31svh] lg:pb-0"
      >
        <motion.div
          variants={enterVariants}
          initial="initial"
          animate="enter"
          custom={0.2}
          style={{ width: "min(100%, clamp(15rem, 36vw, 40rem))" }}
        >
          <div style={{ height: "clamp(2.35rem, 7vw, 8rem)" }}>
            <TextPressure
              text="Maverick"
              flex={true}
              alpha={false}
              stroke={false}
              width={true}
              weight={true}
              italic={true}
              textColor="#ffffff"
              minFontSize={40}
              className="w-full h-full"
            />
          </div>
          <div style={{ height: "clamp(2.35rem, 7vw, 8rem)", marginTop: "0.02em" }}>
            <TextPressure
              text="Danielle"
              flex={true}
              alpha={false}
              stroke={false}
              width={true}
              weight={true}
              italic={true}
              textColor="#ffffff"
              minFontSize={40}
              className="w-full h-full"
            />
          </div>
        </motion.div>
        <motion.p
          variants={enterVariants}
          initial="initial"
          animate="enter"
          custom={0.35}
          className="mt-6 text-[0.93rem] font-medium leading-[1.28] tracking-wide opacity-90 sm:mt-7 sm:text-[1.03rem] md:mt-8 md:text-[1.08rem] lg:mt-3"
        >
          Full-Stack Developer &amp; IT Specialist
          <br />
          Based in Pasig City, PH
        </motion.p>

        {/* Availability (mobile/tablet in normal flow to avoid overlap) */}
        <motion.div
          variants={enterVariants}
          initial="initial"
          animate="enter"
          custom={0.4}
          className="mt-3 flex flex-col gap-1 text-left md:mt-4 lg:hidden"
        >
          <p className="text-[10px] tracking-[0.16em] uppercase opacity-50 sm:text-[11px]">Available for work</p>
          <span className="inline-flex items-center gap-1.5 text-[10px] opacity-65 sm:text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Open to opportunities
          </span>
        </motion.div>

        <motion.div
          variants={enterVariants}
          initial="initial"
          animate="enter"
          custom={0.5}
          className="mt-4 flex flex-wrap gap-2.5 sm:mt-4 sm:gap-3 md:mt-5 md:gap-3.5"
        >
          {[
            { label: "Resume ", href: null, onClick: true },
            { label: "GitHub", href: "https://github.com/MaverickDanielleAndres" },
            { label: "LinkedIn", href: "https://linkedin.com/in/maverick-danielle-andres-641564373" },
          ].map(({ label, href, onClick }) =>
            href ? (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-pill-btn !px-3.5 !py-1.5 !text-[0.78rem] sm:!px-4.5 sm:!py-2 sm:!text-[0.9rem] md:!px-5 md:!py-2.5 md:!text-[0.96rem]"
              >
                {label} <ArrowUpRight size={12} />
              </a>
            ) : (
              <button key={label} onClick={handleDownloadResume} className="hero-pill-btn !px-3.5 !py-1.5 !text-[0.78rem] sm:!px-4.5 sm:!py-2 sm:!text-[0.9rem] md:!px-5 md:!py-2.5 md:!text-[0.96rem]">
                {label}
              </button>
            )
          )}
        </motion.div>
      </div>

      {/* Upper-right availability */}
      <div
        className="absolute z-[2] hidden lg:block top-[clamp(5rem,14vh,9rem)] right-[var(--container-px)]"
      >
        <motion.div
          variants={enterVariants}
          initial="initial"
          animate="enter"
          custom={0.4}
          className="flex flex-col gap-0.5 text-left sm:text-right sm:gap-1"
        >
          <p className="text-[9px] tracking-[0.14em] uppercase opacity-45 sm:text-[10px] sm:tracking-[0.18em] lg:text-xs lg:tracking-[0.2em]">Available for work</p>
          <span className="inline-flex items-center justify-end gap-1 text-[9px] opacity-55 sm:text-[10px] sm:gap-1.5 lg:text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Open to opportunities
          </span>
        </motion.div>
      </div>

      {/* Marquee name */}
      <div
        className="absolute bottom-0 left-0 w-full overflow-hidden select-none"
        style={{ zIndex: 2, height: "clamp(3.7rem,7.5vw,9.5rem)" }}
      >
        <motion.div variants={enterVariants} initial="initial" animate="enter" custom={0.15}>
          <div
            className="marquee-track"
            ref={marqueeRef}
            style={{
              fontSize: "clamp(3.2rem,10.5vw,13rem)",
              fontWeight: 400,
              lineHeight: 0.88,
              letterSpacing: "-0.025em",
              whiteSpace: "nowrap",
              color: "#fff",
              opacity: 0.08,
            }}
          >
            {[0, 1].map((gi) => (
              <span key={gi} style={{ display: "inline-flex", paddingRight: "0.5em" }}>
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} style={{ paddingRight: "0.5em" }}>
                    Maverick Danielle Andres
                    <span style={{ marginLeft: "0.3em", opacity: 0.45 }}>  </span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.a
        href="#about"
        className="absolute hidden lg:flex flex-col items-center gap-2 opacity-40 hover:opacity-70 transition-opacity"
        style={{
          bottom: "clamp(6rem,12vh,14rem)",
          right: "clamp(1rem, 16vw, 4.4rem)",
          zIndex: 3,
        }}
        variants={enterVariants}
        initial="initial"
        animate="enter"
        custom={0.9}
        aria-label="Scroll down"
      >
        <span className="text-xs tracking-[0.2em] uppercase">Scroll</span>
        <span className="w-px bg-white/60" style={{ height: "clamp(2rem,4vh,3rem)" }} />
      </motion.a>
    </section>
  );
}
