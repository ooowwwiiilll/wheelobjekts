# Infinite canvas porto — build notes

A second, self-contained version of the portfolio built on the Tympanus
**InfiniteCanvas** technique (edoardolunardi/infinite-canvas, MIT license — a
Three.js / react-three-fiber 3D fly-through). Lives entirely under
`src/infinite/` so it can be deleted in one shot.

## Routes
- `/infinite` — public version
- `/infinite-wip` — gated version (same crypto/wip flow as `/wip`)

## How to delete completely
1. Delete the `src/infinite/` folder.
2. Remove the two `/infinite` lines + the `InfiniteApp` import in `src/main.jsx`.
3. (optional) `npm uninstall three @react-three/fiber @react-three/drei`.

## What was done per request
- **Infinite loop** — kept faithfully (3D chunked grid, camera fly-through,
  drag / scroll / WASD).
- **Top & bottom rows of small text** — not ported (removed).
- **Middle "infinite canvas" text** — replaced with our header (title +
  filter pills) + overlay. Original demo `<Frame>`/`<PageLoader>` not copied.
- **Item count** — fed by our porto items (`items.js`), same ids / placeholder
  colours / categories as the DOM grid. Repeats infinitely.
- **Detail page** — same sidebar markup/CSS as the DOM grid, including the
  commented original copy + "site under construction – TBU" placeholders.
- **Hover + click** — planes are now hoverable (cursor + subtle scale via
  raycast) and clickable (opens the detail sidebar). The reference had neither.
- **Media purging** — carried over verbatim (videos paused + `src` stripped on
  close, restored on re-open).

## Bugs fixed during bring-up (why it showed "nothing" at first)
1. **Circular import** — `constants.js` imported `run` from `utils.js` while
   `utils.js` imported `CHUNK_SIZE` from `constants.js` → "Cannot access 'run'
   before initialization", which crashed the whole page. `run` is now defined
   locally in `constants.js`.
2. **drei `KeyboardControls` removed** — r3f does NOT bridge React context across
   the `<Canvas>` boundary, so `useKeyboardControls()` inside the canvas threw and
   silently killed the scene subtree. WASD nav dropped (drag + scroll remain). Can
   re-add later via a plain window keydown listener if wanted.
3. **ErrorBoundary added** (`ErrorBoundary.jsx`) around the canvas so a future GL
   error degrades gracefully instead of blanking the entire page.

Note: the canvas lives inside `<main>`, so the existing mobile-blocker rule
(`max-width: 650px → display:none`) correctly hides it on small screens. At those
widths r3f's container is 0×0 and the scene won't init until the viewport grows —
expected behaviour, matches the DOM grid.

## Known tuning point
- Planes currently cluster toward one corner on first load (chunk distribution vs.
  initial camera position). Functional but worth centering — flag for revision.

## Filtering
Unselected items fade to ~5% opacity (`scene.jsx`, `targetFilterMul = 0.05`).
A per-plane WebGL blur was tried and reverted — it tanked performance (a 13-tap
blur across every large overdrawn plane) and barely read on small tiles. The
selected filter pill (`.link-bg`) is positioned under the active tab in
`InfiniteApp.jsx`, same as the root site.

## Animated GIFs
GIFs are decoded with the WebCodecs `ImageDecoder` API (`texture-manager.js`,
`getGifTexture`) — every frame is decoded once, downscaled to 192px (planes are
small) and capped at 150 frames to bound memory, then driven on a timer into a
`CanvasTexture`. `tickGifs()` advances all GIFs once per render frame (cost is
O(#gifs), not O(#planes)). Falls back to a static first frame if `ImageDecoder`
is unavailable. Reason for this over a hidden `<img>`: browsers pause GIF
playback for images that aren't actually painted.

## Assumptions / tradeoffs to revise together
1. **No GSAP Flip into the panel.** The DOM grid physically flies the `<img>`
   node into the sidebar. There's no DOM node here (it's a GL plane), so the
   panel just slides in and the thumb shows the item's colour/image. Could be
   approximated by overlaying a DOM tile at the clicked screen position later.
2. **Placeholder items are flat colour planes** (no image), matching the DOM
   grid's grey/colour placeholders. Imaged items: obed (wob.gif) + okuri (sokuri.gif).
3. **Loading counter** uses drei's `useProgress`; GIFs load outside three's
   manager, so it falls back to a 600ms timer.
4. Engine ported TS → JS to match this project (no TS toolchain added).
