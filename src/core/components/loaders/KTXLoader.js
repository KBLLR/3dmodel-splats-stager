/**
 * @file A custom loader for KTX2 textures, with caching and renderer support detection.
 * @module CustomKTXLoader
 */

import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader';

/**
 * @class CustomKTXLoader
 * @description Wraps Three.js's KTX2Loader to provide texture caching and simplified renderer integration.
 */
export class CustomKTXLoader {
    /**
     * @constructor
     * @param {THREE.WebGLRenderer} [renderer] - The Three.js renderer to detect support against.
     */
    constructor(renderer) {
        this.type = 'ktx';
        this.isCustomLoader = true;
        this.loader = new KTX2Loader();
        this.cache = new Map();
        
        if (renderer) {
            this.loader.setTranscoderPath('/basis/');
            this.loader.detectSupport(renderer);
        }
        
        /**
         * @property {object} debugObject - An object holding the loader's parameters for debugging.
         * @property {string} debugObject.transcoderPath - The path to the Basis transcoder files.
         */
        this.debugObject = {
            transcoderPath: '/basis/'
        };
    }

    /**
     * @method load
     * @description Asynchronously loads a KTX2 texture. Caches the result to avoid redundant loads.
     * @param {string} path - The path to the KTX2 file.
     * @param {function|null} [onProgress=null] - A callback function for progress events.
     * @returns {Promise<THREE.Texture>} A promise that resolves with the loaded texture.
     */
    async load(path, onProgress = null) {
        if (this.cache.has(path)) {
            return this.cache.get(path).clone();
        }

        try {
            const texture = await new Promise((resolve, reject) => {
                this.loader.load(
                    path,
                    resolve,
                    onProgress,
                    reject
                );
            });

            this.cache.set(path, texture);
            return texture;

        } catch (error) {
            console.error('Error loading KTX:', error);
            throw error;
        }
    }

    /**
     * @method dispose
     * @description Disposes of all cached textures to free up resources.
     */
    dispose() {
        this.cache.forEach(texture => texture.dispose());
        this.cache.clear();
    }

    /**
     * @method updateRenderer
     * @description Updates the loader with a new renderer to detect support.
     * @param {THREE.WebGLRenderer} renderer - The new Three.js renderer.
     */
    updateRenderer(renderer) {
        this.loader.detectSupport(renderer);
    }
}
