// ─────────────────────────────────────────────────────────────────────────────
// Feed for the infinite canvas. Same porto items / ids / colors / categories as
// the DOM grid (src/App.jsx + src/lib/grid.js catMap), expressed as "media".
//
//   - color planes  → placeholder items (commented thumbnails, see App.jsx)
//   - url planes    → real images (only obed willhem is live for now)
//   - cat           → filter category (A visual / B product / D coded / none=always)
//
// The scene repeats these infinitely (mediaIndex % media.length).
// ─────────────────────────────────────────────────────────────────────────────

// catMap mirror from src/lib/grid.js
//   A: [8, 9, 10]   B: [1, 2, 3, 5, 12, 13]   C: []   D: [4, 6, 11]
const CAT_MAP = {
  A: [8, 9, 10],
  B: [1, 2, 3, 5, 12, 13],
  C: [],
  D: [4, 6, 11],
};

const catOf = (id) =>
  Object.keys(CAT_MAP).find((key) => CAT_MAP[key].includes(Number(id))) || "none";

// Same items + placeholder colors as App.jsx baseItems.
const RAW = [
  // { id: "1",  img: "/saxis.png" },
  { id: "2", color: "#BE2A2A" }, // vietinbank efast   (was /sfast.png)
  { id: "13", color: "#D4C5AD" }, // kfc                (was /skfc.gif)
  // { id: "3",  img: "/sgop.png" },
  // { id: "4",  img: "/skix.png" },
  { id: "5", color: "#3D5A27" }, // mytelkomsel basic  (was /smtb.png)
  { id: "6", img: "/sokuri.gif" }, // okuri — live gif (was color #1B6BA5)
  { id: "7", img: "/wob.gif" }, // obed willhem — kept live
  { id: "9", color: "#3A2B2B" }, // samosynth          (was /ssamo.png)
  { id: "8", color: "#8C8C8C" }, // thanh uy           (was /sthuy.png)
  { id: "10", color: "#B5B5B5" }, // blooms             (was /szbloom.png)
  // { id: "11", img: "/szkutt.png" },
  // { id: "12", img: "/szted.png" },
];

// Map to the engine's MediaItem shape ({ url?, color?, width, height, id, cat }).
export const baseMedia = RAW.map((it) => ({
  id: it.id,
  cat: catOf(it.id),
  ...(it.img ? { url: it.img } : { color: it.color }),
  width: 1,
  height: 1,
}));

// wip items (decrypted at runtime) → square color planes with their own id/cat.
export const wipToMedia = (wipItems) =>
  wipItems.map((it) => ({
    id: it.id,
    cat: catOf(it.id),
    ...(it.img ? { url: it.img } : { color: "#444444" }),
    width: 1,
    height: 1,
  }));
