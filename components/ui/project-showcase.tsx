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

  const touchStartPosRef = useRef({ x: 0, y: 0 })
  const isSwipingRef = useRef(false)
  const activeMobileItemRef = useRef<number | null>(null)
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

  // Dismiss on tap outside or scroll
  useEffect(() => {
    const handleWindowTouch = (e: TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setHoveredIndex(null)
        activeMobileItemRef.current = null
      }
    }
    const handleScroll = () => {
      if (isMobile) {
        setHoveredIndex(null)
        activeMobileItemRef.current = null
      }
    }

    window.addEventListener("touchstart", handleWindowTouch, { passive: true })
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("touchstart", handleWindowTouch)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [isMobile])

  // Desktop 60fps spring/lerp tracking that stops when not hovering
  useEffect(() => {
    if (isMobile) return

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
      mousePosRef.current = { x: e.clientX, y: e.clientY }
      smoothPosRef.current = { x: e.clientX, y: e.clientY }

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
    if (isMobile) return
    setHoveredIndex(null)
  }, [isMobile])

  // Mobile Touch Handlers
  const handleTouchStart = useCallback((index: number, e: React.TouchEvent) => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current)
    const touch = e.touches[0]
    touchStartPosRef.current = { x: touch.clientX, y: touch.clientY }
    isSwipingRef.current = false

    // Touching finger triggers the centered hover image effect
    setHoveredIndex(index)
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    const dx = Math.abs(touch.clientX - touchStartPosRef.current.x)
    const dy = Math.abs(touch.clientY - touchStartPosRef.current.y)
    // If movement is detected (swiping or scrolling), dismiss preview and flag swipe
    if (dx > 8 || dy > 8) {
      isSwipingRef.current = true
      setHoveredIndex(null)
    }
  }, [])

  const handleTouchEnd = useCallback((index: number) => {
    if (isSwipingRef.current) {
      // Swiping or scrolling should not keep the preview or trigger navigation
      return
    }
    // For a clean touch, keep the centered preview visible
    setHoveredIndex(index)
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current)
    touchTimeoutRef.current = setTimeout(() => {
      setHoveredIndex(null)
      activeMobileItemRef.current = null
    }, 3000)
  }, [])

  const handleClick = useCallback(
    (index: number, e: React.MouseEvent) => {
      if (isMobile) {
        // If swiping or scrolling occurred, prevent navigation
        if (isSwipingRef.current) {
          e.preventDefault()
          return
        }

        // First tap: trigger hover preview without visiting website
        if (activeMobileItemRef.current !== index) {
          e.preventDefault()
          activeMobileItemRef.current = index
          setHoveredIndex(index)

          if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current)
          touchTimeoutRef.current = setTimeout(() => {
            setHoveredIndex(null)
            activeMobileItemRef.current = null
          }, 3000)
          return
        }

        // Second click on already active project: allows visiting website
        activeMobileItemRef.current = null
        setHoveredIndex(null)
      }
    },
    [isMobile]
  )

  // Floating preview for Desktop
  const desktopPreviewPortal =
    mounted && !isMobile
      ? createPortal(
          <div
            ref={previewRef}
            className="pointer-events-none fixed top-0 left-0 z-[999999] overflow-hidden rounded-xl shadow-2xl transition-opacity duration-300 ease-out will-change-transform"
            style={{
              opacity: hoveredIndex !== null ? 1 : 0,
            }}
          >
            <div className="relative w-[320px] h-[200px] overflow-hidden rounded-xl bg-secondary border border-border/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]">
              {hoveredIndex !== null && projects[hoveredIndex] && (
                <img
                  key={projects[hoveredIndex].title}
                  src={projects[hoveredIndex].image || "/placeholder.svg"}
                  alt={projects[hoveredIndex].title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement
                    target.src =
                      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800"
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>,
          document.body
        )
      : null

  // Centered preview for Mobile (Always perfectly centered on screen)
  const mobilePreviewPortal =
    mounted && isMobile
      ? createPortal(
          <div
            className="pointer-events-none fixed inset-0 z-[999999] flex items-center justify-center p-4 transition-all duration-300 ease-out"
            style={{
              opacity: hoveredIndex !== null ? 1 : 0,
              transform: hoveredIndex !== null ? "scale(1)" : "scale(0.95)",
            }}
          >
            <div className="relative w-[min(86vw,340px)] h-[min(56vw,220px)] overflow-hidden rounded-2xl bg-secondary border border-border/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)]">
              {hoveredIndex !== null && projects[hoveredIndex] && (
                <img
                  key={projects[hoveredIndex].title}
                  src={projects[hoveredIndex].image || "/placeholder.svg"}
                  alt={projects[hoveredIndex].title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement
                    target.src =
                      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800"
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>,
          document.body
        )
      : null

  return (
    <section
      id="wordpress"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      {desktopPreviewPortal}
      {mobilePreviewPortal}

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
              className="group block select-none"
              onMouseEnter={(e) => handleMouseEnter(index, e)}
              onMouseLeave={handleMouseLeave}
              onTouchStart={(e) => handleTouchStart(index, e)}
              onTouchMove={handleTouchMove}
              onTouchEnd={() => handleTouchEnd(index)}
              onClick={(e) => handleClick(index, e)}
              aria-label={`${project.title} - ${project.description}`}
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