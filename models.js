import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

export async function createModels() {
  const loader = new GLTFLoader();
  const modelGroup = new THREE.Group();

  async function load(path, configure) {
    try {
      const gltf = await loader.loadAsync(path);
      configure(gltf.scene);
      return gltf.scene;
    } catch (error) {
      console.error(`Erro ao carregar modelo (${path}):`, error);
      return null;
    }
  }

  const [
    vaso,
    pilar_greece,
    aphrodite_statuette,
    casinha,
    quadro,
    cesar,
    pilar_cesar,
  ] = await Promise.all([
    load("/models/vaso.glb", (modelo) => {
      modelo.position.set(0, 2.8, 0);
      modelo.scale.set(5, 5, 5);
    }),

    load("/models/pilar_greece.glb", (modelo) => {
      modelo.position.set(0, 0, 0);
      modelo.scale.set(50, 25, 50);
    }),

    load("/models/aphrodite_statuette.glb", (modelo) => {
      modelo.position.set(12.5, 0, -7.5);
      modelo.scale.set(0.07, 0.07, 0.07);
    }),

    load(
      "/models/fancy_picture_frame_01_2k/fancy_picture_frame_01_2k.gltf",
      (modelo) => {
        modelo.position.set(0, 5, -10);
        modelo.scale.set(20, 20, 5);
      },
    ),

    load(
      "/models/fancy_picture_frame_02_2k/fancy_picture_frame_02_2k.gltf",
      (modelo) => {
        modelo.position.set(-15, 5, 0);
        modelo.scale.set(10, 10, 3);
        modelo.rotation.y = Math.PI / 2;
      },
    ),

    load("/models/marble_bust_01_2k/marble_bust_01_2k.gltf", (modelo) => {
      modelo.position.set(-12.5, 3.4, -7.5);
      modelo.scale.set(10, 10, 10);
      modelo.rotation.y = Math.PI / 2;
    }),

    load("/models/pilar_greece.glb", (modelo) => {
      modelo.position.set(-12.5, 0, -7.5);
      modelo.scale.set(100, 30, 50);
    }),
  ]);

  if (quadro) {
    quadro.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.metalness = 0;
        child.material.roughness = 1;
        if (
          child.name.toLowerCase().includes("glass") ||
          child.material.name.toLowerCase().includes("glass")
        ) {
          child.visible = false;
        }
      }
    });
    quadro.position.set(15, 5, 0);
    quadro.scale.set(10, 10, 3);
    quadro.rotation.y = -Math.PI / 2;
  }

  const models = [
    vaso,
    pilar_greece,
    aphrodite_statuette,
    casinha,
    quadro,
    cesar,
    pilar_cesar,
  ];
  models.forEach((model) => {
    if (model) modelGroup.add(model);
  });

  return { modelGroup, vaso };
}
