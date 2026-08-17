"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ImageSwiper } from "@/components/ui/image-swiper";
import { ArrowUpRight, Download, Github, Linkedin, Facebook, Instagram } from "lucide-react";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { useTheme } from "next-themes";

const SOCIAL_LINKS = [
  { icon: "github", label: "GitHub", href: "https://github.com/MaverickDanielleAndres" },
  { icon: "linkedin", label: "LinkedIn", href: "https://linkedin.com/in/maverick-danielle-andres-641564373" },
  { icon: "facebook", label: "Facebook", href: "https://www.facebook.com/maverickdanielle.andres" },
  { icon: "instagram", label: "Instagram", href: "https://www.instagram.com/mavs_verick/" },
];

const ABOUT_SWIPER_IMAGES = [
  "/AboutMe-Photo/aboutme-1.jpg",
  "/AboutMe-Photo/aboutme-2.jpg",
  "/AboutMe-Photo/aboutme-3.jpg",
  "/AboutMe-Photo/aboutme-4.jpg",
  "/AboutMe-Photo/aboutme-5.jpg",
  "/AboutMe-Photo/aboutme-6.jpg",
].join(",");

export default function About() {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10%" });
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: any = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    },
  };

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative pt-8 pb-6 px-[var(--container-px)] overflow-hidden"
      style={{ background: "var(--bg-about)", color: "var(--fg)" }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-7xl mx-auto space-y-12"
      >
        <motion.div variants={itemVariants} className="w-full">
          <SpotlightCard 
            className="w-full border-2 border-black/15 dark:border-white/15 rounded-[2rem] overflow-hidden p-6 sm:p-8" 
            spotlightColor="rgba(96, 85, 240, 0.15)"
          >
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-start">
              
              {/* Image Swiper Container (Minimized) */}
              <div className="relative shrink-0 flex flex-col items-center justify-start w-full lg:w-auto lg:-mt-4">
                <div className="relative">
                  <ImageSwiper images={ABOUT_SWIPER_IMAGES} cardWidth={175} cardHeight={230} />
                </div>
                <p 
                  className="mt-4 text-[10px] font-bold uppercase tracking-[0.25em]"
                  style={{ color: "var(--swipe-me-color)", opacity: "var(--swipe-me-opacity, 0.5)" }}
                >
                  swipe me
                </p>
              </div>

              {/* Content Container */}
              <div className="flex flex-col flex-1 w-full relative">
                
                {/* Header, Socials & Actions */}
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-6">
                  <div>
                    <h3 className="text-3xl font-bold tracking-tight text-[var(--fg)] mb-1">About Me</h3>
                    <p className="text-sm font-bold text-[var(--accent)] uppercase tracking-widest">
                      Full-Stack Developer
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex gap-2">
                      {SOCIAL_LINKS.map(({ icon, label, href }) => (
                        <a
                          key={label}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={label}
                          className="flex items-center justify-center w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[var(--fg)] hover:text-[var(--accent)] hover:border-[var(--accent)] hover:scale-105 active:scale-95 transition-all duration-300"
                        >
                          {icon === "github" && <Github size={18} strokeWidth={1.75} />}
                          {icon === "linkedin" && <Linkedin size={18} strokeWidth={1.75} />}
                          {icon === "facebook" && <Facebook size={18} strokeWidth={1.75} />}
                          {icon === "instagram" && <Instagram size={18} strokeWidth={1.75} />}
                        </a>
                      ))}
                    </div>
                    <div className="w-px h-6 bg-border/40 hidden sm:block mx-1" />
                    <div className="flex gap-2">
                      <a
                        href="/Files/Resume.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 justify-center text-xs font-bold px-4 py-2.5 rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
                        style={{ background: "var(--fg)", color: "var(--bg)" }}
                      >
                        <Download size={14} /> Resume
                      </a>
                      <a
                        href="#contact"
                        className="inline-flex items-center gap-2 justify-center text-xs font-bold px-4 py-2.5 rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-[0_4px_12px_rgba(96,85,240,0.15)]"
                        style={{ background: "var(--accent)", color: "#fff" }}
                      >
                        Hire Me <ArrowUpRight size={14} />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-4">
                  <p className="text-base sm:text-lg leading-relaxed text-[var(--fg)] font-medium">
                    I'm Maverick, a Full-Stack Developer and Project Lead who loves building scalable apps that actually work. Whether it's crafting a smooth React and Next.js frontend or architecting a solid Node.js and Supabase backend, I enjoy making code clean and useful. From integrating AI features to developing enterprise-grade systems, I'm all about creating digital tools that solve real problems.
                  </p>
                  <p className="text-sm leading-relaxed text-[var(--fg-muted)]">
                    Outside of coding, I dedicate my time to learning new technologies and AI, developing side projects, and exploring networking and sysadmin concepts to understand how complete systems operate from the ground up.
                  </p>
                </div>

              </div>
            </div>
          </SpotlightCard>
        </motion.div>
      </motion.div>

    </section>
  );
}

