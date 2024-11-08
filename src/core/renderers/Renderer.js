import * as THREE from 'three';

export class Renderer extends THREE.WebGLRenderer {
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

        // Debug parameters
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

    updateFromDebug() {
        // Update renderer settings based on debug parameters
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

        // Apply updates
        this.setClearColor(this.debugObject.clearColor, this.debugObject.clearAlpha);
        this.toneMapping = toneMappingTypes[this.debugObject.toneMapping];
        this.toneMappingExposure = this.debugObject.toneMappingExposure;
        this.outputEncoding = encodingTypes[this.debugObject.outputEncoding];
        this.shadowMap.type = shadowMapTypes[this.debugObject.shadowMapType];
        this.shadowMap.needsUpdate = true;
        this.physicallyCorrectLights = this.debugObject.physicallyCorrectLights;
        
        // Handle antialias and pixel ratio carefully as they require renderer recreation
        if (this.debugObject.antialias !== this.antialias) {
            console.warn('Antialiasing change requires renderer recreation');
        }
        
        this.setPixelRatio(Math.min(this.debugObject.pixelRatio, 2));
    }

    resize(width, height) {
        this.setSize(width, height);
        this.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
}
