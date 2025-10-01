/**
 * @file Extends the Three.js RectAreaLight with a debug-friendly interface.
 * @module RectAreaLight
 */

import * as THREE from "three";

/**
 * @class RectAreaLight
 * @description A custom rectangular area light that extends Three.js's RectAreaLight to provide
 * a debug object for easy manipulation of its properties.
 * @extends {THREE.RectAreaLight}
 */
export class RectAreaLight extends THREE.RectAreaLight {
  /**
   * @constructor
   * @param {number} [color=0xffffff] - The color of the light.
   * @param {number} [intensity=1] - The intensity of the light.
   * @param {number} [width=10] - The width of the light.
   * @param {number} [height=10] - The height of the light.
   */
  constructor(color = 0xffffff, intensity = 1, width = 10, height = 10) {
    super(color, intensity, width, height);

    this.type = "rectArea";
    this.isCustomLight = true;
    this.position.set(0, 5, 0);
    this.lookAt(0, 0, 0);

    /**
     * @property {object} debugObject - An object holding the light's parameters for debugging.
     * @property {number} debugObject.color - The color of the light.
     * @property {number} debugObject.intensity - The intensity of the light.
     * @property {number} debugObject.width - The width of the light.
     * @property {number} debugObject.height - The height of the light.
     * @property {object} debugObject.position - The position of the light.
     * @property {number} debugObject.position.x - The x coordinate of the light.
     * @property {number} debugObject.position.y - The y coordinate of the light.
     * @property {number} debugObject.position.z - The z coordinate of the light.
     */
    this.debugObject = {
      color: color,
      intensity: intensity,
      width: width,
      height: height,
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
    this.width = this.debugObject.width;
    this.height = this.debugObject.height;
    this.position.set(
      this.debugObject.position.x,
      this.debugObject.position.y,
      this.debugObject.position.z,
    );
    this.lookAt(0, 0, 0);
  }
}
