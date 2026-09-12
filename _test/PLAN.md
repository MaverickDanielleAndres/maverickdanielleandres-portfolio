# PLAN: Performance, Scroll & Interaction Optimization

## Goal
Improve scrolling performance, eliminate lag, bouncing, and glitching on Projects and Certifications marquees, eliminate the 1-second cursor and hover delay across all sections, and enhance mobile performance.

## Acceptance Criteria
1. **Instant Cursor & Hover Response**: Hovering over buttons, cards, links, and sections across the entire website reacts instantly (<16ms, zero noticeable delay). Custom text pressure and hover effects follow the pointer smoothly without 1-second rubber-banding or main-thread freezing.
2. **Smooth, Glitch-Free Projects & Certifications Marquees**: The "Selected Projects & Work" and "Credentials & Learning" marquees glide smoothly at 60/120fps. No jumping, bouncing back-and-forth, or phase glitches when fonts load, window resizes, cards are hovered, or navigation buttons are clicked.
3. **Buttery-Smooth Scrolling**: Remove root compositor layer lock and layout containment breaks. Scrolling is fluid on desktop and delivers native 120Hz momentum scrolling on mobile devices without rubber-band touch lag.
4. **Zero Layout Thrashing on Mousemove**: Eliminate all per-frame and per-mousemove `getBoundingClientRect()` calls in `TextPressure`, `SpotlightCard`, and `Magnet`.
5. **Mobile Performance**: High frame rates on mobile viewports, lightweight DOM/GPU footprint, and elimination of long main-thread blocking tasks.
6. **Zero TypeScript / Build Regressions**: `npm run build` passes cleanly without errors.

## Selected Skills
- `my-skills-mav/fullstack-taskrunner`: Master execution loop, vertical slice breakdown, test and verification gates.
- `my-skills-mav/performance-engineer`: Core Web Vitals optimization, React render optimization, eliminating forced reflows (layout thrashing), CSS GPU compositing, Lenis configuration, font and asset optimization.

## Vertical Slices

### Slice 1: Eliminate Cursor/Hover Delay & Main-Thread Bottlenecks
- **Target**: `components/ui/TextPressure.tsx`, `components/ui/SpotlightCard.tsx`, `components/ui/Magnet.tsx`, `components/ui/cursor-dither-trail.tsx`, `components/Skills.tsx`, `app/globals.css`.
- **Changes**:
  - `TextPressure.tsx`: Replace `/ 15` delayed damping with responsive follow; disconnect rAF loop and listeners when hero is not in view (via `IntersectionObserver`); remove `titleRef.current.getBoundingClientRect()` from the per-frame loop to stop layout thrashing.
  - `SpotlightCard.tsx`: Cache card bounding rects on `pointerenter` / resize rather than measuring `getBoundingClientRect()` on every single `mousemove` event.
  - `Magnet.tsx`: Remove window-level mousemove event listener; only calculate on local card hover or use CSS variable transforms, avoiding React state updates on every mousemove.
  - `cursor-dither-trail.tsx`: Disconnect animation loop when no dots are active; avoid full-body `ResizeObserver`.
  - `globals.css`: Streamline hover transitions to compositor-only properties (`transform`, `opacity`).

### Slice 2: Fix Projects & Certificates Marquee Bouncing and Glitching
- **Target**: `components/Projects.tsx`, `components/Certificates.tsx`, `app/globals.css`.
- **Changes**:
  - Normalize `xRef.current` within `[-halfWidth, 0)` continuously on every frame.
  - Eliminate modulo phase discontinuity when `halfWidth` is remeasured on font load or resize.
  - Fix spring interpolation for button clicks (`handlePrev`, `handleNext`) and touch drag releases to prevent target desynchronization.
  - Remove redundant 3D transforms (`perspective: 1000px`, `transform-style: preserve-3d`) from `.projects-marquee-track` that cause GPU layer thrashing.

### Slice 3: Fix Scrolling Jank & Optimize Lenis / Compositor Layers
- **Target**: `components/SmoothScroll.tsx`, `components/OverlapWrapper.tsx`, `components/ui/ScrollVelocity.tsx`.
- **Changes**:
  - `SmoothScroll.tsx`: Update to modern `lenis` package; remove `willChange: "transform"` and `contain: "layout paint"` from the root scroll wrapper (which broke sticky positioning and locked the entire page into an enormous GPU layer).
  - Disable touch hijacking on mobile devices so mobile touch enjoys native hardware momentum scrolling.
  - `OverlapWrapper.tsx`: Remove `contain: "layout paint"` from sticky containers that caused containment bugs and repaints.
  - `ScrollVelocity.tsx`: Remove heavy `'motion/react'` dependency and spring physics loop, replacing with lightweight compositor-friendly animation.

### Slice 4: Mobile Performance, Build Verification & Automated Testing
- **Target**: `_test/`, `components/Projects.tsx`, `components/Certificates.tsx`, `app/layout.tsx`.
- **Changes**:
  - Optimize card layouts and image loading for mobile screen sizes.
  - Run `npm run build` / type checking.
  - Run Playwright tests to ensure interactive modals, navigation, and hover behaviors are fully verified.

## Verification Gates
- `npm run build`: Zero errors, clean production bundle.
- Interaction latency test: Instant button and card hover response.
- Marquee stability test: Infinite marquee runs smoothly without jumps on font load, resize, or hover.
- Mobile viewport test: Smooth touch scrolling without virtual scroll drag.
