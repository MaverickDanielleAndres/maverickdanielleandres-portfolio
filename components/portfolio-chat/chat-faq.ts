/**
 * FAQ + intent classifier for the portfolio chatbot.
 *
 * Two responsibilities:
 *   1. Match a visitor message against canonical FAQ patterns and return an
 *      instant answer (no Gemini call).
 *   2. Detect the visitor's *intent* so the UI can show relevant CTAs and
 *      the server-side guard can reject clearly off-topic questions before
 *      they reach the model.
 *
 * Everything is pure: no network, no DOM, no React. Safe to import from
 * both client and server. The matcher is a small, fast normalized-keyword
 * bag — no regexes, no fuzzy libraries — and is intentionally conservative.
 * If it isn't confident, it returns null and the caller falls through to
 * the LLM.
 */

export type Intent =
  | "hire"
  | "contact"
  | "project"
  | "ai"
  | "skills"
  | "experience"
  | "education"
  | "freelance"
  | "frontend"
  | "backend"
  | "database"
  | "mobile"
  | "design"
  | "pricing"
  | "availability"
  | "resume"
  | "social"
  | "unrelated"
  | "unknown";

export type FaqMatch = {
  /** Stable id used for analytics / debugging. */
  id: string;
  /** Short, second-person reply (Markdown allowed). */
  answer: string;
  /** CTA buckets the UI should expose. */
  ctas: CtaIntent[];
  /** Detected primary intent. */
  intent: Intent;
};

export type CtaIntent =
  | "start-project"
  | "contact-email"
  | "contact-whatsapp"
  | "contact-phone"
  | "contact-messenger"
  | "contact-form"
  | "view-resume"
  | "view-projects"
  | "view-github"
  | "view-linkedin"
  | "view-instagram";

/* ── Keyword bank ───────────────────────────────────────────────────── */

const KEYWORDS: Record<string, string[]> = {
  hire: [
    "hire", "hiring", "recruit", "recruiter", "apply", "job",
    "full time", "fulltime", "full-time", "contract",
    "work with", "work with you", "work with mav", "work with maverick",
    "start a project", "start project", "kick off", "kickoff",
    "collaborate", "collaboration", "join your team", "join the team",
  ],
  contact: [
    "contact", "reach out", "reach you", "reach mav", "reach maverick",
    "get in touch", "get hold of", "email", "gmail", "phone", "call",
    "whatsapp", "messenger", "send a message", "talk to", "speak to",
    "speak with",
  ],
  project: [
    "project", "projects", "built", "build", "builds",
    "portfolio", "showcase", "case study", "case studies",
    "beauty connect", "bazaarx", "bazaar x", "hrms",
    "monitoring and payroll", "monitoring system", "m-chat",
    "jjz", "jjz tech", "repair", "superfit", "super fit", "photosnap",
    "photo snap", "logistics", "shimmeur", "zentari", "optrizo",
    "all fire services", "wedding", "allen", "vea", "lms", "mojde",
    "e-community", "ecommunity", "e community",
  ],
  ai: [
    "ai", "artificial intelligence", "llm", "llms", "gemini", "chatgpt",
    "claude", "machine learning", "deep learning", "rag", "prompt",
    "agent", "agentic", "multi-modal", "multimodal", "voice assistant",
    "tts", "image generation", "visual search", "ai scanner",
    "ai assistant", "ai chatbot",
  ],
  skills: [
    "skill", "skills", "tech stack", "stack", "technology",
    "technologies", "tools", "tooling",
  ],
  experience: [
    "experience", "background", "worked", "work history", "career",
    "years of", "years experience", "nexvision", "nex vision",
    "freelance years", "department of education", "spes",
  ],
  education: [
    "education", "school", "university", "college", "degree",
    "cum laude", "gwa", "pasig", "pamantasan", "academic", "studied",
    "study", "graduate",
  ],
  freelance: [
    "freelance", "freelancer", "freelancing", "side project",
    "side projects", "client work", "clients", "client projects",
  ],
  frontend: [
    "frontend", "front-end", "front end", "ui", "ux", "react",
    "next.js", "nextjs", "next js", "tailwind", "css", "javascript",
    "typescript", "html",
  ],
  backend: [
    "backend", "back-end", "back end", "api", "apis", "rest",
    "rest api", "node", "node.js", "nodejs", "express", "php",
    "supabase", "edge function", "edge functions", "server",
  ],
  database: [
    "database", "databases", "db", "sql", "postgres", "postgresql",
    "mysql", "mongo", "mongodb", "supabase db", "schema", "rls",
  ],
  mobile: [
    "mobile", "app", "apps", "react native", "reactnative", "expo",
    "ios", "android", "app store", "play store",
  ],
  design: [
    "design", "designer", "figma", "wireframe", "wireframes",
    "mockup", "mockups", "ui/ux", "ui design", "ux design",
  ],
  pricing: [
    "price", "prices", "pricing", "cost", "costs", "rate", "rates",
    "fee", "fees", "quote", "budget", "how much", "estimate", "pay",
    "payment",
  ],
  availability: [
    "available", "availability", "open to opportunities",
    "open to work", "looking for work", "hire mav", "hire maverick",
  ],
  resume: [
    "resume", "cv", "curriculum vitae", "download cv", "download resume",
  ],
  social: [
    "github", "linkedin", "facebook", "instagram", "social", "socials",
    "social media", "profile",
  ],
};

const STOPWORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "do", "does", "for",
  "from", "have", "has", "had", "he", "her", "his", "i", "in", "is", "it",
  "its", "me", "my", "of", "on", "or", "so", "that", "the", "their",
  "them", "they", "this", "to", "was", "we", "what", "when", "where",
  "which", "who", "why", "will", "with", "you", "your", "yours", "tell",
  "can", "could", "would", "should", "andres",
]);

/* ── Canonical FAQ bank ────────────────────────────────────────────── */

/**
 * Canonical FAQ entries. The `patterns` are matched against the
 * normalized question text; the first match wins. Keep patterns short
 * and stable so the bank reads cleanly.
 */
const FAQ: Array<{
  id: string;
  patterns: string[];
  answer: string;
  ctas: CtaIntent[];
  intent: Intent;
}> = [
  {
    id: "who",
    patterns: [
      "who is", "who are", "tell me about mav", "tell me about maverick",
      "about you", "about mav", "about maverick",
      "introduce yourself", "introduce",
    ],
    answer:
      "Maverick Danielle Andres is a Full-Stack Web & App Developer based in Pasig City, Philippines. He's an IT graduate from Pamantasan ng Lungsod ng Pasig (Cum Laude, GWA 1.48), with experience as Lead Full-Stack Developer at NexVision Innovations Inc. and 3+ years of freelance web development.",
    ctas: ["view-resume", "view-projects", "contact-form"],
    intent: "experience",
  },
  {
    id: "what-builds",
    patterns: [
      "what does he build", "what does mav build", "what does maverick build",
      "what does he do", "what does mav do", "what does maverick do",
      "what do you do", "what do you build", "what he does", "what he build",
      "what kind of developer", "tell me what he", "tell me what mav",
      "what can he build", "what kind of work",
    ],
    answer:
      "He builds scalable web and mobile applications end-to-end — frontend, backend, database, and deployment. He specializes in React, Next.js, Node.js, Supabase, and AI integrations, and designs hi-fi UIs in Figma.",
    ctas: ["view-projects", "start-project"],
    intent: "skills",
  },
  {
    id: "available",
    patterns: [
      "is he available", "are you available", "available for work",
      "available for hire", "open to opportunities", "open to work",
      "are you free", "is mav free", "is maverick free",
      "is he open", "are you open",
    ],
    answer:
      "Yes. The portfolio hero displays **Available for work** / **Open to opportunities.** He accepts freelance, contract, team-join, and full-time engagements. Use the **Start a Project** flow or reach him via email or WhatsApp.",
    ctas: ["start-project", "contact-email", "contact-whatsapp"],
    intent: "availability",
  },
  {
    id: "tech-stack",
    patterns: [
      "tech stack", "what technologies", "what tech", "what stack",
      "what does he use", "what do you use", "tools he uses",
      "tools and technologies",
    ],
    answer:
      "**Frontend:** React, Next.js (14 + 16 App Router), TypeScript, Tailwind CSS (incl. v4), shadcn/ui, Framer Motion, GSAP.\n\n**Backend:** Node.js, Express.js, PHP, REST APIs, Supabase (Postgres + Edge Functions + Auth + Storage + Realtime + RLS), PayMongo.\n\n**Mobile:** React Native + Expo.\n\n**Databases:** PostgreSQL, MySQL, Supabase.\n\n**Cloud / DevOps:** AWS, Vercel, Docker, GitHub Actions.\n\n**AI:** Google Gemini SDK, prompt / agentic engineering.",
    ctas: ["view-projects", "view-github"],
    intent: "skills",
  },
  {
    id: "frontend",
    patterns: [
      "frontend stack", "frontend technologies", "frontend experience",
      "what frontend", "ui stack", "front end",
    ],
    answer:
      "React, Next.js (14 + 16 App Router), TypeScript, Tailwind CSS (incl. v4), shadcn/ui, Bootstrap, Framer Motion, GSAP (incl. ScrollTrigger), and Figma for hi-fi design.",
    ctas: ["view-projects"],
    intent: "frontend",
  },
  {
    id: "backend",
    patterns: [
      "backend stack", "backend technologies", "backend experience",
      "what backend", "back end",
    ],
    answer:
      "Node.js, Express.js, PHP, REST APIs, Supabase (Postgres + Edge Functions + Auth + Storage + Realtime + RLS), PayMongo payment gateway, Postgres SECURITY DEFINER functions.",
    ctas: ["view-projects"],
    intent: "backend",
  },
  {
    id: "databases",
    patterns: ["databases", "what databases", "database experience", "what db"],
    answer:
      "PostgreSQL, MySQL, and Supabase (Postgres). MongoDB is also listed in the Skills section. He designs schemas with RLS policies for multi-tenant systems.",
    ctas: [],
    intent: "database",
  },
  {
    id: "mobile",
    patterns: [
      "mobile app", "mobile apps", "can he build an app",
      "react native", "ios app", "android app",
    ],
    answer:
      "Yes. He uses **React Native + Expo**. BazaarX includes a React Native mobile companion.",
    ctas: ["view-projects"],
    intent: "mobile",
  },
  {
    id: "projects",
    patterns: ["what projects", "projects worked on", "what has he built", "projects built", "his projects", "show me your projects"],
    answer:
      "Some highlights:\n\n- **Logistics System** — enterprise cloud logistics OS (20 multi-tenant roles)\n- **M-Chat** — full multi-modal Gemini AI chat platform\n- **BazaarX** — enterprise multi-tenant marketplace with AI scanner + PayMongo\n- **HRMS** — Philippine TRAIN Law payroll with face recognition + GPS geofencing\n- **Monitoring and Payroll System** — NFC attendance, automated payroll\n- **Beauty Connect** — service booking + provider portal\n- **JJZ TECH** — local-business repair-shop site with Gemini AI assistant\n- **PhotoSnap** — photobooth with canvas editor + QR sharing\n- **SuperFit Webapp** — fitness platform with AI nutrition scan\n- **LMS** — school LMS with AI review generation (1,000+ users)\n\nPlus WordPress sites, wedding invitations, and more.",
    ctas: ["view-projects"],
    intent: "project",
  },
  {
    id: "experience",
    patterns: ["his experience", "work experience", "career history", "career", "experience summary"],
    answer:
      "- **Lead Full-Stack Developer** at NexVision Innovations Inc. (Jan 2026 – Jul 2026)\n- **Freelance Web Developer** for 3+ years (Nov 2023 – Jan 2026)\n- **Freelance Sales Support** for 2 years (Jan 2023 – Dec 2024)\n- **SPES Clerk** at the Department of Education – Central Division (May – Aug 2024)\n\nHe also works with Zentari & Optrizo as a freelance full-stack developer.",
    ctas: ["view-resume"],
    intent: "experience",
  },
  {
    id: "freelance",
    patterns: ["freelance", "freelancer", "does he freelance", "do you freelance"],
    answer:
      "Yes. He has 3+ years of freelance experience (Nov 2023 – Jan 2026) for local and international clients, with a documented 95%+ satisfaction rate. The portfolio footer shows **Available for freelance, 8:00 AM – 11:00 PM**.",
    ctas: ["start-project", "contact-email"],
    intent: "freelance",
  },
  {
    id: "education",
    patterns: ["education", "school", "university", "college", "degree", "cum laude"],
    answer:
      "Bachelor of Science in Information Technology (B.S. IT) at Pamantasan ng Lungsod ng Pasig (University of Pasig City), **Cum Laude**, **GWA 1.48** (Aug 2022 – Jun 2026). Coursework: Web/App Development, Databases, Networking, Cybersecurity, Systems Administration.",
    ctas: ["view-resume"],
    intent: "education",
  },
  {
    id: "leadership",
    patterns: ["leadership", "team lead", "lead developer", "did he lead", "managed developers", "manage a team"],
    answer:
      "Yes. He was **Lead Full-Stack Developer at NexVision Innovations Inc.**, managing a team of 6+ members across 50+ features, with task delegation, frontend + backend architecture, and stakeholder communication.",
    ctas: ["view-resume"],
    intent: "experience",
  },
  {
    id: "contact",
    patterns: [
      "how to contact", "how can i contact", "how do i contact",
      "contact info", "contact information", "contact details",
      "how to reach", "how can i reach", "reach him", "reach mav",
      "reach maverick", "how to message",
    ],
    answer:
      "Multiple ways:\n\n- **Email:** maverickdanielle@gmail.com\n- **WhatsApp:** +63 963 296 8188 (wa.me/639632968188)\n- **Messenger:** m.me/maverickdanielle.andres\n- **Contact form:** at the bottom of the portfolio\n\nHe usually responds within 24 hours.",
    ctas: ["contact-email", "contact-whatsapp", "contact-phone", "contact-messenger", "contact-form"],
    intent: "contact",
  },
  {
    id: "hire-yes",
    patterns: ["can i hire", "can i work with", "can we work together", "work with you", "work with him", "work together"],
    answer:
      "Yes. Use the **Start a Project** flow at the top of the portfolio, or reach him via email, WhatsApp, or Messenger. He accepts freelance, contract, team-join, and full-time engagements.",
    ctas: ["start-project", "contact-email", "contact-whatsapp"],
    intent: "hire",
  },
  {
    id: "services",
    patterns: ["what services", "services offered", "what can you do for", "what can he do for"],
    answer:
      "Web apps, mobile apps, e-commerce / marketplace platforms, multi-tenant SaaS, HR / payroll systems (Philippine-compliant), AI-integrated apps, marketing / landing pages, WordPress / Shopify sites, internal tools / dashboards, and Figma design.",
    ctas: ["start-project", "view-projects"],
    intent: "skills",
  },
  {
    id: "ai",
    patterns: ["ai projects", "ai experience", "ai work", "ai integration", "does he work with ai", "does he use ai", "llm projects"],
    answer:
      "Yes — AI integration is a core strength.\n\n- **M-Chat** — full multi-modal Gemini chat (auth, billing, admin, RLS, gemini-proxy Edge Function)\n- **BazaarX** — AI scanner chatbot + visual search + LLM shopping assistant\n- **JJZ TECH** — Gemini-powered repair chatbot\n- **SuperFit** — AI nutrition scan\n- **LMS** — AI review generation + chatbots + predictive analytics (1,000+ users)",
    ctas: ["view-projects"],
    intent: "ai",
  },
  {
    id: "resume",
    patterns: ["resume", "cv", "where can i see your resume", "download resume", "show me your cv"],
    answer:
      "The resume is downloadable from the Hero and About sections of the portfolio (`public/Files/Resume.pdf`).",
    ctas: ["view-resume"],
    intent: "resume",
  },
  {
    id: "github",
    patterns: ["github", "where is his github", "open source"],
    answer:
      "GitHub: https://github.com/MaverickDanielleAndres",
    ctas: ["view-github"],
    intent: "social",
  },
  {
    id: "linkedin",
    patterns: ["linkedin"],
    answer:
      "LinkedIn: https://linkedin.com/in/maverick-danielle-andres-641564373",
    ctas: ["view-linkedin"],
    intent: "social",
  },
  {
    id: "location",
    patterns: ["where is he based", "where are you based", "location", "where is mav", "where is maverick"],
    answer:
      "Pasig City, Philippines. He works remotely with clients locally and internationally.",
    ctas: [],
    intent: "contact",
  },
  {
    id: "beauty-connect",
    patterns: ["beauty connect", "tell me about beauty", "what is beauty connect"],
    answer:
      "**Beauty Connect** is a professional beauty services / booking platform. Built with Next.js, Tailwind CSS, and Supabase. Features service booking, a provider portal, real-time chat, and payments. Live at https://www.beautyconnect.us/.",
    ctas: ["view-projects"],
    intent: "project",
  },
  {
    id: "bazaarx",
    patterns: ["bazaarx", "bazaar x", "tell me about bazaar"],
    answer:
      "**BazaarX** is an enterprise multi-tenant e-commerce marketplace with Buyer, Seller, Admin, and QA roles. Built with Next.js, React Native, Expo, Supabase, and PayMongo. Features an AI Scanner chatbot, visual search, multi-role auth, Escrow, and flash sales. Live at https://bazaarx-liart.vercel.app/.",
    ctas: ["view-projects"],
    intent: "project",
  },
  {
    id: "hrms",
    patterns: ["hrms", "hr management", "tell me about hrms"],
    answer:
      "**HR Management System (HRMS)** — full-featured HRMS with face recognition check-in, GPS geofencing, loan management, and Philippine TRAIN Law statutory payroll. Built solo with Next.js 16, React 19, Zustand, face-api.js, and Leaflet. Live at https://hrms-web-system.vercel.app/login.",
    ctas: ["view-projects"],
    intent: "project",
  },
  {
    id: "m-chat",
    patterns: ["m-chat", "m chat", "tell me about m-chat", "what about m-chat"],
    answer:
      "**M-Chat** is a premium multi-tenant, multi-modal AI chat application that competes with ChatGPT and Claude on responsiveness and ergonomics. One composer handles text, code, documents, images, voice, and web search — all grounded through Google Gemini. Built with Vite, React 19, TypeScript, shadcn/ui, Zustand, Supabase, and rAF-batched streaming. Live at https://m-chat-9cmp.vercel.app/.",
    ctas: ["view-projects"],
    intent: "project",
  },
  {
    id: "logistics",
    patterns: ["logistics system", "tell me about logistics"],
    answer:
      "**Logistics System** is an enterprise cloud logistics operating system supporting 20 specialized multi-tenant roles — fleet dispatch, hub sorting, last-mile distribution, workforce payroll, financial settlement, and an AI Operations Copilot. Built with Next.js 16, React 19, Supabase, PostgreSQL, Leaflet, Framer Motion, and Recharts. Live at https://logistics-system-two.vercel.app/.",
    ctas: ["view-projects"],
    intent: "project",
  },
  {
    id: "jjz",
    patterns: ["jjz tech", "jjz", "tell me about jjz"],
    answer:
      "**JJZ TECH** is a high-performance landing page for an electronics / gadget repair shop in Binangonan, Rizal. Built with Next.js 16, React 19, Framer Motion, GSAP, React Leaflet, and a Google Generative AI repair chatbot. Optimized for local SEO with LocalBusiness schema. Live at https://jjz-repair.vercel.app/.",
    ctas: ["view-projects"],
    intent: "project",
  },
  {
    id: "superfit",
    patterns: ["superfit", "super fit", "tell me about superfit"],
    answer:
      "**SuperFit Webapp** is a fitness platform with three portals (User, Coach, Admin) — workouts, nutrition, hydration, goal tracking, AI nutrition scan, coach-client management, and a community feed. Built solo with Next.js 16, React 19, Zustand, Supabase, and Recharts. 80+ REST API route handlers and 14 domain stores. Live at https://superfit-web-app.vercel.app/.",
    ctas: ["view-projects"],
    intent: "project",
  },
  {
    id: "pricing",
    patterns: ["how much", "what's the price", "what's your rate", "your rate", "pricing", "cost"],
    answer:
      "Maverick scopes projects by **intent** (Build / Improve / Hire / Fix-add / SEO-perf / Not-sure), **budget** (Under ₱25K to ₱100K+), and **timeline** (ASAP to Flexible). The project inquiry flow captures the details — start a project and he'll respond with a quote.",
    ctas: ["start-project", "contact-email"],
    intent: "pricing",
  },
  {
    id: "design",
    patterns: ["does he design", "design work", "figma"],
    answer:
      "Yes. He runs **UI/UX Design** as a listed skill and designs wireframes, hi-fi mockups, and component libraries in Figma. He has a Udemy **Figma Essential for UI/UX** certification.",
    ctas: ["view-projects"],
    intent: "design",
  },
  {
    id: "different",
    patterns: ["what makes him different", "why hire him", "what sets him apart"],
    answer:
      "His **breadth** (frontend → backend → mobile → AI → design), **team-lead experience** at NexVision, his **track record** of shipping complete systems solo, and his habit of **designing before building** (Figma-first workflows). Plus a documented 95%+ client satisfaction rate across 3+ years of freelance work.",
    ctas: ["view-resume", "contact-email"],
    intent: "hire",
  },
];

/* ── Off-topic guard ───────────────────────────────────────────────── */

/**
 * Words that almost always indicate a request that has nothing to do with
 * Maverick or his portfolio. If the visitor's message contains one of these
 * AND none of the Mav-related keywords, we redirect without calling Gemini.
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

/* ── Helpers ───────────────────────────────────────────────────────── */

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
 * Tokenize on word boundaries and drop stopwords + short tokens. Tokens
 * are the substrate for word-boundary matching.
 */
function tokensOf(text: string): string[] {
  return normalize(text)
    .split(" ")
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));
}

/**
 * Word-boundary check. Splits `haystack` into tokens and tests whether
 * any token exactly equals `needle`. This is what keeps "he" from matching
 * "the" and "ai" from matching "today".
 */
function hasWord(normalized: string, needle: string): boolean {
  if (!needle) return false;
  const n = needle.toLowerCase();
  // Multi-word needles: check as a substring on space-padded text.
  if (n.includes(" ")) {
    return (
      normalized.includes(" " + n + " ") ||
      normalized.startsWith(n + " ") ||
      normalized.endsWith(" " + n) ||
      normalized === n
    );
  }
  const tokens = normalized.split(" ");
  return tokens.includes(n);
}

function anyHasWord(normalized: string, needles: string[]): boolean {
  for (const n of needles) {
    if (hasWord(normalized, n)) return true;
  }
  return false;
}

/**
 * Score a normalized question against a single FAQ entry's patterns. Higher
 * = better. We score on (a) how many patterns matched, (b) how short the
 * matching pattern is relative to the question (closer length = better),
 * and (c) word-boundary keyword overlap with the entry's intent.
 */
function scoreEntry(
  normalized: string,
  tokens: Set<string>,
  entry: (typeof FAQ)[number],
): number {
  let hits = 0;
  for (const pattern of entry.patterns) {
    if (normalized.includes(pattern)) {
      hits += 1;
      // Bonus when the pattern is long relative to the question — strong
      // evidence the question really is asking this.
      const lengthRatio = pattern.length / Math.max(normalized.length, 1);
      if (lengthRatio > 0.5) hits += 1;
    }
  }
  if (hits === 0) return 0;
  const intentKeywords = KEYWORDS[entry.intent] ?? [];
  let overlap = 0;
  for (const k of intentKeywords) {
    if (hasWord(normalized, k)) overlap += 1;
    else if (tokens.has(k)) overlap += 1;
  }
  return hits * 3 + overlap;
}

/* ── Public API ────────────────────────────────────────────────────── */

/**
 * Try to match `question` against the canonical FAQ bank. Returns a
 * FaqMatch if there's a confident match (score >= 3), otherwise null.
 */
export function matchFaq(question: string): FaqMatch | null {
  const normalized = normalize(question);
  if (!normalized) return null;
  const tokens = new Set(tokensOf(normalized));

  let best: { entry: (typeof FAQ)[number]; score: number } | null = null;
  for (const entry of FAQ) {
    const score = scoreEntry(normalized, tokens, entry);
    if (score > 0 && (!best || score > best.score)) {
      best = { entry, score };
    }
  }
  if (!best || best.score < 3) return null;
  return {
    id: best.entry.id,
    answer: best.entry.answer,
    ctas: best.entry.ctas,
    intent: best.entry.intent,
  };
}

/**
 * Detect the visitor's primary intent from a question. Used by the UI to
 * pick CTAs even when the question doesn't match a canonical FAQ.
 */
export function detectIntent(question: string): Intent {
  const tokens = new Set(tokensOf(normalize(question)));
  if (tokens.size === 0) return "unknown";
  let best: { intent: Intent; hits: number } | null = null;
  for (const [intent, words] of Object.entries(KEYWORDS)) {
    let hits = 0;
    for (const w of words) {
      const wn = w.replace(/\s+/g, " ");
      if (tokens.has(wn) || hasWord(normalize(question), wn)) hits += 1;
    }
    if (hits > 0 && (!best || hits > best.hits)) {
      best = { intent: intent as Intent, hits };
    }
  }
  return best?.intent ?? "unknown";
}

/**
 * Quickly check whether `question` is so clearly off-topic that we should
 * refuse it before paying for a Gemini call. Conservative — when in doubt
 * we let the server-side guard make the final call.
 */
export function isClearlyOffTopic(question: string): boolean {
  const normalized = normalize(question);
  if (!normalized) return false;
  if (anyHasWord(normalized, OFF_TOPIC_TRIGGERS)) {
    return !hasMavSignal(normalized);
  }
  return false;
}

/** Cheap proxy for "this question is plausibly about Mav". */
function hasMavSignal(normalized: string): boolean {
  if (
    hasWord(normalized, "mav") ||
    hasWord(normalized, "maverick") ||
    hasWord(normalized, "portfolio")
  ) {
    return true;
  }
  for (const words of Object.values(KEYWORDS)) {
    for (const w of words) {
      if (hasWord(normalized, w.replace(/\s+/g, " "))) return true;
    }
  }
  return false;
}

/**
 * Standard redirect message when the visitor asks something the chatbot
 * can't or won't answer. Kept short and on-brand.
 */
export const OFF_TOPIC_REPLY =
  "I'm here to help you learn more about Maverick — his experience, projects, skills, and how to get in touch with him. Try asking something about his work.";

/**
 * Suggested next-question chips the chatbot can show after answering.
 * Kept short so they don't compete with the answer itself.
 */
export const SUGGESTED_FOLLOWUPS: Record<Intent, string[]> = {
  hire: ["What services does he offer?", "Can I see his resume?", "How do I start a project?"],
  contact: ["What email?", "WhatsApp number?", "What's his location?"],
  project: ["What was his role?", "Which uses Next.js?", "Which uses AI?"],
  ai: ["Tell me about M-Chat.", "Does he use Gemini?", "Which project uses RAG?"],
  skills: ["What backend?", "What frontend?", "What database?"],
  experience: ["What did he do at NexVision?", "How long freelancing?", "Where did he study?"],
  education: ["Cum Laude?", "Where did he study?", "What's his GWA?"],
  freelance: ["Does he freelance?", "What's his client rate?", "Can I hire him?"],
  frontend: ["What UI stack?", "Tailwind?", "Does he design?"],
  backend: ["What about Node?", "REST APIs?", "Supabase?"],
  database: ["Postgres?", "Supabase?", "RLS?"],
  mobile: ["React Native?", "Expo?", "iOS or Android?"],
  design: ["Figma?", "UI/UX?", "Component library?"],
  pricing: ["Budget range?", "Hourly or fixed?", "Timeline?"],
  availability: ["Is he available?", "Freelance?", "Full-time?"],
  resume: ["Download resume?", "Where?", "PDF?"],
  social: ["GitHub?", "LinkedIn?", "Instagram?"],
  unrelated: ["Tell me about Maverick.", "What does he build?", "What are his projects?"],
  unknown: ["Tell me about Maverick.", "What does he build?", "What are his projects?"],
};