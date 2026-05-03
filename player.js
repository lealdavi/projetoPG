import * as THREE from "three";
import { FBXLoader, PointerLockControls } from "three/examples/jsm/Addons.js";

export const moveState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
};

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
  controls.addEventListener("lock", () => console.log("Mouse travado!"));
  controls.addEventListener("unlock", () => console.log("Mouse livre!"));
  domElement.addEventListener("click", () => controls.lock());
  return controls;
}

export function updatePlayerMovement(controls, speed) {
  if (moveState.forward) controls.moveForward(speed);
  if (moveState.backward) controls.moveForward(-speed);
  if (moveState.left) controls.moveRight(-speed);
  if (moveState.right) controls.moveRight(speed);
}

const fbxLoader = new FBXLoader();

export let mixer = null;
export const clock = new THREE.Clock();

const actions = {};
let currentAction = null;

export function playAction(name, fadeTime = 0.2) {
  const next = actions[name];
  if (!next || currentAction === next) return;
  if (currentAction) currentAction.fadeOut(fadeTime);
  next.reset().fadeIn(fadeTime).play();
  currentAction = next;
}

async function loadAnim(name, file, onDone) {
  try {
    const anim = await fbxLoader.loadAsync(
      `/models/Basic Locomotion Pack/${file}`,
    );
    const clip = anim.animations[0];
    if (!clip) return;
    actions[name] = mixer.clipAction(clip);
    if (onDone) onDone();
  } catch (error) {
    console.error(`Erro ao carregar animação (${file}):`, error);
  }
}

export async function createPlayerModel() {
  const playerModel = await fbxLoader.loadAsync(
    "/models/Basic Locomotion Pack/character.fbx",
  );

  playerModel.scale.set(0.02, 0.02, 0.02);

  mixer = new THREE.AnimationMixer(playerModel);

  await loadAnim("idle", "idle.fbx", () => playAction("idle"));
  await loadAnim("walk", "walking.fbx");
  await loadAnim("strafeLeft", "left strafe walking.fbx");
  await loadAnim("strafeRight", "right strafe walking.fbx");
  await loadAnim("turnLeft", "left turn 90.fbx");
  await loadAnim("turnRight", "right turn 90.fbx");
  await loadAnim("jump", "jump.fbx");

  const playerWrapper = new THREE.Group();
  playerWrapper.add(playerModel);

  playerModel.position.y = 0;

  return playerWrapper;
}
