// Direct FPS measurement via PerformanceObserver + requestAnimationFrame.
// Measures actual frame rate during scroll — the metric that matters.
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
  await page.waitForTimeout(2000);

  // Helper: install an FPS meter in the page, scroll, return measurement
  const measureScroll = async (label, scrollFn) => {
    const result = await page.evaluate(async (scrollFnSrc) => {
      // eslint-disable-next-line no-new-func
      const scrollImpl = new Function('return ' + scrollFnSrc)();
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

      await scrollImpl();

      // Let one more frame land
      await new Promise((r) => requestAnimationFrame(r));
      stop = true;

      // Skip the first frame (cold start of the meter)
      const samples = frames.slice(1);
      if (samples.length === 0) return null;
      const total = samples.reduce((a, b) => a + b, 0);
      const avgMs = total / samples.length;
      const fps = 1000 / avgMs;
      const jankThreshold = 1000 / 30; // >33ms = janky (<30fps)
      const janky = samples.filter((s) => s > jankThreshold).length;
      const maxFrame = Math.max(...samples);
      return {
        frameCount: samples.length,
        avgFrameMs: avgMs,
        avgFps: fps,
        jankyFrames: janky,
        jankyPct: (janky / samples.length) * 100,
        maxFrameMs: maxFrame,
        minFrameMs: Math.min(...samples),
      };
    }, scrollFn.toString());

    console.log(`\n${label}:`);
    if (!result) {
      console.log('  No frames captured');
      return;
    }
    console.log(`  ${result.frameCount} frames captured`);
    console.log(`  Avg frame: ${result.avgFrameMs.toFixed(1)}ms (${result.avgFps.toFixed(1)} fps)`);
    console.log(`  Min: ${result.minFrameMs.toFixed(1)}ms / Max: ${result.maxFrameMs.toFixed(1)}ms`);
    console.log(`  Janky frames (>33ms): ${result.jankyFrames} (${result.jankyPct.toFixed(1)}%)`);
  };

  // Scroll through Projects section (the slowest area)
  await measureScroll(
    '=== Test 1: Smooth scroll past projects (5vh × 60 steps) ===',
    async () => {
      const distance = window.innerHeight * 5;
      const steps = 60;
      for (let i = 0; i <= steps; i++) {
        window.scrollTo(0, (distance * i) / steps);
        await new Promise((r) => setTimeout(r, 16));
      }
    }
  );

  // Wait between tests
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);

  // Test 2: scroll back up through the same area
  await measureScroll(
    '=== Test 2: Reverse scroll (projects → hero) ===',
    async () => {
      const distance = window.innerHeight * 5;
      const steps = 60;
      for (let i = steps; i >= 0; i--) {
        window.scrollTo(0, (distance * i) / steps);
        await new Promise((r) => setTimeout(r, 16));
      }
    }
  );

  // Test 3: rapid wheel events at the projects section (worst case)
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.evaluate(() => {
    document.querySelector('#projects')?.scrollIntoView({ block: 'center' });
  });
  await page.waitForTimeout(500);

  await page.mouse.move(640, 400);
  await measureScroll(
    '=== Test 3: Rapid wheel events at projects section ===',
    async () => {
      // Scroll via wheel events at 16ms intervals (60Hz wheel)
      for (let i = 0; i < 30; i++) {
        window.scrollBy(0, 100);
        await new Promise((r) => setTimeout(r, 16));
      }
    }
  );

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