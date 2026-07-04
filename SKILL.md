---
name: incredibly-pretty-websites
description: Make Claude build genuinely beautiful, non-AI-slop websites. React-first (Vue and vanilla CSS/JS also supported). Research-driven: study real shipped products before writing a line, then apply a system of design dials, vibe/layout archetypes, a motion engine, a curated font catalog, and a hard list of AI tells to avoid. Governs typography, color, layout, animation, spacing, icons, interactive states, responsiveness, and accessibility. Optional premium research (Refero) and media (Magnific) layers, with free fallbacks.
version: 1.0.0
author: Murilo Moura
license: MIT
---

# Incredibly Pretty Websites

A single source of truth for the visual and technical decisions behind a website that looks like a real product team shipped it, not like a language model guessed at "modern and clean."

The default framework is **React** (Vite / Next / vite-react-ssg). **Vue** and **vanilla CSS/JS** are first-class too; framework-specific idioms live in [framework-adapters.md](reference/framework-adapters.md). If nothing is specified, assume React.

## How to use

0. **Research first (Section 0).** Study real shipped products for the segment before applying any preset. This is the step most AI output skips, and it is why most AI output looks generic.
1. Pick a **project-type preset** (Section 1) to set your dials.
2. Pick a **vibe + layout archetype** (Section 5).
3. Pick **fonts** from the catalog (Section 12). Never Inter/Roboto/Arial for premium work.
4. Build every section fresh. Pull from the Creative Arsenal (Section 8). No generic templates.
5. Apply the technical foundations in `reference/*.md` for spacing, motion, states, responsiveness, and a11y.
6. Self-audit against Section 14 and the AI Tells in Section 13.

Reference files:
- [spatial-design.md](reference/spatial-design.md) — 4pt scale, hierarchy, container queries
- [motion-design.md](reference/motion-design.md) — easing, durations, reduced-motion, a transition pattern catalog
- [interaction-design.md](reference/interaction-design.md) — the 8 states, focus-visible, popovers, modals
- [responsive-design.md](reference/responsive-design.md) — mobile-first, pointer queries, safe-area, srcset
- [framework-adapters.md](reference/framework-adapters.md) — React / Vue / vanilla equivalents for motion, state, hydration
- [component-libs.md](reference/component-libs.md) — **(React-only)** copy-in animated components: Magic UI, React Bits, animated Lucide icons via the shadcn registry
- [scroll-motion.md](reference/scroll-motion.md) — **(Tier 3)** GSAP ScrollTrigger + Lenis smooth-scroll, with perf/a11y guardrails
- [media-pipeline.md](reference/media-pipeline.md) — **(Tier 3, cost-gated)** stock photos and image→video via Magnific, self-hosted, with a `<video>` recipe

---

## Two modes: autonomous (default) vs interview

**Autonomous (default):** work from the context you already have plus sensible assumptions from the preset. Ask the user nothing. Missing a detail? Assume the most likely value, note the assumption in one line, keep going. This is the only safe mode when there is no human in the loop.

**Interview:** triggered when the invocation explicitly asks for it. Before researching or designing, gather the brief in one or two short rounds: segment/product, audience, primary goal, tone, the objection to overcome, references the client likes, constraints (brand, framework, deadline). Confirm, then proceed.

Both modes do the research in Section 0. The only difference is where the brief comes from: autonomous infers it from context, interview asks.

---

## 0. RESEARCH FIRST — before anything else

> **Non-negotiable.** A fully defined brand (colors, fonts, voice already locked) does **not** excuse skipping research. Brand defines the *tokens* (palette, type, voice). Research defines everything else: page structure, sections, hierarchy, real UI patterns, conversion logic, layout, inspiration. The only real exemption is when the user hands you a complete wireframe for the whole page.

Every visual decision starts from **evidence of what real products actually shipped**, not from the model's memory of "good taste." Models are strong at code and logic and weak at product taste, so anchor taste to real references.

### Where to research

**Recommended premium — Refero ([refero.design](https://refero.design)).** If the `mcp__refero__*` tools are available, use them first. Three layers:
- **Styles** (visual direction, start here): `refero_search_styles(query)` → `refero_get_style(...)`.
- **Screens** (concrete UI): `refero_search_screens(query, platform:"web"|"ios")` → `refero_get_screen(...)`, `refero_get_similar_screens(...)`, `refero_get_screen_image(...)`.
- **Flows** (multi-step journeys — onboarding/checkout): `refero_search_flows(...)` → `refero_get_flow(...)`.
- Screens use UUIDs, flows use numeric IDs. Paginate with `page` only. `get_screen_image` costs a vision call — use it only when you need to inspect pixels.

**Free fallback (no Refero).** Study real products directly: [Godly](https://godly.website), [Land-book](https://land-book.com), [Mobbin](https://mobbin.com) (free tier), [Dribbble](https://dribbble.com), or screenshots of the two or three best sites in the segment. Same goal, more manual: find real shipped work, name what makes it good, borrow the structure.

### The workflow

1. **Short brief:** what / for whom / platform / goal / tone / objection / constraint. (Autonomous: infer. Interview: ask.)
2. **Styles first:** two or three searches from different angles — one aesthetic, one domain/segment, one strong reference brand. Open one to three strong directions.
3. **Screens/flows** when you need concrete screen structure or journey logic.
4. **Synthesize — do not average.** Pick **one dominant primary direction** and preserve its distinctive traits. Secondary references lend one detail each. Never the lukewarm mean of everything: if one reference is dark, one is serif, one is acid, the answer is *not* polite-cream + educated-serif.
5. **Reference-lock + decision-ledger** before coding:
   - **Reference-lock:** the primary direction + three to five traits to preserve (canvas, type, accent, layout, density, media) + what to borrow from secondaries + role rules (CTA-only, code-only, decorative-only) + media strategy (real / generated / stock / placeholder).
   - **Decision-ledger:** a `decision | source | role/rule | why` table. Every major visual choice traces back to a reference, a client constraint, or a craft rule in this skill. No source means it does not ship.
6. **Implement** using the presets (Section 1), tiers (PREMIUM_TECH_TIER), and anti-slop rules (Section 13).

### What overrides what (research vs this skill)

**HARD — taste and brand safety always win (non-negotiable):**
- Defined brand tokens (color/font/voice) beat the suggested style. Brand is the "outfit," research is the "anatomy."
- The content/taste bans: em-dash overuse, decorative floating pills, the "AI purple" palette, banned fonts, WCAG AA contrast, fake AI people in testimonials, static Lucide icons (hover-animated via `lucide-animated` is the one exception), icons inside a background box.
- Don't clone one style outright; keep token roles intact (a CTA-only accent stays CTA-only).

**SOFT — a real reference wins (structure and layout):**
- Page structure, section order and count, footer shape, hero shape, layout variation, density: **led by research, not by a fixed template.** The structural rules in this skill are **sensible defaults, not law** — if the references show a different, good structure for the case, follow the references.
- Structure is only "wrong" if it breaks usability, conversion, or responsiveness — not because it diverges from this skill's default.

### 0.1 — Brand token file (optional lock)

Before deriving palette/type/radius/shadow/motion, check for a brand-tokens file at the project root (e.g. `DESIGN.md`, `tokens.json`, a Tailwind theme). If one exists, treat it as **authority for the tokens** — skip re-deriving brand taste, use its values. Research still drives *structure*; the token file only locks tokens. If a token would violate a hard ban (AI-purple, a banned font, sub-WCAG-AA contrast), fix the token and log it in the decision-ledger. No token file means the normal flow (presets + palette/type from the brief + anti-slop).

---

## 1. PROJECT-TYPE PRESETS

Pick the row matching the segment. Defaults are smart, not rigid — override any value.

| Project Type | DESIGN_VARIANCE | MOTION_INTENSITY | VISUAL_DENSITY | Vibe | Hero | PREMIUM_TECH_TIER |
|---|---|---|---|---|---|---|
| Local business / small shop | 5 | 4 | 4 | Soft Structuralism | centered or split | 0 (restraint) |
| Solo professional | 6 | 5 | 4 | Soft Structuralism | split | 1 (subtle) |
| Traditional professional (law / accounting / medical) | 5 | 4 | 4 | Soft Structuralism | split or centered | 0 (restraint) |
| Startup / Tech / SaaS | 8 | 7 | 5 | Ethereal Glass | asymmetric | 3 (full premium) |
| Portfolio / Creative / Agency | 9 | 8 | 3 | Editorial Luxury | asymmetric | 3 (full premium) |
| E-commerce | 6 | 5 | 6 | Soft Structuralism | split | 1 (subtle) |
| Course / Creator / Info-product | 7 | 6 | 5 | Ethereal Glass | split | 2 (moderate) |
| Restaurant / Food | 7 | 5 | 4 | Editorial Luxury | split or fullImage | 2 (moderate) |
| Health / Wellness | 6 | 4 | 4 | Soft Structuralism | centered | 1 (subtle) |
| Real estate / Luxury | 8 | 6 | 3 | Editorial Luxury | asymmetric | 3 (full premium) |
| Architecture / Design studio | 9 | 7 | 3 | Editorial Luxury | asymmetric | 3 (full premium) |
| Fitness / Studio | 7 | 6 | 4 | Editorial Luxury | fullImage or split | 2 (moderate) |

### PREMIUM_TECH_TIER — gating modern techniques by segment

Defines which "expensive-looking" techniques fit each preset. Adding a technique above the preset's tier reads as slop for that segment (a traditional law firm with a liquid-glass marquee looks like a tech-bro in disguise).

| Tier | Allowed | Forbidden |
|---|---|---|
| **0 — Restraint** (local business, traditional professional) | clean typography, generous spacing, simple scroll fade-in, real photography, subtle hover | liquid-glass, infinite marquee, char-by-char reveal, magnetic hover, animated gradient blobs, italic accent words in the headline, loading screen with counter, sticky stacking cards, dashboard mock UI |
| **1 — Subtle** (solo professional, e-commerce, health) | tier 0 + staggered fade-rise entrances, a single eyebrow pill, noise overlay ≤5% opacity, a CSS client-logo marquee (once per page, 30s+ slow), one italic accent word (max one in the whole site, sparingly) | liquid-glass except on a card over a photo, char-by-char reveal, magnetic hover, loading screen, sticky stacking, animated gradient blobs |
| **2 — Moderate** (course, restaurant, fitness) | prior tiers + word pull-up entrance on the H1, scroll char-reveal on one institutional paragraph (one section only), liquid-glass on a card over photo/gradient, sticky scroll-stack cards in a portfolio, static gradient mesh blobs | magnetic hover (a11y-suspect on touch), loading screen counter, video bg (unsourced), dashboard mock UI |
| **3 — Full premium** (Tech/SaaS, Creative, Luxury real estate, Architecture) | everything: full liquid-glass refraction, scroll-linked bidirectional marquee, magnetic hover on a CTA, animated gradient blobs with `@property`, free italic accent words, coded dashboard mock UI (not a screenshot) for SaaS, sticky stacking project cards, optional loading-screen counter, asymmetric bento grid, **GSAP ScrollTrigger scroll-telling + Lenis smooth-scroll** ([scroll-motion.md](reference/scroll-motion.md)), **video backgrounds** (cost-gated, [media-pipeline.md](reference/media-pipeline.md)) | — |

**Rule:** read the preset's `PREMIUM_TECH_TIER` before adding any technique from this list. A lower tier never inherits a higher tier's technique. The user can explicitly override.

## 2. ACTIVE BASELINE CONFIGURATION

Use these as global vars to drive the decisions below.

- DESIGN_VARIANCE (set by preset, default 8)
- MOTION_INTENSITY (set by preset, default 6)
- VISUAL_DENSITY (set by preset, default 4)

### Dial definitions

**DESIGN_VARIANCE (1–10)**
- **1–3 (Predictable):** Flexbox `justify-center`, strict 12-col grids, equal paddings. Centered hero is natural.
- **4–6 (Offset):** `margin-top: -2rem` overlaps, varied aspect ratios, left-aligned headers. Centered allowed, split preferred.
- **7–10 (Asymmetric):** Masonry, CSS Grid fractional units (`grid-template-columns: 2fr 1fr 1fr`), large empty zones. Prefer split/asymmetric hero.
- **MOBILE OVERRIDE:** Levels 4–10 — any asymmetric layout above `md:` MUST collapse to a single column (`w-full`, `px-4`, `py-8`) below 768px.

**MOTION_INTENSITY (1–10)**
- **1–3 (Static):** No automatic animation. CSS `:hover`/`:active` only.
- **4–6 (Fluid CSS):** `transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1)`. Animation-delay cascades. `transform`/`opacity` only.
- **7–10 (Advanced choreography):** Scroll-triggered reveals, parallax, spring physics, perpetual micro-interactions. Use the framework-native motion lib (see [framework-adapters.md](reference/framework-adapters.md)). NEVER raw `window.addEventListener('scroll')` — use IntersectionObserver or a framework primitive.

**VISUAL_DENSITY (1–10)**
- **1–3 (Art gallery):** Large whitespace. `py-32` to `py-40` section gaps. Feels expensive.
- **4–6 (Standard):** Normal web-app spacing. `py-16` to `py-24` sections.
- **7–10 (Cockpit):** Tight paddings, 1px dividers, packed data. `font-mono` for numbers only.

## 3. ARCHITECTURE & CONVENTIONS (framework-agnostic)

- **DEPENDENCY VERIFICATION [MANDATORY]:** Before importing any third-party library, check `package.json`. If it is missing, output the install command first.
- **Hydration safety:** Browser-only APIs (`window`, `document`, `localStorage`) MUST sit behind your framework's client-only boundary (see [framework-adapters.md](reference/framework-adapters.md)).
- **No cross-framework imports:** Don't import `motion`/`framer-motion` in Vue, don't import `@vueuse/motion` in React, don't import `@phosphor-icons/react` outside React. Use the native equivalent.
- **State:** Local primitive (`useState`/`ref`) for isolated UI. Global only to avoid deep prop-drilling.
- **Styling:** Tailwind at the project's installed version. **Check `package.json`** — v3 uses `tailwind.config.ts`/`theme.extend`; v4 is CSS-first with `@theme`. Never mix.
- **ANTI-EMOJI POLICY [CRITICAL]:** Never put emojis in source files, hardcoded markup, or chrome. Only acceptable inside client-editable content (CMS YAML/JSON the client controls). Use icons or SVG primitives.
- **Responsiveness & spacing:**
  - Standard breakpoints (`sm`, `md`, `lg`, `xl`).
  - Container: `max-w-[1400px] mx-auto` or `max-w-7xl`. If a `<Container>` primitive exists, use it.
  - **Viewport stability [CRITICAL]:** NEVER `h-screen`. ALWAYS `min-h-[100dvh]` (iOS Safari).
  - **Grid over flex-math:** NEVER `w-[calc(33%-1rem)]`. ALWAYS CSS Grid.
- **Icons:** Use **Phosphor Icons** for the framework (`@phosphor-icons/react`, `@phosphor-icons/vue`). Static Lucide is BANNED (it reads as generic AI-SaaS, everyone uses it). **Exception:** a hover/focus-animated icon via **lucide-animated** ([component-libs.md](reference/component-libs.md)) as seasoning in one or two spots (CTA, active nav), never as the general static icon set. Pick one weight (`regular`/`bold`) project-wide. SVG primitives are fine for one-offs. NEVER an icon inside a background box (`bg-primary rounded-lg p-3 <Icon/>`) — use a flat colored icon (`text-primary`/`text-accent`) with no box (exception: a pictogram inside a numbered step-card). **WhatsApp:** always the official inline brand `<svg>` (chat bubble with phone), never a generic `MessageCircle`.

## 4. DESIGN ENGINEERING DIRECTIVES

**Rule 1: Deterministic typography**
- Display/headlines: `text-4xl md:text-6xl tracking-tighter leading-none`.
  - **Fluid clamp() defaults** (preferred over discrete breakpoints for an impactful hero):
    - H1 hero: `font-size: clamp(2.25rem, 5.5vw, 4.5rem)` (36–72px) — the sweet spot, presence without becoming a tower.
    - H1 hero "editorial giant" (Tier ≥ 2): `font-size: clamp(3rem, 8vw, 6rem)` — max 96px.
    - H2 section: `font-size: clamp(1.75rem, 3.5vw, 2.75rem)`.
    - Body: `font-size: clamp(0.95rem, 1.5vw, 1.125rem)`.
  - **Letter-spacing per tier:** h1 `-0.04em`, h2 `-0.02em`, body `0`. An editorial giant hero can go to `-0.07em`.
  - **Line-height tight in hero:** `0.9` to `0.95` (`leading-none` = 1.0 is fine). Body is always `leading-relaxed` (1.625).
  - **Italic accent words in headlines (Tier ≥ 2 — the source of the "expensive" look):**
    - Pattern: a grotesque sans heading + one or two key words in **serif italic** (Instrument Serif italic, PP Editorial New italic, Newsreader italic).
    - Example: `<h1>Beyond silence, we build <span class="italic font-serif text-foreground/60">the eternal</span>.</h1>`
    - Rule: one italic span per H1, max two in the whole site. The span can be slightly faded (`text-foreground/55` to `/60`) for rhythm.
    - Allowed families: Instrument Serif italic (favorite), PP Editorial New italic, Newsreader italic, Crimson Pro italic.
    - FORBIDDEN in Tier 0–1 — it turns pretentious for a traditional office or local shop.
  - **ANTI-SLOP:** Inter is BANNED for premium/creative. Use Geist, Outfit, Cabinet Grotesk, Satoshi, Clash Display, PP Editorial New.
  - **SERIF RULE:** Serif is BANNED for dashboards/software UI. Use sans-only pairs (Geist+Geist Mono, Satoshi+JetBrains Mono). Serif is welcome for editorial/luxury landing pages.
- Body: `text-base text-gray-600 leading-relaxed max-w-[65ch]`.
- **Text-rendering polish (universal — all tiers, zero cost, separates "ok" from "premium"):**
  - `text-wrap: balance` on **headings** (h1/h2/h3) to avoid a lonely orphan on the last line. `text-wrap: pretty` on **body/paragraphs** to avoid a one-word orphan.
  - `font-variant-numeric: tabular-nums` on **any number that changes** (counters, timers, prices, stats, percentages) — without it the layout jitters on every digit.
  - `-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;` on `body` — crisper text on macOS/retina. Apply once, globally.
  - **Optical, not geometric alignment:** an asymmetric glyph (play, arrow, chevron) centered by math looks visually off. Nudge manually (`translateX(1px)`) until it *looks* centered. Same for a glyph inside a circular button.

**Rule 2: Color calibration**
- Max one accent color. Saturation < 80%.
- **THE PURPLE BAN:** the "AI purple/blue" aesthetic is BANNED. No purple glows, no neon gradients. Neutral bases (Zinc/Slate) + a single high-contrast accent (Emerald, Electric Blue, Deep Rose).
- **Color consistency:** one palette project-wide. No warm/cool gray fluctuation.

**Rule 3: Layout variation**
- DESIGN_VARIANCE ≤ 6: centered is fine. Split/asymmetric preferred.
- DESIGN_VARIANCE ≥ 7: prefer split/asymmetric/editorial. Centered only if the preset explicitly recommends it.
- Always offer variety: Split (50/50), Left content / right asset, Asymmetric whitespace, Full-image hero.

**Rule 4: Materiality & shadows**
- VISUAL_DENSITY > 7: generic card containers are BANNED. Use `border-t`, `divide-y`, or negative space.
- Cards ONLY when elevation communicates hierarchy. Tint shadows toward the background hue.
- **Layered shadow > solid border (cheap premium feel):** a 1px solid border is flat and "drawn." Replace it with two or three stacked semi-transparent box-shadows (`0 1px 2px rgba(0,0,0,.04), 0 4px 8px rgba(0,0,0,.04), 0 16px 24px rgba(0,0,0,.06)`) — they adapt to any background and give real depth. Use a thin border only when you genuinely need a crisp 1px separation (a divider).
- **1px outline to "seat" an image/card on the background:** an image or card on a light background floats without definition. Add `outline: 1px solid rgba(0,0,0,0.08)` (light) or `rgba(255,255,255,0.08)` (dark) — **pure black/white with alpha, never a tinted gray** (tinted gray muddies the edge). `outline` doesn't push layout (unlike `border`).
- **Concentric radius (the #1 reason UI looks "off"):** a nested container needs `outer_radius = inner_radius + padding`. A card `rounded-[1.5rem] p-2` gets an inner child `rounded-[calc(1.5rem-0.5rem)]`. Mismatched radii create a lopsided "thick shell."

**Rule 5: Interactive UI states** (full detail: [interaction-design.md](reference/interaction-design.md))
- Design all 8 states: default, hover, focus, active, disabled, loading, error, success.
- Loading: skeletal loaders matching the layout — never a generic spinner.
- Empty states: beautifully composed.
- Error states: inline, clear.
- Tactile feedback: `:active` → `-translate-y-[1px]` or `scale-[0.98]`.

**Rule 6: Data & form patterns**
- Label above input. Helper optional. Error below. `gap-2` between input blocks.
- Validate on blur, not on keystroke (exception: password strength).

## 5. VIBE & LAYOUT ARCHETYPES

Pick ONE vibe + ONE layout before writing code.

### Vibe archetypes

1. **Ethereal Glass** (SaaS/AI/Tech): deep OLED black `#050505`, subtle radial mesh gradients (glowing orbs). Vantablack cards with `backdrop-blur-2xl` + `border-white/10` hairlines. Wide geometric grotesk type.
2. **Editorial Luxury** (Lifestyle/Real estate/Agency): warm creams `#FDFBF7`, muted sage, deep espresso. Variable serif for large headings. A CSS noise overlay (`opacity-[0.03]` to `[0.07]`) for paper texture. Canonical fractal SVG data URI (cover with `fixed inset-0 z-50 pointer-events-none` OR a `::after` pseudo on the hero):

   ```css
   .noise-overlay {
     background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.7'/></svg>");
     mix-blend-mode: overlay;
     opacity: 0.07;
     pointer-events: none;
   }
   ```

   FORBIDDEN on a scrolling container (DOM cost). Use only on fixed/pseudo elements. On the hero, `position: absolute; inset: 0;` covering just the hero is fine.
3. **Soft Structuralism** (Consumer/Health/Portfolio): silver-grey/white backgrounds. Bold grotesk type. Floating components with ultra-soft diffused ambient shadows.

### Layout archetypes

1. **Asymmetrical Bento:** masonry CSS Grid, varying card sizes (`col-span-8 row-span-2` next to stacked `col-span-4`). Mobile: `grid-cols-1 gap-6`.
2. **Z-Axis Cascade:** stacked physical cards, slight overlap, varying depth, subtle rotation. Mobile: remove rotations/overlaps, stack vertically.
3. **Editorial Split:** large type on the left half, scrollable content on the right. Mobile: full-width vertical stack.

### Paid-traffic landing skeleton (conversion)

For a **single-offer paid-traffic landing** (not a multi-page institutional site): one goal, one CTA repeated down the page. The sequence below is a **starting menu, not a rigid form** — research (§0) decides the real order and emphasis for the segment, and the counts are ranges, not law.

1. **Above the fold** — eyebrow (1, optional) → headline (a concrete promise/result, not the product name) → subhead (one sentence: for whom / how) → video OR proof visual → proof (logos/numbers/badge) → **CTA**. Critical content (H1 + CTA) in HTML/CSS for LCP.
2. **Problems** — a pain headline + three to six concrete "dig-ins" (real pains of the audience). Specific text, not vague.
3. **Solution benefits** — a headline + three to six benefits (the *result* for the client, not a technical feature).
4. **How it works** — three or four steps (reduces friction/fear, shows it's simple).
5. **The offer** — a stack of what the person receives (deliverables/bonuses listed).
6. **FAQ** — three to five real objections (same source as the FAQPage schema, so they don't diverge).

**Rules:** one CTA repeated between blocks (same action, same destination); every block either contains the CTA or pushes toward it; item counts are ranges (six pains in one, three in another — whatever the case needs); tone follows the brand; each block uses the vibe + layout archetypes above, it does not become a generic gray list. A paid-traffic landing is not an institutional site (the latter has more breathing room and brand sections; the former is lean and conversion-focused).

### Premium component techniques

**Double-Bezel (nested architecture):**
Never place premium containers flat. Nest them:
- Outer shell: `bg-black/5` or `bg-white/5`, `ring-1 ring-black/5`, `p-1.5`, `rounded-[2rem]`
- Inner core: its own bg, `shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]`, `rounded-[calc(2rem-0.375rem)]`

**Island Button (trailing icon):**
Primary CTAs as rounded pills (`rounded-full px-6 py-3`). Arrow icons nested in a distinct circular wrapper (`w-8 h-8 rounded-full bg-black/5`) flush with the right padding.

**Eyebrow tags:**
Precede an H1/H2 with a micro pill: `rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium`. **Max one eyebrow per section** — don't stack pills. Never use an eyebrow pill as a decorative floating element beside/below the hero (see AI Tells).

**Macro-whitespace:**
VISUAL_DENSITY ≤ 4: double the standard padding. `py-24` to `py-40` for sections.

## 6. ANIMATION ENGINE

Full technical detail: [motion-design.md](reference/motion-design.md) (includes a **Transition Pattern Catalog** — a ready recipe per interaction type, self-contained and decoupled from component sizing). Framework-specific implementations: [framework-adapters.md](reference/framework-adapters.md).

### Should this animate?

| Frequency | Decision |
|---|---|
| 100+/day (keyboard shortcuts, command palette) | No animation. Ever. |
| Tens/day (hover, list nav) | Remove or drastically reduce |
| Occasional (modals, drawers, toasts) | Standard animation |
| Rare/first-time (onboarding) | Can add delight |

**Never animate keyboard-initiated actions.**

### Easing curves

Built-in CSS easings lack punch. Use custom:

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
```

**Never `ease-in` for UI.** `ease-out` at 300ms feels faster than `ease-in` at 300ms. Avoid bounce/elastic — tacky.

### Duration

| Element | Duration |
|---|---|
| Button press | 100–160ms |
| Tooltips | 125–200ms |
| Dropdowns | 150–250ms |
| Modals/drawers | 200–500ms |
| Marketing/hero | Can be longer |

UI animations stay under 300ms. Exit is ~75% of the enter duration.

### Spring physics

Use for drag, an "alive" feel, interruptible gestures. Apple-style:
```js
{ type: "spring", duration: 0.5, bounce: 0.2 }
```
Bounce 0.1–0.3 only. Springs keep velocity when interrupted; CSS animations restart from zero.

### Creative proactivity (MOTION_INTENSITY > 5 AND PREMIUM_TECH_TIER ≥ 2)

- **"Liquid Glass" refraction:** beyond `backdrop-blur` — add `border-white/10` + `shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]` for physical edge refraction. Canonical CSS (Tier 3, over photo/video/gradient — NEVER over a solid bg, where it goes invisible):

  ```css
  .liquid-glass {
    background: rgba(255, 255, 255, 0.01);
    background-blend-mode: luminosity;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    border: none;
    box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
    position: relative;
    overflow: hidden;
  }
  .liquid-glass::before {
    content: '';
    position: absolute; inset: 0;
    border-radius: inherit;
    padding: 1.4px;
    background: linear-gradient(180deg,
      rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 20%,
      rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%,
      rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.45) 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor; mask-composite: exclude;
    pointer-events: none;
  }
  ```

  For a "strong" variant (over dark video / dark hero): `backdrop-filter: blur(50px)`, gradient `rgba(255,255,255,0.5/0.2/0)`.

- **Magnetic micro-physics (Tier 3, DEFAULT = DON'T USE):** buttons pull toward the cursor. Drive via motion values / spring values / WAAPI — NEVER per-frame state re-renders. See [framework-adapters.md](reference/framework-adapters.md). **Caveat: the "it wiggles when I hover" effect reads as gimmick/buggy far more than premium.** Default: don't use it. If you must: strength ≤ 0.15, one hero CTA only, a subtle translate with a soft return, never on several buttons. When in doubt, a simple hover lift (`translateY(-1px)` + shadow) is more premium than magnetic.

- **Word Pull-Up entrance (Tier ≥ 2):** split text by word, each `<span>` `motion.y` `20→0`, opacity `0→1`, staggered 60–80ms. Trigger via IntersectionObserver (once). For impactful hero headings. Do NOT use on a full body paragraph (it becomes a gimmick).

- **Scroll Char-Reveal (Tier ≥ 2, sparingly, max one section):** an institutional paragraph where each character transitions opacity `0.2 → 1` based on scroll progress (`useScroll` with offset `['start 0.8', 'end 0.2']`). Not in the hero (it delays first-contact reading). Use it in "About," "Manifesto," "Philosophy."

- **Animated gradient blobs with `@property` (Tier ≥ 2):** the modern standard for animating gradients without JS. Declare custom properties:

  ```css
  @property --g-x1 { syntax: '<percentage>'; inherits: false; initial-value: 10%; }
  @property --g-y1 { syntax: '<percentage>'; inherits: false; initial-value: 10%; }
  /* ...repeat x2/y2/x3/y3 for the number of blobs... */

  .gradient-mesh {
    background-color: var(--brand-bg);
    background-image:
      radial-gradient(circle at var(--g-x1) var(--g-y1), var(--brand-accent) 0px, transparent 55%),
      radial-gradient(circle at var(--g-x2) var(--g-y2), var(--brand-secondary) 0px, transparent 50%);
    animation: blob1 6s ease-in-out infinite, blob2 7s ease-in-out infinite;
  }
  @keyframes blob1 { 0%,100% { --g-x1: 5%; --g-y1: 5%; } 50% { --g-x1: 40%; --g-y1: 30%; } }
  @keyframes blob2 { 0%,100% { --g-x2: 95%; --g-y2: 90%; } 50% { --g-x2: 60%; --g-y2: 60%; } }
  @media (prefers-reduced-motion: reduce) { .gradient-mesh { animation: none; } }
  ```

  Use two to four blobs in the brand palette. Tier 0–1 does NOT use this — it reads as party-vibe for the wrong segment.

- **Infinite CSS marquee (Tier ≥ 1):** client/partner logos scrolling.

  ```css
  .marquee { overflow: hidden; mask-image: linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%); }
  .marquee-track { display: flex; width: max-content; animation: marquee 30s linear infinite; }
  @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  .marquee:hover .marquee-track { animation-play-state: paused; }
  @media (prefers-reduced-motion: reduce) { .marquee-track { animation: none; } }
  ```

  Render the list twice inline for a seamless loop. Duration 25–40s linear (slower reads as more premium; under 20s becomes frantic). Tier 1+ can use it once per page in a "Trusted by" strip.

- **Scroll-linked bidirectional marquee (Tier 3 only):** two rows of images, `scrollY * 0.3` in opposite directions. Minimal JS (passive listener), `willChange: 'transform'`. Fixed tile size (420×270px).

- **Sticky Stacking Cards (Tier ≥ 2):** project cards `position: sticky; top: ...` with decreasing scale as scroll passes. `useScroll` + `useTransform` computes `targetScale = 1 - (totalCards - 1 - index) * 0.03`. For portfolios/projects.

- **GSAP ScrollTrigger scroll-telling + Lenis smooth-scroll (Tier 3 only):** pin/scrub, fake horizontal scroll (`containerAnimation`, mandatory `ease:"none"`), batch reveal, and the Lenis ↔ ScrollTrigger bridge (one RAF loop). Copy-paste recipes + per-framework cleanup + guardrails in [scroll-motion.md](reference/scroll-motion.md). **Reduced-motion is a gate** (no smooth/scrub). Trivial fade/reveal in Tier 0–2 uses native IntersectionObserver, NOT GSAP.

- **Magic UI + React Bits — copy-in animated arsenal (Tier 2–3, React-only):** ready components via the shadcn registry. **Magic UI is the default** (Tailwind + Motion native, light: blur-fade, number-ticker, marquee, beams, bento, text-animate); **React Bits when it has a better component** (DecryptedText, ScrollStack, LogoLoop) or a WebGL spectacle. Replaces the hand-built versions (Word Pull-Up, sticky-stacking, marquee) when the project is already React. **Gate by the component's WEIGHT, not by the library** (light = Tier 2, heavy WebGL = Tier 3). **Vue: use Vue Bits** ([vue-bits.dev](https://vue-bits.dev) — the official React Bits port, same author) + **motion-v** ([motion.dev/vue](https://motion.dev/vue)) + **GSAP** for scroll-telling. **Vanilla: build native.** Setup, install naming, catalog, and guardrails (LCP/reduced-motion/SSR/bundle) in [component-libs.md](reference/component-libs.md). Research decides *what*; the libs are just execution.

- **Loading Screen Counter (Tier 3 only, premium plan):** full-viewport overlay, a counter 000→100 via requestAnimationFrame (~2.7s), rotating words mid-screen, a gradient progress bar at the bottom. Fade out at 100. NEVER on a simple landing (it delays LCP).

- **Perpetual micro-interactions:** pulse, typewriter, float, shimmer in ambient components. Spring physics on interactive elements.

- **Layout transitions:** framework-native shared-element / FLIP — `layoutId` (React), `<TransitionGroup>` + `view-transition-name` (Vue). See adapters.

- **Staggered orchestration:** never mount lists instantly. 30–80ms stagger. Parent + children variants in the same client-only tree.

- **Video asset — hero OR section accent (Tier 3, cost-gated):** placement (hero vs section) is **case-by-case, decided by research/reference-lock** — no fixed default; an above-the-fold hero must protect LCP (`poster` + critical content in HTML/CSS), a below-the-fold section accent gets lazy-load + play-in-view. Generation via **Magnific** (image→video) + self-host. The loop follows the **brand canvas** (light→light, dark→cinematic); an overlay guarantees WCAG. Pipeline + prompt architecture + cost-gate + the `<video>` recipe in [media-pipeline.md](reference/media-pipeline.md). **GATE: manual cost approval before any paid render; autonomous mode never triggers it.** Without Magnific/budget: gradient mesh blobs OR a full-bleed photo + overlay.

### Asymmetric timing

Press slow when deliberate (hold-to-delete: 2s linear). Release always snappy (200ms ease-out). Slow where the user decides, fast where the system responds.

## 7. COMPONENT PRINCIPLES

- **Buttons feel responsive:** `transform: scale(0.97)` on `:active` (0.95–0.98).
- **Never animate from `scale(0)`:** start at `scale(0.95)` + opacity. Nothing in the real world appears from nothing.
- **Popovers are origin-aware:** scale from the trigger, not the center. Modals are exempt (`transform-origin: center`).
- **Tooltips skip the delay on subsequent hovers:** first one delays. Adjacent ones appear instantly.
- **Use blur to mask imperfect transitions:** a subtle `filter: blur(2px)` during crossfades. Cap under 20px (Safari perf).
- **CSS transitions over keyframes for dynamic UI:** transitions are interruptible mid-flight; keyframes restart.
- **Hardware acceleration:** animate ONLY `transform` + `opacity`. NEVER `top`, `left`, `width`, `height`, `margin`. For height: `grid-template-rows: 0fr → 1fr`.
- **NEVER `transition: all`** — always name the exact property (`transition: transform 200ms, opacity 200ms`). `all` animates unintended props (layout, inherited color) and costs perf.
- **`will-change` only for `transform`, `opacity`, or `filter`** — and only when the animation is imminent (`:hover`, `.is-animating`). Declaring it preemptively on many elements creates too many GPU layers and hurts perf.
- **Icon swap / cross-fade with no motion lib:** swap an icon (menu↔close, play↔pause) keeping **both in the DOM** and cross-fading — don't swap `src`/conditional-mount (it flickers). Values: entering `scale 0.25→1, opacity 0→1, blur 4px→0`, leaving the inverse, `cubic-bezier(0.2,0,0,1)` ~300ms. With a motion lib: spring `{ type:"spring", duration:0.3, bounce:0 }`. Position both icons in the same grid cell (`grid-area: 1/1`) to overlap them.

## 8. THE CREATIVE ARSENAL

Pull from this library for visually striking output. Default to the framework-native motion lib. Use GSAP/Three.js EXCLUSIVELY for isolated scroll-telling or canvas backgrounds, inside a client-only boundary so they don't interfere with hydration.

### Hero
- Asymmetric (text left/right, image with a stylistic fade), Split Screen, Full-image with overlay.
- **Video background (Tier 3, cost-gated)** — Magnific → self-host. See [media-pipeline.md](reference/media-pipeline.md) + Section 6. Cost approval required. Fallback without budget: gradient mesh blobs OR full-bleed photo + overlay.

### Navigation
- Floating glass pill nav (`mt-6 mx-auto w-max rounded-full`) OR full-width sticky nav — both valid.
- **Inner nav links get no pill bg.** Nav links are plain text; hover = a subtle color change or underline. A pill bg on a nav link only for the single primary CTA (e.g. WhatsApp on the right). Four or five links rendered as glued pills looks bad (see AI Tells).
- Magnetic buttons, Dynamic Island morphing, Mega Menu staggered reveal.

### Layout & grids
- Bento Grid (asymmetric tiles), Masonry, Chroma Grid (animated color borders).
- Split Screen Scroll, Curtain Reveal.

### Cards & containers
- Parallax Tilt (3D mouse-tracking), Spotlight Border (cursor illumination).
- Glassmorphism with refraction, Morphing Modal (button → dialog).

### Scroll
- Sticky Scroll Stack (Tier ≥ 2 — Section 6), Horizontal Scroll Hijack, Zoom Parallax.
- Scroll Progress Path (SVG drawing), Liquid Swipe transitions.
- Scroll Char-Reveal (Tier ≥ 2 — Section 6), Word Pull-Up Entrance (Tier ≥ 2 — Section 6).

### Galleries
- Coverflow Carousel (3D), Accordion Image Slider, Hover Image Trail.

### Typography
- Kinetic Marquee (Tier ≥ 1 — Section 6 has the CSS), Text Mask Reveal, Text Scramble.
- Italic Accent Words in a sans headline (Tier ≥ 2 — Rule 1).
- Circular Text Path, Gradient Stroke Animation.

### Micro-interactions
- Particle Explosion Button, Skeleton Shimmer, Directional Hover Fill.
- Ripple Click, Animated SVG Line Drawing.
- Mesh Gradient Background (Tier ≥ 2 — animated gradient blobs with `@property`, Section 6).
- Magnetic Hover (Tier 3 — Section 6).
- Loading Screen Counter (Tier 3, premium plan — Section 6).

## 9. MOTION-ENGINE BENTO PARADIGM

For SaaS dashboards / feature sections, use "Bento 2.0":

- **Palette:** background `#f9fafb`. Cards pure white, `border-slate-200/50`, `rounded-[2.5rem]`.
- **Shadow:** diffusion `shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]`.
- **Type:** strict Geist/Satoshi/Cabinet Grotesk. `tracking-tight` headers.
- **Labels:** titles OUTSIDE and BELOW cards (gallery-style).
- **Padding:** `p-8` or `p-10` inside cards.
- **Animation:** each card has perpetual micro-interactions with spring physics. Wrap in the framework's enter/leave primitive. Every perpetual loop in its own tiny client-only component.

### 5 card archetypes
1. **Intelligent List:** auto-sorting loop with shared layout-id swaps.
2. **Command Input:** multi-step typewriter, blinking cursor, shimmer loading.
3. **Live Status:** breathing indicators, pop-up badges with an overshoot spring.
4. **Wide Data Stream:** infinite horizontal carousel (`x: ["0%", "-100%"]`).
5. **Contextual UI:** staggered text highlight + a floating action toolbar.

## 10. PERFORMANCE GUARDRAILS

- **DOM cost:** grain/noise filters ONLY on a `fixed inset-0 z-50 pointer-events-none` pseudo-element. NEVER on a scrolling container.
- **Hardware accel:** ONLY `transform` + `opacity`. Never layout properties.
- **Z-index restraint:** only systemic layers (nav, modals, overlays). Use a semantic scale: dropdown(100) → sticky(200) → modal-backdrop(300) → modal(400) → toast(500) → tooltip(600).
- **Blur:** `backdrop-blur` only on fixed/sticky. Never on scrolling content.
- **CSS variables caveat:** changing a CSS var on a parent recalcs ALL children. Update transform directly on the element.
- **CSS > JS under load:** CSS animations run off the main thread. CSS for predetermined, JS for dynamic/interruptible.
- **WAAPI:** the Web Animations API = JS control + CSS perf. Hardware-accelerated, interruptible, no library.
- **`will-change`:** don't declare it preemptively. Only when the animation is imminent (`:hover`, `.animating`).

## 11. ACCESSIBILITY

Full detail: [interaction-design.md](reference/interaction-design.md), [responsive-design.md](reference/responsive-design.md).

**prefers-reduced-motion:** reduced ≠ zero. Keep opacity/color transitions. Remove movement/position.
```css
@media (prefers-reduced-motion: reduce) {
  .element { animation: fade 0.2s ease; }
}
```

**Touch hover:** gate hover behind a media query — avoid false positives on tap.
```css
@media (hover: hover) and (pointer: fine) {
  .element:hover { transform: scale(1.05); }
}
```

**Touch targets:** minimum 44×44px on `(pointer: coarse)`.

**Focus rings:** `:focus-visible` only — never `outline: none` without a replacement. 2–3px, 3:1 contrast, offset.

**Skip links:** hide off-screen, show on focus (`sr-only` + `:focus-visible`). Never animate position (no `translateY`).

## 12. TYPOGRAPHY CATALOG (curated & approved)

### Premium sans-serif (recommended)

| Font | Character | Best for | License | Weights |
|---|---|---|---|---|
| **Geist** | Clean, technical, modern | SaaS, tech, dashboards | Free | 100–900 |
| **Satoshi** | Geometric, friendly | Apps, startups, portfolios | Free | 300–900 |
| **Outfit** | Geometric, clean | Modern brands, UI | Free (Google) | 100–900 |
| **Cabinet Grotesk** | Bold, distinctive | Headlines, branding | Free | 100–900 |
| **Clash Display** | Strong, editorial | Display, luxury | Free | 200–700 |
| **Plus Jakarta Sans** | Friendly, professional | Body, UI | Free (Google) | 200–800 |
| **DM Sans** | Geometric, grotesque | Modern, clean | Free (Google) | 100–900 |

### Editorial serif (luxury/creative only)

| Font | Character | Best for | License |
|---|---|---|---|
| **PP Editorial New** | High-fashion editorial | Luxury, real estate | Commercial |
| **Instrument Serif** | Italic accent words in a sans headline | Tier ≥ 2 — luxury, creative, premium SaaS | Free (Google) |
| **Newsreader** | Modern, screen-optimized serif | Articles, editorial | Free (Google) |
| **Crimson Pro** | Contemporary classic | Body text, articles | Free (Google) |
| **EB Garamond** | Elegant, classical | Editorial, literary | Free (Google) |

**Instrument Serif italic** is the secret weapon. Load only the italic (`ital@1`) and apply it to one or two key words inside a grotesque sans H1 (Geist/Satoshi/Cabinet Grotesk). It makes a hero look editorial-cinema premium with zero structural effort. See Rule 1 (Italic accent words).

### Monospace (data/code)

| Font | Use with |
|---|---|
| **Geist Mono** | Geist |
| **JetBrains Mono** | Satoshi, Cabinet Grotesk |
| **IBM Plex Mono** | Plus Jakarta Sans |

**MONO WITH EXTREME RESTRAINT (critical anti-slop):** mono is a third-layer ink, only for **real code/terminal/CLI**. NEVER as the default UI voice. Spreading mono across eyebrows, labels, footnotes, decorative URLs, stat numbers, prices, captions, footer headers = the #1 reason a whole page looks "AI-made / generic dev-tool." A premium eyebrow/label = **sans (Geist/Satoshi) weight 500, uppercase, letter-spacing ~0.04em**, not mono. Hard rule: if the text is not code, it is not mono. Across a whole hero/landing, mono appears in 0–1 places, not on every label.

### Pixel/retro accent (gaming, viral, playful tech)

| Font | Character | Best for | License |
|---|---|---|---|
| **Press Start 2P** | 8-bit arcade pixel | Logos, badges, stats, micro-headlines | Free (Google) |

Pixel-font rules:
- Only in small doses: a logo, labels, stat numbers, one micro-headline. NEVER body or paragraphs (illegible under 14px).
- Always via a dedicated var (`--font-pixel`) separate from heading/body — it's a third-layer accent, it doesn't replace the main pair.
- Single `font-weight: 400` — don't attempt bold/light on a pixel font.
- When a pixel accent carries the whole identity (retro/gaming/internet-native), a neutral body (Inter/Geist) is a feature, not slop. Outside that pattern, the Inter ban still holds.

### Pairing rules

- Max two families per project (heading + body).
- `font-display: swap` for web fonts.
- Headlines: `tracking-tight` or `letter-spacing: -0.02em`.
- ALL CAPS: `tracking-[0.05em]`.
- Test at the target size — display fonts may not work at 14px body.
- AVOID Space Grotesk — too square. Prefer Satoshi, DM Sans, Geist.

### Quick pairings

| Headlines | Body | Vibe |
|---|---|---|
| Cabinet Grotesk Bold | Satoshi Regular | Bold + Friendly |
| Clash Display Semibold | Plus Jakarta Sans Regular | Editorial + Clean |
| Geist Bold | Geist Regular | Unified + Technical |
| PP Editorial New | Satoshi Regular | Luxury + Modern |
| Outfit Bold | Outfit Regular | Clean + Minimal |
| Press Start 2P (accent) | Geist Regular + JetBrains Mono | Retro Gaming + Viral |

Where to get the free fonts: [Fontshare](https://fontshare.com) (Satoshi, Cabinet Grotesk, Clash Display), [Google Fonts](https://fonts.google.com) (Outfit, DM Sans, Plus Jakarta Sans, Instrument Serif, Newsreader, Crimson Pro, EB Garamond, Press Start 2P), [Vercel/Geist](https://vercel.com/font) (Geist, Geist Mono).

## 13. AI TELLS (forbidden patterns)

### Visual & CSS
- NO neon/outer glows. Use inner borders or tinted shadows.
- NO pure black. Use off-black, Zinc-950, charcoal.
- NO oversaturated accents. Desaturate to blend with neutrals.
- NO excessive gradient text on large headers.
- NO custom mouse cursors. Outdated, kills a11y.
- NO pulsing/breathing status dot (a green "online" dot with a pulsing `box-shadow`, an eyebrow with a blinking dot). A pulsing green dot is the absolute AI/SaaS-template cliché. A "published/live/online" state = a static checkmark, a flat icon, or text — never a breathing dot.
- NO terminal/CLI styling in marketing UI: a blinking cursor (`▌`), a prompt caret (`›`/`$`/`>`) before text, a terminal "typing" effect in the hero = generic AI dev-tool look. A product input = a real field with a placeholder, not a terminal line.
- NO skeleton/gray-block product mock (gray bars faking text, empty rectangles). A "coded dashboard/product mock" (Tier 3) = real UI: legible text, real micro-components (a button with a label, an input with a placeholder, a chat bubble with a real sentence, a preview with a real headline), brand colors. Gray blocks = an unfinished wireframe, not premium.

### Typography
- NO Inter, Roboto, Arial, Open Sans, Helvetica for premium/creative.
- NO oversized H1s. Hierarchy via weight + color, not just scale.
- NO serif on dashboards.
- NO mono as the default UI voice. Monospace only for real code/terminal/CLI. Mono in an eyebrow, label, note, decorative URL, stat number, price, footer header, caption = AI look. If it's not code, it's not mono. (Detail in §12.)

### Layout & spacing
- NO sloppy spacing. Paddings/margins mathematically perfect (4pt scale, see [spatial-design.md](reference/spatial-design.md)).
- NO generic 3-column card rows when DESIGN_VARIANCE ≥ 7. Use a 2-col zig-zag, an asymmetric grid, or horizontal scroll.
- NO floating pill nav without a matching bg behind it (it creates a visible band above the pill). The pill itself is fine — the bug is a different-colored band above it.
- NO inner nav links in a pill bg. Plain-text links; a pill only for the single primary nav CTA. Four or five links in colored pills reads as "5 glued buttons."
- NO symmetrical Bootstrap-style grids without large whitespace gaps when DESIGN_VARIANCE ≥ 7.
- NO `border-left: Npx solid color` callout (side-stripe = AI dashboard cliché).
- NO decorative floating pills (loose words in floating pills around the headline like "Google," "SMB," "AI," "+340%"). A single eyebrow above the headline is fine; ambient decorative pills = gratuitous noise.
- NO faded circle/ring/blob behind the headline (a radial SVG, a "wireframe globe," a big concentric circle). Visual AI cliché.
- NO diagonal stripe pattern bg, NO dense full-bleed grid pattern. Reads as slide wallpaper.
- NO 3+ CTAs in the hero. Valid combos: (a) one primary button + one underlined secondary link [default], (b) one button only, (c) two buttons of equal size, (d) two stacked buttons with the primary on top and larger. NEVER a primary on top that's smaller than the secondary below.
- NO hero H1 with `font-size` > 4rem (64px). FORBIDDEN `clamp(2.35rem, 11vw, 5rem)` or similar — at a 1440px viewport, 11vw = 158px, an H1 that fills the screen. Use `clamp(2rem, 5vw, 4rem)` max.
- NO hero copy container `max-w` < 42ch. FORBIDDEN `max-w-[10.5ch]` on the H1 (funnels into a "word tower").
- NO hero split with the image inside a framed card (`bg-primary` + `border` + separate `border-radius` from the hero bg). When the image fails it becomes an ugly solid rectangle; when it loads it looks like a pasted screenshot. Use a floating PNG cutout, a full-bleed bg image, OR a diagonal-cut split.
- NO `<img>` pointing at a file that wasn't generated. Always verify the file exists before writing the `<img>`.
- NO nav bg different from the top of the hero bg (nav navy + white-gradient hero = a "band" at the top). Match the colors.
- NO repeating the same layout (title left + content right) in every section. Alternate between split LR, split RL, centered, asymmetric/editorial, bento grid, gallery grid, full-bleed dark.
- NO tiny "one logo + one paragraph" footer. A proper footer = brand row + 2–3 columns (Navigation / Contact / Address) + bottom copyright + a segment disclaimer where relevant.
- NO template/lorem links in the footer (`/privacy`, "Terms on request," "Email on request"). A preview has no such pages; the links 404 and the placeholders are an AI tell. The footer's Contact column has only working channels with real data (omit an entry if empty).
- NO heading glued to body text. An h2 → adjacent `<p>` MUST have `margin-top: 1rem` (`h2 + p { margin-top: 1rem }`). Without it they read as one block.
- NO logo glued to adjacent text. Footer brand `display: flex; flex-direction: column; gap: 1rem` minimum between logo and description.
- NO oversized nav CTA dominating the nav. Max `min-height: 38px`, padding `0.5rem 1rem`, font 14px, a light box-shadow. FORBIDDEN `min-height: 46px+` with a heavy shadow (it looks like a banner ad inside the nav).
- NO testimonial avatar with a tag/role inside the circle ("PF / clarity," "CE / trust"). The avatar = only the first letter of the name. The tag goes outside the circle, or is omitted.
- NO testimonial author = "Individual client," "Business client," "Organic lead." Use a realistic fictional name + optionally one short line of context below the quote.
- NAV SCROLL-AWARE (preferred for a photo/dark hero): the nav starts transparent over the hero, becomes opaque with `backdrop-blur` once scroll > 60px. `window.addEventListener('scroll', () => scrolled = window.scrollY > 60)`. CSS transition 240ms.
- HERO HEIGHT: sweet spot `min-height: 75–90dvh` desktop / `70dvh` mobile. FORBIDDEN `100dvh` (locks the viewport) and FORBIDDEN `< 500px` mobile (looks like a cropped banner).
- CARD SPACING (icon + heading + paragraph): icon → heading gap SHORT (`mb-2` / `gap-2` = 8–12px, they belong to the same visual group). Heading → paragraph gap LONG (`mt-4 md:mt-5` = 16–20px). The opposite bug (icon far, heading glued to paragraph) breaks the hierarchy.

### Content & data
- NO generic names. "John Doe," "Sarah Chan" are banned. Creative, realistic names.
- NO generic avatars. No SVG eggs. Photo placeholders or styled initials.
- NO fake numbers (`99.99%`, `50%`). Organic: `47.2%`, a real-looking phone number.
- NO startup-slop names. "Acme," "Nexus," "SmartFlow" are banned.
- NO AI copy clichés. "Elevate," "Seamless," "Unleash," "Next-Gen" are banned. Concrete verbs.
- NO redundant repeated text (the same name/label in the eyebrow + H1 + footer, or "First Last" stacked on two giant lines). Repeating a string in three places "for emphasis" is a classic AI tell. A name appears once strong (hero) + in the `<title>`; the footer uses a different form (© Name) or nothing.
- MATCH THE OWNER'S REAL VOICE, don't invent hyped copy. If a voice source exists (a GitHub README, a bio, posts, an existing landing), mirror its register (humble lowercase, EN/PT, dry/warm tone). Default premium-personal = low-profile > hype: "building cool things with tech, mostly backend & ai" beats "Founder @ X · GenAI · Full-stack" in pills. Meta pills (`Full-stack` `GenAI` `Founder`) scattered around = AI noise; prefer one honest sentence.

### Link lists / link-in-bio (linktree-style)
- Link rows with only text (name + sub) look uniform and aren't scannable. Always lead each row with a recognizable mark: the **official brand logo** for known channels (github/x/linkedin/instagram, as a monochrome SVG via `currentColor` so it survives an invert-hover) + a **monogram/icon** for your own products. The icon is what makes the list scannable, not the text.
- Invert-on-hover (the row becomes a white block / black text via `::before scaleX`) is the premium noir move for link rows. `currentColor` icons invert along for free.

### External resources
- Prefer real, sourced imagery (see §15) over `picsum.photos`/placeholders in production. Never hotlink Unsplash in production.
- shadcn/ui: allowed but NEVER the default look. Customize radii, colors, shadows.

## 14. REVIEW CHECKLIST

Before/after/why self-audit:

| Before | After | Why |
|---|---|---|
| `transition: all 300ms` | `transition: transform 200ms var(--ease-out)` | Specify exact properties |
| `scale(0)` entry | `scale(0.95); opacity: 0` | Nothing appears from nothing |
| `ease-in` on a dropdown | `ease-out` with a custom curve | `ease-in` feels sluggish |
| No `:active` state | `scale(0.97)` on `:active` | Buttons must feel responsive |
| `transform-origin: center` on a popover | Origin-aware (trigger location) | Modals exempt |
| Duration > 300ms on UI | 150–250ms | Snappy UI |
| Hover without a media query | `@media (hover: hover) and (pointer: fine)` | Avoid touch false positives |
| Motion-lib shorthand `x`/`y` under load | `transform: "translateX()"` via WAAPI/CSS var | Hardware acceleration |
| Elements all appear at once | Stagger 30–80ms | Cascading reveal |
| Same enter/exit speed | Exit faster than enter | System responds fast |

### Pre-flight check
- [ ] Project-type preset selected, dials set?
- [ ] Vibe + layout archetype match the segment?
- [ ] Mobile collapse (`w-full`, `px-4`, `max-w-7xl mx-auto`) guaranteed?
- [ ] Full-height sections use `min-h-[100dvh]`, not `h-screen`?
- [ ] Icons: Phosphor (not static Lucide; hover-animated = lucide-animated), consistent weight, no bg box? WhatsApp = official brand SVG?
- [ ] Fonts from the approved catalog (Section 12)?
- [ ] Animation cleanup on unmount?
- [ ] Empty/loading/error states present?
- [ ] No AI tells from Section 13?
- [ ] Perpetual animations isolated in a client-only / memoized leaf?
- [ ] `prefers-reduced-motion` respected?
- [ ] Touch hover gated with a media query?
- [ ] Focus visible only via `:focus-visible`?
- [ ] All interactive elements ≥ 44px on a coarse pointer?

## 15. COPY, CONTRAST & MEDIA HARDENING

Battle-tested rules from real site generation. They apply to any piece.

### Copy
- **Run a humanizer pass on all generated copy.** Before returning, re-read every sentence and kill AI tells:
  - **AI vocab / meaning inflation:** "elevate," "transformative," "leverage," "pivotal," "evolving landscape," "a testament to," "at the heart of," "groundbreaking." Replace with a concrete verb.
  - **Copula avoidance:** "serves as / positions itself as / represents" → use "is."
  - **False-depth gerunds:** "bringing in new people and turning conversation" → "to bring in new people and turn conversation."
  - **Negative parallelism:** "not just X, it's Y" / "not only... but..." in sequence — use at most once, sparingly.
  - **Mechanical rule of three:** forced triads ("fast, simple, and powerful") — break the rhythm, vary sentence length.
  - **Synonym cycling, false ranges** ("from X to Y" with no real scale), **generic happy conclusions** ("the future is bright").
  - **Mechanical boldface** and repeated **header:colon** lists.
- **Don't over-correct into amateur:** "more human" ≠ "more slang." In landing/B2B copy: keep brand/product names EXACT (WhatsApp Business API, Meta, Stripe), keep precise verbs, keep the brand voice. Don't trade technical precision for "voice."
- **EM-DASH DISCIPLINE:** the em-dash (—, U+2014) is a top AI tell when overused. Prefer a comma, a period, or parentheses. If you use one, use one, not one per sentence. The en-dash (–) between words is also suspect. A hyphen-minus (-) is fine.
- **TONE: concrete without being harsh.** An over-aggressive humanizer produces curt copy ("You don't get jargon. You get answers."). Aim for concrete + warm/professional ("You get clear answers, no jargon."). Re-read each final sentence: if it reads as "no X, no Y, no Z" in sequence or a dry categorical negation, soften it. Keep the firmness, drop the hardness.

### Color / contrast
- **WCAG AA contrast (4.5:1 body, 3:1 for ≥24px/bold):** test every combination. A gold accent (#A3854F) on white = 2.41 (FAIL), on navy = 3.62 (FAIL). On a `bg-primary`/navy: body `text-white`, accent only in hover/underline or a lighter shade. Reserve a pure accent for a light background.
- **BRAND PALETTE: use it EXACTLY when defined, IMPROVE it when contrast fails.** A brand identity is an approved direction, not a numeric prison. An illegible gold (#A3854F) → darken to #8E6F2A/#6F4F1F keeping the gold vibe, never swap to a different color. Keep the original for large/decorative accents, use the darker variant for text.

### Hero — shapes (don't default to an image)
Pick the shape that best communicates the business:
- **Typographic only:** bold typesetting + an accent quote. When the headline already carries weight.
- **Split with a cropped side photo:** a segment photo on the right, headline on the left. Good for a physical business (lawyer, clinic, salon).
- **Full-width bg photo:** an atmospheric photo + a dark overlay + white text. Hospitality, real estate, restaurant.
- **Side card visual:** a card simulating a product/dashboard/example. Technical B2B.
- **Gradient + abstract shape:** a geometric SVG + gradient when a photo doesn't apply. Software/agency.

### Mobile hero (P0)
- Mobile nav = logo + hamburger only. NO CTA pill in the header bar; the CTA lives inside the open menu.
- Hero `font-size: clamp(2.25rem, 5.5vw, 4.5rem)` (36–72px). FORBIDDEN `11vw` / `>72px` desktop.
- Hero copy `max-w` never < 42ch (`max-w-[10.5ch]` funnels into a "word tower").
- Hero height 75–90dvh desktop / 70dvh mobile. FORBIDDEN `100dvh` and `<500px` mobile.
- An eyebrow with high letter-spacing: on mobile, hide the flanking lines, reduce tracking, and add `text-wrap: balance`.
- **Validate on mobile before returning:** open at 390×844 (Playwright / chrome-devtools) or use `getComputedStyle` to confirm the nav CTA is hidden and there's zero horizontal scroll. Breakage is a P0 blocker.

### Images / avatars
- **Stock photos:** source real, licensed imagery (Magnific stock — `mcp__magnific__stock_search` — if available, or any licensed stock source). Never hotlink Unsplash or `picsum.photos` in production. Save the real URL in the content.
- **Testimonial avatars:** NEVER a fake stock photo of a person (it reads as AI). Use a Google-style initial: a color-blocked circle (brand color) + the first letter of the first name, white, bold, ~14–16px. Vary the color between testimonials.

## License

MIT. Copyright (c) 2026 Murilo Moura. See `LICENSE`.
