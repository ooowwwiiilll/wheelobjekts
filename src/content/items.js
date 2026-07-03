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
//
// Order matters for the grid: `gridItems` (items with a thumb) render in the order
// below. Parked/detail-only items go last (order is irrelevant for keyed lookup).
// ─────────────────────────────────────────────────────────────────────────────

export const items = [
  // ── active items (render a thumbnail / plane, in grid order) ──
  { id: "2",  title: "vietinbank efast",     category: "B", image: "/sfast.png",   thumb: { type: "color", value: "#1B6BA5" } },
  { id: "13", title: "kfc",                   category: "B", image: "/skfc.gif",    thumb: { type: "color", value: "#BE2A2A" } },
  { id: "5",  title: "mytelkomsel basic",     category: "B", image: "/smtb.png",    thumb: { type: "color", value: "#3D5A27" } },
  { id: "6",  title: "okuri",                 category: "D", image: "/sokuri.gif",  thumb: { type: "image", src: "/sokuri.gif" } },
  { id: "7",  title: "obed willhem",          category: "none", image: "/wob.gif",  thumb: { type: "image", src: "/wob.gif" } },
  { id: "9",  title: "samosynth",             category: "A", image: "/ssamo.png",   thumb: { type: "color", value: "#3A2B2B" } },
  { id: "8",  title: "thanh uy art gallery",  category: "A", image: "/sthuy.png",   thumb: { type: "color", value: "#8C8C8C" } },
  { id: "10", title: "blooms",                category: "A", image: "/szbloom.png", thumb: { type: "color", value: "#B5B5B5" } },

  // ── parked: detail body exists but no thumbnail yet (add a `thumb` to activate) ──
  { id: "3",  title: "gopay", category: "B", image: "/sgop.png" },
  { id: "4",  title: "kix",   category: "D", image: "/skix.png" },
  { id: "12", title: "ted",   category: "B", image: "/szted.png" },

  // fully parked (title + body also off) — kept for easy revival:
  // { id: "1",  title: "axisnet", category: "none", image: "/saxis.png" },
  // { id: "11", title: "kuttaib", category: "D", image: "/szkutt.png" },
];

// Items that render a thumbnail/plane, in the order declared above.
export const gridItems = items.filter((it) => it.thumb);

// Category for filtering (defaults to "none" = always visible), used by both modes.
export const categoryOf = (id) =>
  items.find((it) => it.id === String(id))?.category ?? "none";
