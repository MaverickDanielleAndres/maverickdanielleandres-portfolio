"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import dynamic from "next/dynamic";

const GitHubCalendar = dynamic(() => (import("react-github-calendar") as any).then((mod: any) => {
  return mod.GitHubCalendar || mod.default || mod;
}), {
  ssr: false,
  loading: () => <div className="w-full h-[200px] animate-pulse bg-white/5 rounded-lg" />
}) as React.ComponentType<any>;

import {
  SiReact, SiNextdotjs, SiTypescript, SiTailwindcss,
  SiNodedotjs, SiPostgresql, SiSupabase, SiGit
} from "react-icons/si";
import SpotlightCard from "@/components/ui/SpotlightCard";
import PixelCard from "@/components/ui/PixelCard";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const TECH_STACK = [
  { name: "React", icon: SiReact, color: "#61DAFB" },
  { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", color: "#ffffff", isCustom: true },
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
  { name: "Tailwind", icon: SiTailwindcss, color: "#06B6D4" },
  { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
  { name: "Supabase", icon: SiSupabase, color: "#3ECF8E" },
  { name: "Git", icon: SiGit, color: "#F05032" },
];

const EXPERIENCE = [
  {
    company: "Nexvision Innovations Inc.",
    role: "Project Lead Full Stack Developer",
    year: "2026",
    description: "Led a team of developers in building a complete project system, handling both frontend and backend architecture, task delegation, and ensuring timely delivery of features.",
  },
  {
    company: "Freelance",
    role: "Full Stack Developer",
    year: "2024–2026",
    description: "Completed multiple freelance projects including full-system builds and frontend tasks, delivering end-to-end web applications for student and private clients with a focus on usability and performance.",
  },
  {
    company: "Zentari & Optrizo",
    role: "Freelance Full Stack Developer",
    year: "2026",
    description: <span>Developed and maintained end-to-end web applications for clients, focusing on usability and performance. View work at <a href="https://www.zentariph.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">zentariph.com</a>.</span>,
  },
  {
    company: "Dept. of Education – Central",
    role: "Office Clerk",
    year: "2024",
    description: "Managed high-accuracy data encoding for 1,000+ documents and optimized filing workflows, reducing retrieval time by 30% for administrative staff.",
  },
];

export default function ActivitySection() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10%" });
  const { theme } = useTheme();

  const calendarTheme = {
    light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
    dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
  };

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

  const calendarScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (calendarScrollRef.current) {
      const timer = setTimeout(() => {
        if (calendarScrollRef.current) {
          calendarScrollRef.current.scrollLeft = calendarScrollRef.current.scrollWidth;
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <section
      id="activity"
      ref={containerRef}
      className="relative pt-6 pb-20 px-[var(--container-px)] overflow-hidden"
      style={{ background: "var(--bg-about)" }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-7xl mx-auto space-y-12"
      >
        {/* Work Experience - Responsive Grid Layout */}
        <motion.div variants={itemVariants} className="w-full">
          <SpotlightCard className="w-full border-2 border-black/15 dark:border-white/15 rounded-[2rem] overflow-hidden p-4 sm:p-6" spotlightColor="rgba(96, 85, 240, 0.15)">
            <div className="mb-6 px-2">
              <h3 className="text-xl font-medium text-[var(--fg)]">Work Experience</h3>
              <p className="text-sm text-[var(--fg-muted)] mt-1">A timeline of my professional growth and technical leadership</p>
            </div>
            
            <div className="flex flex-col md:flex-row items-stretch justify-between gap-1 md:gap-0 relative">
              {EXPERIENCE.map((exp, i) => (
                <React.Fragment key={i}>
                  <div className="flex-1 relative group p-2 md:p-4 rounded-2xl transition-colors hover:bg-white/[0.02]">
                    <div className="flex flex-col h-full">
                      <div className="flex justify-between items-start mb-2 md:mb-3">
                        <div className="flex-1 pr-2">
                          <h4 className="font-bold text-lg text-[var(--fg)] tracking-tight leading-tight">{exp.company}</h4>
                          <p className="text-[var(--accent)] font-bold text-[10px] mt-0.5 uppercase tracking-wider">{exp.role}</p>
                        </div>
                        <span className="shrink-0 text-[10px] font-black text-[var(--fg-muted)] bg-secondary/50 px-2 py-1 rounded-md border border-border/30">{exp.year}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-[var(--fg-muted)] group-hover:text-[var(--fg)] transition-colors duration-300">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Decorative Separator between items (only on desktop) */}
                  {i < EXPERIENCE.length - 1 && (
                    <div className="hidden md:flex items-center justify-center w-16 shrink-0">
                      <div className="w-px h-12 bg-gradient-to-b from-transparent via-border/60 to-transparent relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-[var(--accent)] shadow-[0_0_6px_var(--accent)]" />
                      </div>
                    </div>
                  )}
 
                  {/* Horizontal Separator for Mobile */}
                  {i < EXPERIENCE.length - 1 && (
                    <div className="md:hidden w-full h-px bg-gradient-to-r from-transparent via-border/60 to-transparent my-1" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </SpotlightCard>
        </motion.div>
 
        {/* Bottom Row: GitHub Activity */}
        <motion.div variants={itemVariants} className="w-full">
          <SpotlightCard className="w-full border-2 border-black/15 dark:border-white/15 rounded-[2rem] overflow-hidden p-4 sm:p-6" spotlightColor="rgba(96, 85, 240, 0.1)">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 px-2">
              <div>
                <h3 className="text-xl font-medium text-[var(--fg)]">GitHub Activity</h3>
                <p className="text-sm text-[var(--fg-muted)] mt-1">My open source contributions and coding streak</p>
              </div>
              <a
                href="https://github.com/MaverickDanielleAndres"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium px-4 py-2 rounded-full border border-[var(--border-subtle)] hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-all duration-300"
              >
                View Profile
              </a>
            </div>
 
            <div className="w-full bg-white/5 backdrop-blur-md border border-[var(--border-subtle)] rounded-xl overflow-hidden">
              <div ref={calendarScrollRef} className="w-full overflow-x-auto p-4 sm:p-6 scrollbar-hide">
                <div className="w-max mx-auto">
                  <GitHubCalendar
                    username="MaverickDanielleAndres"
                    fontSize={12}
                    blockSize={16}
                    blockMargin={5}
                    blockRadius={3}
                    theme={calendarTheme}
                    colorScheme={theme === "light" ? "light" : "dark"}
                  />
                </div>
              </div>
            </div>
          </SpotlightCard>
        </motion.div>
      </motion.div>

      {/* Background Accents */}
      <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-[var(--accent)] opacity-[0.03] blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-[var(--accent)] opacity-[0.03] blur-[120px] -z-10" />
    </section>
  );
}
