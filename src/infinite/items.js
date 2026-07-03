// ─────────────────────────────────────────────────────────────────────────────
// Adapter: maps the shared content registry (src/content/items.js) into the
// infinite-canvas engine's MediaItem shape ({ id, cat, url|color, width, height }).
// No item data lives here anymore — edit src/content/items.js and it syncs.
// ─────────────────────────────────────────────────────────────────────────────
import { gridItems, categoryOf } from "../content/items.js";

const toMedia = (id, cat, thumb) => ({
  id,
  cat,
  ...(thumb.type === "image" ? { url: thumb.src } : { color: thumb.value }),
  width: 1,
  height: 1,
});

// Public planes — same items/colors/categories as the root grid.
export const baseMedia = gridItems.map((it) => toMedia(it.id, it.category, it.thumb));

// wip items (decrypted at runtime) → planes with their own id/category.
export const wipToMedia = (wipItems) =>
  wipItems.map((it) =>
    toMedia(it.id, categoryOf(it.id), it.img ? { type: "image", src: it.img } : { type: "color", value: "#444444" })
  );
