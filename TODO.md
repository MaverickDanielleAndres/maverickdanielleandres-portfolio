# Performance Optimization Plan

## Current Issues
- LCP: 3.39s (ShinyText component bottleneck)
- INP: 1048ms (Complex animations causing lag)
- Multiple animation libraries increasing bundle size

## Optimization Tasks

### Phase 1: Hero Section Optimization
- [ ] Replace ShinyText complex animations with simple CSS transitions
- [ ] Change hero font to more appropriate, performant font
- [ ] Optimize font loading and rendering

### Phase 2: Animation Simplification
- [ ] Simplify CardSwap GSAP animations
- [ ] Reduce CardSwap auto-play frequency
- [ ] Optimize RotatingText stagger animations
- [ ] Add lazy loading for heavy components

### Phase 3: Bundle Optimization
- [ ] Optimize image loading and formats
- [ ] Review and optimize font loading
- [ ] Consider code splitting for heavy components

### Phase 4: Testing & Validation
- [ ] Test LCP improvements
- [ ] Test INP improvements
- [ ] Validate animation smoothness
- [ ] Check bundle size reduction
