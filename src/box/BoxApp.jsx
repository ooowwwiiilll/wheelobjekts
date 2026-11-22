// ─────────────────────────────────────────────────────────────────────────────
// /box — shop prototype. Self-contained under src/box/ (delete the folder and
// the route line in main.jsx to remove it). Nothing here is imported elsewhere.
//
// Two views behind one route: /box is the collection, /box/<slug> is the PDP.
// Navigation is pushState, so moving between them never reloads the document and
// the grid's images stay decoded underneath.
//
// Every number and colour comes from ./box.config.js.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { products, bySlug, isVideo } from "./box.data.js";
import { GRID, cssVars } from "./box.config.js";
import "./box.css";

const ROOT = "/box";
const slugFromPath = () => {
  const rest = window.location.pathname.slice(ROOT.length).replace(/^\/+|\/+$/g, "");
  return rest || null;
};

const Media = ({ src, alt }) =>
  isVideo(src)
    ? <video src={src} loop muted playsInline autoPlay />
    : <img src={src} alt={alt} loading="lazy" decoding="async" draggable="false" />;

// A row of the grid is never left part-filled: the trailing cells paint the page
// colour so the hairline gutter cannot run on past the last product.
const Fillers = ({ count, span }) => {
  const perRow = Math.floor(GRID.columns / span);
  const empty = (perRow - (count % perRow)) % perRow;
  return Array.from({ length: empty }, (_, i) => (
    <div className="bx-grid__filler" key={`f${i}`} aria-hidden="true" />
  ));
};

function Card({ product, onOpen }) {
  return (
    <article
      className="bx-card"
      onClick={() => onOpen(product.slug)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen(product.slug)}
    >
      <div className="bx-card__media">
        <Media src={product.hero} alt={product.title} />
      </div>
      <div className="bx-card__cap">
        <span className="bx-card__title">{product.title}</span>
        <span className="bx-card__price">{product.priceLabel}</span>
      </div>
    </article>
  );
}

function Collection({ onOpen }) {
  return (
    <section className="bx-grid">
      {products.map((p) => <Card product={p} onOpen={onOpen} key={p.slug} />)}
      <Fillers count={products.length} span={GRID.span} />
    </section>
  );
}

function Product({ product, onOpen, onBack, onAdd }) {
  const [qty, setQty] = useState(1);
  useEffect(() => setQty(1), [product.slug]);

  const others = products.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <>
      <section className="bx-pdp">
        <div className="bx-pdp__shots">
          {product.shots.map((src) => (
            <div className="bx-shot" key={src}>
              <Media src={src} alt={product.title} />
            </div>
          ))}
        </div>

        <div className="bx-pdp__buy">
          <button className="bx-back" onClick={onBack}>← Editions</button>
          <h1 className="bx-pdp__title">{product.title}</h1>

          <div className="bx-pdp__copy">
            {product.blurb.map((line) => <p key={line.slice(0, 24)}>{line}</p>)}
          </div>

          <p className="bx-pdp__price">{product.priceLabel}</p>
          <p className="bx-pdp__tax">Tax applied where applicable.</p>

          <div className="bx-buyrow">
            <div className="bx-qty">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty === 1} aria-label="One fewer">−</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => Math.min(9, q + 1))} aria-label="One more">+</button>
            </div>
            <button className="bx-add" onClick={() => onAdd(qty)}>
              Add to cart <span className="bx-add__arrow" aria-hidden="true">→</span>
            </button>
          </div>

          <details className="bx-fold">
            <summary>Artist</summary>
            <p>{product.artist}</p>
          </details>
          <details className="bx-fold">
            <summary>Edition details</summary>
            <p>{product.details}</p>
          </details>
        </div>
      </section>

      <section className="bx-rail">
        <div className="bx-rail__head">Available editions</div>
        <div className="bx-grid">
          {others.map((p) => <Card product={p} onOpen={onOpen} key={p.slug} />)}
          <Fillers count={others.length} span={GRID.span} />
        </div>
      </section>
    </>
  );
}

export default function BoxApp() {
  const [slug, setSlug] = useState(slugFromPath);
  const [cart, setCart] = useState(0);

  // Back and forward walk the two views rather than leaving the route.
  useEffect(() => {
    const onPop = () => setSlug(slugFromPath());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const go = useCallback((next) => {
    window.history.pushState({}, "", next ? `${ROOT}/${next}` : ROOT);
    setSlug(next);
  }, []);

  // A PDP always opens at its own top, the way a page load would.
  useLayoutEffect(() => { window.scrollTo(0, 0); }, [slug]);

  const product = slug ? bySlug(slug) : null;
  // An unknown slug is not an error page — it falls back to the collection.
  useEffect(() => { if (slug && !product) go(null); }, [slug, product, go]);

  return (
    <main className="bx-main" style={cssVars()}>
      <header className="bx-head">
        <nav className="bx-head__nav">
          <a href={ROOT} onClick={(e) => { e.preventDefault(); go(null); }}>Shop</a>
          <a href={ROOT} onClick={(e) => { e.preventDefault(); go(null); }}>Archive</a>
          <a href={ROOT} onClick={(e) => { e.preventDefault(); go(null); }}>News</a>
          <a href={ROOT} onClick={(e) => { e.preventDefault(); go(null); }}>About</a>
        </nav>
        <button className="bx-head__menu" onClick={() => go(null)}>Menu</button>

        <div className="bx-logo" onClick={() => go(null)}>Obed Willhem</div>

        <div className="bx-head__util">
          <button className="bx-cart bx-head__account">Account</button>
          <button className="bx-cart">Cart ({cart})</button>
        </div>
      </header>

      <div className="bx-body">
        {product
          ? <Product product={product} onOpen={go} onBack={() => go(null)} onAdd={(n) => setCart((c) => c + n)} />
          : <Collection onOpen={go} />}
      </div>
    </main>
  );
}
