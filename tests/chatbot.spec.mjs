/**
 * E2E tests for the portfolio chatbot. Run with:
 *
 *   npx playwright install chromium   # one-time
 *   npm run dev                        # in one shell
 *   node tests/chatbot.spec.mjs       # in another
 *
 * Or set E2E_BASE_URL to point at a deployed preview:
 *
 *   E2E_BASE_URL=https://mavs.is-a.dev node tests/chatbot.spec.mjs
 */

import { chromium } from "playwright";

const BASE_URL = process.env.E2E_BASE_URL || "http://localhost:3000";
const HEADLESS = process.env.E2E_HEADED !== "1";

let pass = 0,
  fail = 0;

function check(name, condition, detail) {
  const ok = !!condition;
  console.log(
    (ok ? "\x1b[32m✓\x1b[0m" : "\x1b[31m✗\x1b[0m") +
      " " +
      name +
      (detail && !ok ? ` — ${detail}` : ""),
  );
  ok ? pass++ : fail++;
}

async function openChat(page) {
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  const btn = page.getByRole("button", { name: /Open Mavs AI/i });
  await btn.waitFor({ state: "visible", timeout: 15000 });
  await btn.click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor();
  return dialog;
}

async function run() {
  const browser = await chromium.launch({ headless: HEADLESS, args: ["--no-sandbox"] });

  // ── Desktop: chat opens, FAQ renders bold, off-topic short-circuits ─
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    const apiHits = [];
    page.on("response", (res) => {
      if (res.url().includes("/api/portfolio-chat")) {
        apiHits.push({ url: res.url(), status: res.status(), ts: Date.now() });
      }
    });
    page.on("request", (req) => {
      if (req.url().includes("/api/portfolio-chat")) {
        apiHits.push({ url: req.url(), kind: "request", ts: Date.now() });
      }
    });

    const dialog = await openChat(page);
    check("chat dialog opens", await dialog.isVisible());

    // Welcome message — **Mavs AI** must render as <strong>.
    const welcome = await dialog
      .locator('[aria-live="polite"] >> text=portfolio assistant')
      .first()
      .innerHTML()
      .catch(() => "");
    check(
      "welcome message renders **bold** → <strong>",
      /<strong>Mavs AI<\/strong>/i.test(welcome),
      welcome.includes("**")
        ? `raw ** leaked: ${welcome.slice(0, 120)}`
        : "",
    );

    // FAQ fast-path: "Who is Maverick?" → instant reply with bold.
    const apiHitsBeforeFaq = apiHits.length;
    await dialog
      .getByLabel(/Ask a question/i)
      .fill("Who is Maverick?");
    await dialog.getByLabel(/Ask a question/i).press("Enter");
    await page.waitForTimeout(500);

    const faqHtml = await dialog.locator('[aria-live="polite"]').last().innerHTML();
    check("FAQ answer contains <strong>", /<strong>/i.test(faqHtml));
    check("FAQ answer has no raw **", !faqHtml.includes("**"));
    check(
      "FAQ fast-path did NOT hit /api/portfolio-chat",
      apiHits.length === apiHitsBeforeFaq,
    );

    // CTA chips
    const ctaCount = await dialog
      .locator('[aria-live="polite"] a[href], [aria-live="polite"] button')
      .count();
    check("FAQ reply surfaces CTAs", ctaCount >= 2, `ctaCount=${ctaCount}`);

    // ── Off-topic question: no API call, polite redirect ───────────
    const apiHitsBeforeOffTopic = apiHits.length;
    await dialog
      .getByLabel(/Ask a question/i)
      .fill("What's the weather in Tokyo right now?");
    await dialog.getByLabel(/Ask a question/i).press("Enter");
    await page.waitForTimeout(700);

    const offTopicCalls = apiHits.length - apiHitsBeforeOffTopic;
    check(
      "off-topic short-circuits before hitting the API",
      offTopicCalls === 0,
      `calls=${offTopicCalls}`,
    );
    const offText = await dialog.locator('[aria-live="polite"]').last().innerText();
    check(
      "off-topic reply redirects politely",
      /about Maverick|portfolio/i.test(offText),
    );

    // ── Dynamic question: streaming response from Gemini ───────────
    const apiHitsBeforeDynamic = apiHits.length;
    await dialog
      .getByLabel(/Ask a question/i)
      .fill(
        "What was the most challenging technical problem you solved?",
      );
    await dialog.getByLabel(/Ask a question/i).press("Enter");
    // Wait up to 25 s for streaming + auto-discovery fallback.
    await page.waitForTimeout(25000);

    const dynamic = dialog.locator('[aria-live="polite"]').last();
    const dynamicText = await dynamic.innerText();
    const dynamicHtml = await dynamic.innerHTML();
    check(
      "dynamic reply did NOT leak raw markdown **",
      !dynamicHtml.includes("**") && !dynamicText.includes("**"),
    );
    const dynamicCalls = apiHits.length - apiHitsBeforeDynamic;
    check(
      "dynamic reply hit the streaming endpoint",
      dynamicCalls > 0,
      `calls=${dynamicCalls} (events: ${JSON.stringify(apiHits.slice(apiHitsBeforeDynamic))})`,
    );
    check(
      "dynamic reply contains either markdown or graceful error",
      dynamicText.length > 0,
    );

    // ── Reset button ──────────────────────────────────────────────
    await dialog.getByRole("button", { name: /Reset conversation/i }).click();
    await page.waitForTimeout(400);
    const visibleBubbles = await dialog
      .locator('[aria-live="polite"] > div')
      .count();
    check(
      "reset leaves only the welcome bubble",
      visibleBubbles <= 2,
      `bubbles=${visibleBubbles}`,
    );

    await ctx.close();
  }

  // ── Mobile: visualViewport, safe-area, no edge bleed ─────────────
  {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
    });
    const page = await ctx.newPage();
    const dialog = await openChat(page);

    const box = await dialog.boundingBox();
    check("mobile chat visible", !!box);
    check(
      "mobile chat has inset from left edge (≥12px)",
      box && box.x >= 12,
      `x=${box?.x}`,
    );
    check(
      "mobile chat has inset from right edge (≥12px)",
      box && 390 - (box.x + box.width) >= 12,
      `right=${box ? 390 - (box.x + box.width) : "n/a"}`,
    );
    check(
      "mobile chat has inset from bottom edge (≥12px)",
      box && 844 - (box.y + box.height) >= 12,
      `bottom=${box ? 844 - (box.y + box.height) : "n/a"}`,
    );

    // Screenshot for visual review.
    await page.screenshot({ path: "tests/mobile-chat.png" });

    await ctx.close();
  }

  await browser.close();
  console.log(`\n${pass} pass, ${fail} fail`);
  process.exit(fail === 0 ? 0 : 1);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});