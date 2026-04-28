import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/Addons.js";

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
// const cube_geometry = new THREE.BoxGeometry(1, 1, 1);
// const cube_material = new THREE.MeshBasicMaterial( {color: 0x00ff00});
// const cube = new THREE.Mesh(cube_geometry, cube_material);
// scene.add(cube);
//
document.addEventListener("keydown", (event) => {
  if (event.code === "KeyW") moveForward = true;
  if (event.code === "KeyS") moveBackward = true;
  if (event.code === "KeyA") moveLeft = true;
  if (event.code === "KeyD") moveRight = true;
});

document.addEventListener("keyup", (event) => {
  if (event.code === "KeyW") moveForward = false;
  if (event.code === "KeyS") moveBackward = false;
  if (event.code === "KeyA") moveLeft = false;
  if (event.code === "KeyD") moveRight = false;
});

export function setupPlayer(camera, domElement) {
  const controls = new PointerLockControls(camera, domElement);
  controls.addEventListener("lock", function () {
    console.log("Mouse travado!");
  });

  controls.addEventListener("unlock", function () {
    console.log("Mouse livre!");
  });
  domElement.addEventListener("click", () => {
    controls.lock();
  });

  return controls;
}

export function updatePlayerMovement(controls, speed) {
  if (moveForward) controls.moveForward(speed);
  if (moveBackward) controls.moveForward(-speed);
  if (moveLeft) controls.moveRight(-speed);
  if (moveRight) controls.moveRight(speed);
}
