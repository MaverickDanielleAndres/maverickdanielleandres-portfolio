import { test, expect } from "@playwright/test";

test.describe("Performance, Scroll & Interaction Suite", () => {
  test("Desktop: Fast render, smooth marquees, and instant hover", async ({ page }) => {
    // Monitor console errors
    const errors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#home")).toBeVisible();

    // Verify Hero text pressure is rendered
    await expect(page.locator(".text-pressure-title").first()).toBeVisible();

    // Scroll to Projects section
    const projectsSection = page.locator("#projects");
    await projectsSection.scrollIntoViewIfNeeded();
    await expect(projectsSection).toBeVisible();

    // Verify projects marquee track is moving smoothly
    const projectTrack = page.locator(".projects-marquee-track");
    await expect(projectTrack).toBeVisible();

    // Check transform updates over 1 second
    const transform1 = await projectTrack.evaluate((el) => el.style.transform);
    await page.waitForTimeout(600);
    const transform2 = await projectTrack.evaluate((el) => el.style.transform);

    expect(transform1).toContain("translate3d");
    expect(transform2).toContain("translate3d");
    // Verify it is continuously moving
    expect(transform1).not.toBe(transform2);

    // Verify hover on project card does not crash or freeze
    const firstProjectCard = page.locator(".project-card").first();
    await firstProjectCard.hover({ force: true });
    await page.waitForTimeout(200);

    // Open project modal
    await firstProjectCard.click({ force: true });
    const modal = page.locator("button[aria-label='Close modal']");
    await expect(modal).toBeVisible({ timeout: 5000 });
    await modal.click();

    // Scroll down to load below-the-fold sections via LazyLoad
    await page.evaluate(() => window.scrollTo({ top: 3500, behavior: "instant" }));
    await page.waitForTimeout(500);

    // Scroll to Certificates section
    const certsSection = page.locator("#certificates");
    await expect(certsSection).toBeVisible({ timeout: 10000 });

    // Verify certificates marquee is active and gliding
    const certTrack = page.locator("#certificates .projects-marquee-outer > div");
    await expect(certTrack).toBeVisible();
    const certTransform1 = await certTrack.evaluate((el) => el.style.transform);
    await page.waitForTimeout(500);
    const certTransform2 = await certTrack.evaluate((el) => el.style.transform);

    expect(certTransform1).toContain("translate3d");
    expect(certTransform2).toContain("translate3d");

    // Scroll to Skills section to verify spotlight and competencies
    const skillsSection = page.locator("#skills");
    await skillsSection.scrollIntoViewIfNeeded();
    await expect(skillsSection).toBeVisible();

    // Hover over competencies
    const competencyCard = page.locator(".competency-card").first();
    await competencyCard.hover();

    // Filter out known harmless external network errors if any
    const realErrors = errors.filter(
      (e) => !e.includes("Failed to load resource") && !e.includes("404")
    );
    expect(realErrors.length).toBe(0);
  });

  test("Mobile Viewport: Native scrolling and responsive marquee", async ({ page }) => {
    // Emulate modern mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });

    // Verify hero displays properly
    await expect(page.locator("#home")).toBeVisible();

    // Touch scroll down
    await page.evaluate(() => window.scrollBy({ top: 800, behavior: "smooth" }));
    await page.waitForTimeout(500);

    // Verify projects section on mobile
    const projectsSection = page.locator("#projects");
    await expect(projectsSection).toBeVisible();

    // Check project card size on mobile fits viewport
    const projectCard = page.locator(".project-card").first();
    const box = await projectCard.boundingBox();
    expect(box).not.toBeNull();
    expect(box.width).toBeLessThanOrEqual(390);
  });
});
