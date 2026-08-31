"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import SpotlightCard from "@/components/ui/SpotlightCard";
import CursorDitherTrail from "@/components/ui/cursor-dither-trail";
import { 
  Palette, Activity, TrendingUp, Search, Bot, Blocks, Layout, 
  Cpu, Database as DbIcon, Settings2, Layers, TestTube, 
  Sparkles, Globe, ShoppingCart, Cloud, Server, Link, Zap, ShieldCheck 
} from "lucide-react";

const COMPETENCIES_CARDS = [
  { id: "1", title: "Graphics Designing", description: "Visual identity, digital assets, and high-fidelity mockups", icon: <Palette className="h-5 w-5 text-[var(--fg)]" /> },
  { id: "20", title: "Workflow Architecture", description: "Streamlining business processes with intelligent integrations", icon: <Activity className="h-5 w-5 text-[var(--fg)]" /> },
  { id: "19", title: "Performance Scaling", description: "High-traffic optimization and responsive infrastructure", icon: <TrendingUp className="h-5 w-5 text-[var(--fg)]" /> },
  { id: "18", title: "SEO Optimization", description: "Advanced technical SEO and search visibility strategies", icon: <Search className="h-5 w-5 text-[var(--fg)]" /> },
  { id: "5", title: "Agentic Engineering", description: "Autonomous AI agents and complex tool-use orchestration", icon: <Bot className="h-5 w-5 text-[var(--fg)]" /> },
  { id: "17", title: "Custom Systems", description: "Bespoke software architecture and tailored business solutions", icon: <Blocks className="h-5 w-5 text-[var(--fg)]" /> },
  { id: "2", title: "Frontend Development", description: "Responsive, interactive, and high-performance user interfaces", icon: <Layout className="h-5 w-5 text-[var(--fg)]" /> },
  { id: "3", title: "Backend Development", description: "Scalable server architecture and business logic implementation", icon: <Cpu className="h-5 w-5 text-[var(--fg)]" /> },
  { id: "4", title: "Database Management", description: "Efficient data modeling, indexing, and optimization", icon: <DbIcon className="h-5 w-5 text-[var(--fg)]" /> },
  { id: "6", title: "Automation", description: "Streamlining repetitive tasks with scripts and workflows", icon: <Settings2 className="h-5 w-5 text-[var(--fg)]" /> },
  { id: "7", title: "DevOps & CI/CD", description: "Automated workflows, deployment pipelines, Docker environments", icon: <Layers className="h-5 w-5 text-[var(--fg)]" /> },
  { id: "8", title: "QA & Testing", description: "End-to-end testing, bug tracking, and reliability assurance", icon: <TestTube className="h-5 w-5 text-[var(--fg)]" /> },
  { id: "9", title: "AI Integration", description: "LLMs, chatbots, and intelligent system features", icon: <Sparkles className="h-5 w-5 text-[var(--fg)]" /> },
  { id: "10", title: "WordPress Development", description: "Custom themes, plugins, and Elementor builds", icon: <Globe className="h-5 w-5 text-[var(--fg)]" /> },
  { id: "11", title: "Shopify Development", description: "E-commerce stores, theme customization, product systems", icon: <ShoppingCart className="h-5 w-5 text-[var(--fg)]" /> },
  { id: "12", title: "Cloud & Deployment", description: "AWS, Vercel, Supabase hosting and scaling", icon: <Cloud className="h-5 w-5 text-[var(--fg)]" /> },
  { id: "13", title: "Backend Engineering", description: "Server logic, authentication, and scalable APIs", icon: <Server className="h-5 w-5 text-[var(--fg)]" /> },
  { id: "14", title: "System Integration", description: "Connecting third-party services and platforms", icon: <Link className="h-5 w-5 text-[var(--fg)]" /> },
];

const CATEGORIES = [
  {
    title: "Frontend & Mobile",
    skills: ["HTML", "CSS", "JavaScript", "TypeScript", "Expo Go", "Next.js", "Tailwind CSS", "JQuery", "React Native", "React"]
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
        padding: "1.5rem var(--container-px)",
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
            className="w-full border-2 border-black/10 dark:border-white/15 rounded-[2rem] overflow-hidden p-4 sm:p-6 bg-white/80 dark:bg-transparent shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-none backdrop-blur-sm" 
            spotlightColor="rgba(96, 85, 240, 0.15)"
          >
            <div className="mb-6 px-2 text-left">
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--fg)]">Core Competencies</h3>
              <p className="text-sm sm:text-base text-[var(--fg-muted)] mt-1">What I Bring</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
              {COMPETENCIES_CARDS.map((item) => (
                <div key={item.id} className="flex items-center gap-3.5 group p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200">
                  <div className="h-10 w-10 shrink-0 rounded-[10px] bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm">
                    <div className="scale-90">{item.icon}</div>
                  </div>
                  <h4 className="text-[13px] sm:text-sm font-bold text-[var(--fg)] leading-tight">
                    {item.title}
                  </h4>
                </div>
              ))}
            </div>
          </SpotlightCard>
        </motion.div>

        <motion.div variants={itemVariants} className="w-full">
          <SpotlightCard 
            className="w-full border-2 border-black/10 dark:border-white/15 rounded-[2rem] overflow-hidden p-4 sm:p-6 bg-white/80 dark:bg-transparent shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-none backdrop-blur-sm" 
            spotlightColor="rgba(96, 85, 240, 0.15)"
          >
            <div className="w-full flex flex-col justify-start text-left">
              <div className="mb-6 px-2 text-left">
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--fg)]">Tech Stack</h3>
                <p className="text-sm sm:text-base text-[var(--fg-muted)] mt-1">Technologies I used</p>
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
                          className="flex-grow text-center px-3 py-1.5 text-[11px] sm:text-xs font-medium border rounded-full bg-black/[0.03] dark:bg-transparent hover:scale-105 transition-all duration-200 cursor-default shadow-sm"
                          style={{ borderColor: "var(--border-subtle)", color: "var(--fg)" }}
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
