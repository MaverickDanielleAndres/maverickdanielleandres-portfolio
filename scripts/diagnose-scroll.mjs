// Comprehensive scroll diagnostic — measures frame timing at every position
// on the page and identifies which sections cause the most jank.
import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
  });
  const page = await context.newPage();

  console.log('Loading page...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Measure scroll performance at each section
  const sectionResults = await page.evaluate(async () => {
    const sections = ['hero', 'projects', 'about', 'skills', 'activity', 'certificates', 'contact'];
    const results = {};

    for (const id of sections) {
      const el = document.getElementById(id);
      if (!el) continue;

      // Scroll the section into view
      el.scrollIntoView({ block: 'start', behavior: 'instant' });
      // Wait for any layout/paint to settle
      await new Promise((r) => setTimeout(r, 500));

      // Now measure scroll smoothness for 1 second
      const frames = [];
      let stop = false;
      let lastT = performance.now();

      function tick() {
        const now = performance.now();
        frames.push(now - lastT);
        lastT = now;
        if (!stop) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);

      // Simulate a slow scroll over 1s
      const distance = 600;
      const steps = 60;
      for (let i = 0; i <= steps; i++) {
        window.scrollBy(0, distance / steps);
        await new Promise((r) => setTimeout(r, 16));
      }

      stop = true;
      await new Promise((r) => requestAnimationFrame(r));

      const samples = frames.slice(1);
      const total = samples.reduce((a, b) => a + b, 0);
      const avgMs = total / samples.length;
      const maxMs = Math.max(...samples);
      const minMs = Math.min(...samples);
      const jank = samples.filter((s) => s > 33).length;

      results[id] = {
        frameCount: samples.length,
        avgMs: avgMs,
        avgFps: 1000 / avgMs,
        maxMs: maxMs,
        minMs: minMs,
        jankyFrames: jank,
        jankyPct: (jank / samples.length) * 100,
      };
    }

    return results;
  });

  console.log('\n=== Scroll smoothness by section (smooth scroll @ ~60Hz) ===');
  console.log('Section       | Avg(ms) | FPS  | Max(ms) | Janky %');
  console.log('--------------|---------|------|---------|--------');
  for (const [id, r] of Object.entries(sectionResults)) {
    console.log(
      `${id.padEnd(13)} | ${r.avgMs.toFixed(1).padStart(7)} | ${r.avgFps.toFixed(1).padStart(4)} | ${r.maxMs.toFixed(1).padStart(7)} | ${r.jankyPct.toFixed(1).padStart(6)}%`
    );
  }

  // ── Test: disable Lenis and re-measure ───────────────────────────────
  console.log('\n=== Test: disabling Lenis smooth scroll ===');
  await page.evaluate(() => {
    // Lenis adds a `lenis` data attribute and has its own rAF — try to disable
    const html = document.documentElement;
    const body = document.body;
    // Force native scroll by removing any potential overflow manipulation
    body.style.scrollBehavior = 'auto';
    html.style.scrollBehavior = 'auto';
  });

  const afterDisable = await page.evaluate(async () => {
    const sections = ['projects', 'certificates'];
    const results = {};
    for (const id of sections) {
      const el = document.getElementById(id);
      if (!el) continue;
      el.scrollIntoView({ block: 'start', behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 500));

      const frames = [];
      let stop = false;
      let lastT = performance.now();

      function tick() {
        const now = performance.now();
        frames.push(now - lastT);
        lastT = now;
        if (!stop) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);

      const distance = 600;
      const steps = 60;
      for (let i = 0; i <= steps; i++) {
        window.scrollBy(0, distance / steps);
        await new Promise((r) => setTimeout(r, 16));
      }
      stop = true;
      await new Promise((r) => requestAnimationFrame(r));

      const samples = frames.slice(1);
      const total = samples.reduce((a, b) => a + b, 0);
      results[id] = {
        avgMs: total / samples.length,
        avgFps: 1000 / (total / samples.length),
        jankyPct: (samples.filter((s) => s > 33).length / samples.length) * 100,
      };
    }
    return results;
  });

  for (const [id, r] of Object.entries(afterDisable)) {
    console.log(`${id.padEnd(13)} | ${r.avgMs.toFixed(1)}ms | ${r.avgFps.toFixed(1)} fps | ${r.jankyPct.toFixed(1)}% jank`);
  }

  await browser.close();
})().catch((e) => {
  console.error('FAILED:', e);
  process.exit(1);
});