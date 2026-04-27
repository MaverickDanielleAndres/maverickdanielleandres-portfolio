"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ArrowUpRight, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

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
    image: "/Projects/Barangay Health System/preview image/Preview.png",
    screenshots: [
      "/Projects/Barangay Health System/preview image/Preview.png",
      "/Projects/Barangay Health System/screenshots/Screenshot 2025-12-11 133108.png",
      "/Projects/Barangay Health System/screenshots/Screenshot 2025-12-11 133117.png",
      "/Projects/Barangay Health System/screenshots/Screenshot 2025-12-11 133129.png",
      "/Projects/Barangay Health System/screenshots/Screenshot 2025-12-11 133141.png",
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
    image: "/Projects/E-Community/screenshots/Screenshot 2025-12-11 110325.png",
    screenshots: [
      "/Projects/E-Community/screenshots/Screenshot 2025-12-11 110325.png",
      "/Projects/E-Community/screenshots/Screenshot 2025-12-11 110332.png",
      "/Projects/E-Community/screenshots/Screenshot 2025-12-11 110342.png",
      "/Projects/E-Community/screenshots/Screenshot 2025-12-11 110351.png",
      "/Projects/E-Community/screenshots/Screenshot 2025-12-11 110417.png",
    ],
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
    image: "/Projects/Gym Registration/preview image/Preview gym.png",
    screenshots: [
      "/Projects/Gym Registration/preview image/Preview gym.png",
      "/Projects/Gym Registration/screenshots/Screenshot 2025-12-11 140203.png",
      "/Projects/Gym Registration/screenshots/Screenshot 2025-12-11 140216.png",
      "/Projects/Gym Registration/screenshots/Screenshot 2025-12-11 140225.png",
      "/Projects/Gym Registration/screenshots/Screenshot 2025-12-11 140242.png",
    ],
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
    image: "/Projects/Learning Management System/screenshots/Priority.png",
    screenshots: [
      "/Projects/Learning Management System/screenshots/Priority.png",
      "/Projects/Learning Management System/screenshots/Priority (1).png",
      "/Projects/Learning Management System/screenshots/Priority (2).png",
      "/Projects/Learning Management System/screenshots/Priority (3).png",
      "/Projects/Learning Management System/screenshots/Priority (4).png",
    ],
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
    image: "/Projects/Figma Designs/screenshots/maverick.png",
    screenshots: [
      "/Projects/Figma Designs/screenshots/maverick.png",
      "/Projects/Figma Designs/screenshots/Screenshot 2025-12-11 204902.png",
      "/Projects/Figma Designs/screenshots/Screenshot 2025-12-11 205433.png",
      "/Projects/Figma Designs/screenshots/Screenshot 2025-12-12 124548.png",
      "/Projects/Figma Designs/screenshots/Screenshot 2025-12-12 125848.png",
    ],
    contributions: [
      "Created wireframes and prototypes",
      "Designed high-fidelity UI mockups",
      "Conducted user research and testing",
    ],
  },
];

// Sub-component for the fullscreen lightbox gallery
function LightboxModal({
  images,
  initialIndex,
  onClose,
}: {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [activeImg, setActiveImg] = useState(initialIndex);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight")
        setActiveImg((i) => Math.min(i + 1, images.length - 1));
      if (e.key === "ArrowLeft") setActiveImg((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, images.length]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 md:p-8"
      style={{ background: "rgba(0,0,0,0.95)", backdropFilter: "blur(12px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 active:scale-95 sm:top-6 sm:right-6 sm:h-12 sm:w-12"
      >
        <X size={20} />
      </button>

      {/* Main Container */}
      <div 
        className="relative w-full h-full flex flex-col items-center justify-center"
        onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchStartX === null) return;
          const delta = e.changedTouches[0].clientX - touchStartX;
          const threshold = 40;
          if (delta < -threshold) {
            setActiveImg((i) => Math.min(i + 1, images.length - 1));
          } else if (delta > threshold) {
            setActiveImg((i) => Math.max(i - 1, 0));
          }
          setTouchStartX(null);
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full max-w-6xl h-[68vh] sm:h-[78vh] md:h-[85vh] select-none">
          <Image
            src={images[activeImg]}
            alt="Screenshot preview"
            fill
            className="object-contain"
            quality={100}
          />
        </div>

        {/* Counter */}
        <div className="absolute bottom-2 text-white/50 tracking-widest text-xs sm:bottom-6 sm:text-sm">
          {activeImg + 1} / {images.length}
        </div>

        {/* Controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActiveImg((i) => Math.max(i - 1, 0))}
              disabled={activeImg === 0}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 h-11 w-11 sm:h-14 sm:w-14 rounded-full flex items-center justify-center disabled:opacity-20 hover:bg-white/10 active:scale-95 transition-colors text-white"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => setActiveImg((i) => Math.min(i + 1, images.length - 1))}
              disabled={activeImg === images.length - 1}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 h-11 w-11 sm:h-14 sm:w-14 rounded-full flex items-center justify-center disabled:opacity-20 hover:bg-white/10 active:scale-95 transition-colors text-white"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}

function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Still allow Esc to close modal if lightbox is NOT open
  useEffect(() => {
    if (lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, lightboxOpen]);

  return (
    <>
      <motion.div
        className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4 md:p-6"
        style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-3xl rounded-t-3xl sm:rounded-2xl overflow-hidden flex flex-col shadow-2xl"
          style={{ background: "var(--bg)", color: "var(--fg)", maxHeight: "min(94vh, 920px)" }}
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Header */}
          <div className="absolute top-3 right-3 z-20 sm:top-4 sm:right-4">
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full shadow-md transition-transform hover:scale-105 active:scale-95 sm:h-9 sm:w-9"
              style={{ background: "var(--fg)", color: "var(--bg)" }}
            >
              <X size={16} />
            </button>
          </div>

          <div className="overflow-y-auto w-full h-full max-h-[94vh] sm:max-h-[90vh]">
            {/* Clickable Header Image */}
            <div
              className="relative w-full group cursor-pointer"
              style={{ background: "var(--muted)", height: "clamp(165px, 34vw, 240px)" }}
              onClick={() => setLightboxOpen(true)}
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-[filter] duration-300 ease-out group-hover:brightness-[0.96]"
              />
              {/* Overlay hint */}
              <div className="absolute inset-0 bg-black/40 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 text-white">
                <Maximize2 size={20} />
                <span className="font-medium tracking-wide text-xs sm:text-sm">Tap/Click to view gallery ({project.screenshots.length})</span>
              </div>
            </div>

            {/* Info Body */}
            <div className="relative p-4 pb-20 sm:p-6 sm:pb-8 md:p-8">
              <div className="mb-4 flex flex-col items-start gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="pr-0 sm:pr-4">
                  <p
                    className="text-xs uppercase tracking-widest mb-1"
                    style={{ color: "var(--accent)" }}
                  >
                    {project.category} &middot; {project.year}
                  </p>
                  <h2 className="mb-2 text-[1.9rem] font-medium leading-[1.02] tracking-tight sm:text-3xl">{project.title}</h2>
                </div>
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 flex items-center gap-1.5 text-xs sm:text-sm hover:opacity-70 transition-opacity whitespace-nowrap px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-[var(--border)]"
                    style={{ color: "var(--fg)" }}
                  >
                    GitHub <ArrowUpRight size={14} />
                  </a>
                )}
              </div>

              <div className="w-full h-px my-5 sm:my-6" style={{ background: "var(--border-subtle)" }} />

              <p className="text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 opacity-90 max-w-2xl">
                {project.description}
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8">
                <div>
                  <p
                    className="text-xs uppercase tracking-widest mb-4 opacity-50"
                  >
                    Tech Stack
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1.5 rounded-full text-xs font-medium"
                        style={{
                          background: "var(--muted)",
                          color: "var(--fg)",
                          border: "1px solid var(--border-subtle)"
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p
                    className="text-xs uppercase tracking-widest mb-4 opacity-50"
                  >
                    Key Contributions
                  </p>
                  <ul className="flex flex-col gap-3">
                    {project.contributions.map((c, i) => (
                      <li key={i} className="flex gap-3 text-sm opacity-90 leading-snug">
                        <span style={{ color: "var(--accent)" }}>&rarr;</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Fullscreen Lightbox Portal */}
      <AnimatePresence>
        {lightboxOpen && (
          <LightboxModal
            images={project.screenshots}
            initialIndex={0}
            onClose={() => setLightboxOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
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
        background: "var(--bg-projects)",
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

      {/* Floating preview thumbnail */}
      <AnimatePresence>
        {hovered !== null && (
          <motion.div
            className="pointer-events-none fixed z-30 overflow-hidden rounded-xl hidden lg:block"
            style={{
              width: 320,
              aspectRatio: "16/9",
              left: mousePos.x + 24,
              top: mousePos.y - 100,
              background: "#1a1a1a",
              boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={PROJECTS.find((p) => p.id === hovered)?.image || ""}
              alt="preview"
              fill
              className="object-cover"
            />
            {/* Centered "View" button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "9999px",
                  background: "var(--accent)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                  boxShadow: "0 4px 24px rgba(96,85,240,0.5)",
                }}
              >
                View →
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
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
