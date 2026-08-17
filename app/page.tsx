import dynamic from "next/dynamic";
import SmoothScroll from "@/components/SmoothScroll";
import { Navbar } from "@/components/Navbar";

// --- Above-the-fold: statically imported (critical for FCP) ---
import Hero from "@/components/Hero";

import OverlapWrapper from "@/components/OverlapWrapper";
import Portal from "@/components/Portal";
import LazyLoad from "@/components/LazyLoad";

// --- Below-the-fold: dynamically imported to reduce initial bundle size ---
// Each section is lazy-loaded when the client is ready, per performance-rules.md
const About = dynamic(() => import("@/components/About"));
const Skills = dynamic(() => import("@/components/Skills"));
const Projects = dynamic(() => import("@/components/Projects"));
const Certificates = dynamic(() => import("@/components/Certificates"));
const ActivitySection = dynamic(() => import("@/components/ActivitySection"));
const Contact = dynamic(() => import("@/components/Contact"));

// --- Dynamic-only UI components ---
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <>
      <div className="relative">
        <SmoothScroll>
          {/* Transparent navbar (overlays hero) */}
          <Navbar />

          {/* Theme toggle — fixed bottom-right */}
          <Portal>
            <div className="fixed bottom-6 right-6 z-[9998]">
              <ThemeToggle />
            </div>
          </Portal>

          {/* Page sections */}
          <main className="relative" style={{ position: 'relative' }}>
            <OverlapWrapper zIndex={1} bg="var(--bg-hero)" sticky={true}>
              <Hero />
            </OverlapWrapper>

            <OverlapWrapper zIndex={2} bg="var(--bg-projects)">
              <LazyLoad height="100vh">
                <Projects />
              </LazyLoad>
            </OverlapWrapper>
            <OverlapWrapper zIndex={3} bg="var(--bg-about)">
              <LazyLoad height="100vh">
                <About />
              </LazyLoad>
            </OverlapWrapper>
            <OverlapWrapper zIndex={4} bg="var(--bg-about)">
              <LazyLoad height="100vh">
                <ActivitySection />
              </LazyLoad>
            </OverlapWrapper>
            <OverlapWrapper zIndex={5} bg="var(--bg-about)">
              <LazyLoad height="100vh">
                <Skills />
              </LazyLoad>
            </OverlapWrapper>
            <OverlapWrapper zIndex={6} bg="var(--bg-projects)" sticky={true}>
              <LazyLoad height="100vh">
                <Certificates />
              </LazyLoad>
            </OverlapWrapper>
            <OverlapWrapper zIndex={7} bg="var(--bg-contact)">
              <LazyLoad height="100vh">
                <Contact />
              </LazyLoad>
            </OverlapWrapper>
          </main>
        </SmoothScroll>
      </div>
    </>
  );
}
