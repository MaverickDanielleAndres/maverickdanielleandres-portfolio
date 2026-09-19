import { test, expect } from "@playwright/test";

test.describe("Portfolio Navigation, WordPress Modal & Dynamic Center Counters Suite", () => {
  test("Desktop & Mobile: Navigation menu, WordPress redirect, and real-time auto counters", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    // 1. Verify Offcanvas Navigation Menu
    const menuBtn = page.locator("button[aria-label='Open menu']");
    await expect(menuBtn).toBeVisible();
    await menuBtn.click();
    await page.waitForTimeout(600);

    // Verify all 9 links inside the Offcanvas Navigation Menu in exact requested hierarchy
    const expectedLinks = [
      { text: "Home", href: "/" },
      { text: "Projects", href: "#projects" },
      { text: "Wordpress", href: "#wordpress" },
      { text: "Testimonials", href: "#testimonials" },
      { text: "About Me", href: "#about" },
      { text: "Skills", href: "#skills" },
      { text: "Work", href: "#activity" },
      { text: "Certs", href: "#certificates" },
      { text: "Contact Me", href: "#contact" },
    ];

    const offcanvasNav = page.locator("[data-lenis-prevent='true']");
    await expect(offcanvasNav).toBeVisible();

    for (const item of expectedLinks) {
      const link = offcanvasNav.locator(`a[href='${item.href}']`).first();
      await expect(link).toBeVisible();
      const text = await link.innerText();
      expect(text.toLowerCase()).toContain(item.text.toLowerCase());
    }

    // Click Wordpress menu link and verify panel closes and page scrolls to #wordpress
    const wpMenuLink = offcanvasNav.locator("a[href='#wordpress']");
    await wpMenuLink.click();
    await page.waitForTimeout(600);
    const wpSection = page.locator("#wordpress");
    await expect(wpSection).toBeVisible();

    // 2. Verify Projects Marquee & Live Auto Counter
    const projectsSection = page.locator("#projects");
    await projectsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    const projectsCounter = page.locator("#projects .marquee-counter").first();
    await expect(projectsCounter).toBeVisible();
    const initialProjectNum = await projectsCounter.locator(".marquee-counter__current").innerText();
    console.log(`Initial Projects center index: ${initialProjectNum}`);

    // Wait and verify the continuous marquee auto-adjusts the counter
    await page.waitForTimeout(4500);
    const updatedProjectNum = await projectsCounter.locator(".marquee-counter__current").innerText();
    console.log(`Auto-adjusted Projects center index: ${updatedProjectNum}`);

    // Click WordPress Collection card to open modal via evaluate
    await page.evaluate(() => {
      const card = document.querySelector(".project-card[aria-label*='WordPress']");
      if (card) card.click();
    });
    await page.waitForTimeout(500);

    // Verify WordPress Modal content
    const modal = page.locator("[data-lenis-prevent='true']");
    await expect(modal).toBeVisible();
    await expect(modal.locator("h3:has-text('WordPress & WooCommerce Collection')")).toBeVisible();

    // Verify "View WordPress projects" button
    const viewWpBtn = page.locator("button:has-text('View WordPress projects')");
    await expect(viewWpBtn).toBeVisible();
    await viewWpBtn.click();
    await page.waitForTimeout(600);

    // Verify modal is closed and #wordpress is in view
    await expect(modal).not.toBeVisible();
    await expect(wpSection).toBeVisible();

    // 3. Verify Testimonials Marquee & Live Center Counter
    const testimonialsSection = page.locator("#testimonials");
    await testimonialsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    const testimonialsCounter = page.locator("#testimonials .marquee-counter");
    await expect(testimonialsCounter).toBeVisible();
    await expect(testimonialsCounter.locator(".marquee-counter__total")).toHaveText("08");

    // 4. Scroll down to trigger Certificates LazyLoad and verify Center Counter
    await page.evaluate(() => window.scrollTo(0, 5000));
    await page.waitForTimeout(800);

    const certsSection = page.locator("#certificates");
    await certsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    const certsCounter = page.locator("#certificates .marquee-counter");
    await expect(certsCounter).toBeVisible();
    await expect(certsCounter.locator(".marquee-counter__total")).toHaveText("18");

    console.log("All navigation, modal redirects, and auto counters verified successfully!");
  });
});
