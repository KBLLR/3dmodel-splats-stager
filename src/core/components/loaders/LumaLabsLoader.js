/**
 * @file A custom loader for Luma Labs AI Gaussian Splatting models.
 * @module LumaLabsLoader
 */

import { LumaSplatsThree } from '@lumaai/luma-web';

/**
 * @class LumaLabsLoader
 * @description Wraps the `@lumaai/luma-web` library to provide splat loading, caching,
 * and integration helpers for Three.js scenes.
 */
export class LumaLabsLoader {
    /**
     * @constructor
     * @description Initializes the loader, cache, and a debug object for settings.
     */
    constructor() {
        this.type = 'splat';
        this.isCustomLoader = true;
        this.cache = new Map();
        
        /**
         * @property {object} debugObject - An object holding the loader's parameters for debugging.
         */
        this.debugObject = {
            particleRevealEnabled: true,
            loadingAnimationEnabled: true,
            enableThreeShaderIntegration: true,
            semanticsMask: null,
            source: null
        };
    }

    /**
     * @method load
     * @description Asynchronously loads a Luma splat model. Caches the result to avoid redundant loads.
     * @param {string} path - The source URL or path to the Luma splat model.
     * @param {object} [params={}] - Optional parameters for the LumaSplatsThree instance.
     * @returns {Promise<LumaSplatsThree>} A promise that resolves with the loaded splat object.
     */
    async load(path, params = {}) {
        if (this.cache.has(path)) {
            return this.cache.get(path);
        }

        try {
            const splat = new LumaSplatsThree({
                source: path,
                particleRevealEnabled: params.particleRevealEnabled ?? this.debugObject.particleRevealEnabled,
                loadingAnimationEnabled: params.loadingAnimationEnabled ?? this.debugObject.loadingAnimationEnabled,
                enableThreeShaderIntegration: params.enableThreeShaderIntegration ?? this.debugObject.enableThreeShaderIntegration
            });

            // Wait for the splat to load
            await new Promise((resolve) => {
                splat.onLoad = () => resolve();
            });

            this.cache.set(path, splat);
            return splat;

        } catch (error) {
            console.error('Error loading Splat:', error);
            throw error;
        }
    }

    /**
     * @method setShaderHooks
     * @description Sets custom shader hooks on the splat material.
     * @param {LumaSplatsThree} splat - The loaded splat object.
     * @param {object} hooks - The shader hooks to apply.
     */
    setShaderHooks(splat, hooks) {
        if (splat && hooks) {
            splat.setShaderHooks(hooks);
        }
    }

    /**
     * @method setupEnvironment
     * @description Sets up the scene's environment map and background by capturing a cubemap from the splat.
     * @param {LumaSplatsThree} splat - The loaded splat object.
     * @param {THREE.WebGLRenderer} renderer - The Three.js renderer.
     * @param {THREE.Scene} scene - The Three.js scene.
     */
    setupEnvironment(splat, renderer, scene) {
        if (splat && renderer && scene) {
            splat.onLoad = () => {
                splat.captureCubemap(renderer).then((capturedTexture) => {
                    scene.environment = capturedTexture;
                    scene.background = capturedTexture;
                    scene.backgroundBlurriness = 0.5;
                });
            };
        }
    }

    /**
     * @method dispose
     * @description Disposes of all cached splat models to free up resources.
     */
    dispose() {
        this.cache.forEach(splat => {
            if (splat.material) {
                splat.material.dispose();
            }
            if (splat.geometry) {
                splat.geometry.dispose();
            }
        });
        this.cache.clear();
    }
}
