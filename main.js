import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/Addons.js";

import { buildRoom } from "./world";
import { setupPlayer, updatePlayerMovement } from "./player";

const canvas = document.querySelector("#c");
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202025);

const fov = 75;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;

const cameraPov = new THREE.PerspectiveCamera(fov, aspect, near, far);
cameraPov.position.set(0, 4, 0);

renderer.setSize(window.innerWidth, window.innerHeight);

const room = buildRoom();
scene.add(room);

const controls = setupPlayer(cameraPov, document.body);

// light

const light_color = 0xffffff;
const light_intensity = 3;
const light = new THREE.DirectionalLight(light_color, light_intensity);
light.position.set(-1, 2, 4);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const bodyGeometry = new THREE.CylinderGeometry(1, 1, 4, 16); // Raio 1, Altura 4
const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Vermelho para destacar
const playerBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
scene.add(playerBody);

const cameraFixa = new THREE.PerspectiveCamera(fov, aspect, near, far);
cameraFixa.position.set(14, 8, 9); // Canto superior da sala
cameraFixa.lookAt(0, 0, 0); // Apontando para o centro

// Variável que guarda quem está ativa no momento
let cameraAtiva = cameraPov; // Começa com a sua POV original

// O interruptor (Tecla 'C' para trocar)
window.addEventListener("keydown", (event) => {
  if (event.code === "KeyC") {
    cameraAtiva = cameraAtiva === cameraPov ? cameraFixa : cameraPov;
  }
});

function animate(time) {
  const speed = 0.1;
  updatePlayerMovement(controls, speed);
  playerBody.position.copy(cameraPov.position);
  playerBody.position.y -= 2;

  renderer.render(scene, cameraAtiva);
}

renderer.setAnimationLoop(animate);
