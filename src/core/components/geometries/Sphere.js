/**
 * @file Extends the Three.js SphereGeometry with a debug-friendly interface.
 * @module Sphere
 */

import * as THREE from "three";

/**
 * @class Sphere
 * @description A custom sphere geometry that extends Three.js's SphereGeometry to provide
 * a simplified constructor and a debug object for easy manipulation.
 * @extends {THREE.SphereGeometry}
 */
export class Sphere extends THREE.SphereGeometry {
  /**
   * @constructor
   * @param {object} [params={}] - The parameters for the sphere geometry.
   * @param {number} [params.radius=1] - The radius of the sphere.
   * @param {number} [params.widthSegments=32] - The number of horizontal segments.
   * @param {number} [params.heightSegments=16] - The number of vertical segments.
   * @param {number} [params.phiStart=0] - The starting angle for the horizontal segments.
   * @param {number} [params.phiLength=Math.PI * 2] - The total angle for the horizontal segments.
   * @param {number} [params.thetaStart=0] - The starting angle for the vertical segments.
   * @param {number} [params.thetaLength=Math.PI] - The total angle for the vertical segments.
   */
  constructor(params = {}) {
    const {
      radius = 1,
      widthSegments = 32,
      heightSegments = 16,
      phiStart = 0,
      phiLength = Math.PI * 2,
      thetaStart = 0,
      thetaLength = Math.PI,
    } = params;

    super(
      radius,
      widthSegments,
      heightSegments,
      phiStart,
      phiLength,
      thetaStart,
      thetaLength,
    );

    this.type = "sphere";
    this.isCustomGeometry = true;

    /**
     * @property {object} debugObject - An object holding the geometry's parameters for debugging.
     */
    this.debugObject = {
      radius,
      widthSegments,
      heightSegments,
      phiStart,
      phiLength,
      thetaStart,
      thetaLength,
    };
  }

  /**
   * @method updateFromDebug
   * @description Updates the geometry's properties from the `debugObject`. This is useful for
   * dynamically updating the geometry from a GUI or other debug tools.
   */
  updateFromDebug() {
    const geometry = new THREE.SphereGeometry(
      this.debugObject.radius,
      this.debugObject.widthSegments,
      this.debugObject.heightSegments,
      this.debugObject.phiStart,
      this.debugObject.phiLength,
      this.debugObject.thetaStart,
      this.debugObject.thetaLength,
    );

    this.copy(geometry);
    geometry.dispose();
  }
}
