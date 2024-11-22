<script lang="ts">
  import { Scene, PerspectiveCamera, WebGLRenderer, Object3D } from "three";
  import ThreeObject1 from "./lib/ThreeObject1.svelte";
  import { createThreeNode, useTreeRebuild } from "./core/createThreeNode";
  import type { ThreeNode } from "./core/createThreeNode";

  //doing some fuckshit, this is totally not a good pattern, but DX is godly

  //Top level three Node
  const scene = new Scene();
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  const renderer = new WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.z = 5;

  //Contains the nodes proccsedd in-order
  const processQueue = $state<ThreeNode[]>([]);
  //Contains a map of every node, no nesting.
  const processed = $state<Map<string, ThreeNode>>(
    new Map<string, ThreeNode>(),
  );
  //Top-level tree
  const rootNode = $state(createThreeNode({ id: "root", object3d: scene }));
  const { render, processNodes } = useTreeRebuild({
    processed,
    processQueue,
    rootNode,
  });

  const animate = () => {
    renderer.render(scene, camera);
  };
  renderer.setAnimationLoop(animate);

  $effect(() => {
    document.body.appendChild(renderer.domElement);
    processNodes();
    console.log("rootNode: ", rootNode);
  });
</script>

<main>
  <ThreeObject1 {render} uid="a">
    <ThreeObject1 {render} uid="achild" pid="a" />
  </ThreeObject1>
  <ThreeObject1 {render} uid="b" />
</main>
