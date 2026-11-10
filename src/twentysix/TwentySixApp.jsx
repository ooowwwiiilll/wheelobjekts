// /26 — editorial canvas mode. Self-contained under src/twentysix/ (delete this
// folder + the route in main.jsx to remove). Nothing here affects the root grid,
// /infinite or /verse.
//
// Responsive model, copied from the reference: the 1440px canvas is never reflowed,
// it is uniformly scaled by `vw / 1440` and the wrapper's height scales to match.
// This holds all the way down to phone width — /26 deliberately has no mobile
// blocker, unlike the other routes.
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { itemById } from "../content/items.js";
import { bodies } from "../content/bodies.jsx";
import { MOTION } from "../lib/grid.js";
import { CANVAS_W, HERO_W, HERO_X, stackFor } from "./layout.js";
import "./twentysix.css";

const FILTERS = [
  { key: "all", label: "all" },
  { key: "A", label: "visual" },
  { key: "B", label: "product" },
  { key: "D", label: "coded" },
];

function Plate({ plate, index, hero, priority }) {
  const ref = useRef(null);

  // One observer does two jobs: reveal the plate, and gate video playback.
  //
  // The videos here are large source files, and autoplaying all of them at once
  // meant every one was decoding simultaneously the whole time the page was open,
  // which is the main reason scrolling stuttered. They now stay at preload="none"
  // until they're near the viewport, and pause again once they leave.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const vid = el.querySelector("video");

    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("--in");
      vid?.play().catch(() => { });
      return;
    }

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("--in");
          vid?.play().catch(() => { });
        } else if (vid && !vid.paused) {
          vid.pause();
        }
      },
      { rootMargin: "300px 0px" }
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
        <video
          src={plate.src}
          poster={plate.poster ?? undefined}
          loop
          muted
          playsInline
          preload="none"
        />
      ) : (
        // `priority` is set only on the first visible block's hero — the one that
        // decides LCP. Lazy-loading that image makes the browser defer the single
        // asset the page is judged on, so it loads eagerly at high priority and
        // everything else stays lazy.
        <img
          src={plate.src}
          alt=""
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          draggable="false"
        />
      )}
    </figure>
  );
}

function Block({ block, priority }) {
  const meta = block.meta;
  if (!meta) return null;

  const spine = [
    ["region", meta.region],
    ["year", meta.year],
    ["discipline", block.discipline],
  ].filter(([, v]) => v);

  return (
    <section
      className={`ts-block${block.on ? "" : " --off"}`}
      style={{ transform: `translateY(${block.top}px)`, height: block.height }}
      aria-hidden={block.on ? undefined : true}
    >
      {block.heroPlate ? (
        <Plate plate={block.heroPlate} index={0} hero priority={priority} />
      ) : (
        <div className="ts-plate ts-plate--empty --in" style={{ left: HERO_X, top: 0, width: HERO_W, height: block.heroH }}>
          <span>placeholder</span>
        </div>
      )}

      <div className="ts-caption" style={{ top: block.captionY }}>
        <p className="ts-caption__title">{block.name ?? meta.title}</p>
        {block.subtitle ? <p className="ts-caption__sub">{block.subtitle}</p> : null}
      </div>

      {/* description layer, between the caption and the body media */}
      {block.blurb ? (
        <div className="ts-blurb" style={{ top: block.blurbY }}>
          <p>{block.blurb}</p>
        </div>
      ) : null}

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

// The about panel. Only the "obed willhem" entry uses this for now — project items
// will get the same panel later, which is why the media handling below is written
// generically rather than assuming this body has no video.
const ABOUT_ID = "7";

function AboutPanel({ open, onClose }) {
  const ref = useRef(null);
  const titleRef = useRef(null);
  const bodyRef = useRef(null);
  const thumbRef = useRef(null);
  const splits = useRef([]);
  const mounted = useRef(false);
  const item = itemById(ABOUT_ID);

  // The open/close choreography is the main site's, value for value, read from
  // MOTION.detail in lib/grid.js rather than re-timed by eye:
  //   panel   x slide,            0.78s power3.inOut  (close waits 0.20s first)
  //   title   SplitText chars,    0.72s power3.inOut, 0.26s in, 0.016 stagger
  //   body    SplitText lines,    0.72s power3.inOut, 0.26s in, 0.033 stagger
  //   thumb   blur 30→0 + y 30→0 + scale .95→1, 0.78s power3.out, 0.33s in
  // Both splits use mask:"lines"; the global `.line/.char` rule in style.css parks
  // them at translate3d(0,100%,0), so the tweens animate y back to 0.
  useEffect(() => {
    const panel = ref.current;
    if (!panel) return;
    const M = MOTION.detail;

    if (!open) {
      // Skip the close tween on first mount, or the panel animates on page load.
      if (mounted.current) {
        gsap.to(panel, {
          xPercent: 100,
          duration: M.panelDuration,
          delay: M.closeDelay,
          ease: M.panelEase,
        });
      } else {
        gsap.set(panel, { xPercent: 100 });
        mounted.current = true;
      }
      splits.current.forEach((s) => s.revert());
      splits.current = [];
      return;
    }

    gsap.to(panel, { xPercent: 0, duration: M.panelDuration, ease: M.panelEase });

    splits.current.forEach((s) => s.revert());
    splits.current = [];

    const titleSplit = new SplitText(titleRef.current, {
      type: "lines, chars",
      mask: "lines",
      charsClass: "char",
    });
    const bodySplit = new SplitText(bodyRef.current, {
      type: "lines",
      mask: "lines",
      linesClass: "line",
    });
    splits.current = [titleSplit, bodySplit];

    gsap.to(titleSplit.chars, {
      y: 0,
      duration: M.titleCharDuration,
      delay: M.titleCharDelay,
      ease: M.titleCharEase,
      stagger: M.titleCharStagger,
    });

    gsap.to(bodySplit.lines, {
      y: 0,
      duration: M.textLineDuration,
      delay: M.textLineDelay,
      ease: M.textLineEase,
      stagger: M.textLineStagger,
    });

    if (thumbRef.current) {
      gsap.fromTo(
        thumbRef.current,
        { opacity: 0, y: 30, scale: 0.95, filter: "blur(30px)" },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: M.imgDuration,
          delay: M.imgDelay,
          ease: M.imgEase,
        }
      );
    }
  }, [open]);

  // Media purge, mirroring lib/grid.js: on close, pause every video, stash its src
  // on the element and blank the attribute. That tears down the media session so a
  // closed panel can't keep audio alive or hand a Picture-in-Picture window to the
  // next thing opened. On reopen the stashed src is restored and reloaded.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const videos = el.querySelectorAll("video");
    if (open) {
      videos.forEach((v) => {
        if (v.dataset.originalSrc) v.setAttribute("src", v.dataset.originalSrc);
        v.currentTime = 0;
        v.load();
        v.play().catch(() => { });
      });
    } else {
      videos.forEach((v) => {
        v.pause();
        v.currentTime = 0;
        if (v.src && !v.dataset.originalSrc) {
          v.dataset.originalSrc = v.getAttribute("src");
        }
        v.removeAttribute("src");
        v.load();
      });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      <div
        className={`ts-side__scrim${open ? " --on" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`ts-side${open ? " --on" : ""}`}
        ref={ref}
        aria-hidden={open ? undefined : true}
      >
        <button className="ts-side__close" onClick={onClose}>close</button>
        {item?.image ? (
          <div className="ts-side__thumb" ref={thumbRef}>
            <img src={item.image} alt="" decoding="async" />
          </div>
        ) : null}
        <h2 className="ts-side__title" ref={titleRef}>{item?.title ?? "about"}</h2>
        <div className="ts-side__body" ref={bodyRef}>{bodies[ABOUT_ID]}</div>
      </aside>
    </>
  );
}

export default function TwentySixApp() {
  // scale = vw / 1440, capped at 1 so the canvas centres rather than inflating on
  // wide screens; offset re-centres it once it stops growing.
  const [fitted, setFitted] = useState({ scale: 1, offset: 0 });
  const { scale, offset } = fitted;
  const [filter, setFilter] = useState("all");
  const [aboutOpen, setAboutOpen] = useState(false);
  const navRef = useRef(null);
  const bgRef = useRef(null);

  // Re-stack on every filter change: matching blocks close the gap left by the ones
  // being filtered out, so the column never shows holes.
  const stack = useMemo(() => stackFor(filter), [filter]);

  // Whichever block lands at the top of the current filter owns the LCP image.
  const firstVisibleId = useMemo(() => stack.list.find((b) => b.on)?.id, [stack]);

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

        <button className="ts-about" onClick={() => setAboutOpen(true)}>abouts</button>
      </header>

      <AboutPanel open={aboutOpen} onClose={() => setAboutOpen(false)} />

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
            <Block key={block.id} block={block} priority={block.id === firstVisibleId} />
          ))}
        </div>
      </div>
    </main>
  );
}
