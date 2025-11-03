/**
 * @file Extends the Three.js ShaderMaterial with a debug-friendly interface and helpers.
 * @module ShaderMaterial
 */

import * as THREE from 'three';

/**
 * @class ShaderMaterial
 * @description A custom material that extends Three.js's ShaderMaterial to provide
 * a simplified constructor, a debug object, and helpers for updating uniforms and shaders.
 * @extends {THREE.ShaderMaterial}
 */
export class ShaderMaterial extends THREE.ShaderMaterial {
    /**
     * @constructor
     * @param {object} [params={}] - The parameters for the material.
     * @param {string} [params.vertexShader=DEFAULT_VERTEX_SHADER] - The vertex shader code.
     * @param {string} [params.fragmentShader=DEFAULT_FRAGMENT_SHADER] - The fragment shader code.
     * @param {object} [params.uniforms={}] - The uniforms for the shaders.
     * @param {boolean} [params.transparent=false] - Whether the material is transparent.
     * @param {boolean} [params.wireframe=false] - Whether to render as a wireframe.
     * @param {THREE.Side} [params.side=THREE.FrontSide] - Which side of faces to render.
     */
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

        /**
         * @property {object} debugObject - An object holding the material's parameters for debugging.
         */
        this.debugObject = {
            transparent,
            wireframe,
            side
        };

        // Store original shader code for editing
        this.debugObject.vertexShader = vertexShader;
        this.debugObject.fragmentShader = fragmentShader;
    }

    /**
     * @method updateFromDebug
     * @description Updates the material's properties from the `debugObject`.
     * This includes recompiling the shader if the code has changed.
     */
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

    /**
     * @method updateUniforms
     * @description Updates the values of existing uniforms.
     * @param {object} newUniforms - An object where keys are uniform names and values are the new values.
     */
    updateUniforms(newUniforms) {
        Object.entries(newUniforms).forEach(([key, value]) => {
            if (this.uniforms[key]) {
                this.uniforms[key].value = value;
            }
        });
    }
}

/**
 * @description The default vertex shader code, which passes UVs to the fragment shader.
 * @type {string}
 */
const DEFAULT_VERTEX_SHADER = `
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/**
 * @description The default fragment shader code, which visualizes UV coordinates.
 * @type {string}
 */
const DEFAULT_FRAGMENT_SHADER = `
varying vec2 vUv;

void main() {
    gl_FragColor = vec4(vUv.x, vUv.y, 1.0, 1.0);
}
`;
