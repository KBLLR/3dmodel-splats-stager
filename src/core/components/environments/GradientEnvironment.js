/**
 * @file Manages a gradient-based environment for a Three.js scene.
 * @module GradientEnvironment
 */

import * as THREE from "three";

/**
 * @class GradientEnvironment
 * @description Creates a procedural gradient texture to be used as a scene background or environment map.
 */
export class GradientEnvironment {
  /**
   * @constructor
   * @param {object} [params={}] - The parameters for the gradient environment.
   * @param {string} [params.topColor='#000000'] - The color at the top of the gradient.
   * @param {string} [params.bottomColor='#ffffff'] - The color at the bottom of the gradient.
   * @param {number} [params.offset=0.5] - The position of the bottom color in the gradient (0-1).
   * @param {number} [params.exponent=1.0] - The exponent for the gradient curve.
   */
  constructor(params = {}) {
    const {
      topColor = "#000000",
      bottomColor = "#ffffff",
      offset = 0.5,
      exponent = 1.0,
    } = params;

    this.type = "gradient";
    this.isCustomEnvironment = true;
    this.texture = null;

    this.debugObject = {
      topColor,
      bottomColor,
      offset,
      exponent,
    };

    this.createGradientTexture();
  }

  /**
   * @method createGradientTexture
   * @description Generates the canvas and gradient texture based on the current debugObject properties.
   */
  createGradientTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 2;
    canvas.height = 256;

    const context = canvas.getContext("2d");
    const gradient = context.createLinearGradient(0, 0, 0, 256);

    gradient.addColorStop(0, this.debugObject.topColor);
    gradient.addColorStop(
      this.debugObject.offset,
      this.debugObject.bottomColor,
    );

    context.fillStyle = gradient;
    context.fillRect(0, 0, 2, 256);

    if (this.texture) {
      this.texture.dispose();
    }

    this.texture = new THREE.CanvasTexture(
      canvas,
      THREE.UVMapping,
      THREE.ClampToEdgeWrapping,
      THREE.ClampToEdgeWrapping,
      THREE.LinearFilter,
      THREE.LinearFilter,
    );
  }

  /**
   * @method updateFromDebug
   * @description Recreates the gradient texture when debug parameters are changed.
   */
  updateFromDebug() {
    this.createGradientTexture();
  }

  /**
   * @method dispose
   * @description Disposes of the gradient texture to free up resources.
   */
  dispose() {
    if (this.texture) {
      this.texture.dispose();
    }
  }
}
