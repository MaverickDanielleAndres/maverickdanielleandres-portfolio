"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ZoomIn, Maximize2 } from "lucide-react";
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
  recipient?: string;
  instructor?: string;
  authorizedBy?: string;
  length?: string;
  certNo?: string;
  url?: string;
  referenceNo?: string;
  signedBy?: string;
  validFrom?: string;
  validUntil?: string;
  verifyUrl?: string;
};

const CERTS: Cert[] = [
  {
    id: 1,
    title: "The Complete Full-Stack Web Development Bootcamp",
    issuer: "Udemy",
    date: "Aug. 8, 2025",
    image: "/Cetificates/The Complete Full-Stack Web Development Bootcamp.jpg",
    skills: ["HTML", "CSS", "JavaScript", "Node.js", "React", "MongoDB"],
    description: "Comprehensive full-stack web development covering front-end and back-end technologies, databases, APIs, and deployment.",
    recipient: "Maverick Danielle P. Andres",
    instructor: "Dr. Angela Yu, Developer and Lead Instructor",
    length: "61.5 total hours",
    certNo: "UC-1bcdab1e-303e-4d35-8aa8-ceeeb589f83f",
    url: "ude.my/UC-1bcdab1e-303e-4d35-8aa8-ceeeb589f83f",
    referenceNo: "0004",
  },
  {
    id: 2,
    title: "Web Development Bootcamp with HTML CSS PHP MySQL Wordpress",
    issuer: "Udemy",
    date: "Aug. 8, 2025",
    image: "/Cetificates/Web Development Bootcamp with HTML CSS PHP MySQL Wordpress.jpg",
    skills: ["HTML", "CSS", "PHP", "MySQL", "WordPress"],
    description: "Hands-on web development bootcamp covering HTML5, CSS3, PHP back-end, MySQL databases, and WordPress CMS.",
    recipient: "Maverick Danielle P. Andres",
    instructor: "Marcus Menti, Zechariah Tech",
    length: "13.5 total hours",
    certNo: "UC-b82f9c7d-dab5-434e-afab-11e1f9b6b446",
    url: "ude.my/UC-b82f9c7d-dab5-434e-afab-11e1f9b6b446",
    referenceNo: "0004",
  },
  {
    id: 3,
    title: "Figma Essential for User Interface and User Experience UI UX",
    issuer: "Udemy",
    date: "Aug. 13, 2025",
    image: "/Cetificates/Figma Essential for User Interface and User Experience UI UX.jpg",
    skills: ["Figma", "UI Design", "UX Design", "Prototyping"],
    description: "Essential Figma skills for creating wireframes, interactive prototypes, and high-fidelity UI/UX designs.",
    recipient: "Maverick Danielle P. Andres",
    instructor: "Learnify IT",
    length: "4 total hours",
    certNo: "UC-fd7d2c70-9f82-45db-8853-82b844684650",
    url: "ude.my/UC-fd7d2c70-9f82-45db-8853-82b844684650",
    referenceNo: "0004",
  },
  {
    id: 4,
    title: "Hands On React JS From Beginner to Expert",
    issuer: "Udemy",
    date: "Aug. 8, 2025",
    image: "/Cetificates/React.jpg",
    skills: ["React", "JSX", "Hooks", "State Management"],
    description: "In-depth React.js development covering components, hooks, state management, and building production-ready applications.",
    recipient: "Maverick Danielle P. Andres",
    instructor: "Learnify IT",
    length: "4.5 total hours",
    certNo: "UC-b829430c-7bbd-407b-827a-e6bdc094f4ea",
    url: "ude.my/UC-b829430c-7bbd-407b-827a-e6bdc094f4ea",
    referenceNo: "0004",
  },
  {
    id: 5,
    title: "GIT, GitLab, GitHub Fundamentals for Software Developers",
    issuer: "Udemy",
    date: "Aug. 8, 2025",
    image: "/Cetificates/Git.jpg",
    skills: ["Git", "GitHub", "Version Control", "Collaboration"],
    description: "Mastery of Git version control system including branching strategies, merging, rebasing, and collaborative workflows.",
    recipient: "Maverick Danielle P. Andres",
    instructor: "MTF Institute of Management, Technology and Finance",
    length: "1 total hour",
    certNo: "UC-1f9f2b27-c24a-41de-8874-e2569c3e8651",
    url: "ude.my/UC-1f9f2b27-c24a-41de-8874-e2569c3e8651",
    referenceNo: "0004",
  },
  {
    id: 6,
    title: "The Complete Networking Fundamentals Course. Your CCNA start",
    issuer: "Udemy",
    date: "Dec. 7, 2025",
    image: "/Cetificates/Networking.jpg",
    skills: ["Networking", "CCNA", "TCP/IP", "Routing"],
    description: "Core networking principles including TCP/IP protocols, routing, switching, subnetting, and network security fundamentals.",
    recipient: "Maverick Danielle Andres",
    instructor: "David Bombal",
    length: "73 total hours",
    certNo: "UC-50ea970c-282f-456a-8d69-02bae0840888",
    url: "ude.my/UC-50ea970c-282f-456a-8d69-02bae0840888",
    referenceNo: "0004",
  },
  {
    id: 7,
    title: "Information Security Crash Course: Quick Steps to Safety",
    issuer: "Udemy",
    date: "Oct. 30, 2025",
    image: "/Cetificates/Security.png",
    skills: ["Cybersecurity", "InfoSec", "Encryption"],
    description: "Comprehensive cybersecurity course covering threat landscapes, security policies, encryption, and defensive strategies.",
    recipient: "Maverick Danielle P. Andres",
    instructor: "Andrii Piatakha",
    length: "7 total hours",
    certNo: "UC-18fb0c48-44c8-44b1-86aa-e926d02107f9",
    url: "ude.my/UC-18fb0c48-44c8-44b1-86aa-e926d02107f9",
    referenceNo: "0004",
  },
  {
    id: 8,
    title: "Complete MS Office and Web Design Development Course",
    issuer: "Udemy",
    date: "Aug. 8, 2025",
    image: "/Cetificates/Ms Office.jpg",
    skills: ["MS Office", "Excel", "Web Design"],
    description: "Proficiency in Microsoft Office Suite including advanced Excel, Word document formatting, and PowerPoint presentations.",
    recipient: "Maverick Danielle P. Andres",
    instructor: "Nerding I/O, Zechariah Tech",
    length: "10.5 total hours",
    certNo: "UC-a2f449e9-249a-4fde-8e56-43b287742ed9",
    url: "ude.my/UC-a2f449e9-249a-4fde-8e56-43b287742ed9",
    referenceNo: "0004",
  },
  {
    id: 9,
    title: "Airtable Builder Certification",
    issuer: "Airtable",
    date: "April 15, 2026",
    image: "/Cetificates/New Certificates/AirBuilderCert.png",
    skills: ["Airtable", "No-code", "Databases"],
    description: "Certification for proficiency in Airtable no-code platform and database design.",
    recipient: "Maverick Danielle Andres",
    validFrom: "April 15, 2026",
    validUntil: "May 15, 2028",
    certNo: "xox5nm5wgmfj",
  },
  {
    id: 10,
    title: "AWS Cloud Practitioner Essentials",
    issuer: "Amazon Web Services",
    date: "Apr. 18, 2026",
    image: "/Cetificates/New Certificates/AWS Cloud Practitioner Essentials.png",
    skills: ["AWS", "Cloud", "Infrastructure"],
    description: "Understanding of core AWS services, security, architecture, pricing, and support.",
    recipient: "Maverick Danielle Andres",
    authorizedBy: "Amazon Web Services",
    instructor: "Rudy Chetty, Morgan Willis, Alan Meridian",
    verifyUrl: "https://coursera.org/verify/793JHP3SLVOK",
  },
  {
    id: 11,
    title: "Excel Skills for Business: Essentials",
    issuer: "Coursera / Macquarie",
    date: "Apr. 18, 2026",
    image: "/Cetificates/New Certificates/Excel Skills for Business Essentials.png",
    skills: ["Excel", "Data Analysis", "Business"],
    description: "Essential Excel skills for business including formulas, functions, and data visualization.",
    recipient: "Maverick Danielle Andres",
    authorizedBy: "Macquarie University",
    instructor: "Nicky Bull, Dr. Prashan S. M. Karunaratne, A/Professor Yvonne Breyer",
    verifyUrl: "https://coursera.org/verify/N0XHVEYG9KFT",
  },
  {
    id: 12,
    title: "SEO Certified",
    issuer: "HubSpot Academy",
    date: "Apr. 14, 2026",
    image: "/Cetificates/New Certificates/HubSpot Academy Certificate.png",
    skills: ["SEO", "Inbound", "Marketing"],
    description: "Certification covering search engine optimization, content strategy, and website performance.",
    recipient: "Maverick Danielle Andres",
    signedBy: "CEO Yamini Rangan",
    validFrom: "Apr. 14, 2026",
    validUntil: "May 14, 2027",
    certNo: "99e694b0db7d4d25ab0a6a20013b602d",
  },
  {
    id: 13,
    title: "IT Security: Defense against the digital dark arts",
    issuer: "Google",
    date: "Apr. 19, 2026",
    image: "/Cetificates/New Certificates/IT Security Defense against the digital dark arts.png",
    skills: ["IT Security", "Cybersecurity", "Google"],
    description: "Google IT Support Professional Certificate course on IT security concepts and practices.",
    recipient: "Maverick Danielle Andres",
    authorizedBy: "Google",
    verifyUrl: "https://coursera.org/verify/U7VID4K2S38L",
  },
  {
    id: 14,
    title: "Lean Six Sigma White Belt",
    issuer: "Lean Six Sigma Company",
    date: "April 14, 2026",
    image: "/Cetificates/New Certificates/Lean Six Sigma Certificate.png",
    skills: ["Process Improvement", "Six Sigma"],
    description: "Certification in Lean Six Sigma methodologies for process optimization and quality control.",
    recipient: "Maverick Danielle Andres",
    signedBy: "Mischa van Aalten & Tom Lindsen",
    instructor: "The Productivity Company (TPC)",
  },
  {
    id: 15,
    title: "Operating Systems and You: Becoming a Power User",
    issuer: "Google",
    date: "Apr. 19, 2026",
    image: "/Cetificates/New Certificates/Operating System and You Becoming a Power User.png",
    skills: ["OS", "Linux", "Windows"],
    description: "Navigating OS, managing software, users, and hardware, and understanding system administration.",
    recipient: "Maverick Danielle Andres",
    authorizedBy: "Google",
    verifyUrl: "https://coursera.org/verify/7BCISGRTF4CQ",
  },
  {
    id: 16,
    title: "System Administration and IT Infrastructure Services",
    issuer: "Google",
    date: "Apr. 19, 2026",
    image: "/Cetificates/New Certificates/System Administration and IT Infrastructure Services.png",
    skills: ["SysAdmin", "Infrastructure", "Cloud"],
    description: "Managing IT infrastructure, directory services, and system administration best practices.",
    recipient: "Maverick Danielle Andres",
    authorizedBy: "Google",
    verifyUrl: "https://coursera.org/verify/QFGVDBI23V66",
  },
  {
    id: 17,
    title: "Technical Support Fundamentals",
    issuer: "Google",
    date: "Apr. 19, 2026",
    image: "/Cetificates/New Certificates/Technical Support Fundamentals.png",
    skills: ["IT Support", "Troubleshooting"],
    description: "Foundational concepts of IT support including troubleshooting, networking, and operating systems.",
    recipient: "Maverick Danielle Andres",
    authorizedBy: "Google",
    signedBy: "Amanda Brophy, Global Director",
    verifyUrl: "https://coursera.org/verify/3BZVWQ50DAP8",
  },
  {
    id: 18,
    title: "The Bits and Bytes of Computer Networking",
    issuer: "Google",
    date: "Apr. 19, 2026",
    image: "/Cetificates/New Certificates/The Bits and Bytes of Computer Networking.png",
    skills: ["Networking", "TCP/IP", "DNS"],
    description: "In-depth understanding of computer networking protocols, TCP/IP, and network troubleshooting.",
    recipient: "Maverick Danielle Andres",
    authorizedBy: "Google",
    signedBy: "Amanda Brophy, Global Director",
    verifyUrl: "https://coursera.org/verify/NBW396135V51",
  },
];

export default function Certificates() {
  const [selected, setSelected] = useState<Cert | null>(null);
  const [isEnlarged, setIsEnlarged] = useState(false);
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

      <div
        className="flex flex-wrap justify-center gap-4"
      >
        {CERTS.map((cert, i) => (
          <SpotlightCard
            key={cert.id}
            spotlightColor="rgba(96,85,240,0.18)"
            className="p-0! rounded-xl! w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1rem)]"
          >
            <motion.div
              className="group cursor-pointer rounded-xl overflow-hidden h-full flex flex-col"
              style={{ border: "1px solid var(--border-subtle)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              onClick={() => setSelected(cert)}
            >
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
              <div className="p-4 flex-1 flex flex-col">
                <p
                  className="text-xs uppercase tracking-widest mb-1.5"
                  style={{ color: "var(--accent)" }}
                >
                  {cert.issuer}
                </p>
                <h3 className="text-sm font-medium leading-snug line-clamp-2">{cert.title}</h3>
                <p
                  className="text-xs mt-auto pt-2"
                  style={{ color: "var(--fg-muted)" }}
                >
                  {cert.date}
                </p>
              </div>
            </motion.div>
          </SpotlightCard>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <Portal>
            <motion.div
              className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
              style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSelected(null);
                setIsEnlarged(false);
              }}
            >
              <motion.div
                className="relative w-full max-w-xl rounded-2xl overflow-y-auto max-h-[90vh] shadow-2xl"
                style={{ background: "var(--bg)", color: "var(--fg)" }}
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
                data-lenis-prevent="true"
              >
                {/* Modal Image Header with Hover Enlarge */}
                <div 
                  className="relative group/img cursor-zoom-in" 
                  style={{ aspectRatio: "16/10", borderBottom: "1px solid var(--border-subtle)" }}
                  onClick={() => setIsEnlarged(true)}
                >
                  <Image
                    src={selected.image}
                    alt={selected.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/30 transform scale-90 group-hover/img:scale-100 transition-transform duration-300">
                      <Maximize2 size={24} color="#fff" />
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div>
                      <p
                        className="text-xs uppercase tracking-[0.2em] mb-1 font-semibold"
                        style={{ color: "var(--accent)" }}
                      >
                        {selected.issuer}
                      </p>
                      <h3 className="text-2xl font-medium leading-tight">{selected.title}</h3>
                    </div>
                  </div>

                  <p
                    className="text-sm leading-relaxed mb-8"
                    style={{ color: "var(--fg-muted)" }}
                  >
                    {selected.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 mb-8">
                    {selected.recipient && <DetailItem label="Recipient" value={selected.recipient} />}
                    {selected.instructor && <DetailItem label="Instructor" value={selected.instructor} />}
                    {selected.authorizedBy && <DetailItem label="Authorized By" value={selected.authorizedBy} />}
                    {selected.signedBy && <DetailItem label="Signed By" value={selected.signedBy} />}
                    {selected.date && <DetailItem label="Date" value={selected.date} />}
                    {selected.length && <DetailItem label="Length" value={selected.length} />}
                    {selected.certNo && <DetailItem label="Certificate No." value={selected.certNo} />}
                    {selected.validFrom && <DetailItem label="Valid From" value={selected.validFrom} />}
                    {selected.validUntil && <DetailItem label="Valid Until" value={selected.validUntil} />}
                    {selected.referenceNo && <DetailItem label="Reference No." value={selected.referenceNo} />}
                  </div>

                  <div className="mb-8">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Key Competencies</p>
                    <div className="flex flex-wrap gap-2">
                      {selected.skills.map((s) => (
                        <span
                          key={s}
                          className="px-3 py-1 rounded-full text-[11px] font-medium transition-colors hover:bg-accent/10"
                          style={{ border: "1.5px solid var(--border-subtle)" }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {(selected.url || selected.verifyUrl) && (
                    <div className="pt-6 border-t border-dashed border-border/50">
                      <a
                        href={selected.verifyUrl || `https://${selected.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
                        style={{ color: "var(--accent)" }}
                      >
                        Verify Credential <ZoomIn size={14} />
                      </a>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95"
                  style={{ background: "rgba(0,0,0,0.6)", color: "#fff", backdropFilter: "blur(4px)" }}
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </motion.div>
            </motion.div>
          </Portal>
        )}
      </AnimatePresence>

      {/* Enlarged Image Lightbox */}
      <AnimatePresence>
        {isEnlarged && selected && (
          <Portal>
            <motion.div
              className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/95 p-4 md:p-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEnlarged(false)}
            >
              <motion.button
                className="absolute top-6 right-6 z-[100001] h-12 w-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                onClick={() => setIsEnlarged(false)}
              >
                <X size={24} color="#fff" />
              </motion.button>
              
              <motion.div
                className="relative w-full h-full flex items-center justify-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                <div className="relative w-full h-full max-w-6xl max-h-screen">
                  <Image
                    src={selected.image}
                    alt={selected.title}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </motion.div>
            </motion.div>
          </Portal>
        )}
      </AnimatePresence>
    </section>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground opacity-60">
        {label}
      </span>
      <span className="text-sm font-medium leading-tight">
        {value}
      </span>
    </div>
  );
}
