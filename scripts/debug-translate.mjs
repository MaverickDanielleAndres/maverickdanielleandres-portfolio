// Check for separate translate CSS property
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

  const link = page.locator('a[aria-label^="Open "]').filter({ hasText: /Truck/ }).first();
  const box = await link.boundingBox();
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  await page.mouse.move(cx, cy);
  await page.waitForTimeout(800);

  const info = await page.evaluate(() => {
    const allDivs = Array.from(document.querySelectorAll('div'));
    const preview = allDivs.find((d) => d.className.includes('pointer-events-none fixed z-50'));
    if (!preview) return { error: 'not found' };

    const cs = getComputedStyle(preview);

    // Check every transform-related property
    return {
      transform: cs.transform,
      translate: cs.translate,
      rotate: cs.rotate,
      scale: cs.scale,
      transformOrigin: cs.transformOrigin,
      top: cs.top,
      left: cs.left,
      bottom: cs.bottom,
      right: cs.right,
      margin: cs.margin,
      padding: cs.padding,
      position: cs.position,
      display: cs.display,
      containingBlock: preview.offsetParent?.tagName,
      offsetParent: preview.offsetParent?.className,
      rect: preview.getBoundingClientRect(),
    };
  });

  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})().catch((e) => { console.error('FAILED:', e); process.exit(1); });