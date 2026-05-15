"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ImageSwiper } from "@/components/ui/image-swiper";
import { ArrowUpRight, Download, Github, Linkedin, Facebook, Instagram } from "lucide-react";
import Portal from "@/components/Portal";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { useTheme } from "next-themes";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const BIO =
  "I'm Maverick, a developer who loves building apps that actually work. Whether it's a smooth React frontend or a solid PHP/node backend, I enjoy making code clean and useful. I'm all about creating digital tools that solve real problems.";

function WordReveal({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const words = text.split(" ");
  return (
    <div ref={ref} style={{ display: "flex", flexWrap: "wrap", columnGap: "0.25em" }}>
      {words.map((word, i) => (
        <span key={i} style={{ overflow: "hidden", display: "inline-block" }}>
          <motion.span
            style={{ display: "inline-block" }}
            initial={{ y: "110%" }}
            animate={inView ? { y: 0 } : { y: "110%" }}
            transition={{ duration: 0.7, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </div>
  );
}

const AWARDS = [
  { sem: "1st Sem AY 2022-2023", award: "Dean's Lister", image: "/Academic Awards/dean's lister.png" },
  { sem: "2nd Sem AY 2022-2023", award: "President's Lister", image: "/Academic Awards/president lister.png" },
  { sem: "1st Sem AY 2023-2024", award: "President's Lister", image: "/Academic Awards/awards.png" },
  { sem: "2nd Sem AY 2023-2024", award: "President's Lister", image: "/Academic Awards/1awards.png" },
  { sem: "1st Sem AY 2024-2025", award: "President's Lister", image: "/Academic Awards/2awards.png" },
];

const SOCIAL_LINKS = [
  { icon: "github", label: "GitHub", href: "https://github.com/MaverickDanielleAndres" },
  { icon: "linkedin", label: "LinkedIn", href: "https://linkedin.com/in/maverick-danielle-andres-641564373" },
  { icon: "facebook", label: "Facebook", href: "https://www.facebook.com/maverickdanielle.andres" },
  { icon: "instagram", label: "Instagram", href: "https://www.instagram.com/mavs_verick/" },
];

const ABOUT_SWIPER_IMAGES = [
  "/AboutMe-Photo/aboutme-1.jpg",
  "/AboutMe-Photo/aboutme-2.jpg",
  "/AboutMe-Photo/aboutme-3.jpg",
  "/AboutMe-Photo/aboutme-4.jpg",
  "/AboutMe-Photo/aboutme-5.jpg",
  "/AboutMe-Photo/aboutme-6.jpg",
].join(",");

export default function About() {
  const [awardsOpen, setAwardsOpen] = useState(false);
  const [selectedAwardImage, setSelectedAwardImage] = useState<string | null>(null);
  const [swiperSize, setSwiperSize] = useState({ width: 320, height: 420 });
  const sectionRef = useRef<HTMLElement>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  useEffect(() => {
    const updateSwiperSize = () => {
      if (window.innerWidth < 420) {
        const width = Math.max(220, Math.min(280, window.innerWidth - 96));
        setSwiperSize({ width, height: Math.round(width * 1.3) });
        return;
      }

      if (window.innerWidth < 768) {
        setSwiperSize({ width: 290, height: 390 });
        return;
      }

      setSwiperSize({ width: 320, height: 420 });
    };

    updateSwiperSize();
    window.addEventListener("resize", updateSwiperSize);
    return () => window.removeEventListener("resize", updateSwiperSize);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const st = { trigger: sectionRef.current!, start: "top 78%", once: true };

      gsap.fromTo(
        "[data-about-label]",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", scrollTrigger: st }
      );

      gsap.fromTo(
        "[data-about-left]",
        { opacity: 0, x: -60 },
        { opacity: 1, x: 0, duration: 0.9, ease: "power3.out", scrollTrigger: st }
      );

      gsap.fromTo(
        "[data-about-right]",
        { opacity: 0, x: 60 },
        { opacity: 1, x: 0, duration: 0.9, delay: 0.08, ease: "power3.out", scrollTrigger: st }
      );

      gsap.fromTo(
        "[data-education-animate]",
        { opacity: 0, x: -150 },
        {
          opacity: 1,
          x: 0,
          duration: 1.1,
          stagger: 0.12,
          ease: "power4.out",
          delay: 0.4,
          scrollTrigger: st,
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="section-about"
      style={{
        background: "var(--bg-about)",
        color: "var(--fg)",
        padding: "clamp(5rem,12vh,9rem) var(--container-px) clamp(8rem,15vh,12rem)",
      }}
    >
      <div style={{ maxWidth: 1240, marginInline: "auto" }}>
        <p
          data-about-label
          className="text-xs uppercase tracking-[0.18em] mb-6"
          style={{ color: "var(--fg-muted)", opacity: 0 }}
        >
          About me
        </p>

        <div
          className="grid grid-cols-1 items-center xl:[grid-template-columns:minmax(0,1.25fr)_minmax(320px,0.75fr)]"
          style={{ gap: "clamp(1.5rem,4vw,3rem)" }}
        >
          <div
            data-about-left
            style={{
              minHeight: 480,
              borderRadius: "1rem",
              overflow: "hidden",
              opacity: 0,
            }}
            className="order-2 relative flex items-center justify-center p-2 sm:p-4 xl:order-2 xl:justify-self-end"
          >
            <ImageSwiper images={ABOUT_SWIPER_IMAGES} cardWidth={swiperSize.width} cardHeight={swiperSize.height} />
            <p
              className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.22em]"
              style={{
                color: "var(--swipe-me-color)",
                opacity: "var(--swipe-me-opacity, 0.18)"
              }}
              aria-hidden="true"
            >
              swipe me
            </p>
          </div>

          <div
            data-about-right
            style={{ opacity: 0 }}
            className="order-1 flex flex-col gap-6 justify-center xl:order-1 xl:max-w-[760px]"
          >
            <div
              style={{
                fontSize: "clamp(1.05rem,1.8vw,1.5rem)",
                fontWeight: 400,
                lineHeight: 1.5,
                letterSpacing: "-0.01em",
              }}
            >
              <WordReveal text={BIO} />
            </div>

            <p
              data-education-animate
              className="text-sm leading-relaxed"
              style={{ color: "var(--fg-muted)", maxWidth: "52ch" }}
            >
              When not coding, I explore new tech, build side projects, and dive into networking or sysadmin stuff just to see how things work.
            </p>

            <div className="flex flex-col gap-6">
              <div data-education-animate style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "1.5rem" }}>
                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "var(--fg-muted)" }}>
                  Education
                </p>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">Pamantasan ng Lungsod ng Pasig</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--fg-muted)" }}>
                      BS Information Technology &middot; 2022&ndash;2026
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--fg-muted)" }}>GWA: 1.50</p>
                  </div>
                  <div className="shrink-0 relative w-[72px] h-[72px]">
                    <Image
                      src="/updatedprofile_pic.png"
                      alt="Maverick profile"
                      fill
                      className="rounded-full object-cover shadow-lg"
                      sizes="72px"
                      priority
                    />
                  </div>
                </div>
                <button
                  onClick={() => setAwardsOpen(true)}
                  className="mt-3 text-xs underline underline-offset-2 hover:opacity-70 transition-opacity"
                  style={{ color: "var(--accent)" }}
                >
                  View Academic Awards
                </button>
              </div>

              <div data-education-animate className="flex flex-col gap-1 mt-1">
                <div className="flex gap-3">
                  <a
                    href="/Files/Resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 justify-center text-xs font-medium transition-all flex-1 hover:scale-[1.02] active:scale-95"
                    style={{
                      background: "var(--fg)",
                      color: "var(--bg)",
                      borderRadius: "0.5rem",
                      padding: "0.6rem 1rem",
                      textDecoration: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                    }}
                  >
                    <Download size={13} />
                    Download CV
                  </a>

                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 justify-center text-xs font-medium transition-all flex-1 hover:scale-[1.02] active:scale-95"
                    style={{
                      background: "var(--accent)",
                      color: "#fff",
                      borderRadius: "0.5rem",
                      padding: "0.6rem 1rem",
                      textDecoration: "none",
                      boxShadow: "0 4px 12px rgba(96,85,240,0.2)"
                    }}
                  >
                    Hire Me <ArrowUpRight size={13} />
                  </a>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {SOCIAL_LINKS.map(({ icon, label, href }) => (
                    <div 
                      key={label}
                      className="relative transition-all duration-500 ease-out hover:-translate-y-1.5 hover:z-30 group/social"
                    >
                      <SpotlightCard
                        spotlightColor={isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.05)"}
                        className="w-full rounded-[0.5rem] overflow-hidden border border-black/5 dark:border-white/10 group-hover/social:border-black/20 dark:group-hover/social:border-white/30 transition-colors duration-300"
                      >
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={label}
                          className="flex items-center justify-center transition-all duration-300"
                          style={{
                            height: 44,
                            width: "100%",
                            position: "relative",
                            zIndex: 2,
                            color: isDark ? "#ffffff" : "#000000",
                            background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"
                          }}
                        >
                          {icon === "github" && <Github size={18} strokeWidth={1.5} />}
                          {icon === "linkedin" && <Linkedin size={18} strokeWidth={1.5} />}
                          {icon === "facebook" && <Facebook size={18} strokeWidth={1.5} />}
                          {icon === "instagram" && <Instagram size={18} strokeWidth={1.5} />}
                        </a>
                      </SpotlightCard>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {awardsOpen && (
        <Portal>
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
            onClick={() => setAwardsOpen(false)}
          >
            <motion.div
              className="relative w-full max-w-2xl rounded-2xl p-8 overflow-y-auto"
              style={{ background: "var(--bg)", color: "var(--fg)", maxHeight: "85vh" }}
              data-lenis-prevent="true"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-medium mb-6">Academic Awards</h3>
              
              <div className="mb-10 p-5 rounded-2xl bg-black/5 border border-black/10 transition-all duration-300 hover:scale-[1.01] hover:bg-black/[0.08] hover:border-black/20 group" style={{ background: "var(--border-subtle)", borderColor: "var(--border)" }}>
                <p className="text-[9px] uppercase tracking-[0.25em] font-bold text-center mb-2 opacity-50 group-hover:opacity-80 transition-opacity" style={{ color: "var(--fg)" }}>Achievement</p>
                <div className="flex justify-center overflow-hidden">
                  <p className="text-[13px] text-center font-medium whitespace-nowrap" style={{ color: "var(--fg)" }}>
                    &ldquo;Consistent Dean&apos;s Lister from 1st Year to 4th Year College and currently running for Cum Laude.&rdquo;
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {AWARDS.map((a, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <div
                      className="relative rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      style={{ aspectRatio: "4/3", background: "var(--border-subtle)" }}
                      onClick={() => setSelectedAwardImage(a.image)}
                    >
                      <Image
                        src={a.image}
                        alt={a.award}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                    <p className="text-xs font-medium">{a.award}</p>
                    <p className="text-xs" style={{ color: "var(--fg-muted)" }}>{a.sem}</p>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => setAwardsOpen(false)}
                className="absolute top-5 right-5 text-xs opacity-40 hover:opacity-80"
              >
                Close
              </button>
            </motion.div>
          </div>
        </Portal>
      )}

      {selectedAwardImage && (
        <Portal>
          <div
            className="fixed inset-0 z-[100000] flex items-center justify-center p-4 sm:p-8"
            style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)" }}
            onClick={() => setSelectedAwardImage(null)}
          >
            <motion.div
              className="relative w-full max-w-5xl h-full max-h-[85vh] rounded-xl overflow-hidden flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedAwardImage(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                aria-label="Close image"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <div className="relative w-full h-full">
                <Image
                  src={selectedAwardImage}
                  alt="Enlarged Award"
                  fill
                  className="object-contain"
                  quality={100}
                />
              </div>
            </motion.div>
          </div>
        </Portal>
      )}
    </section>
  );
}
