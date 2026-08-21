# Redesign mode: Scan, Diagnose, Fix

For reworking an existing site or app instead of a greenfield build. A redesign still does the research in SKILL.md §0 (study real references, lock a direction): it just **also preserves** what the live site already earns. An ugly site that ranks beats a prettier one that silently broke its URLs and its indexing.

**Take a before-snapshot first.** Run the [site-audit](https://github.com/badmuriss/site-audit) skill against the live URL before touching anything (`npx skills add badmuriss/site-audit`). For a landing page, this starts with the real-user + rendered-Googlebot delivery gate and the ten-layer diagnosis in [conversion-diagnosis.md](conversion-diagnosis.md), before copy changes. The report is the baseline you are protecting: conversion path, delivered content, head, canonical, sitemap, structured data and Core Web Vitals as they stand today. Run it again after the redesign and diff the two. This file owns the design side of a redesign; that skill owns the measurement on both ends.

## Mode detection (pick one before touching anything)

| Mode | When | What you may change |
|---|---|---|
| **Greenfield** | no live site, or a throwaway prototype | everything (normal SKILL.md flow) |
| **Preserve** | live site with traffic / SEO / brand equity | visual layer only: type, color, spacing, states, components. URLs, structure, copy meaning, SEO baseline stay frozen |
| **Overhaul** | the owner signed off on a full rebuild | structure + visual, but the "never changes silently" list still needs an explicit migration plan |

Default to **Preserve** when unsure. Escalating Preserve to Overhaul is the owner's decision, never an autonomous default.

## The 3-phase workflow

**1. Scan.** Inventory the current site before proposing anything: real URLs and slugs, nav labels, every section and the job it does, the type scale in use, the palette, the component inventory, the interactive states that already exist, analytics and pixel tags, forms and their field `name`s. Screenshot the key pages. Run site-audit for the indexing and performance baseline. You cannot preserve what you never recorded.

**2. Diagnose.** Run the design checklist below category by category. For each problem name a concrete fix (not "make it modern"). Rank by Fix Priority. Separate **visual debt** (safe to change) from **structural** (needs a migration plan).

**3. Fix.** Apply in Fix Priority order, cheapest and highest-impact first. After each layer, confirm nothing on the "never changes silently" list moved. Re-run the countable pre-flight (§14) and the AI-tells audit (§13) on the result.

## Design checklist (problem, then fix, by category)

| Category | Common problem | Fix |
|---|---|---|
| **Typography** | Roboto/Arial/system default; one weight; no scale | catalog pair (§12); real type scale; weight for hierarchy |
| **Color** | generic AI-purple by reflex, muddy grays, warm/cool drift, low contrast | preserve established brand color; fix WCAG contrast (§15) and documented drift; one coherent palette |
| **Layout** | every section is title-left / content-right; symmetric card rows | alternate layout families (§13); enforce the section-variety count (§14) |
| **States** | only default + hover; no focus / empty / loading / error | design all 8 (Rule 5); skeletons matching layout; inline errors |
| **Content** | lorem, generic names, fake numbers, AI copy clichés | real data or omit; humanizer pass (§15) |
| **Components** | raw shadcn defaults; icon-in-a-box; mismatched icon families | customize tokens; flat icons; preserve the established icon family, or use Phosphor for greenfield (§3) |
| **Icons** | mismatched sets / weights; decorative boxes | one set, one weight; Simple Icons for logos (§15) |
| **Code** | `transition:all`; `h-screen`; animated layout props; raw `scroll` listeners | name properties; `min-height:100dvh` only for shells; compositor-first motion with measured exceptions; IntersectionObserver (§7, §10) |

## Fix Priority (risk-vs-effort order)

Cheapest, highest-visual-return first; the riskiest structural work last.

1. **Font swap** (biggest perceived jump for the least risk).
2. **Color / palette** (one accent, fix contrast).
3. **Hover / active states** (tactile feedback, focus-visible).
4. **Layout** (break repetition, add variety, fix spacing).
5. **Components** (replace defaults, remove icon-boxes).
6. **Empty / loading / error states** (where activation and trust leak).
7. **Type scale** (last: it touches every page and can shift line-wrapping site-wide).

## What NEVER changes silently

Changing any of these without an explicit, logged migration plan breaks something outside the viewport:

- **URLs, slugs, anchor IDs.** Inbound links, bookmarks, and deep links die.
- **Nav labels** that double as anchor targets or are indexed.
- **Form field `name` attributes.** Breaks backend handlers, CRM mappings, autofill.
- **Legal copy** (terms, privacy, disclaimers, pricing commitments): reword only with sign-off.
- **Everything in the site-audit baseline** you captured in step 1.

**Losing the indexing baseline is the #1 redesign risk.** A prettier site that drops its `<title>`/H1/canonical, or renames URLs without 301s, loses rankings that took months to earn. If a URL must change, ship a 301 redirect and keep the old sitemap entry mapped. Preserve the H1 intent even while restyling it. The before/after site-audit diff is what proves you did.

## What AI typically forgets in a redesign

- 301 redirects for any changed URL.
- Analytics / pixel / GTM tags (silently removed with the old markup).
- Form field `name`s and the action endpoint.
- Favicon and the OG image.
- The empty / error states that only appear with real data.
- Reduced-motion and focus-visible (new animations added without the gate).
- The 404 / 500 pages (redesigned last, or never).
- The head regressions (title, meta, canonical, sitemap, robots): the after-run of site-audit is what catches these, so do not hand-check them here.
