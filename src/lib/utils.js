
import imagesLoaded from "imagesloaded";

export const preloadImages = (selector = "img", onProgress) =>
  new Promise((resolve) => {
    const images = document.querySelectorAll(selector);
    const totalImages = images.length;
    let loadedImages = 0;



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

        if (onProgress) {
          onProgress(100);
        }
        resolve();
      });
  }
);
