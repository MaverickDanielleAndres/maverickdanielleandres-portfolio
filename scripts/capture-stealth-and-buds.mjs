import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function preScrollPage(page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= height; y += 600) {
    await page.evaluate((pos) => window.scrollTo({ top: pos, behavior: 'instant' }), y);
    await page.waitForTimeout(180);
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(800);
}

async function saveOptimizedScreenshot(page, targetDir, fileName) {
  const tempPath = path.join(targetDir, `temp_${fileName}`);
  const finalPath = path.join(targetDir, fileName);

  await page.screenshot({ path: tempPath, type: 'png' });
  await sharp(tempPath)
    .resize({ width: 1440, withoutEnlargement: true })
    .png({ compressionLevel: 8, quality: 85 })
    .toFile(finalPath);

  if (fs.existsSync(tempPath)) {
    fs.unlinkSync(tempPath);
  }
  const stats = fs.statSync(finalPath);
  console.log(`  -> Saved ${fileName} (${Math.round(stats.size / 1024)} KB)`);
}

async function captureStealthAndBuds() {
  console.log('Launching browser...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-blink-features=AutomationControlled']
  });

  // ============================================================================
  // PART 1: STEALTH CONCRETING
  // ============================================================================
  const stealthDir = path.resolve('public/Projects/stealth-concreting/screenshots');
  fs.mkdirSync(stealthDir, { recursive: true });
  console.log(`\n=== Capturing Stealth Concreting -> ${stealthDir} ===`);

  const stealthCtx = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.25
  });
  const stealthPage = await stealthCtx.newPage();

  const stealthHomeCaptures = [
    { num: 1, scrollY: 0, desc: 'Home Hero - Concrete. Done properly.' },
    { num: 2, scrollY: 900, desc: 'The Stealth Standard - Good concrete. Great care.' },
    { num: 3, scrollY: 1700, desc: 'What We Do - Concrete, in every form.' },
    { num: 4, scrollY: 4230, desc: 'Selected Projects - See what we build.' },
    { num: 5, scrollY: 6300, desc: 'Before & After Transformations - Same home. New perspective.' },
    { num: 6, scrollY: 6960, desc: 'Meet the Crew - Real people. Pride in every job.' },
    { num: 7, scrollY: 7670, desc: 'Google 5.0 Reviews - Good work. Word gets around.' },
  ];

  await stealthPage.goto('https://stealthconcreting.vercel.app/', { waitUntil: 'networkidle', timeout: 35000 }).catch(() => {});
  await stealthPage.waitForTimeout(2000);
  await preScrollPage(stealthPage);

  for (const item of stealthHomeCaptures) {
    console.log(`[Stealth ${item.num}/12] ${item.desc}`);
    await stealthPage.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), item.scrollY);
    await stealthPage.waitForTimeout(1000);
    await saveOptimizedScreenshot(stealthPage, stealthDir, `stealth-concreting (${item.num}).png`);
  }

  const stealthSubpages = [
    { num: 8, url: 'https://stealthconcreting.vercel.app/about', scrollY: 0, desc: 'Our Story Page' },
    { num: 9, url: 'https://stealthconcreting.vercel.app/services', scrollY: 0, desc: 'Concreting Services Page' },
    { num: 10, url: 'https://stealthconcreting.vercel.app/projects', scrollY: 0, desc: 'Our Projects Showcase Page' },
    { num: 11, url: 'https://stealthconcreting.vercel.app/media', scrollY: 0, desc: 'In Motion Films & Gallery Page' },
    { num: 12, url: 'https://stealthconcreting.vercel.app/contact', scrollY: 0, desc: 'Contact & Free Quote Page' },
  ];

  for (const item of stealthSubpages) {
    console.log(`[Stealth ${item.num}/12] ${item.desc} (${item.url})`);
    await stealthPage.goto(item.url, { waitUntil: 'networkidle', timeout: 35000 }).catch(() => {});
    await stealthPage.waitForTimeout(1800);
    await preScrollPage(stealthPage);
    await stealthPage.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), item.scrollY);
    await stealthPage.waitForTimeout(800);
    await saveOptimizedScreenshot(stealthPage, stealthDir, `stealth-concreting (${item.num}).png`);
  }

  await stealthCtx.close();

  // ============================================================================
  // PART 2: BUDSLETSMEET
  // ============================================================================
  const budsDir = path.resolve('public/Projects/budsletsmeet/screenshots');
  fs.mkdirSync(budsDir, { recursive: true });
  console.log(`\n=== Capturing Budsletsmeet -> ${budsDir} ===`);

  const budsCtx = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.25
  });
  const budsPage = await budsCtx.newPage();

  // Capture Landing Page sections (1 to 5)
  await budsPage.goto('https://budsletsmeet.vercel.app/', { waitUntil: 'networkidle', timeout: 35000 }).catch(() => {});
  await budsPage.waitForTimeout(2000);
  await preScrollPage(budsPage);

  const budsLandingCaptures = [
    { num: 1, scrollY: 0, desc: 'Landing Page Hero - Less planning. More showing up.' },
    { num: 2, scrollY: 540, desc: 'Interactive Live Demo - Try It Live Saturday Hangout' },
    { num: 3, scrollY: 1230, desc: 'How It Works - Three tiny steps. One really good day.' },
    { num: 4, scrollY: 2100, desc: 'Built-in Features - A planning tool with actual personality.' },
    { num: 5, scrollY: 3650, desc: 'For Every Group & Stories' },
  ];

  for (const item of budsLandingCaptures) {
    console.log(`[Buds ${item.num}/12] ${item.desc}`);
    await budsPage.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), item.scrollY);
    await budsPage.waitForTimeout(800);
    await saveOptimizedScreenshot(budsPage, budsDir, `budsletsmeet (${item.num}).png`);
  }

  // First, let's submit 2 guest RSVPs on the invite link in separate contexts so the circle has active replies!
  const inviteUrl = 'https://budsletsmeet.vercel.app/c/cSiqnOmgt71VANji_do0ONW5ajE8zhK_K6K3OlrVI8M';
  for (const guestName of ['Sofia Chen', 'Liam Santos']) {
    const guestCtx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.25 });
    const guestPage = await guestCtx.newPage();
    await guestPage.goto(inviteUrl, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
    await guestPage.waitForTimeout(1500);
    const nameInput = guestPage.getByPlaceholder('What should everyone call you?');
    if (await nameInput.count() > 0) {
      await nameInput.fill(guestName);
      await guestPage.getByRole('button', { name: /All free/i }).click();
      await guestPage.waitForTimeout(400);
      await guestPage.getByRole('button', { name: /Send my reply/i }).click();
      await guestPage.waitForTimeout(2500);
    }
    await guestCtx.close();
  }

  // Screenshot 6: Sign In / Create Account Page
  console.log('[Buds 6/12] Sign In & Account Creation Portal');
  await budsPage.goto('https://budsletsmeet.vercel.app/sign-in', { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
  await budsPage.waitForTimeout(1500);
  await saveOptimizedScreenshot(budsPage, budsDir, 'budsletsmeet (6).png');

  // Sign in to Organizer Account
  const signInInputs = await budsPage.locator('input').all();
  await signInInputs[0].fill('mavericktest28697@gmail.com');
  await signInInputs[1].fill('TestPass123!');
  await budsPage.getByRole('button', { name: /Sign in/i }).click();
  await budsPage.waitForTimeout(4000);

  // Create a second circle so /dashboard looks even richer, and capture the filled /create form!
  console.log('[Buds 8/12] Create a Circle Studio (/create)');
  await budsPage.goto('https://budsletsmeet.vercel.app/create', { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
  await budsPage.waitForTimeout(1500);
  const groupSelect = budsPage.locator('select').first();
  if ((await groupSelect.locator('option').count()) > 1) {
    await groupSelect.selectOption({ index: 1 });
  }
  await budsPage.getByPlaceholder('Friday dinner with the crew').fill('Friday Night Board Games & Pizza');
  await budsPage.getByPlaceholder('At Maya’s place').fill('BGC High Street Lounge');
  await budsPage.getByPlaceholder('Around ₱500 each').fill('Around ₱500 each');
  await budsPage.getByPlaceholder('Where we might go, what to bring…').fill('Bring your favorite strategy board games! Pizza and drinks on rotation.');
  const dtInputs = await budsPage.locator('input[type="datetime-local"]').all();
  if (dtInputs.length >= 2) {
    await dtInputs[0].fill('2026-11-27T19:00');
    await dtInputs[1].fill('2026-11-27T23:00');
  }
  await budsPage.waitForTimeout(800);
  await saveOptimizedScreenshot(budsPage, budsDir, 'budsletsmeet (8).png');

  // Submit the second circle to capture the "Bring your people in" invitation & QR screen!
  console.log('[Buds 9/12] Circle Created — Invitation Link & QR Share Screen');
  await budsPage.getByRole('button', { name: /Create and get invitation link/i }).click();
  await budsPage.waitForTimeout(4000);
  await saveOptimizedScreenshot(budsPage, budsDir, 'budsletsmeet (9).png');

  // Now capture Screenshot 7: Main Organizer Dashboard (/dashboard) with 2 circles!
  console.log('[Buds 7/12] Main Organizer Dashboard (/dashboard — My circles)');
  await budsPage.goto('https://budsletsmeet.vercel.app/dashboard', { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
  await budsPage.waitForTimeout(2000);
  await saveOptimizedScreenshot(budsPage, budsDir, 'budsletsmeet (7).png');

  // Capture Screenshot 10: Guest Invitation & RSVP Voting Page (with Alex Rivera filling & Group Picture unlocked)
  console.log('[Buds 10/12] Guest Invitation & Passwordless RSVP Voting Page');
  await budsPage.goto(inviteUrl, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
  await budsPage.waitForTimeout(1800);
  const alexInput = budsPage.getByPlaceholder('What should everyone call you?');
  if (await alexInput.count() > 0) {
    await alexInput.fill('Alex Rivera');
    await budsPage.getByRole('button', { name: /All free/i }).click();
    await budsPage.waitForTimeout(500);
    await budsPage.getByRole('button', { name: /Send my reply/i }).click();
    await budsPage.waitForTimeout(2500);
  }
  await budsPage.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await budsPage.waitForTimeout(600);
  await saveOptimizedScreenshot(budsPage, budsDir, 'budsletsmeet (10).png');

  // Capture Screenshot 11: Organizer Circle Management Dashboard (/dashboard/circles/53c00dfe-ab57-447f-a417-9bf292501abf)
  console.log('[Buds 11/12] Organizer Circle Management & Consensus Dashboard');
  await budsPage.goto('https://budsletsmeet.vercel.app/dashboard/circles/53c00dfe-ab57-447f-a417-9bf292501abf', { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
  await budsPage.waitForTimeout(2000);
  await saveOptimizedScreenshot(budsPage, budsDir, 'budsletsmeet (11).png');

  // Populate & Capture Screenshot 12: Reusable Crew Group Management (/dashboard/groups/65f486ce-1059-411c-8338-41175143e54b)
  console.log('[Buds 12/12] Reusable Group Detail & Crew Management');
  await budsPage.goto('https://budsletsmeet.vercel.app/dashboard/groups/65f486ce-1059-411c-8338-41175143e54b', { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
  await budsPage.waitForTimeout(2000);
  // Add a person to "People to remember" if inputs exist
  const groupPageInputs = await budsPage.locator('input').all();
  if (groupPageInputs.length >= 2) {
    await groupPageInputs[0].fill('Sofia Chen');
    await groupPageInputs[1].fill('sofia.chen@gmail.com');
    const addPersonBtn = budsPage.getByRole('button', { name: /Add person/i });
    if (await addPersonBtn.count() > 0) {
      await addPersonBtn.click();
      await budsPage.waitForTimeout(2000);
    }
  }
  await budsPage.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await budsPage.waitForTimeout(600);
  await saveOptimizedScreenshot(budsPage, budsDir, 'budsletsmeet (12).png');

  await budsCtx.close();
  await browser.close();
  console.log('\nFinished capturing all 24 screenshots for Stealth Concreting and Budsletsmeet!');
}

captureStealthAndBuds().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

