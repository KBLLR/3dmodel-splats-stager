/**
 * @file A custom loader for Draco compressed geometries, with caching support.
 * @module CustomDRACOLoader
 */

import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

/**
 * @class CustomDRACOLoader
 * @description Wraps Three.js's DRACOLoader to provide geometry caching and a simplified interface.
 */
export class CustomDRACOLoader {
  /**
   * @constructor
   * @param {object} [params={}] - The parameters for the loader.
   * @param {string} [params.decoderPath='/draco/'] - The path to the Draco decoder files.
   */
  constructor(params = {}) {
    const { decoderPath = "/draco/" } = params;

    this.type = "draco";
    this.isCustomLoader = true;
    this.loader = new DRACOLoader();
    this.loader.setDecoderPath(decoderPath);
    this.cache = new Map();

    /**
     * @property {object} debugObject - An object holding the loader's parameters for debugging.
     */
    this.debugObject = {
      decoderPath,
    };
  }

  /**
   * @method load
   * @description Asynchronously loads a Draco-compressed geometry. Caches the result to avoid redundant loads.
   * @param {string} path - The path to the Draco file.
   * @param {function|null} [onProgress=null] - A callback function for progress events.
   * @returns {Promise<THREE.BufferGeometry>} A promise that resolves with the loaded geometry.
   */
  async load(path, onProgress = null) {
    if (this.cache.has(path)) {
      return this.cache.get(path).clone();
    }

    try {
      const geometry = await new Promise((resolve, reject) => {
        this.loader.load(path, resolve, onProgress, reject);
      });

      this.cache.set(path, geometry.clone());
      return geometry;
    } catch (error) {
      console.error("Error loading Draco geometry:", error);
      throw error;
    }
  }

  /**
   * @method dispose
   * @description Disposes of the loader and all cached geometries to free up resources.
   */
  dispose() {
    this.loader.dispose();
    this.cache.forEach((geometry) => geometry.dispose());
    this.cache.clear();
  }

  /**
   * @method updateDecoderPath
   * @description Updates the path to the Draco decoder files.
   * @param {string} path - The new decoder path.
   */
  updateDecoderPath(path) {
    this.debugObject.decoderPath = path;
    this.loader.setDecoderPath(path);
  }
}
