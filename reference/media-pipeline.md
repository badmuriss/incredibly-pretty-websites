# Media Pipeline — stock photos, generated images, image→video

Two media needs beyond hand-drawn CSS: **real photography** and **premium looping video** (a hero background or a mid-page section accent).

- **Photography has a free lane and it is the default.** It costs nothing, needs no MCP, and covers most real work. Section below.
- **Video and image generation are the paid lane** ([Magnific](https://magnific.ai) via MCP), Tier 3 only and cost-gated. Without it, everything degrades to the fallbacks at the bottom.

## Stock photography — free lane (default)

Pick the source by what the photo has to do. Every source below is genuinely free and self-serve.

| Need | Source | Key | Attribution | Hosting rule |
|---|---|---|---|---|
| Everyday commercial photography — people, workspace, food, interiors, the ordinary hero or section shot | **Pexels** — `GET https://api.pexels.com/v1/search?query=` | instant self-serve; 200 req/h, 20k/month | not required | Terms say **nothing** either way about hotlink vs rehost. Download + self-host: it's the perf-correct default and nothing forbids it. |
| Same brief, larger and better-curated catalog | **Unsplash** — `GET https://api.unsplash.com/search/photos?query=` | instant demo key 50 req/h; 5 000 req/h needs **manual approval**, not instant | **required** | **Hotlinking is mandatory, self-hosting breaks the terms.** See the rule below. |
| Same brief, and you need the file on your own server | **Pixabay** — `GET https://pixabay.com/api/?q=` | key on signup; ~100 req/60s | not required | **Hotlinking forbidden** — download to your server first, and cache API responses 24h. |
| Texture, archival, art, science, editorial, anything historical | **Openverse** `api.openverse.org/v1/images/` (meta-search over CC + public-domain works, key optional) · **Wikimedia Commons** `commons.wikimedia.org/w/api.php` (no key, descriptive `User-Agent` required) · **Met Open Access** `collectionapi.metmuseum.org` (no key, CC0) · **Smithsonian Open Access** (key via api.data.gov, CC0) · **NASA** `images-api.nasa.gov/search` (no key, mostly public domain) | none to instant | per work | Per the **original host** — Openverse and Europeana only index, they don't host the pixels. |

Verified against each provider's own docs on 2026-08-02. Rate limits and terms drift; re-read the provider's page before betting a client project on a number. Pixabay's docs page blocks automated fetches, so treat its two rules as high-confidence but worth a manual glance.

### Hard rules (both lanes)

- **`picsum.photos` never ships to production.** It's a prototyping toy: random image, no license clarity, no control. Fine in a throwaway sketch, never in a page a client pays for.
- **Unsplash is the one place "self-host it" is the wrong answer.** Their API guidelines require you to embed the returned CDN URL directly (hotlink) so views attribute back to the photographer, require a `GET` on `photo.links.download_location` whenever the user does something download-like, and require a visible credit to the photographer and to Unsplash with links back. Take all three or don't use the Unsplash API. If a project's rules forbid third-party image hosts, pick Pexels or Pixabay instead and self-host there.
- **A "free license" from an aggregator is an assertion, not a warranty.** Openverse and Europeana index other people's servers and explicitly disclaim verifying the license. For a client site, follow the result back to the original host and confirm the license there. Exclude NC-licensed works from anything commercial.
- **No people-photos as testimonial avatars.** A stock face on a testimonial reads as AI instantly. Use a Google-style initial: a color-blocked circle + the first letter of the first name (SKILL.md §15).
- **A self-hosted photo gets processed, never dropped in raw.** Resize to the real rendered width (2x for retina, no more), convert to AVIF with a WebP fallback, ship `srcset`/`sizes`, set explicit `width`/`height` to reserve the box, `loading="lazy"` + `decoding="async"` for anything below the fold, and `fetchpriority="high"` on the LCP image only. A 4MB JPEG behind a beautiful layout is still a broken page.

### Paid lane — Magnific stock (when available)

`mcp__magnific__stock_search(query)` → `stock_get` / `stock_download`. Licensed catalog, no attribution bookkeeping, self-host the result. Use it when the free lane can't find the shot or when a client needs a cleaner licensing paper trail.

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
- **Self-host is mandatory** — a generation service returns a remote URL with undocumented retention. NEVER hotlink it on a production site. Download the MP4 → upload to your own object storage / CDN (any provider: S3, R2, Bunny, a plain static host) → serve from there. The skill is CDN-agnostic; no cloud is assumed.

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

Tier 3 without video uses: **animated gradient mesh blobs** (`@property`, SKILL.md §6) OR a **full-bleed photo + overlay**. Video is optional enrichment, never a layout dependency.

Photos are not part of this gate at all — the free lane at the top of this file needs no budget and no MCP. "No Magnific" is never a reason to ship a placeholder.
