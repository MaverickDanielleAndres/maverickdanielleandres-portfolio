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
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
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
      style={{ background: "var(--bg-hero)", color: "#fff" }}
    >
      {/* Background Marquee Name (Lowest z-index) */}
      <div
        className="absolute bottom-0 left-0 w-full overflow-hidden select-none z-0"
        style={{ paddingBottom: "1.5rem" }}
      >
        <motion.div variants={enterVariants} initial="initial" animate="enter" custom={0.15} className="w-full">
          <ScrollVelocity
            texts={["Maverick Danielle Andres"]}
            velocity={40}
            className="font-normal leading-tight tracking-[-0.02em] text-white opacity-[0.08]"
            parallaxStyle={{ fontSize: "clamp(4rem, 12vw, 15rem)" }}
          />
        </motion.div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-[2] flex flex-col md:flex-row w-full h-full px-[var(--container-px)]">
        
        {/* Left Column: Text & CTA */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-start h-full pt-20 md:pt-0 pb-16 md:pb-24">
          <motion.div
            variants={enterVariants}
            initial="initial"
            animate="enter"
            custom={0.2}
            className="w-full max-w-[500px]"
          >
            <div style={{ height: "clamp(3rem, 8vw, 8.5rem)" }}>
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
            <div style={{ height: "clamp(3rem, 8vw, 8.5rem)", marginTop: "0.02em" }}>
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
            className="mt-6 text-[1rem] md:text-[1.1rem] font-medium leading-[1.4] tracking-wide opacity-90"
          >
            Full-Stack Developer &amp; IT Specialist
            <br />
            Based in Pasig City, PH
          </motion.p>

          {/* Availability */}
          <motion.div
            variants={enterVariants}
            initial="initial"
            animate="enter"
            custom={0.4}
            className="mt-5 flex flex-col gap-1.5 text-left"
          >
            <p className="text-[10px] md:text-xs tracking-[0.2em] uppercase opacity-50">Available for work</p>
            <span className="inline-flex items-center gap-2 text-[11px] md:text-xs opacity-75">
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
            className="mt-8 flex flex-wrap gap-3"
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
                  className="hero-pill-btn !px-5 !py-2.5 !text-[0.95rem]"
                >
                  {label} <ArrowUpRight size={14} />
                </a>
              ) : (
                <button key={label} onClick={handleDownloadResume} className="hero-pill-btn !px-5 !py-2.5 !text-[0.95rem]">
                  {label}
                </button>
              )
            )}
          </motion.div>
        </div>

        {/* Right Column: Profile Image */}
        <div className="w-full md:w-1/2 flex justify-center items-end h-[50vh] md:h-full relative z-[1]">
          <div className="relative w-full max-w-[500px] h-full flex justify-center items-end pt-12 md:pt-24">
            <Image
              src="/updatedprofile_pic.png"
              alt="Maverick Danielle Andres"
              fill
              className="object-contain object-bottom pointer-events-none"
              style={{ filter: "brightness(0.97) contrast(1.02)", top: "auto", bottom: 0, height: "100%" }}
              priority
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
        <span className="w-px bg-white/60" style={{ height: "clamp(2rem, 4vh, 3rem)" }} />
      </motion.a>
    </section>
  );
}
