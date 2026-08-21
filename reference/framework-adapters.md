# Framework Adapters

This skill is React-first but framework-agnostic in principle. Implementation idioms for the four targets it supports — **React/Next (primary)**, **Astro**, **Vue/Nuxt**, and **vanilla JS/CSS** — live here.

> Always check `package.json` first. Use the lib already installed; don't add a second motion library to a project that already has one.

## Motion library

| Concern | React (primary) | Astro | Vue (Nuxt) | Vanilla JS |
|---|---|---|---|---|
| Library | `motion` (motion.dev — the successor to Framer Motion, imported from `motion/react`; legacy projects use `framer-motion`) | CSS/WAAPI first; `astro:transitions` for navigation; a framework motion library only inside its matching island | `motion-v` (`motion.dev/vue`) or `@vueuse/motion` | Web Animations API + CSS transitions/`@keyframes` |
| Component primitive | `<motion.div>` | semantic `.astro` markup plus scoped CSS; isolated `<ReactIsland client:visible />` or `<VueIsland client:visible />` only when required | `<motion.div>` (motion-v) or `v-motion` | `element.animate([...], {...})` |
| Spring value | `useSpring()` | WAAPI or a tiny island; no page-wide client runtime for one spring | `useSpring()` (vueuse) | manual RAF loop or CSS |
| Tween value | `useMotionValue()` + `useTransform()` | CSS custom properties + WAAPI | `useMotionProperties()` + `useSpring()` | CSS custom properties + `.style.setProperty()` |
| Enter/leave list | `<AnimatePresence>` | CSS transitions or an island when live client state owns the list | `<AnimatePresence>` (motion-v) / `<TransitionGroup>` | manual mount/unmount + transitionend |
| Shared layout | `layoutId="x"` | `transition:name` / `view-transition-name` with Astro View Transitions | `layoutId` (motion-v) / `view-transition-name` | View Transitions API (`document.startViewTransition`) |
| Scroll-driven | `useScroll()`, `useInView()` | IntersectionObserver or scroll-driven CSS; GSAP only for approved Tier 3 storytelling | VueUse `useScroll`, `useElementVisibility` | IntersectionObserver + scroll-driven CSS animations |
| Stagger | `staggerChildren` in variants | scoped CSS custom property by index or a tiny observer script | per-child `:delay` via variants | `animation-delay` cascade by index |

**Hardware-accel caveat (all targets):** shorthand `x`/`y`/`scale` props go through main-thread JS. Under load, prefer:
- a `transform: "translateX(100px)"` string animation, OR
- CSS variables flipped via `.style.setProperty()`, OR
- the Web Animations API directly (`element.animate(...)`).

**Magnetic micro-physics — never use raw state per frame:**
- React: `useMotionValue` + `useTransform`, NEVER `useState` in `mousemove`.
- Vue: `useMotionProperties` + `useSpring`, NEVER a `ref` re-render in `mousemove`.
- Vanilla: update a CSS variable or `transform` directly in the handler, no framework re-render.

## Astro islands and CMS rendering

Astro renders semantic HTML on the server by default. Treat that as the performance baseline, not as a limitation.

- Build layouts, sections, typography, images, navigation, Portable Text output, SEO head, and ordinary disclosures as `.astro` components.
- Use `client:visible` for below-the-fold interactive islands, `client:idle` for low-priority enhancements, and `client:load` only when the first viewport cannot function without the island.
- Never put the whole page inside a React or Vue island to reuse a component library.
- A server-rendered CMS route must query content during the request or through the CMS integration's supported live-collection API. Do not silently convert it to build-time content if editors expect changes without a deploy.
- Keep admin/CMS code outside the visual reference lock. The public theme may be redesigned; the CMS admin keeps its own interaction system unless the task explicitly targets it.
- For EmDash, define editable content boundaries before design implementation. Decorative composition stays in code; client-owned text, images, SEO fields, contacts, offers, FAQs, and blog entries live in collections or sections. Do not make layout-critical implementation tokens editable as free text.

## Hydration / client-only boundary

| Need | React (Next) | Astro | Vue (Nuxt) | Vanilla |
|---|---|---|---|---|
| Client-only render | `dynamic(() => import('./X'), { ssr: false })` | `client:only="react"` or `client:only="vue"`, exceptional because it removes SSR HTML | `<ClientOnly>` wrapper | render on `DOMContentLoaded` |
| Browser API guard | `if (typeof window !== 'undefined')` or `useEffect` | frontmatter is server-only; browser code belongs in `<script>` or a hydrated island | `import.meta.client` (NEVER `typeof window` in Nuxt) | script at end of `<body>` or `defer` |
| Server vs client component | RSC default; `'use client'` at the top | `.astro` server component by default; a `client:*` directive hydrates only the imported island | all components SSR'd; opt out via `<ClientOnly>` | n/a (no SSR unless you add it) |
| Mount-only effect | `useEffect(() => {...}, [])` | module script or island lifecycle; clean up on `astro:before-swap` when View Transitions are enabled | `onMounted(() => {...})` | `DOMContentLoaded` listener |

**Rule:** components depending on client state/motion MUST sit behind the framework's client-only boundary so SSR renders safe markup and hydration attaches reactivity. In Astro, prefer server HTML plus progressive enhancement and hydrate only the smallest state owner. In vanilla, gate anything touching `window`/`document` until the DOM is ready.

## State (local UI)

| Need | React | Astro | Vue | Vanilla |
|---|---|---|---|---|
| Single value | `useState()` | server value in frontmatter; client value inside the chosen island or DOM controller | `ref()` | a plain variable + a render function |
| Derived | `useMemo()` | derive in frontmatter for SSR, or inside the owning island | `computed()` | compute inline |
| Reducer-like | `useReducer()` | use an island when state is genuinely complex | `reactive()` object | an object + an update function |
| Global | Zustand / Jotai / Context | avoid cross-island state; use a nanostore only when independent islands must share client state | Pinia / Nuxt `useState()` (SSR-safe) | a module-scope store or a custom event bus |

Default to local. Reach for global only to avoid deep prop-drilling.

## Icons

| Target | Library |
|---|---|
| React/Next | `@phosphor-icons/react` |
| Astro | existing Astro icon integration or inline Phosphor SVG; do not add a React renderer for icons |
| Vue/Nuxt | `@phosphor-icons/vue` |
| Vanilla | Phosphor SVG sprites or inline SVG |

Preserve the project's established icon family, including Lucide, and never introduce a second family during local or surface work. In greenfield work, default to Phosphor and avoid static Lucide as a generic AI-SaaS reflex. Hover-animated **lucide-animated** remains valid seasoning ([component-libs.md](component-libs.md)). Pick one weight project-wide. SVG primitives are fine for one-offs. Never put an icon inside a decorative background box.

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
| Astro | `.astro`; framework islands keep their native extension | `.ts` for server utilities and browser-safe modules |
| Vue/Nuxt | `.vue` (`<script setup lang="ts">`) | `.ts` (composable) |
| Vanilla | `.html` + `.js`/`.ts` | `.js` / `.ts` |

## Anti-emoji policy applies everywhere

Never put emojis in `.tsx` / `.vue` / `.html` source. Emojis are acceptable only inside client-controlled CMS/YAML content.

## Component primitives

If a starter ships `<Container>` and `<Button>` for the framework, use them — don't reimplement. Customization goes through props/variants.
