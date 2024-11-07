import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { PMREMGenerator } from 'three';

export class EnvironmentManager {
    constructor(renderer, scene, config = {}) {
        this.renderer = renderer;
        this.scene = scene;
        
        // Environment lights
        this.environmentSun = new THREE.DirectionalLight(0xFFFFFF, 0);
        this.environmentSun.castShadow = true;
        this.environmentSun.shadow.bias = -0.001;
        this.environmentSun.shadow.radius = 7;
        this.environmentSun.visible = false;
        
        this.environmentAmbient = new THREE.AmbientLight(0x000000, 1);
        this.environmentAmbient.visible = false;
        
        this.scene.add(this.environmentSun);
        this.scene.add(this.environmentAmbient);

        // Debug object for tweaking
        this.debugObject = {
            intensity: 1,
            backgroundBlur: 0,
            environmentBlur: 0,
            sunIntensity: 0,
            ambientIntensity: 1,
            backgroundEnabled: true
        };
        
        // Settings
        this.currentEnvironment = null;
        this.pmremGenerator = new PMREMGenerator(this.renderer);
        this.pmremGenerator.compileEquirectangularShader();

        if (config.initialPath) {
            this.setEnvironmentMapPath(config.initialPath);
        }
    }
    
    async setEnvironmentMapPath(path, options = {}) {
        const extension = path.split('.').pop().toLowerCase();
        
        try {
            let texture;
            switch(extension) {
                case 'hdr':
                    texture = await this.loadHDR(path);
                    break;
                case 'exr':
                    texture = await this.loadEXR(path);
                    break;
                case 'png':
                case 'jpg':
                case 'jpeg':
                    texture = await this.loadLDR(path);
                    break;
                default:
                    throw new Error(`Unsupported format: ${extension}`);
            }

            this.setEnvironmentMap(texture, options);
            return texture;
        } catch (error) {
            console.error('Error loading environment map:', error);
            throw error;
        }
    }

    async loadHDR(path) {
        return new Promise((resolve, reject) => {
            new RGBELoader()
                .setDataType(THREE.FloatType)
                .load(path, 
                    texture => resolve(this.pmremGenerator.fromEquirectangular(texture).texture),
                    undefined,
                    reject
                );
        });
    }

    async loadEXR(path) {
        return new Promise((resolve, reject) => {
            new EXRLoader()
                .setDataType(THREE.FloatType)
                .load(path,
                    texture => resolve(this.pmremGenerator.fromEquirectangular(texture).texture),
                    undefined,
                    reject
                );
        });
    }

    async loadLDR(path) {
        return new Promise((resolve, reject) => {
            new THREE.TextureLoader().load(path, 
                texture => {
                    texture.minFilter = THREE.NearestFilter;
                    texture.magFilter = THREE.NearestFilter;
                    texture.type = THREE.UnsignedByteType;
                    texture.encoding = THREE.sRGBEncoding;
                    texture.generateMipmaps = false;
                    texture.flipY = false;
                    resolve(texture);
                },
                undefined,
                reject
            );
        });
    }
    
    setEnvironmentMap(texture, options = {}) {
        if (this.currentEnvironment) {
            this.currentEnvironment.dispose();
        }

        this.currentEnvironment = texture;
        this.scene.environment = texture;

        if (this.debugObject.backgroundEnabled) {
            this.scene.background = texture;
            this.scene.backgroundBlurriness = this.debugObject.backgroundBlur;
        }

        // Update light intensities
        this.environmentSun.intensity = this.debugObject.sunIntensity;
        this.environmentAmbient.intensity = this.debugObject.ambientIntensity;

        Object.assign(this.debugObject, options);
    }

    updateFromDebug() {
        if (this.currentEnvironment) {
            this.currentEnvironment.intensity = this.debugObject.intensity;
            if (this.scene.background === this.currentEnvironment) {
                this.scene.backgroundBlurriness = this.debugObject.backgroundBlur;
            }
        }
        this.environmentSun.intensity = this.debugObject.sunIntensity;
        this.environmentAmbient.intensity = this.debugObject.ambientIntensity;
    }

    dispose() {
        if (this.currentEnvironment) {
            this.currentEnvironment.dispose();
        }
        this.pmremGenerator.dispose();
    }
}
