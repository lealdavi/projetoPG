# Projeto: Processamento Gráfico - Museu

Neste projeto, cada grupo ficou responsável pelo desenvolvimento de uma cena 3D contendo diferentes tópicos estudados durante a disciplina, como transformações, câmeras, fontes de iluminação, texturas, animações e criação de shaders.
O nosso grupo desenvolveu uma cena representando o interior de uma sala de museu, utilizando o framework javascript chamado de `three js`.

# Criação da sala

Para a criação da sala, inicialmente foi definido um vetor contendo as posições de cada plano que compõe o ambiente. Em seguida, foi implementada uma função responsável por carregar e posicionar cada plano na cena, utilizando as posições definidas no vetor, formando assim a estrutura da sala. A implementação completa está em `world.js`.

```javascript
const roomSurfaces = [
  {
    name: "floor",
    width: room.width,
    length: room.depth,
    texture: "/textures/floor/herringbone_parquet_4k.gltf",
    pos_x: 0,
    pos_y: 0,
    pos_z: 0,
    rot_x: -Math.PI / 2,
    rot_y: 0,
  },
  {
    name: "ceiling",
    width: room.width,
    length: room.depth,
    texture: "/textures/wall/plastered_wall_4k.gltf",
    pos_x: 0,
    pos_y: room.height,
    pos_z: 0,
    rot_x: Math.PI / 2,
    rot_y: 0,
  },
  {
    name: "left_wall",
    width: room.depth,
    length: room.height,
    texture: "/textures/wall/plastered_wall_4k.gltf",
    pos_x: -room.width / 2,
    pos_y: room.height / 2,
    pos_z: 0,
    rot_x: 0,
    rot_y: Math.PI / 2,
  },
  {
    name: "right_wall",
    width: room.depth,
    length: room.height,
    texture: "/textures/wall/plastered_wall_4k.gltf",
    pos_x: room.width / 2,
    pos_y: room.height / 2,
    pos_z: 0,
    rot_x: 0,
    rot_y: -Math.PI / 2,
  },
  {
    name: "front_wall",
    width: room.width,
    length: room.height,
    texture: "/textures/wall/plastered_wall_4k.gltf",
    pos_x: 0,
    pos_y: room.height / 2,
    pos_z: -room.depth / 2,
    rot_x: 0,
    rot_y: 0,
  },
  {
    name: "back_wall",
    width: room.width,
    length: room.height,
    texture: "/textures/wall/plastered_wall_4k.gltf",
    pos_x: 0,
    pos_y: room.height / 2,
    pos_z: room.depth / 2,
    rot_x: 0,
    rot_y: Math.PI,
  },
];

export async function buildRoom() {
  const roomGroup = new THREE.Group();

  const planes = await Promise.all(
    roomSurfaces.map(async (surface) => {
      const plane = await makePlane(
        surface.width,
        surface.length,
        surface.texture,
      );
      plane.position.set(surface.pos_x, surface.pos_y, surface.pos_z);
      plane.rotation.set(surface.rot_x, surface.rot_y, 0);
      plane.name = surface.name;
      return plane;
    }),
  );

  planes.forEach((plane) => roomGroup.add(plane));
}
```

# Inserção dos objetos

Para compor o cenário do museu, foram importados modelos em formato `.glb`, além disso foi criado um objeto próprio em `object.js` e foi posicionado cada um dos 10 objetos na cena através de transformações básicas. A implementação completa está em `models.js` e `object.js` e os objestos importados estão em public/models. 

```javascript
//Inserção dos objetos importados na cena

const loader = new GLTFLoader();

const [
    vaso,
    pilar_greece,
    aphrodite_statuette,
    casinha,
    quadro_rev_industrial,
    quadro,
    cesar,
    pilar_cesar,
    porta,
  ] = await Promise.all([
    load("/models/vaso.glb", (modelo) => {
      modelo.position.set(0, 2.8, 0);
      modelo.scale.set(4.5, 4, 4.5);
    }),

    load("/models/pilar_greece.glb", (modelo) => {
      modelo.position.set(0, 0, 0);
      modelo.scale.set(50, 25, 50);
    }),

    load("/models/aphrodite_statuette.glb", (modelo) => {
      modelo.position.set(12.5, 0, -7.5);
      modelo.scale.set(0.07, 0.07, 0.07);
    }),

    load(
      "/models/fancy_picture_frame_01_2k/fancy_picture_frame_01_2k.gltf",
      (modelo) => {
        modelo.position.set(0, 5, -10);
        modelo.scale.set(20, 20, 5);
      },
    ),

    load(
      "/models/fancy_picture_frame_02_2k/fancy_picture_frame_02_2k.gltf",
      (modelo) => {
        modelo.position.set(-15, 5, 0);
        modelo.scale.set(10, 10, 3);
        modelo.rotation.y = Math.PI / 2;
      },
    ),

    load(
      "/models/hanging_picture_frame_02_2k/hanging_picture_frame_02_2k.gltf",
      (modelo) => {
        modelo.position.set(15, 5, 0);
        modelo.scale.set(10, 10, 3);
        modelo.rotation.y = -Math.PI / 2;
      },
    ),

    load("/models/marble_bust_01_2k/marble_bust_01_2k.gltf", (modelo) => {
      modelo.position.set(-12.5, 3.4, -7.5);
      modelo.scale.set(10, 10, 10);
      modelo.rotation.y = Math.PI / 2;
    }),

    load("/models/pilar_greece.glb", (modelo) => {
      modelo.position.set(-12.5, 0, -7.5);
      modelo.scale.set(100, 30, 50);
    }),

    load(
      "/models/porta.glb",
      (modelo) => {
        modelo.position.set(10, 0, 8.5);
        modelo.scale.set(4, 4, 1);
      }),
  ]);

  //Inserção do octaedro na cena
  export function createObject() {

  const geometry = new THREE.OctahedronGeometry(0.35, 0);

  const rawMaterial = new THREE.RawShaderMaterial({
    vertexShader,
    fragmentShader,
  });

  const mesh = new THREE.Mesh(geometry, rawMaterial);

  return mesh;
}

const ob = createObject();
b.position.set(0, 4.8, 0);
```

# Aplicação de textura

Além da textura aplicada nativamentos nos objetos importados, foram aplicadas texturas no teto, piso e paredes da sala.
Para isso, inicialmente foram definidas as texturas utilizadas em cada plano que compõe a sala. Em seguida, o sistema realiza o mapeamento dessas texturas nos materiais dos objetos da cena, incluindo textura principal (map), mapa de normais (normalMap), rugosidade (roughnessMap), metalicidade (metalnessMap) e oclusão de ambiente (aoMap), configurando a textura para posterior aplicação durante a construção da sala. A implmentação completa está em `world.js` e as texturas importados estão em /public/textures.

```javascript
//Definição das texturas

const roomSurfaces = [
  {
    name: "floor",
    width: room.width,
    length: room.depth,
    texture: "/textures/floor/herringbone_parquet_4k.gltf",
    pos_x: 0,
    pos_y: 0,
    pos_z: 0,
    rot_x: -Math.PI / 2,
    rot_y: 0,
  },
  {
    name: "ceiling",
    width: room.width,
    length: room.depth,
    texture: "/textures/wall/plastered_wall_4k.gltf",
    pos_x: 0,
    pos_y: room.height,
    pos_z: 0,
    rot_x: Math.PI / 2,
    rot_y: 0,
  },
  {
    name: "left_wall",
    width: room.depth,
    length: room.height,
    texture: "/textures/wall/plastered_wall_4k.gltf",
    pos_x: -room.width / 2,
    pos_y: room.height / 2,
    pos_z: 0,
    rot_x: 0,
    rot_y: Math.PI / 2,
  },
  {
    name: "right_wall",
    width: room.depth,
    length: room.height,
    texture: "/textures/wall/plastered_wall_4k.gltf",
    pos_x: room.width / 2,
    pos_y: room.height / 2,
    pos_z: 0,
    rot_x: 0,
    rot_y: -Math.PI / 2,
  },
  {
    name: "front_wall",
    width: room.width,
    length: room.height,
    texture: "/textures/wall/plastered_wall_4k.gltf",
    pos_x: 0,
    pos_y: room.height / 2,
    pos_z: -room.depth / 2,
    rot_x: 0,
    rot_y: 0,
  },
  {
    name: "back_wall",
    width: room.width,
    length: room.height,
    texture: "/textures/wall/plastered_wall_4k.gltf",
    pos_x: 0,
    pos_y: room.height / 2,
    pos_z: room.depth / 2,
    rot_x: 0,
    rot_y: Math.PI,
  },
];

//Verificando os tipos de textura do gltf e aplicação das texturas nos planos

async function makePlane(width, length, gltfPath) {
  const gltf = await loader.loadAsync(getModelUrl(gltfPath));

  let material = null;
  gltf.scene.traverse((child) => {
    if (child.isMesh && !material) {
      material = child.material;
    }
  });

  if (!material) {
    throw new Error(`No mesh material found in ${gltfPath}`);
  }

  const mapKeys = ["map", "normalMap", "roughnessMap", "metalnessMap", "aoMap"];
  mapKeys.forEach((key) => {
    if (material[key]) {
      material[key].wrapS = THREE.RepeatWrapping;
      material[key].wrapT = THREE.RepeatWrapping;
      material[key].repeat.set(width / 4, length / 4);
      material[key].needsUpdate = true;
    }
  });

  material.needsUpdate = true;

  const geometry = new THREE.PlaneGeometry(width, length);
  return new THREE.Mesh(geometry, material);
}

```

# Cameras

Para o sistema de câmeras, foram definidas duas perspectivas distintas. A primeira consiste em uma câmera posicionada no alto da sala, simulando uma câmera de segurança. A segunda câmera representa o ponto de vista em primeira pessoa, permitindo a locomoção do usuário dentro da sala e a visualização dos objetos presentes no cenário por meio dos controles implementados. A implementação completa do sistema de câmeras está no arquivo `camera.js`.

```javascript
const fov = 75;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;

export const cameraPov = new THREE.PerspectiveCamera(fov, aspect, near, far);
cameraPov.position.set(0, 4, 5);

export const cameraFixa = new THREE.PerspectiveCamera(fov, aspect, near, far);
cameraFixa.position.set(14, 8, 9);
cameraFixa.lookAt(0, 0, 0);
```

# Iluminação

Para a iluminação, foram utilizados diferentes tipos de luzes para criar uma cena mais realista. Foi utilizada uma AmbientLight, responsável pela iluminação global do ambiente, uma HemisphereLight, que simula a luz indireta do cenário, e uma PointLight, utilizada como iluminação complementar da sala.
Além disso, foi implementado um sistema próprio de iluminação para o lustre presente no ambiente. Para isso, foram criadas múltiplas SpotLights, posicionadas em cada lâmpada do modelo 3D do lustre, criando uma iluminação mais realista. A implementação completa do sistema de luzes está no arquivo `light.js`.

```javascript
//Criação da luz ambiente
export async function createLights() {
  const ambientLight = new THREE.AmbientLight(0xfff4e0, 0.5);
  const hemiLight = new THREE.HemisphereLight(0xfff4e0, 0x8b6914, 0.8);
  const fillLight = new THREE.PointLight(0xfff4e0, 80, 30, 2);
  fillLight.position.set(0, 5, 0);

  const ceilingLight = await createCeilingLight(0, room.height - 0.2, 0);
  return [ambientLight, ceilingLight, hemiLight, fillLight];
}

//Criação dos pontos de iluminação para o lustre
clusters.forEach((c) => {
    const spot = new THREE.SpotLight(0xfff4e0, 150, 12, Math.PI / 5, 0.4, 2);
    spot.position.set(c.x, c.minY, c.z);
    spot.target.position.set(c.x, c.minY - 3, c.z);
    group.add(spot);
    group.add(spot.target);
  });
```

# Animação

Para a animação dos objetos, foi criada uma função chamada animate, executada continuamente em um loop de renderização. Essa função aplica uma rotação constante no eixo Y ao vaso, além de uma rotação adicional no octaedro adicionado à cena. A implementação completa da animação está no arquivo `main.js`.

```javascript
function animate() {
  if (vaso) {
    vaso.rotation.y += 0.01;
  }

  if (ob) {
    ob.rotation.y += 0.01;
    ob.position.y =
      4.8 + Math.sin(performance.now() * 0.0008) * 0.7;
    ob.rotation.z += 0.01;
  }

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
```

# Shader

Para a aplicação do shader, foi criado um octaedro no arquivo `object.js`. Em seguida, no arquivo `shader.js`, foi implementado um material customizado utilizando shaders GLSL. Esse shader aplica ao objeto um efeito de iluminação fictícia, uma borda brilhante, brilho especular e uma combinação de cores para o material.

```javascript
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
```

# Como Rodar

No diretório raiz do projeto:

1. Execute o comando para instalar os módulos do Node:
   ```bash
   npm install
   ```

2. Para iniciar o servidor, utilize:
   ```bash
   npm run dev
   ```
3. Acesse no seu navegador:
    ```bash
   http://localhost:5173/
   ```

OBS: Demora um pouquinho para carregar tudo.

# Controles

- MOUSE: mexe a camera do personagem(tem que clicar na tela primeiro)
- WASD: movimentação pelo cenário
- C : troca a camera

# Alunos

- Davi Leal de Sousa Siqueira - 832414
- Gabriel Matheus de Souza - 832254
- Letícia Ramos Fernandes - 834748
- Otávio Inácio de Oliveira - 831718
- Rafaela Eduarda Pereira do Nascimento - 830920

