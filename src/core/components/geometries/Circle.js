/**
 * @file Extends the Three.js CircleGeometry with a debug-friendly interface.
 * @module Circle
 */

import * as THREE from "three";

/**
 * @class Circle
 * @description A custom circle geometry that extends Three.js's CircleGeometry to provide
 * a simplified constructor and a debug object for easy manipulation.
 * @extends {THREE.CircleGeometry}
 */
export class Circle extends THREE.CircleGeometry {
  /**
   * @constructor
   * @param {object} [params={}] - The parameters for the circle geometry.
   * @param {number} [params.radius=1] - The radius of the circle.
   * @param {number} [params.segments=32] - The number of segments.
   * @param {number} [params.thetaStart=0] - The start angle for the circle segment.
   * @param {number} [params.thetaLength=Math.PI * 2] - The central angle of the circle segment.
   */
  constructor(params = {}) {
    const {
      radius = 1,
      segments = 32,
      thetaStart = 0,
      thetaLength = Math.PI * 2,
    } = params;

    super(radius, segments, thetaStart, thetaLength);

    this.type = "circle";
    this.isCustomGeometry = true;

    /**
     * @property {object} debugObject - An object holding the geometry's parameters for debugging.
     */
    this.debugObject = {
      radius,
      segments,
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
    const geometry = new THREE.CircleGeometry(
      this.debugObject.radius,
      this.debugObject.segments,
      this.debugObject.thetaStart,
      this.debugObject.thetaLength,
    );

    this.copy(geometry);
    geometry.dispose();
  }
}
