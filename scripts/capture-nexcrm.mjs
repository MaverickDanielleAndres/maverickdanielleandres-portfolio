import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function preScrollPage(page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= height; y += 600) {
    await page.evaluate((pos) => window.scrollTo({ top: pos, behavior: 'instant' }), y);
    await page.waitForTimeout(150);
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(600);
}

async function dismissCookies(page) {
  try {
    const declineBtn = page.getByRole('button', { name: /^Decline$|^Accept$/i }).first();
    if (await declineBtn.isVisible({ timeout: 1500 })) {
      await declineBtn.click();
      await page.waitForTimeout(500);
    }
  } catch {}
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

async function captureNexcrm() {
  const targetDir = path.resolve('public/Projects/nexcrm-ai/screenshots');
  fs.mkdirSync(targetDir, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-blink-features=AutomationControlled']
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.25
  });

  const page = await context.newPage();

  // 1-5: Home page sections
  console.log('Loading https://nexcrm-ai.com/ ...');
  await page.goto('https://nexcrm-ai.com/', { waitUntil: 'networkidle', timeout: 35000 }).catch(() => {});
  await page.waitForTimeout(2000);
  await dismissCookies(page);
  await preScrollPage(page);

  // [1] Hero section
  console.log('[1/10] Home Hero & Interactive NexAgent Demo');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(800);
  await saveOptimizedScreenshot(page, targetDir, 'nexcrm-ai (1).png');

  // [2] #ai section - NexAgent Dashboard & Approval Card
  console.log('[2/10] NexAgent AI Workspace & Approval Workflow');
  await page.evaluate(() => {
    const el = document.getElementById('ai');
    if (el) el.scrollIntoView({ behavior: 'instant' });
    else window.scrollTo({ top: 860, behavior: 'instant' });
  });
  await page.waitForTimeout(1000);
  await saveOptimizedScreenshot(page, targetDir, 'nexcrm-ai (2).png');

  // [3] #see-it section - One lead, from inquiry to closed-won
  console.log('[3/10] Interactive Lead-to-Closed-Won CRM Tour');
  await page.evaluate(() => {
    const el = document.getElementById('see-it');
    if (el) el.scrollIntoView({ behavior: 'instant' });
    else window.scrollTo({ top: 2380, behavior: 'instant' });
  });
  await page.waitForTimeout(1000);
  await saveOptimizedScreenshot(page, targetDir, 'nexcrm-ai (3).png');

  // [4] #pipeline section - Drag a deal Kanban board
  console.log('[4/10] Real-Time Kanban Sales Pipeline Board');
  await page.evaluate(() => {
    const el = document.getElementById('pipeline');
    if (el) el.scrollIntoView({ behavior: 'instant' });
    else window.scrollTo({ top: 3450, behavior: 'instant' });
  });
  await page.waitForTimeout(1000);
  await saveOptimizedScreenshot(page, targetDir, 'nexcrm-ai (4).png');

  // [5] #integrations & #who-its-for
  console.log('[5/10] Omnichannel & MCP Integrations + Industry Workflows');
  await page.evaluate(() => {
    const el = document.getElementById('integrations');
    if (el) el.scrollIntoView({ behavior: 'instant' });
    else window.scrollTo({ top: 4350, behavior: 'instant' });
  });
  await page.waitForTimeout(1000);
  await saveOptimizedScreenshot(page, targetDir, 'nexcrm-ai (5).png');

  // 6-8: Product Guide (/guide)
  console.log('Loading https://nexcrm-ai.com/guide ...');
  await page.goto('https://nexcrm-ai.com/guide', { waitUntil: 'networkidle', timeout: 35000 }).catch(() => {});
  await page.waitForTimeout(2000);
  await dismissCookies(page);
  await preScrollPage(page);

  // [6] Product Guide Hero + Leads & Lead Capture
  console.log('[6/10] Product Guide: Leads & Lead Capture Intake');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(800);
  await saveOptimizedScreenshot(page, targetDir, 'nexcrm-ai (6).png');

  // [7] Product Guide: Proposals / Projects
  console.log('[7/10] Product Guide: Proposals & Deal Execution');
  await page.evaluate(() => {
    const el = document.getElementById('proposals');
    if (el) el.scrollIntoView({ behavior: 'instant' });
    else window.scrollTo({ top: 3200, behavior: 'instant' });
  });
  await page.waitForTimeout(1000);
  await saveOptimizedScreenshot(page, targetDir, 'nexcrm-ai (7).png');

  // [8] Product Guide: Automation & AI Agents
  console.log('[8/10] Product Guide: Automation & AI Agents');
  await page.evaluate(() => {
    const el = document.getElementById('automation');
    if (el) el.scrollIntoView({ behavior: 'instant' });
    else window.scrollTo({ top: 6800, behavior: 'instant' });
  });
  await page.waitForTimeout(1000);
  await saveOptimizedScreenshot(page, targetDir, 'nexcrm-ai (8).png');

  // [9] Use Cases (/use-cases)
  console.log('[9/10] Industry Use Cases Page (/use-cases)');
  await page.goto('https://nexcrm-ai.com/use-cases', { waitUntil: 'networkidle', timeout: 35000 }).catch(() => {});
  await page.waitForTimeout(1800);
  await dismissCookies(page);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(800);
  await saveOptimizedScreenshot(page, targetDir, 'nexcrm-ai (9).png');

  // [10] Pricing & AI Credit Tiers (/pricing)
  console.log('[10/10] Pricing & AI Credit Plans (/pricing)');
  await page.goto('https://nexcrm-ai.com/pricing', { waitUntil: 'networkidle', timeout: 35000 }).catch(() => {});
  await page.waitForTimeout(1800);
  await dismissCookies(page);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(800);
  await saveOptimizedScreenshot(page, targetDir, 'nexcrm-ai (10).png');

  await browser.close();
  console.log('\nAll 10 NexCRM AI screenshots captured and optimized!');
}

captureNexcrm().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

