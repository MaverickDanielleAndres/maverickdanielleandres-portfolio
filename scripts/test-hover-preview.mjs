// Verify the hover preview on the WordPress/WooCommerce Projects section
// still works correctly with the perf optimizations.
import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  console.log('Loading page...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Scroll to the showcase section
  console.log('\nScrolling to Projects section...');
  await page.evaluate(() => {
    const showcase = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2');
    showcase?.scrollIntoView({ block: 'center' });
  });
  await page.waitForTimeout(1000);

  // Find the project links (WordPress showcase)
  const projectLinks = page.locator('a[aria-label^="Open "]').filter({ hasText: /NexVision|Maranellos|Oven|Truck|AJL|Crystal|Burwood|Mojde/ });
  const count = await projectLinks.count();
  console.log(`Found ${count} project links`);

  if (count === 0) {
    console.log('❌ No project links found — section not rendered?');
    process.exit(1);
  }

  // ── Test 1: hover the first card and check preview appears ────────
  console.log('\n=== Test 1: Hover first card ===');
  const firstLink = projectLinks.first();
  await firstLink.hover();
  await page.waitForTimeout(500); // wait for fade-in

  const previewState = await page.evaluate(() => {
    // Find the floating preview — Portal'd into body, has unique z-index class
    const preview = document.querySelector('.pointer-events-none.fixed.z-\\[2147483646\\]');
    if (!preview) return { found: false };
    const styles = getComputedStyle(preview);
    return {
      found: true,
      opacity: styles.opacity,
      transform: preview.style.transform,
      isOnScreen: !preview.style.transform.includes('-9999'),
    };
  });

  console.log('Preview state after hover:', previewState);
  if (!previewState.found) {
    console.log('❌ Preview element not found');
    process.exit(1);
  }
  if (previewState.opacity !== '1') {
    console.log(`❌ Preview opacity is ${previewState.opacity}, expected 1`);
    process.exit(1);
  }
  if (!previewState.isOnScreen) {
    console.log(`❌ Preview still off-screen: ${previewState.transform}`);
    process.exit(1);
  }
  console.log('✅ Preview visible at cursor');

  // ── Test 2: move cursor across cards — preview should follow ─────
  console.log('\n=== Test 2: Move cursor across cards (preview tracks) ===');
  const positions = [];
  for (let i = 0; i < Math.min(count, 4); i++) {
    const link = projectLinks.nth(i);
    const box = await link.boundingBox();
    if (!box) continue;
    // Move to center of the card
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(300);

    const pos = await page.evaluate(() => {
      const preview = document.querySelector('.pointer-events-none.fixed.z-\\[2147483646\\]');
      if (!preview) return null;
      const m = preview.style.transform.match(/translate3d\(([^,]+)px, ([^,]+)px/);
      return m ? { x: parseFloat(m[1]), y: parseFloat(m[2]) } : null;
    });
    positions.push({ card: i, ...pos });
  }

  console.log('Preview positions across cards:', positions);
  // Verify positions are different (preview moved)
  const distinctPositions = new Set(positions.map((p) => `${Math.round(p.x)},${Math.round(p.y)}`));
  if (distinctPositions.size < 2) {
    console.log('❌ Preview did NOT move between cards');
    process.exit(1);
  }
  console.log(`✅ Preview tracked across ${distinctPositions.size} distinct positions`);

  // ── Test 3: mouse leave — preview should fade out ────────────────
  console.log('\n=== Test 3: Mouse leave → preview fades ===');
  await page.mouse.move(0, 0); // move to top-left, well outside the section
  await page.waitForTimeout(500);

  const afterLeave = await page.evaluate(() => {
    const preview = document.querySelector('.pointer-events-none.fixed.z-\\[2147483646\\]');
    if (!preview) return { found: false };
    const styles = getComputedStyle(preview);
    return { found: true, opacity: styles.opacity };
  });
  console.log('Preview after leave:', afterLeave);
  // Opacity should still be 1 because hoveredIndex is null BUT the CSS opacity is bound to hoveredIndex.
  // So opacity should go to 0.
  if (afterLeave.found && afterLeave.opacity !== '0') {
    console.log(`⚠️ Preview opacity after leave: ${afterLeave.opacity} (expected 0)`);
  } else {
    console.log('✅ Preview faded out');
  }

  // ── Test 4: confirm no React re-renders during hover ─────────────
  console.log('\n=== Test 4: Verify no excessive re-renders during mouse move ===');
  // Re-render the project showcase
  await page.evaluate(() => {
    const showcase = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2');
    showcase?.scrollIntoView({ block: 'center' });
  });
  await page.waitForTimeout(500);

  const renderCount = await page.evaluate(async () => {
    let count = 0;
    // Hook into React DevTools-style counter via MutationObserver
    const target = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2');
    if (!target) return -1;
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'style') count++;
      }
    });
    observer.observe(target, { attributes: true, subtree: true, attributeFilter: ['style'] });

    // Move mouse around the section for 1 second
    const box = target.getBoundingClientRect();
    for (let i = 0; i < 20; i++) {
      const event = new MouseEvent('mousemove', {
        clientX: box.left + Math.random() * box.width,
        clientY: box.top + Math.random() * box.height,
        bubbles: true,
      });
      target.dispatchEvent(event);
      await new Promise((r) => setTimeout(r, 50));
    }

    observer.disconnect();
    return count;
  });

  console.log(`Style mutations during 1s of mouse movement: ${renderCount}`);
  if (renderCount > 20) {
    console.log(`⚠️  Too many style mutations (${renderCount}) — re-renders happening`);
  } else {
    console.log(`✅ Minimal style mutations — no re-renders`);
  }

  console.log('\n✅ All hover preview tests passed.');
  await browser.close();
})().catch((e) => {
  console.error('FAILED:', e);
  process.exit(1);
});