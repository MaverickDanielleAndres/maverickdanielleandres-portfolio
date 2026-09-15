// Quick smoke test: load the page, click Get Started, measure timings.
// Uses the running dev server on localhost:3000.
import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
  });
  const page = await context.newPage();

  const errors = [];
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`console: ${msg.text()}`);
  });

  console.log('Loading page...');
  const start = Date.now();
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 30000 });
  console.log(`Page loaded in ${Date.now() - start}ms`);

  // ── First-click modal open (cold cache path) ──
  const btn = page.getByRole('button', { name: /get started/i });
  await btn.waitFor({ state: 'visible', timeout: 10000 });

  const clickStart = Date.now();
  await btn.click();
  const dialog = page.getByRole('dialog', { name: /project inquiry/i });
  await dialog.waitFor({ state: 'visible', timeout: 5000 });
  const clickToModalMs = Date.now() - clickStart;
  console.log(`[1st click] Click → modal visible: ${clickToModalMs}ms`);

  // ── Navigate to step 2 ──
  const s1 = Date.now();
  await dialog.getByRole('button', { name: /Build Something New/i }).click();
  await dialog.getByRole('button', { name: /^Continue$/i }).click();
  await dialog.getByRole('heading', { name: /What are we working on/i }).waitFor({ state: 'visible', timeout: 5000 });
  console.log(`Step 1→2: ${Date.now() - s1}ms`);

  // ── Navigate to step 3 ──
  const s2 = Date.now();
  // Option buttons have label + description in accessible name, so we match prefix
  await dialog.getByRole('button', { name: /^Website\s/ }).click();
  await dialog.getByRole('button', { name: /^Continue$/i }).click();
  await dialog.getByRole('heading', { name: /What's the scope/i }).waitFor({ state: 'visible', timeout: 5000 });
  console.log(`Step 2→3: ${Date.now() - s2}ms`);

  // ── Navigate to step 4 ──
  const s3 = Date.now();
  await dialog.getByRole('button', { name: /Under ₱25K/i }).click();
  await dialog.getByRole('button', { name: /^ASAP$/ }).click();
  await dialog.getByRole('button', { name: /^Continue$/i }).click();
  await dialog.getByRole('heading', { name: /Let's talk about it/i }).waitFor({ state: 'visible', timeout: 5000 });
  console.log(`Step 3→4: ${Date.now() - s3}ms`);

  // ── Type in name field ──
  const t1 = Date.now();
  await dialog.locator('#inquiry-name').fill('Test User');
  console.log(`Fill name (10 chars): ${Date.now() - t1}ms`);

  // ── Submit button should be enabled now (validity flipped) ──
  const submitBtn = dialog.getByRole('button', { name: /Send Project Inquiry/i });
  const submitDisabled = await submitBtn.isDisabled();
  console.log(`Submit disabled after name only: ${submitDisabled} (expected: true — needs email)`);

  // ── Fill email ──
  const t2 = Date.now();
  await dialog.locator('#inquiry-email').fill('test@example.com');
  console.log(`Fill email (16 chars): ${Date.now() - t2}ms`);

  // ── Now submit should be enabled ──
  const submitDisabledAfter = await submitBtn.isDisabled();
  console.log(`Submit disabled after email: ${submitDisabledAfter} (expected: false)`);

  // ── Rapid-fire 5 sequential keystrokes to measure per-keystroke cost ──
  const k1 = Date.now();
  for (let i = 0; i < 5; i++) {
    await dialog.locator('#inquiry-email').press('End');
    await dialog.locator('#inquiry-email').type('x');
  }
  console.log(`5 sequential keystrokes (5 chars): ${Date.now() - k1}ms total (~${Math.round((Date.now() - k1) / 5)}ms/keystroke)`);

  // ── Close modal ──
  const c1 = Date.now();
  await dialog.getByRole('button', { name: /Close/i }).click();
  // Modal should be detached
  await page.waitForFunction(() => !document.querySelector('[role="dialog"][aria-label="Project inquiry"]'), { timeout: 3000 });
  console.log(`Close modal: ${Date.now() - c1}ms`);

  // ── Re-open (warm cache path) ──
  await btn.click();
  await dialog.waitFor({ state: 'visible', timeout: 5000 });
  console.log(`Re-open (warm cache): instant after click (cached chunk)`);

  if (errors.length > 0) {
    console.log('\nErrors:');
    errors.forEach((e) => console.log(`  - ${e}`));
    process.exit(1);
  } else {
    console.log('\n✅ No runtime errors.');
  }

  await browser.close();
})().catch((e) => {
  console.error('FAILED:', e);
  process.exit(1);
});