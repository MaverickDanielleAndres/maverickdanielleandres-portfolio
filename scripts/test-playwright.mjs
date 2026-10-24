import { chromium } from '@playwright/test';

async function test() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  console.log('Playwright chromium launched successfully!');
  await browser.close();
}

test().catch(err => {
  console.error('Error launching playwright:', err);
  process.exit(1);
});
