// Verify my fixes are actually being served by the dev server
import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    bypassCSP: true,
  });
  const page = await context.newPage();

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Check 1: is Lenis still being used?
  const checks = await page.evaluate(() => {
    const results = {};

    // Check if Lenis is initialized
    results.hasLenis = typeof window.lenis !== 'undefined';

    // Check if projects-marquee-track has CSS animation
    const track = document.querySelector('.projects-marquee-track');
    if (track) {
      const styles = getComputedStyle(track);
      results.marqueeAnimation = styles.animation;
      results.marqueeAnimationName = styles.animationName;
      results.marqueeAnimationDuration = styles.animationDuration;
    }

    // Check if SmoothScroll wrapper is in the DOM
    results.hasSmoothScrollWrapper = document.body.outerHTML.toLowerCase().includes('lenis');

    return results;
  });

  console.log('=== Code verification ===');
  console.log(JSON.stringify(checks, null, 2));

  // Check 2: Is there a JS rAF running on the marquee?
  // We can check by reading the animation timeline
  const rafCount = await page.evaluate(() => {
    return new Promise((resolve) => {
      let count = 0;
      const start = performance.now();
      function tick() {
        count++;
        if (performance.now() - start < 1000) requestAnimationFrame(tick);
        else resolve(count);
      }
      requestAnimationFrame(tick);
    });
  });
  console.log(`\nrAF count over 1s: ${rafCount} (should be ~60)`);

  await browser.close();
})().catch((e) => {
  console.error('FAILED:', e);
  process.exit(1);
});