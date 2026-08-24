"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, MessageCircle, RefreshCw, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SUGGESTED_QUESTIONS,
  makeId,
  type ChatMessage,
  type SuggestedQuestion,
} from "./chat-utils";

/* ── API contract ─────────────────────────────────────────────────── */

type ApiResponse = {
  reply?: string;
  unavailable?: boolean;
  error?: string;
};

/* ── Component ────────────────────────────────────────────────────── */

type Status = "idle" | "loading" | "error" | "unavailable";

export default function PortfolioChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [hasUnread, setHasUnread] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputAreaRef = useRef<HTMLDivElement>(null);

  // ── Auto-scroll: only auto-scroll when the visitor is near the bottom
  //    so manually scrolling up to read history isn't interrupted.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distanceFromBottom < 120) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [messages, status]);

  // ── Auto-resize the textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 140)}px`;
  }, [input]);

  // ── Initial welcome message once when the chat opens for the first time
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: makeId("assistant"),
          role: "assistant",
          content:
            "Hey! I'm Mavs' portfolio assistant. Ask about his projects, skills, experience, or what he can build.",
        },
      ]);
      setHasUnread(false);
    }
  }, [isOpen, messages.length]);

  // ── Mark unread when a new assistant message arrives while closed
  useEffect(() => {
    if (!isOpen && messages.some((m) => m.role === "assistant" && m.id !== "welcome")) {
      setHasUnread(true);
    }
  }, [isOpen, messages]);

  // ── Send a message (works for both typed input and suggested chips)
  const sendMessage = useCallback(
    async (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed || status === "loading") return;

      const userMessage: ChatMessage = {
        id: makeId("user"),
        role: "user",
        content: trimmed,
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setStatus("loading");

      // Build history payload (exclude the message we just added — Gemini gets it as the latest user turn)
      const historyPayload = [...messages, userMessage]
        .slice(-12) // keep last 12 for context window sanity
        .slice(0, -1) // exclude the latest (server gets it via `message`)
        .map((m) => ({ role: m.role, content: m.content }));

      try {
        const res = await fetch("/api/portfolio-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: trimmed,
            history: historyPayload,
          }),
        });

        const data: ApiResponse = await res.json().catch(() => ({}));

        if (!res.ok) {
          setStatus("error");
          setMessages((prev) => [
            ...prev,
            {
              id: makeId("assistant"),
              role: "assistant",
              content:
                "I couldn't answer that right now. Please try again in a moment.",
            },
          ]);
          return;
        }

        if (data.unavailable) {
          setStatus("unavailable");
        } else {
          setStatus("idle");
        }

        const reply =
          typeof data.reply === "string" && data.reply.trim().length > 0
            ? data.reply.trim()
            : "I couldn't answer that right now. Please try again in a moment.";

        setMessages((prev) => [
          ...prev,
          {
            id: makeId("assistant"),
            role: "assistant",
            content: reply,
          },
        ]);
      } catch {
        setStatus("error");
        setMessages((prev) => [
          ...prev,
          {
            id: makeId("assistant"),
            role: "assistant",
            content:
              "I couldn't answer that right now. Please try again in a moment.",
          },
        ]);
      }
    },
    [messages, status],
  );

  const handleSubmit = useCallback(() => {
    void sendMessage(input);
  }, [input, sendMessage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  const handleReset = useCallback(() => {
    setMessages([]);
    setInput("");
    setStatus("idle");
    // Re-seed welcome message on next render
  }, []);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setHasUnread(false);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const canSend = input.trim().length > 0 && status !== "loading";

  const showSuggestions = useMemo(
    () => messages.length <= 1 && status === "idle",
    [messages.length, status],
  );

  return (
    <>
      {/* ── Floating Trigger ──────────────────────────────────────── */}
      <motion.button
        type="button"
        onClick={handleOpen}
        aria-label="Open Mavs AI — portfolio assistant"
        aria-expanded={isOpen}
        className={cn(
          "fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[60]",
          "group flex items-center gap-2.5",
          "h-12 pl-4 pr-5 rounded-full",
          "border border-[var(--border-subtle)]",
          "shadow-[0_10px_40px_rgba(0,0,0,0.35)]",
          "transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]",
          "bg-[var(--bg)] text-[var(--fg)]",
        )}
        style={{ display: isOpen ? "none" : "inline-flex" }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <span
          aria-hidden="true"
          className="flex h-8 w-8 items-center justify-center rounded-full"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          <MessageCircle size={16} strokeWidth={2} />
        </span>
        <span className="text-sm font-medium tracking-wide">Ask Mavs AI</span>
        {hasUnread && (
          <span
            aria-hidden="true"
            className="ml-0.5 h-2 w-2 rounded-full"
            style={{ background: "var(--accent)" }}
          />
        )}
      </motion.button>

      {/* ── Chat Window ───────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-label="Mavs AI — portfolio assistant"
            aria-modal="false"
            className={cn(
              "fixed z-[70]",
              // Positioning: full-screen sheet on mobile, floating panel on desktop
              "inset-0 sm:inset-auto sm:bottom-6 sm:right-6",
              "sm:w-[400px] sm:max-w-[calc(100vw-2rem)]",
              "sm:h-[600px] sm:max-h-[calc(100vh-3rem)]",
              "flex flex-col overflow-hidden",
              "border border-[var(--border-subtle)] sm:rounded-2xl",
              "shadow-[0_24px_64px_rgba(0,0,0,0.5)]",
              "bg-[var(--bg)] text-[var(--fg)]",
            )}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* ── Header ──────────────────────────────────────────── */}
            <header
              className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5"
              style={{ borderBottom: "1px solid var(--border-subtle)" }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 items-center justify-center rounded-full shrink-0"
                  style={{ background: "var(--accent)", color: "#fff" }}
                >
                  <Sparkles size={16} strokeWidth={2} />
                </span>
                <div className="min-w-0">
                  <p
                    className="text-sm font-semibold tracking-tight truncate"
                    style={{ color: "var(--fg)" }}
                  >
                    Mavs AI
                  </p>
                  <p
                    className="text-[10px] font-medium uppercase tracking-[0.18em] truncate"
                    style={{ color: "var(--fg-muted)" }}
                  >
                    Portfolio Assistant
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleReset}
                  aria-label="Reset conversation"
                  className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-[var(--fg)]/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  style={{ color: "var(--fg-muted)" }}
                >
                  <RefreshCw size={14} strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close chat"
                  className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-[var(--fg)]/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  style={{ color: "var(--fg-muted)" }}
                >
                  <X size={16} strokeWidth={1.75} />
                </button>
              </div>
            </header>

            {/* ── Sub-header status ───────────────────────────────── */}
            <div
              className="px-4 sm:px-5 py-2 text-[11px] leading-snug"
              style={{ color: "var(--fg-muted)" }}
            >
              Ask about projects, skills, experience, or how to start a project with Maverick.
            </div>

            {/* ── Messages ────────────────────────────────────────── */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 sm:px-5 pb-3 space-y-3 scrollbar-hide"
              aria-live="polite"
              aria-relevant="additions"
            >
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}

              {status === "loading" && <TypingIndicator />}

              {showSuggestions && (
                <SuggestedQuestions
                  onSelect={(q) => {
                    void sendMessage(q);
                  }}
                />
              )}
            </div>

            {/* ── Input ───────────────────────────────────────────── */}
            <div
              ref={inputAreaRef}
              className="px-3 sm:px-4 pt-2 pb-3 sm:pb-4"
              style={{ borderTop: "1px solid var(--border-subtle)" }}
            >
              <div
                className={cn(
                  "flex items-end gap-2 rounded-2xl px-3 py-2",
                  "border transition-colors",
                )}
                style={{
                  borderColor: "var(--border-subtle)",
                  background: "var(--fg-muted)/5",
                  backgroundColor: "color-mix(in srgb, var(--fg) 4%, transparent)",
                }}
              >
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  placeholder="Ask about projects, skills, experience..."
                  aria-label="Ask a question about Maverick's portfolio"
                  disabled={status === "loading"}
                  className={cn(
                    "flex-1 resize-none bg-transparent outline-none",
                    "text-sm leading-relaxed",
                    "placeholder:text-[var(--fg-muted)]",
                    "disabled:opacity-50",
                    "max-h-[140px]",
                  )}
                  style={{ color: "var(--fg)" }}
                />
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canSend}
                  aria-label="Send message"
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                    "transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
                    canSend
                      ? "hover:scale-105 active:scale-95"
                      : "opacity-40 cursor-not-allowed",
                  )}
                  style={{
                    background: canSend ? "var(--accent)" : "var(--fg-muted)",
                    color: canSend ? "#fff" : "var(--bg)",
                  }}
                >
                  <ArrowUp size={15} strokeWidth={2} />
                </button>
              </div>
              <p
                className="mt-1.5 px-1 text-[10px] tracking-wide"
                style={{ color: "var(--fg-muted)", opacity: 0.7 }}
              >
                Powered by Gemini. Responses are about Maverick&apos;s portfolio only.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Message Bubble ───────────────────────────────────────────────── */

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          "whitespace-pre-wrap break-words",
        )}
        style={
          isUser
            ? {
                background: "var(--accent)",
                color: "#fff",
                borderBottomRightRadius: "0.4rem",
              }
            : {
                background: "color-mix(in srgb, var(--fg) 6%, transparent)",
                color: "var(--fg)",
                borderBottomLeftRadius: "0.4rem",
                border: "1px solid var(--border-subtle)",
              }
        }
      >
        {message.content}
      </div>
    </motion.div>
  );
}

/* ── Typing Indicator ─────────────────────────────────────────────── */

function TypingIndicator() {
  return (
    <div className="flex justify-start" aria-label="Mavs AI is typing">
      <div
        className="flex items-center gap-1 rounded-2xl px-3.5 py-2.5"
        style={{
          background: "color-mix(in srgb, var(--fg) 6%, transparent)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--fg-muted)" }}
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Suggested Questions ──────────────────────────────────────────── */

function SuggestedQuestions({
  onSelect,
}: {
  onSelect: (label: string) => void;
}) {
  return (
    <div className="pt-1.5 pb-1">
      <p
        className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-2"
        style={{ color: "var(--fg-muted)" }}
      >
        Try asking
      </p>
      <div className="flex flex-wrap gap-2">
        {SUGGESTED_QUESTIONS.map((q: SuggestedQuestion) => (
          <button
            key={q.id}
            type="button"
            onClick={() => onSelect(q.label)}
            className={cn(
              "text-xs font-medium rounded-full px-3 py-1.5",
              "border transition-all duration-200",
              "hover:scale-[1.02] active:scale-[0.98]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
            )}
            style={{
              borderColor: "var(--border-subtle)",
              color: "var(--fg)",
              background: "transparent",
            }}
          >
            {q.label}
          </button>
        ))}
      </div>
    </div>
  );
}