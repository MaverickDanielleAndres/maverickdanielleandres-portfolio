"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { createPortal } from "react-dom"
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

export function ProjectShowcase({
  projects = defaultProjects,
  title = "Wordpress and Woocommerce projects",
  subtitle = "Projects I worked on and maintained",
}: ProjectShowcaseProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const touchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const mousePosRef = useRef({ x: 0, y: 0 })
  const smoothPosRef = useRef({ x: 0, y: 0 })
  const animRef = useRef<number | null>(null)
  const isHoveredRef = useRef(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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

  // 60fps spring/lerp tracking that stops when not hovering
  useEffect(() => {
    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor

    const tick = () => {
      const preview = previewRef.current
      if (preview && !isMobile) {
        const target = mousePosRef.current
        const current = smoothPosRef.current

        smoothPosRef.current = {
          x: lerp(current.x, target.x, 0.22),
          y: lerp(current.y, target.y, 0.22),
        }

        // Center preview on cursor:
        // Position top-left at (cursorX - width/2, cursorY - height/2)
        const dx = smoothPosRef.current.x - PREVIEW_WIDTH / 2
        const dy = smoothPosRef.current.y - PREVIEW_HEIGHT / 2

        preview.style.transform = `translate3d(${Math.round(dx)}px, ${Math.round(dy)}px, 0)`
      }

      if (isHoveredRef.current) {
        animRef.current = requestAnimationFrame(tick)
      } else {
        animRef.current = null
      }
    }

    if (hoveredIndex !== null) {
      isHoveredRef.current = true
      if (animRef.current === null) {
        animRef.current = requestAnimationFrame(tick)
      }
    } else {
      isHoveredRef.current = false
    }

    return () => {
      if (animRef.current !== null) {
        cancelAnimationFrame(animRef.current)
        animRef.current = null
      }
    }
  }, [hoveredIndex, isMobile])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isMobile) return
      mousePosRef.current = { x: e.clientX, y: e.clientY }
    },
    [isMobile]
  )

  const handleMouseEnter = useCallback(
    (index: number, e: React.MouseEvent) => {
      if (isMobile) return
      // Seed both target and current directly at cursor coordinates
      mousePosRef.current = { x: e.clientX, y: e.clientY }
      smoothPosRef.current = { x: e.clientX, y: e.clientY }

      // Immediately snap preview DOM to cursor center on entry frame
      const preview = previewRef.current
      if (preview) {
        const dx = e.clientX - PREVIEW_WIDTH / 2
        const dy = e.clientY - PREVIEW_HEIGHT / 2
        preview.style.transform = `translate3d(${Math.round(dx)}px, ${Math.round(dy)}px, 0)`
      }

      setHoveredIndex(index)
    },
    [isMobile]
  )

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null)
  }, [])

  const handleTouchStart = useCallback((index: number) => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current)
    setHoveredIndex(index)
    touchTimeoutRef.current = setTimeout(() => {
      setHoveredIndex(null)
    }, 2800)
  }, [])

  // Floating preview rendered via React portal to document.body
  const previewPortal = mounted
    ? createPortal(
        <div
          ref={previewRef}
          className={`pointer-events-none fixed z-[999999] overflow-hidden rounded-xl shadow-2xl transition-opacity duration-300 ease-out will-change-transform ${
            isMobile
              ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              : "top-0 left-0"
          }`}
          style={{
            opacity: hoveredIndex !== null ? 1 : 0,
            transform: isMobile
              ? "translate3d(-50%, -50%, 0)"
              : undefined,
          }}
        >
          <div
            className={`relative overflow-hidden rounded-xl bg-secondary border border-border/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] ${
              isMobile
                ? "w-[min(84vw,320px)] h-[min(54vw,200px)]"
                : "w-[320px] h-[200px]"
            }`}
          >
            {projects.map((project, index) => (
              <img
                key={project.title}
                src={project.image || "/placeholder.svg"}
                alt={project.title}
                loading="eager"
                className="absolute inset-0 w-full h-full object-cover transition-all duration-400 ease-out"
                style={{
                  opacity: hoveredIndex === index ? 1 : 0,
                  transform: hoveredIndex === index ? "scale(1)" : "scale(1.1)",
                  filter: hoveredIndex === index ? "blur(0)" : "blur(10px)",
                }}
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement
                  target.src =
                    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800"
                }}
              />
            ))}
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>,
        document.body
      )
    : null

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      {previewPortal}

      {/* ── Section Header */}
      <div className="mb-8 sm:mb-10">
        <p className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.18em] mb-2">
          {subtitle}
        </p>
        <h2 className="text-foreground text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight">
          {title}
        </h2>
      </div>

      {/* ── 2 by 2 Grid Layout (8 projects total: 2 columns x 4 rows) */}
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
                className={`relative py-6 sm:py-7 border-t border-border transition-all duration-300 ease-out ${
                  isLastItem ? "border-b" : isLastRow ? "md:border-b" : ""
                }`}
              >
                {/* Background highlight on hover */}
                <div
                  className={`
                    absolute inset-0 -mx-3 sm:-mx-4 px-3 sm:px-4 bg-secondary/50 rounded-lg
                    transition-all duration-300 ease-out
                    ${isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"}
                  `}
                />

                <div className="relative flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Title with animated underline */}
                    <div className="inline-flex items-center gap-2">
                      <h3 className="text-foreground font-medium text-lg sm:text-xl tracking-tight">
                        <span className="relative">
                          {project.title}
                          {/* Animated underline */}
                          <span
                            className={`
                              absolute left-0 -bottom-0.5 h-px bg-foreground
                              transition-all duration-300 ease-out
                              ${isHovered ? "w-full" : "w-0"}
                            `}
                          />
                        </span>
                      </h3>

                      {/* Arrow that slides in */}
                      <ArrowUpRight
                        className={`
                          w-4 h-4 text-muted-foreground
                          transition-all duration-300 ease-out
                          ${
                            isHovered
                              ? "opacity-100 translate-x-0 translate-y-0 text-foreground"
                              : "opacity-0 -translate-x-2 translate-y-2"
                          }
                        `}
                      />
                    </div>

                    {/* Description with fade effect */}
                    <p
                      className={`
                        text-muted-foreground text-xs sm:text-sm mt-2 leading-relaxed
                        transition-all duration-300 ease-out
                        ${isHovered ? "text-foreground/80" : "text-muted-foreground"}
                      `}
                    >
                      {project.description}
                    </p>
                  </div>

                  {/* Year badge */}
                  <span
                    className={`
                      text-xs font-mono text-muted-foreground tabular-nums
                      transition-all duration-300 ease-out shrink-0
                      ${isHovered ? "text-foreground/70" : ""}
                    `}
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