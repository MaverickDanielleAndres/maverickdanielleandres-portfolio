"use client"
import React, { Children, cloneElement, forwardRef, isValidElement, ReactElement, ReactNode, useEffect, useMemo, useRef, useImperativeHandle } from "react";
import gsap from "gsap";

export interface CardSwapRef {
  swapNext: () => void;
  swapPrev: () => void;
  pauseAutoPlay: () => void;
  resumeAutoPlay: () => void;
  container: HTMLDivElement | null;
}

export interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (idx: number) => void;
  skewAmount?: number;
  easing?: "linear" | "elastic";
  children: ReactNode;
  skills?: Array<{
    title: string;
    bg: string;
    icon: string;
    desc: string;
    percentage: number;
    invert?: boolean;
  }>;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ customClass, ...rest }, ref) => (
    <div 
      ref={ref} 
      {...rest} 
      className={`absolute top-1/2 left-1/2 rounded-xl border border-gray-600 bg-black [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden] shadow-xl hover:shadow-2xl transition-shadow duration-300 ${customClass ?? ""} ${rest.className ?? ""}`.trim()} 
    />
  )
);

Card.displayName = "Card";

interface Slot {
  x: number;
  y: number;
  z: number;
  zIndex: number;
}

// HARDCODED VALUES
const CARD_DISTANCE = 80;
const VERTICAL_DISTANCE = 85;

const makeSlot = (
  i: number,
  distX: number,
  distY: number,
  total: number
): Slot => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
});

const placeNow = (el: HTMLElement, slot: Slot, skew: number) => {
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: "center center",
    zIndex: slot.zIndex,
    force3D: true,
  });
};

const CardSwap = forwardRef<CardSwapRef, CardSwapProps>(({
  width = 350,
  height = 300,
  delay = 5000,
  pauseOnHover = true,
  onCardClick,
  skewAmount = 6,
  easing = "elastic",
  children,
  skills = [],
}, ref) => {
  // Smooth linear config for button controls
  const config = {
    ease: "power2.inOut",
    durDrop: 0.5,
    durMove: 0.6,
    durReturn: 0.5,
    promoteOverlap: 0.3,
    returnDelay: 0.1,
  };

  const childArr = useMemo(
    () => Children.toArray(children) as ReactElement<CardProps>[],
    [children]
  );

  // Create refs with proper typing
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  
  const order = useRef<number[]>(
    Array.from({ length: childArr.length }, (_, i) => i)
  );
  
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number | null>(null);
  const container = useRef<HTMLDivElement>(null);
  const isPaused = useRef<boolean>(false);

  // Initialize refs properly
  useEffect(() => {
    refs.current = refs.current.slice(0, childArr.length);
    while (refs.current.length < childArr.length) {
      refs.current.push(null);
    }
  }, [childArr.length]);

  // Initial placement
  useEffect(() => {
    refs.current.forEach((el, i) => {
      if (el) {
        const slotIndex = order.current.indexOf(i);
        placeNow(
          el,
          makeSlot(slotIndex, CARD_DISTANCE, VERTICAL_DISTANCE, refs.current.length),
          skewAmount
        );
      }
    });
  }, [childArr.length, skewAmount]);

  const swap = (direction: 'next' | 'prev' = 'next') => {
    if (order.current.length < 2) return;
    
    // Stop any existing timeline
    if (tlRef.current) {
      tlRef.current.kill();
    }
    
    let newOrder;
    let targetCard;
    let targetSlot;
    
    if (direction === 'next') {
      const [front, ...rest] = order.current;
      newOrder = [...rest, front];
      targetCard = refs.current[front];
      targetSlot = makeSlot(refs.current.length - 1, CARD_DISTANCE, VERTICAL_DISTANCE, refs.current.length);
    } else {
      const back = order.current[order.current.length - 1];
      const middle = order.current.slice(0, -1);
      newOrder = [back, ...middle];
      targetCard = refs.current[back];
      targetSlot = makeSlot(0, CARD_DISTANCE, VERTICAL_DISTANCE, refs.current.length);
    }

    if (!targetCard) return;

    const tl = gsap.timeline();
    tlRef.current = tl;

    if (direction === 'next') {
      // Smooth drop without bounce
      tl.to(targetCard, {
        y: "+=300",
        skewY: 0,
        duration: config.durDrop,
        ease: config.ease,
      });

      tl.addLabel("promote", `-=${config.durDrop * config.promoteOverlap}`);
      
      // Move all other cards smoothly
      newOrder.slice(0, -1).forEach((idx, i) => {
        const el = refs.current[idx];
        if (!el) return;
        
        const slot = makeSlot(i, CARD_DISTANCE, VERTICAL_DISTANCE, refs.current.length);
        
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            skewY: skewAmount,
            zIndex: slot.zIndex,
            duration: config.durMove,
            ease: config.ease,
          },
          "promote"
        );
      });

      tl.addLabel("return", `promote+=${config.durMove * config.returnDelay}`);
      
      // Smooth return without bounce
      tl.to(
        targetCard,
        {
          x: targetSlot.x,
          y: targetSlot.y,
          z: targetSlot.z,
          skewY: skewAmount,
          zIndex: targetSlot.zIndex,
          duration: config.durReturn,
          ease: config.ease,
        },
        "return"
      );
    } else {
      // Smooth movement for prev
      tl.to(targetCard, {
        y: "+=300",
        duration: config.durDrop,
        ease: config.ease,
      });

      tl.addLabel("promote", `-=${config.durDrop * config.promoteOverlap}`);
      
      // Move all other cards back smoothly
      newOrder.slice(1).forEach((idx, i) => {
        const el = refs.current[idx];
        if (!el) return;
        
        const slot = makeSlot(i + 1, CARD_DISTANCE, VERTICAL_DISTANCE, refs.current.length);
        
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            skewY: skewAmount,
            zIndex: slot.zIndex,
            duration: config.durMove,
            ease: config.ease,
          },
          "promote"
        );
      });

      tl.addLabel("return", `promote+=${config.durMove * config.returnDelay}`);
      
      // Smooth return
      tl.to(
        targetCard,
        {
          x: targetSlot.x,
          y: targetSlot.y,
          z: targetSlot.z,
          skewY: skewAmount,
          zIndex: targetSlot.zIndex,
          duration: config.durReturn,
          ease: config.ease,
        },
        "return"
      );
    }

    tl.call(() => {
      order.current = newOrder;
    });
  };

  const startAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = window.setInterval(() => {
      if (!isPaused.current) {
        swap('next');
      }
    }, delay);
  };

  const stopAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    swapNext: () => swap('next'),
    swapPrev: () => swap('prev'),
    pauseAutoPlay: () => {
      isPaused.current = true;
      tlRef.current?.pause();
    },
    resumeAutoPlay: () => {
      isPaused.current = false;
      tlRef.current?.resume();
    },
    container: container.current
  }), []);

  useEffect(() => {
    // Initial swap after a short delay to ensure DOM is ready
    const initialTimer = setTimeout(() => {
      swap('next');
      startAutoPlay();
    }, 100);

    if (pauseOnHover && container.current) {
      const node = container.current;
      
      const pause = () => {
        isPaused.current = true;
        tlRef.current?.pause();
      };

      const resume = () => {
        isPaused.current = false;
        tlRef.current?.resume();
      };

      node.addEventListener("mouseenter", pause);
      node.addEventListener("mouseleave", resume);

      return () => {
        clearTimeout(initialTimer);
        node.removeEventListener("mouseenter", pause);
        node.removeEventListener("mouseleave", resume);
        stopAutoPlay();
      };
    }

    return () => {
      clearTimeout(initialTimer);
      stopAutoPlay();
    };
  }, [delay, pauseOnHover, skewAmount, easing]);

  const rendered = childArr.map((child, i) =>
    isValidElement<CardProps>(child)
      ? cloneElement(child, {
          key: i,
          ref: (el: HTMLDivElement | null) => {
            refs.current[i] = el;
          },
          style: {
            width,
            height,
            ...(child.props.style ?? {}),
          },
          onClick: (e: React.MouseEvent<HTMLDivElement>) => {
            child.props.onClick?.(e);
            onCardClick?.(i);
          },
        } as any)
      : child
  );

  return (
    <div 
      ref={container} 
      data-card-swap
      className="mt-60 mr-90 relative mx-auto perspective-[800px] overflow-visible"
      style={{ 
        width, 
        height, 
        transform: 'translateZ(0)'
      }}
    >
      {rendered}
    </div>
  );
});

CardSwap.displayName = "CardSwap";

export default CardSwap;