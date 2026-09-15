// Debug: check the parent chain of the preview to find any transforms
import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  await page.evaluate(() => {
    document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2')?.scrollIntoView({ block: 'center' });
  });
  await page.waitForTimeout(1000);

  // Hover Truck card
  const link = page.locator('a[aria-label^="Open "]').filter({ hasText: /Truck/ }).first();
  const box = await link.boundingBox();
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  await page.mouse.move(cx, cy);
  await page.waitForTimeout(600);

  // Walk up the parent chain
  const chain = await page.evaluate(() => {
    const allDivs = Array.from(document.querySelectorAll('div'));
    const preview = allDivs.find((d) => d.className.includes('pointer-events-none fixed z-50'));
    if (!preview) return { error: 'not found' };
    const result = [];
    let el = preview;
    while (el && el !== document.body) {
      const cs = getComputedStyle(el);
      result.push({
        tag: el.tagName,
        classes: el.className.substring(0, 80),
        transform: cs.transform,
        position: cs.position,
        top: cs.top,
        left: cs.left,
        willChange: cs.willChange,
        contain: cs.contain,
        contentVisibility: cs.contentVisibility,
      });
      el = el.parentElement;
    }
    return result;
  });

  console.log('Parent chain of preview:');
  for (const [i, p] of chain.entries()) {
    console.log(`[${i}] <${p.tag}>`);
    console.log(`    classes: ${p.classes}`);
    console.log(`    transform: ${p.transform}`);
    console.log(`    position: ${p.position} top: ${p.top} left: ${p.left}`);
    if (p.willChange !== 'auto') console.log(`    willChange: ${p.willChange}`);
    if (p.contain !== 'none') console.log(`    contain: ${p.contain}`);
    if (p.contentVisibility !== 'visible') console.log(`    contentVisibility: ${p.contentVisibility}`);
  }

  // Also check what's at scrollY
  const scrollInfo = await page.evaluate(() => ({
    scrollY: window.scrollY,
    scrollX: window.scrollX,
    innerHeight: window.innerHeight,
    documentHeight: document.documentElement.scrollHeight,
  }));
  console.log('\nScroll info:', scrollInfo);

  await browser.close();
})().catch((e) => {
  console.error('FAILED:', e);
  process.exit(1);
});