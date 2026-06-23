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
const About = dynamic(() => import("@/components/About"), { ssr: false });
const TechStrip = dynamic(() => import("@/components/TechStrip"), { ssr: false });
const Skills = dynamic(() => import("@/components/Skills"), { ssr: false });
const Projects = dynamic(() => import("@/components/Projects"), { ssr: false });
const Certificates = dynamic(() => import("@/components/Certificates"), { ssr: false });
const ActivitySection = dynamic(() => import("@/components/ActivitySection"), { ssr: false });
const Contact = dynamic(() => import("@/components/Contact"), { ssr: false });

// --- Dynamic-only UI components ---
const ThemeToggle = dynamic(
  () => import("@/components/ThemeToggle"),
  { ssr: false }
);

const LoadingScreen = dynamic(
  () => import("@/components/LoadingScreen"),
  { ssr: false }
);

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [mountHeavy, setMountHeavy] = useState(false);
  // useCallback prevents LoadingScreen from re-rendering unnecessarily
  const handleLoadingComplete = useCallback(() => setLoading(false), []);

  useEffect(() => {
    // Yield to the main thread, then mount below-the-fold components
    // This allows the browser to paint the Hero and Loading screen first,
    // then download and parse the rest of the app in the background without a huge CPU spike.
    const timer = setTimeout(() => {
      startTransition(() => {
        setMountHeavy(true);
      });
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <LoadingScreen key="loading" onComplete={handleLoadingComplete} />
        )}
      </AnimatePresence>

      <motion.div
        key="content"
        initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
        animate={{ 
          opacity: loading ? 0 : 1, 
          scale: loading ? 0.98 : 1, 
          filter: loading ? "blur(10px)" : "blur(0px)" 
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
        style={{ pointerEvents: loading ? "none" : "auto", height: loading ? "100vh" : "auto", overflow: loading ? "hidden" : "visible" }}
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
            
            {mountHeavy && (
              <>
                <OverlapWrapper zIndex={2} bg="var(--bg-about)">
                  <About />
                </OverlapWrapper>
                <OverlapWrapper zIndex={3} bg="var(--bg-about)" shadowClassName="shadow-none">
                  <TechStrip />
                </OverlapWrapper>
                <OverlapWrapper zIndex={4} bg="var(--bg-about)">
                  <ActivitySection />
                </OverlapWrapper>
                <OverlapWrapper zIndex={5} bg="var(--bg-skills)">
                  <Skills />
                </OverlapWrapper>
                <OverlapWrapper zIndex={6} bg="var(--bg-projects)">
                  <Projects />
                </OverlapWrapper>
                <OverlapWrapper zIndex={7} bg="var(--bg-certificates)">
                  <Certificates />
                </OverlapWrapper>
                <OverlapWrapper zIndex={8} bg="var(--bg-contact)">
                  <Contact />
                </OverlapWrapper>
              </>
            )}
          </main>
        </SmoothScroll>
      </motion.div>
    </>
  );
}
