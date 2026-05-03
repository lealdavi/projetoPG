import * as THREE from "three";

const fov = 75;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;

export const cameraPov = new THREE.PerspectiveCamera(fov, aspect, near, far);
cameraPov.position.set(0, 4, 5);

export const cameraFixa = new THREE.PerspectiveCamera(fov, aspect, near, far);
cameraFixa.position.set(14, 8, 9);
cameraFixa.lookAt(0, 0, 0);
