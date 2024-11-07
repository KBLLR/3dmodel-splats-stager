import * as THREE from 'three';

export class LambertMaterial extends THREE.MeshLambertMaterial {
    constructor(params = {}) {
        const {
            color = 0xffffff,
            emissive = 0x000000,
            emissiveIntensity = 1,
            map = null,
            alphaMap = null,
            aoMap = null,
            aoMapIntensity = 1,
            envMap = null,
            wireframe = false,
            wireframeLinewidth = 1,
            transparent = false,
            opacity = 1,
            side = THREE.FrontSide
        } = params;

        super({
            color,
            emissive,
            emissiveIntensity,
            map,
            alphaMap,
            aoMap,
            aoMapIntensity,
            envMap,
            wireframe,
            wireframeLinewidth,
            transparent,
            opacity,
            side
        });

        this.type = 'lambert';
        this.isCustomMaterial = true;

        this.debugObject = {
            color,
            emissive,
            emissiveIntensity,
            aoMapIntensity,
            wireframe,
            wireframeLinewidth,
            transparent,
            opacity,
            side
        };
    }

    updateFromDebug() {
        Object.entries(this.debugObject).forEach(([key, value]) => {
            if (this[key] !== undefined) {
                if (['color', 'emissive'].includes(key)) {
                    this[key].set(value);
                } else {
                    this[key] = value;
                }
            }
        });
    }
}
