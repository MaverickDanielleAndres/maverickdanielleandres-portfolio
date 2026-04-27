"use client";
import { useState, useEffect } from "react";
import Magnet from "@/components/ui/Magnet";

export default function Header() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDownloadResume = () => {
    try {
      const link = document.createElement("a");
      link.href = "/Files/Resume.pdf";
      link.download = "Maverick_Danielle_Andres_Resume.pdf";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <>
      <style jsx global>{`
        .nav-item-enter {
          opacity: 0;
          transform: translateY(-20px);
          transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .nav-item-enter-active {
          opacity: 1;
          transform: translateY(0);
        }
        .header-resume-btn {
          border: 1px solid var(--border-subtle);
          border-radius: 9999px;
          color: var(--fg);
          background: transparent;
          padding: 0.5rem 1.25rem;
          font-size: 0.875rem;
          font-weight: 400;
          transition: background 0.2s, color 0.2s;
          cursor: pointer;
        }
        .header-resume-btn:hover {
          background: var(--fg);
          color: var(--bg);
        }
      `}</style>
      <header
        className="w-full fixed top-0 left-0 z-[1100] transition-all duration-300"
        style={{
          background: isScrolled ? "var(--bg)" : "transparent",
          borderBottom: isScrolled ? "1px solid var(--border-subtle)" : "none",
          backdropFilter: isScrolled ? "blur(12px)" : "none",
        }}
      >
        <div
          className={`flex justify-between items-center px-[var(--container-px)] py-4 md:py-5 nav-item-enter ${
            isLoaded ? "nav-item-enter-active" : ""
          }`}
        >
          <a
            href="#home"
            style={{ color: "var(--fg)", textDecoration: "none" }}
            className="flex items-baseline gap-1.5 cursor-pointer"
          >
            <span style={{ fontSize: "0.75rem", opacity: 0.5, fontWeight: 300 }}></span>
            <span style={{ fontSize: "0.875rem", fontWeight: 500, letterSpacing: "-0.01em" }}>
              Maverick
            </span>
          </a>

          <Magnet padding={60} magnetStrength={40}>
            <button onClick={handleDownloadResume} className="header-resume-btn">
              Resume 
            </button>
          </Magnet>
        </div>
      </header>
    </>
  );
}
