"use client";

import { useState, useEffect } from "react";
import ShinyText from "@/components/ShinyText";
import TrueFocus from "@/components/TrueFocus";
import Header from "@/components/Header";
import LightRays from "@/components/LightRays";

interface AnimatedButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  delay?: number;
}

export default function HeroSection() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 50); // trigger after mount
    return () => clearTimeout(timer);
  }, []);

  const AnimatedButton: React.FC<AnimatedButtonProps> = ({
    href,
    children,
    variant = "primary",
    delay = 0,
  }) => {
    const [isHovered, setIsHovered] = useState(false);

    const baseClasses =
      "relative inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-300 transform overflow-hidden group";

    const variants = {
      primary:
        "bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg hover:shadow-xl hover:shadow-slate-500/20 border border-slate-700/50",
      secondary:
        "bg-white/5 border border-white/20 text-white backdrop-blur-md hover:border-white/40 hover:bg-white/10 hover:shadow-lg",
    };

    return (
      <a
        href={href}
        className={`${baseClasses} ${variants[variant]} ${
          animate ? "animate-slideUp" : "opacity-0"
        }`}
        style={{ animationDelay: `${delay}ms` } as React.CSSProperties}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-full blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>

        {/* Button content */}
        <span className="relative z-10 group-hover:scale-105 transition-transform duration-200">
          {children}
        </span>

        {/* Ripple effect on hover */}
        {isHovered && (
          <div className="absolute inset-0 rounded-full animate-pulse bg-white/10"></div>
        )}
      </a>
    );
  };

  const handleScrollToAbout = () => {
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
        }

        .responsive-truefocus {
          font-size: clamp(0.75rem, 4vw, 2.25rem);
          line-height: clamp(1.2, 1.5, 1.8);
        }

        .hero-spacing {
          padding-top: clamp(5rem, 15vh, 15rem);
          padding-bottom: clamp(3rem, 10vh, 5rem);
        }

        .hero-content-spacing {
          margin-bottom: clamp(1rem, 3vh, 1.5rem);
        }

        .hero-buttons-spacing {
          margin-top: clamp(2rem, 6vh, 3rem);
        }

        .hero-scroll-spacing {
          margin-top: clamp(3rem, 8vh, 5rem);
        }

        .hero-scroll-bottom-spacing {
          margin-bottom: clamp(2rem, 10vh, 10rem);
        }
      `}</style>

      <section id='home' className="mt-35 relative z-10 text-center px-4 sm:px-6 hero-spacing">
        <ShinyText
          text="Maverick Danielle P. Andres"
          disabled={false}
          speed={3}
          className="hero-content-spacing text-2xl sm:text-2xl md:text-4xl font-bigjohn"
        />

        {/* TrueFocus with responsive styling */}
        <div
          className={`${animate ? "animate-slideUp" : "opacity-0"} responsive-truefocus hero-content-spacing`}
          style={{ animationDelay: "200ms" } as React.CSSProperties}
        >
          <TrueFocus
            sentence="Web_Developer Designer IT_Support"
            manualMode={false}
            blurAmount={2}
            borderColor="white"
            animationDuration={2}
            pauseBetweenAnimations={1.5}
          />
        </div>

        {/* Buttons grid */}
        <div
          className={`flex flex-wrap justify-center gap-2 sm:gap-3 max-w-xs sm:max-w-lg mx-auto hero-buttons-spacing ${
            animate ? "animate-slideUp" : "opacity-0"
          }`}
          style={{ animationDelay: "400ms" } as React.CSSProperties}
        >
          <AnimatedButton href="#resume" variant="secondary" delay={400}>
            Resume
          </AnimatedButton>

          <AnimatedButton href="https://github.com" variant="secondary" delay={600}>
            GitHub
          </AnimatedButton>

          <AnimatedButton href="https://linkedin.com" variant="secondary" delay={800}>
            LinkedIn
          </AnimatedButton>
        </div>

        {/* Scroll indicator - now with link functionality */}
        <div
          className={`hero-scroll-spacing ${animate ? "animate-slideUp" : "opacity-0"}`}
          style={{ animationDelay: "1200ms" } as React.CSSProperties}
        >
          <button 
            onClick={handleScrollToAbout}
            className="flex flex-col items-center justify-center text-white/50 hover:text-white/80 transition-colors duration-500 cursor-pointer group bg-transparent border-none w-full"
          >
            <span className="text-[0.6rem] sm:text-xs font-light mb-2 sm:mb-3 tracking-wider uppercase">
              Learn More About Me
            </span>
            <div className="w-px h-6 sm:h-8 bg-gradient-to-b from-white/20 to-transparent group-hover:from-white/40 transition-colors duration-300"></div>
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white/40 rounded-full mt-1 sm:mt-2 group-hover:bg-white/60 transition-colors duration-300 hero-scroll-bottom-spacing"></div>
          </button>
        </div>
      </section>
    </>
  );
}