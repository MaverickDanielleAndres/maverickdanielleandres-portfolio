"use client";
import LogoLoop from "@/components/ui/LogoLoop";
import {
  SiReact, SiNextdotjs, SiTypescript, SiTailwindcss,
  SiNodedotjs, SiPostgresql, SiFigma,
  SiGit, SiJavascript, SiHtml5, SiCss3,
  SiPhp, SiPython, SiExpress, SiMysql, SiBootstrap,
  SiSupabase, SiGithub,
} from "react-icons/si";

const techLogos = [
  { name: "React",       icon: <SiReact       size={28} color="#61DAFB" /> },
  { name: "Next.js",     icon: <SiNextdotjs   size={28} style={{ color: 'currentColor' }} /> },
  { name: "TypeScript",  icon: <SiTypescript  size={28} color="#3178C6" /> },
  { name: "JavaScript",  icon: <SiJavascript  size={28} color="#F7DF1E" /> },
  { name: "Tailwind",    icon: <SiTailwindcss size={28} color="#06B6D4" /> },
  { name: "Node.js",     icon: <SiNodedotjs   size={28} color="#339933" /> },
  { name: "HTML5",       icon: <SiHtml5       size={28} color="#E34F26" /> },
  { name: "CSS3",        icon: <SiCss3        size={28} color="#1572B6" /> },
  { name: "PHP",         icon: <SiPhp         size={28} color="#777BB4" /> },
  { name: "Python",      icon: <SiPython      size={28} color="#3776AB" /> },
  { name: "MySQL",       icon: <SiMysql       size={28} color="#4479A1" /> },
  { name: "PostgreSQL",  icon: <SiPostgresql  size={28} color="#4169E1" /> },
  { name: "Supabase",    icon: <SiSupabase    size={28} color="#3ECF8E" /> },
  { name: "Express",     icon: <SiExpress     size={28} style={{ color: 'currentColor' }} /> },
  { name: "Bootstrap",   icon: <SiBootstrap   size={28} color="#7952B3" /> },
  { name: "Figma",       icon: <SiFigma       size={28} color="#F24E1E" /> },
  { name: "Git",         icon: <SiGit         size={28} color="#F05032" /> },
  { name: "GitHub",      icon: <SiGithub      size={28} style={{ color: 'currentColor' }} /> },
];

export default function TechStrip() {
  return (
    <div className="relative overflow-hidden py-6">
      {/* Edge fade masks */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10"
        style={{ background: "linear-gradient(to right, var(--bg), transparent)" }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10"
        style={{ background: "linear-gradient(to left, var(--bg), transparent)" }}
      />

      <LogoLoop
        items={techLogos}
        speed={1}
        direction="left"
        className="text-neutral-400"
      />
    </div>
  );
}
