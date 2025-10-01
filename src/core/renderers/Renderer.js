/**
 * @file A configurable WebGLRenderer with extensive debug capabilities.
 * @module Renderer
 */

import * as THREE from 'three';

/**
 * @class Renderer
 * @description A custom renderer that extends Three.js's WebGLRenderer to provide a comprehensive
 * set of pre-configured settings and a debug object for real-time manipulation.
 * @extends {THREE.WebGLRenderer}
 */
export class Renderer extends THREE.WebGLRenderer {
    /**
     * @constructor
     * @param {object} [params={}] - The parameters for the renderer.
     * @param {HTMLCanvasElement} params.canvas - The canvas element to render to.
     * @param {boolean} [params.antialias=true] - Whether to perform antialiasing.
     * @param {boolean} [params.alpha=true] - Whether the canvas contains an alpha (transparency) buffer.
     * @param {string} [params.powerPreference='high-performance'] - A hint to the user agent.
     * @param {boolean} [params.stencil=false] - Whether the drawing buffer has a stencil buffer.
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

        this.type = 'renderer';
        this.isCustomRenderer = true;

        // Basic setup
        this.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.setClearColor(0x000000, 0);
        this.setSize(window.innerWidth, window.innerHeight);
        
        // Physical settings
        this.physicallyCorrectLights = true;
        this.outputEncoding = THREE.sRGBEncoding;
        this.toneMapping = THREE.ACESFilmicToneMapping;
        this.toneMappingExposure = 1;
        
        // Shadows
        this.shadowMap.enabled = true;
        this.shadowMap.type = THREE.PCFSoftShadowMap;

        /**
         * @property {object} debugObject - An object holding renderer parameters for debugging.
         */
        this.debugObject = {
            clearColor: '#000000',
            clearAlpha: 0,
            toneMappingExposure: 1,
            toneMapping: 'ACESFilmic',
            outputEncoding: 'sRGB',
            shadowMapType: 'PCFSoft',
            physicallyCorrectLights: true,
            antialias: true,
            pixelRatio: window.devicePixelRatio
        };
    }

    /**
     * @method updateFromDebug
     * @description Updates the renderer's properties from the `debugObject`.
     */
    updateFromDebug() {
        const toneMappingTypes = {
            'None': THREE.NoToneMapping,
            'Linear': THREE.LinearToneMapping,
            'Reinhard': THREE.ReinhardToneMapping,
            'Cineon': THREE.CineonToneMapping,
            'ACESFilmic': THREE.ACESFilmicToneMapping
        };

        const encodingTypes = {
            'Linear': THREE.LinearEncoding,
            'sRGB': THREE.sRGBEncoding,
            'Gamma': THREE.GammaEncoding
        };

        const shadowMapTypes = {
            'Basic': THREE.BasicShadowMap,
            'PCF': THREE.PCFShadowMap,
            'PCFSoft': THREE.PCFSoftShadowMap,
            'VSM': THREE.VSMShadowMap
        };

        this.setClearColor(this.debugObject.clearColor, this.debugObject.clearAlpha);
        this.toneMapping = toneMappingTypes[this.debugObject.toneMapping];
        this.toneMappingExposure = this.debugObject.toneMappingExposure;
        this.outputEncoding = encodingTypes[this.debugObject.outputEncoding];
        this.shadowMap.type = shadowMapTypes[this.debugObject.shadowMapType];
        this.shadowMap.needsUpdate = true;
        this.physicallyCorrectLights = this.debugObject.physicallyCorrectLights;
        
        if (this.debugObject.antialias !== this.antialias) {
            console.warn('Antialiasing change requires renderer recreation');
        }
        
        this.setPixelRatio(Math.min(this.debugObject.pixelRatio, 2));
    }

    /**
     * @method resize
     * @description Resizes the renderer and updates the pixel ratio.
     * @param {number} width - The new width.
     * @param {number} height - The new height.
     */
    resize(width, height) {
        this.setSize(width, height);
        this.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
}
