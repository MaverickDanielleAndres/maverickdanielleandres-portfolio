import dynamic from "next/dynamic";
import FloatingUI from "@/components/FloatingUI";
import { Navbar } from "@/components/Navbar";

// --- Above-the-fold: statically imported (critical for FCP) ---
import Hero from "@/components/Hero";

import OverlapWrapper from "@/components/OverlapWrapper";
import LazyLoad from "@/components/LazyLoad";

// --- Below-the-fold: dynamically imported to reduce initial bundle size ---
// Each section is lazy-loaded when the client is ready, per performance-rules.md.
const AboutWithInquiry = dynamic(() => import("@/components/AboutWithInquiry"));
const Skills = dynamic(() => import("@/components/Skills"));
const Projects = dynamic(() => import("@/components/Projects"));
const Certificates = dynamic(() => import("@/components/Certificates"));
const ActivitySection = dynamic(() => import("@/components/ActivitySection"));
const Contact = dynamic(() => import("@/components/Contact"));

// ── Native scroll (no Lenis) ─────────────────────────────────────────────
//
// IMPORTANT: We deliberately DO NOT use Lenis (or any smooth-scroll library)
// here. Lenis's per-frame interpolation adds an inherent input-to-paint
// delay, creates the "bouncy" / "delayed" feel on real devices, and burns
// an rAF slot at 60Hz. Native browser scroll is faster, more responsive,
// and respects platform momentum / accessibility settings. The cost is
// no "smooth" interpolation between wheel events — but that's exactly
// what users want for a content-heavy scrolling portfolio.
//
// ─────────────────────────────────────────────────────────────────────────

// --- Page ----------------------------------------------------------------
export default function Home() {
  return (
    <>
      <div className="relative" suppressHydrationWarning>
        {/* Transparent navbar (overlays hero) */}
        <Navbar />

        <main className="relative" style={{ position: "relative" }} suppressHydrationWarning>
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
              <AboutWithInquiry />
            </LazyLoad>
          </OverlapWrapper>
          <OverlapWrapper zIndex={4} bg="var(--bg-about)">
            <LazyLoad height="100vh">
              <Skills />
            </LazyLoad>
          </OverlapWrapper>
          <OverlapWrapper zIndex={5} bg="var(--bg-about)">
            <LazyLoad height="100vh">
              <ActivitySection />
            </LazyLoad>
          </OverlapWrapper>
          <OverlapWrapper zIndex={6} bg="var(--bg-projects)">
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
      </div>

      {/* Floating UI lives in a client wrapper so its JS (framer-motion,
          react-icons, ai chat bundle) ships after the critical path. */}
      <FloatingUI />
    </>
  );
}
