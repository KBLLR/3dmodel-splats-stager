import * as THREE from 'three';

export class ShaderMaterial extends THREE.ShaderMaterial {
    constructor(params = {}) {
        const {
            vertexShader = DEFAULT_VERTEX_SHADER,
            fragmentShader = DEFAULT_FRAGMENT_SHADER,
            uniforms = {},
            transparent = false,
            wireframe = false,
            side = THREE.FrontSide
        } = params;

        super({
            vertexShader,
            fragmentShader,
            uniforms: THREE.UniformsUtils.merge([
                THREE.UniformsLib.common,
                THREE.UniformsLib.lights,
                uniforms
            ]),
            transparent,
            wireframe,
            side,
            lights: true
        });

        this.type = 'custom-shader';
        this.isCustomMaterial = true;

        this.debugObject = {
            transparent,
            wireframe,
            side
        };

        // Store original shader code for editing
        this.debugObject.vertexShader = vertexShader;
        this.debugObject.fragmentShader = fragmentShader;
    }

    updateFromDebug() {
        Object.entries(this.debugObject).forEach(([key, value]) => {
            if (this[key] !== undefined && !['vertexShader', 'fragmentShader'].includes(key)) {
                this[key] = value;
            }
        });

        // Handle shader code updates
        if (this.debugObject.vertexShader !== this.vertexShader || 
            this.debugObject.fragmentShader !== this.fragmentShader) {
            this.vertexShader = this.debugObject.vertexShader;
            this.fragmentShader = this.debugObject.fragmentShader;
            this.needsUpdate = true;
        }
    }

    updateUniforms(newUniforms) {
        Object.entries(newUniforms).forEach(([key, value]) => {
            if (this.uniforms[key]) {
                this.uniforms[key].value = value;
            }
        });
    }
}

const DEFAULT_VERTEX_SHADER = \`
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
\`;

const DEFAULT_FRAGMENT_SHADER = \`
varying vec2 vUv;

void main() {
    gl_FragColor = vec4(vUv.x, vUv.y, 1.0, 1.0);
}
\`;
