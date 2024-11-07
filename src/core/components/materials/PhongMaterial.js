import * as THREE from 'three';

export class PhongMaterial extends THREE.MeshPhongMaterial {
    constructor(params = {}) {
        const {
            color = 0xffffff,
            emissive = 0x000000,
            specular = 0x111111,
            shininess = 30,
            map = null,
            bumpMap = null,
            bumpScale = 1,
            normalMap = null,
            normalScale = new THREE.Vector2(1, 1),
            displacementMap = null,
            displacementScale = 1,
            displacementBias = 0,
            envMap = null,
            combine = THREE.MultiplyOperation,
            reflectivity = 1,
            refractionRatio = 0.98,
            wireframe = false,
            transparent = false,
            opacity = 1
        } = params;

        super({
            color,
            emissive,
            specular,
            shininess,
            map,
            bumpMap,
            bumpScale,
            normalMap,
            normalScale,
            displacementMap,
            displacementScale,
            displacementBias,
            envMap,
            combine,
            reflectivity,
            refractionRatio,
            wireframe,
            transparent,
            opacity
        });

        this.type = 'phong';
        this.isCustomMaterial = true;

        this.debugObject = {
            color,
            emissive,
            specular,
            shininess,
            bumpScale,
            displacementScale,
            displacementBias,
            reflectivity,
            refractionRatio,
            wireframe,
            transparent,
            opacity
        };
    }

    updateFromDebug() {
        Object.entries(this.debugObject).forEach(([key, value]) => {
            if (this[key] !== undefined) {
                if (['color', 'emissive', 'specular'].includes(key)) {
                    this[key].set(value);
                } else {
                    this[key] = value;
                }
            }
        });
    }
}
