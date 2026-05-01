"use client"

import { useState, type ReactNode } from "react"
import { motion, AnimatePresence, LayoutGroup, type PanInfo } from "framer-motion"
import { cn } from "@/lib/utils"
import { Grid3X3, Layers } from "lucide-react"
import PixelCard from "./PixelCard"

export type LayoutMode = "stack" | "grid"

export interface CardData {
  id: string
  title: string
  description: string
  icon?: ReactNode
  color?: string
}

export interface MorphingCardStackProps {
  cards?: CardData[]
  className?: string
  defaultLayout?: LayoutMode
  onCardClick?: (card: CardData) => void
}

const layoutIcons = {
  grid: Grid3X3,
  stack: Layers,
}

const SWIPE_THRESHOLD = 50

export function Component({
  cards = [],
  className,
  defaultLayout = "grid",
  onCardClick,
}: MorphingCardStackProps) {
  const [layout, setLayout] = useState<LayoutMode>(defaultLayout)
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  if (!cards || cards.length === 0) {
    return null
  }

  const handleDragEnd = (_: any, info: PanInfo) => {
    const { offset, velocity } = info
    
    if (Math.abs(offset.x) > SWIPE_THRESHOLD || Math.abs(velocity.x) > 500) {
      if (offset.x > 0 || velocity.x > 500) {
        setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length)
      } else {
        setActiveIndex((prev) => (prev + 1) % cards.length)
      }
    }
    // Set isDragging to false after a short delay to prevent click fire
    setTimeout(() => setIsDragging(false), 50)
  }

  const getStackOrder = () => {
    const reordered = []
    const visibleCount = Math.min(cards.length, 5)
    for (let i = 0; i < visibleCount; i++) {
      const index = (activeIndex + i) % cards.length
      reordered.push({ ...cards[index], stackPosition: i })
    }
    return reordered.reverse()
  }

  const getLayoutStyles = (stackPosition: number) => {
    switch (layout) {
      case "stack":
        return {
          top: 0,
          left: 0,
          zIndex: cards.length - stackPosition,
          rotate: (stackPosition % 2 === 0 ? 1 : -1) * stackPosition * 3,
          scale: 1 - stackPosition * 0.01,
        }
      case "grid":
        return {
          top: 0,
          left: 0,
          zIndex: 1,
          rotate: 0,
        }
    }
  }

  const containerStyles = {
    stack: "relative h-[240px] sm:h-[280px] w-full max-w-[240px] sm:max-w-[300px] mt-12 mb-16",
    grid: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4",
  }

  const displayCards = layout === "stack" ? getStackOrder() : cards.map((c, i) => ({ ...c, stackPosition: i }))

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-center gap-1 rounded-lg bg-secondary/50 p-1 w-fit mx-auto">
        {(Object.keys(layoutIcons) as LayoutMode[]).map((mode) => {
          const Icon = layoutIcons[mode]
          return (
            <button
              key={mode}
              onClick={() => setLayout(mode)}
              className={cn(
                "rounded-md p-2 transition-all",
                layout === mode
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary",
              )}
              aria-label={`Switch to ${mode} layout`}
            >
              <Icon className="h-4 w-4" />
            </button>
          )
        })}
      </div>

      <LayoutGroup>
        <motion.div layout className={cn(containerStyles[layout], "mx-auto")}>
          <AnimatePresence mode="popLayout">
            {displayCards.map((card) => {
              const styles = getLayoutStyles(card.stackPosition)
              const isExpanded = expandedCard === card.id
              const isTopCard = layout === "stack" && card.stackPosition === 0

              const content = (
                <div className={cn(
                  "flex relative z-10 w-full h-full",
                  layout === "stack" ? "flex-col gap-3 p-5 sm:p-6" : "flex-row items-start gap-3 px-3.5 py-2 sm:py-2.5"
                )}>
                  <div className={cn(
                    "flex shrink-0 items-center justify-center rounded-xl bg-secondary/50 text-foreground border border-border/50 shadow-sm",
                    layout === "stack" ? "h-10 w-10" : "h-8 w-8 mt-0.5"
                  )}>
                    <div className={layout === "stack" ? "scale-90" : "scale-75"}>{card.icon}</div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className={cn(
                      "font-bold text-foreground tracking-tight leading-tight mb-1",
                      layout === "stack" ? "text-lg" : "text-sm"
                    )}>{card.title}</h3>
                    <p className={cn(
                      "text-muted-foreground leading-snug font-medium",
                      layout === "stack" ? "text-sm line-clamp-5" : "text-[11px] line-clamp-2"
                    )}>
                      {card.description}
                    </p>
                  </div>
                </div>
              )

              return (
                <motion.div
                  key={card.id}
                  layoutId={card.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: isExpanded ? 1.05 : 1,
                    x: 0,
                    ...styles,
                  }}
                  exit={{ opacity: 0, scale: 0.8, x: -200 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  }}
                  drag={isTopCard ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragStart={() => setIsDragging(true)}
                  onDragEnd={handleDragEnd}
                  whileDrag={{ scale: 1.05, cursor: "grabbing" }}
                  whileHover={isTopCard ? { scale: 1.02, y: -4 } : {}}
                  onClick={() => {
                    if (isDragging) return
                    setExpandedCard(isExpanded ? null : card.id)
                    onCardClick?.(card)
                  }}
                  className={cn(
                    "relative touch-pan-y",
                    layout === "stack" 
                      ? "cursor-grab active:cursor-grabbing rounded-[2rem] border border-border/50 absolute w-full max-w-[240px] sm:max-w-[300px] aspect-square bg-card/90 dark:bg-card/40 backdrop-blur-2xl shadow-xl" 
                      : "cursor-pointer rounded-2xl border border-border/40 w-full min-h-[85px] bg-card/70 dark:bg-card/30 backdrop-blur-md shadow-sm hover:border-primary/50 transition-colors",
                    isExpanded && "ring-2 ring-primary z-50",
                  )}
                >
                  <div className="relative z-10 w-full h-full flex flex-col">
                    {layout === "grid" ? (
                      <PixelCard variant="blue" className="!w-full !h-full !border-none !bg-transparent">
                        <div className="p-4 relative z-10">{content}</div>
                      </PixelCard>
                    ) : (
                      <>
                        {content}
                        {isTopCard && (
                          <div className="absolute bottom-8 left-0 right-0 text-center">
                            <span className="text-sm font-medium text-muted-foreground/40">
                              Swipe to navigate
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {layout === "stack" && cards.length > 1 && (
        <div className="flex justify-center gap-1.5">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === activeIndex ? "w-6 bg-foreground" : "w-2 bg-muted-foreground/20 hover:bg-muted-foreground/40",
              )}
              aria-label={`Go to card ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
