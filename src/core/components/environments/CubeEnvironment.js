/**
 * @file Manages a cube-mapped environment for a Three.js scene.
 * @module CubeEnvironment
 */

import * as THREE from "three";

/**
 * @class CubeEnvironment
 * @description Represents a cube-mapped environment, loading textures for each of the six faces.
 */
export class CubeEnvironment {
  /**
   * @constructor
   * @param {object} [params={}] - The parameters for the cube environment.
   * @param {object} [params.paths] - The paths to the six cube map textures.
   * @param {string|null} [params.paths.px=null] - Path to the positive X texture.
   * @param {string|null} [params.paths.nx=null] - Path to the negative X texture.
   * @param {string|null} [params.paths.py=null] - Path to the positive Y texture.
   * @param {string|null} [params.paths.ny=null] - Path to the negative Y texture.
   * @param {string|null} [params.paths.pz=null] - Path to the positive Z texture.
   * @param {string|null} [params.paths.nz=null] - Path to the negative Z texture.
   * @param {number} [params.intensity=1.0] - The intensity of the environment map.
   * @param {number} [params.rotation=0] - The rotation of the environment map.
   */
  constructor(params = {}) {
    const {
      paths = {
        px: null,
        nx: null,
        py: null,
        ny: null,
        pz: null,
        nz: null,
      },
      intensity = 1.0,
      rotation = 0,
    } = params;

    this.type = "cube";
    this.isCustomEnvironment = true;
    this.loader = new THREE.CubeTextureLoader();
    this.envMap = null;

    this.debugObject = {
      paths,
      intensity,
      rotation,
    };
  }

  /**
   * @method load
   * @description Asynchronously loads the cube map textures.
   * @returns {Promise<THREE.CubeTexture|undefined>} A promise that resolves with the loaded cube texture, or undefined if paths are not provided.
   */
  async load() {
    const { paths } = this.debugObject;
    if (!Object.values(paths).every((path) => path)) return;

    try {
      this.envMap = await this.loader.loadAsync([
        paths.px,
        paths.nx,
        paths.py,
        paths.ny,
        paths.pz,
        paths.nz,
      ]);

      this.envMap.intensity = this.debugObject.intensity;
      this.envMap.rotation = this.debugObject.rotation;

      return this.envMap;
    } catch (error) {
      console.error("Error loading Cube Environment:", error);
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
