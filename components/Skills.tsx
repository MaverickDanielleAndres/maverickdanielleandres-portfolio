"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import CursorDitherTrail from "@/components/ui/cursor-dither-trail";
import RotatingText from "@/components/RotatingText";
import { Component as MorphingCardStack } from "@/components/ui/morphing-card-stack";
import { Layers, TestTube, Bot, Globe, ShoppingCart, Cloud, Server, Link, Zap, ShieldCheck, Grid, LayoutGrid, Palette, Layout, Cpu, Database as DbIcon, Settings2, Sparkles, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import MagnifiedBento from "@/components/ui/magnified-bento";


type Skill = { name: string; level: number; category: string; icon: string; invertOnDark?: boolean };

const SKILLS: Skill[] = [
  // Frontend
  { name: "HTML/CSS", level: 95, category: "Frontend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  { name: "JavaScript", level: 88, category: "Frontend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "TypeScript", level: 80, category: "Frontend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { name: "React", level: 85, category: "Frontend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "Next.js", level: 82, category: "Frontend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", invertOnDark: true },
  { name: "Tailwind CSS", level: 90, category: "Frontend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
  { name: "JQuery", level: 70, category: "Frontend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jquery/jquery-original.svg" },

  // Mobile
  { name: "React Native", level: 85, category: "Mobile", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "Expo Go", level: 80, category: "Mobile", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/expo.svg", invertOnDark: true },

  // Backend
  { name: "PHP", level: 90, category: "Backend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
  { name: "Node.js", level: 90, category: "Backend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name: "Express", level: 90, category: "Backend", icon: "/Icon/Express.png" },
  { name: "REST APIs", level: 95, category: "Backend", icon: "/Icon/RESTAPI.png" },
  { name: "Postman", level: 95, category: "Backend", icon: "https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg" },

  // Database
  { name: "MySQL", level: 90, category: "Database", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  { name: "PostgreSQL", level: 90, category: "Database", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
  { name: "Supabase", level: 95, category: "Database", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg" },
  { name: "Airtable", level: 85, category: "Database", icon: "/Icon/airtable.png" },
  { name: "MongoDB", level: 60, category: "Database", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },

  // Design
  { name: "Figma", level: 100, category: "Design", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
  { name: "UI/UX Design", level: 100, category: "Design", icon: "/Icon/uiuximage.png" },
  { name: "Canva", level: 100, category: "Design", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg" },
  { name: "Stitch", level: 90, category: "Design", icon: "/Icon/stitch.png" },
  { name: "Framer", level: 70, category: "Design", icon: "https://www.vectorlogo.zone/logos/framer/framer-icon.svg", invertOnDark: true },
  { name: "Blender", level: 50, category: "Design", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blender/blender-original.svg" },

  // AI & Agentic Engineering
  { name: "Prompt Engineering", level: 100, category: "AI", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/openai/openai-original.svg", invertOnDark: true },
  { name: "LLMs / AI", level: 75, category: "AI", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" },
  { name: "Agentic Engineering", level: 100, category: "Agentic", icon: "/Icon/Agentic Engineering.png" },

  // DevOps & Cloud
  { name: "Git & GitHub", level: 100, category: "DevOps", icon: "/Icon/git and github.png" },
  { name: "Docker", level: 70, category: "DevOps", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
  { name: "CI/CD", level: 70, category: "DevOps", icon: "/Icon/cicd.png" },
  { name: "Jira", level: 70, category: "DevOps", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg" },
  { name: "Kubernetes", level: 60, category: "DevOps", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg" },
  { name: "AWS", level: 70, category: "Cloud", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg", invertOnDark: true },

  // WordPress & Automation
  { name: "WordPress", level: 85, category: "WordPress", icon: "/Icon/wordpress.png" },
  { name: "Elementor", level: 85, category: "WordPress", icon: "/Icon/Elementor.png" },
  { name: "Shopify", level: 85, category: "WordPress", icon: "/Icon/shopify.png" },
  { name: "Zapier", level: 90, category: "Automation", icon: "/Icon/zapier.png" },

  // IT & QA
  { name: "Networking", level: 85, category: "IT", icon: "https://www.vectorlogo.zone/logos/cisco/cisco-icon.svg" },
  { name: "Linux/CLI", level: 60, category: "IT", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ubuntu/ubuntu-original.svg" },
  { name: "Playwright", level: 75, category: "QA", icon: "https://playwright.dev/img/playwright-logo.svg" },

  // MS Office
  { name: "MS Office Suite", level: 100, category: "MS Office", icon: "https://www.vectorlogo.zone/logos/microsoft/microsoft-icon.svg" },
];

const CATEGORIES = ["All", "Frontend", "Backend", "Database", "Design", "AI", "Agentic", "DevOps", "Cloud", "WordPress", "Automation", "IT", "QA", "Mobile", "MS Office"];



const COMPETENCIES_CARDS = [
  { id: "1", title: "Graphics Designing", description: "Visual identity, digital assets, and high-fidelity mockups", icon: <Palette className="h-5 w-5" /> },
  { id: "2", title: "Frontend Development", description: "Responsive, interactive, and high-performance user interfaces", icon: <Layout className="h-5 w-5" /> },
  { id: "3", title: "Backend Development", description: "Scalable server architecture and business logic implementation", icon: <Cpu className="h-5 w-5" /> },
  { id: "4", title: "Database Management", description: "Efficient data modeling, indexing, and optimization", icon: <DbIcon className="h-5 w-5" /> },
  { id: "5", title: "Agentic Engineering", description: "Autonomous AI agents and complex tool-use orchestration", icon: <Bot className="h-5 w-5" /> },
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
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [filledSkill, setFilledSkill] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sectionHovered, setSectionHovered] = useState(false);
  const [showAllIcons, setShowAllIcons] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleDropdownMouseMove = (e: React.MouseEvent) => {
    if (!dropdownRef.current) return;
    const rect = dropdownRef.current.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    const threshold = 60; // px from top/bottom to trigger scroll
    const speed = 8; // scroll speed

    if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);

    if (relativeY < threshold && dropdownRef.current.scrollTop > 0) {
      scrollIntervalRef.current = setInterval(() => {
        if (dropdownRef.current) dropdownRef.current.scrollTop -= speed;
      }, 20);
    } else if (relativeY > rect.height - threshold) {
      scrollIntervalRef.current = setInterval(() => {
        if (dropdownRef.current) dropdownRef.current.scrollTop += speed;
      }, 20);
    }
  };

  const stopAutoScroll = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5% 0px" });

  const filtered =
    activeCategory === "All" ? SKILLS : SKILLS.filter((s) => s.category === activeCategory);

  const handleSkillEnter = useCallback((skillName: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setHoveredSkill(skillName);
    setFilledSkill(skillName);
  }, []);

  const handleSkillLeave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setHoveredSkill(null);
    setFilledSkill(null);
  }, []);

  return (
    <section
      id="skills"
      ref={ref}
      onMouseEnter={() => setSectionHovered(true)}
      onMouseLeave={() => setSectionHovered(false)}
      style={{
        background: "var(--bg-skills)",
        color: "var(--fg)",
        padding: "clamp(4rem,10vh,7rem) var(--container-px)",
        borderTop: "1px solid var(--border-subtle)",
        position: "relative",
      }}
    >
      <CursorDitherTrail
        trailColor="#8b5cf6"
        dotSize={6}
        fadeDuration={200}
        isActive={sectionHovered}
      />

      {/* Header */}
      <div className="flex flex-col items-center text-center gap-6 mb-16">
        <div className="flex flex-col items-center">
          <motion.p
            className="text-xs uppercase tracking-[0.18em] mb-3"
            style={{ color: "var(--fg-muted)" }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            Skills
          </motion.p>
          {inView && (
            <div
              style={{
                fontSize: "clamp(1.5rem,3vw,2.5rem)",
                fontWeight: 400,
                lineHeight: 1.1,
                letterSpacing: "-0.015em",
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "0.3em",
              }}
            >
              <span>What I</span>
              <RotatingText
                texts={["Can Work With", "Have Built", "Know Well", "Master"]}
                rotationInterval={2000}
                staggerFrom="last"
                staggerDuration={0.025}
                mainClassName="overflow-hidden justify-center whitespace-nowrap"
                splitLevelClassName="overflow-hidden pb-0.5 whitespace-nowrap"
                elementLevelClassName="whitespace-nowrap"
                style={{ color: "var(--accent)", whiteSpace: "nowrap" }}
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
              />
            </div>
          )}
        </div>

        {/* Category filter + Toggle */}
        <div className="flex items-center justify-center gap-3 w-full max-w-md mx-auto px-4">
          {/* Universal Filter Dropdown */}
          <div className="relative flex-1 max-w-[240px]">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full flex items-center justify-between bg-secondary/50 border border-border/50 rounded-xl px-4 py-2.5 text-sm font-bold text-foreground transition-all hover:border-primary/30"
            >
              <span className="truncate">{activeCategory === "All" ? "Select Category" : activeCategory}</span>
              <motion.span
                animate={{ rotate: isFilterOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="ml-2 text-muted-foreground"
              >
                <LayoutGrid size={14} />
              </motion.span>
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <>
                  {/* Backdrop for closing */}
                  <div 
                    className="fixed inset-0 z-40 bg-transparent" 
                    onClick={() => setIsFilterOpen(false)} 
                  />
                  <motion.div
                    ref={dropdownRef}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 5, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    onMouseMove={handleDropdownMouseMove}
                    onMouseLeave={stopAutoScroll}
                    className="absolute top-full left-0 right-0 z-50 mt-1 bg-background/95 backdrop-blur-xl border border-border shadow-2xl rounded-xl overflow-hidden max-h-[300px] overflow-y-auto scrollbar-hide"
                  >
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setActiveCategory(cat);
                          setIsFilterOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-secondary",
                          activeCategory === cat ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setShowAllIcons(!showAllIcons)}
            className={cn(
              "shrink-0 p-2.5 rounded-xl border transition-all duration-300 flex items-center justify-center",
              showAllIcons
                ? "bg-muted/30 border-muted text-foreground/80"
                : "bg-transparent border-border/30 text-muted-foreground/50 hover:text-muted-foreground hover:border-border/60"
            )}
            title={showAllIcons ? "Hide Skill Icons" : "Show All Skill Icons"}
            aria-label={showAllIcons ? "Hide Skill Icons" : "Show All Skill Icons"}
          >
            {showAllIcons ? <EyeOff size={16} strokeWidth={2} /> : <Eye size={16} strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* Skills grid - Optimized for 6 columns */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-[1400px] mx-auto">
        {filtered.map((skill, i) => {
          const isFilled = showAllIcons || filledSkill === skill.name;
          const isHovered = hoveredSkill === skill.name;

          return (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              onMouseEnter={() => handleSkillEnter(skill.name)}
              onMouseLeave={handleSkillLeave}
              onTouchStart={() => handleSkillEnter(skill.name)}
              onTouchEnd={handleSkillLeave}
              onTouchCancel={handleSkillLeave}
              className="min-h-[100px] w-[calc(50%-0.75rem)] sm:w-full sm:max-w-[200px] relative cursor-default transition-all duration-200"
              style={{
                borderRadius: "0.75rem",
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: isHovered && !isFilled ? "var(--accent)" : "var(--border-subtle)",
                overflow: "hidden",
                background: showAllIcons ? "transparent" : "rgba(255,255,255,0.02)",
              }}
            >
              {/* Filled state / Icon Only state */}
              <motion.div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: showAllIcons ? "transparent" : "color-mix(in srgb, var(--fg) 10%, transparent)",
                  backdropFilter: showAllIcons ? "none" : "blur(4px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "0.75rem",
                }}
                initial={false}
                animate={isFilled ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className={`relative w-12 h-12 ${skill.invertOnDark ? 'dark:invert dark:brightness-200' : ''}`}>
                  <Image
                    src={skill.icon}
                    alt={skill.name}
                    fill
                    className="object-contain"
                    unoptimized={true}
                    loading="lazy"
                    onError={(e: any) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(skill.name)}&background=random&color=fff`;
                    }}
                  />
                </div>
              </motion.div>

              {/* Normal state (Details) */}
              <motion.div
                className="flex flex-col gap-2 p-3 sm:gap-2.5 sm:p-4 h-full justify-center"
                animate={isFilled ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold leading-tight sm:text-sm">{skill.name}</span>
                  <span className="text-[10px] font-black" style={{ color: "var(--accent)" }}>
                    {skill.level}%
                  </span>
                </div>
                <div
                  className="h-0.5 w-full rounded-full overflow-hidden"
                  style={{ background: "var(--border-subtle)" }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "var(--accent)" }}
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${skill.level}%` } : {}}
                    transition={{ duration: 0.9, delay: 0.3 + i * 0.03, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--fg-muted)" }}>
                  {skill.category}
                </span>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* ===== Core Competencies ===== */}
      <div
        className="mt-24 pt-16 flex flex-col items-center text-center"
        style={{ borderTop: "1px solid var(--border-subtle)" }}
      >
        <motion.p
          className="text-xs uppercase tracking-[0.18em] mb-3"
          style={{ color: "var(--fg-muted)" }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Core Competencies
        </motion.p>
        <motion.h3
          style={{ fontSize: "clamp(1.5rem,3vw,2.5rem)", fontWeight: 400, letterSpacing: "-0.01em", marginBottom: "2rem" }}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          What I Bring
        </motion.h3>

        <div className="w-full max-w-7xl text-left -mb-10">
          <MorphingCardStack cards={COMPETENCIES_CARDS} defaultLayout="grid" />
        </div>
      </div>

      {/* ===== Soft Skills ===== */}
      <div
        className="mt-24 pt-16 flex flex-col items-center text-center"
        style={{ borderTop: "1px solid var(--border-subtle)" }}
      >
        <motion.p
          className="text-xs uppercase tracking-[0.18em] mb-3"
          style={{ color: "var(--fg-muted)" }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Soft Skills
        </motion.p>
        
        <div className="w-full max-w-4xl mx-auto">
          <MagnifiedBento />
        </div>
      </div>
    </section>
  );
}
