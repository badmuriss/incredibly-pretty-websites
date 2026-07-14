# Redesign / audit mode: Scan, Diagnose, Fix

For reworking an existing site or app instead of a greenfield build. A redesign still does the research in SKILL.md §0 (study real references, lock a direction): it just **also preserves** what the live site already earns. An ugly site that ranks beats a prettier one that silently broke its URLs and SEO.

## Mode detection (pick one before touching anything)

| Mode | When | What you may change |
|---|---|---|
| **Greenfield** | no live site, or a throwaway prototype | everything (normal SKILL.md flow) |
| **Preserve** | live site with traffic / SEO / brand equity | visual layer only: type, color, spacing, states, components. URLs, structure, copy meaning, SEO baseline stay frozen |
| **Overhaul** | the owner signed off on a full rebuild | structure + visual, but the "never changes silently" list still needs an explicit migration plan |

Default to **Preserve** when unsure. Escalating Preserve to Overhaul is the owner's decision, never an autonomous default.

## The 3-phase workflow

**1. Scan.** Inventory the current site before proposing anything: real URLs and slugs, nav labels, every section and the job it does, the type scale in use, the palette, the component inventory, the interactive states that already exist, the SEO baseline (title / meta / H1 / canonical / sitemap), analytics and pixel tags, forms and their field `name`s. Screenshot the key pages. You cannot preserve what you never recorded.

**2. Diagnose.** Run the audit checklist below category by category. For each problem name a concrete fix (not "make it modern"). Rank by Fix Priority. Separate **visual debt** (safe to change) from **structural / SEO** (needs a migration plan).

**3. Fix.** Apply in Fix Priority order, cheapest and highest-impact first. After each layer, confirm nothing on the "never changes silently" list moved. Re-run the countable pre-flight (§14) and the AI-tells audit (§13) on the result.

## Audit checklist (problem, then fix, by category)

| Category | Common problem | Fix |
|---|---|---|
| **Typography** | Roboto/Arial/system default; one weight; no scale | catalog pair (§12); real type scale; weight for hierarchy |
| **Color** | AI-purple, muddy grays, warm/cool drift, low contrast | one palette project-wide (Rule 2); WCAG AA (§15); one accent |
| **Layout** | every section is title-left / content-right; symmetric card rows | alternate layout families (§13); enforce the section-variety count (§14) |
| **States** | only default + hover; no focus / empty / loading / error | design all 8 (Rule 5); skeletons matching layout; inline errors |
| **Content** | lorem, generic names, fake numbers, AI copy clichés | real data or omit; humanizer pass (§15) |
| **Components** | raw shadcn defaults; icon-in-a-box; static Lucide | customize tokens; flat icons; Phosphor (§3) |
| **Icons** | mismatched sets / weights; decorative boxes | one set, one weight; Simple Icons for logos (§15) |
| **Code** | `transition:all`; `h-screen`; animated layout props; raw `scroll` listeners | name properties; `100dvh`; transform/opacity only; IntersectionObserver (§7, §10) |

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
- **SEO baseline: title, meta description, H1, canonical, sitemap, structured data.**

**SEO migration is the #1 redesign risk.** A prettier site that drops its `<title>`/H1/canonical, or renames URLs without 301s, loses rankings that took months to earn. If a URL must change, ship a 301 redirect and keep the old sitemap entry mapped. Preserve the H1 intent even while restyling it.

## What AI typically forgets in a redesign

- 301 redirects for any changed URL.
- The `<title>` and meta description (regenerated generic, or dropped entirely).
- The canonical tag and the sitemap.
- Analytics / pixel / GTM tags (silently removed with the old markup).
- Form field `name`s and the action endpoint.
- Favicon, OG image, robots directives.
- The empty / error states that only appear with real data.
- Reduced-motion and focus-visible (new animations added without the gate).
- The 404 / 500 pages (redesigned last, or never).
