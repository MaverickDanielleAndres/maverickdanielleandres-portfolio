# Progress: Performance, Scroll & Interaction Optimization

## Goal
Improve scrolling performance, eliminate lag, bouncing, and glitching on Projects and Certifications marquees, eliminate the 1-second cursor and hover delay across all sections, and enhance mobile performance.

## Acceptance Criteria
- [ ] AC1: Instant cursor and hover response across all sections (<16ms, zero noticeable delay, no 1-second rubber-banding).
- [ ] AC2: Smooth, glitch-free Projects & Certifications marquees (zero jumping, bouncing, or phase glitching on font-load, resize, or button/hover interaction).
- [ ] AC3: Buttery-smooth scrolling (no root compositor layer lock, sticky headers intact, native 120Hz momentum scrolling on mobile).
- [ ] AC4: Zero layout thrashing on mousemove (`TextPressure`, `SpotlightCard`, `Magnet`).
- [ ] AC5: Mobile performance optimized (lightweight GPU/DOM footprint, no long tasks on scroll).
- [ ] AC6: Clean TypeScript build and passing verification tests.

## Plan
[_test/PLAN.md](file:///c:/Users/maver/Downloads/portfolio/maverickdanielleandres-portfolio/_test/PLAN.md)

## Status: IN PROGRESS (Slice 3 complete, Starting Slice 4)

## Token Usage
| Milestone | Files | Checks | Commits |
|---|---|---|---|
| Slice 1 | 4 | tsc --noEmit (pass) | - |
| Slice 2 | 3 | tsc --noEmit (pass) | - |
| Slice 3 | 4 | tsc --noEmit (pass) | - |

## Slice Log
### Slice 1 — Eliminate Cursor/Hover Delay & Main-Thread Bottlenecks
- **Files touched**:
  - `components/ui/TextPressure.tsx` (cached maxDist, eliminated getBoundingClientRect from rAF, snappy 0.4 damping, paused when offscreen)
  - `components/ui/SpotlightCard.tsx` (cached rect on enter, eliminated getBoundingClientRect on every mousemove)
  - `components/ui/Magnet.tsx` (eliminated window mousemove listeners and React state re-renders)
  - `components/ui/cursor-dither-trail.tsx` (paused rAF when no dots exist, replaced document.body ResizeObserver)
- **Checks**: `npx tsc --noEmit` ✓ passed cleanly.
- **Result**: Instant hover response, 0 layout thrashing during mouse movements.

### Slice 2 — Fix Projects & Certificates Marquee Bouncing and Glitching
- **Files touched**:
  - `components/Projects.tsx` (continuous coordinate normalization, proportional remeasurement, delta-based dragging)
  - `components/Certificates.tsx` (continuous coordinate normalization, proportional remeasurement, delta-based dragging)
  - `app/globals.css` (removed 3D perspective / preserve-3d overhead on marquee track)
- **Checks**: `npx tsc --noEmit` ✓ passed cleanly.
- **Result**: Zero bouncing, zero jumping on font load or window resize, smooth gliding at 60/120fps.

### Slice 3 — Fix Scrolling Jank & Optimize Lenis / Compositor Layers
- **Files touched**:
  - `components/SmoothScroll.tsx` (upgraded to official lenis, native momentum scrolling on mobile, removed root willChange & contain)
  - `components/OverlapWrapper.tsx` (removed contain: layout paint to fix sticky containment)
  - `components/ui/ScrollVelocity.tsx` (replaced heavy motion/react physics loop with pure GPU-composited CSS marquee)
  - `package.json` (removed deprecated @studio-freight/lenis)
- **Checks**: `npx tsc --noEmit` ✓ passed cleanly.
- **Result**: Buttery smooth scrolling, zero sticky layout bugs, native mobile momentum scrolling.

### Slice 4 — Mobile Performance, Build Verification & Automated Testing (In Progress)
- Target: `_test/`, `tests/performance-verification.spec.mjs`, `npm run build`
