import { chromium } from '@playwright/test';

const urls = [
  { id: 'fire-stop-sydney', url: 'https://fire-stop-sydney.vercel.app/' },
  { id: 'fire-penetration', url: 'https://fire-penetration-website.vercel.app/' },
  { id: 'arjay-fabrication', url: 'https://arjayfabrication.vercel.app/' },
  { id: 'monistar-building', url: 'https://monistarbuilding-phi.vercel.app/' },
  { id: 'optrizo', url: 'https://www.optrizo.com/' },
  { id: 'sylink', url: 'https://sylink.vercel.app/' },
];

async function inspectSites() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-blink-features=AutomationControlled']
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  for (const item of urls) {
    console.log(`\n========================================`);
    console.log(`INSPECTING: ${item.id} -> ${item.url}`);
    console.log(`========================================`);
    try {
      await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(3000);

      const data = await page.evaluate(() => {
        const title = document.title;
        const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
        const h1s = Array.from(document.querySelectorAll('h1')).map(el => el.innerText.trim()).filter(Boolean);
        const h2s = Array.from(document.querySelectorAll('h2')).map(el => el.innerText.trim()).filter(Boolean);
        const navLinks = Array.from(document.querySelectorAll('nav a, header a'))
          .map(a => ({ text: a.innerText.trim(), href: a.getAttribute('href') }))
          .filter(a => a.href && !a.href.startsWith('mailto:') && !a.href.startsWith('tel:'));
        
        // Find main sections or key blocks
        const sections = Array.from(document.querySelectorAll('section, main > div, div[id]'))
          .map(s => ({
            id: s.id || '',
            className: s.className ? String(s.className).slice(0, 50) : '',
            heading: s.querySelector('h1, h2, h3')?.innerText?.trim() || '',
            top: s.getBoundingClientRect().top + window.scrollY,
            height: s.getBoundingClientRect().height
          }))
          .filter(s => s.height > 80);

        return {
          title,
          metaDesc,
          h1s,
          h2s: h2s.slice(0, 10),
          scrollHeight: document.documentElement.scrollHeight,
          navLinks: navLinks.slice(0, 15),
          sections: sections.slice(0, 15)
        };
      });

      console.log(`Title: ${data.title}`);
      console.log(`Meta Desc: ${data.metaDesc}`);
      console.log(`H1s:`, data.h1s);
      console.log(`H2s:`, data.h2s);
      console.log(`Scroll Height: ${data.scrollHeight}px`);
      console.log(`Nav Links:`, data.navLinks);
      console.log(`Sections count: ${data.sections.length}`);
      console.log(`Sections:`, data.sections.map(s => `[${s.id || s.heading || 'section'}] top: ${Math.round(s.top)}px, height: ${Math.round(s.height)}px`));
    } catch (err) {
      console.error(`Error inspecting ${item.id}:`, err.message);
    }
  }

  await browser.close();
}

inspectSites();
