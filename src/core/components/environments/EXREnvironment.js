/**
 * @file Manages an EXR-based environment for a Three.js scene.
 * @module EXREnvironment
 */

import * as THREE from "three";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader";

/**
 * @class EXREnvironment
 * @description Represents an EXR environment, loading a high-dynamic-range texture.
 */
export class EXREnvironment {
  /**
   * @constructor
   * @param {object} [params={}] - The parameters for the EXR environment.
   * @param {string|null} [params.path=null] - The path to the EXR file.
   * @param {number} [params.intensity=1.0] - The intensity of the environment map.
   * @param {number} [params.blur=0] - The blurriness of the environment map.
   * @param {number} [params.rotation=0] - The rotation of the environment map.
   */
  constructor(params = {}) {
    const { path = null, intensity = 1.0, blur = 0, rotation = 0 } = params;

    this.type = "exr";
    this.isCustomEnvironment = true;
    this.loader = new EXRLoader();
    this.envMap = null;

    this.debugObject = {
      intensity,
      blur,
      rotation,
      path,
    };
  }

  /**
   * @method load
   * @description Asynchronously loads the EXR texture and generates a PMREM environment map.
   * @param {THREE.WebGLRenderer} renderer - The Three.js renderer.
   * @returns {Promise<THREE.Texture|undefined>} A promise that resolves with the processed environment texture, or undefined if no path is provided.
   */
  async load(renderer) {
    if (!this.debugObject.path) return;

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    try {
      const texture = await this.loader.loadAsync(this.debugObject.path);
      texture.mapping = THREE.EquirectangularReflectionMapping;

      this.envMap = pmremGenerator.fromEquirectangular(texture).texture;

      texture.dispose();
      pmremGenerator.dispose();

      return this.envMap;
    } catch (error) {
      console.error("Error loading EXR:", error);
      throw error;
    }
  }

  /**
   * @method updateFromDebug
   * @description Updates the environment map's properties from the `debugObject`.
   */
  updateFromDebug() {
    if (this.envMap) {
      this.envMap.intensity = this.debugObject.intensity;
      this.envMap.blur = this.debugObject.blur;
      this.envMap.rotation = this.debugObject.rotation;
    }
  }

  /**
   * @method dispose
   * @description Disposes of the environment map to free up resources.
   */
  dispose() {
    if (this.envMap) {
      this.envMap.dispose();
    }
  }
}
