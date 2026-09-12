// ─────────────────────────────────────────────────────────────────────────────
// /lebron17 — THE SCENE. Geometry comes from geometry.js, copy and behaviour
// from parts.js; this file is only the render layer: materials that behave like
// the thing they represent, the explode transform, hover/focus states and the
// section plane.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, Lightformer, Html } from "@react-three/drei";
import { buildParts } from "./geometry.js";
import { PARTS, PART_BY_ID, HOME } from "./parts.js";

// One plane, shared by every material, driven by the SECTION slider.
const CLIP = new THREE.Plane(new THREE.Vector3(0, 0, -1), 1.4);

/* ── procedural surface detail ────────────────────────────────────────────── */
function canvasTexture(draw, size, repeat) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  draw(c.getContext("2d"), size);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat[0], repeat[1]);
  t.anisotropy = 4;
  return t;
}

// The 17's knit is quilted into raised scales with a fine stitch inside them.
// Dark ground between the scales, so each keeps a hard edge — a smooth gradient
// makes a weak bump and the quilting vanishes at any distance.
const knitMap = () => canvasTexture((x, s) => {
  x.fillStyle = "#0e0e0e"; x.fillRect(0, 0, s, s);
  const cols = 7, rows = 5;
  const cw = s / cols, ch = s / rows;
  for (let r = -1; r <= rows; r++) {
    for (let c = -1; c <= cols; c++) {
      const cx = c * cw + (r % 2 ? cw * 0.5 : 0) + cw * 0.5;
      const cy = r * ch + ch * 0.5;
      const g = x.createLinearGradient(cx, cy - ch * 0.42, cx, cy + ch * 0.42);
      g.addColorStop(0, "#ffffff");
      g.addColorStop(0.55, "#c6c6c6");
      g.addColorStop(1, "#666666");
      x.fillStyle = g;
      x.beginPath();
      x.ellipse(cx, cy, cw * 0.40, ch * 0.36, 0, 0, Math.PI * 2);
      x.fill();
    }
  }
  const step = s / 120;
  x.lineWidth = step * 0.45;
  x.lineCap = "round";
  x.globalAlpha = 0.22;
  for (let r = 0; r * step < s; r++) {
    for (let c = 0; c * step < s; c++) {
      const ox = (r % 2) * step * 0.5;
      x.strokeStyle = "#ffffff";
      x.beginPath();
      x.arc(c * step + ox, r * step, step * 0.34, Math.PI * 0.15, Math.PI * 0.85);
      x.stroke();
      x.strokeStyle = "#000000";
      x.beginPath();
      x.arc(c * step + ox, r * step + step * 0.5, step * 0.3, Math.PI * 1.15, Math.PI * 1.85);
      x.stroke();
    }
  }
  x.globalAlpha = 1;
}, 1024, [4, 2]);

// traction: herringbone blocks, the direction flipping across the tread
const treadMap = () => canvasTexture((x, s) => {
  x.fillStyle = "#3a3a3a"; x.fillRect(0, 0, s, s);
  x.lineWidth = s / 46;
  x.strokeStyle = "#e8e8e8";
  for (let b = 0; b < 4; b++) {
    const dir = b % 2 ? 1 : -1;
    x.save();
    x.beginPath();
    x.rect(0, (b * s) / 4, s, s / 4);
    x.clip();
    for (let i = -s; i < s * 2; i += s / 16) {
      x.beginPath();
      x.moveTo(i, (b * s) / 4);
      x.lineTo(i + (dir * s) / 4, (b * s) / 4 + s / 4);
      x.stroke();
    }
    x.restore();
  }
}, 512, [7, 4]);

/* ── materials, one per part, each behaving like its own material ─────────── */
function makeMaterials(low) {
  const knit = knitMap(), tread = treadMap();
  const air = () => new THREE.MeshPhysicalMaterial({
    color: "#ffffff", roughness: 0.06, metalness: 0,
    transmission: low ? 0 : 1, thickness: 0.5, ior: 1.42,
    iridescence: 0.45, iridescenceIOR: 1.25,
    attenuationColor: new THREE.Color("#bcdcff"), attenuationDistance: 1.6,
    clearcoat: 1, clearcoatRoughness: 0.05,
    opacity: low ? 0.34 : 1, transparent: !!low,
  });
  const by = {
    knit: () => new THREE.MeshPhysicalMaterial({
      color: "#23262c", roughness: 0.94, metalness: 0,
      sheen: 0.7, sheenColor: new THREE.Color("#5f6874"), sheenRoughness: 0.7,
      bumpMap: knit, bumpScale: 1.5,
    }),
    posite: () => new THREE.MeshPhysicalMaterial({
      color: "#0d0f13", roughness: 0.24, metalness: 0.08,
      clearcoat: 1, clearcoatRoughness: 0.07,
    }),
    foam: () => new THREE.MeshPhysicalMaterial({
      color: "#efece3", roughness: 0.96, metalness: 0,
      sheen: 0.3, sheenColor: new THREE.Color("#ffffff"), sheenRoughness: 0.9,
    }),
    rubber: () => new THREE.MeshStandardMaterial({
      color: "#15171b", roughness: 0.97, metalness: 0,
      bumpMap: tread, bumpScale: 1.4,
    }),
    lace: () => new THREE.MeshPhysicalMaterial({
      color: "#d6d1c6", roughness: 0.95, metalness: 0,
      sheen: 1, sheenColor: new THREE.Color("#ffffff"), sheenRoughness: 0.75,
    }),
    gloss: () => new THREE.MeshPhysicalMaterial({
      color: "#c8281a", roughness: 0.14, metalness: 0.05,
      clearcoat: 1, clearcoatRoughness: 0.04,
    }),
    // the smoked cradle: translucent, warm, and dense enough to read as a panel
    tpu: () => new THREE.MeshPhysicalMaterial({
      color: "#8b8279", roughness: 0.20, metalness: 0,
      transmission: low ? 0 : 0.82, thickness: 0.35, ior: 1.5,
      attenuationColor: new THREE.Color("#5a4f45"), attenuationDistance: 0.5,
      clearcoat: 1, clearcoatRoughness: 0.06,
      opacity: low ? 0.62 : 1, transparent: !!low,
    }),
    air,
  };
  const out = {};
  for (const p of PARTS) {
    const m = by[p.kind]();
    m.side = THREE.DoubleSide;
    m.clippingPlanes = [CLIP];
    m.clipShadows = true;
    m.emissive = new THREE.Color("#ffffff");
    m.emissiveIntensity = 0;
    m.userData.baseOpacity = m.opacity;
    out[p.id] = m;
  }
  return out;
}

/* ── one component of the shoe ────────────────────────────────────────────── */
function Part({ part, index, ui, uiRef, onHover, onPick, children }) {
  const ref = useRef();
  const mats = useRef([]);
  const meshes = useRef([]);
  const picking = useRef(true);
  const amt = useRef(1);          // starts exploded, assembles itself on load
  const dim = useRef(1);
  const hot = useRef(0);
  const dir = useMemo(() => new THREE.Vector3(...part.explode), [part]);

  useLayoutEffect(() => {
    const set = new Set();
    const hit = [];
    ref.current.traverse((o) => {
      if (o.material) set.add(o.material);
      if (o.isMesh || o.isInstancedMesh) hit.push([o, o.raycast]);
    });
    mats.current = [...set];
    meshes.current = hit;
  }, []);

  useFrame((_, dt) => {
    const s = uiRef.current;
    const target = s.focus ? Math.max(s.explode, FOCUS_EXPLODE) : s.explode;
    const k = 1 - Math.pow(0.0015 + index * 0.0004, Math.min(dt, 0.1));
    amt.current += (target - amt.current) * k;
    ref.current.position.copy(dir).multiplyScalar(amt.current);

    const wantDim = s.focus && s.focus !== part.id ? 0.045 : 1;
    const wantHot = !s.focus && s.hover === part.id ? 1 : 0;
    dim.current += (wantDim - dim.current) * Math.min(1, dt * 7);
    hot.current += (wantHot - hot.current) * Math.min(1, dt * 9);
    for (const m of mats.current) {
      const o = (m.userData.baseOpacity ?? 1) * dim.current;
      m.opacity = o;
      // three bakes an OPAQUE define into the shader, so flipping `transparent`
      // only takes effect on a recompile — done on the change, never per frame.
      const clear = o < 0.995;
      if (m.transparent !== clear) { m.transparent = clear; m.needsUpdate = true; }
      m.depthWrite = o > 0.5;
      m.emissiveIntensity = hot.current * 0.14;
    }
    // a ghosted part must not swallow a click meant for the one in focus
    const canPick = dim.current > 0.4;
    if (canPick !== picking.current) {
      picking.current = canPick;
      for (const [o, fn] of meshes.current) o.raycast = canPick ? fn : () => {};
    }
  });

  return (
    <group
      ref={ref}
      onPointerOver={(e) => { e.stopPropagation(); onHover(part.id); }}
      onPointerOut={(e) => { e.stopPropagation(); onHover(null); }}
      onClick={(e) => { e.stopPropagation(); onPick(part.id); }}
    >
      {children}
      {ui.labels && (ui.explode > 0.12 || ui.hover === part.id) && ui.focus !== part.id && (
        <Html position={part.anchor} zIndexRange={[8, 0]} style={{ pointerEvents: "none" }}>
          <div className={"lb-tag" + (ui.hover === part.id ? " is-hot" : "")}>
            <i />
            <span>{String(index + 1).padStart(2, "0")} {part.label}</span>
          </div>
        </Html>
      )}
    </group>
  );
}

/* ── the tensile fibres inside a Zoom bag ─────────────────────────────────── */
function Fibres({ data }) {
  const ref = useRef();
  useLayoutEffect(() => {
    const o = new THREE.Object3D();
    data.forEach((f, i) => {
      o.position.set(f.x, f.y, f.z);
      o.scale.set(1, f.h, 1);
      o.updateMatrix();
      ref.current.setMatrixAt(i, o.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  }, [data]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, data.length]}>
      <cylinderGeometry args={[0.005, 0.005, 1, 5, 1]} />
      <meshStandardMaterial color="#f2f4f8" roughness={0.55} metalness={0} side={THREE.DoubleSide} clippingPlanes={[CLIP]} />
    </instancedMesh>
  );
}

// The pods squash and rebound while you are looking at them: the fibres stretch
// on load and pull the two faces back together on release.
function Pulse({ active, amount = 0.1, children }) {
  const ref = useRef();
  useFrame((st) => {
    const t = st.clock.elapsedTime;
    const k = active ? (Math.sin(t * 2.4) * 0.5 + 0.5) ** 2 : 0;
    const s = ref.current.scale;
    s.y += (1 - amount * k - s.y) * 0.14;
    s.x += (1 + amount * 0.35 * k - s.x) * 0.14;
    s.z = s.x;
  });
  return <group ref={ref}>{children}</group>;
}

// A painted contact shadow: cheaper than a depth pass and it never flickers
// while eleven parts are flying apart above it.
function GroundShadow() {
  const tex = useMemo(() => {
    const t = canvasTexture((x, s) => {
      const gr = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
      gr.addColorStop(0, "rgba(28,26,22,0.5)");
      gr.addColorStop(0.42, "rgba(28,26,22,0.24)");
      gr.addColorStop(1, "rgba(28,26,22,0)");
      x.fillStyle = gr;
      x.fillRect(0, 0, s, s);
    }, 256, [1, 1]);
    t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
    return t;
  }, []);
  return (
    <mesh position={[0, -0.719, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 0.62, 1]}>
      <planeGeometry args={[4.8, 4.8]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

/* ── camera ───────────────────────────────────────────────────────────────── */
// Focusing also opens the shoe, so the part is no longer where it was built —
// the camera has to follow it out along its own explode vector, and down by the
// offset the whole shoe is drawn at.
const SHIFT = -0.72;
const FOCUS_EXPLODE = 0.42;

function Rig({ focus, spin }) {
  const ref = useRef();
  const flying = useRef(true);
  const gp = useMemo(() => new THREE.Vector3(), []);
  const gt = useMemo(() => new THREE.Vector3(), []);
  const goal = useMemo(() => {
    if (!focus) return HOME;
    const p = PART_BY_ID[focus];
    const o = p.explode.map((v) => v * FOCUS_EXPLODE);
    return p.cam.map(([x, y, z]) => [x + o[0], y + o[1] + SHIFT, z + o[2]]);
  }, [focus]);
  useLayoutEffect(() => { flying.current = true; }, [focus]);
  useFrame((st, dt) => {
    const c = ref.current;
    if (!c || !flying.current) return;
    gp.set(...goal[0]); gt.set(...goal[1]);
    const k = 1 - Math.pow(0.0006, Math.min(dt, 0.1));
    st.camera.position.lerp(gp, k);
    c.target.lerp(gt, k);
    if (st.camera.position.distanceTo(gp) < 0.02) flying.current = false;
  });
  return (
    <OrbitControls
      ref={ref} makeDefault enableDamping dampingFactor={0.08} enablePan={false}
      minDistance={1.35} maxDistance={9} autoRotate={spin} autoRotateSpeed={0.5}
      minPolarAngle={0.1} maxPolarAngle={Math.PI * 0.88}
      onStart={() => { flying.current = false; }}
    />
  );
}

/* ── the shoe ─────────────────────────────────────────────────────────────── */
export default function Shoe({ ui, onHover, onPick, low }) {
  const g = useMemo(() => buildParts(), []);
  const mat = useMemo(() => makeMaterials(low), [low]);
  const { gl } = useThree();
  const uiRef = useRef(ui);
  uiRef.current = ui;

  useLayoutEffect(() => { gl.localClippingEnabled = true; }, [gl]);
  useFrame((_, dt) => {
    const want = 1.4 - uiRef.current.section * 1.42;
    CLIP.constant += (want - CLIP.constant) * Math.min(1, dt * 8);
  });

  const P = (id) => PART_BY_ID[id];
  const wrap = (id, children) => {
    const i = PARTS.findIndex((p) => p.id === id);
    return (
      <Part key={id} part={P(id)} index={i} ui={ui} uiRef={uiRef} onHover={onHover} onPick={onPick}>
        {children}
      </Part>
    );
  };

  return (
    <>
      <color attach="background" args={["#eceae5"]} />
      <hemisphereLight args={["#ffffff", "#b9b4aa", 0.55]} />
      <directionalLight position={[3.5, 6, 4]} intensity={1.15} />
      <directionalLight position={[-4, 2.5, -3]} intensity={0.45} color="#cfe0ff" />

      <group position={[0, -0.72, 0]}>
        {wrap("outsole", <mesh geometry={g.outsole} material={mat.outsole} />)}

        {wrap("air720", (
          <Pulse active={ui.focus === "air720"} amount={0.045}>
            <mesh geometry={g.air720} material={mat.air720} />
            {g.air720Seams.map((pts, i) => (
              <line key={i}>
                <bufferGeometry>
                  <bufferAttribute attach="attributes-position" args={[new Float32Array(pts.flatMap((p) => [p.x, p.y, p.z])), 3]} />
                </bufferGeometry>
                <lineBasicMaterial color="#7c8794" transparent opacity={0.85} clippingPlanes={[CLIP]} />
              </line>
            ))}
          </Pulse>
        ))}

        {wrap("zoom", (
          <Pulse active={ui.focus === "zoom"} amount={0.11}>
            <mesh geometry={g.podLat} material={mat.zoom} />
            <mesh geometry={g.podMed} material={mat.zoom} />
            <Fibres data={g.fibresLat} />
            <Fibres data={g.fibresMed} />
          </Pulse>
        ))}

        {wrap("midsole", <mesh geometry={g.midsole} material={mat.midsole} />)}
        {wrap("sockliner", <mesh geometry={g.sockliner} material={mat.sockliner} />)}
        {wrap("upper", <mesh geometry={g.upper} material={mat.upper} />)}
        {wrap("cage", g.chevrons.map((geo, i) => <mesh key={i} geometry={geo} material={mat.cage} />))}
        {wrap("heel", <mesh geometry={g.heelCage} material={mat.heel} />)}
        {wrap("collar", <mesh geometry={g.collar} material={mat.collar} />)}
        {wrap("lacing", (
          <>
            {g.laces.map((geo, i) => <mesh key={i} geometry={geo} material={mat.lacing} />)}
            {g.eyestay.map((geo, i) => <mesh key={"e" + i} geometry={geo} material={mat.cage} />)}
          </>
        ))}
        {wrap("swoosh", (
          <>
            <mesh geometry={g.swooshLat} material={mat.swoosh} />
            <mesh geometry={g.swooshMed} material={mat.swoosh} />
          </>
        ))}
      </group>

      <GroundShadow />

      <Environment resolution={256} frames={1}>
        <color attach="background" args={["#cfcdc8"]} />
        <Lightformer form="rect" intensity={6} position={[0, 5, 2]} scale={[9, 5, 1]} rotation-x={-Math.PI / 2} />
        <Lightformer form="rect" intensity={2.4} position={[-5, 2, 2]} scale={[4, 6, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" intensity={3.2} position={[5, 1.5, -2]} scale={[4, 6, 1]} rotation-y={-Math.PI / 2} />
        <Lightformer form="circle" intensity={4} position={[1, 3, 4]} scale={3} />
      </Environment>

      <Rig focus={ui.focus} spin={ui.spin} />
    </>
  );
}
