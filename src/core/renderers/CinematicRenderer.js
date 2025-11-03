/**
 * @file A renderer with settings tailored for a cinematic look, including post-processing effects.
 * @module CinematicRenderer
 */

import { BasicRenderer } from "@renderers/BasicRenderer";
import * as THREE from "three";

/**
 * @class CinematicRenderer
 * @description Extends BasicRenderer with settings and properties for cinematic post-processing effects
 * like bloom, vignette, and film grain.
 * @extends {BasicRenderer}
 */
export class CinematicRenderer extends BasicRenderer {
  /**
   * @constructor
   * @param {object} [params={}] - The parameters for the renderer, passed to BasicRenderer.
   */
  constructor(params = {}) {
    super(params);

    // Enhanced cinematic settings
    this.toneMapping = THREE.ACESFilmicToneMapping;
    this.toneMappingExposure = 1.2;
    this.outputColorSpace = THREE.SRGBColorSpace;

    // Post-processing properties
    this.enableBloom = true;
    this.enableVignette = true;
    this.enableFilmGrain = true;

    /**
     * @property {object} debugObject - An object holding the renderer's parameters for debugging,
     * extended with cinematic post-processing properties.
     */
    this.debugObject = {
      ...this.debugObject,
      bloom: {
        enabled: true,
        intensity: 1,
        threshold: 0.9,
        radius: 0.8,
      },
      vignette: {
        enabled: true,
        darkness: 0.5,
        offset: 0.5,
      },
      filmGrain: {
        enabled: true,
        intensity: 0.35,
      },
      chromaticAberration: {
        enabled: true,
        offset: 0.005,
      },
    };
  }

  /**
   * @method updateFromDebug
   * @description Updates the renderer's properties from the `debugObject`, including cinematic effects.
   */
  updateFromDebug() {
    super.updateFromDebug();
    // Additional cinematic updates will go here when we add post-processing
  }
}
