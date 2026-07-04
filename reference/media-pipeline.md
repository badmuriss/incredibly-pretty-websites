# Media Pipeline — stock photos + image→video via Magnific (Tier 3, cost-gated)

Two media needs beyond hand-drawn CSS: **real photography** and **premium looping video** (a hero background or a mid-page section accent). Both are covered by **Magnific** ([magnific.ai](https://magnific.ai)) via its MCP tools. Magnific handles generation and licensed stock; you self-host the result on your own CDN/storage.

This is optional and gated. Without Magnific or an approved budget, everything degrades gracefully to free fallbacks (below).

## Stock photography

When a piece needs a real photo (hero atmosphere, a segment shot, a background image):
- `mcp__magnific__stock_search(query)` → browse licensed results.
- `mcp__magnific__stock_get` / `stock_download` → pull the asset.
- Save the real URL into your content. **Never hotlink Unsplash or `picsum.photos` in production.**

For testimonial avatars, do NOT use a stock photo of a person (it reads as AI). Use a Google-style initial: a color-blocked circle + the first letter of the first name (SKILL.md §15).

## Video — placement is case-by-case, decided by research (no fixed default)

Hero background AND section accent are both valid. The choice comes from the **reference-lock in §0** (what real products in the segment do) + the brand + what the page needs — not a "always X" rule.

| Placement | For | Technical trade-off |
|---|---|---|
| **Hero background** | The hero IS the visual bet and the segment's references call for it (agency/portfolio/luxury real estate/cinema, audiovisual brands). Big first-contact impact. | Above the fold → protect LCP: a `poster` is mandatory + critical content (H1/CTA) in HTML/CSS; video enriches afterward. Don't replace a hero that already converts just to have video. |
| **Section accent** | The hero is already solved and you want ambient motion mid-page (a pre-footer CTA, a manifesto, a showcase), or the references use video as a breather between sections. | Below the fold → zero LCP penalty, easy lazy-load + play-in-view. |

**Decision rule:** run the research (§0), see where real products in the segment put video motion, follow the evidence. When in doubt, the reference-lock wins — like any structural decision.

**Rule 1 — optional:** video is **enrichment, never a layout dependency**. The section/hero works 100% if the video never loads.

**Rule 2 — the video follows the BRAND CANVAS, not a fixed color.** The loop inherits the branding's palette/mood, like any visual element:
- **Light brand** (Soft Structuralism, light palette) → a light, branded abstract loop (gradient, particles, mesh, soft light).
- **Dark brand** (Ethereal Glass OLED SaaS, dark luxury/cinema, nocturnal Editorial Luxury) → a cinematic dark loop is correct and on-brand. A dense atmospheric scene fits here.
- **Always:** an overlay + text color guarantee WCAG AA over the video, light or dark. Change the loop's palette; don't change legibility.

**HARD GATES:**
- **PREMIUM_TECH_TIER ≥ 3 only** (Tech/SaaS, Creative, Luxury real estate, Architecture). A video bg on a lawyer/local-shop site = slop + bad LCP.
- **COST APPROVAL is mandatory before any paid render.** Use `mcp__magnific__simulate_cost` to quote the exact cost first, show the estimate, and wait for an explicit "go" from the human. Autonomous mode never triggers a paid render on its own.
- **Self-host is mandatory** — a generation service returns a remote URL with undocumented retention. NEVER hotlink it on a production site. Download the MP4 → upload to your storage (R2/S3/any CDN) → serve from there.

## Setup

Register the Magnific MCP (once, user action; requires a Magnific account):
```
claude mcp add --transport http --scope user magnific https://mcp.magnific.ai/mcp
```
Relevant tools: `stock_search` / `stock_download`, `images_generate`, `video_models_list` / `video_models_show`, `simulate_cost`, `video_generate`, `video_plan`, `creations_wait` / `creations_get`.

## Flow: image → video (hero loop)

1. `video_models_list` — see the available video models and the roles each accepts.
2. **Cost-gate:** `simulate_cost` for the exact cost + wait for an explicit "go." Never skip this.
3. Get the reference still: either `stock_search`/`stock_download` for a licensed photo, or `images_generate` for a generated frame (a hero frame, a product, an approved shot).
4. `video_generate` referencing that still + a prompt (the 5-slot architecture below). Keep the clip ≤ ~15s.
5. `creations_wait` → poll until complete; it returns the hosted asset URL (validate the codec — assume MP4/webm).
6. **Self-host:** download the asset → upload to your CDN/storage → use that URL in the `<video>`.

### Real cost preflight (don't use a baked table)

Always run `simulate_cost` for the real number before submitting a paid job — model pricing changes, and it costs nothing to quote. For an abstract background the model matters little (no faces/physics), so pick on cost × resolution: check `video_models_list` and choose the best value that hits your target resolution. Reserve the heavier, identity/character-capable models for product or character shots where their strength actually pays off.

## 5-slot prompt architecture (< 80 words, front-loaded)

1. **Subject anchor** — what the reference still shows, in your words.
2. **Action verb** — a concrete verb (`turns`, `exhales`, `drifts`, `rotates`), never a vague `moves`.
3. **Camera motion** — a named technique: dolly in/out, orbit, crane, handheld push, locked-off, rack focus, whip pan.
4. **Lighting & atmosphere** — dominant source, color temperature, hardness, direction, practicals.
5. **Style & pacing** — aesthetic + tempo. e.g. "Cinematic, 35mm film grain, deliberate pacing."

Example hero-bg prompt (constructed, not quoted): *"A matte-black product device resting on brushed concrete. It rotates a slow quarter-turn as faint dust drifts past. Locked-off beauty shot, slow orbit, slight parallax push. Soft top key, cool 5000K, gentle rim from behind, deep shadow falloff. Minimal, premium, slow deliberate pacing, seamless loop."*

> "seamless loop" in the prompt is a weak request, not a guarantee.

### A real seamless loop: `start_image` == `end_image` (preferred method)

If the chosen model accepts `start_image` AND `end_image` roles, **pass the same still to both** → the model generates a clip that returns exactly to the first frame = a perfect loop with `<video loop>`, zero post-processing:
```
medias: [
  { role: "start_image", value: "<still_id>" },
  { role: "end_image",   value: "<still_id>" }   // same id
]
```
Reinforce in the prompt: "…then everything eases back to its exact starting position. Perfect seamless loop returning to the first frame."

**Whenever the target is an autoplay loop, use end=start.** A boomerang (forward+reverse via ffmpeg) is an inferior fallback — the reversal is perceptible. An ffmpeg crossfade-loop leaves a micro-jump. end=start beats both.

## `<video>` recipe (the craft part — always applies, hero or section)

```html
<video muted playsinline loop preload="none" class="bg-video"
       poster="/video-poster.jpg">          <!-- poster = first frame, holds the slot while loading -->
  <source src="https://<your-cdn>/clip.mp4" type="video/mp4" />
</video>
```
- `muted` + `playsinline` are mandatory (mobile autoplay). **Always an overlay** (a gradient/translucent `<div>`) for legible text (WCAG AA).
- **`poster`** static → the slot never sits empty or jitters; critical content (H1/CTA/copy) lives in HTML/CSS and does NOT depend on the video appearing.
- **`prefers-reduced-motion: reduce`** → don't play, show only the `poster`. A gate, not an option.
- Weight: ≤ ~3–5MB, ≤15s, resolution matched to the container width (don't serve 4K into a 1440px slot). Compress before uploading.

**Loop with no visible seam:** either the model delivered a seamless loop (not guaranteed), or mask it with a crossfade via `requestAnimationFrame` (fade-out 500ms when ~0.55s remain, reset, fade-in). NEVER trust the raw `loop` attribute alone if the cut shows.

**Section accent (preferred) — lazy-load + play only in view** (below the fold, saves bandwidth/battery, zero LCP):
```js
// preload="none" in the HTML; IntersectionObserver plays on enter, pauses on exit
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const io = new IntersectionObserver(([e]) => {
  if (reduce) return;                       // reduced-motion = never plays, stays on the poster
  e.isIntersecting ? e.target.play() : e.target.pause();
}, { threshold: 0.25 });
io.observe(videoEl);
// React: inside useEffect with cleanup io.disconnect(); client-only boundary (vite-react-ssg)
```
The hero (above the fold) doesn't lazy-load — play it directly, but keep the `poster` covering the LCP.

## Fallback (no Magnific / no approved budget)

Tier 3 without video uses: **animated gradient mesh blobs** (`@property`, SKILL.md §6) OR a **full-bleed photo + overlay**. Video is optional enrichment, never a layout dependency. For photos without Magnific stock, use any licensed stock source and save the real URL.
