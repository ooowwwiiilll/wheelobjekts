// Shared texture cache so the same porto image is only decoded once even though
// it appears across many repeated planes. JS port of the reference.
import * as THREE from "three";

const textureCache = new Map();
const loadCallbacks = new Map();
const loader = new THREE.TextureLoader();

const isTextureLoaded = (tex) => {
  const img = tex.image;
  return img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0;
};

export const getTexture = (item, onLoad) => {
  const key = item.url;
  const existing = textureCache.get(key);

  if (existing) {
    if (onLoad) {
      if (isTextureLoaded(existing)) onLoad(existing);
      else loadCallbacks.get(key)?.add(onLoad);
    }
    return existing;
  }

  const callbacks = new Set();
  if (onLoad) callbacks.add(onLoad);
  loadCallbacks.set(key, callbacks);

  const texture = loader.load(
    key,
    (tex) => {
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = true;
      tex.anisotropy = 4;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;

      loadCallbacks.get(key)?.forEach((cb) => {
        try {
          cb(tex);
        } catch (err) {
          console.error(`Callback failed: ${JSON.stringify(err)}`);
        }
      });
      loadCallbacks.delete(key);
    },
    undefined,
    (err) => console.error("Texture load failed:", key, err)
  );

  textureCache.set(key, texture);
  return texture;
};

// ── Animated GIF support ─────────────────────────────────────────────────────
// THREE.TextureLoader only decodes a GIF's first frame, and copying a hidden
// <img> per frame is unreliable (browsers pause GIF playback for images that
// aren't actually painted). So we decode every GIF frame up front with the
// WebCodecs ImageDecoder API and drive them on a timer into a CanvasTexture.
// tickGifs() advances all GIFs once per render frame (cost O(#gifs), not #planes).
const gifCache = new Map();

const makeCanvasTexture = (canvas) => {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 4;
  return texture;
};

export const getGifTexture = (url, onReady) => {
  const existing = gifCache.get(url);
  if (existing) {
    if (onReady) {
      if (existing.ready) onReady(existing);
      else existing.cbs.push(onReady);
    }
    return existing;
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const texture = makeCanvasTexture(canvas);

  const entry = {
    texture,
    canvas,
    ctx,
    ready: false,
    width: 1,
    height: 1,
    frames: [], // [{ bitmap, duration(ms) }]
    totalDuration: 0,
    startTime: 0,
    lastIndex: -1,
    cbs: onReady ? [onReady] : [],
    // Pick the current frame from elapsed time and blit it (only when it changes).
    draw() {
      if (!this.ready || this.frames.length === 0) return;
      if (this.frames.length === 1) {
        if (this.lastIndex !== 0) {
          this.ctx.drawImage(this.frames[0].bitmap, 0, 0, this.canvas.width, this.canvas.height);
          this.texture.needsUpdate = true;
          this.lastIndex = 0;
        }
        return;
      }
      const t = (performance.now() - this.startTime) % this.totalDuration;
      let acc = 0;
      let idx = 0;
      for (let i = 0; i < this.frames.length; i++) {
        acc += this.frames[i].duration;
        if (t < acc) { idx = i; break; }
      }
      if (idx !== this.lastIndex) {
        this.ctx.drawImage(this.frames[idx].bitmap, 0, 0, this.canvas.width, this.canvas.height);
        this.texture.needsUpdate = true;
        this.lastIndex = idx;
      }
    },
  };

  const finish = () => {
    entry.startTime = performance.now();
    entry.ready = true;
    entry.draw();
    entry.cbs.forEach((cb) => cb && cb(entry));
    entry.cbs = [];
  };

  // Fallback: static first frame via a normal <img> (no animation, but visible).
  const fallbackStatic = () => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = img.naturalWidth || 1;
      canvas.height = img.naturalHeight || 1;
      entry.width = canvas.width;
      entry.height = canvas.height;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      entry.frames = [{ bitmap: canvas, duration: 1 }];
      entry.totalDuration = 1;
      entry.lastIndex = -1;
      texture.needsUpdate = true;
      finish();
    };
    img.onerror = (err) => console.error("GIF load failed:", url, err);
    img.src = url;
  };

  // Planes render small, and long GIFs can have hundreds of 1080p frames, so we
  // downscale frames to keep texture memory sane and cap the frame count.
  const DOWNSCALE_MAX = 192; // px, longest edge
  const MAX_FRAMES = 150;

  (async () => {
    try {
      if (typeof ImageDecoder === "undefined") return fallbackStatic();

      const res = await fetch(url);
      const buf = await res.arrayBuffer();
      const decoder = new ImageDecoder({ data: buf, type: "image/gif" });
      await decoder.tracks.ready;

      const track = decoder.tracks.selectedTrack;
      const count = track?.frameCount || 1;

      // dims from frame 0 → downscale factor
      const probe = await decoder.decode({ frameIndex: 0 });
      const w0 = probe.image.displayWidth || probe.image.codedWidth || 1;
      const h0 = probe.image.displayHeight || probe.image.codedHeight || 1;
      probe.image.close();
      const s = Math.min(1, DOWNSCALE_MAX / Math.max(w0, h0));
      const rw = Math.max(1, Math.round(w0 * s));
      const rh = Math.max(1, Math.round(h0 * s));

      const step = Math.max(1, Math.ceil(count / MAX_FRAMES));
      const frames = [];

      for (let i = 0; i < count; i += step) {
        const { image } = await decoder.decode({ frameIndex: i });
        const bitmap = await createImageBitmap(image, {
          resizeWidth: rw,
          resizeHeight: rh,
          resizeQuality: "medium",
        });
        // VideoFrame.duration is microseconds; default 100ms. Scale by step so
        // total playback time stays roughly correct when we skip frames.
        const duration = (image.duration ? image.duration / 1000 : 100) * step;
        image.close();
        frames.push({ bitmap, duration });
      }

      if (frames.length === 0) return fallbackStatic();

      canvas.width = rw;
      canvas.height = rh;
      entry.width = rw;
      entry.height = rh;
      entry.frames = frames;
      entry.totalDuration = frames.reduce((a, f) => a + f.duration, 0) || 1;
      finish();
    } catch (err) {
      console.error("GIF decode failed, using static frame:", url, err);
      fallbackStatic();
    }
  })();

  gifCache.set(url, entry);
  return entry;
};

// Advance every loaded GIF once per animation frame (called from the scene loop).
export const tickGifs = () => {
  gifCache.forEach((entry) => entry.draw());
};
