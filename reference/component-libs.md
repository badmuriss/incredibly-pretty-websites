# Copy-in animated component libraries — Magic UI + React Bits (React-only)

Two **copy-in** libraries (the code lands in your project and becomes yours — not a runtime dependency), installable via the **shadcn registry**. They save time and deliver nicer motion than hand-rolled CSS. Both are **React** only (Vite / Next / vite-react-ssg). For Vue, use the equivalents at the bottom.

- **Magic UI** — [magicui.design](https://magicui.design) — ~80 components. **Default.** Tailwind + Motion native, light, built for product landing pages. Registry `@magicui`.
- **React Bits** — [reactbits.dev](https://reactbits.dev) — ~120 components. **Curated secondary.** More variety and spectacle (text effects, 3D galleries, WebGL backgrounds). Registry `@react-bits`.
- **lucide-animated** — [lucide-animated.com](https://lucide-animated.com) — 435+ **animated icons** based on Lucide (MIT). Covers a niche the other two don't: SVG icons that animate on hover via `motion`, with an imperative ref (`startAnimation`/`stopAnimation`).

**Why Magic UI is the default:** Tailwind-native (plays well with a `@theme`/token file, no friction), Motion-based, almost no WebGL (better LCP), and a restrained aesthetic that stays credible for serious/B2B work. Reach for React Bits when it has a specific component that beats the Magic UI equivalent, or when the brief calls for spectacle Magic UI doesn't have.

**Principle:** a ready, validated component beats building from scratch. Before hand-coding any animation/effect (reveal, marquee, beam, ticker, bento, card hover, background), **check Magic UI / React Bits first**. Build from scratch only when (a) nothing ready fits, or (b) the project's stack conflicts (see the LazyMotion guardrail). Reinventing what already exists burns time for nothing.

**Default for a NEW React project (greenfield):** scaffold with **Tailwind v4 + `components.json` + the registries** from day one, so `shadcn add` works immediately and you pull ready components instead of coding them. **Retrofit** (adding Tailwind later) only makes sense in a repo that already has Tailwind; a bespoke-CSS site with no Tailwind should NOT be retrofitted (the preflight reset breaks the existing look) — in that case copy the React Bits `-TS-CSS` variant by hand.

---

## GATE — by component WEIGHT, not by library

The axis is weight + slop risk, not the brand. **Both libraries have light and heavy components.**

| Weight | Examples | Rule |
|---|---|---|
| **Light** (CSS/Motion, no WebGL) | blur-fade, number-ticker, marquee, text-animate, split-text, count-up, shiny-text, border-beam, **lucide-animated icons** | Fine on a serious landing. Respect reduced-motion + only `transform`/`opacity`. |
| **Medium** (2D canvas / many animated nodes) | particles, meteors, animated-grid, flickering-grid, dock, orbiting-circles | One per section. Lazy below the fold. |
| **Heavy** (WebGL three/ogl, 3D) | Globe (Magic UI); aurora/galaxy/plasma/liquid-ether/hyperspeed, dome/circular-gallery, model-viewer (React Bits) | Spectacle only. One per page. `poster`/static at LCP. Hard reduced-motion gate. Wrong segment = slop. |

**Still applies (SKILL.md):** research decides *what* (§0); the preset's PREMIUM_TECH_TIER (§1) is the ceiling; reduced-motion is a gate, not decoration (§6); only `transform`/`opacity` animate (§7); no cross-framework imports — none of this in Vue (§3), use the native equivalent ([framework-adapters.md](framework-adapters.md)). Not a blind default: a trivial reveal uses native CSS/IntersectionObserver; a library earns its place when the specific effect justifies it.

---

## Setup — shadcn registry (once per repo)

The [shadcn](https://ui.shadcn.com) CLI serves both registries. Optionally register the shadcn MCP for interactive use:
```
claude mcp add shadcn -s user -- npx shadcn@latest mcp
```
No login (public registries). Headless works without the MCP.

**Per React repo (once):** you need `components.json` + the `@/` alias. If the repo lacks them:
1. Alias `@/` → `src` in `tsconfig.json`/`tsconfig.app.json` (`baseUrl`+`paths`) and `vite.config.ts` (`resolve.alias`). `shadcn init` requires the alias to pre-exist.
2. `npx shadcn@latest init -d -y` (auto-detects Vite + Tailwind v4, creates `components.json` + `src/lib/utils.ts`).
3. Add the registries to `components.json`:
```json
"registries": {
  "@magicui": "https://magicui.design/r/{name}.json",
  "@react-bits": "https://reactbits.dev/r/{name}.json"
}
```

**Install a component:**
```
npx shadcn@latest add @magicui/<kebab-name>          # e.g. @magicui/blur-fade, @magicui/marquee
npx shadcn@latest add @react-bits/<Name>-TS-TW        # PascalCase + variant! e.g. @react-bits/CountUp-TS-TW
```
> **React Bits naming is fiddly:** an item is `<PascalCase>-<TS|JS>-<TW|CSS>`. For a TS + Tailwind v4 repo use **`-TS-TW`**. The wrong slug (`count-up`) returns HTML, not JSON, and `add` breaks. Index: `https://reactbits.dev/r/registry.json`. Magic UI is a simple kebab slug, no suffix.

---

## Magic UI catalog (default — kebab slug)

**Landing structure:** `marquee` `bento-grid` `animated-list` `dock` `hero-video-dialog` `terminal` `orbiting-circles` `avatar-circles` `icon-cloud` `globe`(WebGL) `dotted-map` `tweet-card` `lens` `pointer`
**Special effects:** `animated-beam` `border-beam` `shine-border` `magic-card` `glare-hover` `meteors` `confetti` `particles`
**Text:** `text-animate` `typing-animation` `aurora-text` `video-text` `number-ticker` `animated-shiny-text` `animated-gradient-text` `text-reveal` `hyper-text` `word-rotate` `scroll-based-velocity` `sparkles-text` `morphing-text` `spinning-text` `line-shadow-text` `highlighter`
**Animation:** `blur-fade` (the staggered-entrance workhorse)
**Device mocks:** `safari` `iphone` `android` (for a product mockup)
**Buttons:** `shimmer-button` `rainbow-button` `ripple-button` `pulsating-button` `interactive-hover-button` `shiny-button`
**Backgrounds:** `noise-texture` (≤5% opacity) and `light-rays` (dark hero only, subtle) are the ONLY allowed ones. ~~`flickering-grid` `animated-grid-pattern` `retro-grid` `ripple` `dot-pattern` `grid-pattern` `hexagon-pattern` `striped-pattern` `interactive-grid-pattern`~~ — **BANNED**: decorative bg patterns (grids, dots, stripes, hexagons) are the #1 AI tell, worst over a gradient (slide-wallpaper look). See SKILL.md §13. Premium background = solid color, clean subtle gradient, or photo.

## React Bits — picks worth more than Magic UI (PascalCase-TS-TW)

Not "just heavy WebGL." Reach for these when Magic UI has no good equivalent:
- **Text effects Magic UI doesn't cover (light):** `DecryptedText` `ScrambledText` `TrueFocus` `VariableProximity` `FuzzyText` `ShinyText` `RotatingText` `ScrollReveal` `ScrollFloat`
- **Ready components with no Magic UI counterpart:** `ScrollStack` (sticky card stacking, replaces the hand-built version in SKILL.md §6), `LogoLoop` (polished logo marquee), `MagicBento` (richer bento), `CardSwap` `TiltedCard` `SpotlightCard` `ProfileCard` `Stepper` `Carousel` `Masonry` `Dock` `PillNav` `StaggeredMenu` `GooeyNav`
- **Heavy spectacle (creative brief / client who asks for it):** backgrounds `Aurora` `Silk` `Threads` `Beams` `LightRays` `Particles` `LiquidEther` `DarkVeil` `Prism`; `DomeGallery` `CircularGallery` `FlyingPosters` `ModelViewer`

**Avoid almost always (slop for serious/B2B):** `Galaxy` `Hyperspeed` `Balatro` `Ballpit` `FaultyTerminal` `LetterGlitch` `PixelSnow` + every **custom cursor** (`BlobCursor` `TargetCursor` `GhostCursor` `Crosshair` `SplashCursor`) — they break the pointer expectation and cost a11y. Declared creative portfolios only.

## lucide-animated — animated icons (light — install by URL)

435+ Lucide SVG icons that animate on hover (`motion`). Covers what Magic UI / React Bits don't: **icon micro-animation** in a button, nav item, feature card, or list. Names follow Lucide's kebab-case (`activity`, `arrow-right`, `circle-check`, `copy`, `send`).

**Install (by URL, kebab-case — NOT PascalCase):**
```
npx shadcn@latest add "https://lucide-animated.com/r/<icon-name>.json"   # e.g. arrow-right, copy, circle-check
```
Lands in `@/components/icons/<name>.tsx`. Single dependency: `motion` (added automatically on the first install). React 18+. MIT. The direct URL works headless (no `components.json` needed).

**Component API:** import the PascalCase name from the generated file — `import { ArrowRightIcon } from "@/components/icons/arrow-right"` (confirm the exported name; some carry an `Icon` suffix). All `SVGProps<SVGSVGElement>` props pass through (`className`, `onClick`, `aria-label`). Size/color via Tailwind (`className="size-6 text-primary"`) so it inherits your tokens. Animates on hover by default. Each icon `forwardRef`s a `{ startAnimation, stopAnimation }` handle for imperative control — trigger from the *parent's* state (animate when the whole button is hovered/focused) or on touch (no `:hover`):
```tsx
const ref = useRef<AnimatedIconHandle>(null);
<button onMouseEnter={() => ref.current?.startAnimation()}
        onMouseLeave={() => ref.current?.stopAnimation()}>
  <CopyIcon ref={ref} /> Copy
</button>
```

**Guardrails:** reduced-motion — the source animates `transform` on hover; in a LazyMotion (`m`) project, swap `motion`→`m` in the copied icon (same gotcha as Magic UI's Motion-based components, below). Sparingly: an animated icon is seasoning, not a whole trembling interface — one or two accent spots (CTA, active nav), not every `<li>`. **Being Lucide-based makes it the declared exception to the static-Lucide ban (SKILL.md §3):** use it ONLY hover/focus-animated as seasoning, never as the general static icon set (that stays Phosphor).

---

## Integration guardrails (both libraries)

- **LCP:** WebGL/canvas above the fold delays LCP. Keep the critical H1/CTA in HTML/CSS; let canvas enrich afterward (same rule as video, [media-pipeline.md](media-pipeline.md)). 3D/gallery = lazy + play-in-view.
- **Reduced-motion:** confirm the source respects it; otherwise wrap in `useReducedMotion()` (Motion) or a media query and fall back to static.
- **SSR (vite-react-ssg / Next):** WebGL/canvas is client-only — isolate it (`'use client'` / dynamic `ssr:false` / a boundary, [framework-adapters.md](framework-adapters.md)). Running it in SSR breaks the build.
- **Only `transform`/`opacity`** on what animates (SKILL.md §7). Audit the source — some demos animate expensive props.
- **Bundle:** Magic UI is light (Motion). React Bits WebGL pulls `three`/`ogl`/`postprocessing` (~150kb+). Check `package.json` (SKILL.md §3) and the cost first. Max one WebGL background per page.
- **LazyMotion vs eager `motion` (real gotcha):** if the project uses `LazyMotion`+`m` (optimized Motion, ~4.6kb vs ~34kb — better LCP), the Magic UI Motion-based components (`blur-fade`, `border-beam`, `text-animate`) import full `motion` and **clash** (LazyMotion strict bans `motion`; without strict you load both bundles = worse). Fix: (a) use Magic UI's **CSS-based** components (`marquee`, backgrounds, patterns, CSS `shine-border`) = zero Motion; (b) for Motion-based, swap `motion`→`m` before dropping in, OR implement natively with the project's `m`. **LazyMotion wins on perf — don't drop it for eager motion.** In a project *without* LazyMotion, Magic UI drops in directly.
- **Edit, don't paste raw:** copy-in means adapting color/scale to your tokens — never leave the demo's default palette.
- **`shadcn init` CLOBBERS an existing theme (real gotcha):** in a Tailwind repo that already has its own `@theme {}` (brand), `init` injects `@theme inline` + `:root` (neutral oklch) + `.dark` that redefine `--color-foreground/background/primary/muted` and `--font-*` → text disappears (white on white), the brand goes gray, the font swaps. In an already-themed project: after `init`, **remove the shadcn block** (`@theme inline`+`:root`+`.dark`, contiguous at the end of the CSS) and let your `@theme` reign — or reconcile token by token. Also remove the `@layer base { body{ @apply bg-background } }` global override. **Greenfield has no conflict** (it's born with the shadcn theme). Always check the rendered result after `init`.
- **vite-react-ssg + react-helmet-async under React 19 (build crash):** the SSG's parallel render trips `Invariant: nest <Helmet>` non-deterministically (helmet 1.3.0 isn't concurrency-safe). Fix: `ssgOptions: { concurrency: 1 }` in `vite.config.ts` (serializes) + `import type {} from 'vite-react-ssg'` to activate the type augmentation. Moving `<JsonLd>`/function-components OUT of `<Head>` (only title/meta/link inside) helps but isn't enough alone.

---

## Vue equivalents

For a Vue/Nuxt project, don't import any of the above. Use:
- **Vue Bits** — [vue-bits.dev](https://vue-bits.dev) — the official React Bits port (same author, curated, Nuxt support). Same catalog names, Vue components.
- **motion-v** — [motion.dev/vue](https://motion.dev/vue) — the Motion equivalent (~5kb, a Nuxt module).
- **GSAP** — for scroll-telling ([scroll-motion.md](scroll-motion.md)).

These replace the hand-built versions (Word Pull-Up, sticky-stacking, marquee) when the project is Vue. **Vanilla** projects use native CSS/WAAPI — no component library.
