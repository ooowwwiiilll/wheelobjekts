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

export const preloadImages = (selector = "img", onProgress) =>
  new Promise((resolve) => {
    const images = document.querySelectorAll(selector);
    const totalImages = images.length;
    let loadedImages = 0;

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/74707fa5-ac2c-4e51-b5e5-e9cceb5efc6c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'utils.js:22',message:'preloadImages started',data:{selector,hasLoadingClass:document.body.classList.contains('loading'),imageCount:totalImages},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    if (totalImages === 0) {
      resolve();
      return;
    }

    imagesLoaded(images, { background: true })
      .on('progress', (instance, image) => {
        loadedImages++;
        const progress = Math.round((loadedImages / totalImages) * 100);
        if (onProgress) {
          onProgress(progress);
        }
      })
      .on('always', () => {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/74707fa5-ac2c-4e51-b5e5-e9cceb5efc6c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'utils.js:25',message:'preloadImages completed',data:{selector,hasLoadingClass:document.body.classList.contains('loading')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        if (onProgress) {
          onProgress(100);
        }
        resolve();
      });
  }
);
