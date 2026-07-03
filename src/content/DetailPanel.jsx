// Shared detail-panel renderers so the title/body markup lives ONCE and both the
// root grid and /infinite render byte-identical DOM. The .details wrapper and the
// .details__thumb stay per-mode (thumb handling differs: the grid Flips the real
// tile in; /infinite renders from the selected item).
//
// Contract kept intact for SplitText + grid.js + the infinite detail controller:
//   title node  → <p data-title="{id}" data-text>
//   body node   → <p data-desc="{id}" data-text>
import { bodies } from "./bodies.jsx";

// <div className="details__title"> with one <p> per public item + wip item.
export function DetailTitles({ items, wipItems = [] }) {
  return (
    <div className="details__title">
      {items.map((it) => (
        <p key={`title-${it.id}`} data-title={it.id} data-text>{it.title}</p>
      ))}
      {wipItems.map((it) => (
        <p key={`title-${it.id}`} data-title={it.id} data-text>{it.title}</p>
      ))}
    </div>
  );
}

// <div className="details__texts"> with one body <p> per public item + wip item.
// Public bodies come from bodies.jsx; wip bodies are html strings (from the
// encrypted file) rendered via dangerouslySetInnerHTML.
export function DetailTexts({ items, wipItems = [] }) {
  return (
    <div className="details__texts">
      {items.map((it) => (
        <p key={`desc-${it.id}`} data-desc={it.id} data-text>
          {bodies[it.id]}
        </p>
      ))}
      {wipItems.map((it) => (
        <p
          key={`desc-${it.id}`}
          data-desc={it.id}
          data-text
          dangerouslySetInnerHTML={{ __html: it.html }}
        />
      ))}
    </div>
  );
}
