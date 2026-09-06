// ─────────────────────────────────────────────────────────────────────────────
// CONTENT LAYER — single source of truth for every portfolio item.
//
// Edit an item here (title / category / thumbnail) and it syncs across ALL public
// presentation modes: the root grid (App.jsx) and /infinite (InfiniteApp.jsx), plus
// any future "design mode". Detail bodies live in ./bodies.jsx (co-located JSX).
//
//   thumb   { type: "image", src } | { type: "color", value }   — omit to park an
//           item (keeps its title + detail body but shows no grid tile / plane)
//   image   the item's REAL thumbnail asset, even while `thumb` is a color
//           placeholder. Used by /verse (which shows all imagery) and handy for
//           reviving a placeholder: thumb: { type: "image", src: image }.
//   category  A visual · B product · C read · D coded · "none" = always visible
//   region/year  short facts shown by /26's meta spine (the root grid + /infinite
//           read the same facts out of the prose in ./bodies.jsx instead)
//
// Order matters for the grid: `gridItems` (items with a thumb) render in the order
// below, filling COLUMN_LAYOUT in App.jsx column by column. Every item is currently
// unparked; drop an item's `thumb` to park it again (title + body survive).
// ─────────────────────────────────────────────────────────────────────────────

export const items = [
  // ── active items (render a thumbnail / plane, in grid order) ──
  { id: "2",  title: "vietinbank efast",     category: "B", region: "vietnam",   year: "2025", image: "/sfast.png",   thumb: { type: "image", src: "/sfast.png" } },
  { id: "13", title: "kfc",                   category: "B", region: "global",    year: "2026", image: "/skfc.gif",    thumb: { type: "image", src: "/skfc.gif" } },
  { id: "5",  title: "mytelkomsel basic",     category: "B", region: "indonesia", year: "2024", image: "/smtb.png",    thumb: { type: "image", src: "/smtb.png" } },
  { id: "6",  title: "okuri",                 category: "D", region: "global",    year: "2025", image: "/sokuri.gif",  thumb: { type: "image", src: "/sokuri.gif" } },
  { id: "7",  title: "obed willhem",          category: "none", region: "",       year: "",     image: "/wob.gif",     thumb: { type: "image", src: "/wob.gif" } },
  { id: "9",  title: "samosynth",             category: "A", region: "global",    year: "2025", image: "/ssamo.png",   thumb: { type: "image", src: "/ssamo.png" } },
  { id: "8",  title: "thanh uy art gallery",  category: "A", region: "vietnam",   year: "2025", image: "/sthuy.png",   thumb: { type: "image", src: "/sthuy.png" } },
  { id: "10", title: "blooms",                category: "A", region: "australia", year: "2025", image: "/szbloom.png", thumb: { type: "image", src: "/szbloom.png" } },
  { id: "3",  title: "gopay",                 category: "B", region: "indonesia", year: "2025", image: "/sgop.png",    thumb: { type: "image", src: "/sgop.png" } },
  { id: "4",  title: "kix",                   category: "D", region: "global",    year: "2023", image: "/skix.png",    thumb: { type: "image", src: "/skix.png" } },
  { id: "12", title: "ted",                   category: "B", region: "indonesia", year: "2024", image: "/szted.png",   thumb: { type: "image", src: "/szted.png" } },
  { id: "1",  title: "axisnet",               category: "none", region: "indonesia", year: "2024", image: "/saxis.png", thumb: { type: "image", src: "/saxis.png" } },
  { id: "11", title: "kuttaib",               category: "D", region: "indonesia", year: "2023", image: "/szkutt.png",  thumb: { type: "image", src: "/szkutt.png" } },
];

// Human-readable labels for the A/B/C/D category codes (used by /26's meta spine).
export const CATEGORY_LABEL = { A: "visual", B: "product", C: "read", D: "coded", none: "self" };

// Keyed lookup for any presentation mode that needs one item's registry entry.
export const itemById = (id) => items.find((it) => it.id === String(id));

// Items that render a thumbnail/plane, in the order declared above.
export const gridItems = items.filter((it) => it.thumb);

// Category for filtering (defaults to "none" = always visible), used by both modes.
export const categoryOf = (id) =>
  items.find((it) => it.id === String(id))?.category ?? "none";
