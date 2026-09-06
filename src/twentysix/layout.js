// ─────────────────────────────────────────────────────────────────────────────
// /26 — editorial canvas layout.
//
// Everything is authored against a FIXED 1440px-wide design canvas and positioned
// absolutely, exactly like the reference site: no reflow, no breakpoints inside the
// canvas. The whole canvas is uniformly scaled by `vw / CANVAS_W` at render time
// (see TwentySixApp), so a phone gets the identical composition in miniature. The
// page chrome (nav, edge marks) lives OUTSIDE the canvas and never scales.
//
// The three media heights below are the reference's own rhythm, measured off it:
// a large plate, a medium plate, and a small plate at roughly 1 : 0.68 : 0.39.
// Widths are deliberately irregular — that asymmetry is the whole look.
// ─────────────────────────────────────────────────────────────────────────────

export const CANVAS_W = 1440;

export const H = { lg: 397, md: 270, sm: 155 };

// Vertical rhythm inside one project block.
const HERO_Y = 0;
const CAPTION_Y = 437;
const ROW_Y = 536;
const SPINE_GAP = 96; // from the bottom of the last media row to the meta spine

// A media plate. `t` is inferred from the extension unless given.
const m = (src, x, y, w, h) => ({ src, x, y, w, h, video: /\.mp4$/.test(src) });

// Row templates traced from the reference's own three-up rows. Each returns
// plates already positioned on the canvas at the given y.
const rowWide = (y, a, b, c) => [
  m(a, 176, y, 382, H.md),
  m(b, 649, y, 414, H.md),
  m(c, 1070, y, 194, H.md),
];
const rowEven = (y, a, b, c) => [
  m(a, 202, y, 304, H.md),
  m(b, 513, y, 414, H.md),
  m(c, 935, y, 304, H.md),
];
const rowOffset = (y, a, b, c) => [
  m(a, 176, y, 304, H.md),
  m(b, 643, y, 199, H.md),
  m(c, 851, y, 414, H.md),
];
// The reference's signature row: one big plate left, a stacked pair mid, a tall right.
const rowStack = (y, a, b1, b2, c) => [
  m(a, 98, y, 619, H.lg),
  m(b1, 776, y, 207, 153),
  m(b2, 776, y + 162, 207, 108),
  m(c, 1039, y, 303, 396),
];

const hero = (src) => [m(src, 371, HERO_Y, 699, H.lg)];

// ── the blocks ──────────────────────────────────────────────────────────────
// `id` keys back into content/items.js for title, category, region and year, so
// none of that is restated here. Only composition lives in this file.

export const blocks = [
  {
    id: "6",
    scope: "product design · engineering",
    media: [
      ...hero("/xokuri.mp4"),
      ...rowWide(ROW_Y, "/mokuri1.jpeg", "/xokuri.png", "/sokuri.gif"),
    ],
    spineY: ROW_Y + H.md + SPINE_GAP,
    height: 1180,
  },
  {
    id: "9",
    scope: "art direction · interaction",
    media: [
      ...hero("/ssamo_dpads.mp4"),
      ...rowStack(ROW_Y, "/ssamo_dtiles.mp4", "/ssamo.png", "/ssamo_ascii.png", "/ssamo_dsimulator.png"),
      m("/ssamo_dgrid.png", 513, ROW_Y + H.lg + 88, 414, H.md),
    ],
    spineY: ROW_Y + H.lg + 88 + H.md + SPINE_GAP,
    height: 1690,
  },
  {
    id: "13",
    scope: "design system",
    media: [...hero("/skfc.gif")],
    spineY: CAPTION_Y + 128,
    height: 800,
  },
  {
    id: "2",
    scope: "product design",
    media: [
      ...hero("/sfast.png"),
      ...rowEven(ROW_Y, "/sviet.png", "/sfast.png", "/sviet.png"),
    ],
    spineY: ROW_Y + H.md + SPINE_GAP,
    height: 1180,
  },
  {
    id: "10",
    scope: "art direction",
    media: [
      ...hero("/szbloom.jpeg"),
      ...rowOffset(ROW_Y, "/szbloom.png", "/szbloom.jpeg", "/szbloom.png"),
    ],
    spineY: ROW_Y + H.md + SPINE_GAP,
    height: 1180,
  },
  {
    id: "8",
    scope: "art direction · identity",
    media: [...hero("/sthuy.png")],
    spineY: CAPTION_Y + 128,
    height: 800,
  },
  {
    id: "4",
    scope: "swift · wwdc",
    media: [
      ...hero("/skix.png"),
      ...rowWide(ROW_Y, "/skix_ascii.png", "/skix.png", "/skix_ascii.png"),
    ],
    spineY: ROW_Y + H.md + SPINE_GAP,
    height: 1180,
  },
  {
    id: "11",
    scope: "product design · engineering",
    media: [
      ...hero("/szkutt.png"),
      ...rowEven(ROW_Y, "/szkutt_ascii.png", "/szkutt.png", "/szkutt_ascii.png"),
    ],
    spineY: ROW_Y + H.md + SPINE_GAP,
    height: 1180,
  },
  {
    id: "5",
    scope: "product design",
    media: [...hero("/smtb.png")],
    spineY: CAPTION_Y + 128,
    height: 800,
  },
  {
    id: "12",
    scope: "product design",
    media: [...hero("/szted.png")],
    spineY: CAPTION_Y + 128,
    height: 800,
  },
  {
    id: "3",
    scope: "product design",
    media: [...hero("/sgop.png")],
    spineY: CAPTION_Y + 128,
    height: 800,
  },
  {
    id: "1",
    scope: "product design",
    media: [...hero("/saxis.png")],
    spineY: CAPTION_Y + 128,
    height: 860,
  },
];

export const CAPTION = { y: CAPTION_Y };

// Clearance so the first hero starts below the fixed header mark, and air after the
// last block. Both are canvas px, so they scale down with everything else.
const CANVAS_TOP = 200;
const CANVAS_BOTTOM = 220;

// Absolute canvas y for each block, plus the total canvas height.
export const stacked = (() => {
  let y = CANVAS_TOP;
  const out = blocks.map((b) => {
    const at = y;
    y += b.height;
    return { ...b, top: at };
  });
  return { list: out, total: y + CANVAS_BOTTOM };
})();
