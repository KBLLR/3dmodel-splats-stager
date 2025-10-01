/**
 * @file Extends the Three.js PlaneGeometry with a debug-friendly interface.
 * @module Plane
 */

import * as THREE from "three";

/**
 * @class Plane
 * @description A custom plane geometry that extends Three.js's PlaneGeometry to provide
 * a simplified constructor and a debug object for easy manipulation.
 * @extends {THREE.PlaneGeometry}
 */
export class Plane extends THREE.PlaneGeometry {
  /**
   * @constructor
   * @param {object} [params={}] - The parameters for the plane geometry.
   * @param {number} [params.width=1] - The width of the plane.
   * @param {number} [params.height=1] - The height of the plane.
   * @param {number} [params.widthSegments=1] - The number of segments along the width.
   * @param {number} [params.heightSegments=1] - The number of segments along the height.
   */
  constructor(params = {}) {
    const {
      width = 1,
      height = 1,
      widthSegments = 1,
      heightSegments = 1,
    } = params;

    super(width, height, widthSegments, heightSegments);

    this.type = "plane";
    this.isCustomGeometry = true;

    /**
     * @property {object} debugObject - An object holding the geometry's parameters for debugging.
     */
    this.debugObject = {
      width,
      height,
      widthSegments,
      heightSegments,
    };
  }

  /**
   * @method updateFromDebug
   * @description Updates the geometry's properties from the `debugObject`. This is useful for
   * dynamically updating the geometry from a GUI or other debug tools.
   */
  updateFromDebug() {
    const geometry = new THREE.PlaneGeometry(
      this.debugObject.width,
      this.debugObject.height,
      this.debugObject.widthSegments,
      this.debugObject.heightSegments,
    );

    this.copy(geometry);
    geometry.dispose();
  }
}
