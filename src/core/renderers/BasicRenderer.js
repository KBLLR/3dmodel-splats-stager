import * as THREE from 'three';

export class BasicRenderer extends THREE.WebGLRenderer {
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

        this.debugObject = {
            toneMappingExposure: 1,
            toneMapping: 'ACESFilmic',
            outputEncoding: 'sRGB',
            shadowMapType: 'PCFSoft'
        };
    }

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
            'sRGB': THREE.sRGBEncoding,
            'Gamma': THREE.GammaEncoding
        };
        this.outputEncoding = encodingTypes[this.debugObject.outputEncoding];

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
