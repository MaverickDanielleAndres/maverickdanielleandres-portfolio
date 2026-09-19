# PLAN: Tech Stack Header Category Filter with High-Performance Expanding Animation

## Goal
Implement a category filter on the top-right header of the "Tech Stack" section in `components/Skills.tsx`. When a user selects a category (e.g., "Frontend & Mobile"), the other categories smoothly exit while the selected category expands across the card container. Selecting "All" smoothly restores all 6 categories in the original 3-column grid. Ensure 100% performance (no lag, 60fps GPU animations, zero hover delays), preserve the existing baseline design, and maintain SEO and accessibility.

---

## Acceptance Criteria
1. **Header Filter Control**:
   - Positioned cleanly in the top-right corner of the Tech Stack card header on both mobile and desktop.
   - Includes options: "All Technologies", "Frontend & Mobile", "Backend & Databases", "DevOps, Cloud & IT", "AI & Automation", "Design / AI", "CMS, QA & Others" with badge counts.
   - Matches the sleek glassmorphic theme styling (`border-black/10 dark:border-white/10`, `var(--fg)`, `var(--bg-about)`).
   - Keyboard accessible (Enter/Space to toggle, Escape to close, outside-click detection).

2. **Expanding Animation & View Transition**:
   - **"All" Mode (Default)**: Renders all 6 categories in the exact existing 3-column layout without any alteration to the original baseline look and feel.
   - **Filtered Mode (e.g. "Frontend & Mobile")**: The unselected categories smoothly transition out, and the selected category expands to fill the container with its skill badges in a spacious, beautifully formatted layout. Includes a quick "Show All" reset action.
   - **Performance Guarantee**: 60fps/120fps GPU-accelerated transforms (`opacity`, `transform: scale / translateY`), zero layout thrashing, zero hover delays, instant responsive feel.

3. **SEO & Accessibility**:
   - Semantic HTML with proper `<h3>` / `<h4>` hierarchy and accessible button attributes (`aria-expanded`, `aria-haspopup`, `aria-label`).
   - All technology names remain crawlable by search engines.

4. **Verification & Quality Gates**:
   - Automated Playwright end-to-end tests validating filter switching, expanding view, resetting to all, and responsive rendering across desktop and mobile.
   - Production build check (`npm run build`) passing with 0 errors.

---

## Selected Skills
- `my-skills-mav/fullstack-taskrunner`: Master task execution and vertical slices.
- `my-skills-mav/frontend-engineer`: React state, interactive filter dropdown, and Framer Motion integration.
- `my-skills-mav/performance-engineer`: GPU-accelerated transitions, 0 layout reflows, instant hover responsiveness.
- `my-skills-mav/SEO-engineer`: Semantic tags, SEO crawlability, and ARIA accessibility standards.
- `my-skills-mav/qa-engineer`: Automated browser testing with Playwright.

---

## Vertical Slices
- **Slice 1**: Implement the top-right Filter component in `components/Skills.tsx` with accessibility, outside-click handling, and theme consistency.
- **Slice 2**: Implement the high-performance animated filtering & expanding view in `components/Skills.tsx` using GPU-accelerated Framer Motion transitions.
- **Slice 3**: Write and execute automated Playwright tests (`tests/skills-filter.spec.mjs`) to verify functionality, capture visual screenshots, and ensure clean `npm run build`.

---

## Verification Plan
### Automated Tests
- `npx playwright test tests/skills-filter.spec.mjs`
- `npm run build`
### Manual Verification
- Test all filter dropdown interactions across desktop and mobile viewports.
- Confirm 0ms hover delay on skill pills and smooth 60fps expansion animation.
