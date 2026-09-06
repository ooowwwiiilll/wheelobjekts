// /26 — editorial canvas mode. Self-contained under src/twentysix/ (delete this
// folder + the route in main.jsx to remove). Content comes from the shared content
// layer (src/content/items.js); only composition lives in ./layout.js.
//
// Responsive model, copied from the reference: the 1440px canvas is never reflowed,
// it is uniformly scaled by `vw / 1440` and the wrapper's height is scaled to match.
// Page chrome sits outside the canvas at true viewport pixels and never scales.
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { itemById, CATEGORY_LABEL } from "../content/items.js";
import { CANVAS_W, CAPTION, stacked } from "./layout.js";
import "./twentysix.css";

const FILTERS = [
  { key: "all", label: "all" },
  { key: "A", label: "visual" },
  { key: "B", label: "product" },
  { key: "D", label: "coded" },
];

function Plate({ plate, index }) {
  const ref = useRef(null);

  // Reveal each plate as it enters the viewport — the canvas is long, and this is
  // the reference's one piece of motion. Falls back to visible with no observer.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("--in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const style = {
    left: plate.x,
    top: plate.y,
    width: plate.w,
    height: plate.h,
    transitionDelay: `${(index % 4) * 70}ms`,
  };

  return (
    <figure className="ts-plate" style={style} ref={ref}>
      {plate.video ? (
        <video src={plate.src} autoPlay loop muted playsInline preload="metadata" />
      ) : (
        <img src={plate.src} alt="" loading="lazy" draggable="false" />
      )}
    </figure>
  );
}

function Block({ block, dim }) {
  const item = itemById(block.id);
  if (!item) return null;

  const spine = [
    ["region", item.region],
    ["year", item.year],
    ["discipline", CATEGORY_LABEL[item.category] ?? "self"],
    ["scope", block.scope],
  ].filter(([, v]) => v);

  return (
    <section
      className={`ts-block${dim ? " --dim" : ""}`}
      style={{ top: block.top, height: block.height }}
    >
      {block.media.map((plate, i) => (
        <Plate key={`${block.id}-${i}`} plate={plate} index={i} />
      ))}

      <div className="ts-caption" style={{ top: CAPTION.y }}>
        <p className="ts-caption__title">{item.title}</p>
        <p className="ts-caption__sub">
          {item.region} — {item.year}
        </p>
      </div>

      {/* the reference's centred credit spine: labels right-aligned into the axis,
          values left-aligned out of it, both meeting at canvas centre */}
      <dl className="ts-spine" style={{ top: block.spineY }}>
        {spine.map(([k, v]) => (
          <div className="ts-spine__row" key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default function TwentySixApp() {
  // scale = vw / 1440, capped at 1 so the canvas centres rather than inflating on
  // wide screens; offset re-centres it once it stops growing.
  const [fitted, setFitted] = useState({ scale: 1, offset: 0 });
  const { scale, offset } = fitted;
  const [filter, setFilter] = useState("all");
  const navRef = useRef(null);
  const bgRef = useRef(null);

  useLayoutEffect(() => {
    const fit = () => {
      const vw = window.innerWidth;
      const s = Math.min(vw / CANVAS_W, 1);
      setFitted({ scale: s, offset: Math.max(0, (vw - CANVAS_W * s) / 2) });
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  // Slide the pill behind the active filter (same device as the root grid's frame).
  useLayoutEffect(() => {
    const nav = navRef.current;
    const bg = bgRef.current;
    if (!nav || !bg) return;
    const active = nav.querySelector(".--active");
    if (!active) return;
    bg.style.width = `${active.offsetWidth}px`;
    bg.style.transform = `translateX(${active.offsetLeft}px)`;
  }, [filter, scale]);

  return (
    <main className="ts-main">
      {/* No mobile blocker here on purpose: /26 is meant to scale the whole canvas
          down to phone width rather than refuse to render, unlike the other routes. */}

      {/* ── fixed chrome: true viewport pixels, never scaled ── */}
      <header className="ts-frame">
        <nav className="ts-nav" ref={navRef}>
          <span className="ts-nav__bg" ref={bgRef}></span>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`ts-nav__item${filter === f.key ? " --active" : ""}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </nav>

        <a className="ts-mark" href="/">( 26 )</a>

        <a className="ts-about" href="/">index</a>
      </header>

      <p className="ts-edge">© 2026 obed willhem</p>

      {/* ── the scaled canvas ── */}
      <div className="ts-viewport" style={{ height: stacked.total * scale }}>
        <div
          className="ts-canvas"
          style={{
            width: CANVAS_W,
            height: stacked.total,
            transform: `scale(${scale})`,
            marginLeft: offset,
          }}
        >
          {stacked.list.map((block) => (
            <Block
              key={block.id}
              block={block}
              dim={filter !== "all" && itemById(block.id)?.category !== filter}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
