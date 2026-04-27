"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import Crosshair from "@/components/ui/Crosshair";
import RotatingText from "@/components/RotatingText";

type Skill = { name: string; level: number; category: string; icon: string };

const SKILLS: Skill[] = [
  { name: "HTML/CSS",    level: 95, category: "Frontend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  { name: "JavaScript",  level: 88, category: "Frontend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "TypeScript",  level: 80, category: "Frontend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { name: "React",       level: 85, category: "Frontend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "Next.js",     level: 82, category: "Frontend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
  { name: "Tailwind CSS",level: 90, category: "Frontend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
  { name: "PHP",         level: 88, category: "Backend",  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
  { name: "Node.js",     level: 80, category: "Backend",  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name: "MySQL",       level: 85, category: "Database", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  { name: "MongoDB",     level: 72, category: "Database", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  { name: "Git & GitHub",level: 88, category: "Tools",    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  { name: "Figma",       level: 82, category: "Design",   icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
  { name: "Networking",  level: 80, category: "IT",       icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" },
  { name: "Linux/CLI",   level: 75, category: "IT",       icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ubuntu/ubuntu-original.svg" },
  { name: "REST APIs",   level: 85, category: "Backend",  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name: "UI/UX Design",level: 80, category: "Design",   icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
];

/** Brand colors for the icon-fill hover effect */
const SKILL_COLORS: Record<string, string> = {
  "HTML/CSS":    "#E34F26",
  "JavaScript":  "#F0DB4F",
  "TypeScript":  "#3178C6",
  "React":       "#61DAFB",
  "Next.js":     "#000000",
  "Tailwind CSS":"#06B6D4",
  "PHP":         "#8892BE",
  "Node.js":     "#339933",
  "MySQL":       "#4479A1",
  "MongoDB":     "#47A248",
  "Git & GitHub":"#F05032",
  "Figma":       "#F24E1E",
  "Networking":  "#FCC624",
  "Linux/CLI":   "#FCC624",
  "REST APIs":   "#339933",
  "UI/UX Design":"#FF6B35",
};

/** Contrasting text color on brand background */
function contrastText(hex: string): string {
  // simple luminance shortcut
  if (!hex.startsWith("#")) return "#fff";
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return (r*299 + g*587 + b*114) / 1000 > 155 ? "#000" : "#fff";
}

const CATEGORIES = ["All", "Frontend", "Backend", "Database", "Design", "Tools", "IT"];

const SOFT_SKILLS = [
  { name: "Communication",   desc: "Clear articulation of ideas across teams" },
  { name: "Teamwork",        desc: "Collaborative mindset in agile environments" },
  { name: "Problem-Solving", desc: "Analytical approach to complex challenges" },
  { name: "Adaptability",    desc: "Quick to learn and pivot when needed" },
  { name: "Time Management", desc: "Reliable delivery on deadlines" },
];

const COMPETENCIES = [
  { title: "Full-Stack Development", desc: "End-to-end web solutions from UI to DB" },
  { title: "IT Infrastructure",      desc: "Networking, Linux admin, system setup" },
  { title: "UI/UX Design",           desc: "User-centered design with Figma" },
  { title: "Database Design",        desc: "Relational & NoSQL, query optimization" },
  { title: "API Integration",        desc: "RESTful APIs, third-party, auth flows" },
  { title: "Version Control",        desc: "Git workflows, code reviews, collaboration" },
];

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [filledSkill, setFilledSkill] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
      style={{
        background: "var(--bg-skills)",
        color: "var(--fg)",
        padding: "clamp(4rem,10vh,7rem) var(--container-px)",
        borderTop: "1px solid var(--border-subtle)",
        position: "relative",
      }}
    >
      <Crosshair containerRef={ref} color="rgba(139,92,246,0.35)" />

      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
        <div>
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
                gap: "0.3em",
              }}
            >
              <span>What I</span>
              <RotatingText
                texts={["Can Offer", "Have Built", "Know Well", "Master"]}
                rotationInterval={2000}
                staggerFrom="last"
                staggerDuration={0.025}
                mainClassName="overflow-hidden justify-center"
                splitLevelClassName="overflow-hidden pb-0.5"
                elementLevelClassName=""
                style={{ color: "var(--accent)" }}
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
              />
            </div>
          )}
        </div>

        {/* Category filter */}
        <motion.div
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-1.5 rounded-full text-xs transition-all"
              style={{
                background: activeCategory === cat ? "var(--fg)" : "transparent",
                color: activeCategory === cat ? "var(--bg)" : "var(--fg-muted)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              {cat}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Skills grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((skill, i) => {
          const isFilled = filledSkill === skill.name;
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
              style={{
                borderRadius: "0.75rem",
                border: "1px solid var(--border-subtle)",
                overflow: "hidden",
                minHeight: 100,
                position: "relative",
                cursor: "default",
                transition: "border-color 0.2s",
                borderColor: isHovered && !isFilled ? "var(--accent)" : undefined,
              }}
            >
              {/* Filled state */}
              <motion.div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "color-mix(in srgb, var(--fg) 10%, transparent)",
                  backdropFilter: "blur(4px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "0.75rem",
                }}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={isFilled ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <img
                  src={skill.icon}
                  alt={skill.name}
                  width={48}
                  height={48}
                />
              </motion.div>

              {/* Normal state */}
              <motion.div
                className="flex flex-col gap-2.5 p-3 sm:gap-3 sm:p-5"
                animate={isFilled ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium leading-tight sm:text-sm">{skill.name}</span>
                  <span className="text-xs" style={{ color: "var(--accent)" }}>
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
                <span className="text-[11px] sm:text-xs" style={{ color: "var(--fg-muted)" }}>
                  {skill.category}
                </span>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* ===== Soft Skills ===== */}
      <div
        className="mt-16 pt-12"
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
        <motion.h3
          style={{ fontSize: "clamp(1.5rem,3vw,2.5rem)", fontWeight: 400, letterSpacing: "-0.01em", marginBottom: "2.5rem" }}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          People &amp; Process
        </motion.h3>
        <div className="flex flex-wrap gap-3">
          {SOFT_SKILLS.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.07 }}
              style={{
                border: "1px solid var(--border-subtle)",
                borderRadius: "0.75rem",
                padding: "1rem 1.25rem",
                minWidth: "160px",
                flex: "1 1 160px",
                cursor: "default",
                transition: "border-color 0.2s",
              }}
              whileHover={{ borderColor: "var(--accent)", scale: 1.02, transition: { duration: 0.15 } }}
            >
              <p className="text-sm font-medium mb-1">{s.name}</p>
              <p className="text-xs" style={{ color: "var(--fg-muted)", lineHeight: 1.4 }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ===== Core Competencies ===== */}
      <div
        className="mt-16 pt-12"
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
          style={{ fontSize: "clamp(1.2rem,2.5vw,2rem)", fontWeight: 400, letterSpacing: "-0.01em", marginBottom: "2rem" }}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          What I Bring
        </motion.h3>

        {/* Compact two-column list  no big cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {COMPETENCIES.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              whileHover={{ x: 12, backgroundColor: "rgba(96, 85, 240, 0.10)" }}
              whileTap={{ x: 10, backgroundColor: "rgba(96, 85, 240, 0.14)" }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.06 }}
              className="group flex items-start gap-3 rounded-md py-4 pr-2 pl-2 sm:pr-3 lg:pr-6 transition-transform duration-200"
              style={{
                borderBottom: "1px solid var(--border-subtle)",
              }}
            >
              {/* Number badge */}
              <span
                className="shrink-0 text-[10px] font-bold mt-0.5 w-5 h-5 flex items-center justify-center rounded"
                style={{ background: "var(--accent)", color: "#fff", opacity: 0.9 }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="text-sm font-medium transition-all duration-200 group-hover:translate-x-1 group-hover:text-[var(--accent)]">{c.title}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--fg-muted)", lineHeight: 1.5 }}>{c.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
