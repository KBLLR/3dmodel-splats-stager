/**
 * @file Extends the Three.js DirectionalLight with a debug-friendly interface.
 * @module DirectionalLight
 */

import * as THREE from "three";

/**
 * @class DirectionalLight
 * @description A custom directional light that extends Three.js's DirectionalLight to provide
 * a debug object for easy manipulation of its properties.
 * @extends {THREE.DirectionalLight}
 */
export class DirectionalLight extends THREE.DirectionalLight {
  /**
   * @constructor
   * @param {number} [color=0xffffff] - The color of the light.
   * @param {number} [intensity=1] - The intensity of the light.
   */
  constructor(color = 0xffffff, intensity = 1) {
    super(color, intensity);

    this.type = "directional";
    this.isCustomLight = true;
    this.castShadow = true;
    this.position.set(5, 5, 5);

    /**
     * @property {object} debugObject - An object holding the light's parameters for debugging.
     * @property {number} debugObject.color - The color of the light.
     * @property {number} debugObject.intensity - The intensity of the light.
     * @property {object} debugObject.position - The position of the light.
     * @property {number} debugObject.position.x - The x coordinate of the light.
     * @property {number} debugObject.position.y - The y coordinate of the light.
     * @property {number} debugObject.position.z - The z coordinate of the light.
     */
    this.debugObject = {
      color: color,
      intensity: intensity,
      position: { x: 5, y: 5, z: 5 },
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
    this.position.set(
      this.debugObject.position.x,
      this.debugObject.position.y,
      this.debugObject.position.z,
    );
  }
}
