// Route A, step 3b — live-page brand capture.
//
// Ported from github.com/nexu-io/open-design `clipper/brand-capture.js` @ f580271
// (Apache-2.0). Only the extraction half is here: the upstream's 700-line HTML
// report renderer, its i18n bundle and its extension plumbing are dropped, and
// the palette/typography/component pickers are kept close to the original.
//
// Why it exists: `curl` + grep of custom properties (step 3) misses CSS-in-JS
// and any theme resolved at runtime. This reads the rendered page, so what comes
// back is the computed truth.
//
// How to run it: paste the whole file into `mcp__chrome-devtools__evaluate_script`
// as the body of the function, or `page.evaluate()` under Playwright/Puppeteer.
// It takes no arguments, touches nothing, and returns a JSON-serialisable object.
// Node usage for a quick check: see the self-check at the bottom of this file.
//
// What comes back is EVIDENCE, not a stylesheet. Route A's rule still holds:
// you extract decisions, never code.

function odBrandCapture() {
  const MAX_ELEMENTS = 1400;

  const text = (v) => String(v == null ? '' : v).replace(/\s+/g, ' ').trim();

  function parseRgb(value) {
    if (!value || value === 'transparent' || value === 'currentColor') return null;
    const rgba = /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,/\s]+([\d.]+))?\s*\)/i.exec(value);
    if (rgba) {
      const a = rgba[4] === undefined ? 1 : Number(rgba[4]);
      if (!Number.isFinite(a) || a <= 0.04) return null;
      const cl = (n) => Math.max(0, Math.min(255, Math.round(Number(n))));
      return { r: cl(rgba[1]), g: cl(rgba[2]), b: cl(rgba[3]), a };
    }
    const hex = /#([0-9a-f]{3,8})\b/i.exec(value);
    if (!hex) return null;
    let raw = hex[1];
    if (raw.length === 3 || raw.length === 4) raw = raw.split('').map((c) => c + c).join('');
    const r = parseInt(raw.slice(0, 2), 16);
    const g = parseInt(raw.slice(2, 4), 16);
    const b = parseInt(raw.slice(4, 6), 16);
    const a = raw.length >= 8 ? parseInt(raw.slice(6, 8), 16) / 255 : 1;
    if (![r, g, b, a].every(Number.isFinite) || a <= 0.04) return null;
    return { r, g, b, a };
  }

  const hexOf = (c) => {
    const part = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
    return `#${part(c.r)}${part(c.g)}${part(c.b)}`.toUpperCase();
  };

  function luminance(c) {
    const lin = (n) => {
      const v = n / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
  }

  function saturation(c) {
    const max = Math.max(c.r, c.g, c.b);
    const min = Math.min(c.r, c.g, c.b);
    return max === 0 ? 0 : (max - min) / max;
  }

  function mixHex(a, b, t) {
    const ca = parseRgb(a);
    const cb = parseRgb(b);
    if (!ca || !cb) return a || b || '#000000';
    return hexOf({ r: ca.r + (cb.r - ca.r) * t, g: ca.g + (cb.g - ca.g) * t, b: ca.b + (cb.b - ca.b) * t });
  }

  // Two colours closer than 44 in summed channel distance are the same decision.
  function distinctColors(items, limit) {
    const out = [];
    for (const item of items) {
      const c = item.c || parseRgb(item.hex);
      if (!c) continue;
      const tooClose = out.some((e) => Math.abs(c.r - e.c.r) + Math.abs(c.g - e.c.g) + Math.abs(c.b - e.c.b) < 44);
      if (!tooClose) out.push({ ...item, c });
      if (out.length >= limit) break;
    }
    return out;
  }

  const px = (v) => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : null;
  };

  const meta = (name) => {
    const el =
      document.querySelector(`meta[property="og:${name}"]`) ||
      document.querySelector(`meta[name="${name}"]`) ||
      document.querySelector(`meta[name="twitter:${name}"]`);
    return el ? text(el.getAttribute('content')) : '';
  };

  function visibleElements() {
    const out = [];
    const all = document.body ? document.body.getElementsByTagName('*') : [];
    for (let i = 0; i < all.length && out.length < MAX_ELEMENTS; i += 1) {
      const el = all[i];
      let s;
      let r;
      try {
        s = getComputedStyle(el);
        if (s.display === 'none' || s.visibility === 'hidden' || Number(s.opacity) === 0) continue;
        r = el.getBoundingClientRect();
      } catch {
        continue;
      }
      if (r.width <= 0 || r.height <= 0) continue;
      out.push({ el, style: s, rect: r });
    }
    return out;
  }

  // Score every colour the page actually paints: theme-color and the document
  // background/ink weigh most, then :root custom properties, then each visible
  // element weighted by painted area, with controls boosted (a CTA fill is a
  // brand decision, a 900px hero band is a canvas decision).
  function collectPalette(elements) {
    const scores = new Map();
    const add = (raw, score, role) => {
      const c = parseRgb(raw);
      if (!c) return;
      const hex = hexOf(c);
      const prev = scores.get(hex) || { hex, score: 0, roles: new Set(), c };
      prev.score += score;
      if (role) prev.roles.add(role);
      scores.set(hex, prev);
    };

    const bodyEl = document.body || document.documentElement;
    add(meta('theme-color'), 60, 'theme');
    add(getComputedStyle(document.documentElement).backgroundColor, 25, 'background');
    add(getComputedStyle(bodyEl).backgroundColor, 40, 'background');
    add(getComputedStyle(bodyEl).color, 40, 'foreground');

    const root = getComputedStyle(document.documentElement);
    for (let i = 0; i < root.length; i += 1) {
      const prop = root[i];
      if (!prop || !prop.startsWith('--')) continue;
      if (!/(color|bg|background|accent|brand|border|surface|foreground|text)/.test(prop.toLowerCase())) continue;
      add(root.getPropertyValue(prop), 16, prop);
    }

    for (const item of elements) {
      const area = Math.min(40, Math.max(1, (item.rect.width * item.rect.height) / 6000));
      const tag = item.el.tagName.toLowerCase();
      const isControl = /^(a|button|input|select|textarea)$/.test(tag) || item.el.getAttribute('role') === 'button';
      add(item.style.backgroundColor, area + (isControl ? 24 : 0), isControl ? 'component-bg' : 'background');
      add(item.style.color, Math.min(18, text(item.el.textContent).length / 12) + (isControl ? 18 : 2), 'text');
      add(item.style.borderTopColor, isControl ? 10 : 3, 'border');
      // `fill`/`stroke` are inherited SVG properties: every HTML element computes
      // fill to rgb(0,0,0), so reading them off non-SVG nodes injects a phantom
      // black that outranks the real ink. Only ask an SVG node.
      if (item.el.ownerSVGElement || tag === 'svg') {
        add(item.style.fill, 4, 'svg-fill');
        add(item.style.stroke, 4, 'svg-stroke');
      }
    }

    const ranked = [...scores.values()]
      .filter((item) => item.hex !== '#000000' || item.score > 8)
      .sort((a, b) => b.score - a.score);
    return distinctColors(ranked, 12).map((item) => ({
      hex: item.hex,
      score: Math.round(item.score),
      roles: [...item.roles].slice(0, 4),
      luminance: Number(luminance(item.c).toFixed(3)),
      saturation: Number(saturation(item.c).toFixed(3)),
    }));
  }

  // Collapse the ranked palette into the six roles a DESIGN.md actually locks.
  function deriveRoles(palette) {
    const parsed = palette.map((p) => ({ ...p, c: parseRgb(p.hex) })).filter((p) => p.c);
    if (!parsed.length) return { background: '#FFFFFF', foreground: '#111111', accent: null };
    const lum = (p) => luminance(p.c);
    const sat = (p) => saturation(p.c);
    const byLight = [...parsed].sort((a, b) => lum(b) - lum(a));
    const neutrals = [...parsed].filter((p) => sat(p) < 0.16).sort((a, b) => b.score - a.score);
    const colored = parsed
      .filter((p) => sat(p) > 0.2 && lum(p) > 0.05 && lum(p) < 0.93)
      .sort((a, b) => b.score * (0.4 + sat(b)) - a.score * (0.4 + sat(a)));

    const background = byLight[0] && lum(byLight[0]) > 0.55 ? byLight[0].hex : '#FFFFFF';
    const darkest = [...byLight].reverse();
    const foreground = (darkest.find((p) => lum(p) < 0.4) || darkest[0]).hex;
    const surface = (neutrals.find((p) => p.hex !== background && lum(p) > 0.84) || {}).hex || mixHex(background, '#FFFFFF', 0.55);
    const muted = (neutrals.find((p) => lum(p) > 0.22 && lum(p) < 0.62) || {}).hex || mixHex(foreground, background, 0.5);
    const border =
      (neutrals.find((p) => lum(p) > 0.6 && lum(p) < 0.92 && p.hex !== surface && p.hex !== background) || {}).hex ||
      mixHex(background, foreground, 0.12);
    const accent = colored[0] ? colored[0].hex : null;
    const accentSecondary = accent
      ? (colored.find((p) => p.hex !== accent && Math.abs(lum(p) - luminance(parseRgb(accent))) > 0.03) || {}).hex || null
      : null;
    return { background, surface, foreground, muted, border, accent, accentSecondary };
  }

  const firstFamily = (ff) => text(ff).split(',')[0].replace(/["']/g, '').trim() || 'system-ui';

  function fontSpecFor(role, selector) {
    const el = document.querySelector(selector) || document.body || document.documentElement;
    const s = getComputedStyle(el);
    return {
      role,
      family: firstFamily(s.fontFamily),
      stack: s.fontFamily,
      weight: s.fontWeight,
      size: s.fontSize,
      lineHeight: s.lineHeight,
      letterSpacing: s.letterSpacing,
      transform: s.textTransform,
    };
  }

  function collectTypography() {
    const specs = [
      fontSpecFor('display', 'h1, [class*="hero" i], [class*="title" i]'),
      fontSpecFor('body', 'p, body'),
      fontSpecFor('ui', 'button, a, input, select'),
      fontSpecFor('mono', 'code, pre, kbd'),
    ];
    const familyScores = new Map();
    for (const el of Array.from(document.querySelectorAll('body, h1, h2, h3, p, a, button, input, code')).slice(0, 80)) {
      try {
        const f = firstFamily(getComputedStyle(el).fontFamily);
        familyScores.set(f, (familyScores.get(f) || 0) + 1);
      } catch {
        /* element gone */
      }
    }
    // @font-face src names are the only honest signal for self-hosted faces.
    const faces = [];
    for (const sheet of Array.from(document.styleSheets)) {
      let rules;
      try {
        rules = sheet.cssRules;
      } catch {
        continue; // cross-origin sheet, unreadable by design
      }
      for (const rule of Array.from(rules || [])) {
        if (rule.constructor && rule.constructor.name === 'CSSFontFaceRule') {
          faces.push({
            family: text(rule.style.getPropertyValue('font-family')).replace(/["']/g, ''),
            weight: text(rule.style.getPropertyValue('font-weight')) || '400',
            style: text(rule.style.getPropertyValue('font-style')) || 'normal',
          });
        }
      }
      if (faces.length >= 40) break;
    }
    return {
      specs,
      families: [...familyScores.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([family, count]) => ({ family, count })),
      fontFaces: faces.slice(0, 40),
    };
  }

  const isShown = (cs, r) =>
    cs && cs.display !== 'none' && cs.visibility !== 'hidden' && Number(cs.opacity) !== 0 && r && r.width > 0 && r.height > 0;

  function styleProfile(el) {
    if (!el) return null;
    const cs = getComputedStyle(el);
    return {
      background: cs.backgroundColor,
      color: cs.color,
      borderColor: cs.borderTopColor,
      borderWidth: cs.borderTopWidth,
      radius: cs.borderTopLeftRadius,
      padX: cs.paddingLeft,
      padY: cs.paddingTop,
      family: firstFamily(cs.fontFamily),
      weight: cs.fontWeight,
      size: cs.fontSize,
      transform: cs.textTransform,
      letterSpacing: cs.letterSpacing,
      shadow: cs.boxShadow,
      transition: cs.transition,
    };
  }

  // The most representative filled control: solid fill beats saturation beats border.
  function pickButton() {
    const sel =
      'button, a[role="button"], [role="button"], input[type="submit"], .btn, [class*="btn" i], [class*="button" i]';
    let best = null;
    let bestScore = -1;
    for (const el of Array.from(document.querySelectorAll(sel)).slice(0, 160)) {
      let cs;
      let r;
      try {
        cs = getComputedStyle(el);
        r = el.getBoundingClientRect();
      } catch {
        continue;
      }
      if (!isShown(cs, r) || r.width < 40 || r.height < 22 || r.height > 90) continue;
      const bg = parseRgb(cs.backgroundColor);
      const score =
        (bg && bg.a > 0.55 ? 36 : 0) +
        (bg ? saturation(bg) * 24 : 0) +
        (parseRgb(cs.borderTopColor) && (px(cs.borderTopWidth) || 0) > 0 ? 8 : 0) +
        Math.min(18, r.width / 14);
      if (score > bestScore) {
        bestScore = score;
        best = el;
      }
    }
    return best;
  }

  function pickFirstShown(selector) {
    for (const el of Array.from(document.querySelectorAll(selector)).slice(0, 80)) {
      try {
        if (isShown(getComputedStyle(el), el.getBoundingClientRect())) return el;
      } catch {
        /* element gone */
      }
    }
    return null;
  }

  // A card is a bounded block: it must earn a border, a shadow or real rounding.
  function pickCard() {
    const sel = 'article, section, .card, [class*="card" i], [class*="panel" i], [class*="tile" i], li';
    let best = null;
    let bestScore = -1;
    for (const el of Array.from(document.querySelectorAll(sel)).slice(0, 120)) {
      let cs;
      let r;
      try {
        cs = getComputedStyle(el);
        r = el.getBoundingClientRect();
      } catch {
        continue;
      }
      if (!isShown(cs, r) || r.width < 120 || r.height < 60 || r.width > 920) continue;
      const hasBorder = parseRgb(cs.borderTopColor) && (px(cs.borderTopWidth) || 0) > 0 ? 1 : 0;
      const hasShadow = cs.boxShadow && cs.boxShadow !== 'none' ? 1 : 0;
      const radius = px(cs.borderTopLeftRadius) || 0;
      if (!hasBorder && !hasShadow && radius < 4) continue;
      const score = hasShadow * 24 + hasBorder * 16 + Math.min(12, radius) + Math.min(10, px(cs.paddingTop) || 0) / 2;
      if (score > bestScore) {
        bestScore = score;
        best = el;
      }
    }
    return best;
  }

  function collectComponents() {
    return {
      button: styleProfile(pickButton()),
      input: styleProfile(pickFirstShown('input:not([type=hidden]):not([type=submit]):not([type=button]), textarea, select')),
      card: styleProfile(pickCard()),
      nav: styleProfile(pickFirstShown('nav, header')),
    };
  }

  // Posture read off the real components, never invented.
  function derivePosture(components) {
    const c = components.card || {};
    const b = components.button || {};
    const radius = [c.radius, b.radius, (components.input || {}).radius].map(px).find((n) => n != null);
    const shadowed = [c.shadow, b.shadow].some((s) => s && s !== 'none');
    return {
      radius: radius == null ? null : `${Math.round(radius)}px`,
      corners: radius == null ? 'unknown' : radius <= 2 ? 'square' : radius >= 999 ? 'pill' : 'rounded',
      elevation: shadowed ? 'shadowed' : 'flat',
      bordered: [c.borderWidth, b.borderWidth].some((w) => (px(w) || 0) > 0),
    };
  }

  // The transition/easing vocabulary the page really uses, ranked by frequency.
  function collectMotion(elements) {
    const durations = new Map();
    const easings = new Map();
    const bump = (map, key) => {
      if (!key || key === 'none' || key === '0s') return;
      map.set(key, (map.get(key) || 0) + 1);
    };
    for (const item of elements) {
      bump(durations, item.style.transitionDuration);
      bump(easings, item.style.transitionTimingFunction);
    }
    const top = (m) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([value, count]) => ({ value, count }));
    return {
      durations: top(durations),
      easings: top(easings),
      reducedMotionHonored: Array.from(document.styleSheets).some((s) => {
        try {
          return Array.from(s.cssRules || []).some((r) => String(r.conditionText || '').includes('prefers-reduced-motion'));
        } catch {
          return false;
        }
      }),
    };
  }

  // Logo: an <img>/<svg> inside the header whose alt or class echoes the brand name.
  function collectLogos() {
    const norm = (v) => String(v || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    const brand = norm(meta('site_name') || (document.querySelector('h1') || {}).textContent || document.title);
    const out = [];
    for (const el of Array.from(document.querySelectorAll('header img, nav img, [class*="logo" i] img, header svg, nav svg')).slice(0, 20)) {
      const label = norm(`${el.getAttribute('alt') || ''} ${el.getAttribute('class') || ''} ${el.id || ''}`);
      const brandish = brand && brand.split(' ').some((w) => w.length > 2 && label.includes(w));
      out.push({
        tag: el.tagName.toLowerCase(),
        src: el.getAttribute('src') || null,
        alt: text(el.getAttribute('alt')),
        matchesBrandName: Boolean(brandish || /logo|brand|wordmark/.test(label)),
      });
    }
    const icon = document.querySelector('link[rel~="icon"], link[rel~="apple-touch-icon"]');
    return { brandName: brand || null, marks: out, icon: icon ? icon.getAttribute('href') : null };
  }

  const elements = visibleElements();
  const palette = collectPalette(elements);
  const components = collectComponents();
  return {
    url: location.href,
    title: document.title,
    capturedAt: new Date().toISOString(),
    elementsRead: elements.length,
    palette,
    roles: deriveRoles(palette),
    typography: collectTypography(),
    components,
    posture: derivePosture(components),
    motion: collectMotion(elements),
    logos: collectLogos(),
    contentWidth: (() => {
      const main = document.querySelector('main, [role="main"], article') || document.body;
      const w = main ? Math.round(main.getBoundingClientRect().width) : null;
      return { main: w, viewport: window.innerWidth };
    })(),
  };
}

if (typeof module !== 'undefined') module.exports = { odBrandCapture };
