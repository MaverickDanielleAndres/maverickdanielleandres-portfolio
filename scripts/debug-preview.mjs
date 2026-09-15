// Debug: find all elements with the matching class and show their transforms
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

  // Find all matching elements
  const allMatches = await page.evaluate(() => {
    const allDivs = Array.from(document.querySelectorAll('div'));
    return allDivs
      .filter((d) => d.className.includes('pointer-events-none fixed z-50'))
      .map((d) => ({
        classes: d.className,
        transform: d.style.transform,
        opacity: getComputedStyle(d).opacity,
      }));
  });
  console.log('Elements matching the preview class:');
  for (const m of allMatches) console.log(`  - ${JSON.stringify(m)}`);

  // Hover a card and check
  const link = page.locator('a[aria-label^="Open "]').filter({ hasText: /NexVision/ }).first();
  const box = await link.boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(400);
  }

  const afterHover = await page.evaluate(() => {
    const allDivs = Array.from(document.querySelectorAll('div'));
    return allDivs
      .filter((d) => d.className.includes('pointer-events-none fixed z-50'))
      .map((d) => ({
        transform: d.style.transform,
        opacity: getComputedStyle(d).opacity,
      }));
  });
  console.log('\nAfter hover:');
  for (const m of afterHover) console.log(`  - ${JSON.stringify(m)}`);

  // Move to bottom-right corner (outside the section)
  await page.mouse.move(1230, 750);
  await page.waitForTimeout(600);

  const afterMove = await page.evaluate(() => {
    const allDivs = Array.from(document.querySelectorAll('div'));
    return allDivs
      .filter((d) => d.className.includes('pointer-events-none fixed z-50'))
      .map((d) => ({
        transform: d.style.transform,
        opacity: getComputedStyle(d).opacity,
      }));
  });
  console.log('\nAfter move to (1230, 750):');
  for (const m of afterMove) console.log(`  - ${JSON.stringify(m)}`);

  await browser.close();
})().catch((e) => {
  console.error('FAILED:', e);
  process.exit(1);
});