/**
 * Loads a triangle-mesh PLY (the files already in src/assets/ply are trimesh exports)
 * as a colored mesh. Gaussian splats use the Luma loader, not this path.
 */

import * as THREE from "three";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader.js";
import { assetUrl } from "@template/assetUrl";

export class PlyMeshLoader {
  constructor() {
    this.type = "ply";
    this.isCustomLoader = true;
    this.loader = new PLYLoader();
  }

  async load(path) {
    const geometry = await this.loader.loadAsync(assetUrl(path));
    geometry.computeVertexNormals();
    const hasColor = geometry.hasAttribute("color");
    const material = new THREE.MeshStandardMaterial({
      vertexColors: hasColor,
      color: hasColor ? 0xffffff : 0xc8c2b8,
      roughness: 0.72,
      metalness: 0.04,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = "ply-reference";

    geometry.computeBoundingBox();
    const box = geometry.boundingBox;
    if (box) {
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);
      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      const scale = 2.4 / maxDim;
      mesh.scale.setScalar(scale);
      mesh.position.copy(center).multiplyScalar(-scale);
    }

    return mesh;
  }

  dispose() {
    this.loader = null;
  }
}
