/**
 * @file A custom loader for RGBE (.hdr) textures, with caching support.
 * @module CustomRGBELoader
 */

import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import * as THREE from "three";

/**
 * @class CustomRGBELoader
 * @description Wraps Three.js's RGBELoader to provide texture caching and a simplified interface.
 */
export class CustomRGBELoader {
  /**
   * @constructor
   * @description Initializes the loader and sets up a cache for loaded textures.
   */
  constructor() {
    this.type = "rgbe";
    this.isCustomLoader = true;
    this.loader = new RGBELoader();
    this.cache = new Map();

    /**
     * @property {object} debugObject - An object holding the loader's parameters for debugging.
     * @property {THREE.TextureDataType} debugObject.dataType - The data type for the loaded texture.
     */
    this.debugObject = {
      dataType: THREE.HalfFloatType,
    };
  }

  /**
   * @method load
   * @description Asynchronously loads an RGBE texture. Caches the result to avoid redundant loads.
   * @param {string} path - The path to the HDR file.
   * @param {function|null} [onProgress=null] - A callback function for progress events.
   * @returns {Promise<THREE.Texture>} A promise that resolves with the loaded texture.
   */
  async load(path, onProgress = null) {
    if (this.cache.has(path)) {
      return this.cache.get(path).clone();
    }

    try {
      this.loader.setDataType(this.debugObject.dataType);

      const texture = await new Promise((resolve, reject) => {
        this.loader.load(path, resolve, onProgress, reject);
      });

      texture.mapping = THREE.EquirectangularReflectionMapping;
      this.cache.set(path, texture);

      return texture;
    } catch (error) {
      console.error("Error loading RGBE:", error);
      throw error;
    }
  }

  /**
   * @method dispose
   * @description Disposes of all cached textures to free up resources.
   */
  dispose() {
    this.cache.forEach((texture) => texture.dispose());
    this.cache.clear();
  }
}
