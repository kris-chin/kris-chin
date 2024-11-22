<script lang="ts">
  import { BoxGeometry, MeshBasicMaterial, Mesh } from "three";
  import type { ThreeNode, ThreeComponentProps } from "../core/createThreeNode";
  let { render, uid, pid, children }: ThreeComponentProps = $props();

  const geometry = new BoxGeometry(1, 1, 1);
  const material = new MeshBasicMaterial({ color: 0x00ff00 });
  const object3d = new Mesh(geometry, material);

  let threeNode = $state<ThreeNode | null>(null);

  $effect(() => {
    threeNode = render({
      objectKey: uid,
      object3d,
      pid,
    });
  });
</script>

{@render children?.()}
