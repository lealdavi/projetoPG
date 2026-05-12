import * as THREE from "three";
import { vertexShader, fragmentShader } from "./shaders.js";

export function createObject() {

  const geometry = new THREE.OctahedronGeometry(0.35, 0);

  const rawMaterial = new THREE.RawShaderMaterial({
    vertexShader,
    fragmentShader,
  });

  const mesh = new THREE.Mesh(geometry, rawMaterial);

  return mesh;
}