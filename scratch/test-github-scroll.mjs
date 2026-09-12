import { chromium } from "playwright";

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const page = await context.newPage();
  
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

  // Scroll down to Activity section
  await page.evaluate(() => window.scrollTo({ top: 3000, behavior: "instant" }));
  await page.waitForTimeout(1000);

  const activitySection = page.locator("#activity");
  await activitySection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);

  const calendarContainer = page.locator("#activity .overflow-x-auto");
  await calendarContainer.waitFor({ state: "visible", timeout: 10000 });

  const metrics = await calendarContainer.evaluate((el) => {
    return {
      scrollLeft: el.scrollLeft,
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
      maxScroll: el.scrollWidth - el.clientWidth,
    };
  });

  console.log("Calendar metrics on mobile:", metrics);
  await page.screenshot({ path: "scratch/mobile-github.png" });
  await browser.close();
}

run().catch(console.error);
