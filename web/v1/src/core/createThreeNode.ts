import { BufferGeometry, Object3D } from "three"
import type { Snippet } from "svelte";

export type CreateThreeNodeParams = {
  id: string
  pid?: string | null
  //three-level properties
  object3d?: Object3D
}

export type ThreeNode = {
  //wrapper-level functions
  addChild: (node: ThreeNode) => void;
  destroyChild: (node: ThreeNode) => void;
  getChildren: () => void;
  children: Map<string, ThreeNode>
  pid?: string | null
  //three-level properties
} & CreateThreeNodeParams

//This is the base-level abstration of our threejs objects
//Contains an API for tree manipulation
export const createThreeNode = (params: CreateThreeNodeParams): ThreeNode => {
  const { id, object3d, pid = null } = params;

  const children = new Map<string, ThreeNode>()

  //API
  const addChild = (node: ThreeNode) => {
    if (node.id == null) {
    }

    if (children.has(node.id) === true) {
      console.log(`already has ${node.id}`)
      return
    }
    children.set(node.id, node)

    if (object3d == null || node.object3d == null) {
      return
    }

    object3d?.add(node.object3d)
  }

  const destroyChild = (node: ThreeNode) => {
    if (children.has(node.id) === true) {
      return
    }

    children.delete(node.id)

    if (object3d == null || node.object3d == null) {
      return
    }

    object3d.remove(node?.object3d)
  }

  //returns an array of the children
  const getChildren = () => {
    return children.values()
  }

  return {
    id,
    addChild,
    destroyChild,
    getChildren,
    children,
    object3d,
    pid
  } as ThreeNode
}

export type RenderParams = {
  objectKey: string;
  object3d?: Object3D;
  pid?: string | null;
};

type UseTreeRebuildParams = {
  processed: Map<string, ThreeNode>
  processQueue: ThreeNode[],
  rootNode: ThreeNode
}

export const useTreeRebuild = (params: UseTreeRebuildParams) => {
  const { processed, processQueue, rootNode } = params

  //callback on every three component to add it to the scene map
  const render = (params: RenderParams) => {
    //TODO: css-like styling applied within the render function
    const { objectKey, object3d, pid } = params;

    //Check if we already processed this (ignore if we did)
    if (processed.has(objectKey) === true) {
      console.error(`"${objectKey}" already processed.`);
      return null;
    }

    const newNode = createThreeNode({ id: objectKey, object3d, pid });

    //Add to process stack
    processed.set(objectKey, newNode);
    processQueue.push(newNode);

    return newNode
  };

  const processNodes = () => {
    for (let queuedNode of processQueue) {
      //TODO: I think i should be popping, but I wont
      if (queuedNode.pid == null) {
        rootNode.addChild(queuedNode);
        continue;
      }
      if (processed.has(queuedNode.pid) === false) {
        console.error(`PID ${queuedNode.pid} is not processed`);
        continue;
      }

      const parentNode = processed.get(queuedNode.pid);
      if (parentNode == null) {
        console.error(
          `PID ${queuedNode.pid} is undefined but specified by UID ${queuedNode.id} `,
        );
        continue;
      }
      parentNode.addChild(queuedNode);
    }
  }
  return { render, processNodes }
}


export type ThreeComponentProps = {
  render: (params: RenderParams) => ThreeNode | null;
  uid: string;
  pid?: string;
  children?: Snippet;
}
