// Inspect what's actually happening with the preview positioning at runtime
import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Scroll to WordPress showcase
  await page.evaluate(() => {
    document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2')?.scrollIntoView({ block: 'center' });
  });
  await page.waitForTimeout(1000);

  // Hover the Truck card (4th card, second row, second column)
  const links = page.locator('a[aria-label^="Open "]').filter({ hasText: /Truck/ });
  const link = links.first();
  const box = await link.boundingBox();
  console.log('Truck card bounding box:', box);

  // Move cursor to center
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  console.log(`Moving cursor to (${cx}, ${cy})`);
  await page.mouse.move(cx, cy);
  await page.waitForTimeout(800);

  // Check preview state
  const state = await page.evaluate(({ cursorX, cursorY }) => {
    const allDivs = Array.from(document.querySelectorAll('div'));
    const preview = allDivs.find((d) => d.className.includes('pointer-events-none fixed z-50'));
    if (!preview) return { error: 'preview not found' };
    const m = preview.style.transform.match(/translate3d\(([^,]+)px, ([^,]+)px/);
    if (!m) return { error: 'transform not parsed' };
    const previewX = parseFloat(m[1]);
    const previewY = parseFloat(m[2]);
    const previewRect = preview.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    return {
      cursor: { x: cursorX, y: cursorY },
      previewTopLeft: { x: previewX, y: previewY },
      previewRect: {
        x: previewRect.x, y: previewRect.y,
        width: previewRect.width, height: previewRect.height,
        centerX: previewRect.x + previewRect.width / 2,
        centerY: previewRect.y + previewRect.height / 2,
      },
      viewport: { width: viewportWidth, height: viewportHeight },
      offset: {
        dx: (previewRect.x + previewRect.width / 2) - cursorX,
        dy: (previewRect.y + previewRect.height / 2) - cursorY,
      },
    };
  }, { cursorX: cx, cursorY: cy });

  console.log('\nPreview state:');
  console.log(JSON.stringify(state, null, 2));

  // Take a screenshot
  await page.screenshot({ path: 'scripts/preview-position.png', fullPage: false });
  console.log('\nScreenshot saved to scripts/preview-position.png');

  await browser.close();
})().catch((e) => {
  console.error('FAILED:', e);
  process.exit(1);
});