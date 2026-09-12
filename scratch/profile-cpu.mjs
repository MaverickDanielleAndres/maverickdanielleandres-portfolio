import { chromium } from "playwright";

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  const client = await context.newCDPSession(page);

  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Scroll into Projects
  await page.evaluate(() => window.scrollTo(0, 800));
  await page.waitForTimeout(500);

  console.log("Starting CPU Profiler during scrolling on Projects...");
  await client.send("Profiler.enable");
  await client.send("Profiler.start");

  // Simulate scrolling and moving mouse for 2 seconds
  for (let i = 0; i < 20; i++) {
    await page.mouse.wheel(0, 100);
    await page.mouse.move(400 + (i * 20) % 500, 300 + (i * 15) % 400);
    await page.waitForTimeout(50);
  }

  const { profile } = await client.send("Profiler.stop");
  await client.send("Profiler.disable");

  // Aggregate time spent in functions
  const nodeMap = new Map();
  for (const node of profile.nodes) {
    nodeMap.set(node.id, {
      name: node.callFrame.functionName || "(anonymous)",
      url: node.callFrame.url || "(inline)",
      line: node.callFrame.lineNumber,
      hitCount: node.hitCount || 0,
      totalDuration: 0,
    });
  }

  // Calculate self-time
  const samples = profile.samples || [];
  const timeDeltas = profile.timeDeltas || [];
  for (let i = 0; i < samples.length; i++) {
    const id = samples[i];
    const delta = timeDeltas[i] || 0;
    if (nodeMap.has(id)) {
      nodeMap.get(id).totalDuration += delta;
    }
  }

  const sorted = Array.from(nodeMap.values())
    .filter(n => n.totalDuration > 5000) // > 5ms (durations are in microseconds)
    .sort((a, b) => b.totalDuration - a.totalDuration);

  console.log("\n=== TOP CPU CONSUMING FUNCTIONS (in microseconds) ===");
  sorted.slice(0, 30).forEach(n => {
    const file = n.url.split("/").pop();
    console.log(`${(n.totalDuration / 1000).toFixed(2)}ms : ${n.name} (${file}:${n.line})`);
  });

  await browser.close();
}

run().catch(console.error);
