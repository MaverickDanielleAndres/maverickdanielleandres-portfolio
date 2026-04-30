"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { GitHubCalendar } from "react-github-calendar";
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
  { name: "Next.js", icon: SiNextdotjs, color: "#ffffff" },
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

  return (
    <section 
      id="activity" 
      ref={containerRef}
      className="relative py-20 px-[var(--container-px)] overflow-hidden"
      style={{ background: "var(--bg-about)" }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Top Row: Experience & Tech Stack */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Work Experience */}
          <motion.div variants={itemVariants} className="h-full">
            <SpotlightCard className="h-full flex flex-col justify-between" spotlightColor="rgba(96, 85, 240, 0.15)">
              <div>
                <h3 className="text-xl font-medium mb-8 text-[var(--fg)]">Work Experience</h3>
                <div className="space-y-8">
                  {EXPERIENCE.map((exp, i) => (
                    <div key={i} className="relative pl-6 border-l border-[var(--border-subtle)] group">
                      <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-lg text-[var(--fg)]">{exp.company}</h4>
                        <span className="text-sm font-medium text-[var(--fg-muted)]">{exp.year}</span>
                      </div>
                      <p className="text-[var(--accent)] font-medium text-sm mb-3">{exp.role}</p>
                      <p className="text-sm leading-relaxed text-[var(--fg-muted)] group-hover:text-[var(--fg)] transition-colors duration-300">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* Tech Stack */}
          <motion.div variants={itemVariants} className="h-full">
            <SpotlightCard className="h-full" spotlightColor="rgba(96, 85, 240, 0.15)">
              <h3 className="text-xl font-medium mb-8 text-[var(--fg)]">Current Tech Stack</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {TECH_STACK.map((tech, i) => (
                  <motion.div key={i} whileHover={{ y: -5 }}>
                    <PixelCard 
                      variant="blue" 
                      colors={`${tech.color},${tech.color}88,${tech.color}44`}
                      gap={5}
                      className="w-full h-full aspect-square border-[var(--border-subtle)]"
                    >
                      <div className="flex flex-col items-center justify-center h-full w-full p-3">
                        <tech.icon 
                          size={48} 
                          style={{ color: tech.color }}
                          className="drop-shadow-[0_0_5px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-110"
                        />
                        <span className="text-[8px] uppercase tracking-tighter font-bold text-[var(--fg-muted)] mt-1">
                          {tech.name}
                        </span>
                      </div>
                    </PixelCard>
                  </motion.div>
                ))}
              </div>
            </SpotlightCard>
          </motion.div>
        </div>

        {/* Bottom Row: GitHub Activity */}
        <motion.div variants={itemVariants} className="w-full">
          <SpotlightCard className="w-full overflow-hidden" spotlightColor="rgba(96, 85, 240, 0.1)">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
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
            
            <div className="w-full -mx-8 sm:-mx-20 md:-mx-8 lg:mx-0">
              <div className="w-full py-6 bg-white/5 backdrop-blur-md border-y border-[var(--border-subtle)] overflow-hidden">
                <div className="w-full px-4 overflow-x-auto scrollbar-hide">
                  <GitHubCalendar 
                    username="MaverickDanielleAndres" 
                    fontSize={12}
                    blockSize={18}
                    blockMargin={5}
                    blockRadius={3}
                    theme={calendarTheme}
                    colorScheme={theme === "light" ? "light" : "dark"}
                    style={{
                      width: '100%',
                    }}
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
