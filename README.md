# Incredibly Pretty Websites

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
  - `media-pipeline.md` — stock photos and image→video via Magnific, self-hosted
  - `redesign.md` : redesign/audit mode (Scan, Diagnose, Fix) with what-never-changes-silently and SEO-safe migration

## Install

```bash
npx skills add badmuriss/incredibly-pretty-websites
```

Works with Claude Code and any agent supporting the [skills](https://skills.sh) format. Manual alternative:

```bash
git clone https://github.com/badmuriss/incredibly-pretty-websites ~/.claude/skills/incredibly-pretty-websites
```

Then just ask your agent to build a site. The skill triggers on frontend/design work, or invoke it explicitly. It works fully on its own — the premium integrations below are optional.

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

**Premium, optional (the accelerators):**
- [Refero](https://refero.design) — real shipped-product references for the research-first step. The skill has free fallbacks (Godly, Land-book, Mobbin) when it's absent.
- [Magnific](https://magnific.ai) — licensed stock photography and image→video generation, self-hosted. The skill degrades to free fallbacks when it's absent.

## The philosophy in one line

Research real products before writing a line, pick a taste direction and commit to it (never the lukewarm average), then execute with a system that has an opinion about every pixel.

## License

MIT. See [`LICENSE`](LICENSE).

Built by [Murilo Moura](https://github.com/badmuriss).
