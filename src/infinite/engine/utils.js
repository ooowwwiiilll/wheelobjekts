// ─────────────────────────────────────────────────────────────────────────────
// Math + chunk helpers for the infinite canvas engine.
// Adapted (JS port) from edoardolunardi/infinite-canvas (MIT). See NOTES.md.
// ─────────────────────────────────────────────────────────────────────────────
import * as THREE from "three";
import { CHUNK_SIZE } from "./constants.js";

export const run = (fn) => fn();

export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

export const lerp = (a, b, t) => a + (b - a) * t;

export const seededRandom = (seed) => {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
};

export const hashString = (str) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return Math.abs(h);
};

// ── plane cache (LRU-ish) ──────────────────────────────────────────────────
const MAX_PLANE_CACHE = 256;
const planeCache = new Map();

const touchPlaneCache = (key) => {
  const v = planeCache.get(key);
  if (!v) return;
  planeCache.delete(key);
  planeCache.set(key, v);
};

const evictPlaneCache = () => {
  while (planeCache.size > MAX_PLANE_CACHE) {
    const firstKey = planeCache.keys().next().value;
    if (!firstKey) break;
    planeCache.delete(firstKey);
  }
};

export const getChunkUpdateThrottleMs = (isZooming, zoomSpeed) => {
  if (zoomSpeed > 1.0) return 500;
  if (isZooming) return 400;
  return 100;
};

// 5 planes per chunk, randomly placed + sized within the chunk volume.
export const generateChunkPlanes = (cx, cy, cz) => {
  const planes = [];
  const seed = hashString(`${cx},${cy},${cz}`);

  for (let i = 0; i < 5; i++) {
    const s = seed + i * 1000;
    const r = (n) => seededRandom(s + n);
    const size = 12 + r(4) * 8;

    planes.push({
      id: `${cx}-${cy}-${cz}-${i}`,
      position: new THREE.Vector3(
        cx * CHUNK_SIZE + r(0) * CHUNK_SIZE,
        cy * CHUNK_SIZE + r(1) * CHUNK_SIZE,
        cz * CHUNK_SIZE + r(2) * CHUNK_SIZE
      ),
      scale: new THREE.Vector3(size, size, 1),
      mediaIndex: Math.floor(r(5) * 1_000_000),
    });
  }

  return planes;
};

export const generateChunkPlanesCached = (cx, cy, cz) => {
  const key = `${cx},${cy},${cz}`;
  const cached = planeCache.get(key);
  if (cached) {
    touchPlaneCache(key);
    return cached;
  }

  const planes = generateChunkPlanes(cx, cy, cz);
  planeCache.set(key, planes);
  evictPlaneCache();
  return planes;
};

export const shouldThrottleUpdate = (lastUpdateTime, throttleMs, currentTime) =>
  currentTime - lastUpdateTime >= throttleMs;
