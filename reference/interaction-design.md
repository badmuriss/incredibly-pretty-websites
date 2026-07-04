# Interaction Design

## The Eight Interactive States

Every interactive element needs all of these states accounted for:

| State | When | Visual Treatment |
|-------|------|------------------|
| **Default** | At rest | Base styling |
| **Hover** | Pointer over (not touch) | Subtle lift, color shift |
| **Focus** | Keyboard/programmatic focus | Visible ring (see below) |
| **Active** | Being pressed | Pressed in, darker |
| **Disabled** | Not interactive | Reduced opacity, no pointer |
| **Loading** | Processing | Spinner, skeleton |
| **Error** | Invalid state | Red border, icon, message |
| **Success** | Completed | Green check, confirmation |

**A frequent gap**: styling hover and forgetting focus, or the reverse. They are not interchangeable — someone navigating by keyboard will never trigger a hover state.

## Focus Rings: Do Them Right

**Never strip `outline: none` without putting something back in its place.** Doing so is an accessibility violation. Instead, rely on `:focus-visible` so the ring only appears for keyboard interaction:

```css
/* Hide focus ring for mouse/touch */
button:focus {
  outline: none;
}

/* Show focus ring for keyboard */
button:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

**What makes a good focus ring**:
- High contrast (3:1 minimum against adjacent colors)
- 2-3px thick
- Offset from element (not inside it)
- Consistent across all interactive elements

## Form Design: The Non-Obvious

**A placeholder is not a label** — it vanishes the moment someone types. Always pair inputs with a real, visible `<label>`. **Validate when the field loses focus**, not on every keystroke (password-strength meters are the exception). Errors belong **below** the field, tied to it with `aria-describedby`.

## Loading States

**Optimistic updates**: render success right away and roll back only if the request fails. Reserve this for low-stakes interactions (likes, follows) — never for payments or anything destructive. **Skeleton screens beat spinners**: they hint at the shape of the incoming content and feel faster even when the wait time is identical.

## Modals: The Inert Approach

Trapping focus inside a modal used to mean hand-rolled JavaScript. The `inert` attribute does it natively now:

```html
<!-- When modal is open -->
<main inert>
  <!-- Content behind modal can't be focused or clicked -->
</main>
<dialog open>
  <h2>Modal Title</h2>
  <!-- Focus stays inside modal -->
</dialog>
```

Or reach for the native `<dialog>` element directly:

```javascript
const dialog = document.querySelector('dialog');
dialog.showModal();  // Opens with focus trap, closes on Escape
```

## The Popover API

For tooltips, dropdowns, and other non-modal overlays, native popovers are the simplest option:

```html
<button popovertarget="menu">Open menu</button>
<div id="menu" popover>
  <button>Option 1</button>
  <button>Option 2</button>
</div>
```

**What you get for free**: light-dismiss (clicking outside closes it), correct stacking order, no z-index battles, and built-in accessibility.

## Dropdown & Overlay Positioning

A dropdown positioned with `position: absolute` inside a container using `overflow: hidden` or `overflow: auto` gets clipped. This is probably the most common dropdown bug that shows up in generated UI code.

### CSS Anchor Positioning

The modern fix is the CSS Anchor Positioning API, which tethers an overlay to whatever triggered it — no JavaScript required:

```css
.trigger {
  anchor-name: --menu-trigger;
}

.dropdown {
  position: fixed;
  position-anchor: --menu-trigger;
  position-area: block-end span-inline-end;
  margin-top: 4px;
}

/* Flip above if no room below */
@position-try --flip-above {
  position-area: block-start span-inline-end;
  margin-bottom: 4px;
}
```

Since the dropdown uses `position: fixed`, ancestor `overflow` rules can't clip it. The `@position-try` block takes care of viewport-edge flipping automatically. **Browser support**: Chrome 125+, Edge 125+. Firefox and Safari don't support it yet — plan a fallback for those.

### Popover + Anchor Combo

Pairing the Popover API with anchor positioning gets you stacking, light-dismiss, accessibility, and correct placement all at once:

```html
<button popovertarget="menu" class="trigger">Open</button>
<div id="menu" popover class="dropdown">
  <button>Option 1</button>
  <button>Option 2</button>
</div>
```

The `popover` attribute lifts the element into the **top layer**, above everything else regardless of z-index or ancestor overflow. No portal necessary.

### Portal / Teleport Pattern

Inside a component framework, an alternative is rendering the dropdown at the document root and positioning it manually via JavaScript:

- **React**: `createPortal(dropdown, document.body)`
- **Vue**: `<Teleport to="body">`
- **Vanilla JS**: mount the element directly on `document.body`

Get the position from the trigger's `getBoundingClientRect()`, then apply `position: fixed` with the resulting `top`/`left`. Recalculate whenever the page scrolls or resizes.

### Fixed Positioning Fallback

Where anchor positioning isn't supported, `position: fixed` with coordinates computed manually sidesteps overflow clipping the same way:

```css
.dropdown {
  position: fixed;
  /* top/left set via JS from trigger's getBoundingClientRect() */
}
```

Check the viewport edges before placing it: flip above the trigger if it would overflow the bottom, and align to the trigger's right edge if it would overflow the right side.

### Anti-Patterns

- **`position: absolute` inside `overflow: hidden`** — the dropdown gets clipped. Use `position: fixed` or the top layer instead.
- **Arbitrary z-index values** like `z-index: 9999` — define a semantic scale instead: `dropdown (100) -> sticky (200) -> modal-backdrop (300) -> modal (400) -> toast (500) -> tooltip (600)`.
- **Dropdown markup rendered inline** with no way out of the parent's stacking context. Use `popover` (top layer), a portal, or `position: fixed` instead.

## Destructive Actions: Undo > Confirm

**An undo option beats a confirmation dialog** — people click through confirmation prompts without reading them. Remove the item from the UI immediately, show an undo toast, and only commit the deletion once that toast expires. Save actual confirmation dialogs for truly irreversible actions (deleting an account), high-cost actions, or bulk operations.

## Keyboard Navigation Patterns

### Roving Tabindex

For grouped components (tabs, menu items, radio groups), only one item should be tabbable at a time, with arrow keys moving between them:

```html
<div role="tablist">
  <button role="tab" tabindex="0">Tab 1</button>
  <button role="tab" tabindex="-1">Tab 2</button>
  <button role="tab" tabindex="-1">Tab 3</button>
</div>
```

Arrow keys shift `tabindex="0"` from item to item within the group. Tab itself moves focus past the whole component.

### Skip Links

Add a skip link (`<a href="#main-content">Skip to main content</a>`) so keyboard users can bypass navigation entirely. Keep it visually hidden until it receives focus.

## Gesture Discoverability

Gestures like swipe-to-delete aren't discoverable on their own — nothing about the UI hints they exist. Give users a way to find them:

- **Partially reveal**: Show delete button peeking from edge
- **Onboarding**: Coach marks on first use
- **Alternative**: Always provide a visible fallback (menu with "Delete")

Gestures should never be the only way to trigger an action.

---

**Avoid**: Removing focus indicators without alternatives. Using placeholder text as labels. Touch targets <44x44px. Generic error messages. Custom controls without ARIA/keyboard support.
