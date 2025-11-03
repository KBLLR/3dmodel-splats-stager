/**
 * @file Extends the Three.js AmbientLight with a debug-friendly interface.
 * @module AmbientLight
 */

import * as THREE from "three";

/**
 * @class AmbientLight
 * @description A custom ambient light that extends Three.js's AmbientLight to provide
 * a debug object for easy manipulation.
 * @extends {THREE.AmbientLight}
 */
export class AmbientLight extends THREE.AmbientLight {
  /**
   * @constructor
   * @param {number} [color=0xffffff] - The color of the light.
   * @param {number} [intensity=1] - The intensity of the light.
   */
  constructor(color = 0xffffff, intensity = 1) {
    super(color, intensity);

    // Additional properties for management
    this.type = "ambient";
    this.isCustomLight = true;
    /**
     * @property {object} debugObject - An object holding the light's parameters for debugging.
     */
    this.debugObject = {
      color: color,
      intensity: intensity,
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
  }
}
