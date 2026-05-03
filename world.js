import * as THREE from "three";
import { DRACOLoader, GLTFLoader } from "three/examples/jsm/Addons.js";

export const room = { width: 30, height: 10, depth: 20 };

const roomSurfaces = [
  {
    name: "floor",
    width: room.width,
    length: room.depth,
    texture: "/textures/floor/herringbone_parquet_4k.gltf",
    pos_x: 0,
    pos_y: 0,
    pos_z: 0,
    rot_x: -Math.PI / 2,
    rot_y: 0,
  },
  {
    name: "ceiling",
    width: room.width,
    length: room.depth,
    texture: "/textures/wall/plastered_wall_4k.gltf",
    pos_x: 0,
    pos_y: room.height,
    pos_z: 0,
    rot_x: Math.PI / 2,
    rot_y: 0,
  },
  {
    name: "left_wall",
    width: room.depth,
    length: room.height,
    texture: "/textures/wall/plastered_wall_4k.gltf",
    pos_x: -room.width / 2,
    pos_y: room.height / 2,
    pos_z: 0,
    rot_x: 0,
    rot_y: Math.PI / 2,
  },
  {
    name: "right_wall",
    width: room.depth,
    length: room.height,
    texture: "/textures/wall/plastered_wall_4k.gltf",
    pos_x: room.width / 2,
    pos_y: room.height / 2,
    pos_z: 0,
    rot_x: 0,
    rot_y: -Math.PI / 2,
  },
  {
    name: "front_wall",
    width: room.width,
    length: room.height,
    texture: "/textures/wall/plastered_wall_4k.gltf",
    pos_x: 0,
    pos_y: room.height / 2,
    pos_z: -room.depth / 2,
    rot_x: 0,
    rot_y: 0,
  },
  {
    name: "back_wall",
    width: room.width,
    length: room.height,
    texture: "/textures/wall/plastered_wall_4k.gltf",
    pos_x: 0,
    pos_y: room.height / 2,
    pos_z: room.depth / 2,
    rot_x: 0,
    rot_y: Math.PI,
  },
];

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/examples/jsm/libs/draco/");
loader.setDRACOLoader(dracoLoader);

const materialCache = {};

function loadMaterial(gltfPath) {
  if (materialCache[gltfPath]) {
    return Promise.resolve(materialCache[gltfPath]);
  }

  return new Promise((resolve, reject) => {
    loader.load(
      gltfPath,
      (gltf) => {
        let sourceMaterial = null;
        gltf.scene.traverse((child) => {
          if (child.isMesh && !sourceMaterial) {
            sourceMaterial = child.material;
          }
        });

        if (!sourceMaterial) {
          reject(new Error(`No mesh material found in ${gltfPath}`));
          return;
        }

        materialCache[gltfPath] = sourceMaterial;
        resolve(sourceMaterial);
      },
      undefined,
      reject,
    );
  });
}

async function makePlane(width, length, gltfPath) {
  const sourceMaterial = await loadMaterial(gltfPath);

  const material = sourceMaterial.clone();

  const mapKeys = ["map", "normalMap", "roughnessMap", "metalnessMap", "aoMap"];
  mapKeys.forEach((key) => {
    if (material[key]) {
      material[key] = material[key].clone();
      material[key].wrapS = THREE.RepeatWrapping;
      material[key].wrapT = THREE.RepeatWrapping;
      material[key].repeat.set(width / 4, length / 4);
      material[key].needsUpdate = true;
    }
  });

  const geometry = new THREE.PlaneGeometry(width, length);
  return new THREE.Mesh(geometry, material);
}

export async function buildRoom() {
  const roomGroup = new THREE.Group();

  const planes = await Promise.all(
    roomSurfaces.map(async (surface) => {
      const plane = await makePlane(
        surface.width,
        surface.length,
        surface.texture,
      );
      plane.position.set(surface.pos_x, surface.pos_y, surface.pos_z);
      plane.rotation.set(surface.rot_x, surface.rot_y, 0);
      plane.name = surface.name;
      return plane;
    }),
  );

  planes.forEach((plane) => roomGroup.add(plane));

  return roomGroup;
}
