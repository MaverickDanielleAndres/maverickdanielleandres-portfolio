/**
 * Shared types and utilities for the portfolio AI chatbox.
 */

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

export type SuggestedQuestion = {
  id: string;
  label: string;
};

export const SUGGESTED_QUESTIONS: SuggestedQuestion[] = [
  { id: "q1", label: "What does Maverick build?" },
  { id: "q2", label: "Show me his best projects." },
  { id: "q3", label: "What is his tech stack?" },
  { id: "q4", label: "Tell me about Beauty Connect." },
  { id: "q5", label: "Does he have leadership experience?" },
  { id: "q6", label: "Can I hire Maverick?" },
];

/** localStorage key for persisted conversations. */
export const CONVERSATION_STORAGE_KEY = "mavsai:conversation";

/** Maximum number of messages kept in localStorage (oldest pruned first). */
export const MAX_PERSISTED_MESSAGES = 60;

export function makeId(prefix = "m"): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/** SSR-safe localStorage read. Returns null when unavailable. */
export function readPersistedConversation(): ChatMessage[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONVERSATION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    const cleaned: ChatMessage[] = [];
    for (const entry of parsed) {
      if (!entry || typeof entry !== "object") continue;
      const obj = entry as Record<string, unknown>;
      const role: ChatRole = obj.role === "assistant" ? "assistant" : "user";
      const content = typeof obj.content === "string" ? obj.content : "";
      const id = typeof obj.id === "string" ? obj.id : makeId(role);
      if (content) cleaned.push({ id, role, content });
    }
    return cleaned.slice(-MAX_PERSISTED_MESSAGES);
  } catch {
    return null;
  }
}

/** SSR-safe localStorage write. Silently no-ops if storage is unavailable. */
export function writePersistedConversation(messages: ChatMessage[]): void {
  if (typeof window === "undefined") return;
  try {
    const trimmed = messages.slice(-MAX_PERSISTED_MESSAGES);
    window.localStorage.setItem(
      CONVERSATION_STORAGE_KEY,
      JSON.stringify(trimmed),
    );
  } catch {
    // quota / private mode / disabled — safe to ignore.
  }
}

export function clearPersistedConversation(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CONVERSATION_STORAGE_KEY);
  } catch {
    // ignore
  }
}
