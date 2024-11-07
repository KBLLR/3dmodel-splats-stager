import * as THREE from 'three';

export class GradientEnvironment {
    constructor(params = {}) {
        const {
            topColor = '#000000',
            bottomColor = '#ffffff',
            offset = 0.5,
            exponent = 1.0
        } = params;

        this.type = 'gradient';
        this.isCustomEnvironment = true;
        this.texture = null;

        this.debugObject = {
            topColor,
            bottomColor,
            offset,
            exponent
        };

        this.createGradientTexture();
    }

    createGradientTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 2;
        canvas.height = 256;

        const context = canvas.getContext('2d');
        const gradient = context.createLinearGradient(0, 0, 0, 256);
        
        gradient.addColorStop(0, this.debugObject.topColor);
        gradient.addColorStop(this.debugObject.offset, this.debugObject.bottomColor);

        context.fillStyle = gradient;
        context.fillRect(0, 0, 2, 256);

        if (this.texture) {
            this.texture.dispose();
        }

        this.texture = new THREE.CanvasTexture(
            canvas,
            THREE.UVMapping,
            THREE.ClampToEdgeWrapping,
            THREE.ClampToEdgeWrapping,
            THREE.LinearFilter,
            THREE.LinearFilter
        );
    }

    updateFromDebug() {
        this.createGradientTexture();
    }

    dispose() {
        if (this.texture) {
            this.texture.dispose();
        }
    }
}
