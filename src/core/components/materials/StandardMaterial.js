import * as THREE from 'three';

export class StandardMaterial extends THREE.MeshStandardMaterial {
    constructor(params = {}) {
        const {
            color = 0xffffff,
            roughness = 0.5,
            metalness = 0.5,
            map = null,
            normalMap = null,
            roughnessMap = null,
            metalnessMap = null,
            aoMap = null,
            aoMapIntensity = 1,
            emissive = 0x000000,
            emissiveIntensity = 1,
            emissiveMap = null,
            bumpMap = null,
            bumpScale = 1,
            displacementMap = null,
            displacementScale = 1,
            displacementBias = 0,
            envMap = null,
            wireframe = false,
            transparent = false,
            opacity = 1
        } = params;

        super({
            color,
            roughness,
            metalness,
            map,
            normalMap,
            roughnessMap,
            metalnessMap,
            aoMap,
            aoMapIntensity,
            emissive,
            emissiveIntensity,
            emissiveMap,
            bumpMap,
            bumpScale,
            displacementMap,
            displacementScale,
            displacementBias,
            envMap,
            wireframe,
            transparent,
            opacity
        });

        this.type = 'standard';
        this.isCustomMaterial = true;

        this.debugObject = {
            color,
            roughness,
            metalness,
            aoMapIntensity,
            emissive,
            emissiveIntensity,
            bumpScale,
            displacementScale,
            displacementBias,
            wireframe,
            transparent,
            opacity
        };
    }

    updateFromDebug() {
        Object.entries(this.debugObject).forEach(([key, value]) => {
            if (this[key] !== undefined) {
                if (key === 'color' || key === 'emissive') {
                    this[key].set(value);
                } else {
                    this[key] = value;
                }
            }
        });
    }
}
