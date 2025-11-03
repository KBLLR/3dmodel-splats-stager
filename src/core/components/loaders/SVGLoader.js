/**
 * @file A custom loader for SVG files, with caching support.
 * @module CustomSVGLoader
 */

import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";

/**
 * @class CustomSVGLoader
 * @description Wraps Three.js's SVGLoader to provide data caching and a simplified interface.
 */
export class CustomSVGLoader {
  /**
   * @constructor
   * @description Initializes the loader and sets up a cache for loaded SVG data.
   */
  constructor() {
    this.type = "svg";
    this.isCustomLoader = true;
    this.loader = new SVGLoader();
    this.cache = new Map();
  }

  /**
   * @method load
   * @description Asynchronously loads an SVG file. Caches the result to avoid redundant loads.
   * @param {string} path - The path to the SVG file.
   * @param {function|null} [onProgress=null] - A callback function for progress events.
   * @returns {Promise<object>} A promise that resolves with the loaded SVG data, which includes paths and other information.
   */
  async load(path, onProgress = null) {
    if (this.cache.has(path)) {
      return this.cache.get(path);
    }

    try {
      const data = await new Promise((resolve, reject) => {
        this.loader.load(path, resolve, onProgress, reject);
      });

      this.cache.set(path, data);
      return data;
    } catch (error) {
      console.error("Error loading SVG:", error);
      throw error;
    }
  }

  /**
   * @method dispose
   * @description Clears the cache of loaded SVG data.
   */
  dispose() {
    this.cache.clear();
  }
}
