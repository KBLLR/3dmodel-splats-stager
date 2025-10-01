/**
 * @file A custom loader for USDZ models, with caching support.
 * @module CustomUSDZLoader
 */

import { USDZLoader } from "three/examples/jsm/loaders/USDZLoader";

/**
 * @class CustomUSDZLoader
 * @description Wraps Three.js's USDZLoader to provide model caching and a simplified interface.
 */
export class CustomUSDZLoader {
  /**
   * @constructor
   * @description Initializes the loader and sets up a cache for loaded models.
   */
  constructor() {
    this.type = "usdz";
    this.isCustomLoader = true;
    this.loader = new USDZLoader();
    this.cache = new Map();
  }

  /**
   * @method load
   * @description Asynchronously loads a USDZ model. Caches the result to avoid redundant loads.
   * @param {string} path - The path to the USDZ file.
   * @param {function|null} [onProgress=null] - A callback function for progress events.
   * @returns {Promise<THREE.Group>} A promise that resolves with the loaded model.
   */
  async load(path, onProgress = null) {
    if (this.cache.has(path)) {
      return this.cache.get(path).clone();
    }

    try {
      const scene = await new Promise((resolve, reject) => {
        this.loader.load(path, resolve, onProgress, reject);
      });

      this.cache.set(path, scene.clone());
      return scene;
    } catch (error) {
      console.error("Error loading USDZ:", error);
      throw error;
    }
  }

  /**
   * @method dispose
   * @description Disposes of all cached models to free up resources.
   * It traverses the model to dispose of geometries and materials.
   */
  dispose() {
    this.cache.forEach((scene) => {
      scene.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => mat.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    });
    this.cache.clear();
  }
}
