"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
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

export function ProjectShowcase({
  projects = defaultProjects,
  title = "Wordpress and Woocommerce projects",
  subtitle = "Projects I worked on and maintained",
}: ProjectShowcaseProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLElement>(null)
  const animationRef = useRef<number | null>(null)
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

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

  useEffect(() => {
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor
    }

    const animate = () => {
      setSmoothPosition((prev) => ({
        x: lerp(prev.x, mousePosition.x, 0.15),
        y: lerp(prev.y, mousePosition.y, 0.15),
      }))
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current)
      }
    }
  }, [mousePosition])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMobile) {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      })
    }
  }

  const handleMouseEnter = (index: number, e: React.MouseEvent) => {
    if (!isMobile) {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      })
    }
    setHoveredIndex(index)
    setIsVisible(true)
  }

  const handleMouseLeave = () => {
    setHoveredIndex(null)
    setIsVisible(false)
  }

  const handleTouchStart = (index: number) => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current)
    setHoveredIndex(index)
    setIsVisible(true)
    // Keep preview visible briefly on touch
    touchTimeoutRef.current = setTimeout(() => {
      setIsVisible(false)
      setHoveredIndex(null)
    }, 2800)
  }

  // Calculate clamped target position for desktop
  let desktopX = smoothPosition.x + 20
  let desktopY = smoothPosition.y - 100
  if (typeof window !== "undefined" && !isMobile) {
    const previewWidth = 320
    const previewHeight = 200
    if (desktopX + previewWidth > window.innerWidth - 16) {
      desktopX = smoothPosition.x - previewWidth - 20
    }
    if (desktopY < 16) {
      desktopY = 16
    } else if (desktopY + previewHeight > window.innerHeight - 16) {
      desktopY = window.innerHeight - previewHeight - 16
    }
  }

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

      {/* ── Floating Preview: Centered on Mobile / Cursor Following on Desktop */}
      <div
        className={`pointer-events-none fixed z-50 overflow-hidden rounded-xl shadow-2xl transition-all duration-300 ${
          isMobile
            ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            : "top-0 left-0"
        }`}
        style={{
          transform: isMobile
            ? `translate3d(-50%, -50%, 0) scale(${isVisible ? 1 : 0.85})`
            : `translate3d(${desktopX}px, ${desktopY}px, 0) scale(${isVisible ? 1 : 0.8})`,
          opacity: isVisible ? 1 : 0,
          transition:
            "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), scale 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div
          className={`relative overflow-hidden rounded-xl bg-secondary border border-border/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] ${
            isMobile
              ? "w-[min(84vw,320px)] h-[min(54vw,200px)]"
              : "w-[300px] sm:w-[320px] h-[190px] sm:h-[200px]"
          }`}
        >
          {projects.map((project, index) => (
            <img
              key={project.title}
              src={project.image || "/placeholder.svg"}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out"
              style={{
                opacity: hoveredIndex === index ? 1 : 0,
                scale: hoveredIndex === index ? 1 : 1.1,
                filter: hoveredIndex === index ? "none" : "blur(10px)",
              }}
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement
                target.src =
                  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800"
              }}
            />
          ))}
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent" />
        </div>
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
