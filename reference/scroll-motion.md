# Scroll Motion — GSAP ScrollTrigger + Lenis (high-effort builds only)

Recipes for premium scroll-telling — the kind of polish that makes a site feel like it came out of a boutique studio. **Reserve this for projects where cinematic scroll actually fits the brief.** Pinned sections, horizontal scroll-jacking, and scrubbed timelines read as "look what I can do with a library" on a conservative or content-first site — a law firm or B2B services page with a pinned horizontal scroll section is trend-chasing, not craft. Save these techniques for portfolios, product launches, and brand experiences where the scroll itself is part of the story.

**Ground rules before you write a single line:**
- **Isolate GSAP inside a client-only boundary** (see [framework-adapters.md](framework-adapters.md)) — ScrollTrigger must never run during SSR.
- **`prefers-reduced-motion` is a hard gate, not a nice-to-have.** Users who ask for reduced motion get no smooth-scroll and no scrub — render a static or simple-fade fallback instead.
- **Only animate `transform`/`opacity`** (GSAP: `x/y/scale/rotation/opacity`/`autoAlpha`). Never animate layout properties.
- **Cleanup on unmount is mandatory** — a leaked ScrollTrigger instance can lock up scrolling for the whole page.
- GSAP has been fully free since the Webflow acquisition (every plugin, no license token or paid club needed). Install the public `gsap` package as-is.

---

## 1. ScrollTrigger — base config

`start`/`end` follow the pattern `"triggerPosition viewportPosition"`:
- `"top center"` — fires when the trigger's top edge reaches the viewport's center.
- `"bottom 80%"` — fires when the trigger's bottom edge reaches 80% down the viewport.
- A bare number means pixels scrolled. Relative values also work: `"+=300"`, `"+=100%"`, `"max"`.
- v3.12 added `clamp()`: `start: "clamp(top bottom)"` keeps values from overshooting at the page's edges.

`toggleActions: "play reverse play reverse"` maps to `onEnter / onLeave / onEnterBack / onLeaveBack`.

```js
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// simple reveal-on-enter (an alternative to IntersectionObserver, but only worth it for high-effort builds)
gsap.from(".reveal", {
  y: 40, autoAlpha: 0, duration: 0.6, ease: "power3.out",
  scrollTrigger: { trigger: ".reveal", start: "top 85%", toggleActions: "play none none reverse" },
});
```

> For plain reveal/fade effects on everyday pages, don't reach for GSAP at all — use the native IntersectionObserver API instead. Bring in GSAP only once you need pinning, scrubbing, or horizontal movement.

---

## 2. Pin + scrub (the backbone of scroll-telling)

```js
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".panel",
    start: "top top",
    end: "+=2000",      // scroll distance in px that the timeline plays over
    scrub: 1,           // true = tracks the scrollbar 1:1; a number = catch-up delay in seconds (smoother)
    pin: true,          // pins ONLY the trigger element — animate its CHILDREN, never the pinned element itself
    // pinSpacing: true (the default) inserts a spacer so the layout doesn't collapse
  },
});
tl.to(".a", { xPercent: 100 })
  .to(".b", { y: 50 }, "<")   // "<" means "start at the same time as the previous tween"
  .to(".c", { autoAlpha: 0 });
```

- `scrub: true` follows the finger/scrollbar directly; `scrub: 1` adds a second of inertia — smoother, but a touch more expensive.
- **Never combine `scrub` with `toggleActions`** — scrub wins and `toggleActions` becomes a no-op.
- The ScrollTrigger config belongs on the **timeline**, never on a child tween nested inside it.

---

## 3. Fake horizontal scroll (`containerAnimation`) — a high-value technique

Pin a section and slide its panels sideways as the user scrolls vertically:

```js
const track = gsap.utils.toArray(".h-panel");
const sweep = gsap.to(track, {
  xPercent: -100 * (track.length - 1),
  ease: "none",                          // MUST be "none" — anything else desyncs scroll position from panel position
  scrollTrigger: {
    trigger: ".h-wrapper",
    pin: true,
    scrub: 1,
    end: () => "+=" + document.querySelector(".h-track").offsetWidth,
  },
});

// NESTED triggers inside the horizontal sweep reference it via containerAnimation:
gsap.from(".h-panel .title", {
  autoAlpha: 0, y: 30,
  scrollTrigger: { trigger: ".h-panel .title", containerAnimation: sweep, start: "left center" },
});
```

- `ease: "none"` is non-negotiable here.
- Triggers that use `containerAnimation` work in horizontal coordinates (`"left center"`) and **don't support `pin` or snapping**.

---

## 4. Batch reveals

```js
ScrollTrigger.batch(".card", {
  start: "top 85%",
  onEnter: (els) => gsap.from(els, { y: 40, autoAlpha: 0, stagger: 0.08, ease: "power3.out" }),
  // add onLeaveBack to reverse; batchMax/interval to control grouping
});
```

---

## 5. Lenis smooth-scroll ↔ ScrollTrigger

Lenis adds the "weight"/inertia that makes scroll feel physical. It needs to be wired into ScrollTrigger's update loop, or pinned sections start to jitter:

```js
import Lenis from "lenis";

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const lenis = new Lenis({ smooth: !reduce, lerp: 0.1 });   // GATE: no smoothing when reduced-motion is requested

lenis.on("scroll", ScrollTrigger.update);                  // let Lenis drive ScrollTrigger's updates
gsap.ticker.add((t) => lenis.raf(t * 1000));               // one shared RAF loop (Lenis rides GSAP's ticker)
gsap.ticker.lagSmoothing(0);
```

- **Run a single RAF loop.** Never let Lenis run its own `requestAnimationFrame(raf)` alongside GSAP's ticker — two independent loops is a recipe for jank.
- For scroll libraries that need a proxy (e.g. Locomotive Scroll), use `ScrollTrigger.scrollerProxy(el, { scrollTop, getBoundingClientRect, pinType })`, and try `pinType: "transform"` if pins don't stick or `"fixed"` if they jitter. Lenis doesn't need a proxy since it shares the native scroller.
- Call `ScrollTrigger.refresh()` after fonts or images finish loading (window resizes already trigger a refresh, debounced ~200ms).

---

## 6. Cleanup per framework (skip this and scroll breaks on navigation)

**React** — `@gsap/react` handles it for you:
```jsx
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP, ScrollTrigger);

useGSAP(() => {
  gsap.to(".box", { x: 100, scrollTrigger: { trigger: ".box", scrub: true } });
}, { scope: containerRef });   // reverts every tween and ScrollTrigger created inside on unmount
```
Any handler that creates an animation outside the initial setup should be wrapped in `contextSafe()` — otherwise it escapes the context and won't get cleaned up. Without `@gsap/react`: `const ctx = gsap.context(fn, ref); return () => ctx.revert()`.

**Vue:** create the animation inside `onMounted` (guarded so it only runs client-side), then tear it down in `onBeforeUnmount(() => ScrollTrigger.getAll().forEach(t => t.kill()))` plus `lenis.destroy()`.

---

## 7. Performance & accessibility guardrails (non-negotiable)

- `prefers-reduced-motion: reduce` → set `lenis.smooth = false`, swap scrub animations for their static end-state, and keep only opacity/color transitions. Smooth-scroll plus scrub for someone who asked for reduced motion can trigger real vestibular discomfort.
- Animate only `x/y/scale/rotation/opacity`/`autoAlpha` — compositor-friendly properties, never layout.
- Use `gsap.quickTo()` for mouse-follower effects (it reuses one tween instead of creating a new one per event).
- Apply `will-change: transform` only to the element currently animating, and remove it afterward.
- Never ship `markers: true` to production — debug only.
- If pinning collapses the layout, check that `pinSpacing` hasn't been turned off; if it has, reserve the height manually.
- Watch LCP: heavy scroll-telling can delay first paint. Above-the-fold hero content should never depend on GSAP to appear — ship critical content in HTML/CSS first, let GSAP enhance it after hydration.

---

## 8. "Do Not" list (GSAP)

- Putting ScrollTrigger on a child tween nested inside a timeline — it belongs on the timeline.
- Combining `scrub` and `toggleActions` — pick one.
- Using an `ease` other than `"none"` with `containerAnimation` — it desyncs.
- Running two RAF loops (Lenis's own plus GSAP's ticker) — stick to one.
- Running GSAP during SSR — always wrap it in a client-only boundary.
- Shipping `markers: true` to production.
- Reaching for GSAP on a trivial fade/reveal — use IntersectionObserver instead.

---

## 9. Frame-sequence scroll-scrub (Apple-style, canvas)

The "product rotates / scene advances as you scroll" effect (think airpods.apple.com, cinematic hero sections). **Don't scrub a `<video>` element directly** — setting `video.currentTime = scroll` stutters, because the decoder seeks by keyframe rather than delivering smooth frame-by-frame playback. The reliable approach (see the community tutorial `codegenixdev/video-scrolling-tutorial`): **extract the clip into a sequence of still images and draw the current frame to a `<canvas>` based on scroll progress**. Seeking becomes instant, with no decode lag.

**When to use it:** a dedicated scroll-telling section — a product showcase, manifesto, or cinematic "how it works" walkthrough. **Not for the hero** above the fold — it needs a tall section (scroll range) to drive it, so it sits frozen until the user scrolls; a hero wants ambient motion instead, which calls for a **seamless loop** ([media-pipeline.md](media-pipeline.md), `end=start` technique), not scrubbing.

**Asset pipeline (Magnific → frames):**
1. Generate or source the clip (looping doesn't matter here since it's scrubbed, not played back). See [media-pipeline.md](media-pipeline.md) — Magnific's `video_generate` and `stock_search` tools can produce or source the source clip.
2. Extract the frame sequence: `ffmpeg -i clip.mp4 -vf "scale=1280:-2,fps=15" frames/%03d.webp` (frame count = fps × clip duration; aim for roughly 60-90 frames — fewer stutters, more it weighs).
3. Serve the frames from a static public folder (self-hosted, same as loop videos). Rough budget: ~25-45KB per webp × 80 frames ≈ 2-3MB total; preload every frame before enabling the scrub.

**React recipe (`motion` + canvas), the core of the technique:**
```tsx
// client-only: guard with a mount check or your framework's client-only wrapper
const COUNT = 86;
const ref = useRef<HTMLCanvasElement>(null);
const reduce = useReducedMotion();
const { scrollYProgress } = useScroll({ target: ref, offset: ["center end", "start start"] });
const frame = useTransform(scrollYProgress, [0, 1], [1, COUNT]);

const images = useMemo(() => Array.from({ length: COUNT }, (_, i) => {
  const img = new Image(); img.src = `/frames/${String(i + 1).padStart(3, "0")}.webp`; return img;
}, []);
const draw = useCallback((i: number) => {
  const img = images[i - 1];
  if (img?.complete) ref.current?.getContext("2d")?.drawImage(img, 0, 0);
}, [images]);
useMotionValueEvent(frame, "change", (v) => { if (!reduce) draw(Math.round(v)); });
useEffect(() => { draw(1); }, [draw]);   // first frame doubles as the poster
```
- **A tall section provides the scroll range:** the canvas's container needs real height (e.g. `300vh`) with the canvas positioned `sticky` inside it — without that there's no scroll distance to map frames onto. The `offset` option controls where the scrub starts and ends.
- **`prefers-reduced-motion` is a gate here too:** skip the scrub entirely and stay on frame 1 (the poster) — same rule as everywhere else in this file.
- **Size the canvas to match the frames:** its `width`/`height` attributes should match the frame resolution; scale it visually with CSS (`width: 100%`). Preload every frame before revealing the canvas, or it'll render blank.
- **LCP:** frames load after hydration, so the slot should show frame 1 as a static poster in the meantime. Critical content should never depend on the canvas to render.

**Loop vs. scrub — which one to reach for:**
- **Seamless loop** (autoplay, `end=start` frame matching): always-on ambient motion, ideal for a hero, CTA background, or behind-text texture. This should be your default — cheap, just one `<video>` element.
- **Frame-scrub canvas:** scroll-driven narrative in a dedicated, tall section. More assets (a full frame sequence) and more JS to maintain. Reach for it only when the scroll itself is the story being told.
