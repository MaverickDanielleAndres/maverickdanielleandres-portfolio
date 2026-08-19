"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import SpotlightCard from "@/components/ui/SpotlightCard";
import CursorDitherTrail from "@/components/ui/cursor-dither-trail";
import { Component as MorphingCardStack } from "@/components/ui/morphing-card-stack";
import { Layers, TestTube, Bot, Globe, ShoppingCart, Cloud, Server, Link, Zap, ShieldCheck, Palette, Layout, Cpu, Database as DbIcon, Settings2, Sparkles, TrendingUp, Blocks, Search, Activity } from "lucide-react";

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

const COMPETENCIES_CARDS = [
  { id: "1", title: "Graphics Designing", description: "Visual identity, digital assets, and high-fidelity mockups", icon: <Palette className="h-5 w-5" /> },
  { id: "20", title: "Workflow Architecture", description: "Streamlining business processes with intelligent integrations", icon: <Activity className="h-5 w-5" /> },
  { id: "19", title: "Performance Scaling", description: "High-traffic optimization and responsive infrastructure", icon: <TrendingUp className="h-5 w-5" /> },
  { id: "18", title: "SEO Optimization", description: "Advanced technical SEO and search visibility strategies", icon: <Search className="h-5 w-5" /> },
  { id: "5", title: "Agentic Engineering", description: "Autonomous AI agents and complex tool-use orchestration", icon: <Bot className="h-5 w-5" /> },
  { id: "17", title: "Custom Systems", description: "Bespoke software architecture and tailored business solutions", icon: <Blocks className="h-5 w-5" /> },
  { id: "2", title: "Frontend Development", description: "Responsive, interactive, and high-performance user interfaces", icon: <Layout className="h-5 w-5" /> },
  { id: "3", title: "Backend Development", description: "Scalable server architecture and business logic implementation", icon: <Cpu className="h-5 w-5" /> },
  { id: "4", title: "Database Management", description: "Efficient data modeling, indexing, and optimization", icon: <DbIcon className="h-5 w-5" /> },
  { id: "6", title: "Automation", description: "Streamlining repetitive tasks with scripts and workflows", icon: <Settings2 className="h-5 w-5" /> },
  { id: "7", title: "DevOps & CI/CD", description: "Automated workflows, deployment pipelines, Docker environments", icon: <Layers className="h-5 w-5" /> },
  { id: "8", title: "QA & Testing", description: "End-to-end testing, bug tracking, and reliability assurance", icon: <TestTube className="h-5 w-5" /> },
  { id: "9", title: "AI Integration", description: "LLMs, chatbots, and intelligent system features", icon: <Sparkles className="h-5 w-5" /> },
  { id: "10", title: "WordPress Development", description: "Custom themes, plugins, and Elementor builds", icon: <Globe className="h-5 w-5" /> },
  { id: "11", title: "Shopify Development", description: "E-commerce stores, theme customization, product systems", icon: <ShoppingCart className="h-5 w-5" /> },
  { id: "12", title: "Cloud & Deployment", description: "AWS, Vercel, Supabase hosting and scaling", icon: <Cloud className="h-5 w-5" /> },
  { id: "13", title: "Backend Engineering", description: "Server logic, authentication, and scalable APIs", icon: <Server className="h-5 w-5" /> },
  { id: "14", title: "System Integration", description: "Connecting third-party services and platforms", icon: <Link className="h-5 w-5" /> },
  { id: "15", title: "Debugging & Optimization", description: "Performance tuning and issue resolution", icon: <Zap className="h-5 w-5" /> },
  { id: "16", title: "Security Fundamentals", description: "Secure coding and system protection", icon: <ShieldCheck className="h-5 w-5" /> },
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
            className="w-full border-2 border-black/15 dark:border-white/15 rounded-[2rem] overflow-hidden p-0" 
            spotlightColor="rgba(96, 85, 240, 0.15)"
          >
            <div className="flex flex-col lg:flex-row w-full relative min-h-[650px]">
                
              {/* Left Section - 30% */}
              <div className="w-full lg:w-[30%] pt-8 px-8 pb-2 sm:pt-12 sm:px-12 sm:pb-4 lg:pb-12 flex flex-col justify-center items-center text-center border-b lg:border-b-0 border-black/10 dark:border-white/10">
                <p className="text-xs font-bold uppercase tracking-[0.18em] mb-3" style={{ color: "var(--fg-muted)" }}>
                  Core Competencies
                </p>
                <h3 className="text-4xl sm:text-5xl font-medium tracking-tight text-[var(--fg)] mb-8">
                  What I Bring
                </h3>
                
                <div className="w-full flex flex-col items-center justify-center -mt-8">
                  <MorphingCardStack cards={COMPETENCIES_CARDS} defaultLayout="stack" />
                </div>
              </div>

              {/* Right Section - 70% */}
              <div className="w-full lg:w-[70%] pt-6 px-8 pb-8 sm:pt-8 sm:px-12 sm:pb-12 lg:pt-12 flex flex-col">
                <div className="mb-8">
                  <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--fg)] mb-2">Tech Stack</h3>
                  <p className="text-xs font-bold text-[var(--accent)] uppercase tracking-widest">
                    Technologies used by Maverick.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8 sm:gap-y-10">
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

            </div>
          </SpotlightCard>
        </motion.div>
      </motion.div>
    </section>
  );
}
