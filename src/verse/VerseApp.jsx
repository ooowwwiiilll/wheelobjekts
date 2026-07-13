// /verse — spherical gallery design mode. Self-contained under src/verse/
// (delete this folder + the route in main.jsx to remove). Content comes from
// the shared content layer: registry images via ./items.js, detail bodies from
// src/content/bodies.jsx.
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { VerseScene } from "./scene.js";
import { verseMedia } from "./items.js";
import { bodies } from "../content/bodies.jsx";
import "./verse.css";

export default function VerseApp() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const panelRef = useRef(null);
  const closingRef = useRef(false);

  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const scene = new VerseScene(mountRef.current, verseMedia, {
      onProgress: setProgress,
      onLoaded: () => setLoaded(true),
      onSelect: (item) => setSelected(item),
    });
    sceneRef.current = scene;
    return () => scene.dispose();
  }, []);

  // slide the detail panel in once a card is selected (overlaps the 3D morph)
  useEffect(() => {
    if (!selected || !panelRef.current) return;
    closingRef.current = false;
    gsap.fromTo(
      panelRef.current,
      { x: "110%" },
      { x: "0%", duration: 0.9, delay: 0.35, ease: "power3.inOut" }
    );
  }, [selected]);

  const close = () => {
    if (!selected || closingRef.current) return;
    closingRef.current = true;
    if (panelRef.current) {
      gsap.to(panelRef.current, { x: "110%", duration: 0.8, ease: "power3.inOut" });
    }
    sceneRef.current?.deselect(() => setSelected(null));
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <main className="verse-main">
      <div className="mobile-blocker">
        <p className="mobile__desc">
          this piece is best viewed<br />on desktop screen.
        </p>
        <h1 className="mobile__title">(wob)</h1>
        <div className="mobile__desc2">
          <a href="https://linkedin.com/in/owil/" target="_blank" rel="noreferrer">corporate</a>
          <a href="mailto:owilhm@gmail.com" target="_blank" rel="noreferrer">hmu</a>
        </div>
      </div>

      <div className="verse-canvas" ref={mountRef}></div>
      <div className="verse-vignette"></div>

      <header className="verse-frame">
        <h1>( WheelObjekts )</h1>
        <p className="verse-tag">verse — drag to explore</p>
      </header>

      <div className={`verse-loading${loaded ? " --hidden" : ""}`}>
        <span>{progress}</span>
      </div>

      {selected && (
        <>
          {/* click anywhere outside the panel to close */}
          <div className="verse-overlay" onClick={close}></div>
          <aside className="verse-detail" ref={panelRef}>
            <button className="verse-back" onClick={close}>← back</button>
            <h2 className="verse-detail__title">{selected.title}</h2>
            <div className="verse-detail__body">
              {bodies[selected.id] ?? <>site under construction&nbsp;– TBU</>}
            </div>
          </aside>
        </>
      )}
    </main>
  );
}
