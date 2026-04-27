# Portfolio Website Refactor Specification

> A comprehensive guide for AI-assisted refactoring of a Next.js portfolio website.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Setup](#project-setup)
4. [Performance Goals](#performance-goals)
5. [Design System](#design-system)
6. [Sections to Rebuild](#sections-to-rebuild)
7. [Dark Mode Implementation](#dark-mode-implementation)
8. [Navigation / Menu](#navigation--menu)
9. [Components to Install](#components-to-install)
10. [File Structure](#file-structure)
11. [Component Code](#component-code)

---

## Project Overview

Its important that the content will still be the same, were just refactoring the UI.

The existing portfolio website loads too slowly and needs a **full UI refactor**. The goal is to:


- Remove background animations that hurt performance and other components that are not needed and that hurts the performance of the website making it too laggy
- Add parallax effects and smooth scrolling
- Modernize the UI using the reference components as visual inspiration
- Implement a dark/light theme with a cinematic circle-reveal transition
- Ensure the site is fully responsive and production-ready

> **Reference Folder:** `@components/Reference` and `@components/Reference/_layout`
> Use these **only as visual/structural inspiration**. Create all new components inside `@components/` (not inside the Reference folder).

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| **Next.js** | Framework |
| **Cloudinary** | Image optimization & delivery |
| **Framer Motion** | Animations & page transitions |
| **GSAP + Lenis** | Scroll-based animations & smooth scrolling |
| **React Wrap Balancer** | Balanced typography |
| **Styled Components** | Component-level styles |
| **Tailwind CSS** | Utility-first styling with custom plugin |
| **PostCSS** | CSS processing with plugins |
| **clsx + twMerge** | Conditional class merging |
| **shadcn/ui** | Pre-built accessible UI components |
| **next-themes** | Dark/light theme management |
| **ESLint + Stylelint** | Code linting |
| **Prettier** | Code formatting |
| **Husky + lint-staged** | Pre-commit hooks |
| **pnpm** | Package manager |

---

## Project Setup

### 1. Initialize shadcn/ui

```bash
pnpm dlx shadcn@latest init
```

During setup, choose:
- **TypeScript:** Yes
- **Tailwind CSS:** Yes
- **Components path:** `@/components/ui` ← **This path is required**
- **Utils path:** `@/lib/utils`

> ⚠️ The `/components/ui` folder is critical. shadcn components are copied here and imported across the app. Do not rename or relocate it.

---

### 2. Install All Dependencies

```bash
pnpm add gsap @studio-freight/lenis framer-motion next-themes \
  react-wrap-balancer styled-components clsx tailwind-merge \
  lucide-react next-cloudinary \
  @radix-ui/react-switch @radix-ui/react-label class-variance-authority

pnpm add -D eslint stylelint prettier husky lint-staged \
  eslint-config-next @typescript-eslint/eslint-plugin \
  postcss autoprefixer tailwindcss
```

---

### 3. Install shadcn Components

```bash
pnpm dlx shadcn@latest add switch label button
```

---

## Performance Goals

- **Remove** all CSS/canvas background animations from the existing site
- Use `next/image` + Cloudinary for all images (lazy loading, proper sizing)
- Use `will-change` and `transform` for GPU-accelerated animations only
- Keep GSAP animations scoped — kill tweens on component unmount
- Use Lenis for smooth scroll (replaces native scroll)
- Avoid layout thrash: batch GSAP reads/writes

---

## Design System

### Fonts

Use the **same fonts** found in `@components/Reference/_fonts`. Apply them via `next/font` or CSS `@font-face` — match the Reference folder exactly.

### Colors & Theming

- Support both **light** and **dark** themes
- Use CSS custom properties (`--background`, `--foreground`, etc.) defined in `globals.css`
- Tailwind's `dark:` variant should be enabled via `class` strategy in `tailwind.config.ts`:

```ts
// tailwind.config.ts
darkMode: 'class',
```

### Utilities

Always use this pattern for class merging:

```ts
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Place this in `@/lib/utils.ts`.

---

## Sections to Rebuild

All sections below must be **completely redesigned** — do not reuse existing section code. Use the Reference folder as a style/layout guide only.

### Sections

| Section | Notes |
|---------|-------|
| **Hero** | Full redesign — parallax, bold typography, Framer Motion entrance |
| **About Me** | New layout — use React Wrap Balancer for text, parallax image |
| **Skills** | Modern grid/card layout with stagger animations |
| **Projects** | Card/showcase layout with hover effects |
| **Certificates** | Clean grid, lightbox or modal on click |
| **Menu/Nav** | Replace entirely — see [Navigation section below](#navigation--menu) |

### General UI Requirements

- Fully responsive (mobile-first)
- Page transitions using Framer Motion
- Smooth scrolling via GSAP + Lenis
- All animations should respect `prefers-reduced-motion`

---

## Dark Mode Implementation

### Theme Toggle Button — Circle Reveal Animation

When the user clicks the theme toggle button:

1. A **circle animation** expands from the button position
2. The circle covers the entire screen
3. The theme switches (light ↔ dark)
4. The transition should be smooth in **both directions**

**Implementation approach:**

Use the [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) or a GSAP `clipPath` circle expansion originating from the button's `getBoundingClientRect()` position.

```ts
// Example GSAP circle reveal
gsap.fromTo(
  overlayRef.current,
  { clipPath: `circle(0% at ${x}px ${y}px)` },
  { clipPath: `circle(150% at ${x}px ${y}px)`, duration: 0.6, ease: 'power2.inOut',
    onComplete: () => setTheme(nextTheme) }
)
```

### Theme Switch Component

Place at: `@/components/ui/theme-switch.tsx`

Two variants are provided — use `ThemeSwitchFlowGlass` for the main UI (WebGL animated background on the toggle track).

See full component code in the [Component Code](#component-code) section below.

---

## Navigation / Menu

Replace the existing menu with the **StaggeredMenu** component.

### Usage

```tsx
import StaggeredMenu from '@/components/StaggeredMenu';

const menuItems = [
  { label: 'Home',         ariaLabel: 'Go to home page',    link: '/' },
  { label: 'About',        ariaLabel: 'Learn about me',     link: '/about' },
  { label: 'Projects',     ariaLabel: 'View my projects',   link: '/projects' },
  { label: 'Contact',      ariaLabel: 'Get in touch',       link: '/contact' },
];

const socialItems = [
  { label: 'Twitter',  link: 'https://twitter.com/yourhandle' },
  { label: 'GitHub',   link: 'https://github.com/yourhandle' },
  { label: 'LinkedIn', link: 'https://linkedin.com/in/yourhandle' },
];

export default function Layout() {
  return (
    <div style={{ height: '100vh' }}>
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials
        displayItemNumbering={true}
        menuButtonColor="#ffffff"
        openMenuButtonColor="#fff"
        changeMenuColorOnOpen={true}
        colors={['#B19EEF', '#5227FF']}
        logoUrl="/logo.svg"
        accentColor="#5227FF"
        isFixed={true}
        onMenuOpen={() => console.log('Menu opened')}
        onMenuClose={() => console.log('Menu closed')}
      />
    </div>
  );
}
```

---

## Components to Install

### `@/components/ui/switch.tsx`

```tsx
"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
```

---

### `@/components/ui/label.tsx`

```tsx
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
```

---

## Component Code

### `@/components/ui/theme-switch.tsx` — Simple Variant

```tsx
"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const ThemeSwitch = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [checked, setChecked] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => setChecked(resolvedTheme === "dark"), [resolvedTheme]);

  const handleCheckedChange = useCallback(
    (isChecked: boolean) => {
      setChecked(isChecked);
      setTheme(isChecked ? "dark" : "light");
    },
    [setTheme],
  );

  if (!mounted) return null;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        "h-9 w-20",
        className
      )}
      {...props}
    >
      <Switch
        checked={checked}
        onCheckedChange={handleCheckedChange}
        className={cn(
          "peer absolute inset-0 h-full w-full rounded-full bg-input/50 transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "[&>span]:h-7 [&>span]:w-7 [&>span]:rounded-full [&>span]:bg-background [&>span]:shadow [&>span]:z-10",
          "data-[state=unchecked]:[&>span]:translate-x-1",
          "data-[state=checked]:[&>span]:translate-x-[44px]"
        )}
      />
      <span className="pointer-events-none absolute left-2 inset-y-0 z-0 flex items-center justify-center">
        <SunIcon
          size={16}
          className={cn(
            "transition-all duration-200 ease-out",
            checked ? "text-muted-foreground/70" : "text-foreground scale-110"
          )}
        />
      </span>
      <span className="pointer-events-none absolute right-2 inset-y-0 z-0 flex items-center justify-center">
        <MoonIcon
          size={16}
          className={cn(
            "transition-all duration-200 ease-out",
            checked ? "text-foreground scale-110" : "text-muted-foreground/70"
          )}
        />
      </span>
    </div>
  );
};

export default ThemeSwitch;
```

---

### `@/components/ui/theme-switch-flow-glass.tsx` — WebGL Animated Variant *(Recommended)*

> This is the premium variant. It renders a WebGL shader animation as the toggle background, with parallax mouse tracking and theme-aware colors.

```tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  /** Animation intensity (0.5–2), default 1 */
  intensity?: number;
};

export default function ThemeSwitchFlowGlass({
  className,
  intensity = 1,
  ...props
}: Props) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [checked, setChecked] = useState(false);

  const prefersReducedMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches,
    [],
  );

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const progRef = useRef<WebGLProgram | null>(null);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const vaoRef = useRef<WebGLVertexArrayObject | null>(null);
  const vboRef = useRef<WebGLBuffer | null>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const hoverRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const uniforms = useRef<{
    res?: WebGLUniformLocation | null;
    time?: WebGLUniformLocation | null;
    theme?: WebGLUniformLocation | null;
    mouse?: WebGLUniformLocation | null;
    power?: WebGLUniformLocation | null;
  }>({});

  useEffect(() => setMounted(true), []);
  useEffect(() => setChecked(resolvedTheme === "dark"), [resolvedTheme]);

  const onChange = useCallback(
    (v: boolean) => {
      setChecked(v);
      setTheme(v ? "dark" : "light");
    },
    [setTheme],
  );

  // Mouse parallax tracking
  useEffect(() => {
    if (!mounted) return;
    const el = canvasRef.current?.parentElement;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      hoverRef.current.x += ((e.clientX - r.left) / Math.max(1, r.width) - hoverRef.current.x) * 0.25;
      hoverRef.current.y += ((e.clientY - r.top) / Math.max(1, r.height) - hoverRef.current.y) * 0.25;
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [mounted]);

  // WebGL setup & render loop
  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", { antialias: true, premultipliedAlpha: true });
    if (!gl) return;
    glRef.current = gl;

    const vertSrc = `#version 300 es
      precision highp float;
      layout(location=0) in vec2 a_pos;
      out vec2 v_uv;
      void main(){ v_uv = a_pos * 0.5 + 0.5; gl_Position = vec4(a_pos, 0.0, 1.0); }
    `;
    const fragSrc = `#version 300 es
      precision highp float;
      out vec4 fragColor;
      in vec2 v_uv;
      uniform vec2 iResolution; uniform float iTime; uniform int iTheme;
      uniform vec2 iMouse; uniform float iPower;
      float hash(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
      float noise(vec2 p){ vec2 i=floor(p),f=fract(p); float a=hash(i),b=hash(i+vec2(1.,0.)),c=hash(i+vec2(0.,1.)),d=hash(i+vec2(1.,1.)); vec2 u=f*f*(3.-2.*f); return mix(mix(a,b,u.x),mix(c,d,u.x),u.y); }
      float fbm(vec2 p){ float s=0.0,a=0.5; for(int i=0;i<5;i++){ s+=a*noise(p); p*=2.0; a*=0.5; } return s; }
      vec2 flow(vec2 p){ float e=0.01; float n1=fbm(p),nx=fbm(p+vec2(e,0.)),ny=fbm(p+vec2(0.,e)); vec2 g=vec2(nx-n1,ny-n1)/e; return vec2(-g.y,g.x); }
      vec3 tonemap(vec3 c){ return c/(c+vec3(1.0)); }
      void main(){
        vec2 uv=v_uv; vec2 m=iMouse; vec2 center=mix(vec2(0.5),m,0.35);
        vec2 p=(uv-center); float ar=iResolution.x/max(iResolution.y,1.0); p.x*=ar;
        float t=iTime*(0.6+0.6*iPower);
        vec2 q=p*(2.2+0.2*iPower);
        q+=0.15*flow(q+vec2(t*0.2,-t*0.17)); q+=0.10*flow(q*1.7+vec2(-t*0.18,t*0.21));
        float f1=fbm(q*2.0+vec2(t*0.10,-t*0.13)); float f2=fbm(q*3.4+vec2(-t*0.09,t*0.07));
        float ink=smoothstep(0.25,0.85,0.55*f1+0.45*f2);
        vec3 tintLight=vec3(1.00,0.96,0.90); vec3 tintDark=vec3(0.86,0.92,1.00);
        vec3 base=mix(tintLight,tintDark,float(iTheme));
        vec3 colInk=mix(vec3(0.22,0.20,0.18),vec3(0.18,0.22,0.28),float(iTheme));
        vec3 colBg=mix(vec3(0.97,0.98,1.00),vec3(0.10,0.12,0.16),float(iTheme));
        vec3 col=mix(colBg,mix(base,colInk,0.35),ink);
        float sweep=0.25+0.25*sin(t*0.9+uv.x*6.0-uv.y*3.0);
        float h=smoothstep(0.03,0.0,abs(length(p*vec2(1.2,1.8))-sweep));
        vec3 spec=mix(vec3(1.0,0.95,0.85),vec3(0.80,0.88,1.0),float(iTheme));
        col+=0.15*spec*h;
        float vig=smoothstep(0.78,0.35,length(p)); col*=mix(1.0,0.93,vig);
        fragColor=vec4(tonemap(col),0.88);
      }
    `;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src); gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) { gl.deleteShader(sh); return null; }
      return sh;
    };
    const vs = compile(gl.VERTEX_SHADER, vertSrc);
    const fs = compile(gl.FRAGMENT_SHADER, fragSrc);
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs); gl.attachShader(prog, fs);
    gl.bindAttribLocation(prog, 0, "a_pos"); gl.linkProgram(prog);
    gl.deleteShader(vs); gl.deleteShader(fs);
    progRef.current = prog;
    const vao = gl.createVertexArray()!; gl.bindVertexArray(vao); vaoRef.current = vao;
    const vbo = gl.createBuffer()!; gl.bindBuffer(gl.ARRAY_BUFFER, vbo); vboRef.current = vbo;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    uniforms.current.res = gl.getUniformLocation(prog, "iResolution");
    uniforms.current.time = gl.getUniformLocation(prog, "iTime");
    uniforms.current.theme = gl.getUniformLocation(prog, "iTheme");
    uniforms.current.mouse = gl.getUniformLocation(prog, "iMouse");
    uniforms.current.power = gl.getUniformLocation(prog, "iPower");

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const render = (ts: number) => {
      if (!progRef.current) return;
      if (!startRef.current) startRef.current = ts;
      const t = prefersReducedMotion ? 0 : (ts - startRef.current) / 1000;
      resize();
      gl.useProgram(progRef.current);
      gl.uniform2f(uniforms.current.res!, canvas.width, canvas.height);
      gl.uniform1f(uniforms.current.time!, t);
      gl.uniform1i(uniforms.current.theme!, resolvedTheme === "dark" ? 1 : 0);
      gl.uniform2f(uniforms.current.mouse!, hoverRef.current.x, hoverRef.current.y);
      gl.uniform1f(uniforms.current.power!, Math.max(0.5, Math.min(2, intensity)));
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);
    window.addEventListener("resize", resize);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      if (progRef.current) { gl.deleteProgram(progRef.current); progRef.current = null; }
      if (vboRef.current) { gl.deleteBuffer(vboRef.current); vboRef.current = null; }
      if (vaoRef.current) { gl.deleteVertexArray(vaoRef.current); vaoRef.current = null; }
    };
  }, [mounted, resolvedTheme, intensity, prefersReducedMotion]);

  if (!mounted) return null;

  return (
    <div
      className={cn(
        "relative flex h-10 w-24 select-none items-center justify-center",
        "transition-transform duration-150 will-change-transform",
        "hover:scale-[1.02] active:scale-[0.99]",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden rounded-full">
        <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 rounded-full border backdrop-blur-md border-white/25 bg-background/15"
        style={{ zIndex: 5 }}
      />
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        className={cn(
          "peer absolute inset-0 h-full w-full rounded-full",
          "!bg-transparent data-[state=checked]:!bg-transparent data-[state=unchecked]:!bg-transparent",
          "[&>span]:absolute [&>span]:top-1 [&>span]:left-1 [&>span]:h-8 [&>span]:w-8",
          "[&>span]:rounded-full [&>span]:bg-background/85 [&>span]:shadow [&>span]:z-30",
          "[&>span]:transition-transform [&>span]:duration-200",
          "data-[state=unchecked]:[&>span]:translate-x-0",
          "data-[state=checked]:[&>span]:translate-x-[56px]"
        )}
        style={{ zIndex: 10 }}
      />
      <span aria-hidden className="pointer-events-none absolute inset-y-0 left-[20px] -translate-x-1/2 z-20 flex items-center">
        <SunIcon size={16} className={cn("transition-all duration-300", checked ? "opacity-45" : "opacity-100 rotate-12")} />
      </span>
      <span aria-hidden className="pointer-events-none absolute inset-y-0 left-19 -translate-x-1/2 z-20 flex items-center">
        <MoonIcon size={16} className={cn("transition-all duration-300", checked ? "opacity-100 -rotate-12" : "opacity-45")} />
      </span>
    </div>
  );
}
```

---

### `@/components/StaggeredMenu.tsx`

> Full GSAP-animated navigation panel. Copy the full component source directly — it is self-contained with scoped CSS.

**Props Reference:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `'left' \| 'right'` | `'right'` | Side the panel slides from |
| `items` | `StaggeredMenuItem[]` | `[]` | Nav links |
| `socialItems` | `StaggeredMenuSocialItem[]` | `[]` | Social links shown at bottom |
| `displaySocials` | `boolean` | `true` | Show social links section |
| `displayItemNumbering` | `boolean` | `true` | Show numbered counter on items |
| `colors` | `string[]` | `['#B19EEF','#5227FF']` | Pre-layer slide colors |
| `menuButtonColor` | `string` | `'#fff'` | Toggle button text color (closed) |
| `openMenuButtonColor` | `string` | `'#fff'` | Toggle button text color (open) |
| `accentColor` | `string` | `'#5227FF'` | Accent color (numbers, social hover) |
| `logoUrl` | `string` | — | Path to logo image |
| `isFixed` | `boolean` | `false` | Use `position: fixed` on wrapper |
| `closeOnClickAway` | `boolean` | `true` | Close menu on outside click |
| `onMenuOpen` | `() => void` | — | Callback when menu opens |
| `onMenuClose` | `() => void` | — | Callback when menu closes |

---

## File Structure

```
@/
├── app/
│   ├── layout.tsx          # ThemeProvider wraps here
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── switch.tsx           # shadcn Switch
│   │   ├── label.tsx            # shadcn Label
│   │   ├── theme-switch.tsx     # Simple theme toggle
│   │   └── theme-switch-flow-glass.tsx  # WebGL toggle (recommended)
│   ├── StaggeredMenu.tsx        # GSAP menu
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Skills.tsx
│   ├── Projects.tsx
│   └── Certificates.tsx
├── lib/
│   └── utils.ts            # cn() helper
└── styles/
    └── globals.css         # CSS custom properties for theming
```

---

## Notes for the AI

- **Do not modify** anything inside `@components/Reference` — treat it as read-only inspiration
- **Create all new components** inside `@components/` (top level, not inside Reference)
- **Match fonts exactly** from `@components/Reference/_fonts`
- The `ThemeSwitchFlowGlass` component requires WebGL2 — provide a graceful fallback to `ThemeSwitch` for unsupported browsers
- All animations must respect `prefers-reduced-motion: reduce`
- Use `pnpm` for all package operations — do not use `npm` or `yarn`