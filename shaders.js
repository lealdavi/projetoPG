// shaders.js

export const vertexShader = `
precision mediump float;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat3 normalMatrix;

attribute vec3 position;
attribute vec3 normal;

varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vViewDir = normalize(-mvPosition.xyz);

  gl_Position = projectionMatrix * mvPosition;
}
`;

export const fragmentShader = `
precision mediump float;

varying vec3 vNormal;
varying vec3 vViewDir;

void main() {

  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vViewDir);

  // luz artificial
  vec3 light = normalize(vec3(0.4, 1.0, 0.3));

  // fresnel
  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 4.0);

  // diffuse
  float diffuse = max(dot(normal, light), 0.0);

  // specular
  vec3 reflect = reflect(-light, normal);
  float specular = pow(max(dot(viewDir, reflect), 0.0), 96.0);

  // cores
  vec3 baseColor = vec3(0.08, 0.22, 0.55);

  vec3 edgeColor = vec3(0.45, 0.8, 1.0);

  vec3 color =
    baseColor * (0.4 + diffuse * 0.6) +
    edgeColor * fresnel * 1.2 +
    vec3(specular) * 2.3;

  gl_FragColor = vec4(color, 1.0);
}
`;