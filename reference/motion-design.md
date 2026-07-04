# Motion Design

## Duration: The 100/300/500 Rule

Timing has a bigger effect on feel than easing does. These duration ranges work well for most interfaces:

| Duration | Use Case | Examples |
|----------|----------|----------|
| **100-150ms** | Instant feedback | Button press, toggle, color change |
| **200-300ms** | State changes | Menu open, tooltip, hover states |
| **300-500ms** | Layout changes | Accordion, modal, drawer |
| **500-800ms** | Entrance animations | Page load, hero reveals |

**Exits should be quicker than entrances** — aim for roughly 75% of the enter duration.

## Easing: Pick the Right Curve

**Avoid the plain `ease` keyword.** It's a middle-of-the-road compromise that rarely matches the motion you actually want. Use these instead:

| Curve | Use For | CSS |
|-------|---------|-----|
| **ease-out** | Elements entering | `cubic-bezier(0.16, 1, 0.3, 1)` |
| **ease-in** | Elements leaving | `cubic-bezier(0.7, 0, 0.84, 0)` |
| **ease-in-out** | State toggles (there → back) | `cubic-bezier(0.65, 0, 0.35, 1)` |

**Micro-interactions read as more natural with exponential curves**, since they echo real-world physics like friction and deceleration:

```css
/* Quart out - smooth, refined (recommended default) */
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);

/* Quint out - slightly more dramatic */
--ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);

/* Expo out - snappy, confident */
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
```

**Skip bounce and elastic curves.** They had their moment around 2015 but read as dated and gimmicky today. Physical objects decelerate smoothly instead of bouncing when they stop, and overshoot draws the eye to the animation instead of the content it's supporting.

## The Only Two Properties You Should Animate

Stick to **transform** and **opacity** — anything else forces the browser to recalculate layout. When animating height (accordions, for example), animate `grid-template-rows` from `0fr` to `1fr` rather than touching `height` directly.

## Staggered Animations

CSS custom properties make staggering easy to manage: set `style="--i: 0"` on each item and drive the delay with `animation-delay: calc(var(--i, 0) * 50ms)`. **Keep an eye on the total stagger duration** — ten items at 50ms each adds up to 500ms. With larger lists, shrink the per-item delay or cap how many items get staggered.

## Reduced Motion

Treat this as mandatory, not optional. Vestibular disorders affect roughly 35% of adults over 40.

```css
/* Define animations normally */
.card {
  animation: slide-up 500ms ease-out;
}

/* Provide alternative for reduced motion */
@media (prefers-reduced-motion: reduce) {
  .card {
    animation: fade-in 200ms ease-out;  /* Crossfade instead of motion */
  }
}

/* Or disable entirely */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**What should keep working**: functional motion such as progress bars, loading spinners (run them slower), and focus indicators — just strip out the spatial movement, not the function.

## Perceived Performance

**Users don't experience your actual load times — they experience how fast things feel.** A well-managed perception of speed can matter as much as the real numbers.

**The 80ms threshold**: the brain buffers incoming sensory signals for about 80ms before it registers them as simultaneous. Anything that resolves inside that window reads as instant. Aim for it with your micro-interactions.

**Active vs. passive waiting**: watching a spinner do nothing feels slower than being kept engaged. A few ways to tip that balance:

- **Start early**: kick off a transition the moment loading begins (app-style zoom transitions, skeleton screens). It signals that something is already happening.
- **Reveal progressively**: surface content as it becomes available instead of waiting for the whole payload — think buffering video, progressive image decoding, or streamed HTML.
- **Update optimistically**: reflect the change in the UI immediately and reconcile with the server afterward, rolling back gracefully on failure. A "like" button that flips state instantly and syncs later is the classic example. Reserve this for low-stakes actions — never for payments or anything destructive.

**Easing shapes how long something feels**: an ease-in curve that accelerates toward the end makes a task feel shorter, because we weight the final moments of an experience heavily (the peak-end effect). Ease-out suits entrances well, but ease-in near the end of a task compresses how long it feels.

**One caution**: responses that resolve too instantly can undercut perceived value — users sometimes distrust an immediate result for something that should involve real work (search, analysis, etc.). A small, deliberate delay can occasionally signal that genuine processing happened.

## Transition Pattern Catalog

A set of named recipes, one per common interaction, adapted from [transitions.dev](https://github.com/Jakubantalik/transitions.dev). All of them rely only on `transform`/`opacity`/`filter`, default to `--ease-out-quart` unless stated otherwise, and should degrade to a crossfade or no motion at all under reduced-motion. **Write each one as a self-contained snippet, independent of any particular component's size** (motion tokens plus a namespaced class, e.g. `t-*`), so it can be dropped onto any component without needing bespoke markup.

| Interaction | Recipe |
|---|---|
| **Number / stat update** | Old digit flips out (`translateY(-0.4em)` + `blur(4px)` + opacity to 0), new digit flips in from below. Stagger each digit by 30-40ms. Reads as "the data just changed." |
| **Notification badge appear** | Diagonal slide-in (`translate(-4px,4px) → 0`) combined with a spring pop (`scale 0.6→1`, bounce ~0.2). Play once; exit should be quicker than the entrance. |
| **Text state swap** (label/status) | Stack both strings in the same grid cell (`grid-area:1/1`); the old string fades and blurs out (`opacity 1→0`, `blur 0→3px`) while the new one does the reverse. Roughly 250ms. The blur hides any mismatch in string length, and nothing shifts position. |
| **Icon swap** (menu↔close, play↔pause) | Keep both icons mounted in the same grid cell. The entering icon goes `scale 0.25→1, opacity 0→1, blur 4px→0`; the exiting one reverses it. Use `cubic-bezier(0.2,0,0,1)` at roughly 300ms. Never swap the `src` or conditionally mount/unmount — that causes a visible flash. |
| **Menu / dropdown open** | Anchor the animation to its trigger: set `transform-origin` to the trigger's corner and animate `scale 0.95→1` plus opacity. Closing runs at 75% of the open duration. Never start from `scale(0)` — begin at 0.95. |
| **Modal / overlay** | Backdrop fades `opacity 0→1`; the panel does `scale 0.96→1` with opacity and `translateY(8px)→0`. Enter over 300-400ms, exit at roughly 75% of that. |
| **Panel / sidebar reveal** | Expand along one axis using `grid-template-columns 0fr→1fr` (or rows for a vertical reveal), with the content itself animating opacity and `translateX`. Never animate `width` directly. |
| **Page navigation** (SPA) | Going forward: outgoing view does `translateX -100%` while the incoming view slides in from `+100%`; going back reverses both. Drive the direction from a navigation-direction flag. |
| **Success / confirm check** | A multi-stage sequence: fade in, then draw the SVG stroke (`stroke-dashoffset`), then settle with a small vertical bob. This reads as earned rather than instantaneous. |
| **Avatar-group hover** | The hovered avatar springs upward while its neighbors follow with falling-off distance — each one further away moves proportionally less, e.g. `translateY(-6px * 1/(dist+1))`. |
| **Error / invalid input** | A self-reverting shake: `translateX` keyframes of `0, -6, 6, -4, 4, 0` over about 400ms, then back to neutral with no lingering red tint. This is a functional cue, so under reduced-motion fall back to just a static border-color change. |
| **Card resize** | Animate through `transform: scale` plus a FLIP technique, or change grid track sizes — never animate `width`/`height` directly. If the aspect ratio changes, crossfade the content. |

## Performance

Don't set `will-change` ahead of time — apply it only once an animation is about to start (e.g. on `:hover` or via an `.animating` class). For animations triggered by scroll position, use an Intersection Observer rather than scroll event listeners, and stop observing an element once it has animated in. Centralize durations, easings, and common transitions as motion tokens so they stay consistent across the codebase.

---

**Avoid**: animating everything at once (animation fatigue is a real thing); using more than 500ms for ordinary UI feedback; ignoring `prefers-reduced-motion`; and using animation as a way to paper over slow loading.
