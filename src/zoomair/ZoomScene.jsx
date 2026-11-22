import { useCallback, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import {
  createBladderWallGeometry,
  createFootShellGeometry,
  createMembraneGeometry,
  createPerimeterTube,
  createTreadGeometry,
  createUpperGeometry,
  widthAt,
} from "./geometry";

const scratchObject = new THREE.Object3D();

function CameraRig({ mode }) {
  const { camera, size } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  const desired = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const mobile = size.width < 760;
    if (mode === "lab") {
      desired.set(mobile ? 1.4 : 1.5, mobile ? 7.8 : 6.3, mobile ? 11.8 : 10.6);
      target.set(0, 0, 0);
    } else {
      desired.set(mobile ? 11.2 : 11.5, mobile ? 8.8 : 7.4, mobile ? 14.5 : 13.5);
      target.set(0, 0.2, 0);
    }
    camera.position.lerp(desired, 1 - Math.exp(-delta * 3.2));
    camera.lookAt(target);
  });
  return null;
}

function Layer({ id, activePart, mode, explode, assembledY, explodedY, children }) {
  const ref = useRef();
  const selected = activePart === id;
  const dimmed = activePart && !selected;

  useFrame((_, delta) => {
    if (!ref.current) return;
    const modeLift = mode === "lab" ? explodedY * 1.4 : THREE.MathUtils.lerp(assembledY, explodedY, explode);
    ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, modeLift, 5.5, delta);
    ref.current.scale.setScalar(THREE.MathUtils.damp(ref.current.scale.x, selected ? 1.04 : 1, 6, delta));
    ref.current.visible = !(mode === "lab" && id !== "zoom");
    ref.current.traverse((obj) => {
      if (!obj.material || obj.userData.lockOpacity) return;
      obj.material.transparent = true;
      const targetOpacity = dimmed ? 0.12 : 1;
      obj.material.opacity = THREE.MathUtils.damp(obj.material.opacity ?? 1, targetOpacity, 7, delta);
    });
  });

  return <group ref={ref}>{children}</group>;
}

function FiberField({ interaction, height = 0.64 }) {
  const ref = useRef();
  const fibers = useMemo(() => {
    const list = [];
    const length = 9.55;
    for (let ix = 0; ix < 32; ix += 1) {
      const x = -length / 2 + (ix / 31) * length;
      const w = widthAt(x, 10, 3.45) * 0.82;
      const rows = 7;
      for (let iz = 0; iz < rows; iz += 1) {
        const z = (iz / (rows - 1) - 0.5) * w;
        list.push({ x, z, seed: Math.random() });
      }
    }
    return list;
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    const state = interaction.current;
    fibers.forEach((fiber, index) => {
      const dx = fiber.x - state.point.x;
      const dz = fiber.z - state.point.z;
      const influence = Math.exp(-(dx * dx + dz * dz) / 1.2);
      const squeeze = state.depth * influence;
      const localHeight = Math.max(0.18, height + state.inflation * 1.72 - squeeze * 0.55);
      const bow = state.depth * Math.exp(-Math.pow(Math.sqrt(dx * dx + dz * dz) - 1.1, 2) / 0.28) * 0.08;
      scratchObject.position.set(fiber.x, state.inflation * 0.14 - squeeze * 0.24 + bow, fiber.z);
      scratchObject.scale.set(1, localHeight, 1);
      scratchObject.updateMatrix();
      ref.current.setMatrixAt(index, scratchObject.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[null, null, fibers.length]}>
      <cylinderGeometry args={[0.014, 0.014, 1, 5]} />
      <meshBasicMaterial color="#ffe7ca" toneMapped={false} />
    </instancedMesh>
  );
}

function AirParticles({ interaction }) {
  const ref = useRef();
  const particles = useMemo(() => {
    const list = [];
    for (let i = 0; i < 76; i += 1) {
      const x = -4.5 + Math.random() * 9;
      const w = widthAt(x, 10, 3.2) * 0.7;
      list.push({
        x,
        y: (Math.random() - 0.5) * 0.42,
        z: (Math.random() - 0.5) * w,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.3,
        vz: (Math.random() - 0.5) * 0.3,
      });
    }
    return list;
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const speed = 0.42 + interaction.current.amount * 1.35;
    particles.forEach((p, index) => {
      p.x += p.vx * delta * speed;
      p.y += p.vy * delta * speed;
      p.z += p.vz * delta * speed;
      const w = widthAt(p.x, 10, 3.2) * 0.38;
      if (Math.abs(p.x) > 4.65) p.vx *= -1;
      if (Math.abs(p.z) > Math.max(0.35, w)) p.vz *= -1;
      const verticalLimit = 0.24 + interaction.current.inflation * 0.7;
      if (Math.abs(p.y) > verticalLimit) p.vy *= -1;
      scratchObject.position.set(p.x, p.y, p.z);
      scratchObject.scale.setScalar(0.65 + interaction.current.amount * 0.3);
      scratchObject.updateMatrix();
      ref.current.setMatrixAt(index, scratchObject.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[null, null, particles.length]}>
      <sphereGeometry args={[0.025, 5, 5]} />
      <meshBasicMaterial color="#ffb055" transparent opacity={0.72} toneMapped={false} />
    </instancedMesh>
  );
}

function ZoomBag({ enabled, onPressChange, onTelemetry }) {
  const group = useRef();
  const top = useRef();
  const bottom = useRef();
  const ring = useRef();
  const halo = useRef();
  const wall = useRef();
  const seam = useRef();
  const frame = useRef(0);
  const topGeometry = useMemo(() => createMembraneGeometry(), []);
  const bottomGeometry = useMemo(() => createMembraneGeometry(), []);
  const initialTop = useMemo(() => Float32Array.from(topGeometry.attributes.position.array), [topGeometry]);
  const initialBottom = useMemo(() => Float32Array.from(bottomGeometry.attributes.position.array), [bottomGeometry]);
  const shellGeometry = useMemo(() => createPerimeterTube(10, 3.6), []);
  const wallGeometry = useMemo(() => createBladderWallGeometry(10, 3.6), []);
  const initialWall = useMemo(() => Float32Array.from(wallGeometry.attributes.position.array), [wallGeometry]);
  const interaction = useRef({
    holding: false,
    amount: 0,
    depth: 0,
    point: new THREE.Vector3(1.7, 0, 0.2),
    holdStarted: 0,
    releasedAt: 0,
    pointerPressure: 0.5,
    gestureVelocity: 0,
    lastMoveAt: 0,
    prevDepth: 0,
    compressionVelocity: 0,
    inflation: 0,
    inflationVelocity: 0,
  });

  const updatePoint = (event) => {
    if (!group.current) return;
    const local = group.current.worldToLocal(event.point.clone());
    local.x = THREE.MathUtils.clamp(local.x, -4.55, 4.55);
    const maxZ = widthAt(local.x, 10, 3.6) * 0.42;
    local.z = THREE.MathUtils.clamp(local.z, -maxZ, maxZ);
    const state = interaction.current;
    const now = performance.now();
    if (state.holding && state.lastMoveAt > 0) {
      const dt = Math.max(0.008, (now - state.lastMoveAt) / 1000);
      const distance = state.point.distanceTo(local);
      const gestureImpulse = THREE.MathUtils.clamp(distance / dt / 14, 0, 1);
      state.gestureVelocity = Math.max(state.gestureVelocity, gestureImpulse);
      state.inflationVelocity = Math.min(1.35, state.inflationVelocity + gestureImpulse * 0.16);
    }
    state.pointerPressure = event.pressure > 0 ? event.pressure : 0.5;
    state.lastMoveAt = now;
    state.point.copy(local);
  };

  const beginPress = (event) => {
    if (!enabled) return;
    event.stopPropagation();
    event.nativeEvent?.preventDefault?.();
    updatePoint(event);
    interaction.current.holding = true;
    interaction.current.amount = Math.max(interaction.current.amount, 0.3);
    interaction.current.gestureVelocity = Math.max(
      interaction.current.gestureVelocity,
      0.22 + interaction.current.pointerPressure * 0.45,
    );
    interaction.current.inflationVelocity = Math.min(
      1.35,
      interaction.current.inflationVelocity + 0.16 + interaction.current.pointerPressure * 0.18,
    );
    interaction.current.holdStarted = performance.now();
    document.body.classList.add("zoom-is-pressing");
    onPressChange?.(true);
    event.target?.setPointerCapture?.(event.pointerId);
    if (event.pointerType === "touch") navigator.vibrate?.(8);
  };

  const releasePress = useCallback(() => {
    interaction.current.holding = false;
    interaction.current.releasedAt = performance.now();
    document.body.classList.remove("zoom-is-pressing");
    document.body.style.cursor = enabled ? "grab" : "";
    onPressChange?.(false);
  }, [enabled, onPressChange]);

  const endPress = (event) => {
    event?.stopPropagation?.();
    releasePress();
    event?.target?.releasePointerCapture?.(event.pointerId);
  };

  useEffect(() => {
    if (!enabled) return undefined;
    const release = () => {
      if (interaction.current.holding) releasePress();
    };
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    window.addEventListener("blur", release);
    return () => {
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      window.removeEventListener("blur", release);
      document.body.classList.remove("zoom-is-pressing");
      document.body.style.cursor = "";
    };
  }, [enabled, releasePress]);

  useFrame(({ clock }, delta) => {
    const state = interaction.current;
    const releaseTail = !state.holding && performance.now() - state.releasedAt < 180;
    const liveLoad = 0.72 + state.pointerPressure * 0.22 + state.gestureVelocity * 0.16;
    const target = state.holding ? Math.min(1, liveLoad) : releaseTail ? 0.3 : 0;
    state.amount = THREE.MathUtils.damp(state.amount, target, state.holding ? 7.5 : 2.8, delta);
    state.gestureVelocity = THREE.MathUtils.damp(state.gestureVelocity, 0, 4.2, delta);

    const nextDepth = state.amount * (0.31 + 0.06 * Math.sin(clock.elapsedTime * 8) * state.amount);
    state.compressionVelocity = (nextDepth - state.prevDepth) / Math.max(delta, 0.001);
    state.depth = nextDepth;
    state.prevDepth = nextDepth;

    const inflationTarget = THREE.MathUtils.clamp(
      state.amount * 0.105
        + Math.max(0, state.compressionVelocity) * 0.026
        + state.gestureVelocity * 0.045,
      0,
      0.22,
    );
    const inflationAcceleration = (inflationTarget - state.inflation) * 58 - state.inflationVelocity * 8.5;
    state.inflationVelocity += inflationAcceleration * delta;
    state.inflation = THREE.MathUtils.clamp(state.inflation + state.inflationVelocity * delta, -0.025, 0.22);

    const deform = (geometry, initial, isTop) => {
      const position = geometry.attributes.position;
      for (let i = 0; i < position.count; i += 1) {
        const base = i * 3;
        const x = initial[base];
        const z = initial[base + 2];
        const dx = x - state.point.x;
        const dz = z - state.point.z;
        const d2 = dx * dx + dz * dz;
        const center = Math.exp(-d2 / 1.15);
        const radius = Math.sqrt(d2);
        const shoulder = Math.exp(-Math.pow(radius - 1.25, 2) / 0.22);
        const displacement = isTop
          ? -state.depth * center + state.depth * 0.12 * shoulder
          : state.depth * 0.075 * center - state.depth * 0.025 * shoulder;
        const globalInflation = isTop ? state.inflation : -state.inflation * 0.72;
        position.array[base + 1] = initial[base + 1] + displacement + (isTop ? 0.32 : -0.32) + globalInflation;
      }
      position.needsUpdate = true;
      geometry.computeVertexNormals();
    };

    deform(topGeometry, initialTop, true);
    deform(bottomGeometry, initialBottom, false);

    if (wall.current) {
      const position = wallGeometry.attributes.position;
      for (let i = 0; i < position.count; i += 1) {
        const base = i * 3;
        const isUpper = initialWall[base + 1] > 0;
        const expansion = 1 + Math.max(0, state.inflation) * 0.028;
        position.array[base] = initialWall[base] * expansion;
        position.array[base + 1] = isUpper
          ? 0.32 + state.inflation
          : -0.32 - state.inflation * 0.72;
        position.array[base + 2] = initialWall[base + 2] * expansion;
      }
      position.needsUpdate = true;
      wallGeometry.computeVertexNormals();
    }
    if (seam.current) {
      const expansion = 1 + Math.max(0, state.inflation) * 0.028;
      seam.current.scale.set(expansion, 1 + Math.max(0, state.inflation) * 0.9, expansion);
    }

    if (ring.current) {
      ring.current.position.set(state.point.x, 0.34 - state.depth, state.point.z);
      ring.current.scale.setScalar(0.72 + state.amount * 0.55);
      ring.current.material.opacity = 0.35 + state.amount * 0.65;
    }
    if (halo.current) {
      halo.current.position.set(state.point.x, 0.37 - state.depth, state.point.z);
      halo.current.scale.setScalar(1 + state.amount * 1.7);
      halo.current.material.opacity = state.amount * 0.35;
    }

    frame.current += 1;
    if (frame.current % 3 === 0) {
      const compressionMm = state.amount * 3.1;
      const volumeRatio = 1 - state.amount * 0.115;
      const pressureRatio = Math.pow(1 / volumeRatio, 1.4);
      const workJ = 0.5 * 145 * Math.pow(compressionMm / 1000, 2) * 1000;
      onTelemetry?.({
        compression: compressionMm,
        pressure: pressureRatio,
        fiberLoad: state.amount * 100,
        energy: workJ,
        velocity: state.compressionVelocity * 10,
        point: state.point.x,
        active: state.holding || state.amount > 0.03,
      });
    }
  });

  return (
    <group ref={group}>
      <mesh ref={bottom} geometry={bottomGeometry}>
        <meshPhysicalMaterial color="#76180f" roughness={0.24} metalness={0.05} transparent opacity={0.72} side={THREE.DoubleSide} />
      </mesh>
      <FiberField interaction={interaction} />
      <AirParticles interaction={interaction} />
      <mesh ref={wall} geometry={wallGeometry} renderOrder={2} userData={{ lockOpacity: true }}>
        <meshPhysicalMaterial color="#e62f1b" roughness={0.18} transparent opacity={0.58} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh ref={top} geometry={topGeometry} renderOrder={3}>
        <meshPhysicalMaterial color="#ff321d" roughness={0.13} metalness={0.02} transmission={0.18} thickness={0.32} transparent opacity={0.58} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh ref={seam} geometry={shellGeometry} userData={{ lockOpacity: true }}>
        <meshPhysicalMaterial color="#ff3b25" roughness={0.18} transparent opacity={0.78} transmission={0.12} emissive="#641106" emissiveIntensity={0.35} />
      </mesh>
      <mesh
        position={[0, 0.76, 0]}
        rotation-x={-Math.PI / 2}
        userData={{ lockOpacity: true }}
        onPointerDown={beginPress}
        onPointerMove={(event) => interaction.current.holding && updatePoint(event)}
        onPointerUp={endPress}
        onPointerCancel={endPress}
        onPointerOver={() => { if (enabled) document.body.style.cursor = "grab"; }}
        onPointerOut={() => { if (!interaction.current.holding) document.body.style.cursor = ""; }}
      >
        <planeGeometry args={[10.2, 4.3]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ring} rotation-x={-Math.PI / 2} renderOrder={5}>
        <torusGeometry args={[0.27, 0.022, 8, 40]} />
        <meshBasicMaterial color="#fff2dc" transparent opacity={0.5} toneMapped={false} depthTest={false} />
      </mesh>
      <mesh ref={halo} rotation-x={-Math.PI / 2} renderOrder={4}>
        <ringGeometry args={[0.55, 0.59, 48]} />
        <meshBasicMaterial color="#ff5b36" transparent opacity={0} toneMapped={false} depthTest={false} />
      </mesh>
    </group>
  );
}

function Cage() {
  const material = useMemo(() => new THREE.MeshStandardMaterial({ color: "#ff442a", roughness: 0.36, metalness: 0.08 }), []);
  const ribs = useMemo(() => {
    const output = [];
    [-1, 1].forEach((side) => {
      [-1.8, -0.55, 0.75, 1.9].forEach((x, i) => {
        const z = side * (widthAt(x, 10, 3.48) * 0.48);
        const curve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(x - 0.34, 0.1, z),
          new THREE.Vector3(x - 0.05, 1.38 + i * 0.08, z * 0.76),
          new THREE.Vector3(x + 0.48, 0.16, z),
        );
        output.push(new THREE.TubeGeometry(curve, 16, 0.075, 7, false));
      });
    });
    return output;
  }, []);
  return <group>{ribs.map((geometry, index) => <mesh key={index} geometry={geometry} material={material} />)}</group>;
}

function Laces() {
  const geometries = useMemo(() => {
    const result = [];
    for (let i = 0; i < 7; i += 1) {
      const x = -1.9 + i * 0.52;
      const y = 1.05 + (1 - i / 8) * 0.42;
      const z = widthAt(x, 10, 3.2) * 0.29;
      result.push(new THREE.TubeGeometry(new THREE.LineCurve3(
        new THREE.Vector3(x - 0.11, y, -z),
        new THREE.Vector3(x + 0.11, y - 0.04, z),
      ), 4, 0.027, 6, false));
    }
    return result;
  }, []);
  return <group>{geometries.map((geometry, index) => <mesh key={index} geometry={geometry}><meshStandardMaterial color="#e8e0d7" roughness={0.8} /></mesh>)}</group>;
}

function ShoeAssembly({ mode, explode, activePart, setActivePart, onTelemetry, onPressChange }) {
  const rotation = useRef();
  const upperGeometry = useMemo(() => createUpperGeometry(), []);
  const outsoleGeometry = useMemo(() => createFootShellGeometry(10.25, 3.78, 0.34, 0.1), []);
  const carrierGeometry = useMemo(() => createFootShellGeometry(10.1, 3.66, 0.72, 0.16), []);
  const sockGeometry = useMemo(() => createFootShellGeometry(9.78, 3.42, 0.16, 0.06), []);
  const shankGeometry = useMemo(() => createFootShellGeometry(3.1, 1.12, 0.11, 0.05), []);
  const tread = useMemo(() => createTreadGeometry(), []);

  useFrame(({ clock }, delta) => {
    if (!rotation.current) return;
    const targetY = mode === "lab" ? -0.08 : -0.48 + Math.sin(clock.elapsedTime * 0.25) * 0.04;
    const targetZ = mode === "lab" ? -0.03 : -0.11;
    rotation.current.rotation.y = THREE.MathUtils.damp(rotation.current.rotation.y, targetY, 4, delta);
    rotation.current.rotation.z = THREE.MathUtils.damp(rotation.current.rotation.z, targetZ, 4, delta);
    const scale = mode === "lab" ? 1.13 : 0.86;
    rotation.current.scale.setScalar(THREE.MathUtils.damp(rotation.current.scale.x, scale, 4, delta));
  });

  return (
    <group ref={rotation} rotation={[0, -0.5, -0.1]}>
      <Layer id="outsole" activePart={activePart} mode={mode} explode={explode} assembledY={-1.13} explodedY={-4.1}>
        <group onClick={() => setActivePart("outsole")}>
          <mesh geometry={outsoleGeometry}>
            <meshStandardMaterial color="#171717" roughness={0.84} metalness={0.02} />
          </mesh>
          <primitive object={tread} position={[0, -0.23, 0]} />
        </group>
      </Layer>

      <Layer id="carrier" activePart={activePart} mode={mode} explode={explode} assembledY={-0.68} explodedY={-2.65}>
        <mesh geometry={carrierGeometry} onClick={() => setActivePart("carrier")}>
          <meshStandardMaterial color="#e8dfd0" roughness={0.88} />
        </mesh>
      </Layer>

      <Layer id="shank" activePart={activePart} mode={mode} explode={explode} assembledY={-0.26} explodedY={-1.35}>
        <mesh geometry={shankGeometry} onClick={() => setActivePart("shank")} position={[-0.75, 0, 0]}>
          <meshStandardMaterial color="#872719" roughness={0.3} metalness={0.16} />
        </mesh>
      </Layer>

      <Layer id="zoom" activePart={activePart} mode={mode} explode={explode} assembledY={-0.12} explodedY={0}>
        <group onClick={() => mode !== "lab" && setActivePart("zoom")}>
          <ZoomBag enabled={mode === "lab"} onTelemetry={onTelemetry} onPressChange={onPressChange} />
        </group>
      </Layer>

      <Layer id="sockliner" activePart={activePart} mode={mode} explode={explode} assembledY={0.31} explodedY={1.65}>
        <mesh geometry={sockGeometry} onClick={() => setActivePart("sockliner")}>
          <meshStandardMaterial color="#bb2d20" roughness={0.78} />
        </mesh>
      </Layer>

      <Layer id="upper" activePart={activePart} mode={mode} explode={explode} assembledY={0.42} explodedY={3.55}>
        <group onClick={() => setActivePart("upper")}>
          <mesh geometry={upperGeometry}>
            <meshStandardMaterial color="#ddd4c7" roughness={0.88} wireframe={false} side={THREE.DoubleSide} />
          </mesh>
          <Laces />
          <mesh position={[-4.05, 1.23, 0]} rotation-z={-0.1}>
            <boxGeometry args={[1.25, 1.85, 2.65]} />
            <meshStandardMaterial color="#27211e" roughness={0.72} transparent opacity={0.78} />
          </mesh>
        </group>
      </Layer>

      <Layer id="cage" activePart={activePart} mode={mode} explode={explode} assembledY={0.5} explodedY={4.0}>
        <group onClick={() => setActivePart("cage")}><Cage /></group>
      </Layer>
    </group>
  );
}

function Scene({ mode, explode, activePart, setActivePart, onTelemetry, onPressChange, isPressing }) {
  return (
    <>
      <color attach="background" args={["#070403"]} />
      <fog attach="fog" args={["#070403", 15, 28]} />
      <CameraRig mode={mode} />
      <ambientLight intensity={0.55} color="#ffead4" />
      <directionalLight position={[3, 9, 8]} intensity={4.5} color="#fff0dd" />
      <pointLight position={[-5, 2, 4]} intensity={18} distance={16} color="#ff2e17" />
      <pointLight position={[5, -1, -3]} intensity={12} distance={12} color="#ff7b24" />
      <Float speed={mode === "lab" ? 0 : 0.55} rotationIntensity={0.03} floatIntensity={mode === "lab" ? 0 : 0.18}>
        <ShoeAssembly
          mode={mode}
          explode={explode}
          activePart={activePart}
          setActivePart={setActivePart}
          onTelemetry={onTelemetry}
          onPressChange={onPressChange}
        />
      </Float>
      <mesh position={[0, -4.55, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#080403" roughness={1} />
      </mesh>
      <gridHelper args={[34, 34, "#43110c", "#1d0b08"]} position={[0, -4.52, 0]} />
      <OrbitControls
        enabled={!isPressing}
        enableRotate={mode !== "lab"}
        enablePan={false}
        enableZoom
        minDistance={7}
        maxDistance={20}
        minPolarAngle={0.45}
        maxPolarAngle={1.3}
        target={[0, 0, 0]}
        dampingFactor={0.08}
        makeDefault
      />
    </>
  );
}

export default function ZoomScene(props) {
  return (
    <Canvas
      className="zoom-canvas"
      dpr={[1, 1.7]}
      camera={{ fov: 38, position: [1.5, 6.3, 10.6], near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      onCreated={({ gl, camera }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.15;
        camera.lookAt(0, 0, 0);
      }}
    >
      <Scene {...props} />
    </Canvas>
  );
}
