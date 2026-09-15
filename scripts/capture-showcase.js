const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'public', 'Projects', 'wordpress-sites');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const sites = [
  { id: 'nexvision', name: 'NexVision Innovations', url: 'https://nexvision.info/' },
  { id: 'maranellosconcord', name: 'Maranellos Auto Services', url: 'https://maranellosconcord.com.au/' },
  { id: 'ovenelements', name: 'Oven Elements Australia', url: 'https://ovenelements.com.au/' },
  { id: 'truckelectrical', name: 'Truck Electrical Services', url: 'https://truckelectrical.com.au/' },
  { id: 'ajlautoelectrical', name: 'AJL Auto Electrical', url: 'https://ajlautoelectrical.com.au/' },
  { id: 'crystalbuildingsupplies', name: 'Crystal Building Supplies', url: 'https://crystalbuildingsupplies.com.au/' },
  { id: 'burwoodmechanics', name: 'Burwood Mechanics', url: 'https://burwoodmechanics.com.au/' },
  { id: 'mojdebeauty', name: 'Mojde Beauty', url: 'https://mojde.beauty/' }
];

async function capture() {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    ignoreHTTPSErrors: true,
  });

  for (const site of sites) {
    const outFile = path.join(targetDir, `${site.id}.png`);
    console.log(`Capturing ${site.name} (${site.url})...`);
    try {
      const page = await context.newPage();
      await page.goto(site.url, { waitUntil: 'networkidle', timeout: 30000 }).catch(async (e) => {
        console.warn(`Networkidle timeout for ${site.url}, proceeding with load: ${e.message}`);
        await page.waitForLoadState('load', { timeout: 15000 }).catch(() => {});
      });
      await page.waitForTimeout(2000);
      await page.screenshot({ path: outFile, type: 'png' });
      console.log(`✓ Saved ${outFile}`);
      await page.close();
    } catch (err) {
      console.error(`✗ Error capturing ${site.url}:`, err.message);
    }
  }

  await browser.close();
  console.log('Finished capturing screenshots!');
}

capture();
