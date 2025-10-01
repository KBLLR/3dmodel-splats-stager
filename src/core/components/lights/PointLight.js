/**
 * @file Extends the Three.js PointLight with a debug-friendly interface.
 * @module PointLight
 */

import * as THREE from "three";

/**
 * @class PointLight
 * @description A custom point light that extends Three.js's PointLight to provide
 * a debug object for easy manipulation of its properties.
 * @extends {THREE.PointLight}
 */
export class PointLight extends THREE.PointLight {
  /**
   * @constructor
   * @param {number} [color=0xffffff] - The color of the light.
   * @param {number} [intensity=1] - The intensity of the light.
   * @param {number} [distance=0] - The maximum range of the light. Default is 0 (no limit).
   * @param {number} [decay=2] - The amount the light dims along the distance of the light.
   */
  constructor(color = 0xffffff, intensity = 1, distance = 0, decay = 2) {
    super(color, intensity, distance, decay);

    this.type = "point";
    this.isCustomLight = true;
    this.castShadow = true;
    this.position.set(0, 5, 0);

    /**
     * @property {object} debugObject - An object holding the light's parameters for debugging.
     * @property {number} debugObject.color - The color of the light.
     * @property {number} debugObject.intensity - The intensity of the light.
     * @property {number} debugObject.distance - The distance of the light.
     * @property {number} debugObject.decay - The decay factor of the light.
     * @property {object} debugObject.position - The position of the light.
     * @property {number} debugObject.position.x - The x coordinate of the light.
     * @property {number} debugObject.position.y - The y coordinate of the light.
     * @property {number} debugObject.position.z - The z coordinate of the light.
     */
    this.debugObject = {
      color: color,
      intensity: intensity,
      distance: distance,
      decay: decay,
      position: { x: 0, y: 5, z: 0 },
    };
  }

  /**
   * @method updateFromDebug
   * @description Updates the light's properties from the `debugObject`. This is useful for
   * dynamically updating the light from a GUI or other debug tools.
   */
  updateFromDebug() {
    this.color.set(this.debugObject.color);
    this.intensity = this.debugObject.intensity;
    this.distance = this.debugObject.distance;
    this.decay = this.debugObject.decay;
    this.position.set(
      this.debugObject.position.x,
      this.debugObject.position.y,
      this.debugObject.position.z,
    );
  }
}
