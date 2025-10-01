/**
 * @file A custom loader for MaterialX files, with caching support.
 * @module CustomMaterialXLoader
 */

import { MaterialXLoader } from 'three/examples/jsm/loaders/MaterialXLoader';

/**
 * @class CustomMaterialXLoader
 * @description Wraps Three.js's MaterialXLoader to provide material caching and a simplified interface.
 */
export class CustomMaterialXLoader {
    /**
     * @constructor
     * @description Initializes the loader and sets up a cache for loaded materials.
     */
    constructor() {
        this.type = 'materialx';
        this.isCustomLoader = true;
        this.loader = new MaterialXLoader();
        this.cache = new Map();
    }

    /**
     * @method load
     * @description Asynchronously loads a MaterialX file. Caches the result to avoid redundant loads.
     * @param {string} path - The path to the MaterialX file.
     * @param {function|null} [onProgress=null] - A callback function for progress events.
     * @returns {Promise<object>} A promise that resolves with the loaded material data.
     */
    async load(path, onProgress = null) {
        if (this.cache.has(path)) {
            return this.cache.get(path).clone();
        }

        try {
            const materialData = await new Promise((resolve, reject) => {
                this.loader.load(
                    path,
                    resolve,
                    onProgress,
                    reject
                );
            });

            this.cache.set(path, materialData);
            return materialData;

        } catch (error) {
            console.error('Error loading MaterialX:', error);
            throw error;
        }
    }

    /**
     * @method dispose
     * @description Disposes of all cached materials to free up resources.
     */
    dispose() {
        this.cache.forEach(materialData => {
            if (materialData.material) materialData.material.dispose();
        });
        this.cache.clear();
    }
}
