// ─────────────────────────────────────────────────────────────────────────────
// Detail-panel bodies, one per item id — authored ONCE, shared by every mode.
//
// Each value is the INNER content of the `<p data-desc="{id}" data-text>` node that
// DetailPanel renders (see ./DetailPanel.jsx). Plain hand-editable JSX — tweak here
// and it updates in both the root grid and /infinite.
//
// To take an item offline, swap its body for `<>site under construction&nbsp;– TBU</>`
// and keep the real JSX in a comment right below, so reviving = swap the two back.
// ─────────────────────────────────────────────────────────────────────────────

export const bodies = {
  // ── 1 · axisnet ──
  "1": (
    <>
      <span>
        <p>🇮🇩 indonesia</p>
        <p>🕰️ 2024</p>
      </span>
      A self-care application for AXIS customers that allows them to manage their accounts, top up credits & internet packages.
      <span>T B U</span>
    </>
  ),

  // ── 2 · vietinbank efast ──
  "2": (
    <>
      <span>
        <p>🇻🇳 vietnam</p>
        <p>🕰️ 2025</p>
      </span>
      A digital B2B banking service offered by the Vietnam Joint Stock Commercial Bank for Industry and Trade. Allows corporate clients to manage accounts, conduct transactions, and approve payments anytime and anywhere via an internet connection.
      <span>T B U</span>
    </>
  ),

  // ── 3 · gopay ──
  "3": (
    <>
      <span>
        <p>🇮🇩 indonesia</p>
        <p>🕰️ 2025</p>
      </span>
      A recent GoPay digital wallet service integration for Telkomsel users via the MyTelkomsel app, offering convenience and efficiency in transacting Telkomsel services.
      <span>T B U</span>
    </>
  ),

  // ── 4 · kix ──
  "4": (
    <>
      {/* <span className="">indonesia</span> */}
      <span>
        <p>🌎 global</p>
        <p>🕰️ 2023</p>
      </span>

      <span>
        <a href="https://www.wwdcscholars.com/s/53FA3940-93F5-480B-9224-2B0613AEDA6D/2024" target="_blank" rel="noreferrer">{"public press media here"}</a>
      </span>
    </>
  ),

  // ── 5 · mytelkomsel basic ──
  "5": (
    <>
      <span>
        <p>🇮🇩 indonesia</p>
        <p>🕰️ 2024</p>
      </span>
      Emphatising Indonesia's large amount of low-end smartphone users, MyTelkomsel Basic is a  lightweight application from Telkomsel, designed for users with limited memory or in rural & remote areas with unstable internet connections. Provides essential functions such as credit & data balance monitoring, internet & phone package shop, and making payments.
      <span>T B U</span>
    </>
  ),

  // ── 6 · okuri ──
  "6": (
    <>
      <span>
        <p>🌎 global</p>
        <p>🕰️ 2025</p>
      </span>
      <span>
        <p>OKURI is a digital tear-off calendar inspired by the traditional japanese <i>himekuri</i>, with an over-engineered contemporary spin. swipe to flip new sheet each day.</p>
      </span>
      <span>
        <video autoPlay loop muted playsInline controls preload="none" className="details__media" src="/xokuri.mp4"></video>
      </span>
      <span>
        <p><strong>core features</strong></p>
        <p>• realistic paper calendar flipping experience</p>
        <p>• moon phases, zodiac signs, and constellations</p>
        <p>• traditional japanese rokuyo daily fortune</p>
        <p>• sunrise & sunset times for your location</p>
        <p>• visual widgets for your home screen</p>
        <p>• iOS calendar events beautifull integration</p>
        <p>• skin editions a.k.a themes new each month</p>
      </span>
      <span>
        <img className="details__media" src="/mokuri1.jpeg" />
      </span>
      <span>
        <p>under the first month of release, OKURI has been featured by notable advocates like <a href="https://x.com/spottedinprod/status/2044848759629103493?s=46" target="_blank" rel="noreferrer" style={{ display: "inline", padding: 0, fontWeight: "bold" }}>@spottedinprod</a> and <a href="https://x.com/createwithswift/status/2054498700945227836?s=46" target="_blank" rel="noreferrer" style={{ display: "inline", padding: 0, fontWeight: "bold" }}>Create with Swift</a> on X!</p>
      </span>
      <span>
        <img className="details__media" src="/xokuri.png" />
      </span>
      <span>
        <a href="https://apps.apple.com/id/app/okuri/id6759762270" target="_blank" rel="noreferrer">{"download on the app store"}</a>
      </span>
      <span>T B U</span>
    </>
  ),

  // ── 7 · obed willhem ──
  "7": (
    <>
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
        <a href="https://linkedin.com/in/owil/" target="_blank" rel="noreferrer">{"corporate"}</a>
        {/* <a href="https://drive.google.com/file/d/1wnpzDhdp48MtSadvQc9Sbi5i7vKP3uiw/view?usp=sharing" target="_blank" rel="noreferrer">{"pause"}</a> */}
        <a href="mailto:owilhm@gmail.com" target="_blank" rel="noreferrer">{"hmu"}</a>
      </span>
    </>
  ),

  // ── 8 · thanh uy art gallery ──
  "8": (
    <>
      <span>
        <p>🇻🇳 vietnam</p>
        <p>🕰️ 2025</p>
      </span>
      an edgy printmaking gallery and studio + coffee shop in Ha Noi, celebrating Vietnam's rich history during propaganda and renewal period through traditional & contemporary paintings.
      <br />
      <span>T B U</span>
    </>
  ),

  // ── 9 · samosynth ──
  "9": (
    <>
      {/* <span className="">indonesia</span> */}
      <span>
        <p>🌎 global</p>
        <p>🕰️ 2025</p>
      </span>
      <span>
        <img className="details__media" src="/ssamo_dsimulator.png" />
      </span>
      <span>
        <p>
          samosynth is a mini mpc / sampler that celebrates the bataknese culture, by pouring relevant bataknese elements and including easter-eggs into the music experience. the drum kit contains a mix of hip-hop drum samples + processed bataknese traditional instruments (taganing, kulcapi and gordang) one-shots.
        </p>
      </span>
      <span>pad mechanism</span>
      <span>
        <video autoPlay loop playsInline controls muted className="details__media" src="/ssamo_dpads.mp4"></video>
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
        <video autoPlay loop playsInline controls muted className="details__media" src="/ssamo_dtiles.mp4"></video>
      </span>
      <span>
        <p>
          i spent a good amount of time exploring and experimenting on different tile patterns and grid sizes.
        </p>
      </span>
      <span>
        <img className="details__media" src="/ssamo_dgrid.png" />
      </span>
    </>
  ),

  // ── 10 · blooms ──
  "10": (
    <>
      <span>
        <p>🇦🇺 australia</p>
        <p>🕰️ 2025</p>
      </span>
      an Australian retail pharmacy group with a network of independently owned and operated pharmacies, also includes a certified B Corp management services arm. The pharmacies offer health & wellness prescription, pharmacist consultations, and medication ordering.
      <br />
      <span>
        <a href="https://joinbloomsthechemist.com.au/" target="_blank" rel="noreferrer">{"live site here"}</a>
      </span>
    </>
  ),

  // ── 11 · kuttaib ──
  "11": (
    <>
      <span>
        <p>🇮🇩 indonesia</p>
        <p>🕰️ 2023</p>
      </span>
      {"a faith-driven digital journal for muslims that I, a Christian myself, designed & developed :)"}
      <br />
      <span>T B U</span>
    </>
  ),

  // ── 12 · ted ──
  "12": (
    <>
      <span>
        <p>🇮🇩 indonesia</p>
        <p>🕰️ 2024</p>
      </span>
      the B2B unit of Telkomsel that provides digital solutions and connectivity for corporations to support their digital transformation. Offering advanced network services, communication & collaboration tools, IoT solutions, and CX insights tools.
      <br />
      <span>T B U</span>
    </>
  ),

  // ── 13 · kfc ──
  "13": (
    <>
      <span>
        <p>📍 global</p>
        <p>🕰️ 2026</p>
      </span>
      a global multi-brand design system overhaul under Yum! brands.
      <br />
      <span>T B U</span>
    </>
  ),
};
