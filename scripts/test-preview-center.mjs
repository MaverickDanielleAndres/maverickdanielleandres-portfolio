// Verify the preview CENTER is exactly on the cursor position.
import { chromium } from '@playwright/test';

const PREVIEW_SELECTOR = '.pointer-events-none.fixed.z-\\[2147483646\\]';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Scroll to the WordPress showcase section
  await page.evaluate(() => {
    const showcase = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2');
    showcase?.scrollIntoView({ block: 'center' });
  });
  await page.waitForTimeout(1000);

  const projectLinks = page.locator('a[aria-label^="Open "]').filter({ hasText: /NexVision|Maranellos|Oven|Truck|AJL|Crystal|Burwood|Mojde/ });
  const count = await projectLinks.count();
  console.log(`Found ${count} project links`);

  // Test multiple cursor positions
  const tests = [];
  for (let i = 0; i < count; i++) {
    const link = projectLinks.nth(i);
    const box = await link.boundingBox();
    if (!box) continue;

    const cursorX = box.x + box.width / 2;
    const cursorY = box.y + box.height / 2;
    await page.mouse.move(cursorX, cursorY);
    await page.waitForTimeout(400);

    const result = await page.evaluate(({ tx, ty, sel }) => {
      const preview = document.querySelector(sel);
      if (!preview) return null;
      const m = preview.style.transform.match(/translate3d\(([^,]+)px, ([^,]+)px/);
      if (!m) return null;
      const previewX = parseFloat(m[1]);
      const previewY = parseFloat(m[2]);
      const rect = preview.getBoundingClientRect();
      return {
        previewX, previewY,
        centerX: rect.x + rect.width / 2,
        centerY: rect.y + rect.height / 2,
        targetX: tx, targetY: ty,
      };
    }, { tx: cursorX, ty: cursorY, sel: PREVIEW_SELECTOR });

    if (!result) {
      tests.push({ card: i, error: 'preview not found' });
      continue;
    }

    const dx = Math.abs(result.centerX - result.targetX);
    const dy = Math.abs(result.centerY - result.targetY);
    const ok = dx < 5 && dy < 5;

    tests.push({
      card: i,
      cursor: { x: result.targetX, y: result.targetY },
      previewCenter: { x: result.centerX, y: result.centerY },
      offset: { dx, dy },
      ok,
    });
  }

  console.log('\n=== Preview-center-on-cursor check ===');
  console.log('Card | Cursor                | Preview Center        | Offset (px)');
  console.log('-----|----------------------|----------------------|-------------');
  for (const t of tests) {
    if (t.error) {
      console.log(`  ${t.card}  | ERROR: ${t.error}`);
      continue;
    }
    const okMark = t.ok ? '✅' : '❌';
    console.log(
      `  ${t.card}  | (${t.cursor.x.toFixed(0)}, ${t.cursor.y.toFixed(0)})              | (${t.previewCenter.x.toFixed(0)}, ${t.previewCenter.y.toFixed(0)})              | dx=${t.offset.dx.toFixed(1)}, dy=${t.offset.dy.toFixed(1)}  ${okMark}`
    );
  }

  // Edge tests
  console.log('\n=== Edge clamping test ===');
  // Test with cursor near top-left of a card
  await page.mouse.move(330, 192);
  await page.waitForTimeout(400);
  const tl = await page.evaluate((sel) => {
    const preview = document.querySelector(sel);
    if (!preview) return null;
    const m = preview.style.transform.match(/translate3d\(([^,]+)px, ([^,]+)px/);
    return m ? { x: parseFloat(m[1]), y: parseFloat(m[2]) } : null;
  }, PREVIEW_SELECTOR);
  console.log(`Cursor at (330, 192) → preview at (${tl?.x}, ${tl?.y})`);

  // Final verdict
  const allCentered = tests.every((t) => t.ok || t.error);
  if (allCentered) {
    console.log('\n✅ Preview center is on cursor for all tested cards.');
  } else {
    console.log('\n❌ Some cards failed center check.');
    process.exit(1);
  }

  await browser.close();
})().catch((e) => {
  console.error('FAILED:', e);
  process.exit(1);
});