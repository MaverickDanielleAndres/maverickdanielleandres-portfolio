import { test, expect } from "@playwright/test";

test.describe("Full Carousel Drag, Swipe & Navigation Suite", () => {
  test("Comprehensive verification of Projects, Testimonials, and Certificates carousels", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    const getTx = async (selector) => {
      return page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (!el) return 0;
        const style = window.getComputedStyle(el);
        const matrix = new DOMMatrixReadOnly(style.transform);
        return matrix.m41;
      }, selector);
    };

    // ── 1. Projects Carousel
    console.log("=== Testing Projects Section ===");
    const projectsSection = page.locator("#projects");
    await projectsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    const projectsTrack = page.locator("#projects .projects-marquee-track");
    await expect(projectsTrack).toBeVisible();

    const pInit = await getTx("#projects .projects-marquee-track");
    console.log(`Projects Initial Pos: ${pInit}`);
    expect(pInit).toBeLessThan(-500); // Initialized in middle set

    // Click Next button on projects
    const pNextBtn = page.locator("#projects button[aria-label='Next projects']");
    await pNextBtn.click();
    await page.waitForTimeout(400);
    const pAfterNext = await getTx("#projects .projects-marquee-track");
    console.log(`Projects After Next Button Click: ${pAfterNext}`);
    expect(pAfterNext).toBeLessThan(pInit); // Moving left

    // Click Prev button on projects
    const pPrevBtn = page.locator("#projects button[aria-label='Previous projects']");
    await pPrevBtn.click();
    await page.waitForTimeout(400);
    const pAfterPrev = await getTx("#projects .projects-marquee-track");
    console.log(`Projects After Prev Button Click: ${pAfterPrev}`);
    expect(pAfterPrev).toBeGreaterThan(pAfterNext); // Moving right

    // Mouse drag test on Projects
    const pOuter = page.locator("#projects .projects-marquee-outer");
    const pBox = await pOuter.boundingBox();
    const pStartX = pBox.x + pBox.width * 0.7;
    const pStartY = pBox.y + pBox.height * 0.5;
    const pTargetX = pBox.x + pBox.width * 0.3;

    // Swipe left (mouse moves right to left)
    await page.mouse.move(pStartX, pStartY);
    await page.mouse.down();
    await page.waitForTimeout(50);
    for (let x = pStartX; x >= pTargetX; x -= 30) {
      await page.mouse.move(x, pStartY);
      await page.waitForTimeout(16);
    }
    await page.mouse.up();
    await page.waitForTimeout(200);
    const pAfterDragLeft = await getTx("#projects .projects-marquee-track");
    console.log(`Projects After Drag Left: ${pAfterDragLeft}`);
    expect(pAfterDragLeft).toBeLessThan(pAfterPrev);

    // Swipe right (mouse moves left to right)
    await page.mouse.move(pTargetX, pStartY);
    await page.mouse.down();
    await page.waitForTimeout(50);
    for (let x = pTargetX; x <= pStartX; x += 30) {
      await page.mouse.move(x, pStartY);
      await page.waitForTimeout(16);
    }
    await page.mouse.up();
    await page.waitForTimeout(200);
    const pAfterDragRight = await getTx("#projects .projects-marquee-track");
    console.log(`Projects After Drag Right: ${pAfterDragRight}`);
    expect(pAfterDragRight).toBeGreaterThan(pAfterDragLeft);

    // Test clicking a visible card at the center to open modal
    await page.mouse.click(pBox.x + pBox.width * 0.5, pBox.y + pBox.height * 0.5);
    await page.waitForTimeout(400);
    const modalCloseBtn = page.locator("button[aria-label='Close modal']");
    if (await modalCloseBtn.isVisible()) {
      console.log("Project modal opened on click successfully!");
      await modalCloseBtn.click();
      await page.waitForTimeout(300);
    }

    // ── 2. Testimonials Carousel
    console.log("=== Testing Testimonials Section ===");
    const testSection = page.locator("#testimonials");
    await testSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    const testTrack = page.locator("#testimonials .testimonials-track");
    await expect(testTrack).toBeVisible();

    const tInit = await getTx("#testimonials .testimonials-track");
    console.log(`Testimonials Initial Pos: ${tInit}`);
    expect(tInit).toBeLessThan(-200);

    const tNextBtn = page.locator("#testimonials button[aria-label='Next testimonials']");
    await tNextBtn.click();
    await page.waitForTimeout(400);
    const tAfterNext = await getTx("#testimonials .testimonials-track");
    console.log(`Testimonials After Next: ${tAfterNext}`);
    expect(tAfterNext).toBeLessThan(tInit);

    // ── 3. Certificates Carousel
    console.log("=== Testing Certificates Section ===");
    await page.evaluate(() => window.scrollTo(0, 5500));
    await page.waitForTimeout(800);

    const certsSection = page.locator("#certificates");
    await certsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    const certsTrack = page.locator("#certificates .projects-marquee-track");
    await expect(certsTrack).toBeVisible();

    const cInit = await getTx("#certificates .projects-marquee-track");
    console.log(`Certificates Initial Pos: ${cInit}`);
    expect(cInit).toBeLessThan(-500);

    const cNextBtn = page.locator("#certificates button[aria-label='Next certificates']");
    await cNextBtn.click();
    await page.waitForTimeout(400);
    const cAfterNext = await getTx("#certificates .projects-marquee-track");
    console.log(`Certificates After Next: ${cAfterNext}`);
    expect(cAfterNext).toBeLessThan(cInit);

    const cOuter = page.locator("#certificates .projects-marquee-outer");
    const cBox = await cOuter.boundingBox();
    const cStartX = cBox.x + cBox.width * 0.7;
    const cStartY = cBox.y + cBox.height * 0.5;
    const cTargetX = cBox.x + cBox.width * 0.3;

    await page.mouse.move(cStartX, cStartY);
    await page.mouse.down();
    await page.waitForTimeout(50);
    for (let x = cStartX; x >= cTargetX; x -= 30) {
      await page.mouse.move(x, cStartY);
      await page.waitForTimeout(16);
    }
    await page.mouse.up();
    await page.waitForTimeout(200);
    const cAfterDragLeft = await getTx("#certificates .projects-marquee-track");
    console.log(`Certificates After Drag Left: ${cAfterDragLeft}`);
    expect(cAfterDragLeft).toBeLessThan(cAfterNext);

    await page.mouse.move(cTargetX, cStartY);
    await page.mouse.down();
    await page.waitForTimeout(50);
    for (let x = cTargetX; x <= cStartX; x += 30) {
      await page.mouse.move(x, cStartY);
      await page.waitForTimeout(16);
    }
    await page.mouse.up();
    await page.waitForTimeout(200);
    const cAfterDragRight = await getTx("#certificates .projects-marquee-track");
    console.log(`Certificates After Drag Right: ${cAfterDragRight}`);
    expect(cAfterDragRight).toBeGreaterThan(cAfterDragLeft);

    console.log("ALL CAROUSELS (PROJECTS, TESTIMONIALS, CERTIFICATES) PASSED DRAG & BUTTON TESTS PERFECTLY!");
  });
});
