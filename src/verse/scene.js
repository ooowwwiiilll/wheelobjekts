// ─────────────────────────────────────────────────────────────────────────────
// /verse engine — a gallery on the inside of a sphere.
//
// The camera sits at the sphere's center; cards are laid out on the inner
// surface in a lat/long grid, all facing inward. Dragging (or wheel) orbits the
// card group with lenis-style lerp easing + release inertia. Clicking a card
// detaches it and morphs it toward the camera (GSAP) while the rest dim — the
// React shell then slides the detail panel in. Fully self-contained: vanilla
// three.js + gsap, no r3f.
// ─────────────────────────────────────────────────────────────────────────────
import * as THREE from "three";
import { gsap } from "gsap";

const RADIUS = 30;
const COLS = 12;                                     // cards per ring
const ROWS = [-0.72, -0.435, -0.145, 0.145, 0.435, 0.72]; // ring latitudes (rad)
const CARD_W = 10.5;
const CARD_H = 6.4;
const ROT_X_CLAMP = 0.8;                             // don't flip over the poles
const EASE = 0.075;                                  // rotation lerp factor

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// ── shared caches (textures reused across repeated cards) ──
const texCache = new Map();
const labelCache = new Map();

// center-crop ("object-fit: cover") a texture onto the card aspect
const applyCover = (tex) => {
  const img = tex.image;
  if (!img || !img.width) return;
  const ia = img.width / img.height;
  const ca = CARD_W / CARD_H;
  if (ia > ca) {
    tex.repeat.set(ca / ia, 1);
    tex.offset.set((1 - ca / ia) / 2, 0);
  } else {
    tex.repeat.set(1, ia / ca);
    tex.offset.set(0, (1 - ia / ca) / 2);
  }
  tex.needsUpdate = true;
};

// small mono caption under each card (canvas texture, cached per item)
const getLabelTexture = (title, id) => {
  const key = `${id}|${title}`;
  if (labelCache.has(key)) return labelCache.get(key);
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 56;
  const ctx = c.getContext("2d");
  ctx.font = "400 26px monospace";
  ctx.fillStyle = "#c9c9c9";
  ctx.textBaseline = "middle";
  ctx.fillText(title.toUpperCase(), 4, 30);
  ctx.textAlign = "right";
  ctx.fillText(`©${String(id).padStart(2, "0")}`, 508, 30);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  labelCache.set(key, tex);
  return tex;
};

export class VerseScene {
  constructor(container, media, callbacks = {}) {
    this.container = container;
    this.media = media;
    this.cb = callbacks;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setClearColor(0x121212, 1);
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      120
    );

    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.cards = [];
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.hasPointer = false;

    this.state = {
      rot: { x: 0, y: -0.85 },     // intro glides from here…
      target: { x: 0, y: 0 },      // …to here
      vel: { x: 0, y: 0 },
      dragging: false,
      down: null,
      last: { x: 0, y: 0 },
      enabled: false,
      hovered: null,
      selected: null,
    };

    this._build();
    this._bind();
    this._tick = this._tick.bind(this);
    this._raf = requestAnimationFrame(this._tick);

    if (typeof window !== "undefined") window.__verseDebug = this;
  }

  // ── layout: rows of cards on the sphere's inner surface ──
  _build() {
    const manager = new THREE.LoadingManager();
    manager.onProgress = (url, loaded, total) =>
      this.cb.onProgress?.(Math.round((loaded / total) * 100));
    manager.onLoad = () => {
      this.cb.onLoaded?.();
      this._intro();
    };
    const loader = new THREE.TextureLoader(manager);

    const getTex = (src) => {
      if (texCache.has(src)) return texCache.get(src);
      const tex = loader.load(src, (t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        applyCover(t);
      });
      texCache.set(src, tex);
      return tex;
    };

    const cardGeo = new THREE.PlaneGeometry(CARD_W, CARD_H);
    const labelH = CARD_W * (56 / 512);
    const labelGeo = new THREE.PlaneGeometry(CARD_W, labelH);

    let slot = 0;
    for (let r = 0; r < ROWS.length; r++) {
      const phi = ROWS[r];
      for (let c = 0; c < COLS; c++) {
        const item = this.media[slot % this.media.length];
        slot++;

        const theta = (c / COLS) * Math.PI * 2;
        const x = RADIUS * Math.cos(phi) * Math.sin(theta);
        const y = RADIUS * Math.sin(phi);
        const z = RADIUS * Math.cos(phi) * Math.cos(theta);

        const mat = new THREE.MeshBasicMaterial({
          map: getTex(item.src),
          transparent: true,
          opacity: 0, // intro fades in
        });
        const mesh = new THREE.Mesh(cardGeo, mat);
        mesh.position.set(x, y, z);
        mesh.lookAt(0, 0, 0); // face the camera at the center

        const labelMat = new THREE.MeshBasicMaterial({
          map: getLabelTexture(item.title, item.id),
          transparent: true,
          opacity: 0,
        });
        const label = new THREE.Mesh(labelGeo, labelMat);
        label.position.set(0, -(CARD_H / 2 + labelH / 2 + 0.45), 0);
        mesh.add(label);

        mesh.userData = { item, label };
        this.group.add(mesh);
        this.cards.push(mesh);
      }
    }
  }

  _intro() {
    // cards + captions stagger in while the sphere glides to rest
    gsap.to(this.cards.map((c) => c.material), {
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
      stagger: { amount: 1.1, from: "random" },
    });
    gsap.to(this.cards.map((c) => c.userData.label.material), {
      opacity: 0.85,
      duration: 0.8,
      delay: 0.35,
      ease: "power2.out",
      stagger: { amount: 1.1, from: "random" },
    });
    gsap.delayedCall(0.9, () => (this.state.enabled = true));
  }

  // ── input ──
  _bind() {
    const el = this.renderer.domElement;
    const s = this.state;

    this._onDown = (e) => {
      if (!s.enabled || s.selected) return;
      s.dragging = true;
      s.down = { x: e.clientX, y: e.clientY, moved: 0 };
      s.last = { x: e.clientX, y: e.clientY };
      s.vel.x = 0;
      s.vel.y = 0;
      try {
        el.setPointerCapture?.(e.pointerId);
      } catch {
        /* synthetic pointer events have no tracked id — capture is best-effort */
      }
      el.style.cursor = "grabbing";
    };

    this._onMove = (e) => {
      this.hasPointer = true;
      this.pointer.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
      if (!s.dragging) return;
      const dx = e.clientX - s.last.x;
      const dy = e.clientY - s.last.y;
      s.last = { x: e.clientX, y: e.clientY };
      s.down.moved += Math.abs(dx) + Math.abs(dy);

      s.target.y += dx * 0.0032;
      s.target.x = clamp(s.target.x + dy * 0.0032, -ROT_X_CLAMP, ROT_X_CLAMP);
      // smoothed release velocity (inertia)
      s.vel.y = s.vel.y * 0.5 + dx * 0.0032 * 0.5;
      s.vel.x = s.vel.x * 0.5 + dy * 0.0032 * 0.5;
    };

    this._onUp = (e) => {
      const wasDrag = s.dragging;
      s.dragging = false;
      el.style.cursor = "grab";
      if (!wasDrag || !s.down) return;
      // treat tiny movement as a click → select the card under the pointer
      if (s.down.moved < 6 && s.enabled && !s.selected) {
        this.raycaster.setFromCamera(this.pointer, this.camera);
        const hit = this.raycaster.intersectObjects(this.cards, false)[0];
        if (hit) this._select(hit.object);
      }
      s.down = null;
    };

    this._onWheel = (e) => {
      if (!s.enabled || s.selected) return;
      e.preventDefault();
      s.target.x = clamp(s.target.x + e.deltaY * 0.0009, -ROT_X_CLAMP, ROT_X_CLAMP);
      s.target.y -= e.deltaX * 0.0009;
    };

    this._onResize = () => {
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    };

    el.style.cursor = "grab";
    el.addEventListener("pointerdown", this._onDown);
    el.addEventListener("pointermove", this._onMove);
    el.addEventListener("pointerup", this._onUp);
    el.addEventListener("wheel", this._onWheel, { passive: false });
    window.addEventListener("resize", this._onResize);
  }

  // ── select / morph ──
  _select(mesh) {
    const s = this.state;
    s.selected = mesh;
    s.vel.x = 0;
    s.vel.y = 0;
    this.cb.onSelect?.(mesh.userData.item);

    this._restore = {
      pos: mesh.position.clone(),
      quat: mesh.quaternion.clone(),
    };
    this.scene.attach(mesh); // keep world transform, leave the rotating group
    mesh.renderOrder = 10;
    mesh.material.depthTest = false;

    // dim everything else
    this.cards.forEach((c) => {
      if (c === mesh) return;
      gsap.to(c.material, { opacity: 0.05, duration: 0.7, ease: "power2.out" });
      gsap.to(c.userData.label.material, { opacity: 0, duration: 0.5 });
    });
    gsap.to(mesh.userData.label.material, { opacity: 0, duration: 0.4 });

    // morph toward the camera, offset left so the detail panel gets the right side
    const d = 12.5;
    const vh = 2 * d * Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    const vw = vh * this.camera.aspect;
    const tx = this.camera.aspect > 1 ? -vw * 0.21 : 0;

    gsap.to(mesh.position, { x: tx, y: 0, z: -d, duration: 1.05, ease: "power3.inOut" });
    const q0 = mesh.quaternion.clone();
    const q1 = new THREE.Quaternion(); // identity = facing the camera at -z
    const o = { t: 0 };
    gsap.to(o, {
      t: 1,
      duration: 1.05,
      ease: "power3.inOut",
      onUpdate: () => mesh.quaternion.slerpQuaternions(q0, q1, o.t),
    });
  }

  deselect(onDone) {
    const s = this.state;
    const mesh = s.selected;
    if (!mesh || !this._restore) return onDone?.();

    // world transform the card must return to (group hasn't rotated while open)
    const wp = this._restore.pos.clone();
    this.group.localToWorld(wp);
    const wq = this.group
      .getWorldQuaternion(new THREE.Quaternion())
      .multiply(this._restore.quat);

    gsap.to(mesh.position, { x: wp.x, y: wp.y, z: wp.z, duration: 0.95, ease: "power3.inOut" });
    const q0 = mesh.quaternion.clone();
    const o = { t: 0 };
    gsap.to(o, {
      t: 1,
      duration: 0.95,
      ease: "power3.inOut",
      onUpdate: () => mesh.quaternion.slerpQuaternions(q0, wq, o.t),
      onComplete: () => {
        this.group.attach(mesh);
        mesh.position.copy(this._restore.pos);
        mesh.quaternion.copy(this._restore.quat);
        mesh.material.depthTest = true;
        mesh.renderOrder = 0;
        s.selected = null;
        onDone?.();
      },
    });

    this.cards.forEach((c) => {
      if (c === mesh) return;
      gsap.to(c.material, { opacity: 1, duration: 0.9, delay: 0.15, ease: "power2.out" });
      gsap.to(c.userData.label.material, { opacity: 0.85, duration: 0.9, delay: 0.2 });
    });
    gsap.to(mesh.userData.label.material, { opacity: 0.85, delay: 0.6, duration: 0.5 });
  }

  // ── frame loop ──
  _tick() {
    const s = this.state;

    if (!s.dragging && s.enabled && !s.selected) {
      // release inertia, decaying
      s.target.y += s.vel.y;
      s.target.x = clamp(s.target.x + s.vel.x, -ROT_X_CLAMP, ROT_X_CLAMP);
      s.vel.x *= 0.93;
      s.vel.y *= 0.93;
    }

    // lenis-style lerp toward target
    s.rot.x += (s.target.x - s.rot.x) * EASE;
    s.rot.y += (s.target.y - s.rot.y) * EASE;
    this.group.rotation.set(s.rot.x, s.rot.y, 0);

    // hover (only while idle)
    if (s.enabled && !s.selected && !s.dragging && this.hasPointer) {
      this.raycaster.setFromCamera(this.pointer, this.camera);
      const hit = this.raycaster.intersectObjects(this.cards, false)[0]?.object ?? null;
      if (hit !== s.hovered) {
        if (s.hovered) gsap.to(s.hovered.scale, { x: 1, y: 1, duration: 0.4, ease: "power2.out" });
        if (hit) gsap.to(hit.scale, { x: 1.05, y: 1.05, duration: 0.4, ease: "power2.out" });
        s.hovered = hit;
        this.renderer.domElement.style.cursor = hit ? "pointer" : "grab";
      }
    }

    this.renderer.render(this.scene, this.camera);
    this._raf = requestAnimationFrame(this._tick);
  }

  dispose() {
    cancelAnimationFrame(this._raf);
    const el = this.renderer.domElement;
    el.removeEventListener("pointerdown", this._onDown);
    el.removeEventListener("pointermove", this._onMove);
    el.removeEventListener("pointerup", this._onUp);
    el.removeEventListener("wheel", this._onWheel);
    window.removeEventListener("resize", this._onResize);
    this.cards.forEach((c) => {
      c.material.dispose();
      c.userData.label.material.dispose();
    });
    this.renderer.dispose();
    el.remove();
    if (typeof window !== "undefined" && window.__verseDebug === this) delete window.__verseDebug;
  }
}
