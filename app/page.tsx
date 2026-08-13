"use client";

import dynamic from "next/dynamic";
import { useState, useCallback, useEffect, startTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SmoothScroll from "@/components/SmoothScroll";
import { Navbar } from "@/components/Navbar";

// --- Above-the-fold: statically imported (critical for FCP) ---
import Hero from "@/components/Hero";

import OverlapWrapper from "@/components/OverlapWrapper";
import Portal from "@/components/Portal";

// --- Below-the-fold: dynamically imported to reduce initial bundle size ---
// Each section is lazy-loaded when the client is ready, per performance-rules.md
const About = dynamic(() => import("@/components/About"));
const Skills = dynamic(() => import("@/components/Skills"));
const Projects = dynamic(() => import("@/components/Projects"));
const Certificates = dynamic(() => import("@/components/Certificates"));
const ActivitySection = dynamic(() => import("@/components/ActivitySection"));
const Contact = dynamic(() => import("@/components/Contact"));

// --- Dynamic-only UI components ---
const ThemeToggle = dynamic(
  () => import("@/components/ThemeToggle"),
  { ssr: false }
);

import LoadingScreen from "@/components/LoadingScreen";

export default function Home() {
  const [loading, setLoading] = useState(true);
  
  // useCallback prevents LoadingScreen from re-rendering unnecessarily
  const handleLoadingComplete = useCallback(() => setLoading(false), []);

  return (
    <>
      {/* Loading screen overlays content — content renders immediately underneath
          so the browser can measure the LCP element without waiting for the overlay. */}
      <AnimatePresence>
        {loading && (
          <LoadingScreen key="loading" onComplete={handleLoadingComplete} />
        )}
      </AnimatePresence>

      {/* Page content — always in DOM. Opacity-only reveal avoids the expensive
          filter:blur GPU compositing layer that was hurting first paint. */}
      <motion.div
        key="content"
        className="relative"
        style={{ pointerEvents: loading ? "none" : "auto" }}
      >
        <SmoothScroll>
          {/* Transparent navbar (overlays hero) */}
          <Navbar onMenuOpen={() => {}} />

          {/* Theme toggle — fixed bottom-right */}
          <Portal>
            <div className="fixed bottom-6 right-6 z-[9998]">
              <ThemeToggle />
            </div>
          </Portal>

          {/* Page sections */}
          <main className="relative" style={{ position: 'relative' }}>
            <OverlapWrapper zIndex={1} bg="var(--bg-hero)">
              <Hero />
            </OverlapWrapper>
            
            <OverlapWrapper zIndex={2} bg="var(--bg-about)">
              <About />
            </OverlapWrapper>
            <OverlapWrapper zIndex={3} bg="var(--bg-about)">
              <ActivitySection />
            </OverlapWrapper>
            <OverlapWrapper zIndex={4} bg="var(--bg-projects)">
              <Projects />
            </OverlapWrapper>
            <OverlapWrapper zIndex={5} bg="var(--bg-skills)">
              <Skills />
            </OverlapWrapper>
            <OverlapWrapper zIndex={6} bg="var(--bg-certificates)">
              <Certificates />
            </OverlapWrapper>
            <OverlapWrapper zIndex={7} bg="var(--bg-contact)">
              <Contact />
            </OverlapWrapper>
          </main>
        </SmoothScroll>
      </motion.div>
    </>
  );
}
