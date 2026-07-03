import React, { useEffect, useState } from "react";
import { initGrid } from "./lib/grid.js";
import { items, gridItems, categoryOf } from "./content/items.js";
import { DetailTitles, DetailTexts } from "./content/DetailPanel.jsx";
import { loadWipItems } from "./content/wip.js";

export default function App({ isWip = false }) {
  const [isAuthenticated, setIsAuthenticated] = useState(!isWip);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [wipItems, setWipItems] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) return;

    initGrid();
    // initAscii();

    const links = document.querySelectorAll(".frame__links a");
    const bg = document.querySelector(".frame__links .link-bg");

    function moveBg(target) {
      const rect = target.getBoundingClientRect();
      const parent = target.parentElement.getBoundingClientRect();

      bg.style.width = rect.width + "px";
      bg.style.transform = `translateX(${rect.left - parent.left}px)`;
    }

    links.forEach((link) => {
      link.addEventListener("click", () => {
        document.querySelector(".frame__links a.active")?.classList.remove("active");
        link.classList.add("active");
        moveBg(link);
      });
    });

    // Position the background under the default active link ("all") on initial render
    const initialActive = document.querySelector(".frame__links a.active");
    if (initialActive) {
      moveBg(initialActive);
    }
  }, [isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Unlock + decrypt the confidential wip items (shared loader)
      const decrypted = await loadWipItems(password);
      setWipItems(decrypted);
      setIsAuthenticated(true);
    } catch (err) {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 2000);
      setPassword("");
    }
  };

  // Normalize wip items to the grid tile shape ({ id, category, thumb }).
  const wipTiles = wipItems.map((w) => ({
    id: w.id,
    category: categoryOf(w.id),
    thumb: { type: "image", src: w.img },
  }));

  const allTiles = isAuthenticated ? [...gridItems, ...wipTiles] : gridItems;
  // Fixed 3-2-3 column structure, slot 6 permanently removed. Only the
  // first 8 items ever get a slot — on /wip the 9th (wip) item is
  // intentionally left without one, same structure as the public site.
  const COLUMN_LAYOUT = [3, 2, 3];

  let cursor = 0;
  const columns = COLUMN_LAYOUT.map((count) => {
    const colItems = allTiles.slice(cursor, cursor + count);
    cursor += count;
    return colItems;
  });

  return (
    <main>

      <div className="mobile-blocker">
        <p className="mobile__desc">
          {/* optimized for larger screen<br />
          please view this site from desktop */}
          this piece is best viewed<br />
          on desktop screen.
        </p>

        <h1 className="mobile__title">(wob)</h1>
        <div className="mobile__desc2">
          <a href="https://linkedin.com/in/owil/" target="_blank" rel="noreferrer">{"corporate"}</a>
          {/* <a href="https://drive.google.com/file/d/1ELcFvAMh2aRTnOf0iTbIWlac8juFh987/view?usp=drive_link" target="_blank" rel="noreferrer">{"pause"}</a> */}
          <a href="mailto:owilhm@gmail.com" target="_blank" rel="noreferrer">{"hmu"}</a>
        </div>
      </div>

      <div className="loading-overlay" id="loading-overlay">
        <div className="loading-overlay__content">
          {!isAuthenticated ? (
            <div className="password-prompt" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2vw' }}>
              <div style={{ fontSize: '3vw', fontFamily: "'Exposure', sans-serif" }}>( enter password )</div>
              <form onSubmit={handleLogin}>
                <div className={`pw-field${passwordError ? ' pw-field--error' : ''}`}>
                  <input
                    className="pw-field__input"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="password"
                    autoFocus
                  />
                </div>
              </form>
            </div>
          ) : (
            <div className="loading-overlay__progress">0</div>
          )}
        </div>
      </div>

      <div className="overlay" id="overlay"></div>

      <header className="frame">
        <h1 className="frame__title">
          ( WheelObjekts )
        </h1>

        {/* <div className="frame__links">
          <a href="">reads</a>
          <a href="">tldr</a>
          <a href="https://linkedin.com/in/owil/" target="_blank" rel="noreferrer">corporate</a>
          <a href="https://drive.google.com/file/d/1ELcFvAMh2aRTnOf0iTbIWlac8juFh987/view?usp=drive_link" target="_blank" rel="noreferrer">pause</a>
          <a href="mailto:owilhm@gmail.com" target="_blank" rel="noreferrer">message</a>
        </div> */}

        <div className="frame__links">
          <span className="link-bg"></span>

          <a className="active" data-filter="all">all</a>
          <a data-filter="A">visual</a>
          <a data-filter="B">product</a>
          <a data-filter="D">coded</a>
          <a data-filter="C">read</a>
        </div>


        <div className="hud__bg">
          <div className="hud">
            <p>office</p>
            <div className="hud2">
              <p>static</p>
              <div className="hud2__radar">
                <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.25 0.25L22.25 44.25M44.25 21.25L0.25 21.25M0.250009 0.25H44.25V44.25H0.250009V0.25Z" stroke="currentColor" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="3 3" />
                </svg>

                {/* <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.25 0.25H0.25V22.25M22.25 0.25V22.25M22.25 0.25H44.25V22.25M22.25 22.25H0.25M22.25 22.25H44.25M22.25 22.25V44.25M0.25 22.25V44.25H22.25M44.25 22.25V44.25H22.25" stroke="#1a1a1a" strokeWidth="0.5"/>
                </svg> */}
                <img id="radar-rocky" className="rocky" src="/rocky.png" />
              </div>
              <p>lively</p>
            </div>
            <p>outpost</p>
          </div>
        </div>

      </header>

      <div className="container">
        {/* <div className="overlay"></div> */}

        <div className="grid">
          {columns.map((colItems, colIndex) => (
            <div className="column" key={`col-${colIndex}`}>
              {colItems.map((item, index) => (
                <div className="product" key={`slot-${colIndex}-${index}`}>
                  <div data-id={item.id} data-cat={item.category}>
                    {item.thumb.type === "color"
                      ? <div className="product__placeholder" style={{ backgroundColor: item.thumb.value }} />
                      : <img src={item.thumb.src} alt="" />}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="details">
        <DetailTitles items={items} wipItems={wipItems} />
        <div className="details__body">
          <div className="details__thumb"></div>
          <DetailTexts items={items} wipItems={wipItems} />

          {/* add images here */}
        </div>
      </div>

      <div className="cross">
        {/* <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 6L18 18" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg> */}
        <svg width="52" height="52" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* <path d="M0 2.13709L0.432567 1.36051L2.9244 2.87755L2.85129 0H3.71642L3.64331 2.87153L6.13514 1.36051L6.56771 2.13709L4.02714 3.50363L6.56771 4.87016L6.13514 5.64674L3.64331 4.13572L3.71642 7.01327H2.85129L2.9244 4.13572L0.432567 5.64674L0 4.87016L2.53448 3.50363L0 2.13709Z" fill="currentColor"/> */}
          <path d="M9.35807 11.3838L9.79064 10.6072L12.2825 12.1242L12.2094 9.24668H13.0745L13.0014 12.1182L15.4932 10.6072L15.9258 11.3838L13.3852 12.7503L15.9258 14.1168L15.4932 14.8934L13.0014 13.3824L13.0745 16.26H12.2094L12.2825 13.3824L9.79064 14.8934L9.35807 14.1168L11.8926 12.7503L9.35807 11.3838Z" fill="currentColor" />
          <path d="M18.7161 20.6305L19.1487 19.8539L21.6405 21.3709L21.5674 18.4934H22.4326L22.3595 21.3649L24.8513 19.8539L25.2839 20.6305L22.7433 21.997L25.2839 23.3635L24.8513 24.1401L22.3595 22.6291L22.4326 25.5066H21.5674L21.6405 22.6291L19.1487 24.1401L18.7161 23.3635L21.2506 21.997L18.7161 20.6305Z" fill="currentColor" />
          <path d="M28.0742 29.8771L28.5068 29.1006L30.9986 30.6176L30.9255 27.74H31.7906L31.7175 30.6116L34.2094 29.1006L34.6419 29.8771L32.1014 31.2437L34.6419 32.6102L34.2094 33.3868L31.7175 31.8758L31.7906 34.7533H30.9255L30.9986 31.8758L28.5068 33.3868L28.0742 32.6102L30.6087 31.2437L28.0742 29.8771Z" fill="currentColor" />
          {/* <path d="M37.4323 39.1238L37.8649 38.3472L40.3567 39.8643L40.2836 36.9867H41.1487L41.0756 39.8583L43.5674 38.3472L44 39.1238L41.4594 40.4904L44 41.8569L43.5674 42.6335L41.0756 41.1225L41.1487 44H40.2836L40.3567 41.1225L37.8649 42.6335L37.4323 41.8569L39.9668 40.4904L37.4323 39.1238Z" fill="currentColor"/> */}
          {/* <path d="M37.4323 2.13709L37.8649 1.36051L40.3567 2.87755L40.2836 0H41.1487L41.0756 2.87153L43.5674 1.36051L44 2.13709L41.4594 3.50363L44 4.87016L43.5674 5.64674L41.0756 4.13572L41.1487 7.01327H40.2836L40.3567 4.13572L37.8649 5.64674L37.4323 4.87016L39.9668 3.50363L37.4323 2.13709Z" fill="currentColor"/> */}
          <path d="M28.0742 11.3838L28.5068 10.6072L30.9986 12.1242L30.9255 9.24668H31.7906L31.7175 12.1182L34.2094 10.6072L34.6419 11.3838L32.1014 12.7503L34.6419 14.1168L34.2094 14.8934L31.7175 13.3824L31.7906 16.26H30.9255L30.9986 13.3824L28.5068 14.8934L28.0742 14.1168L30.6087 12.7503L28.0742 11.3838Z" fill="currentColor" />
          {/* <path d="M0 39.1238L0.432567 38.3472L2.9244 39.8643L2.85129 36.9867H3.71642L3.64331 39.8583L6.13514 38.3472L6.56771 39.1238L4.02714 40.4904L6.56771 41.8569L6.13514 42.6335L3.64331 41.1225L3.71642 44H2.85129L2.9244 41.1225L0.432567 42.6335L0 41.8569L2.53448 40.4904L0 39.1238Z" fill="currentColor"/> */}
          <path d="M9.35807 29.8771L9.79064 29.1006L12.2825 30.6176L12.2094 27.74H13.0745L13.0014 30.6116L15.4932 29.1006L15.9258 29.8771L13.3852 31.2437L15.9258 32.6102L15.4932 33.3868L13.0014 31.8758L13.0745 34.7533H12.2094L12.2825 31.8758L9.79064 33.3868L9.35807 32.6102L11.8926 31.2437L9.35807 29.8771Z" fill="currentColor" />
        </svg>


      </div>
    </main>
  );
}
