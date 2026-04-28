import * as THREE from 'three';

const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202025);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 5, 12);
camera.lookAt(0, 0, 0);

// lights for MeshPhongMaterial
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// floor
const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0x808080,
  side: THREE.DoubleSide
});
const floor = new THREE.Mesh(planeGeometry, planeMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -2;
scene.add(floor);

// colors
const color1 = new THREE.Color('skyblue');
const color2 = new THREE.Color('yellow');
const color3 = new THREE.Color('red');

// cubes
const cubeX = makeCube(color1, -8, 2, -3);
const cubeY = makeCube(color2, 0, 2, -3);
const cubeZ = makeCube(color3, 8, 2, -3);

const light_color = 0xFFFFFF;
const light_intensity = 3;
const light = new THREE.DirectionalLight(light_color, light_intensity);
light.position.set(-1, 2, 4);
scene.add(light);

function animate ( time ) {
    renderer.render( scene, camera );

    cubeX.rotation.x = (time/1000) * -Math.PI / 2;
    cubeY.rotation.y = (time/1000) * -Math.PI / 2;
    cubeZ.rotation.z = (time/1000) * -Math.PI / 2;


}

renderer.setAnimationLoop ( animate );


function makeCube(color, x, y, z) {
  const geometry = new THREE.BoxGeometry(4, 4, 4);
  const material = new THREE.MeshPhongMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);

  cube.position.set(x, y, z);
  scene.add(cube);

  return cube;
}