// ─────────────────────────────────────────────────────────────────────────────
// /26 — editorial canvas layout. EXCLUSIVE to /26; nothing here is used by the
// root grid, /infinite or /verse.
//
// Everything is authored against a FIXED 1440px design canvas and positioned
// absolutely, like the reference site: no reflow, no breakpoints inside the canvas.
// The whole canvas is uniformly scaled by `vw / CANVAS_W` at render time (see
// TwentySixApp), so a phone gets the identical composition in miniature. Page
// chrome lives OUTSIDE the canvas and never scales.
//
// A block is authored as CONTENT ONLY — hero, blurb, and a flat list of body media.
// All geometry (row templates, y positions, block height) is DERIVED below by
// `build()`, so no y value is ever hand-tuned and blocks cannot drift out of sync.
// ─────────────────────────────────────────────────────────────────────────────

import { itemById } from "../content/items.js";

export const CANVAS_W = 1440;

// Plate heights — the reference's own rhythm, roughly 1 : 0.68 : 0.39.
export const H = { lg: 397, md: 270, sm: 155 };

// ── HERO SIZING ─────────────────────────────────────────────────────────────
// The hero keeps ONE width for every project and takes its height from the asset's
// own aspect ratio, so nothing is ever cropped and the column stays aligned.
//
// Measured ratios of the real files (w/h). The census: 1:1 is the most common shape
// in the library (8 of 17), then 4:3 (3), then 3:2 and 16:10 (2 each). Block heights
// have to be known synchronously to stack the canvas, so ratios are recorded here
// rather than read off the decoded image at runtime.
export const HERO_W = 699;

const ASSET_RATIO = {
  "/skfc_web.mp4": 1,
  "/xokuri_web.mp4": 4 / 3,
  "/mokuri1_web.webp": 3 / 2,
  "/mokuri2_web.webp": 3 / 2,
  "/xokuri_web.webp": 3172 / 1481,
  "/sokuri_web.mp4": 1,
  "/szbloom_web.webp": 4 / 3,
  "/ssamo_dpads_web.mp4": 1.6,
  "/ssamo_dtiles_web.mp4": 1.6,
  "/ssamo_dsimulator_web.webp": 4 / 3,
  "/ssamo_dgrid_web.webp": 3472 / 1774,
  "/ssamo_web.webp": 1,
  "/szted_web.webp": 1,
  "/sthuy_web.webp": 1,
  "/smtb_web.webp": 1,
  "/skix_web.webp": 1,
};

// 1 (square) is the safe default: it's the library's dominant shape, so an asset
// added without a measured ratio lands on the most likely one.
export const ratioOf = (src) => ASSET_RATIO[src] ?? 1;

// Vertical rhythm inside a block.
const CAPTION_GAP = 40;   // hero bottom → caption
const CAPTION_H = 46;
const BLURB_GAP = 26;     // caption bottom → description layer
const BLURB_LINE_H = 21;  // one wrapped line of the description layer
const BODY_GAP = 64;      // description bottom → first body row
const ROW_GAP = 40;       // between wrapped body rows
const SPINE_GAP = 96;     // last body row bottom → meta spine
const SPINE_ROW_H = 22;
const BLOCK_TAIL = 190;   // air below the spine before the next block

// Videos stay at preload="none" until they scroll into range, so without a poster
// the plate is an empty box until playback actually starts. Every _web.mp4 has a
// matching _web -> _poster.webp first frame (2–41KB) that paints immediately.
const m = (src, x, y, w, h) => {
  const video = /\.mp4$/.test(src);
  return {
    src, x, y, w, h, video,
    poster: video ? src.replace(/_web\.mp4$/, "_poster.webp") : null,
  };
};

// ── BODY MEDIA RULE ─────────────────────────────────────────────────────────
// The count of body media decides the row template. This is the whole rule:
//
//   1 item    → one wide plate, centred                     (620 × 397)
//   2 items   → two equal plates, centred pair              (460 × 270 each)
//   3 items   → the reference's asymmetric three-up         (382 / 414 / 194 × 270)
//   4+ items  → the reference's stacked editorial row       (619 lg / 207 stacked pair / 303 lg)
//               and any remainder wraps into three-up rows below it
//
// Every template returns plates already positioned, plus the height it consumed.
// ────────────────────────────────────────────────────────────────────────────

const one = (y, [a]) => ({ plates: [m(a, 410, y, 620, H.lg)], h: H.lg });

const two = (y, [a, b]) => ({
  plates: [m(a, 240, y, 460, H.md), m(b, 740, y, 460, H.md)],
  h: H.md,
});

const three = (y, [a, b, c]) => ({
  plates: [
    m(a, 176, y, 382, H.md),
    m(b, 649, y, 414, H.md),
    m(c, 1070, y, 194, H.md),
  ],
  h: H.md,
});

const stack = (y, [a, b1, b2, c]) => ({
  plates: [
    m(a, 98, y, 619, H.lg),
    m(b1, 776, y, 207, 153),
    m(b2, 776, y + 162, 207, 108),
    m(c, 1039, y, 303, 396),
  ],
  h: H.lg,
});

// Fill a three-up row that has gaps (used for a remainder of 1 or 2).
const remainder = (y, srcs) =>
  srcs.length === 1 ? one(y, srcs) : two(y, srcs);

function bodyRows(y, srcs) {
  const plates = [];
  let cursor = y;
  const push = (r) => {
    plates.push(...r.plates);
    cursor += r.h + ROW_GAP;
  };

  if (srcs.length === 0) return { plates, h: 0 };
  if (srcs.length === 1) push(one(cursor, srcs));
  else if (srcs.length === 2) push(two(cursor, srcs));
  else if (srcs.length === 3) push(three(cursor, srcs));
  else {
    push(stack(cursor, srcs.slice(0, 4)));
    let rest = srcs.slice(4);
    while (rest.length >= 3) {
      push(three(cursor, rest.slice(0, 3)));
      rest = rest.slice(3);
    }
    if (rest.length) push(remainder(cursor, rest));
  }

  return { plates, h: cursor - y - ROW_GAP };
}

// ── the blocks: CONTENT ONLY, in the order they appear on the page ───────────
// `id` keys into content/items.js for title / region / year / category. A block may
// carry its own `meta` instead, for entries that exist only on /26.

// `name`, `subtitle`, `discipline` and `cat` are /26-ONLY overrides — they never
// touch content/items.js, so the root grid, /infinite and /verse are unaffected.
// A falsy `subtitle` or `blurb` hides that layer entirely rather than printing empty
// space. `hidden: true` drops the block from the page completely.

const source = [
  {
    id: "13",
    name: "KFC Global",
    subtitle: "nothing beats the original",
    discipline: "design system • digital channel rebrand",
    cat: "B",
    blurb: "a global multi-brand design system overhaul under Yum! brands.",
    hero: "/skfc_web.mp4",
    body: [],
  },
  {
    id: "6",
    name: "OKURI",
    subtitle: "overengineered himekuri calendar",
    discipline: "visual arts • utility",
    cat: "A",
    blurb:
      "a digital tear-off calendar inspired by the traditional japanese himekuri, with an over-engineered contemporary spin. swipe to flip a new sheet each day.",
    hero: "/xokuri_web.mp4",
    body: ["/mokuri1_web.webp", "/xokuri_web.webp", "/sokuri_web.mp4", "/mokuri2_web.webp"],
  },
  {
    id: "10",
    hidden: true,
    name: "Blooms The Chemist",
    subtitle: "",
    discipline: "web development",
    cat: "A",
    blurb:
      "an australian retail pharmacy group and certified B Corp, offering health & wellness prescriptions, pharmacist consultations and medication ordering.",
    hero: "/szbloom_web.webp",
    body: [],
  },
  {
    id: "9",
    hidden: true,
    name: "SAMOSYNTH",
    subtitle: "",
    discipline: "music development app",
    cat: "D",
    blurb:
      "a mini mpc / sampler celebrating bataknese culture, mixing hip-hop drum samples with processed taganing, kulcapi and gordang one-shots.",
    hero: "/ssamo_dpads_web.mp4",
    body: ["/ssamo_dsimulator_web.webp", "/ssamo_dtiles_web.mp4", "/ssamo_dgrid_web.webp", "/ssamo_web.webp"],
  },
  {
    id: "12",
    name: "Telkomsel Enterprise (Ted)",
    subtitle: "",
    discipline: "product design",
    cat: "B",
    blurb:
      "the B2B unit of telkomsel providing digital solutions and connectivity for corporations — network services, collaboration tools, IoT and CX insights.",
    hero: "/szted_web.webp",
    body: [],
  },
  {
    id: "8",
    name: "Thanh Uy",
    subtitle: "art gallery & coffee",
    discipline: "visual arts",
    cat: "A",
    blurb:
      "an edgy printmaking gallery, studio and coffee shop in ha noi, celebrating vietnam's propaganda and renewal period through traditional & contemporary paintings.",
    hero: "/sthuy_web.webp",
    body: [],
  },
  {
    id: "5",
    hidden: true,
    name: "MyTelkomsel Basic",
    subtitle: "",
    discipline: "product design",
    cat: "B",
    blurb:
      "a lightweight telkomsel app for users with limited memory or unstable connections — balance monitoring, package shop and payments.",
    hero: "/smtb_web.webp",
    body: [],
  },
  {
    id: "4",
    name: "KIX",
    subtitle: "interactive hoop shoes finder",
    discipline: "interactive 3D app",
    cat: "D",
    blurb: "a swift playground built for wwdc, featured on wwdc scholars.",
    hero: "/skix_web.webp",
    body: [],
  },
  {
    // /26-exclusive entry — carries its own meta so nothing is added to the global
    // registry. Hidden until the project is confirmed: drop `hidden` to publish it.
    id: "smbci",
    hidden: true,
    meta: { title: "SMBCI", region: "indonesia", year: "2026" },
    name: "SMBCI",
    subtitle: "bersama lebih bermakna",
    discipline: "product design",
    cat: "B",
    blurb: "",
    hero: null,
    body: [],
  },
];

// ── derive all geometry ─────────────────────────────────────────────────────

export const HERO_X = Math.round((CANVAS_W - HERO_W) / 2);

function build(b) {
  // A /26-only entry carries its own meta; everything else reads the shared registry.
  const meta = b.meta ?? itemById(b.id);

  // Universal hero width, height from the asset's own ratio. Everything below the
  // hero shifts with it, which is why captionY is derived rather than constant.
  const heroH = b.hero ? Math.round(HERO_W / ratioOf(b.hero)) : H.lg;

  // Layers collapse when they have no content, so a project with no subtitle or no
  // blurb doesn't leave a hole where that line would have been.
  const captionY = heroH + CAPTION_GAP;
  const captionH = b.subtitle ? CAPTION_H : CAPTION_H - 17;
  const blurbY = captionY + captionH + BLURB_GAP;
  // The description is one absolutely-positioned layer, so its height has to be
  // predicted rather than measured: ~92 characters fit on a 620px line at 13px.
  // Reserving a flat block here is what left a dead band under short blurbs.
  const blurbH = b.blurb ? Math.ceil(b.blurb.length / 92) * BLURB_LINE_H : 0;
  const bodyY = blurbY + blurbH + BODY_GAP;

  const rows = bodyRows(bodyY, b.body);
  const spine = [meta?.region, meta?.year, b.discipline].filter(Boolean);
  // With no body media the spine follows the description directly — no phantom
  // body gap in between.
  const contentBottom = rows.h ? bodyY + rows.h : blurbY + blurbH;
  const spineY = contentBottom + SPINE_GAP;
  const height = spineY + spine.length * SPINE_ROW_H + BLOCK_TAIL;

  return {
    ...b,
    meta,
    category: b.cat ?? meta?.category ?? "none",
    heroPlate: b.hero ? m(b.hero, HERO_X, 0, HERO_W, heroH) : null,
    heroH,
    plates: rows.plates,
    captionY,
    blurbY,
    spineY,
    height,
  };
}

const CANVAS_TOP = 200;
const CANVAS_BOTTOM = 220;

export const blocks = source.filter((b) => !b.hidden).map(build);

// Positions for one filter state. Blocks that don't match are still returned (so
// they can animate out rather than pop) but they consume NO height — the matching
// blocks close the gap, which is why filtering never leaves holes in the column.
// A non-matching block is parked on the seam it would have occupied, so it blurs
// away in place instead of flying across the page.
export function stackFor(filter) {
  let y = CANVAS_TOP;
  const list = blocks.map((b) => {
    const on = filter === "all" || b.category === filter;
    const top = y;
    if (on) y += b.height;
    return { ...b, top, on };
  });
  return { list, total: y + CANVAS_BOTTOM };
}
