# Design & Animation Specification
## Reference: Dennis Snellenberg Portfolio — Full Detailed Spec

> **Purpose:** This document is a complete, implementation-ready design & animation reference for replicating the exact look, feel, transitions, and interactions seen in the reference video. Every section, component, animation, and micro-interaction is documented so a developer can apply it directly to an existing codebase.

---

## 1. GLOBAL DESIGN TOKENS

### 1.1 Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-bg-hero` | `#A8A89E` (warm mid-gray) | Hero section full background |
| `--color-bg-light` | `#FFFFFF` | Main content sections background |
| `--color-bg-dark` | `#1A1A1A` / `#111111` | Footer / CTA section background |
| `--color-text-primary-light` | `#1A1A1A` | Body text on white sections |
| `--color-text-primary-dark` | `#FFFFFF` | All text on dark sections |
| `--color-text-hero-large` | `#FFFFFF` | Oversized marquee name text in hero |
| `--color-text-muted` | `#888888` | Small labels like "Design & Development", "Recent work" |
| `--color-accent` | `#5B4FE8` / `#6055F0` | Accent blue-purple — CTA buttons, active nav dot, hover circles, "View" cursor |
| `--color-nav-bg-dark` | `#1A1A1A` | Hamburger menu drawer background |
| `--color-border-light` | `rgba(0,0,0,0.08)` | Subtle dividers between work list items |
| `--color-button-outline` | `#1A1A1A` | Border of contact pill buttons in footer |

### 1.2 Typography

**Primary Typeface:** `Inter` or a geometric sans-serif with thin/light/regular/medium weights (the site appears to use a typeface very close to `Inter` or `Neue Haas Grotesk`).

| Element | Font Size | Font Weight | Line Height | Letter Spacing | Notes |
|---|---|---|---|---|---|
| Logo / Brand mark | `14px` | `400` | `1` | `0` | "Code by Dennis" top-left |
| Nav links (desktop) | `14px` | `400` | `1` | `0.02em` | "Work", "About", "Contact" |
| Hero marquee name | `~160px–200px` (viewport-relative: `~17vw`) | `300–400` | `0.9` | `-0.02em` | Oversized, bleeds off screen edges |
| Hero subtitle | `~18px` | `400` | `1.4` | `0.01em` | "Freelance / Designer & Developer" |
| Section heading (tagline) | `~36–42px` | `400` | `1.2` | `-0.01em` | "Helping brands to stand out…" |
| Body copy | `~14px` | `400` | `1.6` | `0` | Paragraph text right column |
| Work list project name | `~64–80px` (≈ `6.5vw`) | `300–400` | `1` | `-0.02em` | e.g. "FABRIC™", "Aanstekelijk" |
| Work list category label | `~13px` | `400` | `1` | `0.04em` | "Design & Development" — far right |
| Menu drawer nav items | `~60–72px` | `400` | `1.1` | `-0.01em` | "Home", "Work", "About", "Contact" |
| Menu drawer label | `~11px` | `400` | `1` | `0.1em` uppercase | "NAVIGATION" |
| Menu drawer social links | `~13px` | `400` | `1` | `0.04em` | "Awwwards", "Instagram" etc. |
| CTA headline | `~72–96px` | `300–400` | `1` | `-0.02em` | "Let's work together" |
| CTA button text | `~14px` | `400` | `1` | `0.02em` | "Get in touch" inside circle |
| Contact pill text | `~13px` | `400` | `1.4` | `0` | email, phone |
| Footer labels | `~11px` | `400` | `1` | `0.08em` uppercase | "DESIGN", "LOCATION", "SOCIAL" |
| "More work" link | `~13px` | `400` | `1` | `0.02em` | Centered with superscript count |
| Arrow icon in hero | `~18px diagonal line` | n/a | n/a | n/a | Thin diagonal arrow `↘` pointing down-right |

### 1.3 Spacing & Layout

- **Max content width:** ~`1200px`, centered with horizontal padding of ~`96px` on large screens, `24px` on mobile.
- **Navbar height:** ~`56px`
- **Hero section height:** `100vh` (full viewport)
- **Section vertical padding:** `~80–120px` top and bottom between major sections
- **Work list item padding:** `~32–40px` vertical padding per row, thin `1px` top border
- **Grid:** Two-column layout in the tagline section — left column ~60% width, right column ~40% width with the "About me" button circle

---

## 2. LAYOUT SECTIONS (Top to Bottom)

### Section 1: Navbar
- Fixed position, `top: 0`, full-width, transparent background (no background color — sits directly over the hero).
- Left: logo text "Code by Dennis" with a small circular `©` icon before it.
- Right: three nav links — "Work", "About", "Contact".
- On scroll: nav links disappear and only the hamburger menu button (top-right circle) remains visible.
- The hamburger button is a **dark circle (~52px diameter)**, `background: #1A1A1A`, centered `≡` icon in white. When active/open it becomes the **accent purple (`#6055F0`)** and shows an `✕` icon.

### Section 2: Hero
- Background: solid `#A8A89E` (warm gray) — full viewport height.
- A **cut-out / masked photo** of the person sits centered-left, blending into the gray background (the photo uses a similar background-matching technique so the subject appears to float).
- The photo is `position: absolute` or uses CSS masking, roughly occupying 40–50% of viewport width, centered vertically.
- Upper-right text block: "Freelance" on line 1, "Designer & Developer" on line 2 — `~18px`, white, positioned at ~60% x, 40% y of the viewport.
- A thin **diagonal arrow `↘`** (rendered as two short lines forming an arrow) is placed between center and upper-right area — pure decorative, white, approximately `20×20px`.
- The **oversized name marquee** sits at the bottom of the hero, cropped so only the top portion of the letters is visible above the fold:
  - Text: `"— Dennis Snellenberg — Dennis Snellenberg"` (duplicated for seamless loop)
  - Font size: `~17vw`
  - Color: `white`
  - The marquee extends horizontally beyond the viewport on both sides and **continuously scrolls left** at a slow, smooth speed.

### Section 3: Tagline / About Intro (White background)
- Background transitions to white immediately below the hero.
- **Left column (≈60%):** Large paragraph text — `"Helping brands to stand out in the digital era. Together we will set the new status quo. No nonsense, always on the cutting edge."` — font ~`38px`, weight `400`, color `#1A1A1A`.
- **Right column (≈40%):**
  - Small body paragraph: "The combination of my passion for design, code & interaction positions me in a unique place in the web design world." — `~14px`, muted.
  - Below: **"About me" CTA button** — a large black circle (~`120px` diameter), white text "About me" centered inside, `cursor: pointer`.
- **"Recent work" label:** Small uppercase label `~11px`, letter-spacing wide, positioned below the left column area, before the work list begins. Color: `#888`.

### Section 4: Work List
- Background: white.
- Each row = one project. Layout:
  - Left: Project name in large text (`~6.5vw`)
  - Right: Category tag like "Design & Development" in small muted text `~13px`
  - Thin top border `1px solid rgba(0,0,0,0.08)` separating rows
- Projects visible: `FABRIC™`, `Aanstekelijk`, `Base Create`, `AVVR`
- Below the list: centered `"More work ¹²"` link (the superscript is the count).

### Section 5: More Work Grid
- Background: very light gray / white.
- A **horizontal scrolling or CSS grid** of 8 project thumbnail cards (2 rows × 4 columns).
- Each card is a rounded-rectangle thumbnail preview of a project screenshot with subtle drop shadow.
- Cards are uniform size, equal spacing, no visible text labels.

### Section 6: CTA / Contact Footer
- Background: `#1A1A1A` (near-black).
- Large headline: `"Let's work"` on line 1, `"together"` on line 2 — font size `~80px`, color white, weight `300–400`.
- Inline within the headline on line 1: a small circular **avatar photo** (~`60px` diameter, circular clip) inserted before "Let's work" — a profile photo thumbnail.
- A **thin horizontal divider line** runs across the full width below the headline.
- To the right of the divider (or centered): **"Get in touch" CTA circle** — large circle ~`130px` diameter, `background: #6055F0` (accent purple), white text "Get in touch" centered.
- Below the divider: two pill-shaped outline buttons side by side:
  - `info@dennissnellenberg.com`
  - `+31 6 27 84 74 30`
  - Style: `border: 1.5px solid rgba(255,255,255,0.3)`, border-radius `100px`, padding `14px 24px`, text color white, `~13px`.
- Thin horizontal divider below.
- Footer bottom bar: 4 columns — "DESIGN", "LOCATION", "SOCIAL" labels in small uppercase with content below each.
- A thin diagonal arrow icon `↙` appears in the upper-right area of this section, white.

---

## 3. ANIMATIONS & TRANSITIONS — FULL DETAIL

### 3.1 Hero Marquee (Infinite Horizontal Scroll)

**What it does:** The oversized name text scrolls continuously from right to left across the full viewport width, looping seamlessly.

**Implementation:**
```css
.marquee-track {
  display: flex;
  white-space: nowrap;
  will-change: transform;
  animation: marquee-scroll 18s linear infinite;
}

@keyframes marquee-scroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
```
- The text content is duplicated exactly once (`— Dennis Snellenberg — Dennis Snellenberg`) so the 50% translateX creates a seamless loop.
- Duration: approximately `18–22 seconds` for one full cycle.
- Easing: `linear` (constant speed, no ease-in/out).
- Direction: `left` (negative X direction).
- The text starts partially off-screen to the left already on load, so the name is never fully readable — only partial letters visible at any time.
- **Parallax interaction:** As the user scrolls down, the marquee slightly **slows down or speeds up** based on scroll velocity (scroll-linked speed modulation). Implement with:
```javascript
let lastScrollY = 0;
let speed = 1;
window.addEventListener('scroll', () => {
  const delta = window.scrollY - lastScrollY;
  speed = 1 + Math.abs(delta) * 0.04; // increase speed with scroll momentum
  marqueeTrack.style.animationDuration = `${18 / speed}s`;
  lastScrollY = window.scrollY;
});
```

### 3.2 Page Load — Initial Entrance Animation

When the page first loads, elements animate in sequentially:

1. **Logo** (top-left): Fades in + slides up from `translateY(8px)` → `translateY(0)`, duration `0.6s`, delay `0.1s`, easing `cubic-bezier(0.16, 1, 0.3, 1)`.
2. **Nav links** (top-right): Each link fades in + slides up with a stagger. Delay: `0.15s`, `0.2s`, `0.25s` respectively. Same easing.
3. **Hero subtitle text** ("Freelance / Designer & Developer"): Fades in from `opacity: 0` + `translateY(12px)` → full opacity + `translateY(0)`. Duration `0.8s`, delay `0.4s`.
4. **Diagonal arrow icon**: Fades in, delay `0.5s`, duration `0.4s`.
5. **Marquee name**: Starts playing immediately but fades in from `opacity: 0` → `opacity: 1` over `0.6s`, delay `0.3s`.
6. **Hero photo**: Fades in from `opacity: 0` over `0.8s`, delay `0.2s`. No translate — just opacity.

```css
.animate-in {
  opacity: 0;
  transform: translateY(12px);
  animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 3.3 Scroll-Triggered Section Reveals

Every major text block and element animates in as it enters the viewport. Uses `IntersectionObserver` with a threshold of `0.15`.

**Default scroll reveal:**
- Start state: `opacity: 0; transform: translateY(24px);`
- End state: `opacity: 1; transform: translateY(0);`
- Duration: `0.9s`
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (fast-out / ease-out — snappy deceleration)
- Once triggered, the animation does NOT reverse (plays once, stays visible).

**Staggered children (e.g., work list rows):**
Each work list item gets a staggered delay — `0s`, `0.08s`, `0.16s`, `0.24s` — as they enter the viewport together or in sequence.

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
```

```css
[data-animate] {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
}
[data-animate].is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

### 3.4 Hamburger Menu — Open/Close Drawer

**Trigger:** Click on top-right circular button.

**Button state change:**
- Closed → Open: background color transitions from `#1A1A1A` → `#6055F0` (accent purple). Duration: `0.3s`, easing: `ease`.
- The `≡` (hamburger) icon rotates/morphs into `✕`. Achieved with two `span` elements:
  - Top bar: rotates `+45deg` and translates to center.
  - Bottom bar: rotates `-45deg` and translates to center.
  - Duration: `0.35s`, easing: `cubic-bezier(0.16, 1, 0.3, 1)`.

**Drawer panel:**
- A full-height panel slides in from the **right edge** of the viewport.
- Width: `~380px` on desktop, `100%` on mobile.
- Background: `#1A1A1A`.
- Start state: `transform: translateX(100%)` + `opacity: 0`.
- End state: `transform: translateX(0)` + `opacity: 1`.
- Duration: `0.55s`.
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)`.
- The content behind the drawer is **NOT pushed** — the drawer overlays on top.

**Drawer contents animate in sequentially after the panel:**
- "NAVIGATION" label: fades in, delay `0.1s`.
- Nav items (`Home`, `Work`, `About`, `Contact`): each fades in + slides from `translateX(20px)` → `translateX(0)`.
  - Stagger: `0.05s` delay between each item.
  - Start delay (after panel opens): `0.15s`.
  - Duration per item: `0.5s`.
  - Easing: `cubic-bezier(0.16, 1, 0.3, 1)`.
- Social links at bottom: fade in together, delay `0.35s`, duration `0.4s`.

**Active nav item indicator:**
- A small blue-purple dot (approximately `6px` diameter, `background: #6055F0`) appears to the left of the currently active page's menu item.
- On hover over other items, the dot animates across to that item — using `left` position absolute transition or FLIP animation.
- Dot transition: `0.3s`, easing `cubic-bezier(0.16, 1, 0.3, 1)`.

**Closing the menu:**
- Drawer slides out `translateX(100%)`, duration `0.45s`, easing `cubic-bezier(0.55, 0, 1, 0.45)` (ease-in for exit).
- Button transitions back from purple to dark, icon transitions back from `✕` to `≡`.

### 3.5 Work List — Project Hover Preview

**What it does:** When the user hovers over a project name row in the work list, a **thumbnail preview** of the project appears. The thumbnail follows the cursor or appears at a fixed position near the mouse.

**Thumbnail properties:**
- Size: approximately `200px × 160px`, border-radius `8px`, `overflow: hidden`.
- Contains a screenshot/preview image of the project.
- **A "View" label circle** is displayed on top of the image — `~50px` diameter circle, `background: #6055F0` (accent purple), white text "View" at `~12px`.

**Appearance animation:**
- Start: `opacity: 0; transform: scale(0.85) rotate(-4deg);`
- End: `opacity: 1; transform: scale(1) rotate(0deg);`
- Duration: `0.4s`.
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)`.

**Disappearance animation:**
- Start: `opacity: 1; transform: scale(1);`
- End: `opacity: 0; transform: scale(0.9);`
- Duration: `0.25s`.
- Easing: `ease-in`.

**Cursor-following behavior:**
```javascript
const preview = document.querySelector('.work-preview');
document.querySelectorAll('.work-item').forEach(item => {
  item.addEventListener('mousemove', (e) => {
    const rect = item.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    // Offset preview slightly to not cover the text
    preview.style.transform = `translate(${x + 20}px, ${y - 80}px) scale(1)`;
    preview.style.opacity = '1';
  });
  item.addEventListener('mouseleave', () => {
    preview.style.opacity = '0';
    preview.style.transform += ' scale(0.9)';
  });
});
```

**Row hover state (text):**
- Project name text gets a very subtle color darkening or no change (stays `#1A1A1A`).
- A subtle background tint on the row: `rgba(0,0,0,0.02)`.
- Transition: `0.2s ease`.

### 3.6 "About me" Button — Circular CTA Hover

**Normal state:**
- Circle: `width: 120px; height: 120px; border-radius: 50%; background: #1A1A1A;`
- Text: "About me", white, `14px`, centered.

**Hover state:**
- The circle slightly **scales up**: `transform: scale(1.08)`.
- Background may shift to a very dark gray: `background: #2a2a2a`.
- Transition: `transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)`.
- The text inside does NOT animate separately.

**Magnetic effect (optional but present in reference):**
- The button gently follows the cursor when the mouse is within ~60px of its bounding box.
- Implementation:
```javascript
const btn = document.querySelector('.about-btn');
btn.addEventListener('mousemove', (e) => {
  const rect = btn.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const deltaX = (e.clientX - centerX) * 0.3;
  const deltaY = (e.clientY - centerY) * 0.3;
  btn.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.08)`;
});
btn.addEventListener('mouseleave', () => {
  btn.style.transform = 'translate(0,0) scale(1)';
  btn.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
});
```

### 3.7 "Get in Touch" CTA Circle Hover

Same magnetic and scale behavior as the "About me" button, but uses:
- Normal: `background: #6055F0` (accent purple).
- Hover: slight scale `1.06`, slight background brighten `#6B5FF5`.
- Transition: `0.4s cubic-bezier(0.16, 1, 0.3, 1)`.

### 3.8 Parallax — Hero Section

As the user scrolls down from the hero:
- The **hero background image / person photo** scrolls at a **slower rate** than the page — creating a depth effect.
- The photo moves at `~0.4x` scroll speed (moves 40px for every 100px scrolled).
- The **marquee text** also exhibits slight parallax — it moves at `~0.6x` scroll speed.

```javascript
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  heroPhoto.style.transform = `translateY(${scrollY * 0.4}px)`;
  marqueeWrapper.style.transform = `translateY(${scrollY * 0.15}px)`;
});
```

- The hero section has `overflow: hidden` to clip the parallaxing content.

### 3.9 Section Background Transition (Hero Gray → White)

- As the user scrolls past the hero, the background visually cuts from gray to white — it is a **hard-edge cut** with no fade, happening at the exact bottom border of the hero section (`100vh`).
- No CSS transition on background color — just natural section stacking.
- The gray extends to exactly the bottom of `100vh`, then white begins.

### 3.10 Dark Footer Section Entrance

- The dark background of the CTA/footer section `#1A1A1A` enters from the bottom as a standard scroll.
- The **"Let's work together"** headline animates in with the standard scroll reveal (see §3.3) but at a slightly larger translate: `translateY(40px)` → `translateY(0)`.
- The inline avatar photo in the headline is part of the same text flow and animates with it.
- The horizontal divider line **draws itself** from left to right:
  - Start: `width: 0; opacity: 0;`
  - End: `width: 100%; opacity: 1;`
  - Duration: `0.8s`, delay `0.3s` after the headline enters.
  - Easing: `cubic-bezier(0.16, 1, 0.3, 1)`.
- The pill buttons fade in + slide up with `0.4s` delay stagger.

### 3.11 Custom Cursor

The site uses a **custom cursor**:
- Default custom cursor: small circle `~8px` diameter, `background: #1A1A1A`, `border-radius: 50%`, follows mouse with slight lag (lerp/ease).
- On hover over links / interactive elements: cursor **expands** to `~40px` with reduced opacity `0.15`, acting as a soft highlight ring.
- On hover over work items: cursor changes to show the purple "View" label (the custom cursor replaces native cursor entirely).

```javascript
const cursor = document.querySelector('.custom-cursor');
let targetX = 0, targetY = 0, currentX = 0, currentY = 0;

document.addEventListener('mousemove', (e) => {
  targetX = e.clientX;
  targetY = e.clientY;
});

function animateCursor() {
  currentX += (targetX - currentX) * 0.12; // lerp factor
  currentY += (targetY - currentY) * 0.12;
  cursor.style.transform = `translate(${currentX}px, ${currentY}px)`;
  requestAnimationFrame(animateCursor);
}
animateCursor();
```

### 3.12 Navigation Active State Dot

- In the desktop navbar (before scroll collapses it), the active nav item has a small dot below it — `~4px` diameter, `background: #6055F0`, positioned centered below the text.
- On hover of other nav items, the dot slides horizontally to the hovered item.
- Transition: `transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)`.

### 3.13 Nav Collapse on Scroll

- When `scrollY > 40px`, the desktop nav links fade out (`opacity: 0`, `pointer-events: none`) over `0.3s`.
- The hamburger button (top-right circle) is always visible, but transitions from `background: #1A1A1A` (visible on white) to `background: #1A1A1A` with full opacity (no change needed — it's always present).
- Transition on nav links: `opacity 0.3s ease, transform 0.3s ease` — they also shift up `translateY(-4px)` as they fade out.

---

## 4. COMPONENT SPECIFICATIONS

### 4.1 Hamburger Button Circle

```css
.menu-btn {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 1000;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #1A1A1A;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s ease;
}
.menu-btn.open {
  background: #6055F0;
}
```

### 4.2 Work List Item

```css
.work-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px 0;
  border-top: 1px solid rgba(0,0,0,0.08);
  cursor: pointer;
  position: relative;
  transition: background 0.2s ease;
}
.work-item:hover {
  background: rgba(0,0,0,0.015);
}
.work-item__name {
  font-size: clamp(40px, 6.5vw, 96px);
  font-weight: 350;
  letter-spacing: -0.02em;
  color: #1A1A1A;
  line-height: 1;
}
.work-item__category {
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.04em;
  color: #888;
}
```

### 4.3 "About me" & "Get in touch" Circle Buttons

```css
.circle-btn {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: 400;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              background 0.3s ease;
}
.circle-btn--dark {
  background: #1A1A1A;
  color: #fff;
}
.circle-btn--accent {
  background: #6055F0;
  color: #fff;
  width: 130px;
  height: 130px;
}
.circle-btn:hover {
  transform: scale(1.08);
}
```

### 4.4 Contact Pill Buttons

```css
.contact-pill {
  border: 1.5px solid rgba(255,255,255,0.25);
  border-radius: 100px;
  padding: 14px 28px;
  font-size: 13px;
  color: #fff;
  background: transparent;
  cursor: pointer;
  transition: border-color 0.25s ease, background 0.25s ease;
}
.contact-pill:hover {
  border-color: rgba(255,255,255,0.6);
  background: rgba(255,255,255,0.05);
}
```

### 4.5 Menu Drawer Nav Items

```css
.drawer-nav-item {
  font-size: clamp(48px, 6vw, 72px);
  font-weight: 400;
  color: #fff;
  line-height: 1.15;
  letter-spacing: -0.01em;
  cursor: pointer;
  position: relative;
  display: inline-block;
  transition: color 0.2s ease;
}
.drawer-nav-item:hover {
  color: rgba(255,255,255,0.6);
}
.drawer-nav-item.active::before {
  content: '·';
  position: absolute;
  left: -20px;
  color: #6055F0;
  font-size: 1em;
}
```

---

## 5. PARALLAX SCROLL BEHAVIOR SUMMARY

| Element | Scroll Speed Multiplier | Direction | Notes |
|---|---|---|---|
| Hero background / photo | `0.4x` | Up (slower than scroll) | Gives depth illusion |
| Hero marquee text | `0.6x` | Up (slightly slower) | Subtle depth |
| Hero subtitle text | `0.8x` | Up | Very subtle |
| All other sections | `1x` (normal) | Up | Standard scroll |
| Footer section elements | No parallax | Standard | Dark section, no parallax |

---

## 6. TRANSITION EASING REFERENCE

All easing values used throughout the site:

| Name | CSS Value | Usage |
|---|---|---|
| Snappy deceleration | `cubic-bezier(0.16, 1, 0.3, 1)` | Almost all entrance animations, hover scale, drawer open |
| Exit ease-in | `cubic-bezier(0.55, 0, 1, 0.45)` | Drawer close, element exit |
| Smooth standard | `ease` | Simple transitions (color, opacity fades) |
| Linear | `linear` | Marquee scroll only |

---

## 7. RESPONSIVE BEHAVIOR

### Desktop (>1024px)
- Full layout as described above.
- Fixed desktop nav visible until scroll.

### Tablet (768–1024px)
- Desktop nav may be hidden; hamburger always shown.
- Hero marquee font reduced to `~13vw`.
- Work list font reduces to `~8vw`.
- Two-column tagline section collapses to single column.

### Mobile (<768px)
- Hero marquee font `~22vw`.
- Work list items font `~10vw`.
- "About me" circle button moves below the paragraph text (stacks vertically).
- Contact pills stack vertically.
- Drawer becomes full-screen width.
- Parallax effects can be disabled for performance.

---

## 8. PERFORMANCE NOTES

- Use `will-change: transform` on the marquee, parallax elements, and drawer.
- Prefer `transform` and `opacity` for all animations (GPU-composited, no reflow).
- Debounce scroll event handlers or use `requestAnimationFrame`.
- Use `IntersectionObserver` instead of scroll listeners for reveal animations.
- Disable parallax on `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  .marquee-track { animation: none; }
  [data-animate] { opacity: 1; transform: none; transition: none; }
}
```

---

## 9. Z-INDEX STACK

| Layer | Z-index | Element |
|---|---|---|
| Base | `0` | Page content |
| Parallax photo | `1` | Hero photo |
| Marquee | `2` | Hero name marquee |
| Work preview | `100` | Hover project thumbnail |
| Nav | `500` | Fixed top navbar |
| Menu drawer | `900` | Slide-in nav drawer |
| Menu button | `1000` | Fixed hamburger circle |
| Custom cursor | `9999` | Custom cursor element |

---

*End of specification. Every detail above was directly observed from the reference video frames and represents the exact design system to replicate.*