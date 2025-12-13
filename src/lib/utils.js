// import imagesLoaded from "imagesloaded";

// /**
//  * Preloads images specified by the CSS selector.
//  * @function
//  * @param {string} [selector='img'] - CSS selector for target images.
//  * @returns {Promise} - Resolves when all specified images are loaded.
//  */
// const preloadImages = (selector = 'img') => {
//   return new Promise((resolve) => {
//     // The imagesLoaded library ensures all images (including background images) are fully loaded.
//     imagesLoaded(document.querySelectorAll(selector), { background: true }, resolve);
//   });
// };

// export { preloadImages };

import imagesLoaded from "imagesloaded";

export const preloadImages = (selector = "img") =>
  new Promise((resolve) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/74707fa5-ac2c-4e51-b5e5-e9cceb5efc6c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'utils.js:22',message:'preloadImages started',data:{selector,hasLoadingClass:document.body.classList.contains('loading'),imageCount:document.querySelectorAll(selector).length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    imagesLoaded(document.querySelectorAll(selector), { background: true }, () => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/74707fa5-ac2c-4e51-b5e5-e9cceb5efc6c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'utils.js:25',message:'preloadImages completed',data:{selector,hasLoadingClass:document.body.classList.contains('loading')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      resolve();
    });
  }
);
