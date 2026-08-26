"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import SpotlightCard from "@/components/ui/SpotlightCard";
import CursorDitherTrail from "@/components/ui/cursor-dither-trail";

const CATEGORIES = [
  {
    title: "Frontend & Mobile",
    skills: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS", "JQuery", "React Native", "Expo Go"]
  },
  {
    title: "Backend & Databases",
    skills: ["MongoDB", "PHP", "Express", "REST APIs", "MySQL", "PostgreSQL", "Supabase", "Node.js"]
  },
  {
    title: "DevOps, Cloud & IT",
    skills: ["Git", "GitHub", "Docker", "CI/CD", "Jira", "Kubernetes", "AWS", "Networking", "Cisco", "SEO Optimization"]
  },
  {
    title: "AI & Automation",
    skills: ["Agentic/Prompt Engineering", "Claude Code", "Antigravity", "Cursor", "Minimax", "Copilot", "LLMs/AI Integration", "Zapier", "n8n", "Airtable"]
  },
  {
    title: "Design / AI",
    skills: ["Stitch", "Figma", "Framer", "Canva", "Blender", "UI/UX Design", "Photoshop", "Lovable", "Bolt", "Kimi", "Replit", "v0"]
  },
  {
    title: "CMS, QA & Others",
    skills: ["WordPress", "WooCommerce", "Shopify", "Elementor", "Playwright", "MS Office Suite", "Maestro"]
  }
];



export default function Skills() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5% 0px" });
  const [sectionHovered, setSectionHovered] = useState(false);

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
      id="skills"
      ref={ref}
      onMouseEnter={() => setSectionHovered(true)}
      onMouseLeave={() => setSectionHovered(false)}
      style={{
        background: "var(--bg-about)",
        color: "var(--fg)",
        padding: "0 var(--container-px) clamp(4rem,10vh,7rem)",
        position: "relative",
      }}
    >
      <CursorDitherTrail
        trailColor="#8b5cf6"
        dotSize={6}
        fadeDuration={200}
        isActive={sectionHovered}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="max-w-[90rem] mx-auto space-y-12"
      >
        <motion.div variants={itemVariants} className="w-full">
          <SpotlightCard 
            className="w-full border-2 border-black/15 dark:border-white/15 rounded-[2rem] overflow-hidden px-6 py-8 sm:px-10 sm:py-10" 
            spotlightColor="rgba(96, 85, 240, 0.15)"
          >
            <div className="w-full flex flex-col justify-start text-left">
              <div className="mb-7 text-center sm:text-left">
                <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--fg)] mb-1">Tech Stack</h3>
                <p className="text-xs font-bold text-[var(--accent)] uppercase tracking-widest">
                  Technologies used by Maverick.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8">
                {CATEGORIES.map((category, idx) => (
                  <div key={idx} className="space-y-3 sm:space-y-4">
                    <h4 className="text-base font-bold text-[var(--fg)]">
                      {category.title}
                    </h4>
                    <div className="flex flex-wrap gap-2 sm:gap-2.5">
                      {category.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="flex-grow text-center px-3 py-1.5 text-[11px] sm:text-xs font-medium border rounded-full bg-transparent hover:scale-105 transition-all duration-200 cursor-default shadow-sm"
                          style={{ borderColor: "var(--fg)", color: "var(--fg)" }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SpotlightCard>
        </motion.div>
      </motion.div>
    </section>
  );
}
