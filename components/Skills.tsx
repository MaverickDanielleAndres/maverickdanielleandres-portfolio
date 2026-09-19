"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { m, AnimatePresence, useInView } from "framer-motion";
import SpotlightCard from "@/components/ui/SpotlightCard";
import {
  Palette, Activity, TrendingUp, Search, Bot, Blocks, Layout,
  Cpu, Database as DbIcon, Settings2, Layers, TestTube,
  Sparkles, Globe, ShoppingCart, Cloud, Server, Link,
  SlidersHorizontal, ChevronDown, Check, RotateCcw
} from "lucide-react";
import type { Variants } from "framer-motion";

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
    id: "frontend-mobile",
    title: "Frontend & Mobile",
    description: "Responsive web & mobile applications built with modern UI frameworks and component architectures",
    skills: ["HTML", "CSS", "JavaScript", "TypeScript", "Expo Go", "Next.js", "Tailwind CSS", "JQuery", "React Native", "React"]
  },
  {
    id: "backend-databases",
    title: "Backend & Databases",
    description: "Robust server logic, database modeling, authentication systems, and scalable REST APIs",
    skills: ["MongoDB", "PHP", "Express", "REST APIs", "MySQL", "PostgreSQL", "Supabase", "Node.js"]
  },
  {
    id: "devops-cloud",
    title: "DevOps, Cloud & IT",
    description: "Infrastructure as code, containerization, cloud hosting, networking & continuous delivery pipelines",
    skills: ["Git", "GitHub", "Docker", "CI/CD", "Jira", "Kubernetes", "AWS", "Networking", "Cisco", "SEO Optimization"]
  },
  {
    id: "ai-automation",
    title: "AI & Automation",
    description: "Autonomous AI agents, prompt engineering, LLM integrations, and custom workflow automations",
    skills: ["Agentic/Prompt Engineering", "Claude Code", "Antigravity", "Cursor", "Minimax", "Copilot", "LLMs/AI Integration", "Zapier", "n8n", "Airtable"]
  },
  {
    id: "design-ai",
    title: "Design / AI",
    description: "High-fidelity UI/UX design, interactive prototypes, generative AI tools & 3D creative assets",
    skills: ["Stitch", "Figma", "Framer", "Canva", "Blender", "UI/UX Design", "Photoshop", "Lovable", "Bolt", "Kimi", "Replit", "v0"]
  },
  {
    id: "cms-qa",
    title: "CMS, QA & Others",
    description: "Custom CMS & e-commerce platforms, automated end-to-end QA testing & productivity suites",
    skills: ["WordPress", "WooCommerce", "Shopify", "Elementor", "Playwright", "MS Office Suite", "Maestro"]
  }
];

export default function Skills() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5% 0px" });
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const totalSkillsCount = CATEGORIES.reduce((acc, c) => acc + c.skills.length, 0);
  const activeCategory = CATEGORIES.find((c) => c.id === selectedCategory);

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

  return (
    <section
      id="skills"
      ref={ref}
      style={{
        background: "var(--bg-about)",
        color: "var(--fg)",
        padding: "1.5rem var(--container-px)",
        position: "relative",
      }}
    >
      <m.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="max-w-[90rem] mx-auto space-y-12"
      >
        <m.div variants={itemVariants} className="w-full">
          <SpotlightCard
            className="w-full border border-black/10 dark:border-white/10 rounded-[2rem] overflow-hidden p-4 sm:p-6 bg-black/[0.02] dark:bg-white/[0.02]"
          >
            <div className="mb-6 px-2 text-center sm:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--fg)]">Core Competencies</h3>
              <p className="text-sm sm:text-base text-[var(--fg-muted)] mt-1">What I Bring</p>
            </div>

            <div className="competencies-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-[repeat(9,minmax(0,1fr))] gap-2.5 sm:gap-3 lg:gap-3.5">
              {COMPETENCIES_CARDS.map((item) => (
                <div key={item.id} className="competency-card group p-2 md:p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-150">
                  <div className="competency-card__icon h-9 w-9 md:h-10 md:w-10 shrink-0 rounded-[10px] bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center transition-transform duration-150 group-hover:scale-105 shadow-sm">
                    <div className="scale-85 md:scale-90">{item.icon}</div>
                  </div>
                  <h4 className="competency-card__title font-bold text-[var(--fg)] leading-tight">
                    {item.title}
                  </h4>
                </div>
              ))}
            </div>
          </SpotlightCard>
        </m.div>

        <m.div variants={itemVariants} className="w-full">
          <SpotlightCard
            className="w-full border border-black/10 dark:border-white/10 rounded-[2rem] overflow-visible p-4 sm:p-6 bg-black/[0.02] dark:bg-white/[0.02]"
          >
            <div className="w-full flex flex-col justify-start text-left">
              {/* Header: Far-Left Title, Center Category Info, Far-Right Filter Controls */}
              <div className="mb-6 sm:mb-8 px-2 flex flex-col gap-3 w-full">
                {/* Main Row: Far Left Title & Far Right Controls */}
                <div className="flex items-center justify-between gap-4 w-full">
                  {/* Left: Section Title & Subtitle */}
                  <div className="flex flex-col text-left shrink-0">
                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--fg)] leading-tight">Tech Stack</h3>
                    <p className="text-xs sm:text-sm text-[var(--fg-muted)] mt-1 leading-tight">Technologies I used</p>
                  </div>

                  {/* Center: Filtered Category Info (Same size as Tech Stack / Technologies I used) */}
                  <div className="flex flex-1 flex-col items-center justify-center text-center px-2 sm:px-4 min-w-0">
                    {activeCategory && (
                      <div
                        key={activeCategory.id}
                        className="flex flex-col items-center justify-center text-center max-w-sm sm:max-w-md lg:max-w-xl animate-fade-in"
                      >
                        <h4 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--fg)] leading-tight text-center">
                          {activeCategory.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-[var(--fg-muted)] mt-1 text-center leading-tight sm:leading-normal">
                          {activeCategory.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right: Filter Controls (Far Right, vertically aligned with title) */}
                  <div ref={filterRef} className="flex items-center justify-end gap-2 shrink-0">
                    {selectedCategory && (
                      <button
                        type="button"
                        onClick={() => setSelectedCategory(null)}
                        className="inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-full text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] bg-black/[0.04] dark:bg-white/[0.04] hover:bg-black/[0.08] dark:hover:bg-white/[0.08] border border-black/10 dark:border-white/10 transition-all duration-150 cursor-pointer shadow-sm shrink-0"
                        aria-label="Reset filter to show all technologies"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Show All</span>
                      </button>
                    )}

                    <div className="relative">
                      <button
                        type="button"
                        id="tech-stack-filter-btn"
                        onClick={() => setIsFilterOpen((prev) => !prev)}
                        aria-expanded={isFilterOpen}
                        aria-haspopup="listbox"
                        aria-label="Filter tech stack categories"
                        className="inline-flex items-center justify-center gap-2 h-9 px-3.5 rounded-full text-xs sm:text-sm font-medium border border-black/10 dark:border-white/10 bg-black/[0.04] dark:bg-white/[0.04] hover:bg-black/[0.08] dark:hover:bg-white/[0.08] text-[var(--fg)] transition-all duration-150 backdrop-blur-md shadow-sm cursor-pointer whitespace-nowrap"
                      >
                        <SlidersHorizontal className="h-3.5 w-3.5 text-[var(--fg-muted)] shrink-0" />
                        <span className="max-w-[120px] sm:max-w-[160px] md:max-w-[190px] truncate">
                          {activeCategory ? activeCategory.title : "All Categories"}
                        </span>
                        <ChevronDown className={`h-3.5 w-3.5 text-[var(--fg-muted)] transition-transform duration-200 shrink-0 ${isFilterOpen ? "rotate-180" : ""}`} />
                      </button>

                      {/* Filter Dropdown */}
                      <AnimatePresence>
                        {isFilterOpen && (
                          <m.div
                            initial={{ opacity: 0, y: -6, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.96 }}
                            transition={{ duration: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            role="listbox"
                            aria-label="Tech Stack Category Filter"
                            className="absolute right-0 top-full mt-2 w-64 sm:w-72 rounded-2xl border border-black/10 dark:border-white/10 bg-[var(--bg-about)] dark:bg-[#181818] shadow-2xl p-1.5 z-40 space-y-0.5 backdrop-blur-xl"
                            style={{ borderColor: "var(--border-subtle)" }}
                          >
                            <button
                              type="button"
                              role="option"
                              aria-selected={selectedCategory === null}
                              onClick={() => {
                                setSelectedCategory(null);
                                setIsFilterOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer ${
                                selectedCategory === null
                                  ? "bg-black/10 dark:bg-white/10 text-[var(--fg)] font-semibold"
                                  : "text-[var(--fg)] hover:bg-black/5 dark:hover:bg-white/5"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 flex items-center justify-center">
                                  {selectedCategory === null && <Check className="h-3.5 w-3.5 text-[var(--fg)]" />}
                                </div>
                                <span>All Technologies</span>
                              </div>
                              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/10 dark:bg-white/10 text-[var(--fg-muted)] font-medium">
                                {totalSkillsCount}
                              </span>
                            </button>

                            <div className="h-[1px] bg-black/10 dark:bg-white/10 my-1 mx-2" />

                            {CATEGORIES.map((cat) => {
                              const isSelected = selectedCategory === cat.id;
                              return (
                                <button
                                  key={cat.id}
                                  type="button"
                                  role="option"
                                  aria-selected={isSelected}
                                  onClick={() => {
                                    setSelectedCategory(cat.id);
                                    setIsFilterOpen(false);
                                  }}
                                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer ${
                                    isSelected
                                      ? "bg-black/10 dark:bg-white/10 text-[var(--fg)] font-semibold"
                                      : "text-[var(--fg)] hover:bg-black/5 dark:hover:bg-white/5"
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 flex items-center justify-center">
                                      {isSelected && <Check className="h-3.5 w-3.5 text-[var(--fg)]" />}
                                    </div>
                                    <span className="truncate">{cat.title}</span>
                                  </div>
                                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/10 dark:bg-white/10 text-[var(--fg-muted)] font-medium shrink-0">
                                    {cat.skills.length}
                                  </span>
                                </button>
                              );
                            })}
                          </m.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic View: All Grid vs Filtered Category */}
              <div className="w-full min-h-[260px] sm:min-h-[280px] flex flex-col justify-center">
                {!activeCategory ? (
                  /* Baseline 3-Column Grid */
                  <div
                    key="all-grid"
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8 text-left w-full animate-fade-in"
                  >
                    {CATEGORIES.map((category) => (
                      <div key={category.id} className="space-y-3 sm:space-y-4 text-left">
                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => setSelectedCategory(category.id)}
                            className="text-base font-bold text-[var(--fg)] hover:opacity-75 transition-opacity text-left cursor-pointer inline-flex items-center gap-1.5 group"
                            title={`Click to focus on ${category.title}`}
                          >
                            <span>{category.title}</span>
                            <span className="text-[10px] opacity-0 group-hover:opacity-100 text-[var(--fg-muted)] font-normal transition-opacity">
                              (expand)
                            </span>
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 sm:gap-2.5">
                          {category.skills.map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="flex-grow text-center px-3 py-1.5 text-[11px] sm:text-xs font-medium border rounded-full bg-black/[0.03] dark:bg-transparent hover:scale-105 transition-transform duration-150 cursor-default shadow-sm"
                              style={{ borderColor: "var(--border-subtle)", color: "var(--fg)" }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Filtered Single Category View: Enlarge and Fill Container */
                  <div
                    key={activeCategory.id}
                    className="w-full flex-1 flex flex-col justify-center py-2 animate-fade-in"
                  >
                    <div
                      className={
                        activeCategory.skills.length === 10
                          ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-4.5 w-full items-stretch"
                          : activeCategory.skills.length === 8
                          ? "grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4.5 md:gap-5 w-full items-stretch"
                          : activeCategory.skills.length === 12
                          ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-3.5 md:gap-4 w-full items-stretch"
                          : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-4.5 md:gap-5 w-full items-stretch"
                      }
                    >
                      {activeCategory.skills.map((skill) => (
                        <div
                          key={skill}
                          className="w-full flex items-center justify-center text-center px-4 sm:px-5 py-6 sm:py-7 md:py-8 min-h-[75px] sm:min-h-[85px] md:min-h-[92px] text-sm sm:text-base md:text-lg lg:text-xl font-bold tracking-tight border rounded-2xl sm:rounded-3xl bg-black/[0.03] dark:bg-white/[0.03] hover:bg-black/[0.07] dark:hover:bg-white/[0.07] border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 transition-all duration-150 cursor-default shadow-sm hover:scale-[1.03]"
                          style={{ color: "var(--fg)" }}
                        >
                          <span>{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </SpotlightCard>
        </m.div>
      </m.div>
    </section>
  );
}

