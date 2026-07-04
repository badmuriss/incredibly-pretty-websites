# Responsive Design

## Mobile-First: Write It Right

Author your base styles for small screens first, then layer on complexity with `min-width` media queries as the viewport grows. Going desktop-first (`max-width` queries) forces mobile browsers to parse and often download styles they'll never use.

## Breakpoints: Content-Driven

Don't design around specific devices — let the content itself show you where things break. Shrink the viewport from wide to narrow (or vice versa) and add a breakpoint the moment the layout stops working, rather than targeting fixed device widths. Most projects only need three breakpoints (640px, 768px, 1024px). For values that should scale continuously instead of jumping at fixed points, reach for `clamp()`.

## Detect Input Method, Not Just Screen Size

**Viewport width alone won't tell you how the user is interacting with the page.** Touchscreen laptops and keyboard-paired tablets both exist, so check pointer and hover capability directly instead of guessing from screen size:

```css
/* Fine pointer (mouse, trackpad) */
@media (pointer: fine) {
  .button { padding: 8px 16px; }
}

/* Coarse pointer (touch, stylus) */
@media (pointer: coarse) {
  .button { padding: 12px 20px; }  /* Larger touch target */
}

/* Device supports hover */
@media (hover: hover) {
  .card:hover { transform: translateY(-2px); }
}

/* Device doesn't support hover (touch) */
@media (hover: none) {
  .card { /* No hover state - use active instead */ }
}
```

**Important**: never make functionality depend on hover alone — touch users have no way to trigger it.

## Safe Areas: Handle the Notch

Notches, rounded display corners, and home-indicator bars eat into the usable screen on modern phones. Account for them with `env()`:

```css
body {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

/* With fallback */
.footer {
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
}
```

**Turn on `viewport-fit`** in the viewport meta tag so these values are actually populated:
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

## Responsive Images: Get It Right

### srcset with Width Descriptors

```html
<img
  src="hero-800.jpg"
  srcset="
    hero-400.jpg 400w,
    hero-800.jpg 800w,
    hero-1200.jpg 1200w
  "
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="Hero image"
>
```

**What's happening here**:
- `srcset` gives the browser a menu of image files paired with their real pixel widths (the `w` descriptors)
- `sizes` tells the browser how much viewport width the image will actually occupy once rendered
- The browser then combines viewport width and device pixel ratio to pick the most appropriate file from the list

### Picture Element for Art Direction

Use `<picture>` when you need genuinely different crops or compositions per breakpoint, not just different resolutions of the same image:

```html
<picture>
  <source media="(min-width: 768px)" srcset="wide.jpg">
  <source media="(max-width: 767px)" srcset="tall.jpg">
  <img src="fallback.jpg" alt="...">
</picture>
```

## Layout Adaptation Patterns

**Navigation**: plan for three states — a hamburger-triggered drawer on mobile, a compact horizontal bar on tablet, and a full nav with visible labels on desktop. **Tables**: on mobile, reflow rows into stacked cards using `display: block` combined with `data-label` attributes for each cell. **Progressive disclosure**: wrap content that's safe to collapse on small screens in `<details>`/`<summary>`.

## Testing: Don't Trust DevTools Alone

Browser DevTools device emulation is fine for checking layout, but it can't surface:

- How the layout actually behaves under real touch input
- Genuine CPU and memory limitations of low-end hardware
- Real-world network latency
- Differences in font rendering across platforms
- The space taken up by real browser chrome and on-screen keyboards

**Test on real hardware at minimum**: one actual iPhone, one actual Android device, and a tablet if your product needs it. A budget Android phone will expose performance problems that never show up in a simulator.

---

**Avoid**: designing desktop-first. Branching on device detection instead of feature detection. Maintaining separate mobile and desktop codebases. Neglecting tablet sizes and landscape orientation. Assuming every mobile device has plenty of horsepower.
