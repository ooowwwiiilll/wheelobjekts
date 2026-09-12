// ─────────────────────────────────────────────────────────────────────────────
// /lebron17 — the page. Self-contained under src/lebron17/ (delete this folder
// and the route line in main.jsx to remove it). The canvas is the whole page;
// the rail names the eleven components, the bottom bar drives the explode and
// the section cut, and picking a component flies the camera into it.
// ─────────────────────────────────────────────────────────────────────────────
import React, { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import Shoe from "./Shoe.jsx";
import { PARTS, PART_BY_ID, SHOE, HOME } from "./parts.js";
import "./lebron17.css";

export default function Lebron17App() {
  const low = useMemo(() => typeof window !== "undefined" && window.innerWidth < 760, []);
  const [explode, setExplode] = useState(0);
  const [section, setSection] = useState(0);
  const [focus, setFocus] = useState(null);
  const [hover, setHover] = useState(null);
  const [labels, setLabels] = useState(true);
  const [spin, setSpin] = useState(false);

  const ui = { explode, section, focus, hover, labels, spin };
  const part = focus ? PART_BY_ID[focus] : null;

  useEffect(() => { document.title = `${SHOE.name} — components`; }, []);

  const pick = useCallback((id) => setFocus((f) => (f === id ? null : id)), []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setFocus(null);
      if (e.key === "e" || e.key === "E") setExplode((v) => (v > 0.5 ? 0 : 1));
      if (e.key === "x" || e.key === "X") setSection((v) => (v > 0.5 ? 0 : 1));
      if (e.key === "l" || e.key === "L") setLabels((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.cursor = hover && !focus ? "pointer" : "";
    return () => { document.body.style.cursor = ""; };
  }, [hover, focus]);

  const step = (d) => {
    const i = PARTS.findIndex((p) => p.id === focus);
    setFocus(PARTS[(i + d + PARTS.length) % PARTS.length].id);
  };

  return (
    <main className={"lb-main" + (focus ? " is-focused" : "")}>
      <div className="lb-stage">
        <Canvas
          dpr={[1, low ? 1.5 : 2]}
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
          camera={{ fov: 30, position: HOME[0], near: 0.1, far: 60 }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.08;
            if ("transmissionResolutionScale" in gl) gl.transmissionResolutionScale = 0.5;
          }}
        >
          <Suspense fallback={null}>
            <Shoe ui={ui} onHover={setHover} onPick={pick} low={low} />
          </Suspense>
        </Canvas>
      </div>

      {/* ── masthead + component rail ── */}
      <header className="lb-head">
        <h1><em>LeBron</em> 17</h1>
        <p className="lb-sub">behind the design — every component, live</p>
        <dl className="lb-meta">
          <div><dt>year</dt><dd>{SHOE.year}</dd></div>
          <div><dt>designer</dt><dd>{SHOE.designer}</dd></div>
          <div><dt>brief</dt><dd>“{SHOE.brief}”</dd></div>
        </dl>
      </header>

      <nav className="lb-rail" aria-label="components">
        <span className="lb-rail-title">components <i>{PARTS.length}</i></span>
        <ul>
          {PARTS.map((p, i) => (
            <li key={p.id}>
              <button
                className={"lb-row" + (focus === p.id ? " is-on" : "") + (hover === p.id ? " is-hot" : "")}
                onMouseEnter={() => setHover(p.id)}
                onMouseLeave={() => setHover(null)}
                onClick={() => pick(p.id)}
              >
                <i>{String(i + 1).padStart(2, "0")}</i>
                <span>{p.label}</span>
                <em>{p.tag}</em>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── controls ── */}
      <section className="lb-bar" aria-label="controls">
        <label className="lb-slider">
          <span>explode<i>{Math.round(explode * 100)}</i></span>
          <input type="range" min="0" max="1" step="0.01" value={explode}
            onChange={(e) => setExplode(+e.target.value)} />
        </label>
        <label className="lb-slider">
          <span>section<i>{Math.round(section * 100)}</i></span>
          <input type="range" min="0" max="1" step="0.01" value={section}
            onChange={(e) => setSection(+e.target.value)} />
        </label>
        <div className="lb-toggles">
          <button className={explode > 0.5 ? "is-on" : ""} onClick={() => setExplode(explode > 0.5 ? 0 : 1)}>explode</button>
          <button className={labels ? "is-on" : ""} onClick={() => setLabels(!labels)}>labels</button>
          <button className={spin ? "is-on" : ""} onClick={() => setSpin(!spin)}>spin</button>
          <button onClick={() => { setFocus(null); setExplode(0); setSection(0); }}>reset</button>
        </div>
        <p className="lb-hint">drag to orbit · scroll to zoom · click a part to dive in · <b>e</b> explode <b>x</b> section</p>
      </section>

      {/* ── the deep dive ── */}
      <aside className={"lb-panel" + (part ? " is-open" : "")} aria-hidden={!part}>
        {part && (
          <>
            <button className="lb-close" onClick={() => setFocus(null)} aria-label="close">close</button>
            <span className="lb-panel-tag">{part.tag}</span>
            <h2>{part.label}</h2>
            <p className="lb-panel-copy">{part.copy}</p>
            <dl className="lb-facts">
              {part.facts.map(([k, v]) => (
                <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
              ))}
            </dl>
            {part.deep && (
              <p className="lb-panel-note">the pods are compressing on a loop — watch the fibres inside stretch and pull the bag back.</p>
            )}
            <nav className="lb-step">
              <button onClick={() => step(-1)}>← prev</button>
              <span>{String(PARTS.findIndex((p) => p.id === part.id) + 1).padStart(2, "0")} / {String(PARTS.length).padStart(2, "0")}</span>
              <button onClick={() => step(1)}>next →</button>
            </nav>
          </>
        )}
      </aside>

      <footer className="lb-foot">
        <p>{SHOE.note}</p>
        <a href={SHOE.source} target="_blank" rel="noreferrer">source film ↗</a>
      </footer>
    </main>
  );
}
