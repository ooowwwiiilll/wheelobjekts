export function pixelateImage(imgElement, opts = {}) {
    const boxes = opts.boxes || 10;
    const defer = opts.defer !== false;
  
    const parent = imgElement.parentElement;
    if (!parent) return;
  
    const computed = window.getComputedStyle(parent);
    if (computed.position === "static") {
      parent.style.position = "relative";
    }
    parent.style.overflow = "hidden";
  
    const overlay = document.createElement("canvas");
    overlay.style.position = "absolute";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.pointerEvents = "none";
    overlay.style.transition = "opacity 360ms cubic-bezier(.22,1,.36,1)";
    overlay.style.zIndex = 2;
    overlay.style.opacity = 1;
  
    parent.appendChild(overlay);
  
    parent.addEventListener("mouseenter", () => {
      overlay.style.opacity = 0;
    });
    parent.addEventListener("mouseleave", () => {
      overlay.style.opacity = 1;
    });
  
    const doPixelate = () => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imgElement.currentSrc || imgElement.src;
  
      const draw = () => {
        const dstW = imgElement.naturalWidth || img.width;
        const dstH = imgElement.naturalHeight || img.height;
        if (!dstW || !dstH) return;
  
        overlay.width = dstW;
        overlay.height = dstH;
  
        const small = document.createElement("canvas");
        small.width = boxes;
        small.height = boxes;
        const sctx = small.getContext("2d");
        sctx.drawImage(img, 0, 0, boxes, boxes);
  
        const octx = overlay.getContext("2d");
        octx.imageSmoothingEnabled = false;
        octx.clearRect(0, 0, overlay.width, overlay.height);
        octx.drawImage(small, 0, 0, overlay.width, overlay.height);
      };
  
      if (img.complete && img.naturalWidth) draw();
      else img.onload = draw;
    };
  
    if (defer) setTimeout(doPixelate, 50);
    else doPixelate();
  
    // return controllable object
    return {
      overlay,
      enable: () => (overlay.style.display = "block"),
      disable: () => (overlay.style.display = "none"),
      refresh: doPixelate,
    };
  }
  