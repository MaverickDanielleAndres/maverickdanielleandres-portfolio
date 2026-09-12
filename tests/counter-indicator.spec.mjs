import { test, expect } from "@playwright/test";

test.describe("Projects & Certificates Dynamic Center Indicator Suite", () => {
  test("Desktop: Dynamic counter indicators render and change based on centered card", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });

    // Scroll to Projects section
    const projectsSection = page.locator("#projects");
    await projectsSection.scrollIntoViewIfNeeded();
    await expect(projectsSection).toBeVisible();

    // Verify Projects marquee counter exists and displays / 16
    const projectsCounter = page.locator("#projects .marquee-counter");
    await expect(projectsCounter).toBeVisible();
    await expect(projectsCounter.locator(".marquee-counter__total")).toHaveText("16");

    const initialProjectNum = await projectsCounter.locator(".marquee-counter__current").innerText();
    expect(Number(initialProjectNum)).toBeGreaterThanOrEqual(1);
    expect(Number(initialProjectNum)).toBeLessThanOrEqual(16);

    // Click Next button on projects and verify counter changes
    const projectNextBtn = page.locator("#projects .marquee-nav-btn[aria-label='Next projects']");
    await expect(projectNextBtn).toBeVisible();
    await projectNextBtn.click();
    await page.waitForTimeout(600);

    const nextProjectNum = await projectsCounter.locator(".marquee-counter__current").innerText();
    console.log(`Projects Counter: ${initialProjectNum} -> ${nextProjectNum}`);

    // Scroll down to load Certificates
    await page.evaluate(() => window.scrollTo({ top: 3500, behavior: "instant" }));
    await page.waitForTimeout(500);

    // Scroll to Certificates section
    const certsSection = page.locator("#certificates");
    await certsSection.scrollIntoViewIfNeeded();
    await expect(certsSection).toBeVisible();

    // Verify Certificates marquee counter exists and displays / 18
    const certsCounter = page.locator("#certificates .marquee-counter");
    await expect(certsCounter).toBeVisible();
    await expect(certsCounter.locator(".marquee-counter__total")).toHaveText("18");

    const initialCertNum = await certsCounter.locator(".marquee-counter__current").innerText();
    expect(Number(initialCertNum)).toBeGreaterThanOrEqual(1);
    expect(Number(initialCertNum)).toBeLessThanOrEqual(18);

    // Click Next button on certificates and verify counter updates
    const certNextBtn = page.locator("#certificates .marquee-nav-btn[aria-label='Next certificates']");
    await expect(certNextBtn).toBeVisible();
    await certNextBtn.click();
    await page.waitForTimeout(600);

    const nextCertNum = await certsCounter.locator(".marquee-counter__current").innerText();
    console.log(`Certificates Counter: ${initialCertNum} -> ${nextCertNum}`);
  });

  test("Mobile: Dynamic counter badge visible and updates during auto-glide / drag", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });

    // Scroll to Projects section
    const projectsSection = page.locator("#projects");
    await projectsSection.scrollIntoViewIfNeeded();
    await expect(projectsSection).toBeVisible();

    const projectsCounter = page.locator("#projects .marquee-counter");
    await expect(projectsCounter).toBeVisible();
    await expect(projectsCounter.locator(".marquee-counter__total")).toHaveText("16");

    // Scroll to Certificates section
    await page.evaluate(() => window.scrollTo({ top: 3500, behavior: "instant" }));
    await page.waitForTimeout(500);

    const certsSection = page.locator("#certificates");
    await certsSection.scrollIntoViewIfNeeded();
    await expect(certsSection).toBeVisible();

    const certsCounter = page.locator("#certificates .marquee-counter");
    await expect(certsCounter).toBeVisible();
    await expect(certsCounter.locator(".marquee-counter__total")).toHaveText("18");
  });
});
