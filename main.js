import * as THREE from "three";

import { room, buildRoom } from "./world";
import {
  setupPlayer,
  updatePlayerMovement,
  moveState,
  createPlayerModel,
  mixer,
  playAction,
  clock,
} from "./player";
import { cameraPov, cameraFixa } from "./camera";
import { createLights } from "./lights";
import { createModels } from "./models";

const canvas = document.querySelector("#c");
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas,
  powerPreference: "high-performance",
});
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202025);

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
const { modelGroup, vaso } = await createModels();
scene.add(modelGroup);

// ── Sala ─────────────────────────────────────────────────────────────
const roomGroup = await buildRoom();
scene.add(roomGroup);

// ── Luzes ─────────────────────────────────────────────────────────────
const lights = await createLights();
lights.forEach((light) => scene.add(light));

// ── Corpo do jogador ─────────────────────────────────────────────────
const playerModel = await createPlayerModel();
scene.add(playerModel);

// ── Player body (collision proxy) ────────────────────────────────────
const playerBody = new THREE.Mesh(
  new THREE.CapsuleGeometry(0.4, 1.2),
  new THREE.MeshBasicMaterial({ visible: false }),
);
scene.add(playerBody);

// ── Controles ────────────────────────────────────────────────────────
const controls = setupPlayer(cameraPov, document.body);

// ── Colisão nas paredes ──────────────────────────────────────────────
const MARGIN = 1.75;

function detectCollision() {
  const halfW = room.width / 2 - MARGIN;
  const halfD = room.depth / 2 - MARGIN;

  cameraPov.position.x = Math.max(
    -halfW,
    Math.min(halfW, cameraPov.position.x),
  );
  cameraPov.position.z = Math.max(
    -halfD,
    Math.min(halfD, cameraPov.position.z),
  );
  cameraPov.position.y = Math.max(
    1.6,
    Math.min(room.height - 0.5, cameraPov.position.y),
  );
}

// ── Loop principal ───────────────────────────────────────────────────
function animate() {
  const delta = clock.getDelta();
  const speed = 0.1;

  updatePlayerMovement(controls, speed);
  detectCollision();

  playerBody.position.copy(cameraPov.position);
  playerBody.position.y -= 2;

  if (playerModel) {
    playerModel.position.copy(cameraPov.position);
    playerModel.position.y = 0;

    const direction = new THREE.Vector3();
    cameraPov.getWorldDirection(direction);

    direction.y = 0;
    direction.normalize();

    const targetPoint = new THREE.Vector3()
      .copy(playerModel.position)
      .add(direction);

    playerModel.lookAt(targetPoint);

    playerModel.visible = cameraAtiva === cameraFixa;

    if (mixer) {
      if (moveState.forward || moveState.backward) {
        playAction("walk");
      } else if (moveState.left) {
        playAction("strafeLeft");
      } else if (moveState.right) {
        playAction("strafeRight");
      } else {
        playAction("idle");
      }
    }
  }

  if (mixer) mixer.update(delta);

  if (vaso) vaso.rotation.y += 0.01;

  renderer.render(scene, cameraAtiva);
}

renderer.setAnimationLoop(animate);
