import { CustomGLTFLoader } from '@loaders/GLTFLoader';
import { CustomDRACOLoader } from '@loaders/DRACOLoader';
import { LumaLabsLoader } from '@loaders/LumaLabsLoader';
import { CustomRGBELoader } from '@loaders/RGBELoader';
import { CustomEXRLoader } from '@loaders/EXRLoader';

export class LoaderManager {
    constructor() {
        this.loaders = new Map();
        this.cache = new Map();
        this.loading = new Map();
        
        this.initializeLoaders();
    }

    initializeLoaders() {
        // Initialize basic loaders
        this.loaders.set('gltf', new CustomGLTFLoader());
        this.loaders.set('draco', new CustomDRACOLoader());
        this.loaders.set('splat', new LumaLabsLoader());
        this.loaders.set('rgbe', new CustomRGBELoader());
        this.loaders.set('exr', new CustomEXRLoader());
    }

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

    getLoader(type) {
        return this.loaders.get(type);
    }

    registerLoader(type, loader) {
        this.loaders.set(type, loader);
    }

    clearCache() {
        this.cache.clear();
    }

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
