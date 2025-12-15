"use client";
import { lazy, Suspense } from "react";
import LightRays from "@/components/LightRays";
import HeroSection from "@/app/sections/Hero-section";
import AboutSection from "@/app/sections/About-section";
import Footer from "@/components/Footer";

// Lazy load heavy components
const Galaxy = lazy(() => import("@/components/Galaxy"));
const Skills = lazy(() => import("./sections/Skills-section"));
const Certificates = lazy(() => import("./sections/Certificates-section"));
const ContactSection = lazy(() => import("./sections/Contact-section"));
const CertificatesSection = lazy(() => import("./sections/Certificates-section"));
const ProjectsSection = lazy(() => import("./sections/Project-section"));
const CertProj = lazy(() => import("./sections/CertProj"));
const Particles = lazy(() => import("@/components/background/Particles"));


export default function Home() {
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white overflow-hidden">
      {/* Background effects - positioned absolutely to cover entire viewport */}
      <div className="fixed inset-0 z-0 w-100%">
        <Suspense fallback={<div className="w-full h-screen bg-black"></div>}>
          <Particles
            particleColors={['#ffffff', '#ffffff']}
            particleCount={500}
            particleSpread={20}
            speed={0.1}
            particleBaseSize={70}
            moveParticlesOnHover={false}
            alphaParticles={false}
            disableRotation={false}
          />
        </Suspense>
      </div>

      {/* Content layer - positioned above background */}
      <div className="relative z-10 w-full">
        <HeroSection />
      </div>
      <div className="relative z-10 w-full">
        <AboutSection />
      </div>
      <div className="relative z-10 w-full">
        <Suspense fallback={<div className="w-full min-h-[50vh] bg-black"></div>}>
          <Skills />
        </Suspense>
      </div>
      <div className="relative z-10 w-full">
        <Suspense fallback={<div className="w-full min-h-[50vh] bg-black"></div>}>
          <CertProj />
        </Suspense>
      </div>

      <div className="relative z-10 w-full">
        <Suspense fallback={<div className="w-full min-h-[50vh] bg-black"></div>}>
          <ContactSection />
        </Suspense>
      </div>
      <div className="relative z-10 w-full">
        <Footer />
      </div>
    </main>
  );
}
