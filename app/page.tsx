"use client";
import LightRays from "@/components/LightRays";
import HeroSection from "@/app/sections/Hero-section";
import AboutSection from "@/app/sections/About-section";
import Galaxy from "@/components/Galaxy";
import Skills from "./sections/Skills-section";
import Certificates from "./sections/Certificates-section";
import ContactSection from "./sections/Contact-section";
import CertificatesSection from "./sections/Certificates-section";
import Footer from "@/components/Footer";
import ProjectsSection from "./sections/Project-section";
import CertProj from "./sections/CertProj";
import Particles from "@/components/background/Particles";


export default function Home() {
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white overflow-hidden">
      {/* Background effects - positioned absolutely to cover entire viewport */}
      <div className="fixed inset-0 z-0 w-100%">
  
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
      </div>
      
      {/* Content layer - positioned above background */}
      <div className="relative z-10 w-full">
        <HeroSection />
      </div>
      <div className="relative z-10 w-full">
        <AboutSection />
      </div>
      <div className="relative z-10 w-full">
        <Skills />
      </div>
      <div className="relative z-10 w-full">
        <CertProj />
      </div> 
      
      <div className="relative z-10 w-full">
        <ContactSection />
      </div> 
      <div className="relative z-10 w-full">
        <Footer />
      </div>
    </main>
  );
}