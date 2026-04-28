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
      className="relative flex flex-col md:flex-row items-center justify-between h-screen min-h-[100svh] overflow-hidden px-[var(--container-px)] pt-20 md:pt-24 lg:pt-32"
      style={{ background: "var(--bg-hero)", color: "#fff" }}
    >
      {/* Left Column: Text & CTA */}
      <div className="relative z-[2] w-full md:w-[50%] flex flex-col justify-center items-start pt-8 pb-[30vh] md:pb-0 md:pt-0">
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
          className="mt-4 md:mt-6 text-[0.95rem] md:text-[1.1rem] font-medium leading-[1.3] tracking-wide opacity-90"
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
          className="mt-3 md:mt-4 flex flex-col gap-1 text-left"
        >
          <p className="text-[10px] md:text-xs tracking-[0.16em] md:tracking-[0.2em] uppercase opacity-50">Available for work</p>
          <span className="inline-flex items-center gap-1.5 text-[10px] md:text-[11px] opacity-65">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Open to opportunities
          </span>
        </motion.div>

        {/* Buttons */}
        <motion.div
          variants={enterVariants}
          initial="initial"
          animate="enter"
          custom={0.5}
          className="mt-6 flex flex-wrap gap-3"
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
                className="hero-pill-btn !px-4 !py-2 !text-[0.85rem] md:!px-5 md:!py-2.5 md:!text-[0.95rem]"
              >
                {label} <ArrowUpRight size={12} />
              </a>
            ) : (
              <button key={label} onClick={handleDownloadResume} className="hero-pill-btn !px-4 !py-2 !text-[0.85rem] md:!px-5 md:!py-2.5 md:!text-[0.95rem]">
                {label}
              </button>
            )
          )}
        </motion.div>
      </div>

      {/* Right Column: Profile Image */}
      <div
        className="absolute bottom-0 right-0 w-full md:w-[50%] h-[55%] md:h-[80%] z-[1] select-none pointer-events-none flex justify-center md:justify-end items-end pr-0 md:pr-12"
      >
        <Image
          src="/updatedprofile_pic.png"
          alt="Maverick Danielle Andres"
          width={700}
          height={900}
          className="h-full w-auto object-contain object-bottom scale-95"
          style={{ filter: "brightness(0.97) contrast(1.02)", transformOrigin: "bottom center" }}
          priority
        />
      </div>

      {/* Marquee name */}
      <div
        className="absolute bottom-0 left-0 w-full overflow-hidden select-none z-[3]"
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
