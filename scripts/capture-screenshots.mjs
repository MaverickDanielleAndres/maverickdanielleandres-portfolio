import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const AFS_DIR = path.resolve('public/Projects/allfireservices/screenshots');
const SHIMMEUR_DIR = path.resolve('public/Projects/shimmeur/screenshots');

// Ensure directories exist
fs.mkdirSync(AFS_DIR, { recursive: true });
fs.mkdirSync(SHIMMEUR_DIR, { recursive: true });

// Clean old files
for (const file of fs.readdirSync(AFS_DIR)) {
  fs.unlinkSync(path.join(AFS_DIR, file));
}
for (const file of fs.readdirSync(SHIMMEUR_DIR)) {
  fs.unlinkSync(path.join(SHIMMEUR_DIR, file));
}
console.log('Cleaned old screenshots in both directories.');

async function run() {
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--host-resolver-rules=MAP allfireservices.com.au 172.67.170.201, MAP *.allfireservices.com.au 172.67.170.201',
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox'
    ]
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.25
  });

  const page = await context.newPage();

  // ----------------------------------------------------
  // 1. ALL FIRE SERVICES AUSTRALIA (15 Screenshots)
  // ----------------------------------------------------
  console.log('\n--- Capturing All Fire Services Screenshots ---');
  
  const afsCaptures = [
    { num: 1, url: 'https://allfireservices.com.au/', scrollY: 0, desc: 'Home Hero' },
    { num: 2, url: 'https://allfireservices.com.au/', scrollY: 650, desc: 'Home Services Quick View / Badges' },
    { num: 3, url: 'https://allfireservices.com.au/', scrollY: 1350, desc: 'Home Key Services Grid' },
    { num: 4, url: 'https://allfireservices.com.au/', scrollY: 2150, desc: 'Home Compliance & Experience' },
    { num: 5, url: 'https://allfireservices.com.au/', scrollY: 2900, desc: 'Home Why Choose Us / CTA' },
    { num: 6, url: 'https://allfireservices.com.au/about', scrollY: 0, desc: 'About Us Hero' },
    { num: 7, url: 'https://allfireservices.com.au/about', scrollY: 700, desc: 'About Us Story & Mission' },
    { num: 8, url: 'https://allfireservices.com.au/services', scrollY: 0, desc: 'Services Hub Hero' },
    { num: 9, url: 'https://allfireservices.com.au/services', scrollY: 800, desc: 'Services Offerings Grid' },
    { num: 10, url: 'https://allfireservices.com.au/services', scrollY: 1700, desc: 'Services Compliance & Standards' },
    { num: 11, url: 'https://allfireservices.com.au/our-team', scrollY: 0, desc: 'Our Team Page Hero' },
    { num: 12, url: 'https://allfireservices.com.au/our-team', scrollY: 600, desc: 'Our Team Members Grid' },
    { num: 13, url: 'https://allfireservices.com.au/our-clients', scrollY: 0, desc: 'Our Clients Page' },
    { num: 14, url: 'https://allfireservices.com.au/why-all-fire', scrollY: 0, desc: 'Why All Fire Page' },
    { num: 15, url: 'https://allfireservices.com.au/contact', scrollY: 0, desc: 'Contact Us & Booking Portal' },
  ];

  for (const item of afsCaptures) {
    try {
      console.log(`[AFS ${item.num}/15] ${item.desc} (${item.url})...`);
      await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 25000 });
      await page.waitForTimeout(2000);
      if (item.scrollY > 0) {
        await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), item.scrollY);
        await page.waitForTimeout(1000);
      }
      const dest = path.join(AFS_DIR, `allfireservices (${item.num}).png`);
      await page.screenshot({ path: dest, type: 'png' });
      console.log(`  -> Saved ${dest}`);
    } catch (e) {
      console.error(`  -> Failed AFS ${item.num}:`, e.message);
    }
  }

  // ----------------------------------------------------
  // 2. SHIMMEUR (15 Screenshots)
  // ----------------------------------------------------
  console.log('\n--- Capturing Shimmeur Screenshots ---');

  const shimCaptures = [
    { num: 1, url: 'https://shimmeur.co/', scrollY: 0, desc: 'Home Hero' },
    { num: 2, url: 'https://shimmeur.co/', scrollY: 750, desc: 'Philosophy & Lifestyle Vision' },
    { num: 3, url: 'https://shimmeur.co/', scrollY: 1500, desc: 'Property Consultation & Value Add' },
    { num: 4, url: 'https://shimmeur.co/', scrollY: 2300, desc: 'Renovation Management & Design' },
    { num: 5, url: 'https://shimmeur.co/', scrollY: 3100, desc: 'Featured Projects Showcase' },
    { num: 6, url: 'https://shimmeur.co/', scrollY: 3900, desc: 'Before & After Transformations' },
    { num: 7, url: 'https://shimmeur.co/', scrollY: 4700, desc: 'Client Stories & Testimonials' },
    { num: 8, url: 'https://shimmeur.co/', scrollY: 5500, desc: 'Founder Profile & Philosophy' },
    { num: 9, url: 'https://shimmeur.co/', scrollY: 6300, desc: 'Capital Partner & Investment' },
    { num: 10, url: 'https://shimmeur.co/', scrollY: 7100, desc: 'E-Book / Property Guide' },
    { num: 11, url: 'https://shimmeur.co/design-inspiration', scrollY: 0, desc: 'Design Inspiration Hero' },
    { num: 12, url: 'https://shimmeur.co/design-inspiration', scrollY: 800, desc: 'Design Inspiration Gallery' },
    { num: 13, url: 'https://shimmeur.co/portfolio/the-entrance', scrollY: 0, desc: 'The Entrance Case Study' },
    { num: 14, url: 'https://shimmeur.co/portfolio/baulkham-hills', scrollY: 0, desc: 'Baulkham Hills Case Study' },
    { num: 15, url: 'https://shimmeur.co/before-you-list', scrollY: 0, desc: 'Before You List Guide' },
  ];

  for (const item of shimCaptures) {
    try {
      console.log(`[Shimmeur ${item.num}/15] ${item.desc} (${item.url})...`);
      await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 25000 });
      await page.waitForTimeout(2500);
      if (item.scrollY > 0) {
        await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), item.scrollY);
        await page.waitForTimeout(1000);
      }
      const dest = path.join(SHIMMEUR_DIR, `shimmeur (${item.num}).png`);
      await page.screenshot({ path: dest, type: 'png' });
      console.log(`  -> Saved ${dest}`);
    } catch (e) {
      console.error(`  -> Failed Shimmeur ${item.num}:`, e.message);
    }
  }

  await browser.close();
  console.log('\nFinished all screenshot captures successfully!');
}

run();
