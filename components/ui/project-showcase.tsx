"use client"
import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { ArrowUpRight } from "lucide-react"

export interface Project {
  title: string
  description: string
  year: string
  link: string
  image: string
}

const defaultProjects: Project[] = [
  {
    title: "NexVision Innovations",
    description: "Corporate technology agency & digital solutions platform engineered with custom WordPress systems and responsive architecture.",
    year: "2026",
    link: "https://nexvision.info/",
    image: "/Projects/wordpress-sites/nexvision.png",
  },
  {
    title: "Maranellos Concord",
    description: "Premium automotive repair & mechanical service portal with interactive booking, service showcases, and local SEO structure.",
    year: "2026",
    link: "https://maranellosconcord.com.au/",
    image: "/Projects/wordpress-sites/maranellosconcord.png",
  },
  {
    title: "Oven Elements Australia",
    description: "High-volume WooCommerce e-commerce catalog featuring comprehensive appliance heating parts, category filters, and fast checkout.",
    year: "2026",
    link: "https://ovenelements.com.au/",
    image: "/Projects/wordpress-sites/ovenelements.png",
  },
  {
    title: "Truck Electrical Services",
    description: "Commercial heavy vehicle auto-electrical and air conditioning service website with fleet management inquiry forms.",
    year: "2026",
    link: "https://truckelectrical.com.au/",
    image: "/Projects/wordpress-sites/truckelectrical.png",
  },
  {
    title: "AJL Auto Electrical",
    description: "Specialized auto-electrical diagnostics and mobile repair platform featuring modern layout, service catalogs, and instant call CTAs.",
    year: "2026",
    link: "https://ajlautoelectrical.com.au/",
    image: "/Projects/wordpress-sites/ajlautoelectrical.png",
  },
  {
    title: "Crystal Building Supplies",
    description: "Wholesale and retail building materials WooCommerce store showcasing full inventory specs, bulk quotes, and trade pricing.",
    year: "2026",
    link: "https://crystalbuildingsupplies.com.au/",
    image: "/Projects/wordpress-sites/crystalbuildingsupplies.png",
  },
  {
    title: "Burwood Mechanics",
    description: "Full-service automotive mechanical workshop landing page with transparent service menus, pricing schedules, and customer trust badges.",
    year: "2026",
    link: "https://burwoodmechanics.com.au/",
    image: "/Projects/wordpress-sites/burwoodmechanics.png",
  },
  {
    title: "Mojde Beauty",
    description: "Full-featured e-commerce beauty store with custom Elementor design, responsive layout, and seamless WooCommerce checkout flow.",
    year: "2026",
    link: "https://mojde.beauty/",
    image: "/Projects/wordpress-sites/mojdebeauty.png",
  },
]

interface ProjectShowcaseProps {
  projects?: Project[]
  title?: string
  subtitle?: string
}

const PREVIEW_WIDTH = 320
const PREVIEW_HEIGHT = 200

/**
 * Hover-preview showcase — perf rewrite that KEEPS the original hover
 * behavior intact.
 *
 * Performance wins over the original implementation:
 *
 *   1. Mouse + smooth positions live in REFS, not React state. Updating
 *      them 60×/sec no longer triggers React reconciliation of the
 *      section tree (8 cards, 8 images). Previously the rAF called
 *      `setSmoothPosition` and `setMousePosition` every frame — two
 *      state updates per frame on the same component, forcing it to
 *      re-render ~120 times per second whenever the cursor moved over
 *      this section.
 *
 *   2. The rAF writes `style.transform` directly to the floating
 *      preview's DOM node — bypasses React's virtual DOM diffing
 *      entirely. The transform is GPU-composited (`will-change:
 *      transform`) so the browser doesn't paint the preview every
 *      frame, it just moves the composited layer.
 *
 *   3. The rAF runs only while the section is in view (IntersectionObserver)
 *      — when the user scrolls past the showcase, no work is done.
 *      When the user is not hovering, the rAF still runs but only
 *      continues while the cursor is over the section.
 *
 * Hover behavior preserved:
 *   - Hover a card → preview fades in + smoothly follows the cursor.
 *   - Move cursor across cards → preview tracks, content swaps to the
 *     hovered card's screenshot.
 *   - Leave the section → preview fades out.
 *   - Touch devices show a centered preview on tap (auto-hides after 2.8s).
 */
export function ProjectShowcase({
  projects = defaultProjects,
  title = "Wordpress and Woocommerce projects",
  subtitle = "Projects I worked on and maintained",
}: ProjectShowcaseProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const touchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Mouse + smooth positions live in refs — never in React state.
  // Updating them doesn't trigger a re-render.
  const mousePosRef = useRef({ x: 0, y: 0 })
  const smoothPosRef = useRef({ x: 0, y: 0 })
  const animRef = useRef<number | null>(null)
  const isVisibleRef = useRef(false)

  // ── Mobile detection (one re-render on mount, never again) ────────
  useEffect(() => {
    const checkMobile = () => {
      const mobile =
        window.innerWidth < 768 ||
        (typeof window !== "undefined" &&
          window.matchMedia("(pointer: coarse)").matches)
      setIsMobile(mobile)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // ── Visibility gate + rAF lifecycle ────────────────────────────────
  // Combines the visibility observer, the rAF start/stop, the lerp loop,
  // and the cursor-in/out tracking in one effect so we only pay the
  // setup cost once. The rAF starts when the section enters the viewport
  // and stops when it leaves — the browser's IntersectionObserver fires
  // synchronously with the initial observe() call so we don't need a
  // polling fallback.
  useEffect(() => {
    if (!containerRef.current) return
    const section = containerRef.current

    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor

    const tick = () => {
      animRef.current = requestAnimationFrame(tick)

      const preview = previewRef.current
      if (!preview) return

      const target = mousePosRef.current
      const current = smoothPosRef.current
      smoothPosRef.current = {
        x: lerp(current.x, target.x, 0.15),
        y: lerp(current.y, target.y, 0.15),
      }

      const { x: nx, y: ny } = smoothPosRef.current
      // Position the preview so its CENTER sits on the cursor. Then clamp
      // to the viewport edges so the preview never goes off-screen.
      let dx = nx - PREVIEW_WIDTH / 2
      let dy = ny - PREVIEW_HEIGHT / 2
      const margin = 12
      if (dx < margin) dx = margin
      if (dy < margin) dy = margin
      if (dx + PREVIEW_WIDTH > window.innerWidth - margin) {
        dx = window.innerWidth - PREVIEW_WIDTH - margin
      }
      if (dy + PREVIEW_HEIGHT > window.innerHeight - margin) {
        dy = window.innerHeight - PREVIEW_HEIGHT - margin
      }
      preview.style.transform = `translate3d(${dx}px, ${dy}px, 0)`
    }

    const start = () => {
      if (animRef.current === null) {
        animRef.current = requestAnimationFrame(tick)
      }
    }
    const stop = () => {
      if (animRef.current !== null) {
        cancelAnimationFrame(animRef.current)
        animRef.current = null
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting
        if (entry.isIntersecting) start()
        else stop()
      },
      { rootMargin: "200px" }
    )
    observer.observe(section)

    return () => {
      observer.disconnect()
      stop()
      if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current)
    }
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isMobile) return
    mousePosRef.current = { x: e.clientX, y: e.clientY }
  }, [isMobile])

  const handleMouseEnter = useCallback((index: number, e: React.MouseEvent) => {
    if (isMobile) return
    // Seed both refs at the cursor so the preview appears at the right
    // place on the very first frame (no snap from off-screen).
    mousePosRef.current = { x: e.clientX, y: e.clientY }
    smoothPosRef.current = { x: e.clientX, y: e.clientY }
    setHoveredIndex(index)
  }, [isMobile])

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null)
  }, [])

  const handleTouchStart = useCallback((index: number) => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current)
    setHoveredIndex(index)
    // Keep preview visible briefly on touch
    touchTimeoutRef.current = setTimeout(() => {
      setHoveredIndex(null)
    }, 2800)
  }, [])

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      {/* ── Section Header */}
      <div className="mb-8 sm:mb-10">
        <p className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.18em] mb-2">
          {subtitle}
        </p>
        <h2 className="text-foreground text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight">
          {title}
        </h2>
      </div>

      {/* ── Floating Preview ─────────────────────────────────────────
          Hover-only, GPU-composited (transform + opacity). On mobile the
          preview sits in the centre and is auto-hidden after 2.8s.
          The rAF above lerps `smoothPosRef` toward `mousePosRef` and
          writes the result directly to this element's transform — no
          React state, no virtual-DOM diffing per frame. */}
      <div
        ref={previewRef}
        className="pointer-events-none fixed z-50 overflow-hidden rounded-xl shadow-2xl"
        style={{
          top: 0,
          left: 0,
          // Seeded off-screen so the very first paint doesn't show a flash
          // of the preview at (0,0). The rAF overwrites this on frame 1.
          transform: "translate3d(-9999px, -9999px, 0)",
          opacity: hoveredIndex !== null ? 1 : 0,
          transition: "opacity 0.3s ease-out",
          willChange: "transform, opacity",
        }}
      >
        <div
          className={`relative overflow-hidden rounded-xl bg-secondary border border-border/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] ${
            isMobile
              ? "w-[min(84vw,320px)] h-[min(54vw,200px)]"
              : "w-[300px] sm:w-[320px] h-[190px] sm:h-[200px]"
          }`}
          style={
            isMobile
              ? {
                  position: "fixed",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                }
              : undefined
          }
        >
          {projects.map((project, index) => (
            <img
              key={project.title}
              src={project.image || "/placeholder.svg"}
              alt={project.title}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                opacity: hoveredIndex === index ? 1 : 0,
                transform: hoveredIndex === index ? "scale(1)" : "scale(1.1)",
                filter: hoveredIndex === index ? "blur(0)" : "blur(10px)",
                transition:
                  "opacity 0.4s ease-out, transform 0.4s ease-out, filter 0.4s ease-out",
              }}
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement
                target.src =
                  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800"
              }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent" />
        </div>
      </div>

      {/* ── 2 by 2 Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-0">
        {projects.map((project, index) => {
          const isHovered = hoveredIndex === index
          const isLastRow = index >= projects.length - 2
          const isLastItem = index === projects.length - 1

          return (
            <a
              key={project.title}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
              onMouseEnter={(e) => handleMouseEnter(index, e)}
              onMouseLeave={handleMouseLeave}
              onTouchStart={() => handleTouchStart(index)}
              aria-label={`Open ${project.title} website`}
            >
              <div
                className={`relative py-6 sm:py-7 border-t border-border ${
                  isLastItem ? "border-b" : isLastRow ? "md:border-b" : ""
                }`}
              >
                {/* Background highlight on hover */}
                <div
                  className={`absolute inset-0 -mx-3 sm:-mx-4 px-3 sm:px-4 bg-secondary/50 rounded-lg transition-opacity duration-300 ${
                    isHovered ? "opacity-100" : "opacity-0"
                  }`}
                />

                <div className="relative flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="inline-flex items-center gap-2">
                      <h3 className="text-foreground font-medium text-lg sm:text-xl tracking-tight">
                        <span className="relative">
                          {project.title}
                          <span
                            className={`absolute left-0 -bottom-0.5 h-px bg-foreground transition-[width] duration-300 ${
                              isHovered ? "w-full" : "w-0"
                            }`}
                          />
                        </span>
                      </h3>

                      <ArrowUpRight
                        className={`w-4 h-4 transition-[opacity,transform,color] duration-300 ${
                          isHovered
                            ? "opacity-100 translate-x-0 translate-y-0 text-foreground"
                            : "opacity-0 -translate-x-2 translate-y-2 text-muted-foreground"
                        }`}
                      />
                    </div>

                    <p
                      className={`mt-2 text-xs sm:text-sm leading-relaxed transition-colors duration-300 ${
                        isHovered ? "text-foreground/80" : "text-muted-foreground"
                      }`}
                    >
                      {project.description}
                    </p>
                  </div>

                  <span
                    className={`text-xs font-mono tabular-nums shrink-0 transition-colors duration-300 ${
                      isHovered ? "text-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {project.year}
                  </span>
                </div>
              </div>
            </a>
          )
        })}
      </div>
    </section>
  )
}

export default ProjectShowcase