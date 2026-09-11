/**
 * Lightweight server-side classifier that decides whether a visitor's
 * message is plausibly about Maverick / his portfolio.
 *
 * Goal: reject clearly off-topic requests *before* they reach the Gemini
 * API, saving the visitor from unnecessary latency and saving Maverick
 * from unnecessary spend. Conservative — when in doubt, allow the request
 * through and let Gemini's prompt-injection guard handle it.
 *
 * The classifier is intentionally tiny (no embeddings, no LLM calls). It
 * uses **word-boundary** matching (tokenization) so short tokens like
 * "he" don't match inside "the" or "weather".
 *
 * Decision rule:
 *   - If off-topic trigger present AND no Mav signal  → REJECT
 *   - If Mav signal present                          → ALLOW
 *   - Otherwise                                      → ALLOW (let Gemini
 *                                                     arbitrate; the cost
 *                                                     of a bad pass-through
 *                                                     is one extra API
 *                                                     call, much cheaper
 *                                                     than blocking a real
 *                                                     question).
 */

const OFF_TOPIC_TRIGGERS = [
  "homework", "essay", "thesis", "assignment",
  "write me a", "write a poem", "code review my", "debug my code",
  "weather", "forecast", "news today", "stock price", "stock market",
  "sports score", "game score", "who won", "recipe", "cook",
  "cooking", "ingredient", "ingredients", "trivia", "riddle", "joke",
  "love advice", "relationship advice", "medical advice", "legal advice",
  "tax advice", "financial advice", "doctor", "diagnosis", "symptom",
  "political", "politics", "election", "vote for", "religion",
  "religious", "calculate", "solve this", "equation", "derivative",
  "integral",
];

const MAV_SIGNALS = [
  "mav", "maverick", "portfolio",
  "react", "next.js", "nextjs", "tailwind", "typescript",
  "javascript", "node", "nodejs", "express", "php", "supabase",
  "postgres", "postgresql", "mysql", "mongo", "mongodb",
  "figma", "framer", "gsap", "shadcn",
  "ai", "llm", "gemini", "chatgpt", "claude",
  "mobile", "react native", "expo", "ios", "android",
  "api", "rest", "graphql", "edge function", "edge functions",
  "database", "schema", "rls",
  "ecommerce", "marketplace", "shopify", "wordpress",
  "hrms", "payroll", "logistics", "booking",
  "lms", "learning management",
  "freelance", "freelancer", "consultant", "contractor",
  "hire", "hiring", "recruit", "recruiter", "resume",
  "github", "linkedin", "facebook", "instagram",
  "project", "projects", "work", "experience", "career",
  "skill", "skills", "stack", "technology", "technologies",
  "education", "school", "university", "college", "cum",
  "beauty connect", "bazaarx", "m-chat",
  "monitoring", "jjz", "superfit", "photosnap",
  "shimmeur", "zentari", "optrizo",
  "wedding", "allen", "vea", "mojde",
  "available", "availability", "open to opportunities",
  "open to work", "looking for work",
  "contact", "reach out",
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\p{Letter}\p{Number}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Word-boundary check. Splits `haystack` into tokens (space-separated)
 * and tests whether any token exactly equals `needle`. Multi-word needles
 * are matched as substrings on the padded string. This is what prevents
 * false positives like "he" matching "the".
 */
function hasWord(normalized: string, needle: string): boolean {
  if (!needle) return false;
  const n = needle.toLowerCase();
  if (n.includes(" ")) {
    return (
      normalized.includes(" " + n + " ") ||
      normalized.startsWith(n + " ") ||
      normalized.endsWith(" " + n) ||
      normalized === n
    );
  }
  // Exact token match (cheap O(N) over the small token list).
  let i = 0;
  while ((i = normalized.indexOf(n, i)) !== -1) {
    const before = i === 0 ? " " : normalized.charAt(i - 1);
    const after = i + n.length >= normalized.length
      ? " "
      : normalized.charAt(i + n.length);
    if (before === " " && after === " ") return true;
    i += n.length;
  }
  return false;
}

export type TopicDecision =
  | { kind: "allow" }
  | { kind: "allow_mav_signal"; matched: string }
  | { kind: "reject"; reason: string };

export function classifyTopic(message: string): TopicDecision {
  const normalized = normalize(message);
  if (!normalized) return { kind: "allow" };

  // Off-topic triggers first — only reject if no Mav signal is present.
  for (const trigger of OFF_TOPIC_TRIGGERS) {
    if (hasWord(normalized, trigger)) {
      const hasSignal = MAV_SIGNALS.some((s) => hasWord(normalized, s));
      if (!hasSignal) {
        return {
          kind: "reject",
          reason:
            "I'm here to answer questions about Maverick, his projects, skills, experience, and portfolio. Ask me anything about his work or what he can build.",
        };
      }
      break;
    }
  }

  // Mav signals — explicit allow with the matching keyword (useful for
  // analytics).
  for (const signal of MAV_SIGNALS) {
    if (hasWord(normalized, signal)) {
      return { kind: "allow_mav_signal", matched: signal };
    }
  }

  // Short, ambiguous messages — allow through.
  return { kind: "allow" };
}