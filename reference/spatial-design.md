# Spatial Design

## Spacing Systems

### Prefer a 4pt Base Over 8pt

An 8pt scale is too blunt — you'll constantly want something in between, like 12px, that the scale doesn't offer. A 4pt base gives you finer control: 4, 8, 12, 16, 24, 32, 48, 64, 96px.

### Give Tokens Semantic Names

Name spacing tokens after their role (`--space-sm`, `--space-lg`) rather than their raw value (`--spacing-8`). For spacing between siblings, reach for `gap` instead of margin — it sidesteps margin-collapse quirks and the extra cleanup they cause.

## Grid Systems

### The Grid That Adjusts Itself

`repeat(auto-fit, minmax(280px, 1fr))` gives you a responsive grid with zero breakpoints: each column is at least 280px wide, as many fit per row as space allows, and any remaining space is distributed among them. When a layout gets more elaborate, switch to named grid areas (`grid-template-areas`) and redefine them per breakpoint instead.

### Side Gutters: Don't Fear the Edge

Mobile side gutters are **16–24px** (`px-4` to `px-6`), hard cap 24px. Anything bigger reads as timid and wastes the scarcest resource on the page: on a 375px screen, 48px gutters burn 25% of the width and squeeze every headline into a word tower. Generous whitespace on mobile comes from **vertical** rhythm (section padding, gaps) — never from side margins.

Desktop is the opposite: gutters scale up with the viewport (`clamp(1rem, 4vw, 4rem)` on the container is a good default) and the content column is capped by `max-width`, so the breathing room lives *outside* the container, not inside the padding.

## Visual Hierarchy

### The Squint Test

Blur your vision (or blur a screenshot) and check whether you can still tell:
- What the most important element is
- What the second most important element is
- Where the natural groupings are

If everything reads as the same weight once blurred, the hierarchy isn't working.

### Build Hierarchy From Several Dimensions at Once

Size alone isn't enough. Layer multiple signals together:

| Tool | Strong Hierarchy | Weak Hierarchy |
|------|------------------|----------------|
| **Size** | 3:1 ratio or more | <2:1 ratio |
| **Weight** | Bold vs Regular | Medium vs Regular |
| **Color** | High contrast | Similar tones |
| **Position** | Top/left (primary) | Bottom/right |
| **Space** | Surrounded by white space | Crowded |

**The strongest hierarchies stack 2-3 of these at once**: a heading that's bigger, bolder, and has extra breathing room above it beats one relying on size alone.

### Cards Aren't Mandatory

It's easy to reach for a card when spacing and alignment alone would group content just as clearly. Save cards for content that's genuinely a distinct, actionable unit; for items that need side-by-side comparison in a grid; or for content that needs an explicit interactive boundary. **Never put a card inside another card** — inside a card, lean on spacing, type, and subtle dividers instead.

## Container Queries

Viewport queries belong to page-level layout. **Container queries belong to components**:

```css
.card-container {
  container-type: inline-size;
}

.card {
  display: grid;
  gap: var(--space-md);
}

/* Card layout changes based on its container, not viewport */
@container (min-width: 400px) {
  .card {
    grid-template-columns: 120px 1fr;
  }
}
```

**Why it matters**: the same card component stays compact inside a narrow sidebar but expands when placed in a wide content area — automatically, with no viewport-based workarounds.

**Container query units** — inside a container, `cqw`/`cqi` (1% of container width/inline-size) do what `vw` does for the viewport. Use them for text that should scale with its *component*, not the screen — bento card titles, stat numbers, anything reused at different widths:

```css
.card h3 { font-size: clamp(1.125rem, 4cqi, 1.75rem); }  /* scales with the card */
```

A stat card in a 300px bento cell and the same card promoted to a 600px hero slot each get the right size for free. Viewport `vw` can't do this — it sees only the screen.

## Optical Adjustments

Text with `margin-left: 0` reads as visually indented because of the whitespace baked into letterforms — nudge it with a small negative margin (`-0.05em`) to correct for it. The same goes for icons: a geometrically centered icon often looks off; a play icon typically needs a slight shift right, and directional arrows should shift toward the direction they point.

### Touch Target Size vs. Visual Size

An icon button can look small while still needing a large hit area (44px minimum). Achieve this with padding or a pseudo-element rather than inflating the visible icon:

```css
.icon-button {
  width: 24px;  /* Visual size */
  height: 24px;
  position: relative;
}

.icon-button::before {
  content: '';
  position: absolute;
  inset: -10px;  /* Expand tap target to 44px */
}
```

## Depth & Elevation

Build a semantic z-index scale (dropdown → sticky → modal-backdrop → modal → toast → tooltip) rather than picking arbitrary numbers as you go. Do the same for shadows: define a consistent elevation scale (sm → md → lg → xl). **Key idea**: shadows work best when they're barely noticeable — if it's obviously visible, it's probably too heavy.

---

**Avoid**: spacing values that fall outside your defined scale. Making every gap identical (variation is what creates hierarchy in the first place). Relying on size alone for hierarchy — combine size, weight, color, and space instead.
