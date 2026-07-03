// ─────────────────────────────────────────────────────────────────────────────
// Adapter: feeds the /verse spherical gallery from the shared content registry.
// /verse is the "all imagery revived" mode — every item with a real `image`
// asset shows it here, even ones whose public thumb is still a color placeholder.
// Edit src/content/items.js and this syncs automatically.
// ─────────────────────────────────────────────────────────────────────────────
import { items } from "../content/items.js";

export const verseMedia = [
  ...items
    .filter((it) => it.image)
    .map((it) => ({ id: it.id, title: it.title, src: it.image })),

  // fully parked in the registry, revived visually for the sphere only:
  { id: "1", title: "axisnet", src: "/saxis.png" },
  { id: "11", title: "kuttaib", src: "/szkutt.png" },
];
