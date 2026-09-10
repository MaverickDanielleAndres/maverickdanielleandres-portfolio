"use client";

/**
 * Smart CTA chips rendered inside chat bubbles.
 *
 * The intent comes from `chat-faq.ts`. Only intents the visitor clearly
 * cares about are surfaced — we don't dump every channel after every reply.
 */

import * as React from "react";
import {
  ArrowUpRight,
  Briefcase,
  Download,
  Github,
  Linkedin,
  Mail,
  MessageCircle,
  Phone,
  Sparkles,
} from "lucide-react";
import type { CtaIntent } from "./chat-faq";

type CtaConfig = {
  id: CtaIntent;
  label: string;
  href: string | null;
  icon: React.ReactNode;
  /** When true, opens in a new tab with rel=noopener noreferrer. */
  external?: boolean;
  /** When true, dispatches the global "open-inquiry-modal" event. */
  opensInquiry?: boolean;
};

const CTAS: Record<CtaIntent, CtaConfig> = {
  "start-project": {
    id: "start-project",
    label: "Start a Project",
    href: null,
    icon: <Sparkles size={12} strokeWidth={2} />,
    opensInquiry: true,
  },
  "contact-email": {
    id: "contact-email",
    label: "Email",
    href: "mailto:maverickdanielle@gmail.com",
    icon: <Mail size={12} strokeWidth={2} />,
  },
  "contact-whatsapp": {
    id: "contact-whatsapp",
    label: "WhatsApp",
    href: "https://wa.me/639632968188",
    icon: <MessageCircle size={12} strokeWidth={2} />,
    external: true,
  },
  "contact-phone": {
    id: "contact-phone",
    label: "Phone",
    href: "tel:+639632968188",
    icon: <Phone size={12} strokeWidth={2} />,
  },
  "contact-messenger": {
    id: "contact-messenger",
    label: "Messenger",
    href: "https://m.me/maverickdanielle.andres",
    icon: <MessageCircle size={12} strokeWidth={2} />,
    external: true,
  },
  "contact-form": {
    id: "contact-form",
    label: "Contact Form",
    href: "#contact",
    icon: <ArrowUpRight size={12} strokeWidth={2} />,
  },
  "view-resume": {
    id: "view-resume",
    label: "Resume",
    href: "/Files/Resume.pdf",
    icon: <Download size={12} strokeWidth={2} />,
    external: true,
  },
  "view-projects": {
    id: "view-projects",
    label: "View Projects",
    href: "#projects",
    icon: <Briefcase size={12} strokeWidth={2} />,
  },
  "view-github": {
    id: "view-github",
    label: "GitHub",
    href: "https://github.com/MaverickDanielleAndres",
    icon: <Github size={12} strokeWidth={2} />,
    external: true,
  },
  "view-linkedin": {
    id: "view-linkedin",
    label: "LinkedIn",
    href: "https://linkedin.com/in/maverick-danielle-andres-641564373",
    icon: <Linkedin size={12} strokeWidth={2} />,
    external: true,
  },
  "view-instagram": {
    id: "view-instagram",
    label: "Instagram",
    href: "https://www.instagram.com/mavs_verick/",
    icon: <ArrowUpRight size={12} strokeWidth={2} />,
    external: true,
  },
};

function openInquiryModal() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("open-inquiry-modal"));
}

export function ChatCtas({ intents }: { intents: CtaIntent[] }) {
  if (!intents || intents.length === 0) return null;
  // De-dupe while preserving order.
  const seen = new Set<CtaIntent>();
  const ordered: CtaIntent[] = [];
  for (const i of intents) {
    if (!seen.has(i)) {
      seen.add(i);
      ordered.push(i);
    }
  }
  return (
    <div
      className="flex flex-wrap gap-1.5 pt-1.5"
      role="group"
      aria-label="Quick actions"
    >
      {ordered.map((id) => {
        const cta = CTAS[id];
        if (!cta) return null;
        const baseClass =
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all duration-150 hover:scale-[1.03] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]";
        const style: React.CSSProperties = {
          border: "1px solid var(--border-subtle)",
          color: "var(--fg)",
          background: "color-mix(in srgb, var(--fg) 4%, transparent)",
        };
        const onClick = cta.opensInquiry
          ? (e: React.MouseEvent) => {
              e.preventDefault();
              openInquiryModal();
            }
          : undefined;
        if (cta.href) {
          return (
            <a
              key={cta.id}
              href={cta.href}
              target={cta.external ? "_blank" : undefined}
              rel={cta.external ? "noopener noreferrer" : undefined}
              className={baseClass}
              style={style}
            >
              {cta.icon}
              {cta.label}
            </a>
          );
        }
        return (
          <button
            key={cta.id}
            type="button"
            onClick={onClick}
            className={baseClass}
            style={style}
          >
            {cta.icon}
            {cta.label}
          </button>
        );
      })}
    </div>
  );
}

/** Maps an `Intent` to its default CTAs (used when no FAQ match). */
export function defaultCtasFor(
  intent:
    | "hire"
    | "contact"
    | "project"
    | "ai"
    | "skills"
    | "experience"
    | "education"
    | "freelance"
    | "frontend"
    | "backend"
    | "database"
    | "mobile"
    | "design"
    | "pricing"
    | "availability"
    | "resume"
    | "social"
    | "unrelated"
    | "unknown",
): CtaIntent[] {
  switch (intent) {
    case "hire":
      return ["start-project", "contact-form"];
    case "contact":
      return ["contact-email", "contact-whatsapp", "contact-phone", "contact-messenger", "contact-form"];
    case "project":
      return ["view-projects"];
    case "ai":
      return ["view-projects"];
    case "skills":
      return ["start-project", "view-projects"];
    case "experience":
      return ["view-resume"];
    case "education":
      return ["view-resume"];
    case "freelance":
      return ["start-project", "contact-email"];
    case "frontend":
    case "backend":
    case "database":
    case "mobile":
    case "design":
      return ["view-projects"];
    case "pricing":
      return ["start-project", "contact-email"];
    case "availability":
      return ["start-project", "contact-email"];
    case "resume":
      return ["view-resume"];
    case "social":
      return ["view-github", "view-linkedin"];
    case "unrelated":
      return [];
    default:
      return [];
  }
}