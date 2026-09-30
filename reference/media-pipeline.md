# Media Pipeline — stock photos, generated images, image→video

Three media needs beyond hand-drawn CSS: **real photography**, **generated stills** (a hero object, a clay render, a product shot that does not exist), and **premium looping video** (a hero background or a mid-page section accent).

- **Photography has a free lane and it is the default.** It costs nothing, needs no MCP, and covers most real work. Section below.
- **Generated stills use the configured session capability.** Magnific is an optional service when already available and authorized. Costs and limits follow the actual provider.
- **HTML motion and authored videos use the existing Playwright workflow.** Generative footage is a separate, optional service choice. Do not install HyperFrames or Remotion or launch another coding agent to obtain media tools.

## Stock photography — free lane (default)

Pick the source by what the photo has to do. Every source below is genuinely free and self-serve.

| Need | Source | Key | Attribution | Hosting rule |
|---|---|---|---|---|
| Everyday commercial photography — people, workspace, food, interiors, the ordinary hero or section shot | **Pexels** — `GET https://api.pexels.com/v1/search?query=` | instant self-serve; 200 req/h, 20k/month | not required | Terms say **nothing** either way about hotlink vs rehost. Download + self-host: it's the perf-correct default and nothing forbids it. |
| Same brief, larger and better-curated catalog | **Unsplash** — `GET https://api.unsplash.com/search/photos?query=` | instant demo key 50 req/h; 5 000 req/h needs **manual approval**, not instant | **required** | **Hotlinking is mandatory, self-hosting breaks the terms.** See the rule below. |
| Same brief, and you need the file on your own server | **Pixabay** — `GET https://pixabay.com/api/?q=` | key on signup; ~100 req/60s | not required | **Hotlinking forbidden** — download to your server first, and cache API responses 24h. |
| Texture, archival, art, science, editorial, anything historical | **Openverse** `api.openverse.org/v1/images/` (meta-search over CC + public-domain works, key optional) · **Wikimedia Commons** `commons.wikimedia.org/w/api.php` (no key, descriptive `User-Agent` required) · **Met Open Access** `collectionapi.metmuseum.org` (no key, CC0) · **Smithsonian Open Access** (key via api.data.gov, CC0) · **NASA** `images-api.nasa.gov/search` (no key, mostly public domain) | none to instant | per work | Per the **original host** — Openverse and Europeana only index, they don't host the pixels. |

Verified against each provider's own docs on 2026-08-02. Rate limits and terms drift; re-read the provider's page before betting a client project on a number. Pixabay's docs page blocks automated fetches, so treat its two rules as high-confidence but worth a manual glance.

### Hard rules (every photo source)

- **`picsum.photos` never ships to production.** It's a prototyping toy: random image, no license clarity, no control. Fine in a throwaway sketch, never in a page a client pays for.
- **Unsplash is the one place "self-host it" is the wrong answer.** Their API guidelines require you to embed the returned CDN URL directly (hotlink) so views attribute back to the photographer, require a `GET` on `photo.links.download_location` whenever the user does something download-like, and require a visible credit to the photographer and to Unsplash with links back. Take all three or don't use the Unsplash API. If a project's rules forbid third-party image hosts, pick Pexels or Pixabay instead and self-host there.
- **A "free license" from an aggregator is an assertion, not a warranty.** Openverse and Europeana index other people's servers and explicitly disclaim verifying the license. For a client site, follow the result back to the original host and confirm the license there. Exclude NC-licensed works from anything commercial.
- **No people-photos as testimonial avatars.** A stock face on a testimonial reads as AI instantly. Use a Google-style initial: a color-blocked circle + the first letter of the first name (implementation-guide.md §15).
- **A self-hosted photo gets processed, never dropped in raw.** Resize to the real rendered width (2x for retina, no more), convert to AVIF with a WebP fallback, ship `srcset`/`sizes`, set explicit `width`/`height` to reserve the box, `loading="lazy"` + `decoding="async"` for anything below the fold, and `fetchpriority="high"` on the LCP image only. A 4MB JPEG behind a beautiful layout is still a broken page.

### Magnific stock — REST API, not MCP

Magnific carries a large licensed catalog (it is Freepik), but **the stock endpoints live on the REST API and are absent from the MCP tool set** as of 2026-08-19. Asking the MCP to "search stock" gets you a generated image instead of a licensed one. Reach it with `curl` and an API key from [magnific.com/user/api-keys](https://www.magnific.com/user/api-keys), base `https://api.magnific.com`, header `x-magnific-api-key`:

| Catalog | Endpoints |
|---|---|
| Photos, vectors, PSDs, templates | `GET /v1/resources` · `/v1/resources/{id}` · `/v1/resources/{id}/download` · `/v1/resources/{id}/download/{format}` |
| Icons | `GET /v1/icons` · `/v1/icons/{id}` · `/v1/icons/{id}/download` |
| Stock video footage | `GET /v1/videos` · `/v1/videos/{id}` · `/v1/videos/{id}/download` |

All three support AI-powered keyword search and sorting, are rate-limited, and carry the [API license agreement](https://www.magnific.com/legal/terms-of-use#api-services) — read it for a client project, it is not the same as the CC0 sources above.

**When to use it over the free lane:** the client needs one licensing paper trail instead of four providers' contradictory hosting rules, or the shot is a vector/PSD/template that Pexels and Pixabay simply do not carry. For an ordinary photo the free lane still wins on cost and covers it. The **Icons** endpoint does not override §3's icon policy — one family per project, and an established Lucide/Phosphor system is not replaced by a stock icon.

**Stock video** is a real third option next to "generate a loop" and "no video at all": no render credits, no cost gate, and the same self-host rule applies.

## Generated stills

Use the image capability configured in the active session when it meets the brief.
Do not assume another harness's image tool or a command-line coding agent is available.
Use a specialized provider only for a required capability and within existing
cost authorization. Verify current model names and limits in that provider.

| Need | Available session capability | Optional Magnific integration |
|---|---|---|
| Generation | Use its documented generation/edit interface | Confirm `images_generate` in the live tool list |
| Cost | Follow the configured service's actual limits; do not assume free extra generations | Check the active plan and generation credits |
| Series consistency | Reuse approved references, lighting and material prompts; native edits when supported | Style/character references when available and authorized |
| Cutouts | Request transparent output when supported and inspect the real alpha channel | Background removal when supported and authorized |

An alpha cutout requires real transparency, not a visible checkerboard baked into
an opaque image. Inspect the file. If native generation does not supply alpha,
use an available, authorized background-removal tool. The retired image-gen
wrapper and its local BiRefNet installation are not prerequisites.

Apply the same processing discipline as a self-hosted photo: real rendered width,
AVIF/WebP, explicit dimensions and priority only on the LCP image.

### 3D clay renders

The Soft Clay 3D archetype and its prompt templates remain in
[implementation-guide.md](implementation-guide.md). Use a consistent lighting,
material and palette description across the series and reuse approved reference
images when the configured tool supports it. Inspect transparency and compression
before shipping. Preserve a static image fallback for any interactive scene.

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
- **Paid renders require authorization for that service.** Honor existing authorization; if it is absent, verify the current pricing and present the concrete operation and estimate before requesting approval. A configured credential is not authorization. See the provider's [pricing documentation](https://docs.magnific.com/pricing) when Magnific is the selected service.
- **Self-host is mandatory** — a generation service returns a remote URL with undocumented retention. NEVER hotlink it on a production site. Download the MP4 → upload to your own object storage / CDN (any provider: S3, R2, Bunny, a plain static host) → serve from there. The skill is CDN-agnostic; no cloud is assumed.

## Setup

**Session capability:** use the active harness's configured image tools and native configuration. Do not launch Codex, Claude or OMP merely to obtain a missing tool.

**Optional Magnific integration:** configure `https://mcp.magnific.com` through the chosen harness's native MCP interface when the user requests this service. The following tool table is a documentation snapshot, not proof of current availability or costs.
OAuth in the browser on first call, no API key to manage. Documented tools as of 2026-08-19 ([docs.magnific.com/modelcontextprotocol](https://docs.magnific.com/modelcontextprotocol)):

| Group | Tools |
|---|---|
| Account | `account_balance`, `project_report` — free, no credits |
| Images | `images_generate`, `images_generate_svg`, `images_to_svg`, `images_upscale`, `images_crop`, `images_resize`, `images_remove_background`, `images_models_list` / `images_models_show` |
| Video | `video_generate`, `video_models_list` / `video_models_show` |
| Audio / 3D | `audio_tts`, `audio_voices_list`, `models3d_generate` |
| Creations | `creations_search` / `_get` / `_show` / `_wait`, `creation_status`, `creations_move`, the upload trio |
| References | `custom_references_create` (train a character or style), `custom_references_list` |

Magnific was Freepik until 2026; a `magnific.ai` endpoint or a `stock_search` / `simulate_cost` tool name is the legacy surface. Stock is **not** in this list — it lives on the REST API, above. **The live `tools/list` is authoritative** — read it before building a flow on any name in this table.

## Flow: image → video (hero loop)

1. `video_models_list` — see the available video models and the roles each accepts.
2. **Cost-gate:** quote the cost from the model's rate + `account_balance`, then wait for an explicit "go." Never skip this.
3. Get the reference still: a licensed photo from the free stock lane, or a generated frame from either still lane — the active host’s configured image generator locally or `images_generate` in Magnific.
4. `video_generate` referencing that still + a prompt (the 5-slot architecture below). Keep the clip ≤ ~15s.
5. `creations_wait` → poll until complete; it returns the hosted asset URL (validate the codec — assume MP4/webm).
6. **Self-host:** download the asset → upload to your CDN/storage → use that URL in the `<video>`.

### Real cost preflight (don't use a baked table)

Quote the real number before submitting a paid job — model pricing changes, and `account_balance` plus the published rate costs nothing to check. For an abstract background the model matters little (no faces/physics), so pick on cost × resolution: check `video_models_list` and choose the best value that hits your target resolution. Reserve the heavier, identity/character-capable models for product or character shots where their strength actually pays off.

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

Tier 3 without video uses: **animated gradient mesh blobs** (`@property`, implementation-guide.md §6) OR a **full-bleed photo + overlay**. Video is optional enrichment, never a layout dependency.

Photos and generated stills are not part of this gate at all — the free stock lane needs no budget and no MCP, and the active host’s configured image generator uses the configured host capability and its actual costs and limits. Without Magnific, its generative-video recipe is unavailable; authored Playwright motion and existing footage can still meet the brief.
