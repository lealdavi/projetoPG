# Projeto: Processamento Gráfico - Museu

Neste projeto, cada grupo ficou responsável pelo desenvolvimento de uma cena 3D contendo diferentes tópicos estudados durante a disciplina, como transformações, câmeras, fontes de iluminação, texturas, animações e criação de shaders.
O nosso grupo desenvolveu uma cena representando o interior de uma sala de museu, utilizando o framework javascript chamado de `three js`.

# Criação da sala

```javascript
codigo sala
```

# Inserção dos objetos

Para compor o cenário do museu, importamos modelos em formato `.glb` e posicionamos cada objeto na cena através de transformações básicas. Exemplo:

```javascript
const loader = new GLTFLoader();

load("/models/arquivo.glb", (modelo) => {
      modelo.position.set(dx, dy, dz);
      modelo.scale.set(sx, sy, sz);
      modelo.rotation.y = angulo em radianos;
    }),
```

Fotos dos objetos?

# Aplicação de textura

Além da textura aplicada nativamentos nos objetos importados, foram aplicadas texturas no teto, piso e paredes da sala.
Para isso, inicialmente foram definidas as texturas utilizadas em cada plano que compõe a sala. Em seguida, o sistema percorre os mapas de textura presentes no material carregado, como textura principal (`map`), mapa de relevo (`normalMap`), rugosidade (`roughnessMap`), metalicidade (`metalnessMap`) e sombreamento ambiente (`aoMap`), configurando esses mapas para posterior aplicação durante a construção da sala.

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

```javascript
codigo cameras
```

# Iluminação

```javascript
codigo iluminação
```

# Animação

Para a animação do objeto, criamos uma função chamada `animate`. Ela funciona em um loop que aplica uma rotação constante no eixo Y do vaso

```javascript
function animate() {
  if (vaso) {
    vaso.rotation.y += 0.01;
  }

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
```

# Shader

```javascript
codigo shader
```

# Como Rodar

1. No diretório raiz do projeto, execute o comando para instalar os módulos do Node:
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

# Controles

- MOUSE: mexe a camera do personagem(tem que clicar na tela primeiro)
- WASD: movimentação pelo cenário
- C : troca a camera

# Alunos

- Davi Leal de Sousa Siqueira - 832414
- Gabriel Matheus de Souza - 832254
- Letícia Ramos - 834748
- Otávio Inácio de Oliveira - 831718
- Rafaela Eduarda Pereira do Nascimento - 830920

