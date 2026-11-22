// ─────────────────────────────────────────────────────────────────────────────
// /box — every tunable number for the route, in one file. Nothing in box.css or
// BoxApp.jsx hard-codes a value; they read var(--bx-*), written here.
// ─────────────────────────────────────────────────────────────────────────────

// The reference is a 12-column full-bleed grid with a hairline gutter. Cards span
// 4 columns on desktop (3 up), 6 on tablet (2 up), 12 on phone (1 up).
export const GRID = { columns: 12, span: 4, spanTablet: 6, spanPhone: 12, line: 1 };

export const BREAKPOINT = { tablet: 1024, phone: 768 };

export const PAGE = {
  bg: "#ffffff",
  text: "#111111",
  line: "#111111",
  muted: "#8a8a8a",
  accent: "#111111",
};

export const HEAD = { h: 56, pad: 18, logoW: 132, logoH: 26 };

export const CARD = { capPadY: 14, capPadX: 16, gap: 16, zoom: 104 };

export const PDP = { pad: 36, gap: 28, titleSize: 30, bodySize: 15, btnH: 56 };

export const TYPE = {
  sans: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  size: 13,
  tracking: "0.01em",
};

export function cssVars() {
  return {
    "--bx-bg": PAGE.bg,
    "--bx-text": PAGE.text,
    "--bx-line": PAGE.line,
    "--bx-muted": PAGE.muted,
    "--bx-accent": PAGE.accent,

    "--bx-cols": GRID.columns,
    "--bx-span": GRID.span,
    "--bx-span-tablet": GRID.spanTablet,
    "--bx-span-phone": GRID.spanPhone,
    "--bx-hair": `${GRID.line}px`,

    "--bx-head-h": `${HEAD.h}px`,
    "--bx-head-pad": `${HEAD.pad}px`,
    "--bx-logo-w": `${HEAD.logoW}px`,
    "--bx-logo-h": `${HEAD.logoH}px`,

    "--bx-cap-y": `${CARD.capPadY}px`,
    "--bx-cap-x": `${CARD.capPadX}px`,
    "--bx-cap-gap": `${CARD.gap}px`,
    "--bx-zoom": CARD.zoom / 100,

    "--bx-pdp-pad": `${PDP.pad}px`,
    "--bx-pdp-gap": `${PDP.gap}px`,
    "--bx-pdp-title": `${PDP.titleSize}px`,
    "--bx-pdp-body": `${PDP.bodySize}px`,
    "--bx-btn-h": `${PDP.btnH}px`,

    "--bx-sans": TYPE.sans,
    "--bx-size": `${TYPE.size}px`,
    "--bx-tracking": TYPE.tracking,
  };
}
