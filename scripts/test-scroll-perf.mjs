// Scroll performance test: measure scroll smoothness when scrolling past
// the projects + certificates sections. Uses Playwright's performance
// metrics + Chrome DevTools Protocol to track frame rate during scroll.
import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
  });
  const page = await context.newPage();

  const errors = [];
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`console: ${msg.text()}`);
  });

  console.log('Loading page...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 30000 });
  // Wait for all lazy-loaded sections to mount
  await page.waitForTimeout(2000);

  // Start Chrome DevTools Protocol session for performance metrics
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Performance.enable');

  // ── Test 1: smooth scroll from hero through projects ────────────────
  console.log('\n=== Test 1: Hero → Projects (full scroll) ===');

  const scrollStart = Date.now();
  // Smooth scroll through 5 viewport heights
  await page.evaluate(async () => {
    const distance = window.innerHeight * 5;
    const steps = 60;
    const stepDelay = 16; // ~60fps target
    for (let i = 0; i <= steps; i++) {
      window.scrollTo(0, (distance * i) / steps);
      await new Promise((r) => setTimeout(r, stepDelay));
    }
  });
  const scrollTimeMs = Date.now() - scrollStart;
  console.log(`Scroll completed in ${scrollTimeMs}ms (target: 60fps over ~1s)`);

  // Capture metrics — some names are version-specific; fall back to 0
  const getMetric = (metrics, name) => metrics.find((m) => m.name === name)?.value ?? 0;
  const reportMetrics = (label) => (metrics) => {
    const frames = getMetric(metrics, 'Frames');
    const janky = getMetric(metrics, 'JankyFrame');
    const layout = getMetric(metrics, 'LayoutDuration');
    const recalc = getMetric(metrics, 'RecalcStyleDuration');
    console.log(`${label}:`);
    console.log(`  Frames: ${frames}`);
    console.log(`  Janky: ${janky} (${frames ? ((janky / frames) * 100).toFixed(1) : 0}%)`);
    console.log(`  Layout time: ${layout.toFixed(3)}s`);
    console.log(`  Style-recalc time: ${recalc.toFixed(3)}s`);
  };

  const m1 = await cdp.send('Performance.getMetrics');
  reportMetrics('After Test 1')(m1.metrics);

  // Pause 1 second for things to settle
  await page.waitForTimeout(1000);

  // ── Test 2: scroll back from projects to hero ───────────────────────
  console.log('\n=== Test 2: Projects → Hero (reverse scroll) ===');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  const scrollStart2 = Date.now();
  await page.evaluate(async () => {
    const distance = window.innerHeight * 5;
    const steps = 60;
    const stepDelay = 16;
    for (let i = steps; i >= 0; i--) {
      window.scrollTo(0, (distance * i) / steps);
      await new Promise((r) => setTimeout(r, stepDelay));
    }
  });
  const scrollTime2Ms = Date.now() - scrollStart2;
  console.log(`Scroll completed in ${scrollTime2Ms}ms`);

  const m2 = await cdp.send('Performance.getMetrics');
  reportMetrics('After Test 2')(m2.metrics);

  // ── Test 3: rapid wheel events (the worst case) ────────────────────
  console.log('\n=== Test 3: Rapid wheel events (simulates fast scroll) ===');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  // Find a position in the middle of the page
  await page.evaluate(() => {
    const projects = document.querySelector('#projects');
    if (projects) projects.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(500);

  // Fire 30 wheel events rapidly
  const rapidStart = Date.now();
  await page.mouse.move(640, 400);
  for (let i = 0; i < 30; i++) {
    await page.mouse.wheel(0, 100);
    await page.waitForTimeout(16);
  }
  const rapidTime = Date.now() - rapidStart;
  console.log(`30 wheel events in ${rapidTime}ms`);

  const m3 = await cdp.send('Performance.getMetrics');
  reportMetrics('After Test 3')(m3.metrics);

  if (errors.length > 0) {
    console.log('\nErrors:');
    errors.forEach((e) => console.log(`  - ${e}`));
    process.exit(1);
  } else {
    console.log('\n✅ No runtime errors.');
  }

  await browser.close();
})().catch((e) => {
  console.error('FAILED:', e);
  process.exit(1);
});