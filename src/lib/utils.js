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
    imagesLoaded(document.querySelectorAll(selector), { background: true }, resolve);
  }
);
