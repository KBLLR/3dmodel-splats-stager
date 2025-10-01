/**
 * @file Extends the Three.js BoxGeometry with a debug-friendly interface.
 * @module Box
 */

import * as THREE from "three";

/**
 * @class Box
 * @description A custom box geometry that extends Three.js's BoxGeometry to provide
 * a simplified constructor and a debug object for easy manipulation.
 * @extends {THREE.BoxGeometry}
 */
export class Box extends THREE.BoxGeometry {
  /**
   * @constructor
   * @param {object} [params={}] - The parameters for the box geometry.
   * @param {number} [params.width=1] - The width of the box.
   * @param {number} [params.height=1] - The height of the box.
   * @param {number} [params.depth=1] - The depth of the box.
   * @param {number} [params.widthSegments=1] - The number of segments along the width.
   * @param {number} [params.heightSegments=1] - The number of segments along the height.
   * @param {number} [params.depthSegments=1] - The number of segments along the depth.
   */
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

    /**
     * @property {object} debugObject - An object holding the geometry's parameters for debugging.
     */
    this.debugObject = {
      width,
      height,
      depth,
      widthSegments,
      heightSegments,
      depthSegments,
    };
  }

  /**
   * @method updateFromDebug
   * @description Updates the geometry's properties from the `debugObject`. This is useful for
   * dynamically updating the geometry from a GUI or other debug tools.
   */
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
