/**
 * @file Manages various Three.js loaders with a unified interface and caching.
 * @module LoaderManager
 */

import { CustomGLTFLoader } from '@loaders/GLTFLoader';
import { CustomDRACOLoader } from '@loaders/DRACOLoader';
import { LumaLabsLoader } from '@loaders/LumaLabsLoader';
import { CustomRGBELoader } from '@loaders/RGBELoader';
import { CustomEXRLoader } from '@loaders/EXRLoader';

/**
 * @class LoaderManager
 * @description Provides a centralized system for loading assets, handling caching and concurrent requests gracefully.
 */
export class LoaderManager {
    /**
     * @constructor
     * @description Initializes the loader registry, cache, and a map to track in-progress loads.
     */
    constructor() {
        this.loaders = new Map();
        this.cache = new Map();
        this.loading = new Map();
        
        this.initializeLoaders();
    }

    /**
     * @method initializeLoaders
     * @description Registers a set of default loaders for common asset types.
     */
    initializeLoaders() {
        // Initialize basic loaders
        this.loaders.set('gltf', new CustomGLTFLoader());
        this.loaders.set('draco', new CustomDRACOLoader());
        this.loaders.set('splat', new LumaLabsLoader());
        this.loaders.set('rgbe', new CustomRGBELoader());
        this.loaders.set('exr', new CustomEXRLoader());
    }

    /**
     * @method load
     * @description Asynchronously loads an asset. It checks the cache first and handles concurrent requests for the same asset.
     * @param {string} type - The type of asset to load (e.g., 'gltf', 'splat').
     * @param {string} path - The path to the asset file.
     * @param {object} [options={}] - Optional parameters to pass to the specific loader.
     * @returns {Promise<any>} A promise that resolves with the loaded asset.
     * @throws {Error} If no loader is found for the specified type.
     */
    async load(type, path, options = {}) {
        // Check cache first
        const cacheKey = `${type}:${path}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        // Check if already loading
        if (this.loading.has(cacheKey)) {
            return this.loading.get(cacheKey);
        }

        const loader = this.loaders.get(type);
        if (!loader) {
            throw new Error(`No loader found for type: ${type}`);
        }

        // Create loading promise
        const loadingPromise = loader.load(path, options)
            .then(result => {
                this.cache.set(cacheKey, result);
                this.loading.delete(cacheKey);
                return result;
            })
            .catch(error => {
                this.loading.delete(cacheKey);
                throw error;
            });

        this.loading.set(cacheKey, loadingPromise);
        return loadingPromise;
    }

    /**
     * @method getLoader
     * @description Retrieves a loader instance by its type.
     * @param {string} type - The type of the loader to retrieve.
     * @returns {object|undefined} The loader instance, or undefined if not found.
     */
    getLoader(type) {
        return this.loaders.get(type);
    }

    /**
     * @method registerLoader
     * @description Registers a new loader instance.
     * @param {string} type - The type name to associate with the loader.
     * @param {object} loader - The loader instance to register.
     */
    registerLoader(type, loader) {
        this.loaders.set(type, loader);
    }

    /**
     * @method clearCache
     * @description Clears the asset cache.
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * @method dispose
     * @description Disposes of all registered loaders and clears all internal caches and maps.
     */
    dispose() {
        // Dispose all loaders
        this.loaders.forEach(loader => {
            if (loader.dispose) {
                loader.dispose();
            }
        });

        // Clear caches
        this.cache.clear();
        this.loading.clear();
    }
}
