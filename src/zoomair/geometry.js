import * as THREE from "three";

export function widthAt(x, length = 10, maxWidth = 3.6) {
  const t = THREE.MathUtils.clamp(x / length + 0.5, 0, 1);
  const heel = 0.67 + 0.22 * Math.sin(t * Math.PI);
  const forefoot = 0.34 * Math.exp(-Math.pow((t - 0.76) / 0.2, 2));
  const arch = -0.19 * Math.exp(-Math.pow((t - 0.43) / 0.15, 2));
  const toe = 1 - 0.2 * Math.pow(Math.max(0, (t - 0.86) / 0.14), 2);
  return maxWidth * Math.max(0.48, (heel + forefoot + arch) * toe);
}

export function createMembraneGeometry(length = 10, maxWidth = 3.6, xSegments = 42, zSegments = 14) {
  const positions = [];
  const uvs = [];
  const indices = [];

  for (let ix = 0; ix <= xSegments; ix += 1) {
    const u = ix / xSegments;
    const x = (u - 0.5) * length;
    const width = widthAt(x, length, maxWidth);
    const lateralShift = 0.11 * Math.sin(u * Math.PI) - 0.08 * Math.exp(-Math.pow((u - 0.15) / 0.2, 2));
    for (let iz = 0; iz <= zSegments; iz += 1) {
      const v = iz / zSegments;
      const edgeRound = Math.sin(Math.PI * u) * 0.035;
      positions.push(x, edgeRound, (v - 0.5) * width + lateralShift);
      uvs.push(u, v);
    }
  }

  for (let ix = 0; ix < xSegments; ix += 1) {
    for (let iz = 0; iz < zSegments; iz += 1) {
      const a = ix * (zSegments + 1) + iz;
      const b = a + zSegments + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function outlinePoints(length = 10, maxWidth = 3.6, segments = 34) {
  const points = [];
  for (let i = 0; i <= segments; i += 1) {
    const x = -length / 2 + (i / segments) * length;
    points.push(new THREE.Vector2(x, widthAt(x, length, maxWidth) / 2));
  }
  for (let i = segments; i >= 0; i -= 1) {
    const x = -length / 2 + (i / segments) * length;
    const asymmetry = 0.12 * Math.sin((i / segments) * Math.PI);
    points.push(new THREE.Vector2(x, -widthAt(x, length, maxWidth) / 2 + asymmetry));
  }
  return points;
}

export function createFootShellGeometry(length = 10, maxWidth = 3.6, height = 0.4, bevel = 0.12) {
  const shape = new THREE.Shape();
  const points = outlinePoints(length, maxWidth);
  shape.moveTo(points[0].x, points[0].y);
  points.slice(1).forEach((point) => shape.lineTo(point.x, point.y));
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: bevel,
    bevelThickness: Math.min(bevel, height * 0.32),
    curveSegments: 6,
  });
  geometry.rotateX(Math.PI / 2);
  geometry.translate(0, -height / 2, 0);
  geometry.computeVertexNormals();
  return geometry;
}

export function createUpperGeometry(length = 9.7, maxWidth = 3.45) {
  const outline = outlinePoints(length, maxWidth, 40);
  const count = outline.length;
  const positions = [];
  const indices = [];

  const heightAt = (x) => {
    const t = x / length + 0.5;
    return 0.5 + 2.2 * Math.pow(1 - t, 1.7) + 0.52 * Math.exp(-Math.pow((t - 0.53) / 0.22, 2));
  };

  for (let ring = 0; ring < 3; ring += 1) {
    const k = ring / 2;
    for (let i = 0; i < count; i += 1) {
      const p = outline[i];
      const inset = 1 - k * 0.22;
      const x = p.x * (1 - k * 0.025);
      const edgeBias = Math.abs(p.y) / (maxWidth * 0.5);
      const y = 0.05 + heightAt(p.x) * k * (0.76 + edgeBias * 0.24);
      positions.push(x, y, p.y * inset);
    }
  }

  for (let ring = 0; ring < 2; ring += 1) {
    for (let i = 0; i < count; i += 1) {
      const next = (i + 1) % count;
      const a = ring * count + i;
      const b = ring * count + next;
      const c = (ring + 1) * count + i;
      const d = (ring + 1) * count + next;
      indices.push(a, c, b, b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function createPerimeterTube(length = 10, maxWidth = 3.6, y = 0) {
  const pts = outlinePoints(length, maxWidth, 42).map((point) => new THREE.Vector3(point.x, y, point.y));
  pts.push(pts[0].clone());
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 160, 0.095, 7, true);
}

export function createBladderWallGeometry(length = 10, maxWidth = 3.6, segments = 42) {
  const outline = outlinePoints(length, maxWidth, segments);
  const positions = [];
  const uvs = [];
  const indices = [];

  outline.forEach((point, index) => {
    const u = index / outline.length;
    positions.push(point.x, -0.32, point.y, point.x, 0.32, point.y);
    uvs.push(u, 0, u, 1);
  });

  for (let i = 0; i < outline.length; i += 1) {
    const next = (i + 1) % outline.length;
    const bottom = i * 2;
    const top = bottom + 1;
    const nextBottom = next * 2;
    const nextTop = nextBottom + 1;
    indices.push(bottom, nextBottom, top, top, nextBottom, nextTop);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function createTreadGeometry() {
  const group = new THREE.Group();
  const rubber = new THREE.MeshStandardMaterial({ color: "#151515", roughness: 0.88, metalness: 0.02 });
  for (let i = 0; i < 15; i += 1) {
    const x = -4.55 + i * 0.65;
    const w = widthAt(x, 10, 3.6) * 0.78;
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.11, w), rubber);
    bar.position.set(x, 0, 0.04 * Math.sin(i * 2.1));
    bar.rotation.y = (i % 2 ? 1 : -1) * 0.21;
    group.add(bar);
  }
  return group;
}
