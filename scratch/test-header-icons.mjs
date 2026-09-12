import { chromium } from "playwright";

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const page = await context.newPage();
  
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);

  // Take screenshot of the top header with floating action buttons
  await page.screenshot({ path: "scratch/header-icons.png", clip: { x: 0, y: 0, width: 390, height: 80 } });
  console.log("Captured header-icons.png");
  await browser.close();
}

run().catch(console.error);
