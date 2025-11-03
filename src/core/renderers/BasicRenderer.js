/**
 * @file A basic WebGLRenderer with pre-configured settings for common use cases.
 * @module BasicRenderer
 */

import * as THREE from 'three';

/**
 * @class BasicRenderer
 * @description A custom renderer that extends Three.js's WebGLRenderer with pre-configured settings
 * for physically correct lighting, tone mapping, and shadows.
 * @extends {THREE.WebGLRenderer}
 */
export class BasicRenderer extends THREE.WebGLRenderer {
    /**
     * @constructor
     * @param {object} [params={}] - The parameters for the renderer.
     * @param {HTMLCanvasElement} params.canvas - The canvas element to render to.
     * @param {boolean} [params.antialias=true] - Whether to perform antialiasing.
     * @param {boolean} [params.alpha=true] - Whether the canvas contains an alpha (transparency) buffer.
     * @param {string} [params.powerPreference='high-performance'] - A hint to the user agent indicating what configuration of GPU is suitable.
     * @param {boolean} [params.stencil=false] - Whether the drawing buffer has a stencil buffer of at least 8 bits.
     */
    constructor(params = {}) {
        const {
            canvas,
            antialias = true,
            alpha = true,
            powerPreference = 'high-performance',
            stencil = false
        } = params;

        super({
            canvas,
            antialias,
            alpha,
            powerPreference,
            stencil
        });

        this.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.setClearColor(0x000000, 0);
        this.setSize(window.innerWidth, window.innerHeight);
        
        this.physicallyCorrectLights = true;
        this.outputEncoding = THREE.sRGBEncoding;
        this.toneMapping = THREE.ACESFilmicToneMapping;
        this.toneMappingExposure = 1;
        this.shadowMap.enabled = true;
        this.shadowMap.type = THREE.PCFSoftShadowMap;

        /**
         * @property {object} debugObject - An object holding the renderer's parameters for debugging.
         */
        this.debugObject = {
            toneMappingExposure: 1,
            toneMapping: 'ACESFilmic',
            outputEncoding: 'sRGB',
            shadowMapType: 'PCFSoft'
        };
    }

    /**
     * @method updateFromDebug
     * @description Updates the renderer's properties from the `debugObject`. This is useful for
     * dynamically updating the renderer from a GUI or other debug tools.
     */
    updateFromDebug() {
        // Update tone mapping
        const toneMappingTypes = {
            'None': THREE.NoToneMapping,
            'Linear': THREE.LinearToneMapping,
            'Reinhard': THREE.ReinhardToneMapping,
            'Cineon': THREE.CineonToneMapping,
            'ACESFilmic': THREE.ACESFilmicToneMapping
        };
        this.toneMapping = toneMappingTypes[this.debugObject.toneMapping];
        this.toneMappingExposure = this.debugObject.toneMappingExposure;

        // Update encoding
        const encodingTypes = {
            'Linear': THREE.LinearEncoding,
            'sRGB': THREE.sRGBEncoding
        };
        if (this.debugObject.outputEncoding === 'Gamma') {
            console.warn(
                '[BasicRenderer] GammaEncoding is not available in this version of three.js; falling back to sRGBEncoding.'
            );
        }
        this.outputEncoding = encodingTypes[this.debugObject.outputEncoding] ?? THREE.sRGBEncoding;

        // Update shadow map type
        const shadowMapTypes = {
            'Basic': THREE.BasicShadowMap,
            'PCF': THREE.PCFShadowMap,
            'PCFSoft': THREE.PCFSoftShadowMap,
            'VSM': THREE.VSMShadowMap
        };
        this.shadowMap.type = shadowMapTypes[this.debugObject.shadowMapType];
        this.shadowMap.needsUpdate = true;
    }
}
