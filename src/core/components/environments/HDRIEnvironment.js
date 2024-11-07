import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

export class HDRIEnvironment {
    constructor(params = {}) {
        const {
            path = null,
            intensity = 1.0,
            blur = 0,
            rotation = 0
        } = params;

        this.type = 'hdri';
        this.isCustomEnvironment = true;
        this.loader = new RGBELoader();
        this.envMap = null;
        
        this.debugObject = {
            intensity,
            blur,
            rotation,
            path
        };
    }

    async load(renderer) {
        if (!this.debugObject.path) return;

        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        pmremGenerator.compileEquirectangularShader();

        try {
            const texture = await this.loader.loadAsync(this.debugObject.path);
            texture.mapping = THREE.EquirectangularReflectionMapping;

            this.envMap = pmremGenerator.fromEquirectangular(texture).texture;
            
            texture.dispose();
            pmremGenerator.dispose();

            return this.envMap;
        } catch (error) {
            console.error('Error loading HDRI:', error);
            throw error;
        }
    }

    updateFromDebug(renderer) {
        if (this.envMap) {
            this.envMap.intensity = this.debugObject.intensity;
            this.envMap.blur = this.debugObject.blur;
            this.envMap.rotation = this.debugObject.rotation;
        }
    }

    dispose() {
        if (this.envMap) {
            this.envMap.dispose();
        }
    }
}
