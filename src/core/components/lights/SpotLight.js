/**
 * @file Extends the Three.js SpotLight with a debug-friendly interface.
 * @module SpotLight
 */

import * as THREE from "three";

/**
 * @class SpotLight
 * @description A custom spot light that extends Three.js's SpotLight to provide
 * a debug object for easy manipulation of its properties.
 * @extends {THREE.SpotLight}
 */
export class SpotLight extends THREE.SpotLight {
  /**
   * @constructor
   * @param {number} [color=0xffffff] - The color of the light.
   * @param {number} [intensity=1] - The intensity of the light.
   * @param {number} [distance=0] - The maximum range of the light. Default is 0 (no limit).
   * @param {number} [angle=Math.PI / 3] - The maximum angle of the light's cone.
   * @param {number} [penumbra=0] - The percent of the spotlight cone that is softened due to penumbra.
   * @param {number} [decay=2] - The amount the light dims along the distance of the light.
   */
  constructor(
    color = 0xffffff,
    intensity = 1,
    distance = 0,
    angle = Math.PI / 3,
    penumbra = 0,
    decay = 2,
  ) {
    super(color, intensity, distance, angle, penumbra, decay);

    this.type = "spot";
    this.isCustomLight = true;
    this.castShadow = true;
    this.position.set(0, 10, 0);

    /**
     * @property {object} debugObject - An object holding the light's parameters for debugging.
     * @property {number} debugObject.color - The color of the light.
     * @property {number} debugObject.intensity - The intensity of the light.
     * @property {number} debugObject.distance - The distance of the light.
     * @property {number} debugObject.angle - The angle of the light's cone.
     * @property {number} debugObject.penumbra - The penumbra of the light's cone.
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
      angle: angle,
      penumbra: penumbra,
      decay: decay,
      position: { x: 0, y: 10, z: 0 },
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
    this.angle = this.debugObject.angle;
    this.penumbra = this.debugObject.penumbra;
    this.decay = this.debugObject.decay;
    this.position.set(
      this.debugObject.position.x,
      this.debugObject.position.y,
      this.debugObject.position.z,
    );
  }
}
