# Projeto: Processamento Gráfico

Resumo projeto

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

```javascript
codigo textura
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

- Davi Leal - 8
- Gabriel Matheus de Souza - 832254
- Letícia Ramos - 834748
- Otávio Inácio de Oliveira - 831718
- Rafaela Eduarda - 8

