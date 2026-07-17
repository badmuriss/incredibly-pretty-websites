# SEO Foundations (build-time)

What you do *while building* so the site is indexable and shareable from day one. Auditing a live site is a different job — run the `site-audit` skill for that.

## Document head — every page, no exceptions

```html
<title>Primary Keyword — Brand</title>              <!-- ≤60 chars, unique per page -->
<meta name="description" content="...">             <!-- 140–160 chars, states the value, not keyword soup -->
<link rel="canonical" href="https://domain.com/path">
<meta name="viewport" content="width=device-width, initial-scale=1">
```

- Title pattern: `{page intent} — {brand}` for inner pages; homepage can invert (`{brand} — {one-line value prop}`).
- One `<title>` and one meta description per route. SPAs/SSG: set per-route, never a global fallback shipped to every page.

## Social cards (OG + Twitter)

```html
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="https://domain.com/og.jpg">  <!-- 1200×630, <300KB, absolute URL -->
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
```

The OG image is a design deliverable, not an afterthought — brand colors, headline legible at thumbnail size. Never ship without one: the link preview IS the first impression in WhatsApp/Slack/X.

## Semantic structure

- Exactly one `<h1>` per page; heading levels never skip (h2 → h4 is a finding).
- Landmarks: `<header>`, `<nav>`, `<main>`, `<footer>` — real elements, not `div.header`.
- Links are `<a href>`, buttons are `<button>`. A `div onClick` that navigates is invisible to crawlers (and keyboards).
- Every `<img>` has `alt` — descriptive for content images, `alt=""` for decorative ones.

## Structured data (schema.org)

JSON-LD in the head, matched to page type:
- Business/landing: `Organization` or `LocalBusiness` (name, url, logo, sameAs socials).
- FAQ section on the page → `FAQPage` (mirrors visible Q&A only — invisible FAQ markup is a penalty risk).
- Articles/posts: `Article` with headline, datePublished, author.

Validate mentally against: does every property reflect something visible on the page?

## Crawlability

- `robots.txt` allowing crawl + pointing to sitemap: `Sitemap: https://domain.com/sitemap.xml`
- `sitemap.xml` generated at build (every framework has a plugin — use it, don't hand-write).
- No content behind JS-only interactions that a crawler can't reach (tabs/accordions are fine — content is in the DOM; infinite-scroll-only content is not).

## Performance is SEO

Core Web Vitals are a ranking factor. The perf guardrails section of the main skill (image sizing, font loading, JS weight) doubles as SEO work — treat LCP ≤ 2.5s as a build requirement, not an optimization for later.

## Copy rules that affect ranking

- URL slugs: short, lowercase, hyphenated, human-readable (`/consultoria-ia`, not `/page?id=7`).
- Internal links use descriptive anchor text — never "click here".
- One page = one search intent. Two intents fighting on one page rank for neither.
