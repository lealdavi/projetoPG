import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/Addons.js";

import { buildRoom } from "./world";
import { setupPlayer, updatePlayerMovement } from "./player";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

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
  }
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
  }
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
  }
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
  }
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
    }
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
          if (child.name.toLowerCase().includes("glass") || 
              child.material.name.toLowerCase().includes("glass")) {
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
    }
  );


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

