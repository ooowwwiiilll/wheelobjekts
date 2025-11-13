import React, { useEffect } from "react";
import { initGrid } from "./lib/grid.js";

export default function App() {
  useEffect(() => {
    initGrid();
  }, []);

  return (
    <main>

      <div className="mobile-blocker">
        <p className="mobile__desc">
          optimized for larger screen<br />
          please view this site from desktop
        </p>
        
        <h1 className="mobile__title">(wob)</h1>
        <div className="mobile__desc2">
          <a href="https://linkedin.com/in/owil/" target="_blank" rel="noreferrer">{"corporate"}</a>
          <a href="https://drive.google.com/file/d/1ELcFvAMh2aRTnOf0iTbIWlac8juFh987/view?usp=drive_link" target="_blank" rel="noreferrer">{"pause"}</a>
          <a href="mailto:owilhm@gmail.com" target="_blank" rel="noreferrer">{"message"}</a>
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
          <a className="active" data-filter="all">all</a>
          <a data-filter="A">visuals</a>
          <a data-filter="B">products</a>
          <a data-filter="C">reads</a>
          <a data-filter="D">codes</a>
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
            <div className="product"><div data-id="4"><img src="/skix.png" alt="" /></div></div>
          </div>

          <div className="column">
            <div className="product"><div data-id="5"><img src="/smtb.png" alt="" /></div></div>
            <div className="product"><div data-id="6"><img src="/ssamo.png" alt="" /></div></div>
            <div className="product"><div data-id="7"><img src="/wob.gif" alt="" /></div></div>
            <div className="product"><div data-id="8"><img src="/sthuy.png" alt="" /></div></div>
          </div>

          <div className="column">
            <div className="product"><div data-id="9"><img src="/sviet.png" alt="" /></div></div>
            <div className="product"><div data-id="8"><img src="/sthuy.png" alt="" /></div></div>
            <div className="product"><div data-id="6"><img src="/ssamo.png" alt="" /></div></div>
            <div className="product"><div data-id="5"><img src="/smtb.png" alt="" /></div></div>
          </div>

          <div className="column">
            <div className="product"><div data-id="4"><img src="/skix.png" alt="" /></div></div>
            <div className="product"><div data-id="3"><img src="/sgop.png" alt="" /></div></div>
            <div className="product"><div data-id="2"><img src="/sfast.png" alt="" /></div></div>
            <div className="product"><div data-id="1"><img src="/saxis.png" alt="" /></div></div>
          </div>

          <div className="column">
            <div className="product"><div data-id="1"><img src="/saxis.png" alt="" /></div></div>
            <div className="product"><div data-id="2"><img src="/sfast.png" alt="" /></div></div>
            <div className="product"><div data-id="3"><img src="/sgop.png" alt="" /></div></div>
            <div className="product"><div data-id="4"><img src="/skix.png" alt="" /></div></div>
          </div>

          <div className="column">
            <div className="product"><div data-id="5"><img src="/smtb.png" alt="" /></div></div>
            <div className="product"><div data-id="6"><img src="/ssamo.png" alt="" /></div></div>
            <div className="product"><div data-id="7"><img src="/wob.gif" alt="" /></div></div>
            <div className="product"><div data-id="8"><img src="/sthuy.png" alt="" /></div></div>
          </div>

          <div className="column">
            <div className="product"><div data-id="9"><img src="/sviet.png" alt="" /></div></div>
            <div className="product"><div data-id="8"><img src="/sthuy.png" alt="" /></div></div>
            <div className="product"><div data-id="6"><img src="/ssamo.png" alt="" /></div></div>
            <div className="product"><div data-id="5"><img src="/smtb.png" alt="" /></div></div>
          </div>

          <div className="column">
            <div className="product"><div data-id="4"><img src="/skix.png" alt="" /></div></div>
            <div className="product"><div data-id="3"><img src="/sgop.png" alt="" /></div></div>
            <div className="product"><div data-id="2"><img src="/sfast.png" alt="" /></div></div>
            <div className="product"><div data-id="1"><img src="/saxis.png" alt="" /></div></div>
          </div>

        </div>
      </div>

      <div className="details">
        <div className="details__title">
          <p data-title="1" data-text> axisnet</p>
          <p data-title="2" data-text> vietinbank efast</p>
          <p data-title="3" data-text> gopay</p>
          <p data-title="4" data-text> kix</p>
          <p data-title="5" data-text> mytelkomsel basic</p>
          <p data-title="6" data-text> samosynth</p>
          <p data-title="7" data-text> owillhem.art</p>
          <p data-title="8" data-text> thanh uy art gallery</p>
          <p data-title="9" data-text> viettel</p>
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
              <span>T B U</span>
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
              <span>T B U</span>
            </p>
            <p data-desc="7" data-text>
              an unorthodox generalist wannabe. obsessed about the possible cross function of haute-couture-post-modern-fine-arts + creative tech innovations.
              <br />
              <span>
                <p>paid professional money at 16, worked full-time at 18, dropped out of college at 21,5. <br />not sure what the fuck ahead.</p>
              </span>
              <span>
                <p><strong>notable figures from interdisciplinary spaces that molded me;</strong></p>
                <p>michael stevens / vsauce</p>
                <p>virgil abloh</p>
                <p>adam neely</p>
                <p>tim rodenbröker</p>
                <p>chan karunamuni</p>
                <p>maison martin margiela</p>
                <p>seth mcfarlane</p>
                <p>leo chang</p>
                <p>keiran hebden / four tet</p>
                <p>doug lemoine</p>
                <p>mike schneider</p>
                <p>FKJ</p>
              </span>
              <span>
                <a href="https://linkedin.com/in/owil/" target="_blank" rel="noreferrer">{"corporate  | "}</a>
                <a href="https://drive.google.com/file/d/1ELcFvAMh2aRTnOf0iTbIWlac8juFh987/view?usp=drive_link" target="_blank" rel="noreferrer">{"pause  | "}</a>
                <a href="mailto:owilhm@gmail.com" target="_blank" rel="noreferrer">{"message"}</a>
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
          </div>

          {/* add images here */}
        </div>
      </div>

      <div className="cross">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 6L18 18" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </main>
  );
}
