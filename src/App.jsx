import React, { useEffect } from "react";
import { initGrid } from "./lib/grid.js";

export default function App() {
  useEffect(() => {
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
  }, []);

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
          <a href="https://drive.google.com/file/d/1ELcFvAMh2aRTnOf0iTbIWlac8juFh987/view?usp=drive_link" target="_blank" rel="noreferrer">{"pause"}</a>
          <a href="mailto:owilhm@gmail.com" target="_blank" rel="noreferrer">{"hmu"}</a>
        </div>
      </div>
      
      <div className="loading-overlay" id="loading-overlay">
        <div className="loading-overlay__content">
          <div className="loading-overlay__progress">0</div>
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
          <a data-filter="C">read</a>
          <a data-filter="D">coded</a>
        </div>


        <div className="hud__bg">
          <div className="hud">
            <p>office</p>
            <div className="hud2">
              <p>static</p>
              <div className="hud2__radar">
                <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.25 0.25L22.25 44.25M44.25 21.25L0.25 21.25M0.250009 0.25H44.25V44.25H0.250009V0.25Z" stroke="#1A1A1A" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="3 3"/>
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

          <div className="column">
            <div className="product"><div data-id="1"><img src="/saxis.png" alt="" /></div></div>
            <div className="product"><div data-id="2"><img src="/sfast.png" alt="" /></div></div>
            <div className="product"><div data-id="3"><img src="/sgop.png" alt="" /></div></div>
            <div className="product">
              <div data-id="4">
                <img src="/skix_ascii.png" alt="" />
                <img className="img-hover" src="/skix.png" alt="" />
              </div>
            </div>
          </div>

          <div className="column">
            <div className="product"><div data-id="5"><img src="/smtb.png" alt="" /></div></div>
            <div className="product">
              <div data-id="6">
                <img src="/ssamo_ascii.png" alt="" />
                <img className="img-hover" src="/ssamo.png" alt="" />
              </div>
            </div>
            <div className="product"><div data-id="7"><img src="/wob.gif" alt="" /></div></div>
            <div className="product"><div data-id="8"><img src="/sthuy.png" alt="" /></div></div>
          </div>

          <div className="column">
            <div className="product"><div data-id="9"><img src="/sviet.png" alt="" /></div></div>
            <div className="product"><div data-id="10"><img src="/szbloom.png" alt="" /></div></div>
            <div className="product">
              <div data-id="11">
                <img src="/szkutt_ascii.png" alt="" />
                <img className="img-hover" src="/szkutt.png" alt="" />
              </div>
            </div>
            <div className="product"><div data-id="12"><img src="/szted.png" alt="" /></div></div>
          </div>

          <div className="column">
            <div className="product"><div data-id="1"><img src="/saxis.png" alt="" /></div></div>
            <div className="product"><div data-id="2"><img src="/sfast.png" alt="" /></div></div>
            <div className="product"><div data-id="3"><img src="/sgop.png" alt="" /></div></div>
            <div className="product">
              <div data-id="4">
                <img src="/skix_ascii.png" alt="" />
                <img className="img-hover" src="/skix.png" alt="" />
              </div>
            </div>
          </div>

          <div className="column">
            <div className="product"><div data-id="5"><img src="/smtb.png" alt="" /></div></div>
            <div className="product">
              <div data-id="6">
                <img src="/ssamo_ascii.png" alt="" />
                <img className="img-hover" src="/ssamo.png" alt="" />
              </div>
            </div>
            <div className="product"><div data-id="7"><img src="/wob.gif" alt="" /></div></div>
            <div className="product"><div data-id="8"><img src="/sthuy.png" alt="" /></div></div>
          </div>

          <div className="column">
            <div className="product"><div data-id="9"><img src="/sviet.png" alt="" /></div></div>
            <div className="product"><div data-id="10"><img src="/szbloom.png" alt="" /></div></div>
            <div className="product">
              <div data-id="11">
                <img src="/szkutt_ascii.png" alt="" />
                <img className="img-hover" src="/szkutt.png" alt="" />
              </div>
            </div>
            <div className="product"><div data-id="12"><img src="/szted.png" alt="" /></div></div>
          </div>

        </div>
      </div>

      <div className="details">
        <div className="details__title">
          <p data-title="1" data-text>axisnet</p>
          <p data-title="2" data-text>vietinbank efast</p>
          <p data-title="3" data-text>gopay</p>
          <p data-title="4" data-text>kix</p>
          <p data-title="5" data-text>mytelkomsel basic</p>
          <p data-title="6" data-text>samosynth</p>
          <p data-title="7" data-text>owillhem</p>
          <p data-title="8" data-text>thanh uy art gallery</p>
          <p data-title="9" data-text>viettel</p>
          <p data-title="10" data-text>blooms</p>
          <p data-title="11" data-text>kuttaib</p>
          <p data-title="12" data-text>ted</p>
          {/* <p data-title="10" data-text> focalé</p> */}
        </div>
        <div className="details__body">
          <div className="details__thumb"></div>
          <div className="details__texts">
            <p data-desc="1" data-text>
              <span>
                <p>📍 indonesia</p>
                <p>🕰️ 2024</p>
              </span>
              A self-care application for AXIS customers that allows them to manage their accounts, top up credits & internet packages. 
              <span>T B U</span>
            </p>

            <p data-desc="2" data-text>
              <span>
                <p>📍 vietnam</p>
                <p>🕰️ 2025</p>
              </span>
              A digital B2B banking service offered by the Vietnam Joint Stock Commercial Bank for Industry and Trade. Allows corporate clients to manage accounts, conduct transactions, and approve payments anytime and anywhere via an internet connection. 
              <span>T B U</span>
            </p>

            <p data-desc="3" data-text>
              <span>
                <p>📍 indonesia</p>
                <p>🕰️ 2025</p>
              </span>
              A recent GoPay digital wallet service integration for Telkomsel users via the MyTelkomsel app, offering convenience and efficiency in transacting Telkomsel services. 
              <span>T B U</span>
            </p>
            <p data-desc="4" data-text>
              {/* <span className="">indonesia</span> */}
              <span>
                <p>📍 global</p>
                <p>🕰️ 2023</p>
              </span>

              <span>
                <a href="https://www.wwdcscholars.com/s/53FA3940-93F5-480B-9224-2B0613AEDA6D/2024" target="_blank" rel="noreferrer">{"public press media here"}</a>
              </span>
            </p>

            <p data-desc="5" data-text>
              <span>
                <p>📍 indonesia</p>
                <p>🕰️ 2024</p>
              </span>
              A lightweight application from Telkomsel, designed for users with limited memory or in areas with unstable internet connections. Provides essential functions such as credit & data balance monitoring, internet & phone package shop, and making payments. 
              <span>T B U</span>
            </p>

            <p data-desc="6" data-text>
              {/* <span className="">indonesia</span> */}
              <span>
                <p>📍 global</p>
                <p>🕰️ 2025</p>
              </span>
              <span>
                <img className="details__media" src="./ssamo_dsimulator.png"/>
              </span>
              <span>
                <p>
                samosynth is a mini mpc / sampler that celebrates the bataknese culture, by pouring relevant bataknese elements and including easter-eggs into the music experience. the drum kit contains a mix of hip-hop drum samples + processed bataknese traditional instruments (taganing, kulcapi and gordang) one-shots.
                </p>
              </span>
              <span>pad mechanism</span>
              <span>
                <video autoplay loop playsinline controls className="details__media" src="./ssamo_dpads.mp4"></video>
              </span>
              <span>
                <p>
                i wanted to introduce bataknese music & visuals holistically in a pleasurable manner. 
                <br />
                <br />this mechanism was inspired by the gorogoa game, which i adore a lot. the individual drumpads is a puzzle piece, that when rotated in a certain angle forms a combination that will unlock a new drum presets & patterns inspired from some key bataknese cultural elements. 
                <br />
                <br />each preset represents a region from north sumatera region, with the sound and pattern is inspired from those region.
                <br />
                <br />you can play with the drumpads as it is, or unlock other drum presets by completing the puzzle on the drumpads. 
                </p>
              </span>
              <span>tiles</span>
              <span>
                <video autoplay loop playsinline controls className="details__media" src="./ssamo_dtiles.mp4"></video>
              </span>
              <span>
                <p>
                  i spent a good amount of time exploring and experimenting on different tile patterns and grid sizes. 
                </p>
              </span>
              <span>
                <img className="details__media" src="./ssamo_dgrid.png"/>
              </span>
            </p>

            <p data-desc="7" data-text>
              <span>
                <p>currently at aleph-labs, AKQA.</p>
              </span>
              asian unorthodox-generalist wannabe. obsessed about the possible cross function of avant-garde-haute-couture-post-modern-applied-fine-arts ++ creative tech innovations.
              <br />
              <span>
                <p>paid professional at 16, worked full-time at 18, dropped out of college at 21,5. <br />still navigating what the fuck to do ahead.</p>
              </span>
              <span>
                <p><strong>notable interdisciplinary idols / interests</strong></p>
                <p>michael stevens / vsauce</p>
                <p>adam neely</p>
                <p>martin margiela</p>
                <p>jesper kouthoofd</p>
                <p>carl pei</p>
                <p>tim rodenbröker</p>
                <p>chan karunamuni</p>
                <p>virgil abloh</p>
                <p>edouard manet</p>
                <p>seth mcfarlane</p>
                <p>leo chang</p>
                <p>keiran hebden / four tet</p>
                <p>doug lemoine</p>
                <p>mike schneider</p>
                <p>FKJ</p>
              </span>
              <span>
                <a href="https://linkedin.com/in/owil/" target="_blank" rel="noreferrer">{"corporate"}</a>
                <a href="https://drive.google.com/file/d/1wnpzDhdp48MtSadvQc9Sbi5i7vKP3uiw/view?usp=sharing" target="_blank" rel="noreferrer">{"pause"}</a>
                <a href="mailto:owilhm@gmail.com" target="_blank" rel="noreferrer">{"hmu"}</a>
              </span>
            </p>

            <p data-desc="8" data-text>
              <span>
                <p>📍 vietnam</p>
                <p>🕰️ 2025</p>
              </span>
              An edgy printmaking gallery and studio + coffee shop in Ha Noi, showcasing Viet's rich history during propaganda and renewal period through contemporary ancient & modern fine arts.
              <br />
              <span>T B U</span>
            </p>

            <p data-desc="9" data-text>
              <span>
                <p>📍 vietnam</p>
                <p>🕰️ 2025</p>
              </span>
              A comprehensive super app for Viettel customers in Vietnam that allows you to manage your mobile account, internet, as well as television services, entertainment, and loyalty program.
              <br />
              <span>T B U</span>
            </p>

            <p data-desc="10" data-text>
              <span>
                <p>📍 australia</p>
                <p>🕰️ 2025</p>
              </span>
              An Australian retail pharmacy group with a network of independently owned and operated pharmacies, also includes a certified B Corp management services arm. The pharmacies offer health & wellness prescription, pharmacist consultations, and medication ordering. 
              <br />
              <span>
                <a href="https://joinbloomsthechemist.com.au/" target="_blank" rel="noreferrer">{"live site here"}</a>
              </span>
            </p>

            <p data-desc="11" data-text>
              <span>
                <p>📍 indonesia</p>
                <p>🕰️ 2023</p>
              </span>
              {"A faith-driven digital journal I designed & developed as a non-muslim myself :)"}
              <br />
              <span>T B U</span>
            </p>

            <p data-desc="12" data-text>
              <span>
                <p>📍 indonesia</p>
                <p>🕰️ 2024</p>
              </span>
              The B2B unit of Telkomsel that provides digital solutions and connectivity for corporations to support their digital transformation. Offering advanced network services, communication & collaboration tools, IoT solutions, and CX insights tools. 
              <br />
              <span>T B U</span>
            </p>

          </div>

          {/* add images here */}
        </div>
      </div>

      <div className="cross">
        {/* <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 6L18 18" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg> */}
        <svg width="52" height="52" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* <path d="M0 2.13709L0.432567 1.36051L2.9244 2.87755L2.85129 0H3.71642L3.64331 2.87153L6.13514 1.36051L6.56771 2.13709L4.02714 3.50363L6.56771 4.87016L6.13514 5.64674L3.64331 4.13572L3.71642 7.01327H2.85129L2.9244 4.13572L0.432567 5.64674L0 4.87016L2.53448 3.50363L0 2.13709Z" fill="#161616"/> */}
          <path d="M9.35807 11.3838L9.79064 10.6072L12.2825 12.1242L12.2094 9.24668H13.0745L13.0014 12.1182L15.4932 10.6072L15.9258 11.3838L13.3852 12.7503L15.9258 14.1168L15.4932 14.8934L13.0014 13.3824L13.0745 16.26H12.2094L12.2825 13.3824L9.79064 14.8934L9.35807 14.1168L11.8926 12.7503L9.35807 11.3838Z" fill="#161616"/>
          <path d="M18.7161 20.6305L19.1487 19.8539L21.6405 21.3709L21.5674 18.4934H22.4326L22.3595 21.3649L24.8513 19.8539L25.2839 20.6305L22.7433 21.997L25.2839 23.3635L24.8513 24.1401L22.3595 22.6291L22.4326 25.5066H21.5674L21.6405 22.6291L19.1487 24.1401L18.7161 23.3635L21.2506 21.997L18.7161 20.6305Z" fill="#161616"/>
          <path d="M28.0742 29.8771L28.5068 29.1006L30.9986 30.6176L30.9255 27.74H31.7906L31.7175 30.6116L34.2094 29.1006L34.6419 29.8771L32.1014 31.2437L34.6419 32.6102L34.2094 33.3868L31.7175 31.8758L31.7906 34.7533H30.9255L30.9986 31.8758L28.5068 33.3868L28.0742 32.6102L30.6087 31.2437L28.0742 29.8771Z" fill="#161616"/>
          {/* <path d="M37.4323 39.1238L37.8649 38.3472L40.3567 39.8643L40.2836 36.9867H41.1487L41.0756 39.8583L43.5674 38.3472L44 39.1238L41.4594 40.4904L44 41.8569L43.5674 42.6335L41.0756 41.1225L41.1487 44H40.2836L40.3567 41.1225L37.8649 42.6335L37.4323 41.8569L39.9668 40.4904L37.4323 39.1238Z" fill="#161616"/> */}
          {/* <path d="M37.4323 2.13709L37.8649 1.36051L40.3567 2.87755L40.2836 0H41.1487L41.0756 2.87153L43.5674 1.36051L44 2.13709L41.4594 3.50363L44 4.87016L43.5674 5.64674L41.0756 4.13572L41.1487 7.01327H40.2836L40.3567 4.13572L37.8649 5.64674L37.4323 4.87016L39.9668 3.50363L37.4323 2.13709Z" fill="#161616"/> */}
          <path d="M28.0742 11.3838L28.5068 10.6072L30.9986 12.1242L30.9255 9.24668H31.7906L31.7175 12.1182L34.2094 10.6072L34.6419 11.3838L32.1014 12.7503L34.6419 14.1168L34.2094 14.8934L31.7175 13.3824L31.7906 16.26H30.9255L30.9986 13.3824L28.5068 14.8934L28.0742 14.1168L30.6087 12.7503L28.0742 11.3838Z" fill="#161616"/>
          {/* <path d="M0 39.1238L0.432567 38.3472L2.9244 39.8643L2.85129 36.9867H3.71642L3.64331 39.8583L6.13514 38.3472L6.56771 39.1238L4.02714 40.4904L6.56771 41.8569L6.13514 42.6335L3.64331 41.1225L3.71642 44H2.85129L2.9244 41.1225L0.432567 42.6335L0 41.8569L2.53448 40.4904L0 39.1238Z" fill="#161616"/> */}
          <path d="M9.35807 29.8771L9.79064 29.1006L12.2825 30.6176L12.2094 27.74H13.0745L13.0014 30.6116L15.4932 29.1006L15.9258 29.8771L13.3852 31.2437L15.9258 32.6102L15.4932 33.3868L13.0014 31.8758L13.0745 34.7533H12.2094L12.2825 31.8758L9.79064 33.3868L9.35807 32.6102L11.8926 31.2437L9.35807 29.8771Z" fill="#161616"/>
        </svg>


      </div>
    </main>
  );
}
