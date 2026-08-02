# Design References — the free research layer (no Refero)

Section 0 of SKILL.md is non-negotiable: every visual decision starts from evidence of what real products shipped. Refero makes that step fast; it is not what makes it possible. This file is the full free path, and it produces the same artifact — a **reference-lock + decision-ledger** — with the same rule: no source, no ship.

Four routes, ranked by evidence quality. Use A whenever you can; B and C exist to tell you *which* sites are worth running A against.

| Route | What it gives | Cost | When |
|---|---|---|---|
| **A — read the live site** | Real tokens, real structure, real motion. The strongest evidence available, better than any gallery screenshot. | free | Always. This is the default. |
| **B — DESIGN.md packs** | A structured brand analysis already written out: palette, type stack, spacing, voice. | free | You want a fast, machine-readable direction to verify against the live site. |
| **C — galleries** | Breadth. What an entire segment looks like right now. | free | You don't yet know the segment's shape, or you need to pick which 3 sites to study. |
| **D — published design systems** | Documented rules with rationale, straight from the team that shipped them. | free | Enterprise, regulated, platform-consistent briefs (SKILL.md §3.1). |

---

## Route A — read the real site (do this)

Pick three to five real products (from the bank below, from the client's competitors, or from a gallery in Route C) and actually read them. Ten minutes here beats an hour of remembering what "modern SaaS" looks like.

**1. Get the markup.**
```bash
curl -sL -A "Mozilla/5.0" https://example.com -o /tmp/ref.html
```
Some sites block plain curl (403). Fall back to WebFetch, or drive a real browser (Playwright / chrome-devtools MCP) — you want a browser anyway for step 4.

**2. Extract the type stack.** Grep the HTML for the font layer, then follow it:
```bash
grep -oE '(fonts\.googleapis|fonts\.bunny|api\.fontshare|use\.typekit)[^"]*' /tmp/ref.html | sort -u
grep -oiE 'font-family:[^;}"]*' /tmp/ref.html | sort -u
```
No link tag means self-hosted fonts — grep the CSS bundle for `@font-face` and read the `src` filenames. Record the display face, the text face, and whether they're the same family at different weights (a very common premium move).

**3. Extract the tokens.** Modern sites keep everything in custom properties. Pull the CSS and grep them:
```bash
grep -oE 'href="[^"]*\.css[^"]*"' /tmp/ref.html | head
curl -sL "<css-url>" | grep -oE '\--[a-z0-9-]+:\s*[^;]+' | sort -u | head -80
```
You're looking for: the canvas color, the ink color, how many accents there actually are (usually one), the radius scale, the shadow definitions, the easing curves, and the type scale. This is the single highest-value five minutes in the whole research step.

**4. Look at it.** Screenshot at **1440×900** and **390×844**. Then answer, in writing:
- What carries the hero: type, a product shot, a photo, or motion?
- How many sections, and in what order? Where does proof sit relative to the CTA?
- Density: how much air per section? What's the real max content width?
- Where is the accent allowed to appear, and where is it deliberately absent?
- What moves on scroll, and what pointedly doesn't?

**5. Check the motion libs.** `grep -oiE '(gsap|lenis|framer-motion|motion|three|lottie)' /tmp/ref.html` on the bundle names tells you whether the feel is CSS-only or engineered.

**What never to do with Route A:** copy the CSS. You're extracting *decisions* (one accent, serif display over grotesk text, 8px radius, 120ms hovers), not code. A cloned stylesheet fails the decision-ledger just as hard as a hallucinated palette.

---

## Route B — DESIGN.md packs

Open-source collections of brand design analyses written as markdown, built to be read by coding agents. Each file carries palette hexes, type stack, spacing, radius, and voice notes.

| Repo | What it is | Size | License |
|---|---|---|---|
| [VoltAgent/official-design-md](https://github.com/VoltAgent/official-design-md) | **First-party** — DESIGN.md files published by the companies themselves (Atlassian, Clerk, Mintlify, Nuxt, Resend, Vercel). Small, authoritative. **Start here.** | 7 brands | see repo |
| [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) | Community **reverse-engineered** analyses, one folder per brand with `DESIGN.md` + light/dark `preview.html`. Broad segment coverage. | 73 brands | MIT |
| [dhananjay6561/design-md-hub](https://github.com/dhananjay6561/design-md-hub) | A second, independent reverse-engineered collection. Useful as a cross-check when two files disagree. | 120+ brands | MIT |

**The hard caveat.** Everything outside `official-design-md` is an *interpretation* of a public site, not brand documentation — the files label themselves `<brand>-design-analysis` and the repos disclaim ownership. So:

- Treat a hex from a reverse-engineered DESIGN.md as a **hypothesis**, not a fact. If it's going into a client's build, confirm it against the live site (Route A, step 3) before it enters the ledger.
- Never present one of these as "Stripe's official palette." It isn't.
- The *structure* (which roles exist, how the accent is rationed, the type hierarchy) survives the caveat better than the exact values do.

Verified 2026-08-02. Counts drift as the repos grow.

---

## Route C — galleries

Breadth, to decide *what* to study. A gallery is a starting point, never the reference-lock itself — a screenshot can't tell you the type scale or the easing.

**Free and unrestricted:**

| Gallery | Best for |
|---|---|
| [siteinspire.com](https://www.siteinspire.com) | Filterable by category, style, type and subject. The best all-round free browse. |
| [httpster.net](https://httpster.net) | ~3,100 sites sorted by style (minimal, dark, typographic) and by industry. |
| [minimal.gallery](https://minimal.gallery) | Restraint-first work, 100+ tags. Strong for portfolio, agency, architecture. |
| [onepagelove.com](https://onepagelove.com) | 9,000+ one-pagers **and 8,500+ isolated page sections** — the section library is the real asset for a landing page. |
| [lapa.ninja](https://www.lapa.ninja) | 7,300+ landing pages with category filters. Conversion-shaped work. |
| [dark.design](https://dark.design) | Dark-canvas only. Go here before building an Ethereal Glass or Tactical/CRT page. |
| [awwwards.com](https://www.awwwards.com) | Core gallery is free, filterable by technology (React/WebGL). Spectacle-heavy — calibrate, don't copy. |
| [navbar.gallery](https://navbar.gallery) · [footer.design](https://footer.design) | Single-component galleries. Solve the nav and the footer with evidence instead of defaults. |
| [calltoidea.com](https://calltoidea.com) | Component-level patterns (forms, modals, pricing tables). |

**Freemium — a usable free tier, the good part is paid:**

| Gallery | The catch |
|---|---|
| [land-book.com](https://land-book.com) | 200k+ categorized *sections*; free tier is capped, filters/search need Pro (~$6/mo). |
| [mobbin.com](https://mobbin.com) | Free tier is now recently-added apps only, ~3 collections, partial search. Much thinner than its reputation. |
| [saaslandingpage.com](https://saaslandingpage.com) | Free SaaS gallery; the Sections / Motion / Headlines sub-galleries are Pro. |
| [craftwork.design/curated/websites](https://craftwork.design/curated/websites/) | The former `curated.design`, now folded into Craftwork. Browsing is free. |
| [recent.design](https://recent.design) | The former `godly.website`. Same curated-gallery concept under a new brand. |

**Not free, don't send people there as a fallback:** [refero.design](https://refero.design) (3-day trial only — it's the premium lane), [pageflows.com](https://pageflows.com) (paid; `screenlane.com` was merged into it and no longer exists).

Verified 2026-08-02.

---

## Route D — published design systems

When the brief is enterprise, regulated, or has to stay consistent with a platform, the system's own docs beat any gallery. SKILL.md §3.1 already routes here; this is the address book. Each one has a real, documented taste — read the principles page, not just the components.

| System | Docs | The taste in one line |
|---|---|---|
| Vercel Geist | [vercel.com/geist](https://vercel.com/geist/introduction) | Developer-facing high-contrast minimalism, grid-driven, ships as real components. |
| GitHub Primer | [primer.style](https://primer.style) | "Anything added dilutes everything else." Function over ornament, aggressively. |
| Uber Base Web | [base.uber.com](https://base.uber.com) | Near black-and-white, one blue accent, legibility as the first principle. |
| IBM Carbon | [carbondesignsystem.com](https://carbondesignsystem.com/all-about-carbon/what-is-carbon/) | Open, modular, consistent. Enterprise infrastructure, composability over flourish. |
| Atlassian | [atlassian.design](https://atlassian.design) | One language across many disparate B2B products. Cohesion over personality. |
| Shopify Polaris | [polaris.shopify.com](https://polaris.shopify.com) | Commerce/admin density for merchants at work. (Polaris React is deprecated in favor of Polaris Web Components — check which you're targeting.) |
| GOV.UK | [design-system.service.gov.uk](https://design-system.service.gov.uk) | Plain and accessible by mandate. The reference for a page that must never fail anyone. |
| Material 3 | [m3.material.io](https://m3.material.io) | Dynamic color and expressive motion. Android-native briefs. |
| Adobe Spectrum | [spectrum.adobe.com](https://spectrum.adobe.com) | Rational, human, focused, collaborative. Tool-shaped UI for long sessions. |
| Ant Design | [ant.design](https://ant.design) | Dense enterprise data UI. Reach for it when the screen is a table, not a story. |
| Radix Themes | [radix-ui.com](https://www.radix-ui.com) | Accessible primitives plus, since Themes 3.0, a full opinionated visual layer. |
| Nordhealth Nord | [nordhealth.design](https://nordhealth.design) | Clinical-grade rigor, production components from real healthcare software. |

Verified 2026-08-02.

---

## The reference bank — where to look, by segment

The bank answers "which real products should I study for *this* brief." Every brand below is live, and every one also has a DESIGN.md in Route B, so you can read the analysis and verify it against the site in the same sitting.

**This is a map, not a lock.** Nothing here enters the decision-ledger until you've run Route A on it. The skill's job is to point you at real work fast; the evidence still has to be yours.

| Brief | Study these | Usually maps to |
|---|---|---|
| Dev tools, infra, API products | linear.app, vercel, supabase, sentry, clickhouse, mongodb, hashicorp, warp, raycast, cursor, mintlify, posthog, resend | Ethereal Glass · Tactical/CRT for anything terminal-adjacent |
| AI / LLM products | claude, x.ai, mistral.ai, cohere, elevenlabs, together.ai, replicate, runwayml, lovable, ollama | Ethereal Glass — and the segment is saturated, so check §13 before reaching for another dark-gradient hero |
| Fintech, payments, crypto | stripe, revolut, wise, coinbase, mastercard | Soft Structuralism for trust-first; Ethereal Glass for trading/crypto |
| Productivity, collaboration, no-code | notion, figma, miro, airtable, slack, intercom, superhuman, zapier, cal, framer, webflow, sanity | Warm-Monochrome Editorial · Soft Structuralism |
| Consumer marketplace, travel, mobility | airbnb, uber, shopify, pinterest, spotify | Soft Structuralism |
| Sport, retail, lifestyle brands | nike, starbucks | Editorial Luxury · Swiss Industrial Print |
| Automotive, luxury, high-ticket physical | ferrari, lamborghini, bugatti, bmw-m, tesla, renault | Editorial Luxury — full-bleed imagery, restrained type, near-zero UI chrome |
| Editorial, media, publishing | theverge, wired | Editorial Luxury · Swiss Industrial Print |
| Gaming, playful, retro-tech | playstation, nintendo (2001 capture), dell (1996 capture) | Whatever the era dictates. The period captures are the honest reference for a retro brief; don't reconstruct the 90s from memory. |

**How to use it:** pick the row, pick two or three brands, run Route A on each, then follow §0 step 4 — one dominant primary direction, secondaries lending one detail each, never the average of all three.

---

## The output contract (identical to the Refero path)

Whichever route you took, §0 still demands both artifacts before a line of code:

1. **Reference-lock** — the primary direction, three to five traits to preserve (canvas, type, accent, layout, density, media), what each secondary lends, role rules (CTA-only, code-only, decorative-only), and the media strategy.
2. **Decision-ledger** — a `decision | source | role/rule | why` table where `source` is a **real URL you actually opened**, a client constraint, or a named rule in this skill.

"A DESIGN.md said so" is a valid source only when it's the first-party repo or you verified it live. "The model thought it looked good" has never been a valid source, with Refero or without it.
