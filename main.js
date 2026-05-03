import * as THREE from "three";

import { room, buildRoom } from "./world";
import { setupPlayer, updatePlayerMovement } from "./player";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const canvas = document.querySelector("#c");
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202025);

const fov = 75;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;

const cameraPov = new THREE.PerspectiveCamera(fov, aspect, near, far);
cameraPov.position.set(0, 4, 0);

renderer.setSize(window.innerWidth, window.innerHeight);

//adicionando vaso
const loader = new GLTFLoader();

loader.load(
  "/models/vaso.glb",
  (gltf) => {
    const modelo = gltf.scene;

    modelo.position.set(0, 2.8, 0);
    modelo.scale.set(5, 5, 5);

    scene.add(modelo);
  },
  undefined,
  (error) => {
    console.error("Erro ao carregar modelo:", error);
  },
);

//adicionando pilar

loader.load(
  "/models/pilar_greece.glb",
  (gltf) => {
    const modelo = gltf.scene;

    modelo.position.set(0, 0, 0);
    modelo.scale.set(50, 25, 50);

    scene.add(modelo);
  },
  undefined,
  (error) => {
    console.error("Erro ao carregar modelo:", error);
  },
);

//adicionando Afrodite

loader.load(
  "/models/aphrodite_statuette.glb",
  (gltf) => {
    const modelo = gltf.scene;

    modelo.position.set(12.5, 0, -7.5);
    modelo.scale.set(0.07, 0.07, 0.07);

    scene.add(modelo);
  },
  undefined,
  (error) => {
    console.error("Erro ao carregar modelo:", error);
  },
);

//adicionando quadro Casinha

loader.load(
  "/models/fancy_picture_frame_01_2k/fancy_picture_frame_01_2k.gltf",
  (gltf) => {
    const modelo = gltf.scene;

    modelo.position.set(0, 5, -10);
    modelo.scale.set(20, 20, 5);

    scene.add(modelo);
  },
  undefined,
  (error) => {
    console.error("Erro ao carregar modelo:", error);
  },
);

//adicionando quadro revolução industrial

loader.load(
  "/models/fancy_picture_frame_02_2k/fancy_picture_frame_02_2k.gltf",
  (gltf) => {
    const modelo = gltf.scene;

    modelo.position.set(-15, 5, 0);
    modelo.scale.set(10, 10, 3);
    modelo.rotation.y = Math.PI / 2;
    scene.add(modelo);
  },
  undefined,
  (error) => {
    console.error("Erro ao carregar modelo:", error);
  },
);

//adicionando quadro

loader.load(
  "/models/hanging_picture_frame_02_2k/hanging_picture_frame_02_2k.gltf",
  (gltf) => {
    const modelo = gltf.scene;

    modelo.traverse((child) => {
      if (child.isMesh && child.material) {
        // Tira o aspecto de "metal/espelho" da tela que faz ela refletir preto
        child.material.metalness = 0;
        child.material.roughness = 1;

        // Se o criador colocou um vidro na frente da pintura, nós o escondemos
        if (
          child.name.toLowerCase().includes("glass") ||
          child.material.name.toLowerCase().includes("glass")
        ) {
          child.visible = false;
        }
      }
    });

    modelo.position.set(15, 5, 0);
    modelo.scale.set(10, 10, 3);
    modelo.rotation.y = -Math.PI / 2;
    scene.add(modelo);
  },
  undefined,
  (error) => {
    console.error("Erro ao carregar modelo:", error);
  },
);

//adiciona César

loader.load(
  "/models/marble_bust_01_2k/marble_bust_01_2k.gltf",
  (gltf) => {
    const modelo = gltf.scene;

    modelo.position.set(-12.5, 3.4, -7.5);
    modelo.scale.set(10, 10, 10);
    modelo.rotation.y = Math.PI / 2;
    scene.add(modelo);
  },
  undefined,
  (error) => {
    console.error("Erro ao carregar modelo:", error);
  },
);

//adicionando pilar

loader.load(
  "/models/pilar_greece.glb",
  (gltf) => {
    const modelo = gltf.scene;

    modelo.position.set(-12.5, 0, -7.5);
    modelo.scale.set(100, 30, 50);

    scene.add(modelo);
  },
  undefined,
  (error) => {
    console.error("Erro ao carregar modelo:", error);
  },
);

const cameraFixa = new THREE.PerspectiveCamera(fov, aspect, near, far);
cameraFixa.position.set(14, 8, 9);
cameraFixa.lookAt(0, 0, 0);

let cameraAtiva = cameraPov;

window.addEventListener("keydown", (event) => {
  if (event.code === "KeyC") {
    cameraAtiva = cameraAtiva === cameraPov ? cameraFixa : cameraPov;
  }
});

window.addEventListener("resize", () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h);
  cameraPov.aspect = w / h;
  cameraPov.updateProjectionMatrix();
  cameraFixa.aspect = w / h;
  cameraFixa.updateProjectionMatrix();
});

// ── Modelos ──────────────────────────────────────────────────────────

loader.load(
  "/models/vaso.glb",
  (gltf) => {
    const modelo = gltf.scene;
    modelo.position.set(0, 2.8, 0);
    modelo.scale.set(5, 5, 5);
    scene.add(modelo);
  },
  undefined,
  (error) => console.error("Erro ao carregar vaso:", error),
);

loader.load(
  "/models/pilar_greece.glb",
  (gltf) => {
    const modelo = gltf.scene;
    modelo.position.set(0, 0, 0);
    modelo.scale.set(50, 25, 50);
    scene.add(modelo);
  },
  undefined,
  (error) => console.error("Erro ao carregar pilar:", error),
);

loader.load(
  "/models/aphrodite_statuette.glb",
  (gltf) => {
    const modelo = gltf.scene;
    modelo.position.set(12.5, 0, -7.5);
    modelo.scale.set(0.07, 0.07, 0.07);
    scene.add(modelo);
  },
  undefined,
  (error) => console.error("Erro ao carregar Afrodite:", error),
);

// ── Sala ─────────────────────────────────────────────────────────────
const roomGroup = await buildRoom();
scene.add(roomGroup);

// ── Luzes ─────────────────────────────────────────────────────────────
const ambientLight = new THREE.AmbientLight(0xfff4e0, 0.5);
scene.add(ambientLight);

// function createCeilingLight(x, y, z) {
//   const group = new THREE.Group();

//   // PointLight permanece igual
//   const pointLight = new THREE.PointLight(0xfff4e0, 600, 0, 2);
//   pointLight.position.set(0, 0, 0);
//   group.add(pointLight);

//   // Carrega o modelo do lustre
//   loader.load(
//     "/models/Chandelier_01_4k.gltf/Chandelier_01_4k.gltf",
//     (gltf) => {
//       const chandelier = gltf.scene;

//       // Ajuste de escala conforme necessário
//       chandelier.scale.set(4, 4, 4);

//       // Centraliza o modelo em relação ao grupo
//       const box = new THREE.Box3().setFromObject(chandelier);
//       const center = new THREE.Vector3();
//       box.getCenter(center);

//       // Sobe o modelo para que a parte de cima fique no teto
//       const height = box.max.y - box.min.y;
//       chandelier.position.set(-center.x, -box.max.y, -center.z);

//       group.add(chandelier);
//     },
//     undefined,
//     (error) => console.error("Erro ao carregar lustre:", error),
//   );

//   group.position.set(x, y, z);
//   return group;
// }

function createCeilingLight(x, y, z) {
  const group = new THREE.Group();
  group.position.set(x, y, z);

  loader.load(
    "/models/Chandelier_01_4k.gltf/Chandelier_01_4k.gltf",
    (gltf) => {
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
        if (
          child.isMesh &&
          child.material?.name === "lamps_classic_chandelier_1"
        ) {
          lampMesh = child;
        }
      });

      if (!lampMesh) {
        console.warn("Mesh das lâmpadas não encontrada.");
        return;
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

      console.log(`✅ ${clusters.length} lâmpadas encontradas no lustre.`);

      clusters.forEach((c) => {
        const spot = new THREE.SpotLight(
          0xfff4e0,
          150,
          12,
          Math.PI / 5,
          0.4,
          2,
        );

        spot.position.set(c.x, c.minY, c.z);

        spot.target.position.set(c.x, c.minY - 3, c.z);
        group.add(spot);
        group.add(spot.target);
      });
    },
    undefined,
    (error) => console.error("Erro ao carregar lustre:", error),
  );

  return group;
}

const ceilingLight = createCeilingLight(0, room.height - 0.2, 0);
scene.add(ceilingLight);

const hemiLight = new THREE.HemisphereLight(0xfff4e0, 0x8b6914, 0.8);
scene.add(hemiLight);

const fillLight = new THREE.PointLight(0xfff4e0, 80, 30, 2);
fillLight.position.set(0, 5, 0);
scene.add(fillLight);

// ── Corpo do jogador ─────────────────────────────────────────────────
const bodyGeometry = new THREE.CylinderGeometry(1, 1, 4, 16);
const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const playerBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
scene.add(playerBody);

// ── Controles ────────────────────────────────────────────────────────
const controls = setupPlayer(cameraPov, document.body);

// ── Loop principal ───────────────────────────────────────────────────
function animate() {
  const speed = 0.1;
  updatePlayerMovement(controls, speed);
  playerBody.position.copy(cameraPov.position);
  playerBody.position.y -= 2;
  renderer.render(scene, cameraAtiva);
}

renderer.setAnimationLoop(animate);
