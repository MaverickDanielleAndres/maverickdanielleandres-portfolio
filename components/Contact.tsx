"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, Mail, MapPin, Send, Clock } from "lucide-react";
import Magnet from "@/components/ui/Magnet";
import { toast } from "sonner";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5% 0px" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!validateEmail(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setStatus("sending");
    const loadingToast = toast.loading("Sending your message...");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", subject: "", message: "" });
        toast.dismiss(loadingToast);
        toast.success("Message sent! I'll get back to you soon.");
      } else {
        setStatus("error");
        toast.dismiss(loadingToast);
        toast.error(data.error || "Failed to send message. Please try again.");
      }
    } catch {
      setStatus("error");
      toast.dismiss(loadingToast);
      toast.error("A network error occurred. Please try again later.");
    }
    
    setTimeout(() => setStatus("idle"), 5000);
  };

  return (
    <section
      id="contact"
      ref={ref}
      style={{
        background: "var(--bg-contact)",
        color: "var(--fg)",
        overflow: "hidden",
        borderTop: "1px solid var(--border-subtle)",
      }}
    >
      {/* CTA headline */}
      <div
        style={{
          padding: "clamp(4rem,12vh,9rem) var(--container-px) clamp(3rem,6vh,5rem)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <motion.p
          className="text-xs uppercase tracking-[0.18em] mb-8"
          style={{ color: "var(--fg-muted)" }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          Contact Me
        </motion.p>

        <motion.h2
          style={{
            fontSize: "clamp(3rem,8vw,8rem)",
            fontWeight: 300,
            lineHeight: 1,
            letterSpacing: "-0.025em",
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {`Let's work`}
          <br />
          together
        </motion.h2>
      </div>

      {/* Two-column: info left, form right */}
      <div
        style={{
          padding: "clamp(3rem,8vh,5rem) var(--container-px)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "clamp(2.5rem,6vw,6rem)",
          alignItems: "start",
        }}
      >
        {/* Left  contact info */}
        <motion.div
          className="flex flex-col gap-6"
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div>
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "var(--fg-muted)" }}>
              Get in Touch
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--fg-muted)", maxWidth: "36ch" }}>
              Have a project in mind or want to collaborate? I&apos;d love to hear from you.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <a
              href="mailto:maverickdanielle@gmail.com"
              className="flex items-center gap-3 text-sm hover:opacity-60 transition-opacity"
              style={{ color: "var(--fg)", textDecoration: "none" }}
            >
              <span
                className="flex items-center justify-center"
                style={{
                  width: 38, height: 38, borderRadius: "0.5rem",
                  border: "1px solid var(--border-subtle)",
                  flexShrink: 0,
                }}
              >
                <Mail size={15} />
              </span>
              maverickdanielle@gmail.com
            </a>

            <div className="flex items-center gap-3 text-sm" style={{ color: "var(--fg)" }}>
              <span
                className="flex items-center justify-center"
                style={{
                  width: 38, height: 38, borderRadius: "0.5rem",
                  border: "1px solid var(--border-subtle)",
                  flexShrink: 0,
                }}
              >
                <MapPin size={15} />
              </span>
              Pasig City, Philippines
            </div>

            <div className="flex items-center gap-3 text-sm" style={{ color: "var(--fg)" }}>
              <span
                className="flex items-center justify-center"
                style={{
                  width: 38, height: 38, borderRadius: "0.5rem",
                  border: "1px solid var(--border-subtle)",
                  flexShrink: 0,
                }}
              >
                <Clock size={15} />
              </span>
              Usually responds within 24 hours
            </div>
          </div>

          {/* Social links */}
          <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "1.5rem" }}>
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "var(--fg-muted)" }}>
              Follow me
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { href: "https://github.com/MaverickDanielleAndres", label: "GitHub" },
                { href: "https://linkedin.com/in/maverick-danielle-andres-641564373", label: "LinkedIn" },
                { href: "https://www.facebook.com/maverickdanielle.andres", label: "Facebook" },
                { href: "https://www.instagram.com/mavs_verick/", label: "Instagram" },
              ].map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs transition-opacity hover:opacity-60"
                  style={{
                    color: "var(--fg)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: 9999,
                    padding: "0.35rem 0.85rem",
                    textDecoration: "none",
                  }}
                >
                  {label} <ArrowUpRight size={10} />
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right  form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InputField label="Name" name="name" value={form.name} onChange={handleChange} required />
              <InputField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
            </div>
            <InputField label="Subject" name="subject" value={form.subject} onChange={handleChange} required />
            <div>
              <label
                htmlFor="message"
                className="block text-xs uppercase tracking-widest mb-2"
                style={{ color: "var(--fg-muted)" }}
              >
                Message
              </label>
              <textarea
                suppressHydrationWarning
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full bg-transparent border-b text-sm resize-none outline-none transition-colors"
                style={{
                  borderColor: "var(--border-subtle)",
                  color: "var(--fg)",
                  paddingBlock: "0.75rem",
                }}
                placeholder="Tell me about your project..."
              />
            </div>
            <div className="pt-2">
              <Magnet padding={50} magnetStrength={50}>
                <button
                  suppressHydrationWarning
                  type="submit"
                  disabled={status === "sending"}
                  className="flex items-center gap-3 text-sm font-light group disabled:opacity-50"
                  style={{ color: "var(--fg)" }}
                >
                  <span
                    className="h-10 w-10 flex items-center justify-center rounded-full transition-colors"
                    style={{
                      border: "1px solid var(--border-subtle)",
                      color: "var(--fg)",
                    }}
                  >
                    <Send size={14} />
                  </span>
                  {status === "sending"
                    ? "Sending..."
                    : status === "sent"
                      ? "Message sent!"
                      : status === "error"
                        ? "Failed  try again"
                        : "Send message"}
                </button>
              </Magnet>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Minimal Footer */}
      <div style={{ padding: "0 var(--container-px)" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-center py-6 text-xs text-neutral-500 mt-12"
          style={{ borderTop: "1px solid var(--border-subtle)" }}
        >
          <div className="mb-4 md:mb-0">
            &copy; 2026 Maverick Danielle Andres. All rights reserved.
          </div>
          <div className="flex flex-wrap gap-6 justify-center">
            {[
              { href: "https://github.com/MaverickDanielleAndres", label: "GitHub" },
              { href: "https://linkedin.com/in/maverick-danielle-andres-641564373", label: "LinkedIn" },
              { href: "https://www.facebook.com/maverickdanielle.andres", label: "Facebook" },
              { href: "https://www.instagram.com/mavs_verick/", label: "Instagram" },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-neutral-300 transition-colors flex items-center gap-1"
              >
                {label} <ArrowUpRight size={10} />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-xs uppercase tracking-widest mb-2"
        style={{ color: "var(--fg-muted)" }}
      >
        {label}
      </label>
      <input
        suppressHydrationWarning
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-transparent border-b text-sm outline-none transition-colors"
        style={{
          borderColor: "var(--border-subtle)",
          color: "var(--fg)",
          paddingBlock: "0.75rem",
        }}
      />
    </div>
  );
}
