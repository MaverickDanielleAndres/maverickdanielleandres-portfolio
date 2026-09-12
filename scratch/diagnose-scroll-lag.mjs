import { chromium } from "playwright";

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  const longTasks = [];
  const consoleMessages = [];

  page.on("console", (msg) => consoleMessages.push(`[${msg.type()}] ${msg.text()}`));
  page.on("pageerror", (err) => consoleMessages.push(`[PAGE_ERROR] ${err.message}`));

  await page.addInitScript(() => {
    window.__longTasks = [];
    window.__fpsSamples = [];
    
    // Track long tasks
    try {
      const po = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          window.__longTasks.push({
            name: entry.name,
            startTime: Math.round(entry.startTime),
            duration: Math.round(entry.duration),
          });
        }
      });
      po.observe({ entryTypes: ["longtask"] });
    } catch (e) {}

    // Track frame timing
    let lastTime = performance.now();
    function checkFrame(time) {
      const delta = time - lastTime;
      if (delta > 32) { // Dropped frame (took longer than 32ms = < 30fps)
        window.__fpsSamples.push({ time: Math.round(time), delta: Math.round(delta) });
      }
      lastTime = time;
      requestAnimationFrame(checkFrame);
    }
    requestAnimationFrame(checkFrame);
  });

  console.log("Navigating to http://localhost:3000...");
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  console.log("Initial load complete. Now simulating scroll into Projects...");

  // Simulate user scrolling down gradually like a real user with mouse wheel
  for (let i = 0; i < 20; i++) {
    await page.mouse.wheel(0, 150);
    // Also move mouse across the screen while scrolling
    await page.mouse.move(500 + (i % 5) * 50, 400 + (i % 5) * 50);
    await page.waitForTimeout(100);
  }

  await page.waitForTimeout(1000);

  // Measure what happened during that scroll
  const metrics = await page.evaluate(() => {
    return {
      scrollY: window.scrollY,
      innerHeight: window.innerHeight,
      scrollHeight: document.documentElement.scrollHeight,
      longTasks: window.__longTasks,
      droppedFrames: window.__fpsSamples.slice(-30),
      totalDroppedFrames: window.__fpsSamples.length,
    };
  });

  console.log("\n=== SCROLL & PERFORMANCE METRICS ===");
  console.log(`Scroll Y: ${metrics.scrollY} / ${metrics.scrollHeight}`);
  console.log(`Total Long Tasks (>50ms): ${metrics.longTasks.length}`);
  metrics.longTasks.forEach((lt, idx) => {
    console.log(`  Task #${idx + 1}: at ${lt.startTime}ms, duration: ${lt.duration}ms`);
  });
  console.log(`Total Dropped Frames (>32ms): ${metrics.totalDroppedFrames}`);
  console.log("Recent dropped frames (delta in ms):", metrics.droppedFrames);

  console.log("\n=== CONSOLE MESSAGES ===");
  consoleMessages.slice(0, 10).forEach(m => console.log(m));

  await browser.close();
}

run().catch(console.error);
