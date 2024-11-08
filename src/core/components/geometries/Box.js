import * as THREE from "three";

export class Box extends THREE.BoxGeometry {
  constructor(params = {}) {
    const {
      width = 1,
      height = 1,
      depth = 1,
      widthSegments = 1,
      heightSegments = 1,
      depthSegments = 1,
    } = params;

    super(width, height, depth, widthSegments, heightSegments, depthSegments);

    this.type = "box";
    this.isCustomGeometry = true;

    this.debugObject = {
      width,
      height,
      depth,
      widthSegments,
      heightSegments,
      depthSegments,
    };
  }

  updateFromDebug() {
    const geometry = new THREE.BoxGeometry(
      this.debugObject.width,
      this.debugObject.height,
      this.debugObject.depth,
      this.debugObject.widthSegments,
      this.debugObject.heightSegments,
      this.debugObject.depthSegments,
    );

    this.copy(geometry);
    geometry.dispose();
  }
}
