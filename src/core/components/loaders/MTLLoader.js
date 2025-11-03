/**
 * @file A custom loader for MTL (Material Template Library) files, with caching support.
 * @module CustomMTLLoader
 */

import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';

/**
 * @class CustomMTLLoader
 * @description Wraps Three.js's MTLLoader to provide material caching and a simplified interface.
 */
export class CustomMTLLoader {
    /**
     * @constructor
     * @description Initializes the loader and sets up a cache for loaded materials.
     */
    constructor() {
        this.type = 'mtl';
        this.isCustomLoader = true;
        this.loader = new MTLLoader();
        this.cache = new Map();
    }

    /**
     * @method load
     * @description Asynchronously loads an MTL file. Caches the result to avoid redundant loads.
     * @param {string} path - The path to the MTL file.
     * @param {function|null} [onProgress=null] - A callback function for progress events.
     * @returns {Promise<MTLLoader.MaterialCreator>} A promise that resolves with the loaded material creator instance.
     */
    async load(path, onProgress = null) {
        if (this.cache.has(path)) {
            return this.cache.get(path).clone();
        }

        try {
            const materials = await new Promise((resolve, reject) => {
                this.loader.load(
                    path,
                    resolve,
                    onProgress,
                    reject
                );
            });

            materials.preload();
            this.cache.set(path, materials);
            return materials;

        } catch (error) {
            console.error('Error loading MTL:', error);
            throw error;
        }
    }

    /**
     * @method dispose
     * @description Disposes of all cached materials to free up resources.
     */
    dispose() {
        this.cache.forEach(materials => {
            Object.values(materials.materials).forEach(material => {
                material.dispose();
            });
        });
        this.cache.clear();
    }
}
