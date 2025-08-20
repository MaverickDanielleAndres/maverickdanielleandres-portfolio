"use client";

import LightRays from "@/components/LightRays";
import HeroSection from "@/app/sections/Hero-section";
export default function Home() {
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white overflow-hidden">
      {/* Background effect */}
      <LightRays />

      {/* Hero Section */}
      <HeroSection />
    </main>
  );
}
