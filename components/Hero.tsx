"use client";

import Image from "next/image";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import TextPressure from "@/components/ui/TextPressure";
import ScrollVelocity from "@/components/ui/ScrollVelocity";

const enterVariants = {
  initial: { opacity: 0, y: 30 },
  enter: (delay: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: delay * 0.7, ease: [0.16, 1, 0.3, 1] as const },
  }),
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
    <section
      id="home"
      className="relative flex flex-col md:flex-row items-stretch justify-between h-screen min-h-[100svh] w-full overflow-hidden"
      style={{ background: "var(--bg-hero)", color: "var(--fg)" }}
    >
      {/* Background Marquee Name (Lowest z-index) */}
      <div
        className="absolute bottom-2 md:bottom-[-1rem] left-0 w-full overflow-hidden select-none z-0"
      >
        <motion.div variants={enterVariants} initial="initial" animate="enter" custom={0.15} className="w-full">
          <ScrollVelocity
            texts={["Maverick Danielle Andres"]}
            velocity={40}
            className="font-normal leading-tight tracking-[-0.02em] text-[var(--fg)] opacity-[0.12] md:opacity-[0.08]"
            parallaxStyle={{ fontSize: "clamp(3.5rem, 10vw, 15rem)" }}
          />
        </motion.div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-[2] flex flex-col md:flex-row w-full h-full px-[var(--container-px)]">

        {/* Left Column: Text & CTA */}
        <div className="w-full md:w-auto flex-none flex flex-col justify-start md:justify-center items-start h-full pt-[10vh] md:pt-0 pb-16 md:pb-24 z-20">
          <motion.div
            variants={enterVariants}
            initial="initial"
            animate="enter"
            custom={0.2}
            className="w-[85vw] max-w-[260px] sm:max-w-[300px] md:max-w-[340px] lg:max-w-[360px] flex flex-col gap-4 md:gap-6 lg:mt-12"
          >
            <div className="w-full" style={{ height: "clamp(2.5rem, 10vh, 5.5rem)" }}>
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
            <div className="w-full" style={{ height: "clamp(2.5rem, 10vh, 5.5rem)" }}>
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
          </motion.div>

          <motion.p
            variants={enterVariants}
            initial="initial"
            animate="enter"
            custom={0.35}
            className="mt-8 md:mt-12 text-[0.95rem] md:text-[1.05rem] font-medium leading-[1.5] tracking-wide text-[var(--fg)] drop-shadow-md"
          >
            Full-Stack Web & App Developer
            <br />
            Based in Pasig City, PH
          </motion.p>

          {/* Availability */}
          <motion.div
            variants={enterVariants}
            initial="initial"
            animate="enter"
            custom={0.4}
            className="mt-6 flex flex-col gap-1.5 text-left"
          >
            <p className="text-[10px] md:text-xs tracking-[0.2em] uppercase font-semibold text-[var(--fg)] drop-shadow-md">Available for work</p>
            <span className="inline-flex items-center gap-2 text-[11px] md:text-xs font-medium text-[var(--fg)] drop-shadow-md">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Open to opportunities
            </span>
          </motion.div>

          {/* Buttons */}
          <motion.div
            variants={enterVariants}
            initial="initial"
            animate="enter"
            custom={0.5}
            className="mt-8 flex flex-wrap gap-2.5 sm:gap-3"
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
                <button suppressHydrationWarning key={label} onClick={handleDownloadResume} className="hero-pill-btn !px-4 !py-2 text-[0.85rem] sm:!px-5 sm:!py-2.5 sm:!text-[0.95rem] !border-[var(--fg)] !text-[var(--fg)] bg-[var(--fg)]/10 backdrop-blur-sm hover:!bg-[var(--fg)] hover:!text-[var(--bg)]">
                  {label}
                </button>
              )
            )}
          </motion.div>
        </div>

        {/* Right Column / Background: Profile Image */}
        <div className="absolute inset-0 md:relative md:flex-1 flex justify-end md:justify-center items-end h-full z-10 pointer-events-none overflow-visible">
          <div className="relative w-full min-w-[400px] sm:min-w-[500px] md:w-[120%] lg:w-[100%] max-w-[800px] h-[75%] md:h-[95%] lg:h-[100%] flex justify-center items-end mr-[-25%] sm:mr-[-10%] md:mr-0 mb-[-18%] md:mb-0 transition-all duration-700">
            <Image
              src="/updatedprofile_pic.webp"
              alt="Maverick Danielle Andres"
              fill
              className="object-contain object-bottom"
              style={{ top: "auto", bottom: 0, height: "100%" }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw"
              priority
              loading="eager"
              unoptimized={true}
            />
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.a
        href="#about"
        className="absolute hidden lg:flex flex-col items-center gap-2 opacity-40 hover:opacity-70 transition-opacity"
        style={{
          bottom: "clamp(6rem, 12vh, 14rem)",
          right: "clamp(1rem, 4vw, 4.4rem)",
          zIndex: 4,
        }}
        variants={enterVariants}
        initial="initial"
        animate="enter"
        custom={0.9}
        aria-label="Scroll down"
      >
        <span className="text-xs tracking-[0.2em] uppercase">Scroll</span>
        <span className="w-px bg-[var(--fg)]/60" style={{ height: "clamp(2rem, 4vh, 3rem)" }} />
      </motion.a>
    </section>
  );
}
