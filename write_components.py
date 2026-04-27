"""Script to write all redesigned components."""
import os

BASE = r"d:\portfolio\maverickdanielleandres-portfolio\components"


# ─── About.tsx ───────────────────────────────────────────────────────────────
about = r'''"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Balancer from "react-wrap-balancer";

const PHRASE =
  "Helping ideas come to life in the digital era. Together we will build something meaningful. Clean code, purposeful design, always on the cutting edge.";

function WordReveal({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const words = text.split(" ");
  return (
    <div
      ref={ref}
      style={{ display: "flex", flexWrap: "wrap", columnGap: "0.25em" }}
    >
      {words.map((word, i) => (
        <span
          key={i}
          style={{ overflow: "hidden", display: "inline-block" }}
        >
          <motion.span
            style={{ display: "inline-block" }}
            initial={{ y: "110%" }}
            animate={inView ? { y: 0 } : { y: "110%" }}
            transition={{
              duration: 0.7,
              delay: i * 0.04,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </div>
  );
}

const AWARDS = [
  { sem: "1st Sem AY 2022-2023", award: "Dean's Lister" },
  { sem: "2nd Sem AY 2022-2023", award: "President's Lister" },
  { sem: "1st Sem AY 2023-2024", award: "President's Lister" },
  { sem: "2nd Sem AY 2023-2024", award: "President's Lister" },
  { sem: "1st Sem AY 2024-2025", award: "President's Lister" },
];

export default function About() {
  const [awardsOpen, setAwardsOpen] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section
      id="about"
      ref={ref}
      className="section-about"
      style={{
        background: "var(--bg)",
        color: "var(--fg)",
        padding: "clamp(5rem,12vh,9rem) var(--container-px)",
      }}
    >
      {/* Label */}
      <motion.p
        className="text-xs uppercase tracking-[0.18em] mb-10"
        style={{ color: "var(--fg-muted)" }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
      >
        About me
      </motion.p>

      {/* Two-column */}
      <div
        className="flex flex-wrap"
        style={{ gap: "clamp(2rem,6vw,7rem)" }}
      >
        {/* Left — big phrase */}
        <div
          style={{
            flex: "1 1 55%",
            fontSize: "clamp(1.6rem,3.4vw,3rem)",
            fontWeight: 400,
            lineHeight: 1.18,
            letterSpacing: "-0.015em",
          }}
        >
          <WordReveal text={PHRASE} />
        </div>

        {/* Right — bio + circle button */}
        <div
          style={{ flex: "1 1 28%", minWidth: "240px" }}
          className="flex flex-col justify-between gap-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <Balancer
              as="p"
              className="text-sm leading-relaxed"
              style={{ color: "var(--fg-muted)" }}
            >
              {`I'm Maverick, a full-stack web developer and IT specialist with
              experience in PHP, JavaScript, React, Node.js, and database-driven
              applications. I focus on creating clean, efficient, user-centered
              digital solutions that make an impact.`}
            </Balancer>
            <Balancer
              as="p"
              className="text-sm leading-relaxed mt-4"
              style={{ color: "var(--fg-muted)" }}
            >
              {`When not coding, I explore new technologies, side projects,
              and sharpen my networking and sysadmin skills.`}
            </Balancer>

            {/* Education */}
            <div
              className="mt-8 pt-6"
              style={{ borderTop: "1px solid var(--border-subtle)" }}
            >
              <p
                className="text-xs uppercase tracking-widest mb-3"
                style={{ color: "var(--fg-muted)" }}
              >
                Education
              </p>
              <p className="text-sm font-medium">
                Pamantasan ng Lungsod ng Pasig
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--fg-muted)" }}>
                2022 – 2026 &middot; GWA: 1.50
              </p>
              <button
                onClick={() => setAwardsOpen(true)}
                className="mt-3 text-xs underline underline-offset-2 hover:opacity-70 transition-opacity"
                style={{ color: "var(--accent)" }}
              >
                Academic Awards
              </button>
            </div>
          </motion.div>

          {/* Circle CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="self-start"
          >
            <a
              href="/Files/Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-full text-sm font-light hover:scale-105 transition-transform"
              style={{
                width: 120,
                height: 120,
                background: "var(--fg)",
                color: "var(--bg)",
                textAlign: "center",
                lineHeight: 1.3,
              }}
            >
              Download
              <br />
              CV
            </a>
          </motion.div>
        </div>
      </div>

      {/* Awards Modal */}
      {awardsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)",
          }}
          onClick={() => setAwardsOpen(false)}
        >
          <motion.div
            className="relative w-full max-w-md rounded-2xl p-8"
            style={{ background: "var(--bg)", color: "var(--fg)" }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-medium mb-6">Academic Awards</h3>
            <ul className="flex flex-col gap-3">
              {AWARDS.map((a, i) => (
                <li key={i} className="flex justify-between text-sm">
                  <span style={{ color: "var(--fg-muted)" }}>{a.sem}</span>
                  <span className="font-medium">{a.award}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setAwardsOpen(false)}
              className="absolute top-5 right-5 text-xs opacity-40 hover:opacity-80"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </section>
  );
}
'''

# ─── Projects.tsx ─────────────────────────────────────────────────────────────
projects = r'''"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

type Project = {
  id: number;
  title: string;
  category: string;
  year: string;
  description: string;
  tech: string[];
  image: string;
  screenshots: string[];
  github?: string;
  live?: string;
  contributions: string[];
};

const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Barangay Health System",
    category: "Full-Stack Web",
    year: "2024",
    description:
      "A comprehensive digital health management system for barangay health centers, enabling efficient patient records, appointment scheduling, and health monitoring.",
    tech: ["PHP", "MySQL", "Bootstrap", "JavaScript"],
    image: "/Projects/Barangay Health System/BHS-1.png",
    screenshots: [
      "/Projects/Barangay Health System/BHS-1.png",
      "/Projects/Barangay Health System/BHS-2.png",
      "/Projects/Barangay Health System/BHS-3.png",
    ],
    github: "https://github.com/MaverickDanielleAndres",
    contributions: [
      "Designed and implemented the full-stack architecture",
      "Built patient records management system",
      "Developed appointment scheduling module",
    ],
  },
  {
    id: 2,
    title: "E-Community Platform",
    category: "Web Application",
    year: "2023",
    description:
      "A community engagement platform connecting residents with local services, announcements, and community events.",
    tech: ["React", "Node.js", "MongoDB", "Express"],
    image: "/Projects/E-Community/EC-1.png",
    screenshots: ["/Projects/E-Community/EC-1.png"],
    github: "https://github.com/MaverickDanielleAndres",
    contributions: [
      "Built the frontend with React",
      "Implemented real-time notifications",
      "Designed the community feed system",
    ],
  },
  {
    id: 3,
    title: "Gym Registration System",
    category: "Management System",
    year: "2023",
    description:
      "A gym membership and registration management system with member tracking, payment processing, and class scheduling.",
    tech: ["PHP", "MySQL", "Bootstrap", "jQuery"],
    image: "/Projects/Gym Registration/GR-1.png",
    screenshots: ["/Projects/Gym Registration/GR-1.png"],
    github: "https://github.com/MaverickDanielleAndres",
    contributions: [
      "Developed member registration and tracking",
      "Built payment integration module",
      "Implemented class scheduling system",
    ],
  },
  {
    id: 4,
    title: "Learning Management System",
    category: "Education Platform",
    year: "2024",
    description:
      "A full-featured LMS for schools with course management, student tracking, assignments, and grading functionality.",
    tech: ["PHP", "MySQL", "Bootstrap", "JavaScript"],
    image: "/Projects/Learning Management System/LMS-1.png",
    screenshots: ["/Projects/Learning Management System/LMS-1.png"],
    github: "https://github.com/MaverickDanielleAndres",
    contributions: [
      "Architected the full LMS platform",
      "Built course and lesson management",
      "Implemented grading and assessment tools",
    ],
  },
  {
    id: 5,
    title: "Figma Design Projects",
    category: "UI/UX Design",
    year: "2023–2024",
    description:
      "A collection of UI/UX design projects created in Figma, showcasing wireframes, prototypes, and high-fidelity designs.",
    tech: ["Figma", "UI/UX", "Prototyping"],
    image: "/Projects/Figma Designs/FD-1.png",
    screenshots: ["/Projects/Figma Designs/FD-1.png"],
    contributions: [
      "Created wireframes and prototypes",
      "Designed high-fidelity UI mockups",
      "Conducted user research and testing",
    ],
  },
];

function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight")
        setActiveImg((i) => Math.min(i + 1, project.screenshots.length - 1));
      if (e.key === "ArrowLeft") setActiveImg((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, project.screenshots.length]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-6"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-4xl rounded-t-3xl sm:rounded-2xl overflow-hidden"
        style={{ background: "var(--bg)", color: "var(--fg)", maxHeight: "90vh" }}
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full hover:opacity-60 transition-opacity"
          style={{ background: "var(--fg)", color: "var(--bg)" }}
        >
          <X size={16} />
        </button>

        <div className="overflow-y-auto" style={{ maxHeight: "90vh" }}>
          {/* Screenshot */}
          <div
            className="relative w-full"
            style={{ aspectRatio: "16/9", background: "var(--muted)" }}
          >
            <Image
              src={project.screenshots[activeImg]}
              alt={project.title}
              fill
              className="object-cover"
            />
            {project.screenshots.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImg((i) => Math.max(i - 1, 0))}
                  disabled={activeImg === 0}
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full flex items-center justify-center disabled:opacity-30"
                  style={{ background: "rgba(0,0,0,0.5)", color: "#fff" }}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() =>
                    setActiveImg((i) =>
                      Math.min(i + 1, project.screenshots.length - 1)
                    )
                  }
                  disabled={activeImg === project.screenshots.length - 1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full flex items-center justify-center disabled:opacity-30"
                  style={{ background: "rgba(0,0,0,0.5)", color: "#fff" }}
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>

          {/* Info */}
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p
                  className="text-xs uppercase tracking-widest mb-1"
                  style={{ color: "var(--fg-muted)" }}
                >
                  {project.category} &middot; {project.year}
                </p>
                <h2 className="text-2xl font-medium">{project.title}</h2>
              </div>
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm hover:opacity-70 transition-opacity"
                  style={{ color: "var(--accent)" }}
                >
                  GitHub <ArrowUpRight size={14} />
                </a>
              )}
            </div>

            <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--fg-muted)" }}>
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full text-xs"
                  style={{
                    background: "var(--fg)",
                    color: "var(--bg)",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

            <div>
              <p
                className="text-xs uppercase tracking-widest mb-3"
                style={{ color: "var(--fg-muted)" }}
              >
                Contributions
              </p>
              <ul className="flex flex-col gap-2">
                {project.contributions.map((c, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <span style={{ color: "var(--accent)" }}>—</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5% 0px" });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <section
      id="projects"
      ref={ref}
      style={{
        background: "var(--bg)",
        color: "var(--fg)",
        padding: "clamp(4rem,10vh,7rem) var(--container-px)",
        position: "relative",
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Label */}
      <motion.p
        className="text-xs uppercase tracking-[0.18em] mb-10"
        style={{ color: "var(--fg-muted)" }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
      >
        Recent work
      </motion.p>

      {/* Project list */}
      <ul
        className="thumbnail-list-group"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}
      >
        {PROJECTS.map((project, i) => (
          <motion.li
            key={project.id}
            className="thumbnail-row cursor-pointer"
            style={{
              borderTop: "1px solid var(--border-subtle)",
              paddingBlock: "clamp(1.25rem,3vw,2.25rem)",
              paddingInline: 0,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            onMouseEnter={() => setHovered(project.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setActiveProject(project)}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h3
                style={{
                  fontSize: "calc(clamp(2rem,6.5vw,7rem) * 0.75)",
                  fontWeight: 400,
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                {project.title}
              </h3>
              <div className="flex items-center gap-6">
                <p
                  className="text-sm"
                  style={{ color: "var(--fg-muted)" }}
                >
                  {project.category}
                </p>
                <p
                  className="text-sm"
                  style={{ color: "var(--fg-muted)" }}
                >
                  {project.year}
                </p>
                <ArrowUpRight
                  size={18}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: "var(--accent)" }}
                />
              </div>
            </div>
          </motion.li>
        ))}
      </ul>

      {/* Floating modal preview on hover */}
      <AnimatePresence>
        {hovered !== null && (
          <motion.div
            className="pointer-events-none fixed z-30 overflow-hidden rounded-xl"
            style={{
              width: 280,
              height: 200,
              left: mousePos.x + 24,
              top: mousePos.y - 100,
              background: "#1a1a1a",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={
                PROJECTS.find((p) => p.id === hovered)?.image ||
                "/Projects/Barangay Health System/BHS-1.png"
              }
              alt="preview"
              fill
              className="object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {activeProject && (
          <ProjectModal
            project={activeProject}
            onClose={() => setActiveProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
'''

# ─── Skills.tsx ───────────────────────────────────────────────────────────────
skills = r'''"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

type Skill = { name: string; level: number; category: string };

const SKILLS: Skill[] = [
  { name: "HTML/CSS", level: 95, category: "Frontend" },
  { name: "JavaScript", level: 88, category: "Frontend" },
  { name: "TypeScript", level: 80, category: "Frontend" },
  { name: "React", level: 85, category: "Frontend" },
  { name: "Next.js", level: 82, category: "Frontend" },
  { name: "Tailwind CSS", level: 90, category: "Frontend" },
  { name: "PHP", level: 88, category: "Backend" },
  { name: "Node.js", level: 80, category: "Backend" },
  { name: "MySQL", level: 85, category: "Database" },
  { name: "MongoDB", level: 72, category: "Database" },
  { name: "Git & GitHub", level: 88, category: "Tools" },
  { name: "Figma", level: 82, category: "Design" },
  { name: "Networking", level: 80, category: "IT" },
  { name: "Linux/CLI", level: 75, category: "IT" },
  { name: "REST APIs", level: 85, category: "Backend" },
  { name: "UI/UX Design", level: 80, category: "Design" },
];

const CATEGORIES = ["All", "Frontend", "Backend", "Database", "Design", "Tools", "IT"];

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState("All");
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5% 0px" });

  const filtered =
    activeCategory === "All"
      ? SKILLS
      : SKILLS.filter((s) => s.category === activeCategory);

  return (
    <section
      id="skills"
      ref={ref}
      style={{
        background: "var(--bg)",
        color: "var(--fg)",
        padding: "clamp(4rem,10vh,7rem) var(--container-px)",
        borderTop: "1px solid var(--border-subtle)",
      }}
    >
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
          <motion.h2
            style={{
              fontSize: "clamp(2rem,4vw,4rem)",
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: "-0.015em",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            What I Can Offer
          </motion.h2>
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
                background:
                  activeCategory === cat ? "var(--fg)" : "transparent",
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
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%,260px), 1fr))",
        }}
      >
        {filtered.map((skill, i) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.04 }}
          >
            <div
              className="flex flex-col gap-3 p-5 rounded-xl"
              style={{ border: "1px solid var(--border-subtle)" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{skill.name}</span>
                <span
                  className="text-xs"
                  style={{ color: "var(--accent)" }}
                >
                  {skill.level}%
                </span>
              </div>
              {/* Progress bar */}
              <div
                className="h-0.5 w-full rounded-full overflow-hidden"
                style={{ background: "var(--border-subtle)" }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "var(--accent)" }}
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${skill.level}%` } : {}}
                  transition={{ duration: 0.9, delay: 0.3 + i * 0.03, ease: [0.16,1,0.3,1] }}
                />
              </div>
              <span
                className="text-xs"
                style={{ color: "var(--fg-muted)" }}
              >
                {skill.category}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
'''

# ─── Certificates.tsx ─────────────────────────────────────────────────────────
certificates = r'''"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";

type Cert = {
  id: number;
  title: string;
  issuer: string;
  date: string;
  image: string;
  skills: string[];
  description: string;
};

const CERTS: Cert[] = [
  {
    id: 1,
    title: "Introduction to Cybersecurity",
    issuer: "Cisco Networking Academy",
    date: "2023",
    image: "/Cetificates/cert1.jpg",
    skills: ["Cybersecurity", "Networking", "Security Fundamentals"],
    description:
      "Comprehensive introduction to cybersecurity concepts including threat detection, network protection, and security best practices.",
  },
  {
    id: 2,
    title: "JavaScript Algorithms and Data Structures",
    issuer: "freeCodeCamp",
    date: "2023",
    image: "/Cetificates/cert2.jpg",
    skills: ["JavaScript", "Algorithms", "Data Structures"],
    description:
      "In-depth coverage of JavaScript programming fundamentals, algorithms, and data structures with practical problem-solving.",
  },
  {
    id: 3,
    title: "Responsive Web Design",
    issuer: "freeCodeCamp",
    date: "2023",
    image: "/Cetificates/cert3.jpg",
    skills: ["HTML", "CSS", "Responsive Design"],
    description:
      "Mastery of HTML5, CSS3, and responsive design principles for building modern, mobile-first web applications.",
  },
  {
    id: 4,
    title: "Front End Development Libraries",
    issuer: "freeCodeCamp",
    date: "2023",
    image: "/Cetificates/cert4.jpg",
    skills: ["React", "Redux", "Bootstrap", "Sass"],
    description:
      "Advanced frontend development with React, Redux state management, Bootstrap, and modern CSS preprocessing.",
  },
  {
    id: 5,
    title: "Python for Everybody",
    issuer: "University of Michigan (Coursera)",
    date: "2023",
    image: "/Cetificates/cert5.jpg",
    skills: ["Python", "Data Structures", "Web Scraping"],
    description:
      "Comprehensive Python programming from basics to advanced topics including data structures, databases, and web access.",
  },
  {
    id: 6,
    title: "Cloud Foundations",
    issuer: "AWS Academy",
    date: "2024",
    image: "/Cetificates/cert6.jpg",
    skills: ["AWS", "Cloud Computing", "Infrastructure"],
    description:
      "Foundational understanding of cloud computing concepts and AWS core services for scalable infrastructure.",
  },
  {
    id: 7,
    title: "IT Essentials",
    issuer: "Cisco Networking Academy",
    date: "2022",
    image: "/Cetificates/cert7.jpg",
    skills: ["Hardware", "Operating Systems", "Networking"],
    description:
      "Essential IT skills covering hardware, software, networking fundamentals, and troubleshooting techniques.",
  },
  {
    id: 8,
    title: "Networking Basics",
    issuer: "Cisco Networking Academy",
    date: "2023",
    image: "/Cetificates/cert8.jpg",
    skills: ["TCP/IP", "Networking", "Protocols"],
    description:
      "Core networking concepts including TCP/IP protocols, network configuration, and troubleshooting methodologies.",
  },
];

export default function Certificates() {
  const [selected, setSelected] = useState<Cert | null>(null);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5% 0px" });

  return (
    <section
      id="certificates"
      ref={ref}
      style={{
        background: "var(--bg)",
        color: "var(--fg)",
        padding: "clamp(4rem,10vh,7rem) var(--container-px)",
        borderTop: "1px solid var(--border-subtle)",
      }}
    >
      {/* Header */}
      <motion.p
        className="text-xs uppercase tracking-[0.18em] mb-4"
        style={{ color: "var(--fg-muted)" }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
      >
        Certifications
      </motion.p>
      <motion.h2
        style={{
          fontSize: "clamp(2rem,4vw,4rem)",
          fontWeight: 400,
          lineHeight: 1.1,
          letterSpacing: "-0.015em",
          marginBottom: "clamp(2.5rem,6vh,4rem)",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        Credentials &amp; Learning
      </motion.h2>

      {/* Grid */}
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%,280px), 1fr))",
        }}
      >
        {CERTS.map((cert, i) => (
          <motion.div
            key={cert.id}
            className="group cursor-pointer rounded-xl overflow-hidden"
            style={{ border: "1px solid var(--border-subtle)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            onClick={() => setSelected(cert)}
          >
            {/* Thumbnail */}
            <div
              className="relative overflow-hidden"
              style={{ aspectRatio: "4/3" }}
            >
              <Image
                src={cert.image}
                alt={cert.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23e5e5e5'/%3E%3Ctext x='50%25' y='50%25' font-size='14' text-anchor='middle' dominant-baseline='middle' fill='%23888'%3ECertificate%3C/text%3E%3C/svg%3E";
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "rgba(0,0,0,0.3)" }}>
                <ZoomIn size={24} color="#fff" />
              </div>
            </div>
            {/* Info */}
            <div className="p-4">
              <p
                className="text-xs uppercase tracking-widest mb-1.5"
                style={{ color: "var(--accent)" }}
              >
                {cert.issuer}
              </p>
              <h3 className="text-sm font-medium leading-snug">{cert.title}</h3>
              <p
                className="text-xs mt-1"
                style={{ color: "var(--fg-muted)" }}
              >
                {cert.date}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="relative w-full max-w-lg rounded-2xl overflow-hidden"
              style={{ background: "var(--bg)", color: "var(--fg)" }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative" style={{ aspectRatio: "4/3" }}>
                <Image
                  src={selected.image}
                  alt={selected.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <p
                  className="text-xs uppercase tracking-widest mb-1"
                  style={{ color: "var(--accent)" }}
                >
                  {selected.issuer} &middot; {selected.date}
                </p>
                <h3 className="text-lg font-medium mb-3">{selected.title}</h3>
                <p
                  className="text-sm leading-relaxed mb-4"
                  style={{ color: "var(--fg-muted)" }}
                >
                  {selected.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {selected.skills.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 rounded-full text-xs"
                      style={{ border: "1px solid var(--border-subtle)" }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full"
                style={{ background: "rgba(0,0,0,0.5)", color: "#fff" }}
              >
                <X size={15} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
'''

# ─── Contact.tsx ──────────────────────────────────────────────────────────────
contact = r'''"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, Mail, MapPin, Send } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5% 0px" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "sent" : "error");
      if (res.ok) setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 5000);
  };

  return (
    <section
      id="contact"
      ref={ref}
      style={{ background: "var(--bg-dark-section)", color: "#fff", overflow: "hidden" }}
    >
      {/* CTA headline */}
      <div
        style={{
          padding: "clamp(4rem,12vh,9rem) var(--container-px) clamp(3rem,6vh,5rem)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <motion.p
          className="text-xs uppercase tracking-[0.18em] mb-8 opacity-40"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.4 } : {}}
          transition={{ duration: 0.6 }}
        >
          Contact
        </motion.p>

        <div className="flex flex-wrap items-end justify-between gap-8">
          <motion.h2
            style={{
              fontSize: "clamp(3rem,8vw,8rem)",
              fontWeight: 300,
              lineHeight: 1,
              letterSpacing: "-0.025em",
            }}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {`Let's work`}
            <br />
            together
          </motion.h2>

          {/* Purple CTA circle */}
          <motion.a
            href="mailto:maverickdanielle@gmail.com"
            className="flex items-center justify-center rounded-full text-sm font-light hover:scale-105 transition-transform shrink-0"
            style={{
              width: "clamp(100px,15vw,140px)",
              height: "clamp(100px,15vw,140px)",
              background: "var(--accent)",
              color: "#fff",
              textAlign: "center",
              lineHeight: 1.3,
            }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Get in<br />touch
          </motion.a>
        </div>

        {/* Contact pills */}
        <motion.div
          className="flex flex-wrap gap-3 mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <a href="mailto:maverickdanielle@gmail.com" className="pill-btn">
            <Mail size={13} />
            maverickdanielle@gmail.com
          </a>
          <span className="pill-btn" style={{ cursor: "default" }}>
            <MapPin size={13} />
            Pasig City, Philippines
          </span>
        </motion.div>
      </div>

      {/* Contact form */}
      <div style={{ padding: "clamp(3rem,8vh,5rem) var(--container-px)" }}>
        <form onSubmit={handleSubmit} className="max-w-2xl flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InputField label="Name" name="name" value={form.name} onChange={handleChange} required />
            <InputField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <InputField label="Subject" name="subject" value={form.subject} onChange={handleChange} required />
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2 opacity-40">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full bg-transparent border-b text-sm placeholder-current resize-none outline-none focus:border-white transition-colors"
              style={{ borderColor: "rgba(255,255,255,0.2)", color: "#fff", paddingBlock: "0.75rem" }}
              placeholder="Tell me about your project..."
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={status === "sending"}
              className="flex items-center gap-3 text-sm font-light group disabled:opacity-50"
              style={{ color: "#fff" }}
            >
              <span className="h-10 w-10 flex items-center justify-center rounded-full transition-colors group-hover:bg-white group-hover:text-black" style={{ border: "1px solid rgba(255,255,255,0.3)", color: "#fff" }}>
                <Send size={14} />
              </span>
              {status === "sending" ? "Sending..." : status === "sent" ? "Message sent!" : status === "error" ? "Failed — try again" : "Send message"}
            </button>
          </div>
        </form>
      </div>

      {/* Footer bottom bar */}
      <div
        style={{
          padding: "1.5rem var(--container-px)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <p className="text-xs opacity-30">&copy; 2025 Maverick Danielle Andres. All rights reserved.</p>
        <div className="flex items-center gap-6">
          {[
            { href: "https://github.com/MaverickDanielleAndres", label: "GitHub" },
            { href: "https://linkedin.com/in/maverick-danielle-andres-641564373", label: "LinkedIn" },
            { href: "https://facebook.com", label: "Facebook" },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs opacity-40 hover:opacity-80 transition-opacity"
            >
              {label} <ArrowUpRight size={10} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest mb-2 opacity-40">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-transparent border-b text-sm outline-none focus:border-white transition-colors"
        style={{
          borderColor: "rgba(255,255,255,0.2)",
          color: "#fff",
          paddingBlock: "0.75rem",
        }}
      />
    </div>
  );
}
'''

for filename, code in [
    ("About.tsx", about),
    ("Projects.tsx", projects),
    ("Skills.tsx", skills),
    ("Certificates.tsx", certificates),
    ("Contact.tsx", contact),
]:
    path = os.path.join(BASE, filename)
    with open(path, "w", encoding="utf-8") as f:
        f.write(code)
    print(f"{filename}: {os.path.getsize(path)} bytes")

print("All done!")
