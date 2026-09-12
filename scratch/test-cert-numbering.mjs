import { chromium } from "playwright";

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });

  // Scroll down to load Certificates
  await page.evaluate(() => window.scrollTo({ top: 4000, behavior: "instant" }));
  await page.waitForTimeout(600);

  const certsSection = page.locator("#certificates");
  await certsSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  // Take screenshot of certificates cards
  await certsSection.screenshot({ path: "scratch/cert-numbering.png" });
  console.log("Captured cert-numbering.png");
  await browser.close();
}

run().catch(console.error);
