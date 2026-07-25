# Copy-in animated component libraries — Magic UI + React Bits (React-only)

Two **copy-in** libraries (the code lands in your project and becomes yours — not a runtime dependency), installable via the **shadcn registry**. They save time and deliver nicer motion than hand-rolled CSS. Both are **React** only (Vite / Next / vite-react-ssg). For Vue, use the equivalents at the bottom.

- **Magic UI** — [magicui.design](https://magicui.design) — ~80 components. **Default.** Tailwind + Motion native, light, built for product landing pages. Registry `@magicui`.
- **React Bits** — [reactbits.dev](https://reactbits.dev) — ~120 components. **Curated secondary.** More variety and spectacle (text effects, 3D galleries, WebGL backgrounds). Registry `@react-bits`.
- **lucide-animated** — [lucide-animated.com](https://lucide-animated.com) — 435+ **animated icons** based on Lucide (MIT). Covers a niche the other two don't: SVG icons that animate on hover via `motion`, with an imperative ref (`startAnimation`/`stopAnimation`).

**Separate, on a different axis: Canvas UI** — [canvasui.dev](https://canvasui.dev) — shaders over your live DOM. The three above gate on **weight**; this one gates on **browser support** (22 of 25 components need a pre-release Chrome flag). It is not a fourth default — read "Canvas UI — experimental tier" below before considering it, and in most projects the answer is no, or only its 3 `*-Object` components.

**Why Magic UI is the default:** Tailwind-native (plays well with a `@theme`/token file, no friction), Motion-based, almost no WebGL (better LCP), and a restrained aesthetic that stays credible for serious/B2B work. Reach for React Bits when it has a specific component that beats the Magic UI equivalent, or when the brief calls for spectacle Magic UI doesn't have.

**Principle:** a ready, validated component beats building from scratch. Before hand-coding any animation/effect (reveal, marquee, beam, ticker, bento, card hover, background), **check Magic UI / React Bits first**. Build from scratch only when (a) nothing ready fits, or (b) the project's stack conflicts (see the LazyMotion guardrail). Reinventing what already exists burns time for nothing.

**Default for a NEW React project (greenfield):** scaffold with **Tailwind v4 + `components.json` + the registries** from day one, so `shadcn add` works immediately and you pull ready components instead of coding them. **Retrofit** (adding Tailwind later) only makes sense in a repo that already has Tailwind; a bespoke-CSS site with no Tailwind should NOT be retrofitted (the preflight reset breaks the existing look) — in that case copy the React Bits `-TS-CSS` variant by hand.

---

## GATE — by component WEIGHT, not by library

The axis is weight + slop risk, not the brand. **Both libraries have light and heavy components.** The fourth row is the exception that proves it: Canvas UI's gate is not weight but **browser support**.

| Weight | Examples | Rule |
|---|---|---|
| **Light** (CSS/Motion, no WebGL) | blur-fade, number-ticker, marquee, text-animate, split-text, count-up, shiny-text, border-beam, **lucide-animated icons** | Fine on a serious landing. Respect reduced-motion + only `transform`/`opacity`. |
| **Medium** (2D canvas / many animated nodes) | particles, meteors, animated-grid, flickering-grid, dock, orbiting-circles | One per section. Lazy below the fold. |
| **Heavy** (WebGL three/ogl, 3D) | Globe (Magic UI); aurora/galaxy/plasma/liquid-ether/hyperspeed, dome/circular-gallery, model-viewer (React Bits); **Canvas UI's 3 `*-Object` components** | Spectacle only. One per page. `poster`/static at LCP. Hard reduced-motion gate. Wrong segment = slop. |
| **Experimental** (pre-release browser API) | Canvas UI's 22 html-in-canvas components — Liquid, Blaze, Shatter, VHS, Glass, Asciify… (**not** the 3 `*-Object` ones, those are Heavy above) | One per page, **decorative only, above the fold only**. NEVER over an interactive control or over text meant to be read (the shader moves pixels, not hit-targets). The plain-DOM fallback is designed and verified FIRST. Tier 3 **and** a declared portfolio/experimental brief — see "Canvas UI" below. |

**Still applies (SKILL.md):** research decides *what* (§0); the preset's PREMIUM_TECH_TIER (§1) is the ceiling; reduced-motion is a gate, not decoration (§6); only `transform`/`opacity` animate (§7); no cross-framework imports — none of this in Vue (§3), use the native equivalent ([framework-adapters.md](framework-adapters.md)) (Canvas UI excepted: it ships a real build per framework, see Vue equivalents). Not a blind default: a trivial reveal uses native CSS/IntersectionObserver; a library earns its place when the specific effect justifies it.

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
  "@react-bits": "https://reactbits.dev/r/{name}.json",
  "@canvas-ui": "https://canvasui.dev/r/{name}.json"
}
```

**Install a component:**
```
npx shadcn@latest add @magicui/<kebab-name>          # e.g. @magicui/blur-fade, @magicui/marquee
npx shadcn@latest add @react-bits/<Name>-TS-TW        # PascalCase + variant! e.g. @react-bits/CountUp-TS-TW
npx shadcn@latest add @canvas-ui/<kebab-name>-<fw>    # framework SUFFIX required! e.g. @canvas-ui/liquid-react
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

## Canvas UI — experimental tier (Chrome-flag-gated, NOT a default)

[canvasui.dev](https://canvasui.dev) — 25 copy-in components that turn your **live DOM into a WebGL texture** and run fragment shaders over it (fluid, fire, glass, ice, dither, VHS, shatter). Same author as React Bits (David Haz), same shadcn-registry mechanism, different risk axis entirely: weight is not the problem here, **browser support is**.

**The central fact, before anything else: 22 of the 25 components depend on a pre-release Chrome API** — `drawElementImage` + `requestPaint`/`onpaint` + the `layoutsubtree` canvas attribute (WICG HTML-in-Canvas) — **behind `chrome://flags/#canvas-draw-element`, in origin trial M148–M151, with no implementation announced in Firefox or Safari. Real reach in unflagged traffic today: ~0%.** Shipping it in production without flags means registering **your own** domain for the Chrome origin trial and serving the token (meta tag or HTTP header); canvasui.dev's token covers only canvasui.dev, and the trial **expires with M151** (stable ship "estimated late 2026", not promised). **Their README claims "Chrome or Edge 140+" — that is wrong. Trust Chromium 147+ for the flag and M148+ for the trial.**

### The split that decides everything: the 3 `*-Object` components never touch the DOM-capture API

**Dithered Object, Glass Object and Particle Object are ordinary three.js scenes** (a GLB/glTF model, SVG or image in a studio scene). No `drawElementImage`, no flag, no origin trial — **they work in every browser today.** This is the part of the library worth recommending: treat them exactly as any other **Heavy** WebGL component (one per page, lazy, `poster`/static at LCP, hard reduced-motion gate, Tier 3 segment) and ignore the rest of this page. Cost: `three` (~150kb+), the same bill as React Bits' `ModelViewer`.

Everything below concerns the other 22.

### Install (same registry as Magic UI / React Bits — see Setup above)
```
npx shadcn@latest add @canvas-ui/liquid-react     # framework suffix: react | vue | svelte | solid | preact | vanilla
```
Copy-in source into `components/canvasui/` (Svelte: `src/lib/components/canvasui/`), **zero runtime dependencies** except `three` on the three `*-Object` components. 15–51 KB of unminified TS per component. Targets React 19 / Vue 3.5 / Svelte 5 / Solid 1.9 / Preact 10.

```tsx
import { Liquid } from "@/components/canvasui/Liquid";

export default function Page() {
  return (
    <Liquid rainbow style={{ height: 480 }}>
      <YourContent />
    </Liquid>
  );
}
```

### Inventory + verdict

`HIC` = needs the Chrome flag. `Fallback` = what an unsupported browser gets: *works everywhere* / *overlay only* (shader still draws without a page texture) / *effect off* (plain HTML, no effect at all).

| Component | HIC | Fallback | Verdict |
|---|---|---|---|
| **Dithered Object** — GLB/glTF through a 1-bit Bayer dither | no | works everywhere | **Recommended** (gate as Heavy) |
| **Glass Object** — model/SVG/image as liquid glass, refraction + dispersion | no | works everywhere | **Recommended** (gate as Heavy) |
| **Particle Object** — model/SVG/image rebuilt as cursor-reactive particles | no | works everywhere | **Recommended** (gate as Heavy) |
| Liquid — pointer-driven fluid simulation | yes | overlay only | Decoration only (additive, no hit-target shift) |
| Ripple — water ripples from every click | yes | overlay only | Decoration only |
| Blaze — fire sparks, smoke, heat distortion | yes | overlay only | Decoration only |
| Droplets — rain running down, refracting | yes | overlay only | Decoration only |
| Clouds — mist that blurs what it covers | yes | overlay only | Decoration only |
| Glass — cursor-following refraction lens | yes | overlay only | Portfolio only (cursor lens — see §13 note) |
| Bubble — metaball droplet trailing the cursor | yes | overlay only | Portfolio only (cursor lens) |
| Magnify — HUD scanner lens + click ripples | yes | overlay only | Portfolio only (cursor lens) |
| Hex Float — page onto floating hex tiles | yes | overlay only | **Avoid** — heaviest shader (51 KB), hit-target desync, **injects a global `cursor` override** |
| Frost — ice pane melting under the cursor | yes | overlay only | **Avoid** — 39 KB, destroys legibility |
| Cloth — page hung on fabric in the wind | yes | effect off | **Avoid** — heavy + severe hit-target desync |
| Bend — page folded over virtual cube edges | yes | effect off | **Avoid** — desync + **injects a global `cursor` override** |
| Grid — page split into rippling 3D tiles | yes | overlay only | **Avoid** — hit-target desync |
| Asciify — cursor lens redrawing HTML as ascii | yes | effect off | **Avoid** — destroys legibility, nothing in fallback |
| Retro Dither — pixelating/quantizing lens | yes | effect off | **Avoid** — same |
| Particle Reveal — page as dust merging at the cursor | yes | effect off | **Avoid** — same |
| Glitch — RGB-split tearing bursts | yes | effect off | **Avoid** — same |
| VHS — tape wave, chroma bleed, grain | yes | effect off | **Avoid** — same |
| Peel — page peels back revealing a second layer | yes | effect off | **Avoid** — effect-as-mechanism (and the `under` layer is only hidden when the API is present) |
| Particle Scroll — content below a line dissolves to sand | yes | effect off | **Avoid** — effect-as-mechanism (gates content) |
| Laser — beam hiding everything below it until scroll | yes | effect off | **Avoid** — effect-as-mechanism (gates content) |
| Shatter — page into floating 3D glass shards | yes | effect off | **Avoid** — effect-as-mechanism + worst desync |

`UNVERIFIED:` for "overlay only" rows, the shader has a no-texture branch but whether that content-free version actually looks good (especially the geometry-driven Grid / Hex Float / Laser / Magnify) was not visually confirmed without the flag.

### There is no shader API

**Do not try to pass a fragment shader as a prop — none of the 25 components accept one.** The tweet's "real-time shaders" means the GLSL is **hardcoded as string constants inside the file you now own**, compiled against WebGL2. What you actually get is **typed numeric/boolean props** (Liquid: `distortion` `blend` `intensity` `radius` `force` `curl` `color` `rainbow` `simResolution` `dyeResolution`…, live-updatable, resolution changes ignored after mount) plus an imperative handle (`splat` / `setOptions` / `resize` / `destroy`). Deeper customization = editing the GLSL by hand, which is also why **there is no upgrade path**.

### The three a11y hazards (none of them are in their docs)

The platform side is genuinely fine: `layoutsubtree` opts canvas descendants into layout **and hit-testing**, Chrome exposes them to the accessibility tree, the children stay real focusable DOM, and the library `aria-hidden`s the decorative output canvas with `pointer-events: none`. The damage is elsewhere:

- **(a) Visual vs hit-target desync — the one that matters.** The shader displaces *pixels*; layout and hit-testing stay at the original position, and nothing in the library reconciles them (no `getElementTransform` anywhere). On **Shatter, Bend, Cloth, Grid, Hex Float, Peel, Particle Scroll** the button you see is not where the button is. **This inverts the usual assumption: the screen-reader user is fine, the mouse user is broken.** Never wrap an interactive control in a displacing component.
- **(b) Legibility destroyed for sighted users, intact for AT.** Asciify, Retro Dither, Particle Reveal, Glitch, VHS, Frost, Clouds leave the text perfectly readable to a screen reader and unreadable on screen — a WCAG 1.4.3/1.4.8 contrast problem, not a semantics one, so an axe run will pass it happily.
- **(c) Soft text on HiDPI.** The source canvas is sized in **CSS pixels** while the output canvas uses `devicePixelRatio` up to 2 — the page is captured at 1x and upscaled, so all wrapped text renders visibly soft. **This alone disqualifies wrapping body copy, UI chrome, or anything a user reads**, before a single shader runs.
- **Bonus gotcha:** Bend and Hex Float inject a **global `<style>` forcing `cursor: var(--canvasui-cursor, auto) !important` on the whole wrapped subtree**, killing every `cursor: pointer` / `cursor: text` affordance inside. Two more reasons those two are on the Avoid list.

### Perf — credit where due, and the pathological case

They got the hygiene right, verified in all 25: `IntersectionObserver` pauses the RAF loop off-screen, `prefers-reduced-motion` is respected, `destroy()` releases every program/shader/buffer/texture and clears `onpaint`, the loop idles without input, and **capture is change-gated** — `onpaint` fires when the browser needs a repaint and sets a dirty flag, so it is **not** a full page repaint per frame. Defaults are modest (128² sim grid, 512² dye, 4 pressure iterations).

**The pathological case: any DOM mutation inside the wrapper forces a full element paint + a full-viewport `texImage2D` upload.** Never wrap something that animates, types, streams, or re-renders per frame (a live form, a chat log, a CSS marquee, a counter). One instance per page — each mounts its own WebGL2 context.

### License: MIT + **Commons Clause** — a real business restriction

Free for personal and commercial use, including editing, on a client site. **NOT allowed: selling, sublicensing or redistributing the components themselves — alone, bundled, or ported.** So it is fine in a site you build for a client, and **not** fine vendored into a template you sell, a starter kit, a component library, or any asset folder you distribute as a product. **Despite the announcement saying "open source", this is not OSI open-source.**

### Fallback strategy (in order — point 1 is the whole game)

1. **Design the plain-DOM version FIRST and verify it standalone with the flag off.** If the fallback looks unfinished, the effect was load-bearing — **that is a design bug, not a browser bug.** In 2026 the fallback *is* the site.
2. **Never let an effect carry meaning.** No reveal-on-scroll that gates content, no peel hiding the message, no shatter as the transition. Unsupported browsers show everything at once, and that must read as intentional.
3. **Prefer the 3 `*-Object` components** whenever you want an effect that actually renders for the audience.
4. **Don't ship the origin-trial token** unless you own the domain and accept that production behaviour changes when M151 ends. Otherwise treat the effect as a Canary-only easter egg.
5. **Branch with the exported detector, never UA sniffing:** `import { supportsHtmlInCanvas } from "@/components/canvasui/Liquid"`. It is SSR-safe (`typeof document === "undefined"` → false), the wrappers read it through `useSyncExternalStore` with a `false` server snapshot and set `suppressHydrationWarning` on the source canvas — so it composes with the SSR rules in [framework-adapters.md](framework-adapters.md).
6. **Add a kill switch above `prefers-reduced-motion`.** The library only suppresses motion *input*; the canvas still mounts and still captures. For reduced-motion users, prefer not rendering the wrapper at all.
7. **Pin the source.** Copied files, no version, no update path, targeting an API that is still changing under them — record the commit and pull date in the repo.

**§13 reconciliation (custom cursors):** SKILL.md §13 bans custom mouse cursors and this file bans React Bits' cursor components (`BlobCursor`, `TargetCursor`…). Canvas UI's lenses (Glass, Bubble, Magnify) are **not** custom cursors — nothing sets `cursor: none`, the native pointer stays visible and unchanged, and they are pointer-*tracked* effects in the same family as Magic UI's already-approved `lens`/`pointer` and the Spotlight Border in §8. So the ban does not catch them. The ban's *reasoning* still does, though: refracting the pixels under the pointer costs pointer accuracy, so lenses are decoration over a hero with large display type on a declared portfolio — **never over a control, a form, or body copy**. Bend and Hex Float, which force a global `cursor` override, fall squarely under the ban.

`UNVERIFIED:` the vanilla build's `createLiquid({ source, content, output })` needs markup the docs never show. From the source contract it is `<canvas id="source" layoutsubtree="true"><div id="content">…</div></canvas>` plus a sibling `<canvas id="output">` overlay — which is exactly what the React wrapper emits.

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

**Canvas UI is the declared exception to the "don't import the above in Vue" rule:** its own registry ships a real build per framework — `@canvas-ui/<name>-vue | -svelte | -solid | -preact | -vanilla` — so there is no cross-framework import and no port to look for (a Vue project installs the Vue build, a vanilla project installs `createX()` and wires the markup itself). The browser-support gate, the tier gate and every guardrail in the Canvas UI section apply identically in all of them.
