import React, { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { InfiniteCanvas } from "./engine/InfiniteCanvas.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";
import { baseMedia, wipToMedia } from "./items.js";
import { decryptData } from "../lib/crypto.js";
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
      const res = await fetch("/wip-encrypted.json");
      const encryptedData = await res.json();
      const decrypted = await decryptData(encryptedData, password);
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

        <div className="frame__links">
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
        <div className="details__title">
          {/* <p data-title="1" data-text>axisnet</p> */}
          <p data-title="2" data-text>vietinbank efast</p>
          <p data-title="3" data-text>gopay</p>
          <p data-title="4" data-text>kix</p>
          <p data-title="5" data-text>mytelkomsel basic</p>
          <p data-title="6" data-text>okuri</p>
          <p data-title="7" data-text>obed willhem</p>
          <p data-title="8" data-text>thanh uy art gallery</p>
          <p data-title="9" data-text>samosynth</p>
          <p data-title="10" data-text>blooms</p>
          {/* <p data-title="11" data-text>kuttaib</p> */}
          <p data-title="12" data-text>ted</p>
          <p data-title="13" data-text>kfc</p>
          {wipItems.map((item) => (
            <p key={`title-${item.id}`} data-title={item.id} data-text>{item.title}</p>
          ))}
        </div>

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

          <div className="details__texts">
            <p data-desc="2" data-text>site under construction&nbsp;– TBU</p>
            {/* <p data-desc="2" data-text>
              <span>
                <p>🇻🇳 vietnam</p>
                <p>🕰️ 2025</p>
              </span>
              A digital B2B banking service offered by the Vietnam Joint Stock Commercial Bank for Industry and Trade. Allows corporate clients to manage accounts, conduct transactions, and approve payments anytime and anywhere via an internet connection.
              <span>T B U</span>
            </p> */}

            <p data-desc="3" data-text>
              <span>
                <p>🇮🇩 indonesia</p>
                <p>🕰️ 2025</p>
              </span>
              A recent GoPay digital wallet service integration for Telkomsel users via the MyTelkomsel app, offering convenience and efficiency in transacting Telkomsel services.
              <span>T B U</span>
            </p>
            <p data-desc="4" data-text>
              <span>
                <p>🌎 global</p>
                <p>🕰️ 2023</p>
              </span>
              <span>
                <a href="https://www.wwdcscholars.com/s/53FA3940-93F5-480B-9224-2B0613AEDA6D/2024" target="_blank" rel="noreferrer">public press media here</a>
              </span>
            </p>

            <p data-desc="5" data-text>site under construction&nbsp;– TBU</p>
            {/* <p data-desc="5" data-text>
              <span>
                <p>🇮🇩 indonesia</p>
                <p>🕰️ 2024</p>
              </span>
              Emphatising Indonesia's large amount of low-end smartphone users, MyTelkomsel Basic is a  lightweight application from Telkomsel, designed for users with limited memory or in rural & remote areas with unstable internet connections. Provides essential functions such as credit & data balance monitoring, internet & phone package shop, and making payments.
              <span>T B U</span>
            </p> */}

            <p data-desc="6" data-text>site under construction&nbsp;– TBU</p>
            {/* <p data-desc="6" data-text>
              <span>
                <p>🌎 global</p>
                <p>🕰️ 2025</p>
              </span>
              <span>
                <p>OKURI is a digital tear-off calendar inspired by the traditional japanese <i>himekuri</i>, with an over-engineered contemporary spin. swipe to flip new sheet each day.</p>
              </span>
              <span>
                <a href="https://apps.apple.com/id/app/okuri/id6759762270" target="_blank" rel="noreferrer">download on the app store</a>
              </span>
              <span>T B U</span>
            </p> */}

            <p data-desc="7" data-text>
              <span>
                <p>currently at aleph-labs ++ AKQA.</p>
              </span>
              an asian unorthodox-generalist wannabe. obsessed in cross-functioning avant-garde-post-modern-fine-arts with tech innovations.
              <br />
              <span>
                <p>paid professional at 16, worked full-time at 18, dropped out of college at 21,5.</p>
              </span>
              <span>
                <p><strong>interests & idols</strong></p>
                <p>michael stevens vsauce</p>
                <p>adam neely</p>
                <p>martin margiela</p>
                <p>teenage engineering</p>
                <p>casiopea</p>
                <p>car pei</p>
                <p>tim rodenbröker</p>
                <p>chan karunamuni</p>
                <p>virgil abloh</p>
                <p>edouard manet</p>
                <p>brutalism</p>
                <p>seth mcfarlane</p>
                <p>leo chang</p>
                <p>four tet</p>
                <p>john kiriakou</p>
                <p>doug lemoine</p>
                <p>mike schneider</p>
                <p>FKJ</p>
                <p>r/deGoogle</p>
                <p>black mirror</p>
                <p>chick corea</p>
              </span>
              <span style={{ display: "flex", gap: "10px" }}>
                <a href="https://linkedin.com/in/owil/" target="_blank" rel="noreferrer">corporate</a>
                <a href="mailto:owilhm@gmail.com" target="_blank" rel="noreferrer">hmu</a>
              </span>
            </p>

            <p data-desc="8" data-text>site under construction&nbsp;– TBU</p>
            {/* <p data-desc="8" data-text>
              <span>
                <p>🇻🇳 vietnam</p>
                <p>🕰️ 2025</p>
              </span>
              an edgy printmaking gallery and studio + coffee shop in Ha Noi, celebrating Vietnam's rich history during propaganda and renewal period through traditional & contemporary paintings.
              <br />
              <span>T B U</span>
            </p> */}

            <p data-desc="9" data-text>site under construction&nbsp;– TBU</p>
            {/* original samosynth multi-media content preserved in src/App.jsx */}

            <p data-desc="10" data-text>site under construction&nbsp;– TBU</p>
            {/* <p data-desc="10" data-text>
              <span>
                <p>🇦🇺 australia</p>
                <p>🕰️ 2025</p>
              </span>
              an Australian retail pharmacy group with a network of independently owned and operated pharmacies, also includes a certified B Corp management services arm. The pharmacies offer health & wellness prescription, pharmacist consultations, and medication ordering.
              <br />
              <span>
                <a href="https://joinbloomsthechemist.com.au/" target="_blank" rel="noreferrer">live site here</a>
              </span>
            </p> */}

            <p data-desc="12" data-text>
              <span>
                <p>🇮🇩 indonesia</p>
                <p>🕰️ 2024</p>
              </span>
              the B2B unit of Telkomsel that provides digital solutions and connectivity for corporations to support their digital transformation. Offering advanced network services, communication & collaboration tools, IoT solutions, and CX insights tools.
              <br />
              <span>T B U</span>
            </p>

            <p data-desc="13" data-text>site under construction&nbsp;– TBU</p>
            {/* <p data-desc="13" data-text>
              <span>
                <p>📍 global</p>
                <p>🕰️ 2026</p>
              </span>
              a global multi-brand design system overhaul under Yum! brands.
              <br />
              <span>T B U</span>
            </p> */}

            {wipItems.map((item) => (
              <p
                key={`desc-${item.id}`}
                data-desc={item.id}
                data-text
                dangerouslySetInnerHTML={{ __html: item.html }}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
