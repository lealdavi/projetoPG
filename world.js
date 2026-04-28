import * as THREE from "three";

const room = { width: 30, height: 10, depth: 20 };

const roomSurfaces = [
  // 1. Floor
  {
    name: "floor",
    width: room.width,
    length: room.depth,
    map: "/textures/floor_textures/diff.png",
    normalMap: "/textures/floor_textures/nor.png",
    roughnessMap: "/textures/floor_textures/rough.png",
    pos_x: 0,
    pos_y: 0,
    pos_z: 0,
    rot_x: -Math.PI / 2,
    rot_y: 0,
  },
  // 2. Ceiling
  {
    name: "ceiling",
    width: room.width,
    length: room.depth,
    map: "/textures/floor_textures/diff.png",
    normalMap: "/textures/floor_textures/nor.png",
    roughnessMap: "/textures/floor_textures/rough.png",
    pos_x: 0,
    pos_y: room.height,
    pos_z: 0,
    rot_x: Math.PI / 2,
    rot_y: 0,
  },
  // 3. Left Wall (-X)
  {
    name: "left_wall",
    width: room.depth,
    length: room.height,
    map: "/textures/wall_textures/diff.png",
    normalMap: "/textures/wall_textures/nor.png",
    roughnessMap: "/textures/wall_textures/rough.png",
    pos_x: -room.width / 2,
    pos_y: room.height / 2,
    pos_z: 0,
    rot_x: 0,
    rot_y: Math.PI / 2,
  },
  // 4. Right Wall (+X)
  {
    name: "right_wall",
    width: room.depth,
    length: room.height,
    map: "/textures/wall_textures/diff.png",
    normalMap: "/textures/wall_textures/nor.png",
    roughnessMap: "/textures/wall_textures/rough.png",
    pos_x: room.width / 2,
    pos_y: room.height / 2,
    pos_z: 0,
    rot_x: 0,
    rot_y: -Math.PI / 2,
  },
  // 5. Front Wall (-Z) (Deepest part of the room, looking forward)
  {
    name: "front_wall",
    width: room.width,
    length: room.height,
    map: "/textures/wall_textures/diff.png",
    normalMap: "/textures/wall_textures/nor.png",
    roughnessMap: "/textures/wall_textures/rough.png",
    pos_x: 0,
    pos_y: room.height / 2,
    pos_z: -room.depth / 2,
    rot_x: 0,
    rot_y: 0,
  },
  // 6. Back Wall (+Z) (Behind the camera, closing the room)
  {
    name: "back_wall",
    width: room.width,
    length: room.height,
    map: "/textures/wall_textures/diff.png",
    normalMap: "/textures/wall_textures/nor.png",
    roughnessMap: "/textures/wall_textures/rough.png",
    pos_x: 0,
    pos_y: room.height / 2,
    pos_z: room.depth / 2,
    rot_x: 0,
    rot_y: Math.PI,
  },
];

function makePlane(width, length, diff_path, nor_path, rough_path) {
  const loader = new THREE.TextureLoader();
  const textureDiff = loader.load(diff_path);
  const textureNor = loader.load(nor_path);
  const textureRough = loader.load(rough_path);

  const material = new THREE.MeshStandardMaterial({
    map: textureDiff,
    normalMap: textureNor,
    roughnessMap: textureRough,
    color: 0xffffff,
  });

  [textureDiff, textureNor, textureRough].forEach((tex) => {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(width / 4, length / 4);
  });
  const geometry = new THREE.PlaneGeometry(width, length);
  const plane = new THREE.Mesh(geometry, material);

  return plane;
}

export function buildRoom() {
  const roomGroup = new THREE.Group();

  roomSurfaces.forEach((surface) => {
    const plane = makePlane(
      surface.width,
      surface.length,
      surface.map,
      surface.normalMap,
      surface.roughnessMap,
    );

    plane.position.set(surface.pos_x, surface.pos_y, surface.pos_z);

    plane.rotation.set(surface.rot_x, surface.rot_y, 0);

    plane.name = surface.name;

    roomGroup.add(plane);
  });

  return roomGroup;
}
