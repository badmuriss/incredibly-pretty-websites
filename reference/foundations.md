# Shared visual foundations

This file is the authority for repeated limits. Other references link here instead of redefining them.

## Existing systems and taste rules

Preserve the nearest established design system in `CHANGE_SCOPE=local|surface`. Existing tokens, fonts, colors, radii, shadows, components, and icon families outrank this skill's taste defaults. Do not introduce a second icon family or silently replace an established one.

Accessibility, semantic correctness, broken behavior, missing assets, and platform constraints always outrank the incumbent system. Taste tells such as purple, a familiar font, static Lucide, or an eyebrow apply to new choices in `world` scope. Replace them in an existing system only when the user authorizes a redesign or explicitly asks to remove that tell.

## Hero type

- Standard hero maximum: `4.5rem` / 72px.
- Editorial or `SURFACE_MODE=experience` maximum: `6rem` / 96px, only when the direction contract approves the scale and the real copy survives every breakpoint.
- Mobile starts near `2.25rem` / 36px and grows fluidly to the applicable maximum.
- Derive the fluid slope or use a bounded `clamp()`. Never use an unbounded viewport multiplier.
- Reduce size or rewrite before allowing overflow, word towers, or more than two headline lines.

## Viewport height

- Never use `height: 100vh` or Tailwind `h-screen` for a page surface.
- Use `min-height: 100dvh` for full-page app shells, empty states, login shells, and experiences that must fill a short viewport while allowing content growth.
- Use `min-height: 75–90dvh` for desktop marketing heroes and about `70dvh` on mobile. Keep mobile heroes at least 500px tall when that does not force clipping.
- Content-led sections use intrinsic height. Do not make every section viewport-sized.

## Motion properties

- Default to `transform` and `opacity`. They are the safest compositor-friendly materials.
- Permit `filter`, `backdrop-filter`, `clip-path`, `mask`, and shadow when the direction requires them, the effect stays smooth on supported platforms, and reduced motion removes or simplifies it.
- Never animate `top`, `left`, `width`, `height`, or margin for ordinary UI. Use transforms, FLIP, or `grid-template-rows` for disclosure.
- Name every transitioned property. Never use `transition: all`.
- Apply `will-change` only while an allowed expensive effect is imminent or active.

## Eyebrows

Do not add an eyebrow or kicker by default. A real reference, an established system, or the content hierarchy must justify it. When justified:

- use at most one per section;
- cap the page at `ceil(section count / 3)`;
- keep it semantic, short, and subordinate;
- never use it as a floating decorative pill or repeat the heading in it;
- reduce tracking and remove decorative lines on narrow screens.
