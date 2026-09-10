# Portfolio Chat Module

Self-contained portfolio chatbot. Dynamic, secure, fast.

## Files

| File | Role |
|---|---|
| `portfolio-chat.tsx` | Main UI component (mobile + desktop layout, streaming, persistence). |
| `chat-utils.ts` | Shared types + localStorage persistence. |
| `chat-faq.ts` | Canonical FAQ bank + intent detection + topic guard (client-side). |
| `chat-markdown.tsx` | Tiny, sanitized Markdown renderer (no dependencies). |
| `chat-cta.tsx` | Intent-aware CTA chips rendered inside assistant bubbles. |

## Server-side companion

| File | Role |
|---|---|
| `app/api/portfolio-chat/route.ts` | Streaming Gemini proxy: rate-limit + origin-check + topic-guard + prompt-injection defence. |
| `lib/ai/gemini.ts` | Gemini SDK wrapper. Reads `GEMINI_API_KEY`, `GEMINI_MODEL`, `GEMINI_FALLBACK_MODEL`. Streams with 20s first-byte timeout → fallback. |
| `lib/chat/rate-limit.ts` | Sliding-window rate limiter (10 req/min, 80 req/hour per IP, LRU-capped). |
| `lib/chat/topic-classifier.ts` | Server-side off-topic guard (the second line of defence). |
| `lib/chat/prompt-builder.ts` | Wraps visitor messages in injection-safe delimiters. |
| `lib/security/origin-check.ts` | Same-origin POST enforcement. |
| `knowledge/portfolio-knowledge.md` | Runtime knowledge base (loaded into Gemini as system context). |

## How a request flows

```
User types → 
  client FAQ matcher (chat-faq.ts) — instant if matched, else
  client topic guard (isClearlyOffTopic) — instant redirect if off-topic, else
  POST /api/portfolio-chat —
    origin check
    rate limit (per IP, sliding window)
    server topic guard (topic-classifier.ts) — second off-topic check
    Gemini streaming with first-byte timeout → fallback model
  client reads text/event-stream chunks →
  Markdown renderer (chat-markdown.tsx) + CTA chips (chat-cta.tsx)
```

## Environment variables

See `.env.example`.

```
GEMINI_API_KEY=…                # server only
GEMINI_MODEL=gemini-3.5-flash-lite
GEMINI_FALLBACK_MODEL=gemini-2.5-flash
```

## Behaviour rules

1. **Source of truth:** the chatbot only answers using `sourceinfo.md` /
   `knowledge/portfolio-knowledge.md`. Never invent facts.
2. **Restricted domain:** off-topic questions (weather, recipes, jokes,
   general homework, …) get a polite redirect — no Gemini call is made
   when the classifier is confident.
3. **CTA hygiene:** only relevant CTAs surface after each reply. Hiring
   questions surface "Start a Project"; contact-info questions surface
   email / WhatsApp / phone / messenger; project questions surface
   "View Projects"; etc.
4. **Persistence:** conversation history is stored only in localStorage
   (key: `mavsai:conversation`). No server-side persistence. Clearing
   the chat (or refreshing the page after `clearPersistedConversation`)
   resets the welcome state.
5. **Markdown:** `**bold**`, `*italic*`, `` `code` ``, lists, and
   `[label](url)` render correctly. Triple-asterisk / em-dash separator
   lines become thin `<hr>` dividers instead of leaking raw characters.

## Performance notes

- The chatbot is dynamically imported with `ssr: false`, so the bundle
  doesn't ship on first paint.
- framer-motion is shared with the page via `LazyMotion` at the root.
- FAQ matches short-circuit the network call (instant response, zero
  Gemini spend).
- Markdown rendering is dependency-free (no marked / react-markdown).
- localStorage writes are debounced (250 ms) to avoid hot loops.
- VisualViewport API is used on mobile so the chat height follows the
  visible viewport when the keyboard opens.

## Security notes

- Visitor messages are wrapped in `<<<VISITOR_MESSAGE_START>>> … END>>>`
  delimiters before being sent to Gemini, and the system prompt
  instructs the model to treat anything inside as data, not instructions.
- All Gemini responses are rendered through the sanitized Markdown
  renderer. URLs are restricted to `http(s)`, `mailto:`, `tel:` —
  `javascript:` and `data:` URLs are stripped.
- API key never leaves the server.
- Origin header is enforced (defeats cross-origin POSTs without CORS).
- Rate limiter caps per-IP requests and is LRU-bounded so memory is
  protected from IP floods.