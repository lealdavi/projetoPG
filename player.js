import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/Addons.js";

export const moveState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
};
// const cube_geometry = new THREE.BoxGeometry(1, 1, 1);
// const cube_material = new THREE.MeshBasicMaterial( {color: 0x00ff00});
// const cube = new THREE.Mesh(cube_geometry, cube_material);
// scene.add(cube);
//
document.addEventListener("keydown", (event) => {
  if (event.code === "KeyW") moveState.forward = true;
  if (event.code === "KeyS") moveState.backward = true;
  if (event.code === "KeyA") moveState.left = true;
  if (event.code === "KeyD") moveState.right = true;
});
document.addEventListener("keyup", (event) => {
  if (event.code === "KeyW") moveState.forward = false;
  if (event.code === "KeyS") moveState.backward = false;
  if (event.code === "KeyA") moveState.left = false;
  if (event.code === "KeyD") moveState.right = false;
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
  if (moveState.forward) controls.moveForward(speed);
  if (moveState.backward) controls.moveForward(-speed);
  if (moveState.left) controls.moveRight(-speed);
  if (moveState.right) controls.moveRight(speed);
}
