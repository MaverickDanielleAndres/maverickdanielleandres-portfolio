// Specifically check the OUTER preview div's getBoundingClientRect
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
  await page.waitForTimeout(800);

  const info = await page.evaluate(({ cx, cy }) => {
    const allDivs = Array.from(document.querySelectorAll('div'));
    const preview = allDivs.find((d) => d.className.includes('pointer-events-none fixed z-50'));
    if (!preview) return { error: 'not found' };

    const rect = preview.getBoundingClientRect();
    const computed = getComputedStyle(preview);
    const inlineTransform = preview.style.transform;

    // Get all child elements' rects
    const children = [];
    for (const child of Array.from(preview.querySelectorAll('*'))) {
      const r = child.getBoundingClientRect();
      children.push({
        tag: child.tagName,
        classes: child.className.substring(0, 60),
        rect: { x: r.x, y: r.y, width: r.width, height: r.height },
        transform: getComputedStyle(child).transform,
      });
    }

    return {
      cursor: { x: cx, y: cy },
      previewRect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      previewComputedTransform: computed.transform,
      previewInlineTransform: inlineTransform,
      previewPosition: computed.position,
      previewTop: computed.top,
      previewLeft: computed.left,
      scrollY: window.scrollY,
      documentHeight: document.documentElement.scrollHeight,
      viewport: { width: window.innerWidth, height: window.innerHeight },
      children,
    };
  }, { cx, cy });

  console.log('Preview details:');
  console.log(JSON.stringify(info, null, 2));

  await browser.close();
})().catch((e) => {
  console.error('FAILED:', e);
  process.exit(1);
});