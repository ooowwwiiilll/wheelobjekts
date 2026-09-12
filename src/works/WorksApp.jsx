// ─────────────────────────────────────────────────────────────────────────────
// /works — morphing-sidebar index. Self-contained under src/works/ (delete this
// folder + the route line in main.jsx to remove it). Nothing here is imported by
// the root grid, /26, /infinite or /verse.
//
// THE WHOLE IDEA IS ONE ELEMENT. `.wk-morph` is the 1×1 chip that trails the
// cursor on hover AND the sidebar it becomes on click — the same box, tweened
// between two rects. There is no cross-fade and no second panel, which is why the
// image never jumps: it is literally the same <img> the whole way through.
//
// Every number, ease and colour below comes from ./works.config.js. Don't hard-code
// values in here — add them there instead, so the route stays tunable from one file.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { projects, isVideo } from "./works.data.js";
import {
  BREAKPOINT, CHIP, PANEL, UNDERLAY, MOTION, EASE, spanWidth, cssVars,
} from "./works.config.js";
import "./works.css";

// The sidebar's rect, in viewport px. Recomputed on open and on resize so the
// panel re-seats itself if the window changes size mid-session.
// 6 of the 12 columns wide, but pinned 20px off the right, top and bottom bounds
// rather than aligned to a column — the panel is an overlay, not a grid child.
const panelRect = () => {
  const w = spanWidth(window.innerWidth, PANEL.columns);
  return {
    x: window.innerWidth - w - PANEL.inset,
    y: PANEL.inset,
    w,
    h: window.innerHeight - PANEL.inset * 2,
  };
};

// The chip's rect for a given pointer position. The box hangs off the cursor's
// BOTTOM-RIGHT — top-left corner at (cursor + gap) — then is clamped so it can
// never be pushed past a viewport edge near the bottom or right of the screen.
const chipRect = (px, py) => {
  const max = (v, limit) => Math.min(v, limit - CHIP.size - CHIP.edgePad);
  return {
    x: max(px + CHIP.gap, window.innerWidth),
    y: max(py + CHIP.gap, window.innerHeight),
    w: CHIP.size,
    h: CHIP.size,
  };
};

// Which row the cursor is over, tested against CACHED rects: this runs every frame,
// and measuring ten elements per frame would force a layout each time. The page does
// not scroll, so the cache only has to be refreshed on resize.
//
// Geometry rather than elementFromPoint, because while the panel is open the scrim
// covers the page and a hit test would always return that instead of a row.
// THE one appearance on this route: a line rises, un-blurs and fades in. The
// panel's copy and the list's first-load intro both play it, so opening a project
// reads as the same gesture the page itself arrived with.
const appearFrom = { y: MOTION.lift, autoAlpha: 0, filter: `blur(${MOTION.blur}px)` };
const appearTo = { y: 0, autoAlpha: 1, filter: "blur(0px)" };

// Every still the route can put in the box, decoded before anything renders.
// Swapping an <img>'s src blanks it for a frame while the new bitmap decodes —
// that is the flash on hover, and it repeats on re-hover because the browser
// caches the FILE, not the decoded image. Holding the decoded Image objects for
// the life of the page is what stops it coming back.
const decoded = [];
const preload = () =>
  Promise.all(
    [...new Set(projects.map((p) => p.hero).filter((src) => src && !isVideo(src)))]
      .map((src) => new Promise((done) => {
        const img = new Image();
        decoded.push(img);
        const settle = () => (img.decode ? img.decode().then(done, done) : done());
        img.onload = settle;
        img.onerror = done;
        img.src = src;
        if (img.complete) settle();
      })),
  );

const rowUnderPointer = (rects, { x, y }) => {
  for (const r of rects) {
    if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return r.id;
  }
  return null;
};

export default function WorksApp() {
  const [mobile, setMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < BREAKPOINT
  );
  // `active` is the project in the chip AND the one in the panel — the chip is the
  // panel, so they can't be two different pieces of state.
  const [active, setActive] = useState(null);
  const [open, setOpen] = useState(false);

  const pageRef = useRef(null);
  const scrimRef = useRef(null);
  const morphRef = useRef(null);
  const mediaRef = useRef(null);
  const scrollRef = useRef(null);

  const pointer = useRef({ x: 0, y: 0 });   // last real cursor position
  const chipPos = useRef({ x: 0, y: 0 });   // the follow loop's own x/y
  const rowRects = useRef([]);              // cached row geometry for the hit test
  const hoverId = useRef(null);             // project the cursor is over, or null
  const shown = useRef(false);              // is the chip currently raised?
  const openRef = useRef(false);            // open state readable from listeners
  const tl = useRef(null);                  // the one live morph timeline
  const landOn = useRef(null);              // project the chip holds after a close
  // The cursor follower and the morph both drive x/y. This flag hands ownership to
  // exactly one of them: without it, the follower fights the collapse tween all the
  // way through a close and the box never lands where it should.
  const chipFree = useRef(true);
  // Has the panel ever been opened? A ref, NOT a class on the morph: React owns
  // that element's className, so it wipes any marker added to it on the very
  // re-render that closes the panel — before this effect can read it.
  const hasOpened = useRef(false);

  // Nothing renders until every hero is decoded — see `preload` above.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let live = true;
    preload().then(() => live && setReady(true));
    return () => { live = false; };
  }, []);

  const reduced = useRef(false);
  useEffect(() => {
    reduced.current =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  }, []);
  const dur = (ms) => (reduced.current ? 0.01 : ms / 1000);

  // ── breakpoint ────────────────────────────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${BREAKPOINT - 1}px)`);
    const on = () => setMobile(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // ── the chip's resting state ──────────────────────────────────────────────
  useLayoutEffect(() => {
    if (mobile || !ready) return;
    const el = morphRef.current;
    if (!el) return;
    gsap.set(el, {
      x: -9999, y: -9999,
      width: CHIP.size, height: CHIP.size,
      borderRadius: CHIP.radius,
      autoAlpha: 0, scale: MOTION.scale / 100,
    });
    gsap.set(mediaRef.current, { height: CHIP.size, y: 0 });
  }, [mobile, ready]);

  // ── the follow loop ───────────────────────────────────────────────────────
  // This one loop owns the chip's whole resting behaviour: which project it holds,
  // whether it is on screen at all, and where it is. Hover is DERIVED from the
  // pointer every frame rather than driven by pointerenter/pointerleave handlers.
  // That is the fix for the box lingering: a leave that never fires, or that fires
  // out of order between two adjacent rows, cannot desync state that is recomputed
  // from scratch on every frame.
  //
  // It is a plain rAF lerp, NOT a GSAP tween: each morph calls killTweensOf on this
  // element to take sole ownership of it, which kills anything tweening x/y. A loop
  // owning its own position cannot be killed by accident, and it yields x/y and
  // visibility to the morph via `chipFree`.
  useLayoutEffect(() => {
    if (mobile || !ready) return;
    const el = morphRef.current;
    if (!el) return;

    let raf = 0;
    let last = performance.now();

    const step = (now) => {
      raf = requestAnimationFrame(step);
      // Clamp the delta so a backgrounded tab doesn't snap the chip on return.
      const dt = Math.min(now - last, 100);
      last = now;
      if (!chipFree.current) return;

      const target = chipRect(pointer.current.x, pointer.current.y);
      const id = rowUnderPointer(rowRects.current, pointer.current);

      if (id !== hoverId.current) {
        hoverId.current = id;
        if (id) {
          const project = projects.find((p) => p.id === id);
          if (project) setActive(project);
          // Arriving from nowhere, the chip starts AT the cursor instead of
          // flying in from wherever it was last parked.
          if (!shown.current) chipPos.current = { x: target.x, y: target.y };
          shown.current = true;
          gsap.to(el, {
            autoAlpha: 1, scale: 1,
            duration: dur(MOTION.chip), ease: EASE.in,
          });
        } else {
          // Off the list: scale down and go.
          shown.current = false;
          gsap.to(el, {
            autoAlpha: 0, scale: MOTION.scale / 100,
            duration: dur(MOTION.chip), ease: EASE.out,
          });
        }
      }

      // Exponential smoothing, corrected for the real frame time so the trail
      // feels identical at 60, 120 or 144Hz.
      const k = 1 - Math.pow(1 - MOTION.follow / 100, dt / 16.6667);
      chipPos.current.x += (target.x - chipPos.current.x) * k;
      chipPos.current.y += (target.y - chipPos.current.y) * k;
      gsap.set(el, { x: chipPos.current.x, y: chipPos.current.y, force3D: true });
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [mobile, ready]);

  // Row geometry for the hit test above, cached because it is read every frame and
  // measuring ten elements per frame would force a layout each time. /works is one
  // fold and does not scroll, so only a resize can invalidate it.
  useLayoutEffect(() => {
    if (mobile || !ready) return;
    const measure = () => {
      rowRects.current = [...document.querySelectorAll(".wk-row__hit")].map((el) => {
        const b = el.getBoundingClientRect();
        return { id: el.dataset.id, left: b.left, top: b.top, right: b.right, bottom: b.bottom };
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [mobile, ready]);

  // ── the page arriving ─────────────────────────────────────────────────────
  // Same appearance as the panel's copy, played down the list once the heroes are
  // decoded and the rows are laid out: each one rises, un-blurs and fades in, one
  // after the next from the top.
  useLayoutEffect(() => {
    if (mobile || !ready) return;
    const rows = document.querySelectorAll(".wk-row");
    if (!rows.length) return;
    const t = gsap.fromTo(rows, appearFrom, {
      ...appearTo, ease: EASE.in,
      duration: dur(MOTION.content), stagger: dur(MOTION.stagger),
    });
    return () => t.kill();
  }, [mobile, ready]);

  const trackPointer = useCallback((e) => {
    pointer.current = { x: e.clientX, y: e.clientY };
  }, []);

  // ── open: chip → sidebar ──────────────────────────────────────────────────
  const openPanel = useCallback((project) => {
    if (openRef.current) return;
    openRef.current = true;
    chipFree.current = false;
    hasOpened.current = true;
    setActive(project);
    setOpen(true);
  }, []);

  // Closing has two endings, decided by where the cursor is at that moment:
  // over a project row, the sidebar morphs back into the live hover chip and STAYS
  // (picking up that row's hero); anywhere else, it morphs back to the box and then
  // scales down and goes.
  const closePanel = useCallback(() => {
    if (!openRef.current) return;
    openRef.current = false;
    const id = rowUnderPointer(rowRects.current, pointer.current);
    landOn.current = id ? projects.find((p) => p.id === id) ?? null : null;
    setOpen(false);
  }, []);

  // The morph itself. Runs off `open` so React has already rendered the panel copy
  // by the time the timeline reaches the reveal step.
  useLayoutEffect(() => {
    if (mobile || !ready) return;
    const el = morphRef.current;
    const media = mediaRef.current;
    if (!el || !media) return;

    // Take sole ownership of the box. The chip's fade tween and the cursor
    // follow loop both drive properties this timeline is about to drive,
    // and GSAP does not overwrite by default — left alive they fight the morph.
    tl.current?.kill();
    // Taking sole ownership of the box, and declaring the layout properties it is
    // about to animate. BOTH are per-morph: a permanent will-change on width/height
    // keeps the box off its own compositor layer, and killTweensOf must not fire on
    // the mount pass. The follow loop yields x/y here via `chipFree`.
    const morphing = () => {
      gsap.killTweensOf([el, media]);
      gsap.set([el, media], { willChange: "width, height, transform" });
    };
    // Whatever this morph killed, the chip needs a live follower again afterwards.
    const settle = () => {
      gsap.set([el, media], { willChange: "transform" });
    };
    const reveals = el.querySelectorAll("[data-wk-reveal]");

    if (open) {
      const r = panelRect();
      morphing();
      if (scrollRef.current) scrollRef.current.scrollTop = 0;

      const t = gsap.timeline();
      // The box springs; the corner radius and the hero band do NOT — easing the
      // shape with the same overshoot makes the image band visibly wobble.
      t.to(el, {
        x: r.x, y: r.y, width: r.w, height: r.h, scale: 1, autoAlpha: 1,
        duration: dur(MOTION.morph), ease: EASE.box,
      }, 0)
        .to(media, {
          height: PANEL.heroH, y: 0,
          duration: dur(MOTION.morph), ease: EASE.shape,
        }, 0)
        .to(pageRef.current, {
          filter: `blur(${UNDERLAY.blur}px)`, scale: UNDERLAY.scale,
          duration: dur(MOTION.morph), ease: EASE.in,
        }, 0)
        .to(scrimRef.current, { autoAlpha: 1, duration: dur(MOTION.morph) }, 0)
        .fromTo(reveals, appearFrom, { ...appearTo, ease: EASE.in,
          duration: dur(MOTION.content), stagger: dur(MOTION.stagger) },
          dur(MOTION.contentDelay))
        .add(settle);
      tl.current = t;
      return;
    }

    // Closing: copy leaves first, then the box collapses back onto the cursor.
    // Nothing to collapse if the panel was never opened (first mount).
    if (!hasOpened.current) return;
    morphing();
    const back = chipRect(pointer.current.x, pointer.current.y);
    const t = gsap.timeline();
    const copyGone = dur(MOTION.content) * 0.6;
    t.to(reveals, {
      autoAlpha: 0, y: -MOTION.lift, filter: `blur(${MOTION.blur}px)`,
      duration: dur(MOTION.content), ease: EASE.out,
    }, 0)
      .to(el, {
        x: back.x, y: back.y, width: back.w, height: back.h,
        duration: dur(MOTION.morph), ease: EASE.shape,
      }, copyGone)
      .to(media, {
        height: CHIP.size, y: 0,
        duration: dur(MOTION.morph), ease: EASE.shape,
      }, copyGone)
      .to(pageRef.current, {
        filter: "blur(0px)", scale: 1,
        duration: dur(MOTION.morph), ease: EASE.in,
      }, 0)
      .to(scrimRef.current, { autoAlpha: 0, duration: dur(MOTION.morph) }, 0);

    if (landOn.current) {
      // Landing on a row: hold the box as the chip and swap in that row's hero at
      // the moment it arrives, so the image never changes mid-morph.
      const next = landOn.current;
      t.add(() => {
        setActive(next);
        chipPos.current = { x: back.x, y: back.y };
        // Let the loop re-derive hover from scratch: if the cursor is still over a
        // row it raises the chip on that project, otherwise it scales it away.
        hoverId.current = null;
        shown.current = true;
        chipFree.current = true;
        settle();
      });
    } else {
      // Landing on nothing: the box only leaves once it's back where it started.
      t.to(el, {
        autoAlpha: 0, scale: MOTION.scale / 100,
        duration: dur(MOTION.chip), ease: EASE.out,
      }, ">-0.12")
        .add(() => {
          chipPos.current = { x: back.x, y: back.y };
          hoverId.current = null;
          shown.current = false;
          chipFree.current = true;
          settle();
        });
    }
    tl.current = t;
  }, [open, mobile, ready]);

  // ── hero parallax ─────────────────────────────────────────────────────────
  // The hero is absolutely pinned, not in the scroll flow (re-parenting it mid-
  // morph would break the tween), so it is drifted by hand against scrollTop.
  const onPanelScroll = useCallback((e) => {
    if (!mediaRef.current) return;
    gsap.set(mediaRef.current, { y: -e.currentTarget.scrollTop * PANEL.heroParallax });
  }, []);

  // ── page-level wiring ─────────────────────────────────────────────────────
  useEffect(() => {
    if (mobile || !ready) return;
    window.addEventListener("pointermove", trackPointer, { passive: true });
    return () => window.removeEventListener("pointermove", trackPointer);
  }, [mobile, ready, trackPointer]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && closePanel();
    const onResize = () => {
      const r = panelRect();
      gsap.set(morphRef.current, { x: r.x, y: r.y, width: r.w, height: r.h });
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      document.body.style.overflow = prev;
    };
  }, [open, closePanel]);

  // ── mobile: plain white, blank on purpose ─────────────────────────────────
  if (mobile) {
    return (
      <main className="wk-main wk-main--mobile" style={cssVars()}>
        <section className="wk-mobile" />
      </main>
    );
  }

  // Blank, in the page's own colour, until every hero is decoded.
  if (!ready) return <main className="wk-main" style={cssVars()} />;

  const hero = active?.hero;

  return (
    <main className="wk-main" style={cssVars()}>
      {/* everything that blurs while the sidebar is open */}
      <div className="wk-page" ref={pageRef}>
        <ul className="wk-list">
          {projects.map((p) => (
            <li
              className="wk-row"
              key={p.id}
              style={p.color ? { "--wk-hover": p.color } : undefined}
            >
              <button
                className="wk-row__hit"
                data-id={p.id}
                onClick={() => openPanel(p)}
              >
                <span className="wk-row__title">
                  {p.lead}
                  {p.tail && <span className="wk-row__tail">{" "}{p.tail}</span>}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div
        className="wk-scrim"
        ref={scrimRef}
        onClick={closePanel}
        aria-hidden="true"
      />

      {/* THE ONE ELEMENT: chip and sidebar are the same box */}
      <div
        className={`wk-morph${open ? " --open" : ""}`}
        ref={morphRef}
        role={open ? "dialog" : undefined}
        aria-modal={open ? "true" : undefined}
        aria-label={open ? active?.label : undefined}
      >
        <div className="wk-morph__media" ref={mediaRef}>
          {hero ? (
            isVideo(hero)
              ? <video src={hero} loop muted playsInline autoPlay />
              : <img src={hero} alt="" decoding="sync" draggable="false" />
          ) : null}
        </div>

        <div
          className="wk-panel"
          ref={scrollRef}
          onScroll={onPanelScroll}
          aria-hidden={open ? undefined : true}
        >
          <div className="wk-panel__inner">
            <h2 className="wk-panel__title" data-wk-reveal>{active?.label}</h2>
            {active?.subtitle ? (
              <p className="wk-panel__sub" data-wk-reveal>{active.subtitle}</p>
            ) : null}
            {active?.blurb ? (
              <p className="wk-panel__blurb" data-wk-reveal>{active.blurb}</p>
            ) : null}

            <dl className="wk-panel__facts" data-wk-reveal>
              {(active?.facts ?? []).map(([k, v]) => (
                <div className="wk-fact" key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>

            {(active?.body ?? []).map((src) => (
              <figure className="wk-panel__plate" key={src} data-wk-reveal>
                {isVideo(src)
                  ? <video src={src} loop muted playsInline autoPlay />
                  : <img src={src} alt="" loading="lazy" decoding="async" />}
              </figure>
            ))}
          </div>
        </div>

        <button className="wk-close" onClick={closePanel} data-wk-reveal>close</button>
      </div>
    </main>
  );
}
