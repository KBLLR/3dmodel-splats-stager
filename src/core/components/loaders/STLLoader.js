/**
 * @file A custom loader for STL (STereoLithography) files, with caching support.
 * @module CustomSTLLoader
 */

import { STLLoader } from "three/examples/jsm/loaders/STLLoader";

/**
 * @class CustomSTLLoader
 * @description Wraps Three.js's STLLoader to provide geometry caching and a simplified interface.
 */
export class CustomSTLLoader {
  /**
   * @constructor
   * @description Initializes the loader and sets up a cache for loaded geometries.
   */
  constructor() {
    this.type = "stl";
    this.isCustomLoader = true;
    this.loader = new STLLoader();
    this.cache = new Map();
  }

  /**
   * @method load
   * @description Asynchronously loads an STL geometry. Caches the result to avoid redundant loads.
   * @param {string} path - The path to the STL file.
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
      console.error("Error loading STL:", error);
      throw error;
    }
  }

  /**
   * @method dispose
   * @description Disposes of all cached geometries to free up resources.
   */
  dispose() {
    this.cache.forEach((geometry) => geometry.dispose());
    this.cache.clear();
  }
}
