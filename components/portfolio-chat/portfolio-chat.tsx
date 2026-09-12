"use client";

/**
 * Portfolio AI chatbox.
 *
 * Architecture (after refactor):
 *
 *   1. Conversation state:    React state + ref mirror for stable async
 *                            access; persisted to localStorage.
 *   2. FAQ fast-path:         `chat-faq.ts` matches the visitor's question
 *                            against canonical FAQs *before* hitting the
 *                            network. Instant, no Gemini spend.
 *   3. Topic guard:           Pre-flight keyword check rejects obviously
 *                            off-topic messages before they reach Gemini.
 *                            Server-side guard is the second line of
 *                            defence (see `lib/chat/topic-classifier.ts`).
 *   4. Server stream:         `/api/portfolio-chat` proxies Gemini with
 *                            streaming + rate-limit + origin-check +
 *                            prompt-injection defence.
 *   5. Markdown rendering:    `chat-markdown.tsx` — dependency-free,
 *                            sanitized, no raw HTML.
 *   6. Smart CTAs:            `chat-cta.tsx` — only relevant intents
 *                            surface after each reply.
 *   7. Layout:                Pure flex with `flex-1 min-h-0` on the
 *                            scroll container. VisualViewport-aware
 *                            height on mobile so the keyboard doesn't
 *                            create empty space above the input.
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { AnimatePresence, m } from "framer-motion";
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
import {
  OFF_TOPIC_REPLY,
  detectIntent,
  isClearlyOffTopic,
  matchFaq,
  type FaqMatch,
  type Intent,
} from "./chat-faq";
import { ChatCtas, defaultCtasFor } from "./chat-cta";
import { Markdown } from "./chat-markdown";

/* ── API contract ─────────────────────────────────────────────────── */

type ApiError = {
  error?: string;
  retryAfterMs?: number;
  intent?: string;
};

type AssistantMeta = {
  /** Cached FAQ match id when the reply came from the fast-path. */
  faqId?: string;
  /** Detected intent used for CTAs + analytics. */
  intent?: Intent;
  /** CTAs to show under the assistant reply. */
  ctas?: ReturnType<typeof defaultCtasFor>;
  /** When true, the message is a final reply from a single chunk. */
  isFinal?: boolean;
};

/* ── Component ────────────────────────────────────────────────────── */

type Status = "idle" | "loading" | "error" | "unavailable";

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hey! I'm **Mavs AI** — Maverick's portfolio assistant. Ask me about his **projects**, **skills**, **experience**, or how to **start a project** together.",
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
  /** Maps assistant message id → metadata for CTA rendering. */
  const [metaByMessage, setMetaByMessage] = useState<
    Record<string, AssistantMeta>
  >({});

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<ChatMessage[]>([]);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<Record<string, AssistantMeta>>({});

  // Mirror the latest state in refs so async callbacks can read without
  // re-creating them on every render.
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  useEffect(() => {
    metaRef.current = metaByMessage;
  }, [metaByMessage]);

  // ── Hydrate from localStorage on mount (client-only) ──────────────
  useEffect(() => {
    const persisted = readPersistedConversation();
    if (persisted && persisted.length > 0) {
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
    if (distanceFromBottom < 200) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [messages, status]);

  // ── Auto-resize the textarea (capped at 5 lines, then scrolls) ────
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    const max = 110; // px — fits ~4-5 lines
    ta.style.height = `${Math.min(ta.scrollHeight, max)}px`;
    ta.style.overflowY = ta.scrollHeight > max ? "auto" : "hidden";
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

  // ── Inject chat-specific media-query styles once on mount ────────
  // We use a single global <style> tag (id-guarded) instead of a
  // stylesheet so this component stays self-contained.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const styleId = "mavsai-desktop-styles";
    if (document.getElementById(styleId)) return;
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
@media (min-width: 640px) {
  .chat-window {
    left: auto !important;
    right: calc(env(safe-area-inset-right, 0px) + 24px) !important;
    bottom: calc(env(safe-area-inset-bottom, 0px) + 24px) !important;
    width: 380px !important;
    max-width: calc(100vw - 48px) !important;
    height: min(620px, var(--chat-vh, 80dvh), calc(100dvh - 48px)) !important;
  }
  .chat-messages { padding: 16px 20px; }
  .chat-input { padding: 10px 16px 14px; }
}
@media (min-width: 768px) {
  .chat-window { height: min(640px, calc(100dvh - 48px)) !important; }
}
@media (prefers-reduced-motion: reduce) {
  .chat-window { transition: none !important; }
}
`;
    document.head.appendChild(style);
  }, []);

  // ── VisualViewport-aware mobile height ────────────────────────────
  // When the mobile keyboard opens, `dvh` *should* shrink — but Safari
  // and several Android browsers do this inconsistently. We sync the
  // chat height to the actual visible viewport so the input stays glued
  // to the keyboard top without leaving empty space above it.
  useEffect(() => {
    if (!isOpen) return;
    if (typeof window === "undefined") return;
    const vv = window.visualViewport;
    if (!vv) return;
    const root = chatWindowRef.current?.parentElement;
    if (!root) return;

    const apply = () => {
      const height = Math.max(280, Math.round(vv.height));
      const top = Math.round(vv.offsetTop);
      root.style.setProperty("--chat-vh", `${height}px`);
      root.style.setProperty("--chat-top", `${top}px`);
    };
    apply();
    vv.addEventListener("resize", apply);
    vv.addEventListener("scroll", apply);
    return () => {
      vv.removeEventListener("resize", apply);
      vv.removeEventListener("scroll", apply);
    };
  }, [isOpen]);

  // ── Send a message ────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed || status === "loading") return;

      // Build the user message first so it's always persisted.
      const userMessage: ChatMessage = {
        id: makeId("user"),
        role: "user",
        content: trimmed,
      };

      // ── Pre-flight FAQ fast-path ────────────────────────────────
      // Cheap, deterministic, no network. If the FAQ bank has a clean
      // match, answer instantly and skip the server entirely.
      const faq: FaqMatch | null = matchFaq(trimmed);
      const offTopic = !faq && isClearlyOffTopic(trimmed);

      // Append user + assistant placeholders atomically so the user sees
      // both bubbles appear together (and we have a placeholder to fill).
      const assistantId = makeId("assistant");
      const baseMessages = messagesRef.current;
      const historyPayload = [...baseMessages, userMessage]
        .slice(-12)
        .map((m) => ({ role: m.role, content: m.content }));

      const assistantPlaceholder: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
      };

      setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);
      setInput("");

      // FAQ fast-path: instant reply, no Gemini.
      if (faq) {
        setMetaByMessage((prev) => ({
          ...prev,
          [assistantId]: {
            faqId: faq.id,
            intent: faq.intent,
            ctas: faq.ctas,
            isFinal: true,
          },
        }));
        // Replace placeholder with the canned answer in a single update
        // so streaming animations don't fire for instant replies.
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: faq.answer } : m,
          ),
        );
        setStatus("idle");
        return;
      }

      // Off-topic fast-path: instant polite redirect.
      if (offTopic) {
        const intent = detectIntent(trimmed);
        setMetaByMessage((prev) => ({
          ...prev,
          [assistantId]: {
            intent: intent === "unrelated" ? "unrelated" : intent,
            ctas:
              intent === "unrelated"
                ? defaultCtasFor("unrelated")
                : defaultCtasFor(intent),
            isFinal: true,
          },
        }));
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: OFF_TOPIC_REPLY }
              : m,
          ),
        );
        setStatus("idle");
        return;
      }

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

        // Server-side topic rejection (intent: "unrelated"). Single chunk
        // response — no streaming.
        if (
          res.ok &&
          res.headers.get("X-Chat-Intent") === "unrelated"
        ) {
          const text = await res.text();
          const intent: Intent = "unrelated";
          setMetaByMessage((prev) => ({
            ...prev,
            [assistantId]: {
              intent,
              ctas: defaultCtasFor(intent),
              isFinal: true,
            },
          }));
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: text } : m,
            ),
          );
          setStatus("idle");
          return;
        }

        if (!res.ok) {
          const errBody = (await res
            .json()
            .catch(() => ({}))) as ApiError;
          const errorText =
            errBody.error ||
            "I couldn't answer that right now. Please try again in a moment.";
          setStatus("error");
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: errorText } : m,
            ),
          );
          return;
        }

        if (!res.body) {
          setStatus("error");
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? {
                    ...m,
                    content:
                      "I couldn't answer that right now. Please try again in a moment.",
                  }
                : m,
            ),
          );
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
            const idx = prev.findIndex((m) => m.id === assistantId);
            if (idx === -1) {
              return [
                ...prev,
                { id: makeId("assistant"), role: "assistant", content: assembled },
              ];
            }
            const next = prev.slice();
            next[idx] = { ...next[idx], content: assembled };
            return next;
          });
        }

        if (abortController.signal.aborted) {
          aborted = true;
        }
        if (!aborted) {
          // Tag this message with its detected intent for CTAs.
          const intent = detectIntent(trimmed);
          setMetaByMessage((prev) => ({
            ...prev,
            [assistantId]: {
              intent: intent === "unknown" ? "skills" : intent,
              ctas: defaultCtasFor(intent === "unknown" ? "skills" : intent),
              isFinal: true,
            },
          }));

          if (assembled.trim().length === 0) {
            setStatus("error");
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? {
                      ...m,
                      content:
                        "I couldn't answer that right now. Please try again in a moment.",
                    }
                  : m,
              ),
            );
          } else {
            setStatus("idle");
          }
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          // Visitor aborted — drop the empty placeholder.
          setMessages((prev) => {
            const idx = prev.findIndex((m) => m.id === assistantId);
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
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content:
                    "I couldn't answer that right now. Please try again in a moment.",
                }
              : m,
          ),
        );
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
    setMetaByMessage({});
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

  // Close when clicking or tapping outside the chat window
  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(e: MouseEvent | TouchEvent) {
      if (
        chatWindowRef.current &&
        !chatWindowRef.current.contains(e.target as Node)
      ) {
        handleClose();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [isOpen, handleClose]);

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
          <>
            {/* Backdrop: tapping outside closes the chat immediately */}
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-[2px] sm:bg-transparent sm:backdrop-blur-none"
              style={{ zIndex: 2147483646 }}
              onClick={handleClose}
              aria-hidden="true"
            />

            <m.div
              ref={chatWindowRef}
              role="dialog"
              aria-label="Mavs AI — portfolio assistant"
              aria-modal="false"
              className={cn(
                "chat-window",
                "fixed flex flex-col overflow-hidden",
              )}
              style={{
                bottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)",
                left: "16px",
                right: "16px",
                width: "auto",
                maxWidth: "calc(100vw - 32px)",
                height: "min(560px, var(--chat-vh, 76dvh), calc(100dvh - 32px))",
                borderRadius: "1rem",
                border: "1px solid var(--border-subtle)",
                background: "color-mix(in srgb, var(--bg) 96%, transparent)",
                color: "var(--fg)",
                backdropFilter: "blur(28px)",
                WebkitBackdropFilter: "blur(28px)",
                boxShadow:
                  "0 24px 64px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.06)",
                zIndex: 2147483647,
                // iOS keyboard fix — never let the bottom edge get
                // obscured by the keyboard.
                overscrollBehavior: "contain",
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

            {/* ── Messages ────────────────────────────────────────── */}
            <div
              ref={scrollRef}
              className="chat-messages flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 sm:px-5 py-4 space-y-3 scrollbar-hide"
              aria-live="polite"
              aria-relevant="additions"
              data-lenis-prevent="true"
            >
              {messages.map((m, idx) => (
                <MessageBubble
                  key={m.id}
                  message={m}
                  isLast={idx === messages.length - 1}
                  meta={metaByMessage[m.id]}
                />
              ))}

              {status === "loading" &&
                messages.length > 0 &&
                messages[messages.length - 1]?.role === "user" && (
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
              className="chat-input px-3 sm:px-4 pt-2.5 pb-2.5 sm:pb-3 shrink-0"
              style={{
                borderTop: "1px solid var(--border-subtle)",
                paddingBottom:
                  "calc(env(safe-area-inset-bottom, 0px) * 0.5 + 10px)",
              }}
            >
              <div
                className={cn(
                  "flex items-end gap-2 rounded-2xl px-3 py-1.5",
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
                    minHeight: "26px",
                    maxHeight: "110px",
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
                className="mt-1 px-1 text-[10px] tracking-wide"
                style={{ color: "var(--fg-muted)", opacity: 0.85 }}
              >
                Powered by Gemini · Portfolio answers only
              </p>
            </div>
          </m.div>
        </>
      )}
      </AnimatePresence>
    </Portal>
  );
}

/* ── Message Bubble ───────────────────────────────────────────────── */

function MessageBubble({
  message,
  isLast,
  meta,
}: {
  message: ChatMessage;
  isLast: boolean;
  meta?: AssistantMeta;
}) {
  const isUser = message.role === "user";

  return (
    <m.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed",
        )}
        style={
          isUser
            ? {
                background: "var(--accent)",
                color: "#fff",
                borderBottomRightRadius: "0.4rem",
                boxShadow: "0 6px 20px -8px var(--accent)",
                whiteSpace: "pre-wrap",
                overflowWrap: "anywhere",
              }
            : {
                background:
                  "color-mix(in srgb, var(--fg) 6%, transparent)",
                color: "var(--fg)",
                borderBottomLeftRadius: "0.4rem",
                border: "1px solid var(--border-subtle)",
              }
        }
      >
        {isUser ? (
          message.content
        ) : message.content ? (
          <Markdown source={message.content} />
        ) : (
          <TypingDots />
        )}

        {!isUser && meta?.ctas && meta.ctas.length > 0 && meta.isFinal && isLast && (
          <ChatCtas intents={meta.ctas} />
        )}

        {!isUser && meta?.intent && !meta.isFinal && isLast && (
          <ChatCtas intents={defaultCtasFor(meta.intent)} />
        )}
      </div>
    </m.div>
  );
}

/* ── Typing Dots & Indicator ───────────────────────────────────────── */

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 py-1 px-0.5" aria-label="Mavs AI is typing">
      {[0, 1, 2].map((i) => (
        <m.span
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
  );
}

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
          <m.span
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