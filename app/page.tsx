"use client";

import dynamic from "next/dynamic";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SmoothScroll from "@/components/SmoothScroll";
import { Navbar } from "@/components/Navbar";

// --- Above-the-fold: statically imported (critical for FCP) ---
import Hero from "@/components/Hero";

// --- Below-the-fold: dynamically imported to reduce initial bundle size ---
// Each section is lazy-loaded when the client is ready, per performance-rules.md
const About = dynamic(() => import("@/components/About"), { ssr: false });
const TechStrip = dynamic(() => import("@/components/TechStrip"), { ssr: false });
const Skills = dynamic(() => import("@/components/Skills"), { ssr: false });
const Projects = dynamic(() => import("@/components/Projects"), { ssr: false });
const Certificates = dynamic(() => import("@/components/Certificates"), { ssr: false });
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
  // useCallback prevents LoadingScreen from re-rendering unnecessarily
  const handleLoadingComplete = useCallback(() => setLoading(false), []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading ? (
          <LoadingScreen key="loading" onComplete={handleLoadingComplete} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <SmoothScroll>
              {/* Transparent navbar (overlays hero) */}
              <Navbar onMenuOpen={() => {}} />

              {/* Theme toggle — fixed bottom-right */}
              <div className="fixed bottom-6 right-6 z-[9998]">
                <ThemeToggle />
              </div>

              {/* Page sections */}
              <main>
                <Hero />
                <About />
                <TechStrip />
                <Skills />
                <Projects />
                <Certificates />
                <Contact />
              </main>
            </SmoothScroll>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
