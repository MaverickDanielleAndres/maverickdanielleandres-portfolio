"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";
import SpotlightCard from "@/components/ui/SpotlightCard";
import Portal from "@/components/Portal";

type Cert = {
  id: number;
  title: string;
  issuer: string;
  date: string;
  image: string;
  skills: string[];
  description: string;
};

const CERTS: Cert[] = [
  {
    id: 1,
    title: "The Complete Full-Stack Web Development Bootcamp",
    issuer: "Udemy",
    date: "2024",
    image: "/Cetificates/The Complete Full-Stack Web Development Bootcamp.jpg",
    skills: ["HTML", "CSS", "JavaScript", "Node.js", "React", "MongoDB"],
    description:
      "Comprehensive full-stack web development covering front-end and back-end technologies, databases, APIs, and deployment.",
  },
  {
    id: 2,
    title: "Web Development Bootcamp with HTML CSS PHP MySQL Wordpress",
    issuer: "Udemy",
    date: "2023",
    image: "/Cetificates/Web Development Bootcamp with HTML CSS PHP MySQL Wordpress.jpg",
    skills: ["HTML", "CSS", "PHP", "MySQL", "WordPress"],
    description:
      "Hands-on web development bootcamp covering HTML5, CSS3, PHP back-end, MySQL databases, and WordPress CMS.",
  },
  {
    id: 3,
    title: "Figma Essential for UI/UX Design",
    issuer: "Udemy",
    date: "2023",
    image: "/Cetificates/Figma Essential for User Interface and User Experience UI UX.jpg",
    skills: ["Figma", "UI Design", "UX Design", "Prototyping"],
    description:
      "Essential Figma skills for creating wireframes, interactive prototypes, and high-fidelity UI/UX designs.",
  },
  {
    id: 4,
    title: "React Development",
    issuer: "Udemy",
    date: "2023",
    image: "/Cetificates/React.jpg",
    skills: ["React", "JSX", "Hooks", "State Management"],
    description:
      "In-depth React.js development covering components, hooks, state management, and building production-ready applications.",
  },
  {
    id: 5,
    title: "Git & Version Control",
    issuer: "Udemy",
    date: "2023",
    image: "/Cetificates/Git.jpg",
    skills: ["Git", "GitHub", "Version Control", "Collaboration"],
    description:
      "Mastery of Git version control system including branching strategies, merging, rebasing, and collaborative workflows.",
  },
  {
    id: 6,
    title: "Networking Fundamentals",
    issuer: "Cisco / NDG",
    date: "2024",
    image: "/Cetificates/Networking.jpg",
    skills: ["Networking", "TCP/IP", "Routing", "Security"],
    description:
      "Core networking principles including TCP/IP protocols, routing, switching, subnetting, and network security fundamentals.",
  },
  {
    id: 7,
    title: "Security Essentials",
    issuer: "Cisco Networking Academy",
    date: "2024",
    image: "/Cetificates/Security.png",
    skills: ["Cybersecurity", "Threat Detection", "Firewalls", "Encryption"],
    description:
      "Comprehensive cybersecurity course covering threat landscapes, security policies, encryption, and defensive strategies.",
  },
  {
    id: 8,
    title: "Microsoft Office Specialist",
    issuer: "Microsoft",
    date: "2023",
    image: "/Cetificates/Ms Office.jpg",
    skills: ["Microsoft Office", "Excel", "Word", "PowerPoint"],
    description:
      "Proficiency in Microsoft Office Suite including advanced Excel, Word document formatting, and PowerPoint presentations.",
  },
  {
    id: 9,
    title: "AirBuilder Certification",
    issuer: "AirBuilder",
    date: "2024",
    image: "/Cetificates/New Certificates/AirBuilderCert.png",
    skills: ["AirBuilder", "No-code", "Development"],
    description: "Certification for proficiency in AirBuilder no-code platform.",
  },
  {
    id: 10,
    title: "AWS Cloud Practitioner Essentials",
    issuer: "Amazon Web Services",
    date: "2024",
    image: "/Cetificates/New Certificates/AWS Cloud Practitioner Essentials.png",
    skills: ["AWS", "Cloud", "Infrastructure"],
    description: "Understanding of core AWS services, security, architecture, pricing, and support.",
  },
  {
    id: 11,
    title: "Excel Skills for Business Essentials",
    issuer: "Coursera",
    date: "2023",
    image: "/Cetificates/New Certificates/Excel Skills for Business Essentials.png",
    skills: ["Excel", "Data Analysis", "Spreadsheets"],
    description: "Essential Excel skills for business including formulas, functions, and data visualization.",
  },
  {
    id: 12,
    title: "HubSpot Academy Certificate",
    issuer: "HubSpot",
    date: "2023",
    image: "/Cetificates/New Certificates/HubSpot Academy Certificate.png",
    skills: ["Inbound Marketing", "CRM", "Sales"],
    description: "Certification covering inbound marketing strategies, CRM usage, and sales alignment.",
  },
  {
    id: 13,
    title: "IT Security: Defense against the digital dark arts",
    issuer: "Google",
    date: "2024",
    image: "/Cetificates/New Certificates/IT Security Defense against the digital dark arts.png",
    skills: ["IT Security", "Cybersecurity", "Encryption"],
    description: "Google IT Support Professional Certificate course on IT security concepts and practices.",
  },
  {
    id: 14,
    title: "Lean Six Sigma Certificate",
    issuer: "Lean Six Sigma",
    date: "2023",
    image: "/Cetificates/New Certificates/Lean Six Sigma Certificate.png",
    skills: ["Process Improvement", "Quality Management"],
    description: "Certification in Lean Six Sigma methodologies for process optimization and quality control.",
  },
  {
    id: 15,
    title: "Operating Systems and You: Becoming a Power User",
    issuer: "Google",
    date: "2024",
    image: "/Cetificates/New Certificates/Operating System and You Becoming a Power User.png",
    skills: ["OS", "Linux", "Windows"],
    description: "Navigating OS, managing software, users, and hardware, and understanding system administration.",
  },
  {
    id: 16,
    title: "System Administration and IT Infrastructure Services",
    issuer: "Google",
    date: "2024",
    image: "/Cetificates/New Certificates/System Administration and IT Infrastructure Services.png",
    skills: ["System Administration", "IT Infrastructure", "Directory Services"],
    description: "Managing IT infrastructure, directory services, and system administration best practices.",
  },
  {
    id: 17,
    title: "Technical Support Fundamentals",
    issuer: "Google",
    date: "2024",
    image: "/Cetificates/New Certificates/Technical Support Fundamentals.png",
    skills: ["Technical Support", "Troubleshooting", "Customer Service"],
    description: "Foundational concepts of IT support including troubleshooting, networking, and operating systems.",
  },
  {
    id: 18,
    title: "The Bits and Bytes of Computer Networking",
    issuer: "Google",
    date: "2024",
    image: "/Cetificates/New Certificates/The Bits and Bytes of Computer Networking.png",
    skills: ["Networking", "TCP/IP", "DNS", "DHCP"],
    description: "In-depth understanding of computer networking protocols, TCP/IP, and network troubleshooting.",
  },
];

export default function Certificates() {
  const [selected, setSelected] = useState<Cert | null>(null);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5% 0px" });

  return (
    <section
      id="certificates"
      ref={ref}
      style={{
        background: "var(--bg-certificates)",
        color: "var(--fg)",
        padding: "clamp(4rem,10vh,7rem) var(--container-px)",
        borderTop: "1px solid var(--border-subtle)",
      }}
    >
      {/* Header */}
      <motion.p
        className="text-xs uppercase tracking-[0.18em] mb-4"
        style={{ color: "var(--fg-muted)" }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
      >
        Certifications
      </motion.p>
      <motion.h2
        style={{
          fontSize: "clamp(2rem,4vw,4rem)",
          fontWeight: 400,
          lineHeight: 1.1,
          letterSpacing: "-0.015em",
          marginBottom: "clamp(2.5rem,6vh,4rem)",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        Credentials &amp; Learning
      </motion.h2>

      {/* Grid */}
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%,280px), 1fr))",
        }}
      >
        {CERTS.map((cert, i) => (
          <SpotlightCard
            key={cert.id}
            spotlightColor="rgba(96,85,240,0.18)"
            className="p-0! rounded-xl!"
          >
            <motion.div
              className="group cursor-pointer rounded-xl overflow-hidden"
              style={{ border: "1px solid var(--border-subtle)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              onClick={() => setSelected(cert)}
            >
            {/* Thumbnail */}
            <div
              className="relative overflow-hidden"
              style={{ aspectRatio: "4/3" }}
            >
              <Image
                src={cert.image}
                alt={cert.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23e5e5e5'/%3E%3Ctext x='50%25' y='50%25' font-size='14' text-anchor='middle' dominant-baseline='middle' fill='%23888'%3ECertificate%3C/text%3E%3C/svg%3E";
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "rgba(0,0,0,0.3)" }}>
                <ZoomIn size={24} color="#fff" />
              </div>
            </div>
            {/* Info */}
            <div className="p-4">
              <p
                className="text-xs uppercase tracking-widest mb-1.5"
                style={{ color: "var(--accent)" }}
              >
                {cert.issuer}
              </p>
              <h3 className="text-sm font-medium leading-snug">{cert.title}</h3>
              <p
                className="text-xs mt-1"
                style={{ color: "var(--fg-muted)" }}
              >
                {cert.date}
              </p>
            </div>
            </motion.div>
          </SpotlightCard>
        ))}
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <Portal>
            <motion.div
              className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
              style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            >
              <motion.div
                className="relative w-full max-w-lg rounded-2xl overflow-y-auto max-h-[90vh]"
                style={{ background: "var(--bg)", color: "var(--fg)" }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
                data-lenis-prevent="true"
              >
                <div className="relative" style={{ aspectRatio: "4/3" }}>
                  <Image
                    src={selected.image}
                    alt={selected.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <p
                    className="text-xs uppercase tracking-widest mb-1"
                    style={{ color: "var(--accent)" }}
                  >
                    {selected.issuer} &middot; {selected.date}
                  </p>
                  <h3 className="text-lg font-medium mb-3">{selected.title}</h3>
                  <p
                    className="text-sm leading-relaxed mb-4"
                    style={{ color: "var(--fg-muted)" }}
                  >
                    {selected.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selected.skills.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1 rounded-full text-xs"
                        style={{ border: "1px solid var(--border-subtle)" }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ background: "rgba(0,0,0,0.5)", color: "#fff" }}
                >
                  <X size={15} />
                </button>
              </motion.div>
            </motion.div>
          </Portal>
        )}
      </AnimatePresence>
    </section>
  );
}
