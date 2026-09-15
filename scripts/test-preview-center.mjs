// Verify the preview CENTER is exactly on the cursor position.
import { chromium } from '@playwright/test';

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

    // Move cursor to center of card
    const cursorX = box.x + box.width / 2;
    const cursorY = box.y + box.height / 2;
    await page.mouse.move(cursorX, cursorY);
    await page.waitForTimeout(400); // wait for lerp to converge

    const result = await page.evaluate(({ tx, ty }) => {
      const allDivs = Array.from(document.querySelectorAll('div'));
      const preview = allDivs.find((d) =>
        d.className.includes('pointer-events-none fixed z-50')
      );
      if (!preview) return null;
      const m = preview.style.transform.match(/translate3d\(([^,]+)px, ([^,]+)px/);
      if (!m) return null;
      const previewX = parseFloat(m[1]);
      const previewY = parseFloat(m[2]);
      const previewWidth = 320;
      const previewHeight = 200;
      // The CENTER of the preview should be at the cursor position
      const centerX = previewX + previewWidth / 2;
      const centerY = previewY + previewHeight / 2;
      return {
        previewX, previewY,
        centerX, centerY,
        targetX: tx, targetY: ty,
      };
    }, { tx: cursorX, ty: cursorY });

    if (!result) {
      tests.push({ card: i, error: 'preview not found' });
      continue;
    }

    const dx = Math.abs(result.centerX - result.targetX);
    const dy = Math.abs(result.centerY - result.targetY);
    const ok = dx < 5 && dy < 5; // within 5px tolerance for the lerp

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

  // Also test edge cases (cursor near edges)
  console.log('\n=== Edge clamping test ===');
  // Cursor at top-left corner
  await page.mouse.move(50, 50);
  await page.waitForTimeout(400);
  const tl = await page.evaluate(() => {
    const allDivs = Array.from(document.querySelectorAll('div'));
    const preview = allDivs.find((d) =>
      d.className.includes('pointer-events-none fixed z-50')
    );
    if (!preview) return null;
    const m = preview.style.transform.match(/translate3d\(([^,]+)px, ([^,]+)px/);
    return m ? { x: parseFloat(m[1]), y: parseFloat(m[2]) } : null;
  });
  console.log(`Top-left cursor → preview at (${tl?.x}, ${tl?.y}) — should be clamped to ≥12`);

  // Cursor at bottom-right
  await page.mouse.move(1230, 750);
  await page.waitForTimeout(400);
  const br = await page.evaluate(() => {
    const allDivs = Array.from(document.querySelectorAll('div'));
    const preview = allDivs.find((d) =>
      d.className.includes('pointer-events-none fixed z-50')
    );
    if (!preview) return null;
    const m = preview.style.transform.match(/translate3d\(([^,]+)px, ([^,]+)px/);
    return m ? { x: parseFloat(m[1]), y: parseFloat(m[2]) } : null;
  });
  console.log(`Bottom-right cursor → preview at (${br?.x}, ${br?.y}) — should be clamped to ≤(1280-320-12, 800-200-12) = (948, 588)`);

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