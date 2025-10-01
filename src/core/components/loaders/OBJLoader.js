/**
 * @file A custom loader for OBJ models, with caching support.
 * @module CustomOBJLoader
 */

import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

/**
 * @class CustomOBJLoader
 * @description Wraps Three.js's OBJLoader to provide model caching and a simplified interface.
 */
export class CustomOBJLoader {
  /**
   * @constructor
   * @description Initializes the loader and sets up a cache for loaded models.
   */
  constructor() {
    this.type = "obj";
    this.isCustomLoader = true;
    this.loader = new OBJLoader();
    this.cache = new Map();
  }

  /**
   * @method load
   * @description Asynchronously loads an OBJ model. Caches the result to avoid redundant loads.
   * @param {string} path - The path to the OBJ file.
   * @param {function|null} [onProgress=null] - A callback function for progress events.
   * @returns {Promise<THREE.Group>} A promise that resolves with the loaded model.
   */
  async load(path, onProgress = null) {
    if (this.cache.has(path)) {
      return this.cache.get(path).clone();
    }

    try {
      const object = await new Promise((resolve, reject) => {
        this.loader.load(path, resolve, onProgress, reject);
      });

      this.cache.set(path, object.clone());
      return object;
    } catch (error) {
      console.error("Error loading OBJ:", error);
      throw error;
    }
  }

  /**
   * @method dispose
   * @description Disposes of all cached models to free up resources.
   * It traverses the model to dispose of geometries and materials.
   */
  dispose() {
    this.cache.forEach((object) => {
      object.traverse((child) => {
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
