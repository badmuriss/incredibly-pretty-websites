<p align="center"><img src="docs/banner.png" width="720" alt="incredibly pretty websites wordmark in an elegant serif on a deep night blue background, the word pretty in coral italic, with the tagline: make AI build websites that look shipped by a real team"></p>

<p align="center"><b>Make AI build websites that look like a real product team shipped them.</b></p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="MIT license"></a>
  <a href="https://skills.sh"><img src="https://img.shields.io/badge/agent-skill-black?style=flat-square" alt="agent skill"></a>
  <a href="https://github.com/badmuriss/incredibly-pretty-websites/stargazers"><img src="https://img.shields.io/github/stars/badmuriss/incredibly-pretty-websites?style=flat-square" alt="GitHub stars"></a>
  <a href="https://github.com/badmuriss/incredibly-pretty-websites/commits/main"><img src="https://img.shields.io/github/last-commit/badmuriss/incredibly-pretty-websites?style=flat-square" alt="last commit"></a>
</p>

<p align="center">
  <a href="#built-with-it">Built with it</a> ·
  <a href="#whats-inside">What's inside</a> ·
  <a href="#install">Install</a> ·
  <a href="#the-stack-it-recommends">The stack it recommends</a>
</p>

## Built with it

Five sites, five canvases, five type systems, no shared template. That's the point.

| Site | What it is | The design signature |
|---|---|---|
| [rayssaalves.com](https://rayssaalves.com) | Portfolio for a social media designer | Clash Display + Satoshi on a warm paper canvas (`#edebe7`), orange and magenta accents, scroll-telling with GSAP ScrollTrigger + Lenis. React + Vite + vite-react-ssg, prerendered. |
| [muriloo.dev](https://muriloo.dev) | Personal link-in-bio, noir | Bricolage Grotesque + DM Sans on `#0a0a0b`, an SVG `feTurbulence` grain at 5.5% over a vignette, grayscale portrait with a masked fade, hairline-divided link rows. One static HTML file, inline CSS, zero JS. |
| [useentrelinhas.com](https://useentrelinhas.com) | Landing for an AI that reads exported WhatsApp threads | Geist + Newsreader italic on a mint canvas (`#f3f9f8`), one teal accent ramp, serif reserved for the emotional lines. Motion is pure CSS — ten keyframes, no animation dependency. React 19 + vite-react-ssg. |
| [ecosdeamor.com.br](https://ecosdeamor.com.br) | A personalized digital gift | Self-hosted Fraunces + Dancing Script + Plus Jakarta Sans, dark plum canvas with antique-gold and rose `oklch` ramps, 27 CSS keyframes. React + vite-react-ssg + shadcn, customized past the default look. |
| [cv.muriloo.dev](https://cv.muriloo.dev) | One-page CV | The muriloo.dev type system in monochrome: every `oklch` token at chroma 0, JetBrains Mono for the data, dot-grid ground, Lenis smooth scroll. React + Vite. |

## Install

```bash
npx skills add badmuriss/incredibly-pretty-websites
```

Works with Claude Code and any agent supporting the [skills](https://skills.sh) format. Manual alternative:

```bash
git clone https://github.com/badmuriss/incredibly-pretty-websites ~/.claude/skills/incredibly-pretty-websites
```

Then just ask your agent to build a site. The skill triggers on frontend/design work, or invoke it explicitly. It works fully on its own — the premium integrations below are optional.

An agent skill ([skills](https://skills.sh) format — Claude Code, Codex, OpenCode, Cursor) that makes AI build websites that look like a real product team shipped them, not like a language model guessed at "modern and clean."

Most AI-generated sites share the same tells: the same handful of default fonts everywhere, a purple gradient glow, three identical card columns, a pulsing green "online" dot, mono font on every label, an oversized H1 that fills the screen. This skill is a system for avoiding all of that on purpose: design dials tuned per segment, vibe and layout archetypes, a motion engine with real easing and duration rules, a curated font catalog, and a hard list of the AI tells to never ship.

**React-first.** Vue and vanilla CSS/JS are first-class too. If nothing is specified, it assumes React.

## What's inside

- **`SKILL.md`** — the core: research-first workflow, project-type presets, design dials, vibe/layout archetypes, the animation engine, a typography catalog, ~60 forbidden "AI tells," and a review checklist.
- **`reference/`** — the deep technical foundations:
  - `spatial-design.md` — 4pt scale, hierarchy, container queries
  - `motion-design.md` — easing curves, durations, a transition pattern catalog
  - `interaction-design.md` — the 8 interactive states, focus-visible, popovers, modals
  - `responsive-design.md` — mobile-first, pointer queries, safe-area, srcset
  - `framework-adapters.md` — React / Vue / vanilla equivalents for motion, state, hydration
  - `component-libs.md` — copy-in animated components (Magic UI, React Bits, animated Lucide icons)
  - `scroll-motion.md` — GSAP ScrollTrigger + Lenis smooth-scroll, with perf/a11y guardrails
  - `design-references.md` — the free research layer: extracting a real site's tokens, DESIGN.md packs, free galleries, public design systems, and a segment → references bank
  - `media-pipeline.md` — free stock photography with the per-source hosting rules, plus image→video via Magnific
  - `redesign.md` : redesign/audit mode (Scan, Diagnose, Fix) with what-never-changes-silently and SEO-safe migration

## The stack it recommends

The skill is designed around a curated set of tools. The free open-source layer is enough to build genuinely beautiful sites; the premium layer is optional and makes the research and media steps faster and better.

**Free, open-source (the default):**
- [shadcn](https://ui.shadcn.com) — the registry that serves the copy-in components
- [Magic UI](https://magicui.design) — Tailwind + Motion animated components (the default arsenal)
- [React Bits](https://reactbits.dev) / [Vue Bits](https://vue-bits.dev) — text effects, galleries, WebGL spectacle
- [GSAP](https://gsap.com) + [Lenis](https://lenis.darkroom.engineering) — scroll-telling and smooth scroll
- [Motion](https://motion.dev) — the animation library (successor to Framer Motion)
- [Phosphor Icons](https://phosphoricons.com) — the icon set (static Lucide is banned on purpose)
- [Fontshare](https://fontshare.com) + [Google Fonts](https://fonts.google.com) + [Geist](https://vercel.com/font) — the curated font catalog

**Free research and media layer (no account, no budget — [`design-references.md`](reference/design-references.md) + [`media-pipeline.md`](reference/media-pipeline.md)):**
- Reading the live site itself — `curl`/WebFetch the HTML, pull the font links and the CSS custom properties, screenshot at 1440 and 390. Stronger evidence than any gallery screenshot, which is why it's route A.
- [VoltAgent/official-design-md](https://github.com/VoltAgent/official-design-md) (first-party) + [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) (70+ reverse-engineered brands) — DESIGN.md packs, treated as hypotheses to verify, never as official brand docs
- [siteinspire](https://www.siteinspire.com), [httpster](https://httpster.net), [minimal.gallery](https://minimal.gallery), [One Page Love](https://onepagelove.com) (8,500+ isolated page *sections*), [dark.design](https://dark.design), [navbar.gallery](https://navbar.gallery), [footer.design](https://footer.design)
- [Pexels](https://www.pexels.com/api/documentation/), [Unsplash](https://unsplash.com/documentation), [Pixabay](https://pixabay.com/api/docs/) and the public-domain archives (Openverse, Wikimedia, Met, Smithsonian, NASA) — with each source's contradictory hosting rules spelled out, because Unsplash *requires* hotlinking and Pixabay *forbids* it

**Premium, optional (the accelerators):**
- [Refero](https://refero.design) — real shipped-product references, searchable by style, screen and flow. Replaces route A's manual work, not its role.
- [Magnific](https://magnific.ai) — licensed stock plus image→video generation for Tier 3 hero loops, self-hosted and cost-gated. The only thing with no free equivalent here is the video generation.

## The philosophy in one line

Research real products before writing a line, pick a taste direction and commit to it (never the lukewarm average), then execute with a system that has an opinion about every pixel.

## License

MIT. See [`LICENSE`](LICENSE).

Built by [Murilo Moura](https://github.com/badmuriss).
