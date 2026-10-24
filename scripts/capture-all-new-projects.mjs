import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PROJECTS_CONFIG = [
  {
    folder: 'fire-stop-sydney',
    prefix: 'fire-stop-sydney',
    captures: [
      { num: 1, url: 'https://fire-stop-sydney.vercel.app/', scrollY: 0, desc: 'Home Hero' },
      { num: 2, url: 'https://fire-stop-sydney.vercel.app/', scrollY: 830, desc: 'What Passes Through Wall' },
      { num: 3, url: 'https://fire-stop-sydney.vercel.app/', scrollY: 1880, desc: 'Fire Protection Across Building' },
      { num: 4, url: 'https://fire-stop-sydney.vercel.app/', scrollY: 3020, desc: 'Look At The Detail' },
      { num: 5, url: 'https://fire-stop-sydney.vercel.app/', scrollY: 4300, desc: 'Clear Scope From First Inspection' },
      { num: 6, url: 'https://fire-stop-sydney.vercel.app/', scrollY: 4850, desc: 'For People Who Keep Buildings Running' },
      { num: 7, url: 'https://fire-stop-sydney.vercel.app/', scrollY: 5300, desc: 'Good Work Gets Noticed Testimonials' },
      { num: 8, url: 'https://fire-stop-sydney.vercel.app/', scrollY: 6200, desc: 'FAQ & Site Inquiry CTA' },
      { num: 9, url: 'https://fire-stop-sydney.vercel.app/about', scrollY: 0, desc: 'About Us Overview' },
      { num: 10, url: 'https://fire-stop-sydney.vercel.app/services', scrollY: 0, desc: 'Comprehensive Services Page' },
      { num: 11, url: 'https://fire-stop-sydney.vercel.app/projects', scrollY: 0, desc: 'Commercial Projects Showcase' },
      { num: 12, url: 'https://fire-stop-sydney.vercel.app/contact', scrollY: 0, desc: 'Contact & Quote Portal' },
    ]
  },
  {
    folder: 'fire-penetration',
    prefix: 'fire-penetration',
    captures: [
      { num: 1, url: 'https://fire-penetration-website.vercel.app/', scrollY: 0, desc: 'Home Hero - Fire Penetration Made Visible' },
      { num: 2, url: 'https://fire-penetration-website.vercel.app/', scrollY: 1000, desc: 'Built Around The Opening' },
      { num: 3, url: 'https://fire-penetration-website.vercel.app/', scrollY: 2200, desc: 'Right Detail Starts With Right System' },
      { num: 4, url: 'https://fire-penetration-website.vercel.app/', scrollY: 4150, desc: 'Before During After Sealing' },
      { num: 5, url: 'https://fire-penetration-website.vercel.app/', scrollY: 5450, desc: 'Look Closer At The Work' },
      { num: 6, url: 'https://fire-penetration-website.vercel.app/', scrollY: 6580, desc: 'Experienced People & Systems' },
      { num: 7, url: 'https://fire-penetration-website.vercel.app/', scrollY: 7420, desc: 'Client Testimonials' },
      { num: 8, url: 'https://fire-penetration-website.vercel.app/', scrollY: 8500, desc: 'Product Selection & Contact CTA' },
      { num: 9, url: 'https://fire-penetration-website.vercel.app/services', scrollY: 0, desc: 'Specialized Services Hub' },
      { num: 10, url: 'https://fire-penetration-website.vercel.app/products', scrollY: 0, desc: 'Fire Penetration Products & Systems' },
      { num: 11, url: 'https://fire-penetration-website.vercel.app/samples', scrollY: 0, desc: 'Field Samples Gallery' },
      { num: 12, url: 'https://fire-penetration-website.vercel.app/resources', scrollY: 0, desc: 'Compliance & Technical Resources' },
    ]
  },
  {
    folder: 'arjay-fabrication',
    prefix: 'arjay-fabrication',
    captures: [
      { num: 1, url: 'https://arjayfabrication.vercel.app/', scrollY: 0, desc: 'Home Hero - Built for the Job' },
      { num: 2, url: 'https://arjayfabrication.vercel.app/', scrollY: 920, desc: 'Custom Metalwork for Working Life' },
      { num: 3, url: 'https://arjayfabrication.vercel.app/', scrollY: 1550, desc: 'What Can We Build For You Services' },
      { num: 4, url: 'https://arjayfabrication.vercel.app/', scrollY: 2820, desc: 'The Work Tells The Story Portfolio' },
      { num: 5, url: 'https://arjayfabrication.vercel.app/', scrollY: 4140, desc: 'See The Difference Quality Standards' },
      { num: 6, url: 'https://arjayfabrication.vercel.app/', scrollY: 4880, desc: 'Straightforward Fabrication Made to Fit' },
      { num: 7, url: 'https://arjayfabrication.vercel.app/', scrollY: 5520, desc: 'Repair to Custom Build Capabilities' },
      { num: 8, url: 'https://arjayfabrication.vercel.app/', scrollY: 6400, desc: 'Mid North Coast Coverage & FAQ' },
      { num: 9, url: 'https://arjayfabrication.vercel.app/services', scrollY: 0, desc: 'Fabrication Services Directory' },
      { num: 10, url: 'https://arjayfabrication.vercel.app/our-work', scrollY: 0, desc: 'Our Work Project Gallery' },
      { num: 11, url: 'https://arjayfabrication.vercel.app/about', scrollY: 0, desc: 'About The Wingham Workshop' },
      { num: 12, url: 'https://arjayfabrication.vercel.app/contact', scrollY: 0, desc: 'Request a Quote & Contact Page' },
    ]
  },
  {
    folder: 'monistar-building',
    prefix: 'monistar-building',
    captures: [
      { num: 1, url: 'https://monistarbuilding-phi.vercel.app/', scrollY: 0, desc: 'Home Hero - Renovation & New Builds' },
      { num: 2, url: 'https://monistarbuilding-phi.vercel.app/', scrollY: 1020, desc: 'Precision Construction Services' },
      { num: 3, url: 'https://monistarbuilding-phi.vercel.app/', scrollY: 2250, desc: 'Quality Construction Tailored to You' },
      { num: 4, url: 'https://monistarbuilding-phi.vercel.app/', scrollY: 3060, desc: 'Spaces Made for Real Life' },
      { num: 5, url: 'https://monistarbuilding-phi.vercel.app/', scrollY: 4320, desc: 'One Accountable Building Team' },
      { num: 6, url: 'https://monistarbuilding-phi.vercel.app/', scrollY: 5230, desc: 'From Design Idea to Final Construction' },
      { num: 7, url: 'https://monistarbuilding-phi.vercel.app/', scrollY: 6250, desc: 'Interior Craftsmanship In Every Detail' },
      { num: 8, url: 'https://monistarbuilding-phi.vercel.app/', scrollY: 8200, desc: 'Finished Home Proof & Results' },
      { num: 9, url: 'https://monistarbuilding-phi.vercel.app/gallery', scrollY: 0, desc: 'Architectural Projects Gallery' },
      { num: 10, url: 'https://monistarbuilding-phi.vercel.app/services', scrollY: 0, desc: 'Building & Renovation Services' },
      { num: 11, url: 'https://monistarbuilding-phi.vercel.app/how-we-work', scrollY: 0, desc: 'The Monistar Construction Process' },
      { num: 12, url: 'https://monistarbuilding-phi.vercel.app/contact', scrollY: 0, desc: 'Consultation Booking & Contact' },
    ]
  },
  {
    folder: 'optrizo',
    prefix: 'optrizo',
    captures: [
      { num: 1, url: 'https://www.optrizo.com/', scrollY: 0, desc: 'Home Hero - Software Solutions That Drive Growth' },
      { num: 2, url: 'https://www.optrizo.com/', scrollY: 1190, desc: 'Software Should Match Your Business' },
      { num: 3, url: 'https://www.optrizo.com/', scrollY: 1800, desc: 'End-to-End Digital Solutions Matrix' },
      { num: 4, url: 'https://www.optrizo.com/', scrollY: 2950, desc: 'Intelligent Systems Measurable Results' },
      { num: 5, url: 'https://www.optrizo.com/', scrollY: 4050, desc: 'Engineering & Development Lifecycle' },
      { num: 6, url: 'https://www.optrizo.com/', scrollY: 7180, desc: 'Selected Work & Systems Portfolio' },
      { num: 7, url: 'https://www.optrizo.com/', scrollY: 9780, desc: 'Client Testimonials & Feedback' },
      { num: 8, url: 'https://www.optrizo.com/', scrollY: 10600, desc: 'FAQ & Consultation Booking CTA' },
      { num: 9, url: 'https://www.optrizo.com/work', scrollY: 0, desc: 'Full Work Showcase' },
      { num: 10, url: 'https://www.optrizo.com/services', scrollY: 0, desc: 'Custom Systems & AI Automation Services' },
      { num: 11, url: 'https://www.optrizo.com/about', scrollY: 0, desc: 'About The Engineering Team & Studio' },
      { num: 12, url: 'https://www.optrizo.com/book', scrollY: 0, desc: 'Book a Consultation Portal' },
    ]
  },
  {
    folder: 'sylink',
    prefix: 'sylink',
    captures: [
      { num: 1, url: 'https://sylink.vercel.app/', scrollY: 0, desc: 'Home Hero - Digital Solutions For Your Next Move' },
      { num: 2, url: 'https://sylink.vercel.app/', scrollY: 1020, desc: 'Websites Built Around Your Business' },
      { num: 3, url: 'https://sylink.vercel.app/', scrollY: 1670, desc: 'Core Agency Services Matrix' },
      { num: 4, url: 'https://sylink.vercel.app/', scrollY: 3450, desc: 'Technical Delivery & Interactive Capabilities' },
      { num: 5, url: 'https://sylink.vercel.app/', scrollY: 5020, desc: 'Many Moving Parts One Clear Direction' },
      { num: 6, url: 'https://sylink.vercel.app/', scrollY: 6650, desc: 'Digital Solutions Architecture' },
      { num: 7, url: 'https://sylink.vercel.app/', scrollY: 7990, desc: 'Work Portfolio & Case Highlights' },
      { num: 8, url: 'https://sylink.vercel.app/', scrollY: 9020, desc: 'Scalable Growth Roadmap & CTA' },
      { num: 9, url: 'https://sylink.vercel.app/services', scrollY: 0, desc: 'Sylink Full Services Breakdown' },
      { num: 10, url: 'https://sylink.vercel.app/solutions', scrollY: 0, desc: 'Custom Business Solutions Page' },
      { num: 11, url: 'https://sylink.vercel.app/our-work', scrollY: 0, desc: 'Curated Agency Portfolio' },
      { num: 12, url: 'https://sylink.vercel.app/pricing', scrollY: 0, desc: 'Transparent Pricing Tiers' },
    ]
  }
];

async function captureAll() {
  console.log('Starting screenshot captures and image optimization...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-blink-features=AutomationControlled']
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.25
  });

  const page = await context.newPage();

  for (const project of PROJECTS_CONFIG) {
    const targetDir = path.resolve(`public/Projects/${project.folder}/screenshots`);
    fs.mkdirSync(targetDir, { recursive: true });
    console.log(`\n======================================================`);
    console.log(`Processing ${project.folder} -> Saving to ${targetDir}`);
    console.log(`======================================================`);

    for (const item of project.captures) {
      const fileName = `${project.prefix} (${item.num}).png`;
      const tempPath = path.join(targetDir, `temp_${fileName}`);
      const finalPath = path.join(targetDir, fileName);

      try {
        console.log(`[${project.folder} ${item.num}/${project.captures.length}] ${item.desc} (${item.url})...`);
        await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 35000 });
        await page.waitForTimeout(2000);

        if (item.scrollY > 0) {
          await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), item.scrollY);
          await page.waitForTimeout(1200);
        }

        // Capture raw screenshot
        await page.screenshot({ path: tempPath, type: 'png' });

        // Optimize image with sharp
        await sharp(tempPath)
          .resize({ width: 1440, withoutEnlargement: true })
          .png({ compressionLevel: 8, quality: 85 })
          .toFile(finalPath);

        // Remove temp file
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }

        const stats = fs.statSync(finalPath);
        console.log(`  -> Saved ${fileName} (${Math.round(stats.size / 1024)} KB)`);
      } catch (err) {
        console.error(`  -> ERROR on ${item.desc}:`, err.message);
        // Fallback: if temp exists, rename it
        if (fs.existsSync(tempPath) && !fs.existsSync(finalPath)) {
          fs.renameSync(tempPath, finalPath);
        }
      }
    }
  }

  await browser.close();
  console.log('\nAll projects captured and optimized successfully!');
}

captureAll().catch((e) => {
  console.error('Fatal error in capture script:', e);
  process.exit(1);
});
