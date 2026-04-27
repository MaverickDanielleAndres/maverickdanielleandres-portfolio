"use client";

import { Github, Linkedin, Facebook, Instagram, Mail, MapPin, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

const socialLinks = [
  { icon: Github, url: "https://github.com/MaverickDanielleAndres", label: "GitHub" },
  { icon: Linkedin, url: "https://www.linkedin.com/in/maverick-danielle-andres-641564373", label: "LinkedIn" },
  { icon: Facebook, url: "https://www.facebook.com/maverickdanielle.andres/", label: "Facebook" },
  { icon: Instagram, url: "https://www.instagram.com/mavs_verick", label: "Instagram" },
  { icon: Mail, url: "mailto:maverickdanielle@gmail.com", label: "Email" },
];

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Certificates", href: "#certificates" },
  { label: "Contact", href: "#contact" },
];

export default function FooterSection() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border bg-card/50 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
                M
              </div>
              <span className="text-lg font-bold text-foreground">Maverick Danielle</span>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              Full-stack development, Networking, Web Design, System Administration, Cybersecurity
            </p>
            <div className="flex gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg border border-border",
                    "text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/30 hover:text-foreground"
                  )}
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                Philippines
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <a href="mailto:maverickdanielle@gmail.com" className="transition-colors hover:text-foreground">
                  maverickdanielle@gmail.com
                </a>
              </li>
              <li className="text-sm text-muted-foreground">
                Available for freelance &middot; 8:00 AM - 11:00 PM
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} Maverick Danielle P. Andres. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">Built with Next.js</span>
            <button
              onClick={scrollToTop}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border border-border",
                "text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:text-foreground"
              )}
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
