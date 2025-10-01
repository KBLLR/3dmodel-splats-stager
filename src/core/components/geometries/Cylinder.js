/**
 * @file Extends the Three.js CylinderGeometry with a debug-friendly interface.
 * @module Cylinder
 */

import * as THREE from "three";

/**
 * @class Cylinder
 * @description A custom cylinder geometry that extends Three.js's CylinderGeometry to provide
 * a simplified constructor and a debug object for easy manipulation.
 * @extends {THREE.CylinderGeometry}
 */
export class Cylinder extends THREE.CylinderGeometry {
  /**
   * @constructor
   * @param {object} [params={}] - The parameters for the cylinder geometry.
   * @param {number} [params.radiusTop=1] - The radius of the cylinder at the top.
   * @param {number} [params.radiusBottom=1] - The radius of the cylinder at the bottom.
   * @param {number} [params.height=1] - The height of the cylinder.
   * @param {number} [params.radialSegments=32] - The number of segmented faces around the circumference.
   * @param {number} [params.heightSegments=1] - The number of rows of faces along the height.
   * @param {boolean} [params.openEnded=false] - A boolean indicating whether the ends of the cylinder are open or capped.
   * @param {number} [params.thetaStart=0] - The start angle for the cylinder segment.
   * @param {number} [params.thetaLength=Math.PI * 2] - The central angle of the cylinder segment.
   */
  constructor(params = {}) {
    const {
      radiusTop = 1,
      radiusBottom = 1,
      height = 1,
      radialSegments = 32,
      heightSegments = 1,
      openEnded = false,
      thetaStart = 0,
      thetaLength = Math.PI * 2,
    } = params;

    super(
      radiusTop,
      radiusBottom,
      height,
      radialSegments,
      heightSegments,
      openEnded,
      thetaStart,
      thetaLength,
    );

    this.type = "cylinder";
    this.isCustomGeometry = true;

    /**
     * @property {object} debugObject - An object holding the geometry's parameters for debugging.
     */
    this.debugObject = {
      radiusTop,
      radiusBottom,
      height,
      radialSegments,
      heightSegments,
      openEnded,
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
    const geometry = new THREE.CylinderGeometry(
      this.debugObject.radiusTop,
      this.debugObject.radiusBottom,
      this.debugObject.height,
      this.debugObject.radialSegments,
      this.debugObject.heightSegments,
      this.debugObject.openEnded,
      this.debugObject.thetaStart,
      this.debugObject.thetaLength,
    );

    this.copy(geometry);
    geometry.dispose();
  }
}
