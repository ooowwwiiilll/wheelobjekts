import React, { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { InfiniteCanvas } from "./engine/InfiniteCanvas.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";
import { baseMedia, wipToMedia } from "./items.js";
import { items as contentItems } from "../content/items.js";
import { DetailTitles, DetailTexts } from "../content/DetailPanel.jsx";
import { loadWipItems } from "../content/wip.js";
import "./infinite.css";

gsap.registerPlugin(SplitText);

// theme-aware canvas background (matches base.css --color-bg)
const getThemeColors = () => {
  const dark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  return dark ? { bg: "#161616" } : { bg: "#f4f4f4" };
};

export default function InfiniteApp({ isWip = false }) {
  const [isAuthenticated, setIsAuthenticated] = useState(!isWip);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [wipItems, setWipItems] = useState([]);
  const [textureProgress, setTextureProgress] = useState(0);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [theme, setTheme] = useState(getThemeColors);

  const detailsRef = useRef(null);
  const overlayRef = useRef(null);
  const linksRef = useRef(null);
  const splitDone = useRef(false);

  const media = useMemo(
    () => (isAuthenticated ? [...baseMedia, ...wipToMedia(wipItems)] : baseMedia),
    [isAuthenticated, wipItems]
  );

  const selectedItem = useMemo(
    () => media.find((m) => m.id === selectedId) || null,
    [media, selectedId]
  );

  // react to OS light/dark switching
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setTheme(getThemeColors());
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Hide the loading overlay once the first textures report in (or instantly if
  // the only live asset is wob.gif). Mirrors the DOM grid's overlay behaviour.
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!isAuthenticated) return;
    const t = setTimeout(() => setLoaded(true), 600);
    return () => clearTimeout(t);
  }, [isAuthenticated]);
  useEffect(() => {
    if (textureProgress >= 100) setLoaded(true);
  }, [textureProgress]);

  // One-time SplitText pass over titles + descriptions (same masking as the
  // DOM grid: .char / .line start translated 100% down, see style.css).
  useEffect(() => {
    if (!isAuthenticated || splitDone.current || !detailsRef.current) return;
    const titles = detailsRef.current.querySelectorAll(".details__title p");
    const texts = detailsRef.current.querySelectorAll(".details__body [data-text]");
    new SplitText(titles, { type: "lines, chars", mask: "lines", charsClass: "char" });
    new SplitText(texts, { type: "lines", mask: "lines", linesClass: "line" });
    splitDone.current = true;
  }, [isAuthenticated, wipItems]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const decrypted = await loadWipItems(password);
      setWipItems(decrypted);
      setIsAuthenticated(true);
    } catch {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 2000);
      setPassword("");
    }
  };

  // ── detail open ────────────────────────────────────────────────────────────
  const openDetails = (item) => {
    if (selectedId) return;
    const id = item.id;
    setSelectedId(id);

    const details = detailsRef.current;
    details.classList.add("--is-showing");
    document.body.classList.add("--is-details-showing");

    gsap.to(details, { x: 0, duration: 0.78, ease: "power3.inOut" });

    const title = details.querySelector(`[data-title="${id}"]`);
    const text = details.querySelector(`[data-desc="${id}"]`);

    if (title) {
      title.classList.add("--active");
      gsap.to(title.querySelectorAll(".char"), {
        y: 0, duration: 0.72, delay: 0.26, ease: "power3.inOut", stagger: 0.016,
      });
    }
    if (text) {
      text.classList.add("--active");
      text.querySelectorAll("video").forEach((v) => {
        if (v.dataset.originalSrc) v.setAttribute("src", v.dataset.originalSrc);
        v.currentTime = 0;
        v.load();
        v.play().catch(() => {});
      });
      gsap.to(text.querySelectorAll(".line"), {
        y: 0, duration: 0.72, delay: 0.26, ease: "power3.inOut", stagger: 0.033,
      });
    }
  };

  // ── detail close (carries over media purging from the DOM grid) ─────────────
  const closeDetails = () => {
    const details = detailsRef.current;
    if (!details || !selectedId) return;

    // Fully purge video media sessions to prevent PiP / audio carry-over.
    details.querySelectorAll("video").forEach((v) => {
      v.pause();
      v.currentTime = 0;
      if (v.src && !v.dataset.originalSrc) v.dataset.originalSrc = v.getAttribute("src");
      v.removeAttribute("src");
      v.load();
    });

    document.body.classList.remove("--is-details-showing");

    gsap.to(details, {
      x: "50vw", duration: 0.78, delay: 0.2, ease: "power3.inOut",
      onComplete: () => {
        details.classList.remove("--is-showing");
        details.scrollTo({ top: 0, behavior: "instant" });
        details.querySelectorAll(".details__title p, .details__body [data-text]")
          .forEach((el) => el.classList.remove("--active"));
        setSelectedId(null);
      },
    });

    details.querySelectorAll(".details__title p").forEach((t) =>
      gsap.to(t.querySelectorAll(".char"), { y: "100%", duration: 0.39, ease: "power3.inOut", stagger: { amount: 0.016, from: "end" } })
    );
    details.querySelectorAll(".details__body [data-text]").forEach((t) =>
      gsap.to(t.querySelectorAll(".line"), { y: "100%", duration: 0.39, ease: "power3.inOut", stagger: 0.033 })
    );
  };

  // Esc to close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && selectedId) closeDetails();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId]);

  const onFilter = (cat) => setActiveCategory(cat);

  // Slide the white "selected" pill under the active filter (same as the root site).
  useEffect(() => {
    if (!isAuthenticated) return;
    const container = linksRef.current;
    if (!container) return;
    const bg = container.querySelector(".link-bg");
    const active = container.querySelector("a.active");
    if (!bg || !active) return;
    const r = active.getBoundingClientRect();
    const p = container.getBoundingClientRect();
    bg.style.width = r.width + "px";
    bg.style.transform = `translateX(${r.left - p.left}px)`;
  }, [activeCategory, isAuthenticated]);

  return (
    <main className="ic-main">
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

      {/* ── loading overlay ── */}
      <div className={`loading-overlay${loaded ? " --hidden" : ""}`} id="loading-overlay">
        <div className="loading-overlay__content">
          {!isAuthenticated ? (
            <div className="password-prompt" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2vw" }}>
              <div style={{ fontSize: "3vw", fontFamily: "'Exposure', sans-serif" }}>( enter password )</div>
              <form onSubmit={handleLogin}>
                <div className={`pw-field${passwordError ? " pw-field--error" : ""}`}>
                  <input
                    className="pw-field__input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password"
                    autoFocus
                  />
                </div>
              </form>
            </div>
          ) : (
            <div className="loading-overlay__progress">{textureProgress}</div>
          )}
        </div>
      </div>

      {/* dim/click-catch behind the detail panel */}
      <div className="overlay" id="overlay" ref={overlayRef} onClick={closeDetails}></div>

      {/* ── header: title + filter pills (replaces the canvas "infinite canvas" text) ── */}
      <header className="frame">
        <h1 className="frame__title">( WheelObjekts )</h1>

        <div className="frame__links" ref={linksRef}>
          <span className="link-bg"></span>
          <a className={activeCategory === "all" ? "active" : ""} onClick={() => onFilter("all")} data-filter="all">all</a>
          <a className={activeCategory === "A" ? "active" : ""} onClick={() => onFilter("A")} data-filter="A">visual</a>
          <a className={activeCategory === "B" ? "active" : ""} onClick={() => onFilter("B")} data-filter="B">product</a>
          <a className={activeCategory === "D" ? "active" : ""} onClick={() => onFilter("D")} data-filter="D">coded</a>
          <a className={activeCategory === "C" ? "active" : ""} onClick={() => onFilter("C")} data-filter="C">read</a>
        </div>
      </header>

      {/* ── the infinite WebGL canvas ── */}
      {isAuthenticated && (
        <ErrorBoundary>
          <InfiniteCanvas
            media={media}
            onTextureProgress={setTextureProgress}
            activeCategory={activeCategory}
            onSelect={openDetails}
            paused={!!selectedId}
            backgroundColor={theme.bg}
            fogColor={theme.bg}
          />
        </ErrorBoundary>
      )}

      {/* ── detail sidebar (same markup/CSS as the DOM grid) ── */}
      <div className="details" ref={detailsRef}>
        <DetailTitles items={contentItems} wipItems={wipItems} />

        <div className="details__body">
          {/* thumb: shows the selected item's colour plane / live image */}
          <div className="details__thumb">
            {selectedItem &&
              (selectedItem.url ? (
                <img src={selectedItem.url} alt="" />
              ) : (
                <div className="ic-thumb-color" style={{ backgroundColor: selectedItem.color }} />
              ))}
          </div>

          <DetailTexts items={contentItems} wipItems={wipItems} />
        </div>
      </div>
    </main>
  );
}
