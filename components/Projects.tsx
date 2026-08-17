"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ArrowUpRight, ChevronLeft, ChevronRight, Maximize2, Github, ExternalLink } from "lucide-react";
import Portal from "@/components/Portal";

type Project = {
  id: number;
  title: string;
  category: string;
  year: string;
  description: string;
  tech: string[];
  features: string[];
  image: string;
  screenshots: string[];
  github?: string;
  live?: string;
  contributions: string[];
};

const PROJECTS: Project[] = [
  {
    id: 1,
    title: "UI/UX Design — Figma",
    category: "Wireframes & Design Systems",
    year: "2024–2026",
    description: "Designed wireframes, high-fidelity mockups, and component libraries for web applications. Covers user flows, responsive layouts, and design-to-developer handoff assets.",
    tech: ["Figma"],
    features: ["Wireframes", "Hi-Fi Mockups", "Component Library", "User Flows", "Responsive Design"],
    image: "/Projects/Figma Designs/screenshots/Figma (1).png",
    screenshots: Array.from({ length: 10 }, (_, i) => `/Projects/Figma Designs/screenshots/Figma (${i + 1}).png`),
    contributions: [
      "Led the end-to-end design process from concept to hi-fi mockup",
      "Created low-fidelity wireframes to map out user flows and layouts",
      "Produced high-fidelity, pixel-perfect UI designs ready for development",
      "Built reusable component libraries for design consistency",
      "Designed responsive layouts for both desktop and mobile breakpoints",
    ],
  },
  {
    id: 2,
    title: "Learning Management System",
    category: "Education Platform",
    year: "2025",
    description: "A full-featured LMS for schools with course management, student tracking, assignments, and grading functionality.",
    tech: ["PHP", "MySQL", "Bootstrap", "JavaScript"],
    features: ["Course Management", "Student Tracking", "Assignments", "Grading System"],
    image: "/Projects/Learning Management System/screenshots/Priority.png",
    screenshots: [
      "/Projects/Learning Management System/screenshots/Priority.png",
      ...Array.from({ length: 8 }, (_, i) => `/Projects/Learning Management System/screenshots/Priority (${i + 1}).png`),
      ...Array.from({ length: 23 }, (_, i) => `/Projects/Learning Management System/screenshots/lms (${i + 1}).png`),
    ],
    live: "https://sagadhs-lms.com/login/",
    github: "https://github.com/MaverickDanielleAndres/LMS",
    contributions: [
      "Architected the full LMS platform",
      "Built course and lesson management",
      "Implemented grading and assessment tools",
    ],
  },
  {
    id: 3,
    title: "Beauty Connect",
    category: "E-commerce Platform",
    year: "2026",
    description: "A professional beauty connect platform for services and bookings.",
    tech: ["Next.js", "Tailwind CSS", "Supabase"],
    features: ["Service Booking", "Provider Portal", "Real-time Chat", "Payments"],
    image: "/Projects/BeautyConnect/BeautyConnect (1).png",
    screenshots: Array.from({ length: 42 }, (_, i) => `/Projects/BeautyConnect/BeautyConnect (${i + 1}).png`),
    live: "https://www.beautyconnect.us/",
    contributions: [
      "Designed and developed the entire frontend architecture",
      "Integrated real-time booking and notification systems",
      "Optimized performance for mobile users",
    ],
  },
  {
    id: 13,
    title: "BazaarX",
    category: "Enterprise E-commerce",
    year: "2026",
    description: "A comprehensive, enterprise-grade e-commerce marketplace platform built with a modern mobile-first approach. It facilitates a complete multi-tenant ecosystem with Buyer, Seller, Admin, and QA roles.",
    tech: ["Next.js", "React Native", "Expo", "Supabase", "PayMongo"],
    features: ["AI Scanner Chatbot", "Multi-role Auth", "Visual Search", "Escrow System", "PayMongo Payments", "Flash Sales"],
    image: "/Projects/BazaarX/web/Screenshot 2026-06-12 235100.png",
    screenshots: [
      "/Projects/BazaarX/web/Screenshot 2026-06-12 235100.png",
      "/Projects/BazaarX/web/Screenshot 2026-06-12 235120.png",
      "/Projects/BazaarX/web/Screenshot 2026-06-12 235212.png",
      "/Projects/BazaarX/web/Screenshot 2026-06-12 235252.png",
      "/Projects/BazaarX/web/Screenshot 2026-06-12 235316.png",
      "/Projects/BazaarX/web/Screenshot 2026-06-13 012447.png",
      "/Projects/BazaarX/web/Screenshot 2026-06-13 012507.png",
      "/Projects/BazaarX/web/Screenshot 2026-06-13 012602.png",
      "/Projects/BazaarX/mobile/6154726090253995458.jpg",
      "/Projects/BazaarX/mobile/6154726090253995459.jpg",
      "/Projects/BazaarX/mobile/6154726090253995460.jpg",
      "/Projects/BazaarX/mobile/6154726090253995461.jpg",
      "/Projects/BazaarX/mobile/6154726090253995462.jpg"
    ],
    live: "https://bazaarx-liart.vercel.app/",
    contributions: [
      "Built a complete multi-tenant ecosystem with four distinct user roles",
      "Integrated Gemini-powered AI chat assistant and visual search",
      "Developed end-to-end purchasing flows with Escrow and PayMongo integration",
      "Created comprehensive seller dashboards and administrative control panels",
    ],
  },
  {
    id: 14,
    title: "JJZ TECH — Repair Shop Website",
    category: "Local Business Landing Page",
    year: "2026",
    description: "A high-performance, modern landing page for JJZ TECH, a professional electronics and gadget repair shop in Binangonan, Rizal. Built for local SEO dominance, conversion-focused CTAs, and a buttery-smooth UI powered by Framer Motion and GSAP. Features a live AI chatbot, interactive repair gallery, customer testimonials, and an embedded map.",
    tech: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "Framer Motion", "GSAP", "React Leaflet", "Google Generative AI"],
    features: ["Local SEO Schema", "AI Repair Chatbot", "ZoomParallax Gallery", "Interactive Map", "Infinite Slider", "GSAP ScrollTrigger", "Board-Level Services", "Messenger CTA"],
    image: "/Projects/jjz-repair/puthisfirstplease.png",
    screenshots: [
      "/Projects/jjz-repair/1 (1).jpg",
      "/Projects/jjz-repair/puthisfirstplease.png",
      ...Array.from({ length: 10 }, (_, i) => `/Projects/jjz-repair/1 (${i + 1}).png`),
    ],
    live: "https://jjz-repair.vercel.app/",
    github: "https://github.com/MaverickDanielleAndres/jjz-repair",
    contributions: [
      "Architected the full Next.js 16 App Router site with SSR and structured LocalBusiness schema for local SEO",
      "Engineered a dual-animation stack using GSAP ScrollTrigger for staggered hero timelines and Framer Motion for sticky ZoomParallax gallery",
      "Integrated Google Generative AI SDK to power the JJZ Assistant floating chatbot",
      "Built an interactive React Leaflet map for the 'Find Us' store locator section",
      "Optimized performance with content-visibility: auto deferral, GPU-accelerated transforms, and CSS variable–driven clip-path animations at 60fps",
    ],
  },
  {
    id: 4,
    title: "HR Management System",
    category: "PH-Compliant HR Management",
    year: "2026",
    description: "A full-featured HRMS with face recognition check-in, GPS geofencing, loan management, and statutory payroll calculations aligned with Philippine TRAIN Law.",
    tech: ["Next.js 16", "React 19", "Zustand", "face-api.js", "Leaflet"],
    features: ["Face Recognition", "GPS Geofencing", "Loan Management", "13th Month Pay", "Bank CSV Export", "Analytics"],
    image: "/Projects/HR Management System/hrms (1).png",
    screenshots: Array.from({ length: 29 }, (_, i) => `/Projects/HR Management System/hrms (${i + 1}).png`),
    live: "https://hrms-web-system.vercel.app/login",
    github: "https://github.com/MaverickDanielleAndres/HRMS",
    contributions: [
      "Developed the entire system solo from database to UI",
      "Integrated face-api.js for webcam-based attendance verification",
      "Built GPS geofencing logic using Leaflet for location validation",
      "Engineered TRAIN Law payroll engine (SSS, PhilHealth, Pag-IBIG, BIR)",
      "Implemented loan deduction automation and payroll locking system",
    ],
  },
  {
    id: 5,
    title: "Monitoring and Payroll System",
    category: "HR & Attendance Platform",
    year: "2026",
    description: "Enterprise-grade HRMS for Philippine companies — manages employee lifecycles, NFC-based attendance, leave workflows, and automated payroll with government compliance (SSS, PhilHealth, Pag-IBIG, BIR).",
    tech: ["Next.js 14", "TypeScript", "Supabase", "Tailwind CSS", "shadcn/ui"],
    features: ["NFC Attendance", "Payroll Automation", "Leave Management", "Digital Payslips", "Kiosk Mode", "Intern Tracking"],
    image: "/Projects/Monitoring and Payroll System/Monitoring system with payroll (1).png",
    screenshots: Array.from({ length: 28 }, (_, i) => `/Projects/Monitoring and Payroll System/Monitoring system with payroll (${i + 1}).png`),
    live: "https://monitoring-system-web.vercel.app/login",
    github: "https://github.com/MaverickDanielleAndres/Monitoring-System",
    contributions: [
      "Built the full system solo as sole developer (frontend + backend)",
      "Architected role-based portals for Admin, Employee, and Intern",
      "Integrated NFC/RFID kiosk mode for real-time attendance logging",
      "Implemented automated payroll with PH statutory deductions",
      "Set up Supabase RLS policies and real-time data subscriptions",
    ],
  },
  {
    id: 12,
    title: "Wedding Invitation Website",
    category: "Client Invitation Website",
    year: "2026",
    description: "A wedding invitation website for client with animation, envelope effects, music, and dramatic animations. Very responsive made for mobile view.",
    tech: ["Next.js", "Framer Motion", "CSS Animations"],
    features: ["Envelope Effect", "Background Music", "RSVP Form", "Animated Timeline"],
    image: "/Projects/Wedding Invitaition Website/WeddingInvitationWebsite (1).png",
    screenshots: Array.from({ length: 28 }, (_, i) => `/Projects/Wedding Invitaition Website/WeddingInvitationWebsite (${i + 1}).png`),
    live: "https://allen-vea-wedding.vercel.app/",
    github: "https://github.com/MaverickDanielleAndres/Allen-Vea-Wedding-Invitation-Website",
    contributions: [
      "Developed custom envelope animation with Framer Motion",
      "Implemented responsive mobile-first invitation layout",
      "Integrated music player with smooth transitions",
    ],
  },
  {
    id: 15,
    title: "M-Chat",
    category: "AI Workspace Application",
    year: "2026",
    description: "A premium multi-tenant, multi-modal AI chat application. One composer handles text, code, documents, images, voice, and web search — all grounded through Google Gemini. Ships with auth, persistent history, billing tiers, admin dashboard, and a full marketing site. Built to compete with ChatGPT and Claude on responsiveness and ergonomics.",
    tech: ["Vite", "React 19", "TypeScript", "Tailwind CSS", "shadcn/ui", "Zustand", "React Router 7", "Framer Motion", "Supabase", "Google Gemini", "Vercel"],
    features: ["Multi-turn Streaming Chat", "Personas", "Document Upload & AI Analysis", "Image Generation", "Voice Input & TTS", "Web Search Toggle", "Quota & Billing", "Admin Dashboard", "Supabase Auth", "RLS Security", "rAF-batched Streaming"],
    image: "/Projects/M-Chat/1 (1).png",
    screenshots: Array.from({ length: 14 }, (_, i) => `/Projects/M-Chat/1 (${i + 1}).png`),
    live: "https://m-chat-9cmp.vercel.app/",
    github: "https://github.com/MaverickDanielleAndres/M-Chat",
    contributions: [
      "Architected the full-stack AI chat platform from database schema to UI as sole developer",
      "Built multi-modal composer supporting text, file attachments (PDF, CSV, images, code), voice input, and image generation",
      "Implemented rAF-batched streaming to cap re-renders at 60fps — eliminating scroll lag during long AI responses",
      "Designed DB-authoritative quota enforcement via Postgres SECURITY DEFINER functions; client UI cannot bypass limits",
      "Set up Supabase RLS on every user-owned table, a gemini-proxy Edge Function to keep the API key off the browser, and PKCE auth flow",
      "Engineered lazy-loaded admin and developer panels so the main chat bundle stays under 500kB gzip",
    ],
  },
  {
    id: 6,
    title: "E-Community",
    category: "Engagement Platform",
    year: "2025",
    description: "A community engagement platform for residents and local services.",
    tech: ["Next.js", "Tailwind CSS", "Supabase"],
    features: ["Community Feed", "Event Management", "Resident Directory", "Notifications"],
    image: "/Projects/E-Community/screenshots/Screenshot%202025-12-11%20110325.png",
    screenshots: [
      "/Projects/E-Community/screenshots/Screenshot%202025-12-11%20110325.png",
      "/Projects/E-Community/screenshots/Screenshot%202025-12-11%20110332.png",
      "/Projects/E-Community/screenshots/Screenshot%202025-12-11%20110342.png",
      "/Projects/E-Community/screenshots/Screenshot%202025-12-11%20110351.png",
      "/Projects/E-Community/screenshots/Screenshot%202025-12-11%20110417.png",
      "/Projects/E-Community/screenshots/Screenshot%202025-12-11%20110425.png",
      "/Projects/E-Community/screenshots/Screenshot%202025-12-11%20110435.png",
      "/Projects/E-Community/screenshots/Screenshot%202025-12-11%20110452.png",
      "/Projects/E-Community/screenshots/Screenshot%202025-12-11%20110503.png",
      "/Projects/E-Community/screenshots/Screenshot%202025-12-11%20110518.png",
      "/Projects/E-Community/screenshots/Screenshot%202025-12-11%20110541.png",
      "/Projects/E-Community/screenshots/Screenshot%202025-12-11%20110601.png",
      "/Projects/E-Community/screenshots/Screenshot%202025-12-11%20110614.png",
      "/Projects/E-Community/screenshots/Screenshot%202025-12-11%20110638.png",
      "/Projects/E-Community/screenshots/Screenshot%202025-12-11%20110652.png",
      "/Projects/E-Community/screenshots/Screenshot%202025-12-11%20110701.png",
      "/Projects/E-Community/screenshots/Screenshot%202025-12-11%20110725.png",
      "/Projects/E-Community/screenshots/Screenshot%202025-12-11%20110733.png",
      "/Projects/E-Community/screenshots/Screenshot%202025-12-11%20110804.png",
      "/Projects/E-Community/screenshots/Screenshot%202025-12-11%20111628.png",
      "/Projects/E-Community/screenshots/Screenshot%202025-12-11%20111637.png",
      "/Projects/E-Community/screenshots/Screenshot%202025-12-11%20111702.png",
      "/Projects/E-Community/screenshots/Screenshot%202025-12-11%20111710.png",
      "/Projects/E-Community/screenshots/Screenshot%202025-12-11%20111730.png",
      "/Projects/E-Community/screenshots/Screenshot%202025-12-11%20111751.png",
      "/Projects/E-Community/screenshots/Screenshot%202025-12-11%20111759.png",
      "/Projects/E-Community/screenshots/Screenshot%202025-12-11%20111813.png",
      "/Projects/E-Community/screenshots/Screenshot%202025-12-11%20111845.png",
      "/Projects/E-Community/screenshots/Screenshot%202025-12-11%20111929.png",
      "/Projects/E-Community/screenshots/Screenshot%202025-12-11%20111952.png",
      "/Projects/E-Community/screenshots/Screenshot%202025-12-11%20112007.png",
      "/Projects/E-Community/screenshots/Screenshot%202025-12-11%20112016.png",
      "/Projects/E-Community/screenshots/Screenshot%202025-12-11%20112032.png",
      "/Projects/E-Community/screenshots/Screenshot%202025-12-11%20112048.png",
      "/Projects/E-Community/screenshots/Screenshot%202025-12-11%20112111.png",
      "/Projects/E-Community/screenshots/Screenshot%202025-12-11%20112123.png",
      "/Projects/E-Community/screenshots/Screenshot%202025-12-11%20112141.png",
      "/Projects/E-Community/screenshots/Screenshot%202025-12-11%20112229.png",
      "/Projects/E-Community/screenshots/Screenshot%202025-12-11%20112303.png",
    ],
    github: "https://github.com/MaverickDanielleAndres/E-Community-Engagement-Platform",
    contributions: [
      "Built the entire frontend using Next.js and Tailwind CSS",
      "Implemented complex state management for community features",
      "Integrated Supabase for real-time community interactions",
    ],
  },
  {
    id: 11,
    title: "PhotoSnap",
    category: "Web-Based Photobooth App",
    year: "2026",
    description: "A browser-based photobooth app that lets users capture photos, apply real-time filters, edit their strip with customizations, and instantly share via QR code.",
    tech: ["Next.js 16", "Fabric.js", "Supabase", "Sharp", "GSAP"],
    features: ["Live Filters", "Template System", "QR Code Sharing", "Canvas Editor", "GIF Export", "Countdown Timer"],
    image: "/Projects/PhotoSnap/photosnap (1).png",
    screenshots: Array.from({ length: 14 }, (_, i) => `/Projects/PhotoSnap/photosnap (${i + 1}).png`),
    live: "https://photo-snap-webapp.vercel.app/",
    github: "https://github.com/MaverickDanielleAndres/PhotoSnap",
    contributions: [
      "Sole developer — designed and built the full application",
      "Built the canvas-based composition editor using Fabric.js",
      "Engineered real-time camera filter pipeline on live video stream",
      "Implemented multi-format export (PNG, JPG, GIF) and QR code sharing",
      "Developed the dynamic slot-based template and layout system",
    ],
  },
  {
    id: 7,
    title: "SuperFit Webapp",
    category: "Role-Based Fitness Platform",
    year: "2026",
    description: "A fitness web app with three portals — user, coach, and admin. Covers workouts, nutrition, hydration, goal tracking, coach-client management, and community features.",
    tech: ["Next.js 16", "React 19", "Zustand", "Supabase", "Recharts"],
    features: ["Workout Tracking", "AI Nutrition Scan", "Coach Portal", "Meal Planner", "Community Feed", "Messaging"],
    image: "/Projects/SuperFit Web/Superfit (1).png",
    screenshots: Array.from({ length: 48 }, (_, i) => `/Projects/SuperFit Web/Superfit (${i + 1}).png`),
    live: "https://superfit-web-app.vercel.app/",
    github: "https://github.com/MaverickDanielleAndres/superfit",
    contributions: [
      "Built all three portals (User, Coach, Admin) as solo developer",
      "Designed and implemented 80+ REST API route handlers",
      "Architected 14 Zustand domain stores with localStorage persistence",
      "Built AI nutrition scan feature and meal planner with recipe search",
      "Integrated Supabase real-time for live messaging and notifications",
    ],
  },
  {
    id: 8,
    title: "WordPress Development",
    category: "Business Websites & Landing Pages",
    year: "2026",
    description: "Professionally designed business websites built with WordPress, including Mojde Beauty and a Gym business site. Features custom CSS styling and Elementor page builder for a polished, responsive front-end experience.",
    tech: ["WordPress", "Elementor", "Custom CSS"],
    features: ["Custom CSS", "Responsive Layout", "Services Section", "Membership Plans", "Contact Forms"],
    image: "/Projects/WordPress & Shopify/1st.png",
    screenshots: [
      "/Projects/WordPress & Shopify/1st.png",
      "/Projects/WordPress & Shopify/2nd.png",
      "/Projects/WordPress & Shopify/Screenshot 2026-07-18 004402.png",
      "/Projects/WordPress & Shopify/Screenshot 2026-07-18 004418.png",
      "/Projects/WordPress & Shopify/Screenshot 2026-07-18 004538.png",
      ...Array.from({ length: 15 }, (_, i) => `/Projects/WordPress & Shopify/wordpress (${i + 2}).png`)
    ],
    live: "https://mojde.beauty/",
    contributions: [
      "Built multiple websites solo from setup to launch",
      "Designed and structured all pages using Elementor page builder",
      "Wrote custom CSS to override theme styles and achieve unique branding",
      "Managed all site content — copy, images, and page structure",
      "Ensured fully responsive layout across desktop and mobile",
    ],
  },
  {
    id: 9,
    title: "Barangay Health System",
    category: "Management System",
    year: "2024",
    description: "A comprehensive digital health management system for barangay health centers, enabling efficient patient records, appointment scheduling, and health monitoring.",
    tech: ["PHP", "MySQL", "Bootstrap", "JavaScript"],
    features: ["Patient Records", "Appointment Scheduling", "Health Monitoring", "Admin Dashboard"],
    image: "/Projects/Barangay Health System/screenshots/Barangayhealthsystem (1).png",
    screenshots: Array.from({ length: 10 }, (_, i) => `/Projects/Barangay Health System/screenshots/Barangayhealthsystem (${i + 1}).png`),
    contributions: [
      "Designed and implemented the full-stack architecture",
      "Built patient records management system",
      "Developed appointment scheduling module",
    ],
  },
  {
    id: 10,
    title: "Gym Registration",
    category: "Management System",
    year: "2025",
    description: "A gym membership and registration management system with member tracking, payment processing, and class scheduling.",
    tech: ["PHP", "MySQL", "Bootstrap", "jQuery"],
    features: ["Member Registration", "Payment Tracking", "Class Scheduling", "Attendance"],
    image: "/Projects/Gym Registration/screenshots/Gymregistration (1).png",
    screenshots: Array.from({ length: 15 }, (_, i) => `/Projects/Gym Registration/screenshots/Gymregistration (${i + 1}).png`),
    github: "https://github.com/MaverickDanielleAndres/Gym-Registration",
    contributions: [
      "Developed member registration and tracking",
      "Built payment integration module",
      "Implemented class scheduling system",
    ],
  },
];

function EnhancedLightbox({
  images,
  initialIndex,
  onClose,
}: {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [activeImg, setActiveImg] = useState(initialIndex);
  const [direction, setDirection] = useState(0);

  const paginate = (newDirection: number) => {
    const nextIndex = activeImg + newDirection;
    if (nextIndex >= 0 && nextIndex < images.length) {
      setDirection(newDirection);
      setActiveImg(nextIndex);
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") paginate(1);
      if (e.key === "ArrowLeft") paginate(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, activeImg, images.length]);

  // For the film-strip
  const visibleThumbnails = 5;
  const halfVisible = Math.floor(visibleThumbnails / 2);
  const startIndex = Math.max(0, Math.min(images.length - visibleThumbnails, activeImg - halfVisible));

  return (
    <Portal>
      <motion.div
        className="fixed inset-0 z-[999999] flex flex-col items-center justify-between"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Top Header */}
        <div className="w-full flex items-center justify-between p-4 sm:p-8 z-10">
          <div className="text-white/70 text-sm font-medium tracking-widest">
            {activeImg + 1} <span className="mx-1 text-white/30">/</span> {images.length}
          </div>
          <button
            onClick={onClose}
            className="flex h-12 w-12 items-center justify-center rounded-full text-white/50 transition-all hover:text-white hover:bg-white/10"
          >
            <X size={24} />
          </button>
        </div>

        {/* Main Image Area */}
        <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={activeImg}
              custom={direction}
              variants={{
                enter: (direction: number) => ({
                  x: direction > 0 ? 300 : -300,
                  opacity: 0,
                  scale: 0.9,
                }),
                center: {
                  zIndex: 1,
                  x: 0,
                  opacity: 1,
                  scale: 1,
                },
                exit: (direction: number) => ({
                  zIndex: 0,
                  x: direction < 0 ? 300 : -300,
                  opacity: 0,
                  scale: 0.9,
                }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.3 },
              }}
              className="absolute inset-0 flex items-center justify-center p-4 sm:p-12"
            >
              <div className="relative w-full h-full max-w-6xl">
                <Image
                  src={images[activeImg]}
                  alt={`Screenshot ${activeImg + 1}`}
                  fill
                  className="object-contain"
                  quality={90}
                  priority
                  unoptimized
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                  onError={(e: any) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200";
                  }}
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={() => paginate(-1)}
            disabled={activeImg === 0}
            className="absolute left-4 z-20 h-16 w-16 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-0 transition-all"
          >
            <ChevronLeft size={48} strokeWidth={1} />
          </button>
          <button
            onClick={() => paginate(1)}
            disabled={activeImg === images.length - 1}
            className="absolute right-4 z-20 h-16 w-16 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-0 transition-all"
          >
            <ChevronRight size={48} strokeWidth={1} />
          </button>
        </div>

        {/* Film Strip */}
        <div className="w-full max-w-2xl px-4 py-8 z-10" onClick={(e) => e.stopPropagation()}>
          <div className="relative flex items-center justify-center gap-3 overflow-hidden">
            <AnimatePresence mode="popLayout">
              {images.slice(startIndex, startIndex + visibleThumbnails).map((img, idx) => {
                const actualIndex = startIndex + idx;
                const isActive = actualIndex === activeImg;
                return (
                  <motion.div
                    key={img}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className={`relative w-20 aspect-video rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
                      isActive ? "border-white scale-110 shadow-xl z-20" : "border-transparent opacity-40 hover:opacity-100"
                    }`}
                    onClick={() => {
                      setDirection(actualIndex > activeImg ? 1 : -1);
                      setActiveImg(actualIndex);
                    }}
                  >
                    <Image src={img} alt="thumbnail" fill className="object-cover" sizes="80px" />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </Portal>
  );
}

function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, lightboxOpen]);

  return (
    <Portal>
      <motion.div
        className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-6"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-4xl rounded-3xl overflow-hidden flex flex-col shadow-[0_32px_64px_rgba(0,0,0,0.5)]"
          style={{ background: "var(--bg)", color: "var(--fg)", maxHeight: "min(94vh, 960px)" }}
          initial={{ y: 100, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Header */}
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={onClose}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white transition-all hover:scale-110 active:scale-95"
            >
              <X size={20} />
            </button>
          </div>

          <div className="overflow-y-auto w-full h-full" data-lenis-prevent="true">
            {/* Main Preview Image */}
            <div
              className="relative w-full group cursor-pointer overflow-hidden"
              style={{ background: "var(--muted)", height: "clamp(250px, 40vh, 450px)" }}
              onClick={() => setLightboxOpen(true)}
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                priority
                unoptimized
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw"
                onError={(e: any) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                <button
                  className="flex items-center gap-3 px-6 py-3 rounded-full bg-white text-black font-semibold text-sm shadow-xl transition-all hover:scale-105 active:scale-95"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxOpen(true);
                  }}
                >
                  <Maximize2 size={16} />
                  View Gallery ({project.screenshots.length} Screenshots)
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-10 md:p-14">
              <div className="flex flex-col md:flex-row gap-10 items-start">
                <div className="flex-1 space-y-8">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] mb-3 font-semibold" style={{ color: "var(--accent)" }}>
                      {project.category} &middot; {project.year}
                    </p>
                    <h2 className="text-4xl md:text-5xl font-medium tracking-tight leading-none mb-6">
                      {project.title}
                    </h2>
                    <p className="text-lg leading-relaxed opacity-80 max-w-xl">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-4">
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--fg)] text-[var(--bg)] font-medium text-sm transition-transform hover:scale-105"
                      >
                        Visit Site <ExternalLink size={16} />
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 rounded-full border border-[var(--border)] font-medium text-sm transition-all hover:bg-[var(--fg)] hover:text-[var(--bg)]"
                      >
                        GitHub <Github size={16} />
                      </a>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xs uppercase tracking-widest mb-6 opacity-40 font-bold">Key Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.features.map((f) => (
                        <span 
                          key={f} 
                          className="px-4 py-2 rounded-full text-xs font-medium border border-[var(--accent)] text-[var(--accent)]"
                          style={{ backgroundColor: 'color-mix(in srgb, var(--accent) 10%, transparent)' }}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-80 space-y-10">
                  <div>
                    <h3 className="text-xs uppercase tracking-widest mb-6 opacity-40 font-bold">Tech Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((t) => (
                        <span key={t} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--muted)] border border-[var(--border-subtle)]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs uppercase tracking-widest mb-6 opacity-40 font-bold">Key Contributions</h3>
                    <ul className="space-y-4">
                      {project.contributions.map((c, i) => (
                        <li key={i} className="flex gap-4 text-sm opacity-80 leading-relaxed">
                          <span className="text-[var(--accent)] font-bold">→</span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {lightboxOpen && (
          <EnhancedLightbox
            images={project.screenshots}
            initialIndex={0}
            onClose={() => setLightboxOpen(false)}
          />
        )}
      </AnimatePresence>
    </Portal>
  );
}

// ─── Project Card ────────────────────────────────────────────────────────────
function ProjectCard({
  project,
  onClick,
}: {
  project: Project;
  onClick: () => void;
}) {
  // Show at most 3 tech tags to keep card scannable
  const visibleTech = project.tech.slice(0, 3);

  return (
    <article
      className="project-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Open details for ${project.title}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Image */}
      <div className="project-card__image-wrap">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 85vw, (max-width: 1024px) 40vw, 28vw"
          unoptimized
          draggable={false}
          onError={(e: any) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800";
          }}
        />
      </div>

      {/* Body */}
      <div className="project-card__body">
        {/* Meta row */}
        <p className="project-card__meta">
          {project.category}&nbsp;&middot;&nbsp;{project.year}
        </p>

        {/* Title */}
        <h3 className="project-card__title">{project.title}</h3>

        {/* Description — 2-line clamp */}
        <p className="project-card__desc">{project.description}</p>

        {/* Tech tags */}
        {visibleTech.length > 0 && (
          <div className="project-card__tags">
            {visibleTech.map((tag) => (
              <span key={tag} className="project-card__tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <span className="project-card__cta" aria-hidden="true">
          View Project&nbsp;<ArrowUpRight size={11} strokeWidth={2} />
        </span>
      </div>
    </article>
  );
}

// ─── Projects Section ─────────────────────────────────────────────────────────
const CARD_STEP_PX = 420;
const LOOP_DURATION_S = 55; // seconds for one full loop

export default function Projects() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isDragging, setIsDragging]       = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);
  const outerRef   = useRef<HTMLDivElement>(null);
  
  // Animation trigger (runs once)
  const inView     = useInView(sectionRef, { once: true, margin: "-5% 0px" });
  
  // Visibility tracking for rAF performance (pauses when offscreen)
  const isVisible  = useInView(sectionRef, { margin: "400px" });

  // ── rAF engine state (all refs → zero React re-renders per frame)
  const xRef        = useRef(0);          // current rendered position px (unbounded, negative)
  const targetXRef  = useRef<number | null>(null); // null = auto-scroll, number = spring target
  const speedRef    = useRef(0);          // px/s, computed once from DOM
  const isPausedRef = useRef(false);      // hover pause
  const reducedRef  = useRef(false);      // prefers-reduced-motion

  // ── Drag state
  const drag = useRef({
    active:   false,
    startX:   0,
    frozenX:  0,
    lastX:    0,
    lastTime: 0,
    velocity: 0, // px/s
    hasMoved: false,
  });
  const velocityRef = useRef(0); // post-drag inertia px/s
  // Ref to active window drag listeners so we can clean them up on unmount
  const activeDragListeners = useRef<{
    move: (e: PointerEvent) => void;
    up:   (e: PointerEvent) => void;
  } | null>(null);

  // ── Duplicate for seamless visual loop
  const marqueeProjects = [...PROJECTS, ...PROJECTS];

  // ── rAF loop — only one effect, cleans up on unmount
  useEffect(() => {
    // If section is far offscreen, don't run the animation loop
    if (!isVisible) return;

    // Respect prefers-reduced-motion
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (outerRef.current) {
      outerRef.current.dataset.reducedMotion = reducedRef.current ? "1" : "";
    }

    let rafId = 0;
    let lastTime = 0;

    function tick(time: number) {
      rafId = requestAnimationFrame(tick);
      const el = trackRef.current;
      if (!el) return;

      // Measure half-width once (after first paint)
      if (!speedRef.current && el.scrollWidth > 0) {
        const hw = el.scrollWidth / 2;
        speedRef.current = reducedRef.current ? 0 : hw / LOOP_DURATION_S;
      }
      const hw = el.scrollWidth / 2;
      if (!hw) return;

      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.1) : 0;
      lastTime = time;
      if (!dt) return;

      if (!drag.current.active) {
        // Post-drag inertia (frame-rate independent exponential decay)
        if (velocityRef.current !== 0) {
          xRef.current += velocityRef.current * dt;
          velocityRef.current *= Math.pow(0.88, dt * 60);
          if (Math.abs(velocityRef.current) < 1.5) velocityRef.current = 0;
        } else if (targetXRef.current !== null) {
          // Exponential spring toward button-click target
          const diff = targetXRef.current - xRef.current;
          const t    = 1 - Math.exp(-12 * dt); // ~12 = snappy-but-smooth
          xRef.current += diff * t;
          if (Math.abs(diff) < 0.4) {
            xRef.current    = targetXRef.current;
            targetXRef.current = null; // spring done → resume auto-scroll
          }
        } else if (!isPausedRef.current && speedRef.current > 0) {
          // Auto-scroll
          xRef.current -= speedRef.current * dt;
        }
      }
      // (during drag, xRef is written by window listeners — nothing to do here)

      // Wrap visually: map unbounded x into [-hw, 0]
      const displayX = ((xRef.current % hw) + hw) % hw - hw;
      el.style.transform = `translate3d(${displayX}px, 0, 0)`;
    }

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      // Clean up any window drag listeners left from an interrupted drag
      if (activeDragListeners.current) {
        window.removeEventListener("pointermove", activeDragListeners.current.move);
        window.removeEventListener("pointerup",   activeDragListeners.current.up);
        activeDragListeners.current = null;
      }
    };
  }, [isVisible]);

  // ── Button navigation — spring to target
  const handlePrev = () => {
    velocityRef.current = 0;
    targetXRef.current  = (targetXRef.current ?? xRef.current) + CARD_STEP_PX;
    isPausedRef.current = false;
  };

  const handleNext = () => {
    velocityRef.current = 0;
    targetXRef.current  = (targetXRef.current ?? xRef.current) - CARD_STEP_PX;
    isPausedRef.current = false;
  };

  // ── Pointer drag — window-level listeners so card onClick fires normally on simple clicks
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    targetXRef.current  = null;
    velocityRef.current = 0;
    drag.current = {
      active:   true,
      startX:   e.clientX,
      frozenX:  xRef.current,
      lastX:    e.clientX,
      lastTime: performance.now(),
      velocity: 0,
      hasMoved: false,
    };
    isPausedRef.current = true;
    setIsDragging(true);

    const onMove = (ev: PointerEvent) => {
      if (!drag.current.active) return;
      const now  = performance.now();
      const dtMs = now - drag.current.lastTime;
      if (dtMs > 0) drag.current.velocity = (ev.clientX - drag.current.lastX) / (dtMs / 1000);
      drag.current.lastX    = ev.clientX;
      drag.current.lastTime = now;
      const totalDelta = ev.clientX - drag.current.startX;
      if (Math.abs(totalDelta) > 5) drag.current.hasMoved = true;
      xRef.current = drag.current.frozenX + totalDelta;
    };

    const onUp = (ev: PointerEvent) => {
      if (!drag.current.active) return;
      const finalX = drag.current.frozenX + (ev.clientX - drag.current.startX);
      xRef.current        = finalX;
      velocityRef.current = drag.current.velocity * 0.45;
      drag.current.active = false;
      isPausedRef.current = false;
      setIsDragging(false);
      // hasMoved resets AFTER the synchronous click event fires
      setTimeout(() => { drag.current.hasMoved = false; }, 50);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup",   onUp);
      activeDragListeners.current = null;
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup",   onUp);
    activeDragListeners.current = { move: onMove, up: onUp };
  };



  return (
    <section
      id="projects"
      ref={sectionRef}
      style={{
        background:    "var(--bg-projects)",
        color:         "var(--fg)",
        paddingTop:    "clamp(4rem,10vh,7rem)",
        paddingBottom: "clamp(1rem,3vh,2rem)",
        position:      "relative",
        overflow:      "hidden",
      }}
    >
      {/* ── Section header */}
      <div
        style={{
          paddingInline:  "var(--container-px)",
          marginBottom:   "clamp(2rem,4vh,3rem)",
          display:        "flex",
          alignItems:     "flex-end",
          justifyContent: "space-between",
          gap:            "1rem",
        }}
      >
        <div>
          <motion.p
            className="text-xs uppercase tracking-[0.18em] mb-4"
            style={{ color: "var(--fg-muted)" }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            Portfolio
          </motion.p>
          <motion.h2
            style={{
              fontSize:      "clamp(1.75rem,3vw,2.5rem)",
              fontWeight:    400,
              lineHeight:    1.2,
              letterSpacing: "-0.01em",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Selected Projects &amp; Work
          </motion.h2>
        </div>

        {/* Nav buttons */}
        <motion.div
          className="flex items-center gap-2 flex-shrink-0"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <button onClick={handlePrev} aria-label="Previous projects" className="marquee-nav-btn">
            <ChevronLeft size={18} strokeWidth={1.5} />
          </button>
          <button onClick={handleNext} aria-label="Next projects" className="marquee-nav-btn">
            <ChevronRight size={18} strokeWidth={1.5} />
          </button>
        </motion.div>
      </div>

      {/* ── Infinite Marquee */}
      <motion.div
        ref={outerRef}
        className={`projects-marquee-outer${isDragging ? " is-dragging" : ""}`}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.25 }}
        onMouseEnter={() => { if (!drag.current.active) isPausedRef.current = true;  }}
        onMouseLeave={() => { if (!drag.current.active) isPausedRef.current = false; }}
        onPointerDown={onPointerDown}
        style={{ paddingBlock: "1.5rem", userSelect: "none" }}
        aria-label="Project showcase — drag or use arrows to browse, click any card to view details"
      >
        <div className="projects-marquee-track" ref={trackRef}>
          {marqueeProjects.map((project, i) => (
            <ProjectCard
              key={`${project.id}-${i}`}
              project={project}
              onClick={() => {
                if (!drag.current.hasMoved) setActiveProject(project);
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* ── Project Modal (unchanged) */}
      <AnimatePresence>
        {activeProject && (
          <ProjectModal
            project={activeProject}
            onClose={() => setActiveProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
