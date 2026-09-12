// ─────────────────────────────────────────────────────────────────────────────
// /works — TUNING FILE. Every number, duration, ease and colour for the route
// lives here and NOWHERE else. Change a value here and both the JS motion and the
// CSS update together: `cssVars()` at the bottom pushes this object out as custom
// properties on .wk-main, so works.css reads var(--wk-*) rather than literals.
//
// Nothing in here is imported by /26, /infinite, /verse or the root grid.
// ─────────────────────────────────────────────────────────────────────────────

// Below this viewport width /works stops entirely and renders the blank white
// mobile section instead. Kept in JS (not just a media query) so the pointer
// listeners and the morph never mount on a touch layout.
export const BREAKPOINT = 860;

// ── PAGE / GRID ─────────────────────────────────────────────────────────────
// The Figma frame's own values, used as CSS px. One margin for BOTH axes, so the
// page's horizontal and vertical padding are the same number.
export const GRID = {
  margin: 40,     // page padding, all four sides
  columns: 12,
  gutter: 20,
};

// Column arithmetic, live against the viewport rather than pinned to a 1440 frame:
// the margins and gutter hold their Figma values and the columns absorb the rest.
export const columnWidth = (vw) =>
  (vw - GRID.margin * 2 - GRID.gutter * (GRID.columns - 1)) / GRID.columns;

export const spanWidth = (vw, cols) =>
  columnWidth(vw) * cols + GRID.gutter * (cols - 1);

export const PAGE = {
  bg: "#f4f4f4",
  text: "#141414",
  rule: "rgba(20, 20, 20, 0.14)",   // hairline under each project row
  muted: "rgba(20, 20, 20, 0.42)",
};

// ── THE LIST ────────────────────────────────────────────────────────────────
// Rows stack from the top margin down. They are NOT distributed to fill the
// height, and the page does not scroll — /works is one fold.
export const LIST = {
  rowH: 62,          // one project row, px
  fontSize: 48,      // project title size, px
  tracking: "0.005em",
};

// ── THE 1×1 CURSOR CHIP ─────────────────────────────────────────────────────
// Anchored off the cursor's BOTTOM-RIGHT: the chip's top-left corner sits at
// (cursor + gap), so the box hangs down-right of the pointer with `gap` of air.
export const CHIP = {
  size: 396,        // 1:1, px
  gap: 18,           // padding between cursor and the chip's corner
  radius: 44,        // squircle-ish mask
  edgePad: 12,       // never let the chip touch a viewport edge
};

// ── THE SIDEBAR THE CHIP MORPHS INTO ────────────────────────────────────────
export const PANEL = {
  columns: 6,        // the PDP spans 6 of the 12 columns…
  inset: 20,         // …but sits 20px off the top, right and bottom bounds
  radius: 44,      // same as CHIP.radius — the box keeps its corner through the morph
  heroH: 300,        // the hero image band at the top of the panel, px
  heroParallax: 0.32,// hero drift per px of panel scroll (0 = pinned, 1 = scrolls)
  padX: 30,
  padY: 30,
  gap: 20,           // between stacked media in the panel body
};

// ── GLASS ───────────────────────────────────────────────────────────────────
// Deliberately restrained: a flat frosted plate with one hairline and one soft
// top highlight. No specular sweep, no refraction, no rim light.
export const GLASS = {
  blur: 26,                                  // backdrop blur, px
  saturate: 1.25,
  tint: "rgba(246, 246, 246, 0.72)",         // plate fill
  border: "rgba(255, 255, 255, 0.55)",       // hairline
  shade: "rgba(20, 20, 20, 0.10)",           // outer edge, keeps it off the bg
  shadow: "0 30px 90px rgba(0, 0, 0, 0.16)",
  highlight: "rgba(255, 255, 255, 0.5)",     // 1px inner top line
};

// ── WHAT SITS UNDER THE PANEL ───────────────────────────────────────────────
export const UNDERLAY = {
  blur: 14,          // the whole page blurs while the panel is open, px
  scale: 1.015,      // and pushes back very slightly
  scrim: "rgba(244, 244, 244, 0.28)",
};

// ── MOTION ─────────────────────────────────────────────────────────────────
// Every animation on the route reads one of these. Milliseconds, whole numbers.
// Paired states share a value on purpose: the box appears and disappears in the
// same time, opens and closes in the same time, and copy leaves the way it came.
export const MOTION = {
  chip: 240,          // the 1×1 box appearing on hover AND leaving
  morph: 560,         // the box opening AND closing, and the page blur behind it
  content: 460,       // copy in AND out — the panel's, and the first-load intro

  // The three below are not durations. They are what makes a stack of lines read
  // as a sequence instead of one block:
  contentDelay: 220,  // copy holds until the box is nearly in place
  stagger: 30,        // gap from one line to the next, so they arrive 1 by 1
  follow: 16,         // % of the gap to the cursor the box closes each frame —
                      // higher tracks tighter, 100 pins it to the pointer

  bounce: 50,         // % overshoot on the box's open. 0 is no bounce
  lift: 22,           // px a line rises as it appears
  blur: 8,            // px a line un-blurs from
  scale: 72,          // % the box scales up from when it appears
};

// Three eases, by role: arriving, leaving, and shapes that must not overshoot.
export const EASE = {
  in: "power3.out",
  out: "power2.in",
  shape: "power3.inOut",
  box: `back.out(${MOTION.bounce / 100})`,
};

// ── TYPE ────────────────────────────────────────────────────────────────────
// The pairing as asked: Exposure in the serif slot, Helvetica Neue reg in the sans.
// `serif` is what the project list and the panel title are set in. `sans` is
// everything else — sub, blurb, facts, close. Season Serif sits behind Exposure
// in the stack, from the question about the face on your device; the .otf is loaded.
export const TYPE = {
  sans: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  serif: "'Exposure', 'Season Serif', Georgia, serif",
};

// ── config → CSS custom properties ──────────────────────────────────────────
// The single bridge between this file and works.css. Add a key here and it is
// immediately available as var(--wk-…) in the stylesheet.
export function cssVars() {
  return {
    "--wk-bg": PAGE.bg,
    "--wk-text": PAGE.text,
    "--wk-rule": PAGE.rule,
    "--wk-muted": PAGE.muted,
    "--wk-pad": `${GRID.margin}px`,
    "--wk-gutter": `${GRID.gutter}px`,

    "--wk-row-h": `${LIST.rowH}px`,
    "--wk-row-size": `${LIST.fontSize}px`,
    "--wk-row-tracking": LIST.tracking,

    "--wk-chip-size": `${CHIP.size}px`,
    "--wk-chip-radius": `${CHIP.radius}px`,

    "--wk-panel-inset": `${PANEL.inset}px`,
    "--wk-panel-radius": `${PANEL.radius}px`,
    "--wk-panel-hero-h": `${PANEL.heroH}px`,
    "--wk-panel-pad-x": `${PANEL.padX}px`,
    "--wk-panel-pad-y": `${PANEL.padY}px`,
    "--wk-panel-gap": `${PANEL.gap}px`,

    "--wk-glass-blur": `${GLASS.blur}px`,
    "--wk-glass-sat": String(GLASS.saturate),
    "--wk-glass-tint": GLASS.tint,
    "--wk-glass-border": GLASS.border,
    "--wk-glass-shade": GLASS.shade,
    "--wk-glass-shadow": GLASS.shadow,
    "--wk-glass-highlight": GLASS.highlight,

    "--wk-scrim": UNDERLAY.scrim,

    "--wk-morph-open": `${MOTION.morph}ms`,
    "--wk-morph-close": `${MOTION.morph}ms`,

    "--wk-serif": TYPE.serif,
    "--wk-sans": TYPE.sans,
  };
}
