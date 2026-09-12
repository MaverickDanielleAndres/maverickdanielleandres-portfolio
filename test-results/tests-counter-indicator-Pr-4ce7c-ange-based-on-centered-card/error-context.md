# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\counter-indicator.spec.mjs >> Projects & Certificates Dynamic Center Indicator Suite >> Desktop: Dynamic counter indicators render and change based on centered card
- Location: tests\counter-indicator.spec.mjs:4:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('#projects .marquee-nav-btn[aria-label=\'Next projects\']')
Expected: visible
Received: hidden
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" locator('#projects .marquee-nav-btn[aria-label=\'Next projects\']') with timeout 5000ms
  - waiting for locator('#projects .marquee-nav-btn[aria-label=\'Next projects\']')
    13 × locator resolved to <button class="marquee-nav-btn" aria-label="Next projects">…</button>
       - unexpected value "hidden"

```

```yaml
- navigation
- main:
  - heading "M a v e r i c k" [level=1]
  - heading "D a n i e l l e" [level=1]
  - paragraph: Full-Stack Web & App Developer Based in Pasig City, PH
  - paragraph: Available for work
  - text: Open to opportunities
  - button "Get Started"
  - button "Resume"
  - link "GitHub":
    - /url: https://github.com/MaverickDanielleAndres
  - link "LinkedIn":
    - /url: https://linkedin.com/in/maverick-danielle-andres-641564373
  - img "Maverick Danielle Andres"
  - paragraph: Portfolio
  - heading "Selected Projects & Work" [level=2]
  - status "Showing project 4 of 16": 04 / 16
  - button "Open details for Logistics System":
    - img "Logistics System"
    - paragraph: Enterprise Logistics OS · 2026
    - heading "Logistics System" [level=3]
    - paragraph: A unified, end-to-end cloud logistics operating system designed to manage and orchestrate the full lifecycle of supply chain, fleet dispatch, hub sorting, last-mile parcel distribution, workforce payroll, and financial settlement across 20 specialized multi-tenant roles.
    - text: Next.js React TypeScript
  - button "Open details for UI/UX Design — Figma":
    - img "UI/UX Design — Figma"
    - paragraph: Wireframes & Design Systems · 2024–2026
    - heading "UI/UX Design — Figma" [level=3]
    - paragraph: Designed wireframes, high-fidelity mockups, and component libraries for web applications. Covers user flows, responsive layouts, and design-to-developer handoff assets.
    - text: Figma
  - button "Open details for Learning Management System":
    - img "Learning Management System"
    - paragraph: Education Platform · 2025
    - heading "Learning Management System" [level=3]
    - paragraph: A full-featured LMS for schools with course management, student tracking, assignments, and grading functionality.
    - text: PHP MySQL Bootstrap
  - button "Open details for Beauty Connect":
    - img "Beauty Connect"
    - paragraph: E-commerce Platform · 2026
    - heading "Beauty Connect" [level=3]
    - paragraph: A professional beauty connect platform for services and bookings.
    - text: Next.js Tailwind CSS Supabase
  - button "Open details for BazaarX":
    - img "BazaarX"
    - paragraph: Enterprise E-commerce · 2026
    - heading "BazaarX" [level=3]
    - paragraph: A comprehensive, enterprise-grade e-commerce marketplace platform built with a modern mobile-first approach. It facilitates a complete multi-tenant ecosystem with Buyer, Seller, Admin, and QA roles.
    - text: Next.js React Native Expo
  - button "Open details for JJZ TECH — Repair Shop Website":
    - img "JJZ TECH — Repair Shop Website"
    - paragraph: Local Business Landing Page · 2026
    - heading "JJZ TECH — Repair Shop Website" [level=3]
    - paragraph: A high-performance, modern landing page for JJZ TECH, a professional electronics and gadget repair shop in Binangonan, Rizal. Built for local SEO dominance, conversion-focused CTAs, and a buttery-smooth UI powered by Framer Motion and GSAP. Features a live AI chatbot, interactive repair gallery, customer testimonials, and an embedded map.
    - text: Next.js 16 React 19 TypeScript
  - button "Open details for HR Management System":
    - img "HR Management System"
    - paragraph: PH-Compliant HR Management · 2026
    - heading "HR Management System" [level=3]
    - paragraph: A full-featured HRMS with face recognition check-in, GPS geofencing, loan management, and statutory payroll calculations aligned with Philippine TRAIN Law.
    - text: Next.js 16 React 19 Zustand
  - button "Open details for Monitoring and Payroll System":
    - img "Monitoring and Payroll System"
    - paragraph: HR & Attendance Platform · 2026
    - heading "Monitoring and Payroll System" [level=3]
    - paragraph: Enterprise-grade HRMS for Philippine companies — manages employee lifecycles, NFC-based attendance, leave workflows, and automated payroll with government compliance (SSS, PhilHealth, Pag-IBIG, BIR).
    - text: Next.js 14 TypeScript Supabase
  - button "Open details for Wedding Invitation Website":
    - img "Wedding Invitation Website"
    - paragraph: Client Invitation Website · 2026
    - heading "Wedding Invitation Website" [level=3]
    - paragraph: A wedding invitation website for client with animation, envelope effects, music, and dramatic animations. Very responsive made for mobile view.
    - text: Next.js Framer Motion CSS Animations
  - button "Open details for M-Chat":
    - img "M-Chat"
    - paragraph: AI Workspace Application · 2026
    - heading "M-Chat" [level=3]
    - paragraph: A premium multi-tenant, multi-modal AI chat application. One composer handles text, code, documents, images, voice, and web search — all grounded through Google Gemini. Ships with auth, persistent history, billing tiers, admin dashboard, and a full marketing site. Built to compete with ChatGPT and Claude on responsiveness and ergonomics.
    - text: Vite React 19 TypeScript
  - button "Open details for E-Community":
    - img "E-Community"
    - paragraph: Engagement Platform · 2025
    - heading "E-Community" [level=3]
    - paragraph: A community engagement platform for residents and local services.
    - text: Next.js Tailwind CSS Supabase
  - button "Open details for PhotoSnap":
    - img "PhotoSnap"
    - paragraph: Web-Based Photobooth App · 2026
    - heading "PhotoSnap" [level=3]
    - paragraph: A browser-based photobooth app that lets users capture photos, apply real-time filters, edit their strip with customizations, and instantly share via QR code.
    - text: Next.js 16 Fabric.js Supabase
  - button "Open details for SuperFit Webapp":
    - img "SuperFit Webapp"
    - paragraph: Role-Based Fitness Platform · 2026
    - heading "SuperFit Webapp" [level=3]
    - paragraph: A fitness web app with three portals — user, coach, and admin. Covers workouts, nutrition, hydration, goal tracking, coach-client management, and community features.
    - text: Next.js 16 React 19 Zustand
  - button "Open details for WordPress Development":
    - img "WordPress Development"
    - paragraph: Business Websites & Landing Pages · 2026
    - heading "WordPress Development" [level=3]
    - paragraph: Professionally designed business websites built with WordPress, including Mojde Beauty and a Gym business site. Features custom CSS styling and Elementor page builder for a polished, responsive front-end experience.
    - text: WordPress Elementor Custom CSS
  - button "Open details for All Fire Services Australia":
    - img "All Fire Services Australia"
    - paragraph: Fire Protection Services · 2026
    - heading "All Fire Services Australia" [level=3]
    - paragraph: A professional landing page and service portal for All Fire Services, providing practical fire protection, inspections, testing, and compliance support across Greater Sydney.
    - text: Next.js React Tailwind CSS
  - button "Open details for Shimmeur":
    - img "Shimmeur"
    - paragraph: Property Lifestyle Consulting · 2026
    - heading "Shimmeur" [level=3]
    - paragraph: A premium lifestyle consulting platform for end-to-end renovation management. Features design-led renovations that unlock a property's value before sale.
    - text: Next.js Tailwind CSS Framer Motion
  - button "Open details for Logistics System":
    - img "Logistics System"
    - paragraph: Enterprise Logistics OS · 2026
    - heading "Logistics System" [level=3]
    - paragraph: A unified, end-to-end cloud logistics operating system designed to manage and orchestrate the full lifecycle of supply chain, fleet dispatch, hub sorting, last-mile parcel distribution, workforce payroll, and financial settlement across 20 specialized multi-tenant roles.
    - text: Next.js React TypeScript
  - button "Open details for UI/UX Design — Figma":
    - img "UI/UX Design — Figma"
    - paragraph: Wireframes & Design Systems · 2024–2026
    - heading "UI/UX Design — Figma" [level=3]
    - paragraph: Designed wireframes, high-fidelity mockups, and component libraries for web applications. Covers user flows, responsive layouts, and design-to-developer handoff assets.
    - text: Figma
  - button "Open details for Learning Management System":
    - img "Learning Management System"
    - paragraph: Education Platform · 2025
    - heading "Learning Management System" [level=3]
    - paragraph: A full-featured LMS for schools with course management, student tracking, assignments, and grading functionality.
    - text: PHP MySQL Bootstrap
  - button "Open details for Beauty Connect":
    - img "Beauty Connect"
    - paragraph: E-commerce Platform · 2026
    - heading "Beauty Connect" [level=3]
    - paragraph: A professional beauty connect platform for services and bookings.
    - text: Next.js Tailwind CSS Supabase
  - button "Open details for BazaarX":
    - img "BazaarX"
    - paragraph: Enterprise E-commerce · 2026
    - heading "BazaarX" [level=3]
    - paragraph: A comprehensive, enterprise-grade e-commerce marketplace platform built with a modern mobile-first approach. It facilitates a complete multi-tenant ecosystem with Buyer, Seller, Admin, and QA roles.
    - text: Next.js React Native Expo
  - button "Open details for JJZ TECH — Repair Shop Website":
    - img "JJZ TECH — Repair Shop Website"
    - paragraph: Local Business Landing Page · 2026
    - heading "JJZ TECH — Repair Shop Website" [level=3]
    - paragraph: A high-performance, modern landing page for JJZ TECH, a professional electronics and gadget repair shop in Binangonan, Rizal. Built for local SEO dominance, conversion-focused CTAs, and a buttery-smooth UI powered by Framer Motion and GSAP. Features a live AI chatbot, interactive repair gallery, customer testimonials, and an embedded map.
    - text: Next.js 16 React 19 TypeScript
  - button "Open details for HR Management System":
    - img "HR Management System"
    - paragraph: PH-Compliant HR Management · 2026
    - heading "HR Management System" [level=3]
    - paragraph: A full-featured HRMS with face recognition check-in, GPS geofencing, loan management, and statutory payroll calculations aligned with Philippine TRAIN Law.
    - text: Next.js 16 React 19 Zustand
  - button "Open details for Monitoring and Payroll System":
    - img "Monitoring and Payroll System"
    - paragraph: HR & Attendance Platform · 2026
    - heading "Monitoring and Payroll System" [level=3]
    - paragraph: Enterprise-grade HRMS for Philippine companies — manages employee lifecycles, NFC-based attendance, leave workflows, and automated payroll with government compliance (SSS, PhilHealth, Pag-IBIG, BIR).
    - text: Next.js 14 TypeScript Supabase
  - button "Open details for Wedding Invitation Website":
    - img "Wedding Invitation Website"
    - paragraph: Client Invitation Website · 2026
    - heading "Wedding Invitation Website" [level=3]
    - paragraph: A wedding invitation website for client with animation, envelope effects, music, and dramatic animations. Very responsive made for mobile view.
    - text: Next.js Framer Motion CSS Animations
  - button "Open details for M-Chat":
    - img "M-Chat"
    - paragraph: AI Workspace Application · 2026
    - heading "M-Chat" [level=3]
    - paragraph: A premium multi-tenant, multi-modal AI chat application. One composer handles text, code, documents, images, voice, and web search — all grounded through Google Gemini. Ships with auth, persistent history, billing tiers, admin dashboard, and a full marketing site. Built to compete with ChatGPT and Claude on responsiveness and ergonomics.
    - text: Vite React 19 TypeScript
  - button "Open details for E-Community":
    - img "E-Community"
    - paragraph: Engagement Platform · 2025
    - heading "E-Community" [level=3]
    - paragraph: A community engagement platform for residents and local services.
    - text: Next.js Tailwind CSS Supabase
  - button "Open details for PhotoSnap":
    - img "PhotoSnap"
    - paragraph: Web-Based Photobooth App · 2026
    - heading "PhotoSnap" [level=3]
    - paragraph: A browser-based photobooth app that lets users capture photos, apply real-time filters, edit their strip with customizations, and instantly share via QR code.
    - text: Next.js 16 Fabric.js Supabase
  - button "Open details for SuperFit Webapp":
    - img "SuperFit Webapp"
    - paragraph: Role-Based Fitness Platform · 2026
    - heading "SuperFit Webapp" [level=3]
    - paragraph: A fitness web app with three portals — user, coach, and admin. Covers workouts, nutrition, hydration, goal tracking, coach-client management, and community features.
    - text: Next.js 16 React 19 Zustand
  - button "Open details for WordPress Development":
    - img "WordPress Development"
    - paragraph: Business Websites & Landing Pages · 2026
    - heading "WordPress Development" [level=3]
    - paragraph: Professionally designed business websites built with WordPress, including Mojde Beauty and a Gym business site. Features custom CSS styling and Elementor page builder for a polished, responsive front-end experience.
    - text: WordPress Elementor Custom CSS
  - button "Open details for All Fire Services Australia":
    - img "All Fire Services Australia"
    - paragraph: Fire Protection Services · 2026
    - heading "All Fire Services Australia" [level=3]
    - paragraph: A professional landing page and service portal for All Fire Services, providing practical fire protection, inspections, testing, and compliance support across Greater Sydney.
    - text: Next.js React Tailwind CSS
  - button "Open details for Shimmeur":
    - img "Shimmeur"
    - paragraph: Property Lifestyle Consulting · 2026
    - heading "Shimmeur" [level=3]
    - paragraph: A premium lifestyle consulting platform for end-to-end renovation management. Features design-led renovations that unlock a property's value before sale.
    - text: Next.js Tailwind CSS Framer Motion
  - article:
    - img "Swiper image 1"
  - article:
    - img "Swiper image 2"
  - article:
    - img "Swiper image 3"
  - article:
    - img "Swiper image 4"
  - article:
    - img "Swiper image 5"
  - article:
    - img "Swiper image 6"
  - paragraph: swipe me
  - heading "About Me" [level=3]
  - paragraph: Full-Stack Developer
  - link "GitHub":
    - /url: https://github.com/MaverickDanielleAndres
  - link "LinkedIn":
    - /url: https://linkedin.com/in/maverick-danielle-andres-641564373
  - link "Facebook":
    - /url: https://www.facebook.com/maverickdanielle.andres
  - link "Instagram":
    - /url: https://www.instagram.com/mavs_verick/
  - link "Resume":
    - /url: /Files/Resume.pdf
  - button "Start a Project"
  - paragraph: I'm Maverick, a Full-Stack Developer and Project Lead who loves building scalable apps that actually work. Whether it's crafting a smooth React and Next.js frontend or architecting a solid Node.js and Supabase backend, I enjoy making code clean and useful. From integrating AI features to developing enterprise-grade systems, I'm all about creating digital tools that solve real problems.
  - paragraph: Outside of coding, I dedicate my time to learning new technologies and AI, developing side projects, and exploring networking and sysadmin concepts to understand how complete systems operate from the ground up.
  - heading "Core Competencies" [level=3]
  - paragraph: What I Bring
  - heading "Graphics Designing" [level=4]
  - heading "Workflow Architecture" [level=4]
  - heading "Performance Scaling" [level=4]
  - heading "SEO Optimization" [level=4]
  - heading "Agentic Engineering" [level=4]
  - heading "Custom Systems" [level=4]
  - heading "Frontend Development" [level=4]
  - heading "Backend Development" [level=4]
  - heading "Database Management" [level=4]
  - heading "Automation" [level=4]
  - heading "DevOps & CI/CD" [level=4]
  - heading "QA & Testing" [level=4]
  - heading "AI Integration" [level=4]
  - heading "WordPress Development" [level=4]
  - heading "Shopify Development" [level=4]
  - heading "Cloud & Deployment" [level=4]
  - heading "Backend Engineering" [level=4]
  - heading "System Integration" [level=4]
  - heading "Tech Stack" [level=3]
  - paragraph: Technologies I used
  - heading "Frontend & Mobile" [level=4]
  - text: HTML CSS JavaScript TypeScript Expo Go Next.js Tailwind CSS JQuery React Native React
  - heading "Backend & Databases" [level=4]
  - text: MongoDB PHP Express REST APIs MySQL PostgreSQL Supabase Node.js
  - heading "DevOps, Cloud & IT" [level=4]
  - text: Git GitHub Docker CI/CD Jira Kubernetes AWS Networking Cisco SEO Optimization
  - heading "AI & Automation" [level=4]
  - text: Agentic/Prompt Engineering Claude Code Antigravity Cursor Minimax Copilot LLMs/AI Integration Zapier n8n Airtable
  - heading "Design / AI" [level=4]
  - text: Stitch Figma Framer Canva Blender UI/UX Design Photoshop Lovable Bolt Kimi Replit v0
  - heading "CMS, QA & Others" [level=4]
  - text: WordPress WooCommerce Shopify Elementor Playwright MS Office Suite Maestro
- group "Toggle theme":
  - button "Switch to light mode"
  - button "Switch to dark mode" [pressed]
- link "Messenger":
  - /url: https://m.me/maverickdanielle.andres
- link "WhatsApp":
  - /url: https://wa.me/639632968188
- button "Open menu"
- region "Notifications alt+T"
- alert
- button "Open Mavs AI — portfolio assistant"
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Projects & Certificates Dynamic Center Indicator Suite", () => {
  4  |   test("Desktop: Dynamic counter indicators render and change based on centered card", async ({ page }) => {
  5  |     await page.setViewportSize({ width: 1280, height: 800 });
  6  |     await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  7  | 
  8  |     // Scroll to Projects section
  9  |     const projectsSection = page.locator("#projects");
  10 |     await projectsSection.scrollIntoViewIfNeeded();
  11 |     await expect(projectsSection).toBeVisible();
  12 | 
  13 |     // Verify Projects marquee counter exists and displays / 16
  14 |     const projectsCounter = page.locator("#projects .marquee-counter");
  15 |     await expect(projectsCounter).toBeVisible();
  16 |     await expect(projectsCounter.locator(".marquee-counter__total")).toHaveText("16");
  17 | 
  18 |     const initialProjectNum = await projectsCounter.locator(".marquee-counter__current").innerText();
  19 |     expect(Number(initialProjectNum)).toBeGreaterThanOrEqual(1);
  20 |     expect(Number(initialProjectNum)).toBeLessThanOrEqual(16);
  21 | 
  22 |     // Click Next button on projects and verify counter changes
  23 |     const projectNextBtn = page.locator("#projects .marquee-nav-btn[aria-label='Next projects']");
> 24 |     await expect(projectNextBtn).toBeVisible();
     |                                  ^ Error: expect(locator).toBeVisible() failed
  25 |     await projectNextBtn.click();
  26 |     await page.waitForTimeout(600);
  27 | 
  28 |     const nextProjectNum = await projectsCounter.locator(".marquee-counter__current").innerText();
  29 |     console.log(`Projects Counter: ${initialProjectNum} -> ${nextProjectNum}`);
  30 | 
  31 |     // Scroll down to load Certificates
  32 |     await page.evaluate(() => window.scrollTo({ top: 3500, behavior: "instant" }));
  33 |     await page.waitForTimeout(500);
  34 | 
  35 |     // Scroll to Certificates section
  36 |     const certsSection = page.locator("#certificates");
  37 |     await certsSection.scrollIntoViewIfNeeded();
  38 |     await expect(certsSection).toBeVisible();
  39 | 
  40 |     // Verify Certificates marquee counter exists and displays / 18
  41 |     const certsCounter = page.locator("#certificates .marquee-counter");
  42 |     await expect(certsCounter).toBeVisible();
  43 |     await expect(certsCounter.locator(".marquee-counter__total")).toHaveText("18");
  44 | 
  45 |     const initialCertNum = await certsCounter.locator(".marquee-counter__current").innerText();
  46 |     expect(Number(initialCertNum)).toBeGreaterThanOrEqual(1);
  47 |     expect(Number(initialCertNum)).toBeLessThanOrEqual(18);
  48 | 
  49 |     // Click Next button on certificates and verify counter updates
  50 |     const certNextBtn = page.locator("#certificates .marquee-nav-btn[aria-label='Next certificates']");
  51 |     await expect(certNextBtn).toBeVisible();
  52 |     await certNextBtn.click();
  53 |     await page.waitForTimeout(600);
  54 | 
  55 |     const nextCertNum = await certsCounter.locator(".marquee-counter__current").innerText();
  56 |     console.log(`Certificates Counter: ${initialCertNum} -> ${nextCertNum}`);
  57 |   });
  58 | 
  59 |   test("Mobile: Dynamic counter badge visible and updates during auto-glide / drag", async ({ page }) => {
  60 |     await page.setViewportSize({ width: 390, height: 844 });
  61 |     await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  62 | 
  63 |     // Scroll to Projects section
  64 |     const projectsSection = page.locator("#projects");
  65 |     await projectsSection.scrollIntoViewIfNeeded();
  66 |     await expect(projectsSection).toBeVisible();
  67 | 
  68 |     const projectsCounter = page.locator("#projects .marquee-counter");
  69 |     await expect(projectsCounter).toBeVisible();
  70 |     await expect(projectsCounter.locator(".marquee-counter__total")).toHaveText("16");
  71 | 
  72 |     // Scroll to Certificates section
  73 |     await page.evaluate(() => window.scrollTo({ top: 3500, behavior: "instant" }));
  74 |     await page.waitForTimeout(500);
  75 | 
  76 |     const certsSection = page.locator("#certificates");
  77 |     await certsSection.scrollIntoViewIfNeeded();
  78 |     await expect(certsSection).toBeVisible();
  79 | 
  80 |     const certsCounter = page.locator("#certificates .marquee-counter");
  81 |     await expect(certsCounter).toBeVisible();
  82 |     await expect(certsCounter.locator(".marquee-counter__total")).toHaveText("18");
  83 |   });
  84 | });
  85 | 
```