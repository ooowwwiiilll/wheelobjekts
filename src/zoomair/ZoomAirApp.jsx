import { useEffect, useMemo, useState } from "react";
import ZoomScene from "./ZoomScene";
import { PARTS, SCIENCE, SOURCES } from "./data";
import "./zoomair.css";

const initialTelemetry = {
  compression: 0,
  pressure: 1,
  fiberLoad: 0,
  energy: 0,
  velocity: 0,
  active: false,
};

function Metric({ label, value, unit, bar }) {
  return (
    <div className="zoom-metric">
      <span>{label}</span>
      <strong>{value}<small>{unit}</small></strong>
      <i><b style={{ width: `${Math.min(100, Math.max(0, bar))}%` }} /></i>
    </div>
  );
}

export default function ZoomAirApp() {
  const [mode, setMode] = useState("lab");
  const [explode, setExplode] = useState(0.72);
  const [activePart, setActivePart] = useState("zoom");
  const [telemetry, setTelemetry] = useState(initialTelemetry);
  const [isPressing, setIsPressing] = useState(false);
  const [scienceStep, setScienceStep] = useState(0);
  const [infoOpen, setInfoOpen] = useState(false);
  const active = useMemo(() => PARTS.find((part) => part.id === activePart) ?? PARTS[3], [activePart]);

  useEffect(() => {
    document.title = "Zoom Air Lab — KD 15 Strobel";
    return () => { document.body.style.cursor = ""; };
  }, []);

  const switchMode = (next) => {
    setMode(next);
    if (next === "lab") {
      setActivePart("zoom");
      setExplode(1);
    }
  };

  return (
    <main className={`zoom-app zoom-mode-${mode} ${isPressing ? "is-pressing" : ""}`}>
      <div className="zoom-stage" aria-label="Interactive three-dimensional Nike Zoom Air Strobel educational model">
        <ZoomScene
          mode={mode}
          explode={explode}
          activePart={activePart}
          setActivePart={setActivePart}
          onTelemetry={setTelemetry}
          onPressChange={setIsPressing}
          isPressing={isPressing}
        />
      </div>

      <div className="zoom-grain" />
      <div className="zoom-orbit zoom-orbit-a" />
      <div className="zoom-orbit zoom-orbit-b" />

      <header className="zoom-header">
        <a className="zoom-brand" href="/" aria-label="Back to home">
          <span>WHEEL<br />OBJECTS</span>
          <b>ZOOM LAB / 015</b>
        </a>
        <nav className="zoom-tabs" aria-label="Experience view">
          <button className={mode === "lab" ? "active" : ""} onClick={() => switchMode("lab")}>PRESSURE LAB</button>
          <button className={mode === "system" ? "active" : ""} onClick={() => switchMode("system")}>KD 15 SYSTEM</button>
        </nav>
        <button className="zoom-info-button" onClick={() => setInfoOpen(true)}>INFO <span>↗</span></button>
      </header>

      <section className="zoom-title" aria-hidden="true">
        <p>FULL-LENGTH / DIRECTLY UNDERFOOT</p>
        <h1><span>ZOOM</span><span>STROBEL</span></h1>
      </section>

      {mode === "lab" ? (
        <>
          <section className="zoom-instruction">
            <div className="zoom-pulse"><i /><i /><i /></div>
            <div>
              <small>{isPressing ? "LOAD DETECTED" : "LIVE MATERIAL TEST"}</small>
              <strong>{isPressing ? "KEEP HOLDING" : "PRESS + HOLD"}</strong>
              <span>Press fast for a sharper bulge. Hold, then drag the load.</span>
            </div>
          </section>

          <aside className="zoom-telemetry">
            <div className="zoom-telemetry-head">
              <span>SIM / LIVE</span>
              <i className={telemetry.active ? "active" : ""} />
              <b>{telemetry.active ? "PRESSURIZED" : "READY"}</b>
            </div>
            <Metric label="LOCAL TRAVEL" value={telemetry.compression.toFixed(1)} unit=" mm" bar={(telemetry.compression / 3.1) * 100} />
            <Metric label="PRESSURE RATIO" value={telemetry.pressure.toFixed(2)} unit=" ×" bar={(telemetry.pressure - 1) * 590} />
            <Metric label="PRESS VELOCITY" value={telemetry.velocity.toFixed(0)} unit=" mm/s" bar={Math.abs(telemetry.velocity) * 2.4} />
            <Metric label="FIBER LOAD" value={Math.round(telemetry.fiberLoad)} unit=" %" bar={telemetry.fiberLoad} />
            <Metric label="ENERGY STORED*" value={telemetry.energy.toFixed(2)} unit=" J" bar={(telemetry.energy / 0.7) * 100} />
            <p>*ILLUSTRATIVE PHYSICS MODEL, NOT NIKE LAB DATA.</p>
          </aside>

          <section className="zoom-science">
            <div className="zoom-science-tabs">
              {SCIENCE.map((item, index) => (
                <button key={item.index} className={scienceStep === index ? "active" : ""} onClick={() => setScienceStep(index)}>
                  <span>{item.index}</span>{item.title}
                </button>
              ))}
            </div>
            <div className="zoom-science-copy">
              <span>0{scienceStep + 1} / 03</span>
              <p>{SCIENCE[scienceStep].copy}</p>
            </div>
          </section>
        </>
      ) : (
        <>
          <aside className="zoom-parts">
            <div className="zoom-parts-head"><span>KD 15 / LAYERS</span><b>07 PARTS</b></div>
            {PARTS.map((part) => (
              <button
                key={part.id}
                className={activePart === part.id ? "active" : ""}
                onClick={() => setActivePart(part.id)}
              >
                <span>{part.index}</span><b>{part.name}</b><i>{part.short}</i>
              </button>
            ))}
          </aside>

          <section className="zoom-part-detail">
            <div><span>{active.index}</span><small>SELECTED LAYER</small></div>
            <h2>{active.name}</h2>
            <p>{active.body}</p>
            <b>{active.material}</b>
            {active.id === "zoom" && <button onClick={() => switchMode("lab")}>ENTER PRESSURE LAB <span>→</span></button>}
          </section>

          <div className="zoom-explode-control">
            <span>ASSEMBLED</span>
            <input
              aria-label="Explode shoe layers"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={explode}
              onChange={(event) => setExplode(Number(event.target.value))}
            />
            <span>EXPLODED</span>
          </div>
        </>
      )}

      <div className="zoom-ticker" aria-hidden="true">
        <div>PRESSURE / RESPONSE / REPEAT&nbsp;&nbsp;&nbsp; PRESSURE / RESPONSE / REPEAT&nbsp;&nbsp;&nbsp; PRESSURE / RESPONSE / REPEAT&nbsp;&nbsp;&nbsp;</div>
      </div>

      {infoOpen && (
        <div className="zoom-info" role="dialog" aria-modal="true" aria-labelledby="zoom-info-title">
          <button className="zoom-info-close" onClick={() => setInfoOpen(false)} aria-label="Close information">×</button>
          <div className="zoom-info-index">EDU / 001</div>
          <h2 id="zoom-info-title">THE AIR IS ONLY HALF THE STORY.</h2>
          <p className="zoom-info-lead">Zoom Air began as “Tensile Air”: pressurized cushioning made faster and lower-profile by fibers woven inside the unit.</p>
          <div className="zoom-equation"><span>FAST COMPRESSION MODEL</span><strong>P₁V₁<sup>γ</sup> ≈ P₂V₂<sup>γ</sup></strong><small>LESS VOLUME → MORE PRESSURE → RESTORING FORCE</small></div>
          <div className="zoom-info-grid">
            <div>
              <span>01 / THE GAS</span>
              <p>Compression reduces chamber volume and raises pressure. That pressure distributes the load across the unit instead of leaving one hard pressure point.</p>
            </div>
            <div>
              <span>02 / THE FIBERS</span>
              <p>Fibers connect the top and bottom films. They restrain outward expansion, preserve the thin geometry, and help the unit snap back after load.</p>
            </div>
            <div>
              <span>03 / THE STROBEL</span>
              <p>In the KD 15, the full-length unit sits directly under the insole inside a Cushlon carrier—less material between foot and Air, so the response is easy to feel.</p>
            </div>
            <div>
              <span>04 / THE MODEL</span>
              <p>The visualization uses an adiabatic gas approximation and a damped elastic return. Live figures teach relationships, not confidential product specifications.</p>
            </div>
          </div>
          <footer>
            <span>RESEARCH SOURCES</span>
            {SOURCES.map((source) => <a key={source.href} href={source.href} target="_blank" rel="noreferrer">{source.label} ↗</a>)}
          </footer>
        </div>
      )}
    </main>
  );
}
