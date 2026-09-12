// ─────────────────────────────────────────────────────────────────────────────
// /lebron17 — GEOMETRY, traced from the shoe.
//
// Every curve below was measured off Nike's own official photography of the
// LeBron 17 (the black/white "Graffiti" pair), by sampling the images pixel by
// pixel rather than by eye:
//
//   · medial profile (1140×800) — 993 px from the heel tip to the toe tip, the
//     ground line at y=680. That sets the scale: 1 px = 3/993 units, so the
//     shoe is 3.0 long and 1.716 tall at the collar's front peak. Every height
//     in RIM, GROUND, MID_TOP, AIR_TOP and CAGE_TOP is a reading off that image.
//   · rear view — the widest point of the shoe is the Air bag at the heel, at
//     0.32 of the length, and the collar closes to about 0.60 of that width.
//   · outsole and heel detail shots — the two forefoot Zoom pods sit side by
//     side, lateral and medial, not one behind the other.
//
// Axes: +X heel → toe · +Y up · +Z medial. 1 unit ≈ 100 mm.
// ─────────────────────────────────────────────────────────────────────────────
import * as THREE from "three";

/* ── small maths ──────────────────────────────────────────────────────────── */
export const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
export const smoothstep = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
export const mix = (a, b, k) => a + (b - a) * k;
const spow = (v, e) => Math.sign(v) * Math.pow(Math.abs(v), e);

export function curve(pts) {
  return (x) => {
    const n = pts.length;
    if (x <= pts[0][0]) return pts[0][1];
    if (x >= pts[n - 1][0]) return pts[n - 1][1];
    let i = 0;
    while (i < n - 2 && pts[i + 1][0] < x) i++;
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(n - 1, i + 2)];
    const t = (x - p1[0]) / (p2[0] - p1[0]), t2 = t * t, t3 = t2 * t;
    return 0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
      (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);
  };
}

/* ── the last, as measured ────────────────────────────────────────────────── */
export const LEN = 3.0;
export const X0 = -1.5;
export const xAt = (t) => X0 + t * LEN;

// Half-width of the sole. Widest under the ball and again at the Air bag; the
// waist pulls in hard, which is what gives the 17 its pinched midfoot.
const W_BASE = curve([
  [0, .150], [.03, .300], [.07, .395], [.12, .442], [.18, .452], [.25, .438],
  [.33, .398], [.42, .352], [.50, .352], [.58, .394], [.66, .444], [.74, .474],
  [.80, .478], [.86, .458], [.92, .412], [.96, .348], [1, .150],
]);
// The lateral side carries the pinky flare, the medial the big-toe flare.
const F_LAT = curve([[0, 1], [.55, 1.01], [.66, 1.045], [.76, 1.03], [.88, 1], [1, 1]]);
const F_MED = curve([[0, 1], [.60, 1], [.74, 1.035], [.84, 1.05], [.93, 1.02], [1, 1]]);
export const halfW = (t, medial) => W_BASE(t) * (medial ? F_MED(t) : F_LAT(t));

// Ground line: flat under the footprint, a hard bevel off the back of the heel
// and a late, steep toe spring — both read straight off the profile.
const GROUND = curve([
  [0, .135], [.012, .108], [.024, .076], [.036, .052], [.050, .022], [.070, .010],
  [.100, .005], [.750, 0], [.880, .008], [.930, .030], [.960, .075], [.980, .165], [1, .305],
]);
export const yGround = (t) => GROUND(t);

// Rubber thickness. It wraps up the sidewall, which is why it reads thick.
const OUT_H = curve([[0, .070], [.05, .098], [.15, .108], [.35, .115], [.55, .118], [.72, .112], [.85, .095], [.94, .072], [1, .045]]);
export const outsoleH = (t) => OUT_H(t);
export const yOutsoleTop = (t) => GROUND(t) + OUT_H(t);

// Top of the sole unit — the line the knit sits on.
const MID_TOP = curve([
  [0, .420], [.06, .420], [.12, .400], [.20, .375], [.30, .345], [.40, .320],
  [.50, .318], [.62, .314], [.72, .305], [.82, .285], [.90, .268], [.96, .255], [1, .250],
]);
export const ySoleTop = (t) => MID_TOP(t);

// The Max Air 720 bag: measured top edge, tapering out at 42% of the length.
const AIR_TOP = curve([[0, .330], [.04, .365], [.09, .378], [.14, .362], [.20, .305], [.26, .253], [.32, .205], [.38, .160], [.42, .132]]);
export const airTop = (t) => (t > 0.43 ? 0 : Math.max(0, AIR_TOP(t) - yOutsoleTop(t)));

// The translucent TPU cradle around the heel, and the swoosh rides on it.
const CAGE_TOP = curve([[0, .520], [.06, .600], [.12, .620], [.20, .598], [.28, .540], [.36, .450], [.44, .362], [.50, .318], [.53, .300]]);

// The topline of the upper. Two points: the rear tab at t=0.127 and the taller
// ankle peak at t=0.296, with the collar's notch between them.
const RIM = curve([
  [.030, .620], [.040, .800], [.050, .910], [.062, .990], [.075, 1.090], [.088, 1.200],
  [.100, 1.310], [.110, 1.440], [.120, 1.520], [.127, 1.599], [.134, 1.500], [.141, 1.380],
  [.149, 1.330], [.162, 1.336], [.175, 1.378], [.195, 1.408], [.215, 1.425], [.232, 1.489], [.254, 1.535],
  [.272, 1.589], [.285, 1.695], [.296, 1.716], [.310, 1.688], [.322, 1.660], [.334, 1.622],
  [.350, 1.530], [.370, 1.505], [.381, 1.462], [.405, 1.387], [.429, 1.317], [.453, 1.269],
  [.477, 1.211], [.502, 1.148], [.526, 1.121], [.550, 1.048], [.574, .988], [.598, .949],
  [.622, .909], [.647, .879], [.671, .819], [.695, .792], [.719, .755], [.743, .725],
  [.767, .716], [.792, .680], [.816, .649], [.840, .634], [.864, .610], [.912, .600],
  [.937, .574], [.961, .568], [.979, .529], [1, .462],
])
export const yRim = (t) => RIM(t);

// Where the shoe is open: the ankle mouth, then a narrow lace slot forward of it.
const OPEN = (t) => smoothstep(.115, .162, t) * (1 - smoothstep(.300, .348, t));
const THROAT = (t) => smoothstep(.300, .340, t) * (1 - smoothstep(.520, .585, t));

/* ── surfaces ─────────────────────────────────────────────────────────────── */
const bell = (u, bw) => Math.cos(Math.min(Math.PI, (Math.abs(u - 0.5) / bw) * Math.PI)) * 0.5 + 0.5;

// The knit shell. u = 0 lateral at the sole, 0.5 over the centre, 1 medial.
// The section narrows as it climbs: measured, the collar is 0.6 of the width of
// the sole under it, which is most of why the 17 reads tall rather than fat.
export function upperPoint(t, u, out = new THREE.Vector3()) {
  const a = Math.PI * u;
  const c = Math.cos(a);
  const open = OPEN(t), thr = THROAT(t);
  const base = MID_TOP(t) - 0.018;
  const rim = RIM(t);
  const roof = rim
    - (rim - (base + 0.040)) * open * bell(u, 0.15 + 0.17 * open)
    - 0.085 * thr * bell(u, 0.125);
  const k = Math.min(u, 1 - u) * 2;
  const rise = mix(Math.pow(Math.sin(a), 0.62), smoothstep(0, 0.26, k), Math.max(open, thr * 0.55));
  const y = base + (roof - base) * rise;
  const hf = clamp01((y - base) / Math.max(0.001, rim - base));
  const w = halfW(t, c < 0) * 0.955 * (1 - 0.42 * Math.pow(hf, 1.20));
  return out.set(xAt(t), y, -w * spow(c, 0.52 - 0.18 * Math.max(open, thr)));
}

// The moulded TPU cradle: same idea, but a U with no roof, so it reads as a cup
// the knit stands in rather than a bowl over it.
export function cagePoint(t, u, out = new THREE.Vector3()) {
  const a = Math.PI * u;
  const c = Math.cos(a);
  const base = MID_TOP(t) - 0.10;
  const top = Math.max(base + 0.004, CAGE_TOP(t));
  const k = Math.min(u, 1 - u) * 2;
  const rise = smoothstep(0, 0.22, k);
  const y = base + (top - base) * rise;
  const hf = clamp01((y - base) / Math.max(0.001, top - base));
  const w = halfW(t, c < 0) * 1.012 * (1 - 0.16 * Math.pow(hf, 1.4));
  return out.set(xAt(t), y, -w * spow(c, 0.40));
}

/* ── builders ─────────────────────────────────────────────────────────────── */
function orient(geo, c) {
  const pos = geo.attributes.position, nor = geo.attributes.normal;
  const step = Math.max(1, Math.floor(pos.count / 240));
  let d = 0;
  for (let i = 0; i < pos.count; i += step) {
    d += (pos.getX(i) - c.x) * nor.getX(i) + (pos.getY(i) - c.y) * nor.getY(i) + (pos.getZ(i) - c.z) * nor.getZ(i);
  }
  if (d < 0) {
    const ix = geo.index.array;
    for (let i = 0; i < ix.length; i += 3) { const s = ix[i]; ix[i] = ix[i + 2]; ix[i + 2] = s; }
    geo.index.needsUpdate = true;
    geo.computeVertexNormals();
  }
  return geo;
}

const finish = (pos, idx, centre, uv) => {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  if (uv) g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  g.computeBoundingSphere();
  return orient(g, centre ?? g.boundingSphere.center);
};

export function loftSolid(rings) {
  const T = rings.length, N = rings[0].length;
  const pos = [], idx = [], uv = [];
  for (let i = 0; i < T; i++) for (let j = 0; j < N; j++) {
    const p = rings[i][j];
    pos.push(p.x, p.y, p.z);
    uv.push(j / N, i / (T - 1));
  }
  for (let i = 0; i < T - 1; i++) for (let j = 0; j < N; j++) {
    const j2 = (j + 1) % N;
    idx.push(i * N + j, i * N + j2, (i + 1) * N + j2, i * N + j, (i + 1) * N + j2, (i + 1) * N + j);
  }
  for (const [ri, flip] of [[0, true], [T - 1, false]]) {
    const c = new THREE.Vector3();
    rings[ri].forEach((p) => c.add(p));
    c.multiplyScalar(1 / N);
    const b = pos.length / 3;
    pos.push(c.x, c.y, c.z);
    uv.push(0.5, ri / (T - 1));
    for (let j = 0; j < N; j++) {
      const a = ri * N + j, d = ri * N + ((j + 1) % N);
      idx.push(b, flip ? d : a, flip ? a : d);
    }
  }
  return finish(pos, idx, null, uv);
}

export function loftShell(rings, thickness) {
  const T = rings.length, N = rings[0].length;
  const nrm = [];
  for (let i = 0; i < T; i++) {
    const row = [];
    for (let j = 0; j < N; j++) {
      const dt = new THREE.Vector3().subVectors(rings[Math.min(T - 1, i + 1)][j], rings[Math.max(0, i - 1)][j]);
      const du = new THREE.Vector3().subVectors(rings[i][Math.min(N - 1, j + 1)], rings[i][Math.max(0, j - 1)]);
      row.push(new THREE.Vector3().crossVectors(du, dt).normalize());
    }
    nrm.push(row);
  }
  const c = new THREE.Vector3();
  rings.forEach((r) => r.forEach((p) => c.add(p)));
  c.multiplyScalar(1 / (T * N));
  let d = 0;
  for (let i = 0; i < T; i += 2) for (let j = 0; j < N; j += 2) d += nrm[i][j].dot(new THREE.Vector3().subVectors(rings[i][j], c));
  const sign = d < 0 ? -1 : 1;

  const pos = [], idx = [], uv = [];
  const push = (p) => pos.push(p.x, p.y, p.z);
  for (let i = 0; i < T; i++) for (let j = 0; j < N; j++) { push(rings[i][j]); uv.push(j / (N - 1), i / (T - 1)); }
  const IN = T * N;
  for (let i = 0; i < T; i++) for (let j = 0; j < N; j++) {
    push(new THREE.Vector3().copy(rings[i][j]).addScaledVector(nrm[i][j], -sign * thickness));
    uv.push(j / (N - 1), i / (T - 1));
  }
  const quad = (a, b, cc, dd) => idx.push(a, b, cc, a, cc, dd);
  for (let i = 0; i < T - 1; i++) for (let j = 0; j < N - 1; j++) {
    quad(i * N + j, i * N + j + 1, (i + 1) * N + j + 1, (i + 1) * N + j);
    quad(IN + i * N + j, IN + (i + 1) * N + j, IN + (i + 1) * N + j + 1, IN + i * N + j + 1);
  }
  for (let i = 0; i < T - 1; i++) {
    quad(i * N, (i + 1) * N, IN + (i + 1) * N, IN + i * N);
    quad(i * N + N - 1, IN + i * N + N - 1, IN + (i + 1) * N + N - 1, (i + 1) * N + N - 1);
  }
  for (const [i, flip] of [[0, false], [T - 1, true]]) {
    for (let j = 0; j < N - 1; j++) {
      const a = i * N + j, b = i * N + j + 1;
      if (flip) quad(a, b, IN + b, IN + a); else quad(a, IN + a, IN + b, b);
    }
  }
  return finish(pos, idx, c, uv);
}

// A moulded strand laid on a surface: give it a path in (t, u) and it follows
// the skin, standing proud of it.
export function ribbon(surf, path, { width = 0.05, height = 0.02, steps = 90, lift = 0, N = 10, taper = 0 } = {}) {
  const spline = new THREE.CatmullRomCurve3(path.map(([t, u]) => new THREE.Vector3(t, u, 0)));
  const rings = [];
  const E = 0.004;
  for (let s = 0; s <= steps; s++) {
    const p = spline.getPoint(s / steps);
    const t = clamp01(p.x), u = clamp01(p.y);
    const P = surf(t, u);
    const dt = surf(clamp01(t + E), u).sub(P);
    const du = surf(t, clamp01(u + E)).sub(P);
    const nrm = new THREE.Vector3().crossVectors(du, dt).normalize();
    if (nrm.dot(new THREE.Vector3(P.x, P.y - 0.55, P.z * 1.8)) < 0) nrm.negate();
    const q = spline.getPoint(clamp01(s / steps + 0.01));
    const dir = surf(clamp01(q.x), clamp01(q.y)).sub(P).normalize();
    const across = new THREE.Vector3().crossVectors(nrm, dir).normalize();
    const base = P.clone().addScaledVector(nrm, lift);
    const k = taper > 0 ? 0.12 + 0.88 * Math.min(1, Math.min(s, steps - s) / (steps * taper)) : 1;
    const ring = [];
    for (let j = 0; j < N; j++) {
      const a = (j / N) * Math.PI * 2;
      ring.push(base.clone()
        .addScaledVector(across, width * k * spow(Math.cos(a), 0.45))
        .addScaledVector(nrm, height * k * 0.5 + height * k * 0.5 * spow(Math.sin(a), 0.45)));
    }
    rings.push(ring);
  }
  return loftSolid(rings);
}

// A flat shape triangulated and then pushed through a surface, so a logo sits
// on the curve of the panel instead of floating off it.
export function surfaceDecal(surf, shape, { t0, t1, u0, u1, lift = 0.010, curveSegments = 26 }) {
  const sg = new THREE.ShapeGeometry(shape, curveSegments);
  sg.computeBoundingBox();
  const bb = sg.boundingBox;
  const pos = sg.attributes.position;
  const P = new THREE.Vector3(), N = new THREE.Vector3();
  const E = 0.004;
  for (let i = 0; i < pos.count; i++) {
    const nx = (pos.getX(i) - bb.min.x) / (bb.max.x - bb.min.x);
    const ny = (pos.getY(i) - bb.min.y) / (bb.max.y - bb.min.y);
    const t = clamp01(mix(t0, t1, nx)), u = clamp01(mix(u0, u1, ny));
    P.copy(surf(t, u));
    const dt = surf(clamp01(t + E), u).sub(P);
    const du = surf(t, clamp01(u + E)).sub(P);
    N.crossVectors(du, dt).normalize();
    if (N.dot(new THREE.Vector3(P.x, P.y - 0.55, P.z * 1.8)) < 0) N.negate();
    pos.setXYZ(i, P.x + N.x * lift, P.y + N.y * lift, P.z + N.z * lift);
  }
  pos.needsUpdate = true;
  sg.computeVertexNormals();
  return orient(sg, new THREE.Vector3(0, 0.55, 0));
}

// Where on the section's arc the skin reaches a given height. Used to lay the
// heel ribs along true horizontal contours, the way they run on the shoe.
// Walk up the OUTER wall only and take the first crossing. Past the mouth the
// section turns back down into the shoe, and a nearest-match search would jump
// the rib to the inside of the collar.
function uAtHeight(t, y) {
  let prevU = 0, prevY = upperPoint(t, 0).y;
  for (let i = 1; i <= 200; i++) {
    const u = (i / 200) * 0.5;
    const cur = upperPoint(t, u).y;
    if (cur < prevY - 1e-4) return -1;          // over the crest, stop
    if (cur >= y) return mix(prevU, u, (y - prevY) / Math.max(1e-6, cur - prevY));
    prevU = u; prevY = cur;
  }
  return -1;
}

// One rib: down the lateral wall, round the back, up the medial wall, holding a
// height that dips toward the centre — the chevron stack on the 17's heel.
function ribContour(h0, tFront) {
  const hAt = (t) => h0 - 0.13 * (1 - smoothstep(0.03, 0.22, t));
  const lat = [], med = [];
  let back = null;
  for (let i = 0; i <= 26; i++) {
    const t = tFront - (tFront - 0.026) * (i / 26);
    const u = uAtHeight(t, hAt(t));
    if (u < 0) continue;
    lat.push([t, u]);
    med.unshift([t, 1 - u]);
    back = [t, u];
  }
  if (!back) return [];
  // pin the turn across the back at one station, or the spline bows forward and
  // rides up the dome instead of wrapping the heel
  const cross = [];
  for (let i = 1; i < 8; i++) cross.push([back[0], mix(back[1], 1 - back[1], i / 8)]);
  return lat.concat(cross, med);
}

/* ── the parts ────────────────────────────────────────────────────────────── */
const stations = (from, to, n) => Array.from({ length: n }, (_, i) => from + (to - from) * (i / (n - 1)));

function soleRing(t, yBot, yTop, N, inset, sharpZ = 0.50, sharpY = 0.42) {
  const pts = [];
  const midY = (yBot + yTop) / 2, halfH = (yTop - yBot) / 2;
  for (let j = 0; j < N; j++) {
    const a = (j / N) * Math.PI * 2;
    const c = Math.cos(a), s = Math.sin(a);
    const w = halfW(t, c < 0) * inset;
    pts.push(new THREE.Vector3(xAt(t), midY + halfH * spow(s, sharpY), -w * spow(c, sharpZ)));
  }
  return pts;
}

const soleLoft = (from, to, n, bot, top, inset, N = 44) =>
  loftSolid(stations(from, to, n).map((t) => soleRing(t, bot(t), top(t), N, inset(t))));

// One forefoot pod: an oval bag on one side of the split, tapering at both ends.
function podLoft(zc, from, to, hw, height) {
  const N = 26;
  return loftSolid(stations(from, to, 30).map((t) => {
    const k = Math.sin(Math.PI * clamp01((t - from) / (to - from)));
    const w = hw * Math.pow(k, 0.42);
    const yb = yOutsoleTop(t) - 0.004;
    const h = height * Math.pow(k, 0.22);
    const pts = [];
    for (let j = 0; j < N; j++) {
      const a = (j / N) * Math.PI * 2;
      pts.push(new THREE.Vector3(xAt(t), yb + h / 2 + (h / 2) * spow(Math.sin(a), 0.45),
        zc + w * spow(Math.cos(a), 0.55)));
    }
    return pts;
  }));
}

function podFibres(zc, from, to, hw, height, count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const f = (i % 9) / 8, g = Math.floor(i / 9) / Math.max(1, Math.ceil(count / 9) - 1);
    const t = mix(from + 0.03, to - 0.03, g + (Math.random() - 0.5) * 0.05);
    const tt = clamp01(t);
    const k = Math.sin(Math.PI * clamp01((tt - from) / (to - from)));
    const w = hw * Math.pow(Math.max(k, 0.001), 0.42) * 0.78;
    const z = zc + mix(-w, w, f + (Math.random() - 0.5) * 0.08);
    const yb = yOutsoleTop(tt) + 0.012;
    const h = Math.max(0.02, height * Math.pow(Math.max(k, 0.001), 0.22) - 0.026);
    out.push({ x: xAt(tt), z, y: yb + h / 2, h });
  }
  return out;
}

export function buildParts() {
  const U_N = 64;
  const upperRings = stations(0.045, 0.988, 132).map((t) =>
    Array.from({ length: U_N }, (_, j) => upperPoint(t, j / (U_N - 1))));
  const cageRings = stations(0.004, 0.532, 62).map((t) =>
    Array.from({ length: 46 }, (_, j) => cagePoint(t, j / 45)));

  // Heel chevrons: five moulded ribs nested up the back, each wrapping from the
  // lateral wall round the heel to the medial one. Straight off the rear view.
  const chevrons = [];
  [[0.720, 0.245], [0.900, 0.240], [1.075, 0.232], [1.240, 0.220]]
    .forEach(([h, tf]) => {
      const path = ribContour(h, tf);
      if (path.length > 6) chevrons.push(ribbon(upperPoint, path, { width: 0.078, height: 0.015, steps: 150, lift: 0.003, taper: 0.07 }));
    });

  // Lace loops: five moulded eyelets each side, sitting on the throat edge.
  const eyeT = [0.330, 0.378, 0.426, 0.474, 0.522];
  const eyestay = [];
  for (const side of [-1, 1]) {
    const u0 = side < 0 ? 0.175 : 0.825;      // the throat edge, each side
    const inward = side < 0 ? 1 : -1;         // toward the centre line
    eyestay.push(ribbon(upperPoint, [[0.290, u0], [0.380, u0], [0.470, u0], [0.545, u0 - inward * 0.02]],
      { width: 0.032, height: 0.015, steps: 44, lift: 0.004 }));
    for (const t of eyeT) {
      eyestay.push(ribbon(upperPoint,
        [[t - 0.020, u0 - inward * 0.035], [t, u0 + inward * 0.022], [t + 0.020, u0 - inward * 0.035]],
        { width: 0.015, height: 0.012, steps: 22, lift: 0.006 }));
    }
  }
  const laces = [];
  for (let i = 0; i < eyeT.length - 1; i++) {
    for (const [ua, ub] of [[0.185, 0.815], [0.815, 0.185]]) {
      const A = upperPoint(eyeT[i], ua), B = upperPoint(eyeT[i + 1], ub);
      const M = A.clone().add(B).multiplyScalar(0.5);
      M.y += 0.038; M.z *= 0.22;
      laces.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([A, M, B]), 24, 0.017, 9, false));
    }
  }

  // The swoosh rides on the TPU cradle, tail forward and low, tip back and high.
  const sw = new THREE.Shape();
  sw.moveTo(0, 0.150);
  sw.bezierCurveTo(0.34, -0.020, 0.66, -0.040, 1.00, 0.400);
  sw.lineTo(0.905, 0.435);
  sw.bezierCurveTo(0.620, 0.140, 0.340, 0.100, 0.020, 0.205);
  sw.closePath();

  const outTop = (t) => yOutsoleTop(t);
  const airBot = (t) => yOutsoleTop(t) - 0.006;

  return {
    outsole: soleLoft(0.004, 0.996, 88, yGround, outTop, () => 1.0),
    // the bag flares proud of the foam sitting on it — the widest point of the shoe
    air720: soleLoft(0.004, 0.430, 46, airBot, (t) => Math.max(airBot(t) + 0.006, AIR_TOP(t)), () => 1.005, 40),
    air720Seams: [0.30, 0.62].map((k) => {
      const t = mix(0.02, 0.40, k);
      const y = mix(airBot(t), AIR_TOP(t), 0.5);
      return Array.from({ length: 65 }, (_, j) => {
        const a = (j / 64) * Math.PI * 2, c = Math.cos(a);
        return new THREE.Vector3(xAt(t), y, -halfW(t, c < 0) * 1.012 * spow(c, 0.5));
      });
    }),
    podLat: podLoft(-0.235, 0.575, 0.925, 0.185, 0.150),
    podMed: podLoft(0.235, 0.560, 0.915, 0.185, 0.150),
    fibresLat: podFibres(-0.235, 0.575, 0.925, 0.185, 0.150, 90),
    fibresMed: podFibres(0.235, 0.560, 0.915, 0.185, 0.150, 90),

    midsole: soleLoft(0.330, 0.996, 74,
      (t) => Math.max(outTop(t), t < 0.43 ? AIR_TOP(t) : 0) - 0.004, ySoleTop, () => 0.975),
    sockliner: soleLoft(0.03, 0.97, 46, ySoleTop, (t) => ySoleTop(t) + 0.020, () => 0.90, 34),

    upper: loftShell(upperRings, 0.024),
    heelCage: loftShell(cageRings, 0.020),
    chevrons,
    collar: ribbon(upperPoint, [
      [0.322, 0.222], [0.280, 0.196], [0.235, 0.180], [0.190, 0.172], [0.155, 0.180],
      [0.128, 0.300], [0.116, 0.500], [0.128, 0.700], [0.155, 0.820], [0.190, 0.828],
      [0.235, 0.820], [0.280, 0.804], [0.322, 0.778],
    ], { width: 0.046, height: 0.030, steps: 130, lift: 0.008 }),
    eyestay,
    laces,
    swooshLat: surfaceDecal(cagePoint, sw, { t0: 0.470, t1: 0.100, u0: 0.055, u1: 0.330 }),
    swooshMed: surfaceDecal(cagePoint, sw, { t0: 0.470, t1: 0.100, u0: 0.945, u1: 0.670 }),
  };
}
