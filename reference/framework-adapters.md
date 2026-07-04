# Framework Adapters

This skill is React-first but framework-agnostic in principle. Implementation idioms for the three targets it supports — **React/Next (primary)**, **Vue/Nuxt**, and **vanilla JS/CSS** — live here.

> Always check `package.json` first. Use the lib already installed; don't add a second motion library to a project that already has one.

## Motion library

| Concern | React (primary) | Vue (Nuxt) | Vanilla JS |
|---|---|---|---|
| Library | `motion` (motion.dev — the successor to Framer Motion, imported from `motion/react`; legacy projects use `framer-motion`) | `motion-v` (`motion.dev/vue`) or `@vueuse/motion` | Web Animations API + CSS transitions/`@keyframes` |
| Component primitive | `<motion.div>` | `<motion.div>` (motion-v) or `v-motion` | `element.animate([...], {...})` |
| Spring value | `useSpring()` | `useSpring()` (vueuse) | manual RAF loop or CSS |
| Tween value | `useMotionValue()` + `useTransform()` | `useMotionProperties()` + `useSpring()` | CSS custom properties + `.style.setProperty()` |
| Enter/leave list | `<AnimatePresence>` | `<AnimatePresence>` (motion-v) / `<TransitionGroup>` | manual mount/unmount + transitionend |
| Shared layout | `layoutId="x"` | `layoutId` (motion-v) / `view-transition-name` | View Transitions API (`document.startViewTransition`) |
| Scroll-driven | `useScroll()`, `useInView()` | VueUse `useScroll`, `useElementVisibility` | IntersectionObserver + scroll-driven CSS animations |
| Stagger | `staggerChildren` in variants | per-child `:delay` via variants | `animation-delay` cascade by index |

**Hardware-accel caveat (all targets):** shorthand `x`/`y`/`scale` props go through main-thread JS. Under load, prefer:
- a `transform: "translateX(100px)"` string animation, OR
- CSS variables flipped via `.style.setProperty()`, OR
- the Web Animations API directly (`element.animate(...)`).

**Magnetic micro-physics — never use raw state per frame:**
- React: `useMotionValue` + `useTransform`, NEVER `useState` in `mousemove`.
- Vue: `useMotionProperties` + `useSpring`, NEVER a `ref` re-render in `mousemove`.
- Vanilla: update a CSS variable or `transform` directly in the handler, no framework re-render.

## Hydration / client-only boundary

| Need | React (Next) | Vue (Nuxt) | Vanilla |
|---|---|---|---|
| Client-only render | `dynamic(() => import('./X'), { ssr: false })` | `<ClientOnly>` wrapper | render on `DOMContentLoaded` |
| Browser API guard | `if (typeof window !== 'undefined')` or `useEffect` | `import.meta.client` (NEVER `typeof window` in Nuxt) | script at end of `<body>` or `defer` |
| Server vs client component | RSC default; `'use client'` at the top | all components SSR'd; opt out via `<ClientOnly>` | n/a (no SSR unless you add it) |
| Mount-only effect | `useEffect(() => {...}, [])` | `onMounted(() => {...})` | `DOMContentLoaded` listener |

**Rule:** components depending on client state/motion MUST sit behind the framework's client-only boundary so SSR renders safe markup and hydration attaches reactivity. In vanilla, gate anything touching `window`/`document` until the DOM is ready.

## State (local UI)

| Need | React | Vue | Vanilla |
|---|---|---|---|
| Single value | `useState()` | `ref()` | a plain variable + a render function |
| Derived | `useMemo()` | `computed()` | compute inline |
| Reducer-like | `useReducer()` | `reactive()` object | an object + an update function |
| Global | Zustand / Jotai / Context | Pinia / Nuxt `useState()` (SSR-safe) | a module-scope store or a custom event bus |

Default to local. Reach for global only to avoid deep prop-drilling.

## Icons

| Target | Library |
|---|---|
| React/Next | `@phosphor-icons/react` |
| Vue/Nuxt | `@phosphor-icons/vue` |
| Vanilla | Phosphor SVG sprites or inline SVG |

**Static Lucide is BANNED** (it reads as generic AI-SaaS, everyone uses it) — see SKILL.md §3. Exception: a hover-animated icon via **lucide-animated** ([component-libs.md](component-libs.md)). Pick ONE weight (`regular` clean / `bold` stronger) project-wide. SVG primitives are fine for one-offs. Never an icon inside a background box.

**No cross-framework imports:** don't install `@phosphor-icons/react` in a Vue project. Don't install `motion/react` (or `framer-motion`) in a Vue project. Don't use `'use client'` outside React.

## Tailwind version

Always check `package.json`:

| Version | Config | Theme | Notes |
|---|---|---|---|
| **v3** | `tailwind.config.ts` | `theme.extend` | Plugin in `postcss.config.js`. |
| **v4** | CSS-first | `@theme` block in CSS | Use `@tailwindcss/postcss` or the Vite plugin — NOT the `tailwindcss` plugin in the postcss config. |

Don't mix syntaxes. Don't migrate v3→v4 unprompted.

## File extension conventions

| Target | Component file | Logic file |
|---|---|---|
| React/Next | `.tsx` (or `.jsx`) | `.ts` / `.tsx` |
| Vue/Nuxt | `.vue` (`<script setup lang="ts">`) | `.ts` (composable) |
| Vanilla | `.html` + `.js`/`.ts` | `.js` / `.ts` |

## Anti-emoji policy applies everywhere

Never put emojis in `.tsx` / `.vue` / `.html` source. Emojis are acceptable only inside client-controlled CMS/YAML content.

## Component primitives

If a starter ships `<Container>` and `<Button>` for the framework, use them — don't reimplement. Customization goes through props/variants.
