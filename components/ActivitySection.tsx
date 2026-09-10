"use client";

import React, { useRef, useEffect } from "react";
import { m, useInView, type Variants } from "framer-motion";
import dynamic from "next/dynamic";

const GitHubCalendar = dynamic(() => import("react-github-calendar").then((mod) => {
  return mod.GitHubCalendar || (mod as any).default || mod;
}), {
  ssr: false,
  loading: () => <div className="w-full h-[200px] animate-pulse bg-white/5 rounded-lg" />
}) as React.ComponentType<any>;

import SpotlightCard from "@/components/ui/SpotlightCard";
import { useTheme } from "next-themes";

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

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    },
  };

  const calendarScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = calendarScrollRef.current;
    if (!el) return;

    const scrollToLatest = () => {
      if (el) {
        el.scrollLeft = el.scrollWidth;
      }
    };

    // Scroll immediately
    scrollToLatest();

    // Use ResizeObserver to detect when the calendar SVG renders or window resizes
    const ro = new ResizeObserver(() => {
      scrollToLatest();
    });
    ro.observe(el);

    // Observe DOM mutations (e.g. when react-github-calendar inserts elements asynchronously)
    const mo = new MutationObserver(() => {
      scrollToLatest();
    });
    mo.observe(el, { childList: true, subtree: true });

    // Multi-stage timers for network latency variations
    const t1 = setTimeout(scrollToLatest, 100);
    const t2 = setTimeout(scrollToLatest, 400);
    const t3 = setTimeout(scrollToLatest, 1000);
    const t4 = setTimeout(scrollToLatest, 2000);

    return () => {
      ro.disconnect();
      mo.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <section
      id="activity"
      ref={containerRef}
      className="relative pt-6 pb-20 px-[var(--container-px)] overflow-hidden"
      style={{ background: "var(--bg-about)" }}
    >
      <m.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-[90rem] mx-auto space-y-12"
      >
        {/* Work Experience - Responsive Grid Layout */}
        <m.div variants={itemVariants} className="w-full">
          <SpotlightCard className="w-full border-2 border-black/10 dark:border-white/15 rounded-[2rem] overflow-hidden p-4 sm:p-6 bg-white/80 dark:bg-transparent shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-none backdrop-blur-sm" spotlightColor="rgba(96, 85, 240, 0.15)">
            <div className="mb-6 px-2">
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--fg)]">Work Experience</h3>
              <p className="text-sm sm:text-base text-[var(--fg-muted)] mt-1">A timeline of my professional growth and technical leadership</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 relative items-stretch">
              {EXPERIENCE.map((exp, i) => (
                <div
                  key={i}
                  className="relative h-full"
                >
                  <div className="h-full group p-2 md:p-4 rounded-2xl transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                    <div className="flex flex-col h-full">
                      <div className="flex justify-between items-start mb-2 md:mb-3">
                        <div className="flex-1 pr-2">
                          <h4 className="font-bold text-lg text-[var(--fg)] tracking-tight leading-tight">{exp.company}</h4>
                          <p className="text-[var(--accent)] font-bold text-[10px] mt-0.5 uppercase tracking-wider">{exp.role}</p>
                        </div>
                        <span className="shrink-0 text-[10px] font-bold text-[var(--fg-muted)] bg-black/5 dark:bg-white/5 px-2 py-1 rounded-md border border-black/10 dark:border-white/10">{exp.year}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-[var(--fg-muted)] group-hover:text-[var(--fg)] transition-colors duration-300">
                        {exp.description}
                      </p>
                    </div>
                  </div>

                  {/* Decorative Separator between items (only on large desktop).
                      Positioned absolutely on the right edge of each card except
                      the last one — works for any grid layout without affecting
                      the row height. */}
                  {i < EXPERIENCE.length - 1 && (
                    <div
                      className="hidden lg:flex items-center justify-center pointer-events-none absolute top-1/2 -translate-y-1/2 -right-2 h-12"
                      aria-hidden="true"
                    >
                      <div className="relative h-full">
                        <div className="w-px h-full bg-gradient-to-b from-transparent via-[var(--border-subtle)] to-transparent" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-[var(--accent)] shadow-[0_0_6px_var(--accent)]" />
                      </div>
                    </div>
                  )}

                  {/* Horizontal Separator for Mobile and Tablet */}
                  {i < EXPERIENCE.length - 1 && (
                    <div className="md:hidden w-full h-px bg-gradient-to-r from-transparent via-[var(--border-subtle)] to-transparent my-1" />
                  )}
                </div>
              ))}
            </div>
          </SpotlightCard>
        </m.div>

        {/* Bottom Row: GitHub Activity */}
        <m.div variants={itemVariants} className="w-full">
          <SpotlightCard className="w-full border-2 border-black/10 dark:border-white/15 rounded-[2rem] overflow-hidden p-4 sm:p-6 bg-white/80 dark:bg-transparent shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-none backdrop-blur-sm" spotlightColor="rgba(96, 85, 240, 0.1)">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 px-2">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--fg)]">GitHub Activity</h3>
                <p className="text-sm sm:text-base text-[var(--fg-muted)] mt-1">My open source contributions and coding streak</p>
              </div>
              <a
                href="https://github.com/MaverickDanielleAndres"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium px-4 py-2 rounded-full border border-[var(--border-subtle)] text-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-all duration-300"
              >
                View Profile
              </a>
            </div>
 
            <div className="w-full bg-black/[0.02] dark:bg-white/5 backdrop-blur-md border border-[var(--border-subtle)] rounded-xl overflow-hidden p-4 sm:p-6">
              <div ref={calendarScrollRef} className="w-full overflow-x-auto scrollbar-hide">
                <div className="w-max mx-auto min-w-[720px] sm:min-w-0">
                  <GitHubCalendar
                    username="MaverickDanielleAndres"
                    fontSize={12}
                    blockSize={15}
                    blockMargin={4}
                    blockRadius={3}
                    theme={calendarTheme}
                    colorScheme={theme === "light" ? "light" : "dark"}
                  />
                </div>
              </div>
            </div>
          </SpotlightCard>
        </m.div>
      </m.div>

      {/* Background Accents */}
      <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-[var(--accent)] opacity-[0.03] blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-[var(--accent)] opacity-[0.03] blur-[120px] -z-10" />
    </section>
  );
}
