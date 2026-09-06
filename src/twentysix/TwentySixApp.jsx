// /26 — editorial canvas mode. Self-contained under src/twentysix/ (delete this
// folder + the route in main.jsx to remove). Nothing here affects the root grid,
// /infinite or /verse.
//
// Responsive model, copied from the reference: the 1440px canvas is never reflowed,
// it is uniformly scaled by `vw / 1440` and the wrapper's height scales to match.
// This holds all the way down to phone width — /26 deliberately has no mobile
// blocker, unlike the other routes.
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { CATEGORY_LABEL } from "../content/items.js";
import { CANVAS_W, stackFor } from "./layout.js";
import "./twentysix.css";

const FILTERS = [
  { key: "all", label: "all" },
  { key: "A", label: "visual" },
  { key: "B", label: "product" },
  { key: "D", label: "coded" },
];

function Plate({ plate, index, hero }) {
  const ref = useRef(null);

  // Reveal each plate as it enters the viewport — the canvas is long, and this is
  // the one piece of motion. Falls back to visible when there's no observer.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("--in");
      return;
    }
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

  return (
    <figure
      className={`ts-plate${hero ? " ts-plate--hero" : ""}`}
      ref={ref}
      style={{
        left: plate.x,
        top: plate.y,
        width: plate.w,
        height: plate.h,
        transitionDelay: `${(index % 4) * 70}ms`,
      }}
    >
      {plate.video ? (
        <video src={plate.src} autoPlay loop muted playsInline preload="metadata" />
      ) : (
        <img src={plate.src} alt="" loading="lazy" draggable="false" />
      )}
    </figure>
  );
}

function Block({ block }) {
  const meta = block.meta;
  if (!meta) return null;

  const spine = [
    ["region", meta.region],
    ["year", meta.year],
    ["discipline", CATEGORY_LABEL[meta.category] ?? "self"],
    ["scope", block.scope],
  ].filter(([, v]) => v);

  return (
    <section
      className={`ts-block${block.on ? "" : " --off"}`}
      style={{ transform: `translateY(${block.top}px)`, height: block.height }}
      aria-hidden={block.on ? undefined : true}
    >
      {block.heroPlate ? (
        <Plate plate={block.heroPlate} index={0} hero />
      ) : (
        <div className="ts-plate ts-plate--empty --in" style={{ left: 371, top: 0, width: 699, height: 397 }}>
          <span>placeholder</span>
        </div>
      )}

      <div className="ts-caption" style={{ top: block.captionY }}>
        <p className="ts-caption__title">{meta.title}</p>
        <p className="ts-caption__sub">
          {meta.region} — {meta.year}
        </p>
      </div>

      {/* description layer, between the caption and the body media */}
      <div className="ts-blurb" style={{ top: block.blurbY }}>
        <p>{block.blurb}</p>
      </div>

      {block.plates.map((plate, i) => (
        <Plate key={`${block.id}-${i}`} plate={plate} index={i} />
      ))}

      {/* centred meta spine: labels right-aligned into the canvas axis, values
          left-aligned out of it, both meeting at canvas centre */}
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

  // Re-stack on every filter change: matching blocks close the gap left by the ones
  // being filtered out, so the column never shows holes.
  const stack = useMemo(() => stackFor(filter), [filter]);

  useLayoutEffect(() => {
    const fit = () => {
      const vw = window.innerWidth;
      // Ignore zero-width readings (hidden tab, mid-rotation on some mobile
      // browsers) — scaling by 0 would blank the canvas until the next resize.
      if (!vw) return;
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
      {/* No mobile blocker here on purpose: /26 scales the whole canvas down to
          phone width rather than refusing to render. */}

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
      <div className="ts-viewport" style={{ height: stack.total * scale }}>
        <div
          className="ts-canvas"
          style={{
            width: CANVAS_W,
            height: stack.total,
            transform: `scale(${scale})`,
            marginLeft: offset,
          }}
        >
          {stack.list.map((block) => (
            <Block key={block.id} block={block} />
          ))}
        </div>
      </div>
    </main>
  );
}
