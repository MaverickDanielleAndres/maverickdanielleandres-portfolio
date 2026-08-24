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

export function makeId(prefix = "m"): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}