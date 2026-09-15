// Debug: check what classes are in the document
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

  // Hover the Truck card
  const link = page.locator('a[aria-label^="Open "]').filter({ hasText: /Truck/ }).first();
  const box = await link.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForTimeout(500);

  // Find any preview-like elements anywhere in document
  const found = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const matches = all.filter((el) => {
      const cn = el.className;
      return typeof cn === 'string' && (
        cn.includes('z-[2147483646]') ||
        cn.includes('pointer-events-none fixed')
      );
    });
    return matches.map((el) => ({
      tag: el.tagName,
      classes: typeof el.className === 'string' ? el.className.substring(0, 80) : '',
      parent: el.parentElement?.tagName,
    }));
  });

  console.log('Preview-like elements found:', JSON.stringify(found, null, 2));

  // Also list all body children
  const bodyChildren = await page.evaluate(() => {
    return Array.from(document.body.children).map((el) => ({
      tag: el.tagName,
      classes: typeof el.className === 'string' ? el.className.substring(0, 60) : '',
      id: el.id || '',
    }));
  });
  console.log('\nBody children:', JSON.stringify(bodyChildren, null, 2));

  await browser.close();
})().catch((e) => {
  console.error('FAILED:', e);
  process.exit(1);
});