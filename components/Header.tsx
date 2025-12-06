"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const items = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#cert/proj" },
  { label: "Contact", href: "#contact" },
];

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  // scroll effect for background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style jsx global>{`
        .nav-item-enter {
          opacity: 0;
          transform: translateY(-50px);
          transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .nav-item-enter-active {
          opacity: 1;
          transform: translateY(0);
        }
        .nav-link {
          position: relative;
        }
        .nav-link::after {
          content: "";
          position: absolute;
          width: 0%;
          height: 2px;
          left: 0;
          bottom: -4px;
          background: white;
          transition: width 0.3s ease;
        }
        .nav-link:hover::after {
          width: 100%;
        }
      `}</style>

      <header className={`${isScrolled ? 'bg-black/70 backdrop-blur-md' : 'bg-transparent'} w-full fixed top-0 left-0 z-[1100] transition-all duration-300`}>
        <div
          className={`flex justify-between items-center px-6 md:px-8 py-4 md:py-6 relative nav-item-enter ${
            isLoaded ? "nav-item-enter-active" : ""
          }`}
        >
          {/* Logo */}
          <img
            src="/logo.png"
            alt="Logo"
            className="h-8 md:h-10 w-auto cursor-pointer hover:scale-110 transition-transform duration-300"
          />

          {/* Right side (Resume + Popup Nav) */}
          <div className="flex items-center gap-4 relative" ref={menuRef}>
            {/* Resume Button */}
            <button
              onClick={() => {
                try {
                  // Create a temporary link to trigger the download
                  const link = document.createElement('a');
                  link.href = '/Files/Resume.pdf';
                  link.download = 'Maverick_Danielle_Andres_Resume.pdf';
                  link.style.display = 'none';

                  // Add to DOM, click, and remove
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);

                  console.log('Resume download initiated successfully');
                } catch (error) {
                  console.error('Download failed:', error);
                }
              }}
              className="px-4 py-2 rounded-full border border-gray-500/40 bg-gradient-to-r from-gray-800 to-gray-900 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Resume
            </button>

            {/* Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="cursor-pointer ml-2 p-2 rounded-full border border-gray-500/40 bg-black/70 text-white shadow-md hover:bg-black hover:scale-105 transition-all duration-200"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Popup Navigation */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="absolute right-0 top-14 w-56 rounded-2xl border border-gray-700 bg-black/95 shadow-2xl backdrop-blur-md"
                >
                  <ul className="flex flex-col p-4 space-y-3">
                    {items.map((item) => (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          className={`block px-4 py-2 rounded-lg text-white text-sm font-medium hover:bg-gray-800/60 transition ${
                            pathname === item.href ? "bg-gray-800/40 font-bold" : ""
                          }`}
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>
    </>
  );
}
