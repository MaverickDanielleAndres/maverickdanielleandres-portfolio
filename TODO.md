# Performance Optimization Plan

## Current Issues
- LCP: 3.39s (ShinyText component bottleneck)
- INP: 1048ms (Complex animations causing lag)
- Multiple animation libraries increasing bundle size

## Optimization Tasks

### Phase 1: Hero Section Optimization
- [x] Replace ShinyText complex animations with simple CSS transitions
- [x] Change hero font to more appropriate, performant font
- [x] Optimize font loading and rendering

### Phase 2: Animation Simplification
- [x] Simplify CardSwap GSAP animations
- [x] Reduce CardSwap auto-play frequency
- [x] Optimize RotatingText stagger animations
- [x] Add lazy loading for heavy components

### Phase 3: Bundle Optimization
- [ ] Optimize image loading and formats
- [ ] Review and optimize font loading
- [ ] Consider code splitting for heavy components

### Phase 4: Testing & Validation
- [ ] Test LCP improvements
- [ ] Test INP improvements
- [ ] Validate animation smoothness
- [ ] Check bundle size reduction
