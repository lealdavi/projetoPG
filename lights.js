import * as THREE from "three";
import { room } from "./world";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

const loader = new GLTFLoader();

export async function createLights() {
  const ambientLight = new THREE.AmbientLight(0xfff4e0, 0.5);
  const hemiLight = new THREE.HemisphereLight(0xfff4e0, 0x8b6914, 0.8);
  const fillLight = new THREE.PointLight(0xfff4e0, 80, 30, 2);
  fillLight.position.set(0, 5, 0);

  const ceilingLight = await createCeilingLight(0, room.height - 0.2, 0);
  return [ambientLight, ceilingLight, hemiLight, fillLight];
}

async function createCeilingLight(x, y, z) {
  const group = new THREE.Group();
  group.position.set(x, y, z);

  let gltf;
  try {
    gltf = await loader.loadAsync(
      "/models/Chandelier_01_4k.gltf/Chandelier_01_4k.gltf",
    );
  } catch (error) {
    console.error("Erro ao carregar lustre:", error);
    return group;
  }
  const chandelier = gltf.scene;
  chandelier.scale.set(4, 4, 4);

  const box = new THREE.Box3().setFromObject(chandelier);
  const center = new THREE.Vector3();
  box.getCenter(center);
  chandelier.position.set(-center.x, -box.max.y, -center.z);
  group.add(chandelier);

  group.updateMatrixWorld(true);

  let lampMesh = null;
  chandelier.traverse((child) => {
    if (child.isMesh && child.material?.name === "lamps_classic_chandelier_1") {
      lampMesh = child;
    }
  });

  if (!lampMesh) {
    console.warn("Mesh das lâmpadas não encontrada.");
    return group;
  }

  const posAttr = lampMesh.geometry.attributes.position;
  const groupInverse = new THREE.Matrix4().copy(group.matrixWorld).invert();
  const toLocal = new THREE.Matrix4().multiplyMatrices(
    groupInverse,
    lampMesh.matrixWorld,
  );
  const tempVec = new THREE.Vector3();
  const points = [];

  for (let i = 0; i < posAttr.count; i++) {
    tempVec.fromBufferAttribute(posAttr, i);
    tempVec.applyMatrix4(toLocal);
    points.push(tempVec.clone());
  }

  const THRESHOLD = 0.3;
  const clusters = [];

  for (const p of points) {
    let nearest = null;
    let nearestDist = Infinity;

    for (const c of clusters) {
      const d = Math.hypot(p.x - c.x, p.z - c.z);
      if (d < nearestDist) {
        nearestDist = d;
        nearest = c;
      }
    }

    if (nearest && nearestDist < THRESHOLD) {
      if (p.y < nearest.minY) nearest.minY = p.y;
      nearest.count++;
      nearest.x += (p.x - nearest.x) / nearest.count;
      nearest.y += (p.y - nearest.y) / nearest.count;
      nearest.z += (p.z - nearest.z) / nearest.count;
    } else {
      clusters.push({ x: p.x, y: p.y, z: p.z, minY: p.y, count: 1 });
    }
  }

  clusters.forEach((c) => {
    const spot = new THREE.SpotLight(0xfff4e0, 150, 12, Math.PI / 5, 0.4, 2);
    spot.position.set(c.x, c.minY, c.z);
    spot.target.position.set(c.x, c.minY - 3, c.z);
    group.add(spot);
    group.add(spot.target);
  });
  return group;
}
