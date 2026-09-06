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

// Vertical rhythm inside a block.
const HERO_H = H.lg;
const CAPTION_GAP = 40;   // hero bottom → caption
const CAPTION_H = 46;
const BLURB_GAP = 26;     // caption bottom → description layer
const BLURB_H = 92;       // reserved for the description layer
const BODY_GAP = 64;      // description bottom → first body row
const ROW_GAP = 40;       // between wrapped body rows
const SPINE_GAP = 96;     // last body row bottom → meta spine
const SPINE_ROW_H = 22;
const BLOCK_TAIL = 190;   // air below the spine before the next block

const m = (src, x, y, w, h) => ({ src, x, y, w, h, video: /\.mp4$/.test(src) });

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

const source = [
  {
    id: "13",
    scope: "design system",
    blurb: "a global multi-brand design system overhaul under Yum! brands.",
    hero: "/skfc.gif",
    body: [],
  },
  {
    id: "6",
    scope: "product design · engineering",
    blurb:
      "a digital tear-off calendar inspired by the traditional japanese himekuri, with an over-engineered contemporary spin. swipe to flip a new sheet each day.",
    hero: "/xokuri.mp4",
    body: ["/mokuri1.jpeg", "/xokuri.png", "/sokuri.gif", "/mokuri2.jpeg"],
  },
  {
    id: "10",
    scope: "art direction",
    blurb:
      "an australian retail pharmacy group and certified B Corp, offering health & wellness prescriptions, pharmacist consultations and medication ordering.",
    hero: "/szbloom.jpeg",
    body: ["/szbloom.png"],
  },
  {
    id: "9",
    scope: "art direction · interaction",
    blurb:
      "a mini mpc / sampler celebrating bataknese culture, mixing hip-hop drum samples with processed taganing, kulcapi and gordang one-shots.",
    hero: "/ssamo_dpads.mp4",
    body: [
      "/ssamo_dsimulator.png",
      "/ssamo_dtiles.mp4",
      "/ssamo_ascii.png",
      "/ssamo_dgrid.png",
      "/ssamo.png",
    ],
  },
  {
    id: "12",
    scope: "product design",
    blurb:
      "the B2B unit of telkomsel providing digital solutions and connectivity for corporations — network services, collaboration tools, IoT and CX insights.",
    hero: "/szted.png",
    body: [],
  },
  {
    id: "8",
    scope: "art direction · identity",
    blurb:
      "an edgy printmaking gallery, studio and coffee shop in ha noi, celebrating vietnam's propaganda and renewal period through traditional & contemporary paintings.",
    hero: "/sthuy.png",
    body: [],
  },
  {
    id: "5",
    scope: "product design",
    blurb:
      "a lightweight telkomsel app for users with limited memory or unstable connections — balance monitoring, package shop and payments.",
    hero: "/smtb.png",
    body: [],
  },
  {
    id: "4",
    scope: "swift · wwdc",
    blurb: "a swift playground built for wwdc, featured on wwdc scholars.",
    hero: "/skix.png",
    body: ["/skix_ascii.png"],
  },
  {
    // /26-exclusive placeholder — carries its own meta so nothing is added to the
    // global registry in content/items.js.
    id: "smbci",
    meta: { title: "smbci", region: "indonesia", year: "2026", category: "B" },
    scope: "product design",
    blurb: "placeholder — details to come.",
    hero: null,
    body: [],
  },
];

// ── derive all geometry ─────────────────────────────────────────────────────

export const HERO = { x: 371, y: 0, w: 699, h: HERO_H };

function build(b) {
  // A /26-only entry carries its own meta; everything else reads the shared registry.
  const meta = b.meta ?? itemById(b.id);
  const captionY = HERO_H + CAPTION_GAP;
  const blurbY = captionY + CAPTION_H + BLURB_GAP;
  const bodyY = blurbY + BLURB_H + BODY_GAP;

  const rows = bodyRows(bodyY, b.body);
  const spineY = (rows.h ? bodyY + rows.h : bodyY - BODY_GAP) + SPINE_GAP;
  const spineRows = 4; // region, year, discipline, scope
  const height = spineY + spineRows * SPINE_ROW_H + BLOCK_TAIL;

  return {
    ...b,
    meta,
    category: meta?.category ?? "none",
    heroPlate: b.hero ? m(b.hero, HERO.x, HERO.y, HERO.w, HERO.h) : null,
    plates: rows.plates,
    captionY,
    blurbY,
    spineY,
    height,
  };
}

const CANVAS_TOP = 200;
const CANVAS_BOTTOM = 220;

export const blocks = source.map(build);

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
