"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, MessageCircle, RefreshCw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Portal from "@/components/Portal";
import {
  SUGGESTED_QUESTIONS,
  clearPersistedConversation,
  makeId,
  readPersistedConversation,
  writePersistedConversation,
  type ChatMessage,
  type SuggestedQuestion,
} from "./chat-utils";

/* ── API contract ─────────────────────────────────────────────────── */

type ApiError = {
  error?: string;
  retryAfterMs?: number;
};

/* ── Component ────────────────────────────────────────────────────── */

type Status = "idle" | "loading" | "error" | "unavailable";

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hey! 👋 I'm Mavs' portfolio assistant. Happy to help — ask me anything about his projects, skills, experience, or how to start a project together.",
};

function isWelcomeMessage(m: ChatMessage): boolean {
  return m.id === WELCOME_MESSAGE.id;
}

export default function PortfolioChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [hasUnread, setHasUnread] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<ChatMessage[]>([]);

  // Keep a ref of the latest messages so async callbacks can read the
  // current conversation without re-creating them on every render.
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // ── Hydrate from localStorage on mount (client-only) ──────────────
  useEffect(() => {
    const persisted = readPersistedConversation();
    if (persisted && persisted.length > 0) {
      // Preserve the welcome message at the top only when the visitor
      // has never chatted before. Once they have a real conversation,
      // we restore exactly what they had — including any partial stream.
      setMessages(persisted);
    }
    setHydrated(true);
  }, []);

  // ── Persist on change (debounced 250 ms) ──────────────────────────
  useEffect(() => {
    if (!hydrated) return;
    const handle = window.setTimeout(() => {
      if (messages.length === 0) {
        clearPersistedConversation();
        return;
      }
      writePersistedConversation(messages);
    }, 250);
    return () => window.clearTimeout(handle);
  }, [messages, hydrated]);

  // ── Auto-scroll: only when the visitor is near the bottom so manual
  //    scrolling up to read history isn't interrupted.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distanceFromBottom < 120) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [messages, status]);

  // ── Auto-resize the textarea ──────────────────────────────────────
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 140)}px`;
  }, [input]);

  // ── Seed welcome message on first open if the conversation is empty
  useEffect(() => {
    if (!hydrated) return;
    if (isOpen && messages.length === 0) {
      setMessages([WELCOME_MESSAGE]);
      setHasUnread(false);
    }
  }, [hydrated, isOpen, messages.length]);

  // ── Mark unread when a new assistant message arrives while closed ──
  useEffect(() => {
    if (!isOpen) {
      const hasAssistantMessage = messages.some(
        (m) => m.role === "assistant" && !isWelcomeMessage(m),
      );
      if (hasAssistantMessage) setHasUnread(true);
    }
  }, [isOpen, messages]);

  // ── Abort any in-flight stream when the component unmounts ────────
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

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

      const baseMessages = messagesRef.current;
      const historyPayload = [...baseMessages, userMessage]
        .slice(-12) // keep last 12 turns for the server context window
        .map((m) => ({ role: m.role, content: m.content }));

      // Optimistically append the user message and an empty assistant
      // placeholder that we will fill as chunks stream in.
      const assistantPlaceholder: ChatMessage = {
        id: makeId("assistant"),
        role: "assistant",
        content: "",
      };

      setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);
      setInput("");
      setStatus("loading");

      // Cancel any previous in-flight request before starting a new one.
      abortRef.current?.abort();
      const abortController = new AbortController();
      abortRef.current = abortController;

      try {
        const res = await fetch("/api/portfolio-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "text/plain" },
          body: JSON.stringify({
            message: trimmed,
            history: historyPayload,
          }),
          signal: abortController.signal,
        });

        if (!res.ok) {
          const errBody = (await res
            .json()
            .catch(() => ({}))) as ApiError;
          const errorText =
            errBody.error ||
            "I couldn't answer that right now. Please try again in a moment.";
          setStatus("error");
          setMessages((prev) => {
            const withoutPlaceholder = prev.filter(
              (m) => m.id !== assistantPlaceholder.id,
            );
            return [
              ...withoutPlaceholder,
              {
                id: makeId("assistant"),
                role: "assistant",
                content: errorText,
              },
            ];
          });
          return;
        }

        if (!res.body) {
          setStatus("error");
          setMessages((prev) => {
            const withoutPlaceholder = prev.filter(
              (m) => m.id !== assistantPlaceholder.id,
            );
            return [
              ...withoutPlaceholder,
              {
                id: makeId("assistant"),
                role: "assistant",
                content:
                  "I couldn't answer that right now. Please try again in a moment.",
              },
            ];
          });
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let assembled = "";
        let aborted = false;

        // Read chunks as they arrive and append them to the placeholder
        // assistant message.
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          if (!value) continue;
          const chunk = decoder.decode(value, { stream: true });
          assembled += chunk;
          setMessages((prev) => {
            const idx = prev.findIndex((m) => m.id === assistantPlaceholder.id);
            if (idx === -1) {
              // Placeholder was replaced by a previous error path —
              // start a fresh assistant message with the accumulated text.
              return [
                ...prev,
                {
                  id: makeId("assistant"),
                  role: "assistant",
                  content: assembled,
                },
              ];
            }
            const next = prev.slice();
            next[idx] = {
              ...next[idx],
              content: assembled,
            };
            return next;
          });
        }

        // Stream completed cleanly.
        if (abortController.signal.aborted) {
          aborted = true;
        }
        if (!aborted) {
          if (assembled.trim().length === 0) {
            setStatus("error");
            setMessages((prev) => {
              const idx = prev.findIndex(
                (m) => m.id === assistantPlaceholder.id,
              );
              if (idx === -1) return prev;
              const next = prev.slice();
              next[idx] = {
                ...next[idx],
                content:
                  "I couldn't answer that right now. Please try again in a moment.",
              };
              return next;
            });
          } else {
            setStatus("idle");
          }
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          // Visitor aborted — remove the empty placeholder if no text
          // streamed yet.
          setMessages((prev) => {
            const idx = prev.findIndex(
              (m) => m.id === assistantPlaceholder.id,
            );
            if (idx === -1) return prev;
            const placeholder = prev[idx];
            if (placeholder.content.length === 0) {
              return prev.filter((_, i) => i !== idx);
            }
            return prev;
          });
          setStatus("idle");
          return;
        }
        setStatus("error");
        setMessages((prev) => {
          const withoutPlaceholder = prev.filter(
            (m) => m.id !== assistantPlaceholder.id,
          );
          return [
            ...withoutPlaceholder,
            {
              id: makeId("assistant"),
              role: "assistant",
              content:
                "I couldn't answer that right now. Please try again in a moment.",
            },
          ];
        });
      }
    },
    [status],
  );

  const handleSubmit = useCallback(() => {
    void sendMessage(input);
  }, [input, sendMessage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (
        e.key === "Enter" &&
        !e.shiftKey &&
        !e.nativeEvent.isComposing
      ) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  const handleReset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setMessages([]);
    setInput("");
    setStatus("idle");
    clearPersistedConversation();
  }, []);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setHasUnread(false);
  }, []);

  const handleClose = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsOpen(false);
  }, []);

  const canSend = input.trim().length > 0 && status !== "loading";

  const showSuggestions = useMemo(
    () => messages.length <= 1 && status === "idle",
    [messages.length, status],
  );

  return (
    <Portal>
      {/* ── Noscript fallback (SEO + accessibility for JS-disabled) */}
      <noscript>
        <div
          style={{
            position: "fixed",
            bottom: "1rem",
            right: "1rem",
            padding: "0.75rem 1rem",
            borderRadius: "0.75rem",
            background: "var(--bg)",
            color: "var(--fg)",
            border: "1px solid var(--border-subtle)",
            zIndex: 2147483646,
            fontSize: "0.875rem",
            maxWidth: "320px",
          }}
        >
          The portfolio chat assistant needs JavaScript. Reach Maverick at{" "}
          <a
            href="mailto:maverickdanielle@gmail.com"
            style={{ color: "var(--accent)", textDecoration: "underline" }}
          >
            maverickdanielle@gmail.com
          </a>{" "}
          or use the contact form.
        </div>
      </noscript>

      {/* ── Floating Trigger ──────────────────────────────────────── */}
      {!isOpen && (
        <button
          type="button"
          onClick={handleOpen}
          aria-label="Open Mavs AI — portfolio assistant"
          aria-expanded={isOpen}
          className={cn(
            "fixed bottom-4 right-4 sm:bottom-5 sm:right-6",
            "flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full",
            "transition-all duration-300 hover:scale-105 active:scale-95",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
            "backdrop-blur-xl border shadow-lg",
          )}
          style={{
            background: "color-mix(in srgb, var(--bg) 70%, transparent)",
            color: "var(--fg)",
            borderColor: "var(--border-subtle)",
            zIndex: 2147483646,
          }}
        >
          <MessageCircle size={18} strokeWidth={1.8} />
          {hasUnread && (
            <span
              aria-hidden="true"
              className="absolute h-2 w-2 rounded-full"
              style={{
                top: "calc(50% - 14px)",
                right: "calc(50% - 14px)",
                background: "var(--accent)",
                boxShadow: "0 0 0 2px var(--bg)",
              }}
            />
          )}
        </button>
      )}

      {/* ── Chat Window ───────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-label="Mavs AI — portfolio assistant"
            aria-modal="false"
            className={cn(
              "fixed",
              "bottom-0 right-0 sm:bottom-5 sm:right-5 md:bottom-6 md:right-6",
              "w-[calc(100vw-2rem)] sm:w-[320px] md:w-[360px] lg:w-[380px]",
              "max-w-[380px]",
              "h-[min(100dvh-3rem,720px)] sm:h-[540px] md:h-[600px] lg:h-[640px]",
              "flex flex-col overflow-hidden rounded-2xl",
              "border backdrop-blur-2xl",
            )}
            style={{
              background: "color-mix(in srgb, var(--bg) 96%, transparent)",
              color: "var(--fg)",
              borderColor: "var(--border-subtle)",
              boxShadow:
                "0 24px 64px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.04)",
              zIndex: 2147483647,
            }}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* ── Header ──────────────────────────────────────────── */}
            <header
              className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 shrink-0"
              style={{ borderBottom: "1px solid var(--border-subtle)" }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  aria-hidden="true"
                  className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full overflow-hidden"
                  style={{
                    background: "var(--muted)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <Image
                    src="/updatedprofile_pic.webp"
                    alt="Maverick Danielle Andres"
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p
                      className="text-sm font-semibold tracking-tight truncate"
                      style={{ color: "var(--fg)" }}
                    >
                      Mavs AI
                    </p>
                    {/* Online indicator — small pulsing dot */}
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: "#22c55e" }}
                    />
                  </div>
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
                  className="flex h-8 w-8 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  style={{
                    color: "var(--fg-muted)",
                    background: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "color-mix(in srgb, var(--fg) 8%, transparent)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <RefreshCw size={14} strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close chat"
                  className="flex h-8 w-8 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  style={{
                    color: "var(--fg-muted)",
                    background: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "color-mix(in srgb, var(--fg) 8%, transparent)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <X size={16} strokeWidth={1.75} />
                </button>
              </div>
            </header>

            {/* ── Sub-header status ───────────────────────────────── */}
            <div
              className="px-4 sm:px-5 py-2.5 text-[11.5px] leading-snug shrink-0"
              style={{
                color: "var(--fg-muted)",
                borderBottom: "1px solid var(--border-subtle)",
              }}
            >
              Ask me anything about Maverick&apos;s work — I&apos;ll keep it
              friendly and on-topic. ✨
            </div>

            {/* ── Messages ────────────────────────────────────────── */}
            <div
              ref={scrollRef}
              className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 sm:px-5 py-4 space-y-3 scrollbar-hide"
              aria-live="polite"
              aria-relevant="additions"
              data-lenis-prevent="true"
            >
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}

              {status === "loading" && messages[messages.length - 1]?.content === "" && (
                <TypingIndicator />
              )}

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
              className="px-3 sm:px-4 pt-3 pb-3 sm:pb-4 shrink-0"
              style={{ borderTop: "1px solid var(--border-subtle)" }}
            >
              <div
                className={cn(
                  "flex items-end gap-2 rounded-2xl px-3 py-2",
                  "border transition-colors",
                )}
                style={{
                  borderColor: "var(--border-subtle)",
                  backgroundColor:
                    "color-mix(in srgb, var(--fg) 5%, transparent)",
                }}
              >
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  placeholder="Ask about Maverick's work…"
                  aria-label="Ask a question about Maverick's portfolio"
                  disabled={status === "loading"}
                  className={cn(
                    "block w-full min-w-0 flex-1 resize-none border-0 bg-transparent",
                    "py-1 outline-none focus:outline-none focus:ring-0",
                    "text-sm leading-relaxed",
                    "disabled:opacity-50",
                    "scrollbar-hide",
                  )}
                  style={{
                    color: "var(--fg)",
                    minHeight: "28px",
                    maxHeight: "120px",
                  }}
                />
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canSend}
                  aria-label="Send message"
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    "transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
                    canSend
                      ? "hover:scale-105 active:scale-95"
                      : "opacity-40 cursor-not-allowed",
                  )}
                  style={{
                    background: canSend ? "var(--accent)" : "var(--muted)",
                    color: canSend ? "#fff" : "var(--fg-muted)",
                  }}
                >
                  <ArrowUp size={14} strokeWidth={2.25} />
                </button>
              </div>
              <p
                className="mt-1.5 px-1 text-[10px] tracking-wide"
                style={{ color: "var(--fg-muted)", opacity: 0.85 }}
              >
                Powered by Gemini · Portfolio answers only 💬
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
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
          "max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed",
          "whitespace-pre-wrap break-words",
        )}
        style={
          isUser
            ? {
                background: "var(--accent)",
                color: "#fff",
                borderBottomRightRadius: "0.4rem",
                boxShadow: "0 6px 20px -8px var(--accent)",
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
        className="flex items-center gap-1.5 rounded-2xl px-3.5 py-3 border"
        style={{
          background: "color-mix(in srgb, var(--fg) 6%, transparent)",
          borderColor: "var(--border-subtle)",
          borderBottomLeftRadius: "0.4rem",
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
    <div className="pt-2 pb-1">
      <p
        className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-2.5"
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
              "text-xs font-medium rounded-full px-3.5 py-1.5",
              "border transition-all duration-200",
              "hover:scale-[1.02] active:scale-[0.98]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
            )}
            style={{
              borderColor: "var(--border-subtle)",
              color: "var(--fg)",
              background:
                "color-mix(in srgb, var(--fg) 4%, transparent)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.background =
                "color-mix(in srgb, var(--accent) 12%, transparent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border-subtle)";
              e.currentTarget.style.background =
                "color-mix(in srgb, var(--fg) 4%, transparent)";
            }}
          >
            {q.label}
          </button>
        ))}
      </div>
    </div>
  );
}
