/**
 * @file A renderer optimized for Luma AI Gaussian Splatting models.
 * @module LumaRenderer
 */

import { CinematicRenderer } from "@renderers/CinematicRenderer";
import * as THREE from "three";

/**
 * @class LumaRenderer
 * @description Extends CinematicRenderer with settings specifically tailored for rendering
 * Luma AI splats, such as alpha handling and tone mapping adjustments.
 * @extends {CinematicRenderer}
 */
export class LumaRenderer extends CinematicRenderer {
  /**
   * @constructor
   * @param {object} [params={}] - The parameters for the renderer, passed to CinematicRenderer.
   */
  constructor(params = {}) {
    super(params);

    // Specific settings for Luma splats
    this.autoClear = true;
    this.premultipliedAlpha = false;

    // Override some settings for better splat rendering
    this.toneMapping = THREE.ACESFilmicToneMapping;
    this.toneMappingExposure = 1;

    /**
     * @property {object} debugObject - An object holding the renderer's parameters for debugging,
     * extended with Luma splat-specific properties.
     */
    this.debugObject = {
      ...this.debugObject,
      splats: {
        pointSize: 1,
        splatAlpha: 1,
        maxPointSize: 32,
      },
    };
  }

  /**
   * @method updateFromDebug
   * @description Updates the renderer's properties from the `debugObject`, including Luma-specific settings.
   */
  updateFromDebug() {
    super.updateFromDebug();
    // Luma-specific updates will go here
  }
}
