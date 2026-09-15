// Take a screenshot showing the preview centered on the cursor
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
  await page.waitForTimeout(800);

  // Hover the Truck card (it's at index 3, second column, second row)
  const link = page.locator('a[aria-label^="Open "]').filter({ hasText: /Truck/ }).first();
  const box = await link.boundingBox();
  console.log('Card box:', box);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForTimeout(800);

  // Capture position info
  const info = await page.evaluate(() => {
    const preview = document.querySelector('.pointer-events-none.fixed.z-\\[2147483646\\]');
    if (!preview) return null;
    const rect = preview.getBoundingClientRect();
    return {
      previewRect: {
        x: rect.x, y: rect.y,
        width: rect.width, height: rect.height,
        centerX: rect.x + rect.width / 2,
        centerY: rect.y + rect.height / 2,
      },
      transform: preview.style.transform,
      inlineStyle: preview.getAttribute('style'),
    };
  });
  console.log('Preview info:', JSON.stringify(info, null, 2));

  await page.screenshot({ path: 'scripts/preview-on-cursor.png', fullPage: false });
  console.log('\nScreenshot: scripts/preview-on-cursor.png');

  await browser.close();
})().catch((e) => {
  console.error('FAILED:', e);
  process.exit(1);
});