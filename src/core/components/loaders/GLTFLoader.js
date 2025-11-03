/**
 * @file A custom loader for GLTF models, with integrated Draco/KTX2 support and caching.
 * @module CustomGLTFLoader
 */

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader";

/**
 * @class CustomGLTFLoader
 * @description Wraps Three.js's GLTFLoader to provide integrated Draco and KTX2 support,
 * model caching, and a simplified interface.
 */
export class CustomGLTFLoader {
  /**
   * @constructor
   * @param {object} [params={}] - The parameters for the loader.
   * @param {string} [params.dracoPath='/draco/'] - The path to the Draco decoder files.
   * @param {string} [params.ktx2Path='/ktx2/'] - The path to the KTX2 transcoder files.
   * @param {boolean} [params.withDraco=true] - Whether to enable Draco compression support.
   * @param {boolean} [params.withKTX2=true] - Whether to enable KTX2 texture support.
   */
  constructor(params = {}) {
    const {
      dracoPath = "/draco/",
      ktx2Path = "/ktx2/",
      withDraco = true,
      withKTX2 = true,
    } = params;

    this.type = "gltf";
    this.isCustomLoader = true;

    this.loader = new GLTFLoader();
    this.dracoLoader = null;
    this.ktx2Loader = null;

    if (withDraco) {
      this.dracoLoader = new DRACOLoader();
      this.dracoLoader.setDecoderPath(dracoPath);
      this.loader.setDRACOLoader(this.dracoLoader);
    }

    if (withKTX2) {
      this.ktx2Loader = new KTX2Loader();
      this.ktx2Loader.setTranscoderPath(ktx2Path);
      this.loader.setKTX2Loader(this.ktx2Loader);
    }

    this.cache = new Map();
    /**
     * @property {object} debugObject - An object holding the loader's parameters for debugging.
     */
    this.debugObject = {
      dracoPath,
      ktx2Path,
      withDraco,
      withKTX2,
    };
  }

  /**
   * @method load
   * @description Asynchronously loads a GLTF model. Caches the result to avoid redundant loads.
   * @param {string} path - The path to the GLTF file.
   * @param {function|null} [onProgress=null] - A callback function for progress events.
   * @returns {Promise<THREE.Group>} A promise that resolves with the loaded GLTF scene.
   */
  async load(path, onProgress = null) {
    // Check cache first
    if (this.cache.has(path)) {
      return this.cache.get(path).clone();
    }

    try {
      const gltf = await new Promise((resolve, reject) => {
        this.loader.load(path, resolve, onProgress, reject);
      });

      // Cache the result
      this.cache.set(path, gltf.scene.clone());

      return gltf;
    } catch (error) {
      console.error("Error loading GLTF:", error);
      throw error;
    }
  }

  /**
   * @method dispose
   * @description Disposes of the loaders and all cached models to free up resources.
   */
  dispose() {
    if (this.dracoLoader) {
      this.dracoLoader.dispose();
    }
    if (this.ktx2Loader) {
      this.ktx2Loader.dispose();
    }
    // Clear cache
    this.cache.forEach((model) => {
      model.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => this.disposeMaterial(mat));
          } else {
            this.disposeMaterial(child.material);
          }
        }
      });
    });
    this.cache.clear();
  }

  /**
   * @method disposeMaterial
   * @description Disposes of a material and its associated textures.
   * @param {THREE.Material} material - The material to dispose.
   */
  disposeMaterial(material) {
    Object.keys(material).forEach((prop) => {
      if (!material[prop]) return;
      if (material[prop].isTexture) {
        material[prop].dispose();
      }
    });
    material.dispose();
  }
}
