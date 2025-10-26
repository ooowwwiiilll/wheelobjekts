// import { useState } from 'react'
// // import reactLogo from './assets/react.svg'
// // import viteLogo from '/vite.svg'
// import React from 'react';
// import './App.css'
// import "./css/base.css";
// import "./css/style.css";
// import Grid from "./components/Grid";

// function App() {
//   // const [count, setCount] = useState(0)

//   return (
//     <main>
//       <header className="frame">
//         <h1 className="frame__title">wheel objekts</h1>

//         <div className="frame__links">
//           <a className="frame__back" href="#">reads</a>
//           <a className="frame__back" href="#">tldr</a>
//           <a className="frame__back" href="https://linkedin.com/in/owil/" target="_blank" rel="noreferrer">corporate</a>
//           <a className="frame__back" href="https://drive.google.com/file/d/1ELcFvAMh2aRTnOf0iTbIWlac8juFh987/view?usp=drive_link" target="_blank" rel="noreferrer">pause</a>
//           <a className="frame__back" href="mailto:owilhm@gmail.com" target="_blank" rel="noreferrer">message</a>
//         </div>
//       </header>

//       <Grid />
//     </main>
//   )
// }

// export default App

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
          pls don’t break my site!<br />
          view on bigger screen
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
        <div class="frame__links">
          <a class="frame__back" data-filter="all">all</a>
          <a class="frame__back" data-filter="A">visuals</a>
          <a class="frame__back" data-filter="B">reads</a>
          <a class="frame__back" data-filter="C">codes</a>
        </div>

      </header>

      <div className="container">
        {/* <div className="overlay"></div> */}

        <div className="grid">
          {/* Column 1 */}
          <div className="column">
            <div className="product"><div data-id="1"><img src="/img-1.png" alt="" /></div></div>
            <div className="product"><div data-id="6"><img src="/img-6.png" alt="" /></div></div>
            <div className="product"><div data-id="3"><img src="/img-3.png" alt="" /></div></div>
            <div className="product"><div data-id="8"><img src="/img-8.png" alt="" /></div></div>
            <div className="product"><div data-id="5"><img src="/img-5.png" alt="" /></div></div>
          </div>

          {/* Column 9 (was 2) */}
          <div className="column">
            <div className="product"><div data-id="9"><img src="/img-9.png" alt="" /></div></div>
            <div className="product"><div data-id="2"><img src="/img-2.png" alt="" /></div></div>
            <div className="product"><div data-id="8"><img src="/img-8.png" alt="" /></div></div>
            <div className="product"><div data-id="3"><img src="/img-3.png" alt="" /></div></div>
            <div className="product"><div data-id="7"><img src="/img-7.png" alt="" /></div></div>
          </div>

          {/* Column 3 */}
          <div className="column">
            <div className="product"><div data-id="3"><img src="/img-3.png" alt="" /></div></div>
            <div className="product"><div data-id="8"><img src="/img-8.png" alt="" /></div></div>
            <div className="product"><div data-id="5"><img src="/img-5.png" alt="" /></div></div>
            <div className="product"><div data-id="10"><img src="/img-10.png" alt="" /></div></div>
            <div className="product"><div data-id="1"><img src="/img-1.png" alt="" /></div></div>
          </div>

          {/* Column 4 */}
          <div className="column">
            <div className="product"><div data-id="4"><img src="/img-4.png" alt="" /></div></div>
            <div className="product"><div data-id="9"><img src="/img-9.png" alt="" /></div></div>
            <div className="product"><div data-id="2"><img src="/img-2.png" alt="" /></div></div>
            <div className="product"><div data-id="7"><img src="/img-7.png" alt="" /></div></div>
            <div className="product"><div data-id="6"><img src="/img-6.png" alt="" /></div></div>
          </div>

          {/* Column 10 (was 5) */}
          <div className="column">
            <div className="product"><div data-id="10"><img src="/img-10.png" alt="" /></div></div>
            <div className="product"><div data-id="5"><img src="/img-5.png" alt="" /></div></div>
            <div className="product"><div data-id="6"><img src="/img-6.png" alt="" /></div></div>
            <div className="product"><div data-id="1"><img src="/img-1.png" alt="" /></div></div>
            <div className="product"><div data-id="4"><img src="/img-4.png" alt="" /></div></div>
          </div>

          {/* Column 6 */}
          <div className="column">
            <div className="product"><div data-id="6"><img src="/img-6.png" alt="" /></div></div>
            <div className="product"><div data-id="1"><img src="/img-1.png" alt="" /></div></div>
            <div className="product"><div data-id="7"><img src="/img-7.png" alt="" /></div></div>
            <div className="product"><div data-id="2"><img src="/img-2.png" alt="" /></div></div>
            <div className="product"><div data-id="9"><img src="/img-9.png" alt="" /></div></div>
          </div>

          {/* Column 7 */}
          <div className="column">
            <div className="product"><div data-id="7"><img src="/img-7.png" alt="" /></div></div>
            <div className="product"><div data-id="3"><img src="/img-3.png" alt="" /></div></div>
            <div className="product"><div data-id="10"><img src="/img-10.png" alt="" /></div></div>
            <div className="product"><div data-id="4"><img src="/img-4.png" alt="" /></div></div>
            <div className="product"><div data-id="8"><img src="/img-8.png" alt="" /></div></div>
          </div>

          {/* Column 8 */}
          <div className="column">
            <div className="product"><div data-id="8"><img src="/img-8.png" alt="" /></div></div>
            <div className="product"><div data-id="4"><img src="/img-4.png" alt="" /></div></div>
            <div className="product"><div data-id="9"><img src="/img-9.png" alt="" /></div></div>
            <div className="product"><div data-id="5"><img src="/img-5.png" alt="" /></div></div>
            <div className="product"><div data-id="2"><img src="/img-2.png" alt="" /></div></div>
          </div>

          {/* Column 2 (was 9) */}
          <div className="column">
            <div className="product"><div data-id="2"><img src="/img-2.png" alt="" /></div></div>
            <div className="product"><div data-id="7"><img src="/img-7.png" alt="" /></div></div>
            <div className="product"><div data-id="4"><img src="/img-4.png" alt="" /></div></div>
            <div className="product"><div data-id="9"><img src="/img-9.png" alt="" /></div></div>
            <div className="product"><div data-id="10"><img src="/img-10.png" alt="" /></div></div>
          </div>

          {/* Column 5 (was 10) */}
          <div className="column">
            <div className="product"><div data-id="5"><img src="/img-5.png" alt="" /></div></div>
            <div className="product"><div data-id="10"><img src="/img-10.png" alt="" /></div></div>
            <div className="product"><div data-id="1"><img src="/img-1.png" alt="" /></div></div>
            <div className="product"><div data-id="6"><img src="/img-6.png" alt="" /></div></div>
            <div className="product"><div data-id="3"><img src="/img-3.png" alt="" /></div></div>
          </div>
        </div>
      </div>

      <div className="details">
        <div className="details__title">
          <p data-title="1" data-text> overengineered himekuri</p>
          <p data-title="2" data-text> telkomsel wec</p>
          <p data-title="3" data-text> kix</p>
          <p data-title="4" data-text> samosynth</p>
          <p data-title="5" data-text> tring</p>
          <p data-title="6" data-text> vietinbank efast</p>
          <p data-title="7" data-text> pavel</p>
          <p data-title="8" data-text> kubible</p>
          <p data-title="9" data-text> axisnet</p>
          <p data-title="10" data-text> focalé</p>
        </div>
        <div className="details__body">
          <div className="details__thumb"></div>
          <div className="details__texts">
            <p data-desc="1" data-text>
              <span>$300,00</span>
              This bold red vase stands out with its vibrant hue, a perfect centerpiece to add passion and energy to any
              room. Its smooth surface and classic silhouette make it versatile, equally suited for modern interiors or
              traditional spaces, bringing warmth and a touch of drama wherever it is placed.
              {/* <button>Add to cart</button> */}
            </p>
            <p data-desc="2" data-text>
              <span>$220,00</span>
              With its earthy tones and natural speckled finish, this rustic vase evokes the charm of handcrafted
              pottery. Its organic look and timeless shape give a sense of authenticity, making it an ideal piece to
              display dried flowers or simply as a decorative object that adds warmth and artisanal beauty to your home.
              {/* <button>Add to cart</button> */}
            </p>
            <p data-desc="3" data-text>
              <span>$240,00</span>
              Bright and cheerful, the yellow vase radiates positivity. Its glossy surface reflects light beautifully,
              creating a lively focal point in any setting. Perfect for fresh blooms or displayed on its own, this vase
              captures the essence of sunshine and joy, effortlessly transforming spaces with a vibrant, uplifting touch
              of color.
              {/* <button>Add to cart</button> */}
            </p>
            <p data-desc="4" data-text>
              <span>$300,00</span>
              Generous in size and striking in presence, the large yellow vase makes a bold decorative statement. Its
              smooth curves and sunny shade are perfect for standing on the floor or dressing up a wide console. Both
              functional and eye-catching, it brings vitality and a contemporary edge to your interior design.
              {/* <button>Add to cart</button> */}
            </p>
            <p data-desc="5" data-text>
              <span>$390,00</span>
              Sleek and sophisticated, the black vase embodies timeless elegance. Its deep, rich tone makes it
              versatile, pairing effortlessly with minimalist or luxurious décors. Whether holding fresh greenery or
              standing alone as a sculptural accent, this piece exudes modern refinement and bold simplicity, creating
              contrast and balance within any interior style.
              {/* <button>Add to cart</button> */}
            </p>
            <p data-desc="6" data-text>
              <span>$340,00</span>
              A playful mix of texture and color, the speckled yellow vase is both lively and unique. Its dotted surface creates movement and character, while the bright golden base ensures it remains eye-catching. Perfect for adding personality to your shelf or table, it combines artistic charm with a cheerful, inviting presence.
              {/* <button>Add to cart</button> */}
            </p>
            <p data-desc="7" data-text>
              <span>$240,00</span>
              Crafted from natural wood, this vase celebrates organic beauty and timeless simplicity. The warm tones and
              smooth grain bring an earthy elegance to interiors. Perfect for dried arrangements or as a stand-alone
              piece, it highlights craftsmanship and natural textures, making it a versatile addition to rustic, modern,
              or eclectic décors.
              {/* <button>Add to cart</button> */}
            </p>
            <p data-desc="8" data-text>
              <span>$240,00</span>
              Crafted from natural wood, this vase celebrates organic beauty and timeless simplicity. The warm tones and
              smooth grain bring an earthy elegance to interiors. Perfect for dried arrangements or as a stand-alone
              piece, it highlights craftsmanship and natural textures, making it a versatile addition to rustic, modern,
              or eclectic décors.
              {/* <button>Add to cart</button> */}
            </p>
            <p data-desc="9" data-text>
              <span>$240,00</span>
              Crafted from natural wood, this vase celebrates organic beauty and timeless simplicity. The warm tones and
              smooth grain bring an earthy elegance to interiors. Perfect for dried arrangements or as a stand-alone
              piece, it highlights craftsmanship and natural textures, making it a versatile addition to rustic, modern,
              or eclectic décors.
              {/* <button>Add to cart</button> */}
            </p>
            <p data-desc="10" data-text>
              <span>$240,00</span>
              Crafted from natural wood, this vase celebrates organic beauty and timeless simplicity. The warm tones and
              smooth grain bring an earthy elegance to interiors. Perfect for dried arrangements or as a stand-alone
              piece, it highlights craftsmanship and natural textures, making it a versatile addition to rustic, modern,
              or eclectic décors.
              {/* <button>Add to cart</button> */}
            </p>
          </div>

          <img className="details__img" src="/img-1.png" alt="" />
          <img className="details__img" src="/img-1.png" alt="" />
          <img className="details__img" src="/img-1.png" alt="" />
          <img className="details__img" src="/img-1.png" alt="" />
        </div>
      </div>

      <div className="cross">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18" stroke="#313131" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 6L18 18" stroke="#313131" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </main>
  );
}
