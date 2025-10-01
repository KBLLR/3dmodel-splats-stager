/**
 * @file Manages 3D environments, including loading HDR images and setting up splat-based environments.
 * @module EnvironmentManager
 */

import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

/**
 * @class EnvironmentManager
 * @description Handles the creation, loading, and disposal of 3D environments.
 */
export class EnvironmentManager {
    /**
     * @constructor
     * @description Initializes the EnvironmentManager.
     */
    constructor() {
        /**
         * @property {THREE.Texture|null} environmentMap - The current environment map texture.
         */
        this.environmentMap = null;
    }

    /**
     * @method setupSplatEnvironment
     * @description Sets up the environment and background from a Luma splat object.
     * @param {object} splat - The Luma splat object.
     * @param {THREE.WebGLRenderer} renderer - The Three.js renderer.
     * @param {THREE.Scene} scene - The Three.js scene.
     * @returns {Promise<THREE.Texture>} A promise that resolves with the captured cubemap texture.
     */
    async setupSplatEnvironment(splat, renderer, scene) {
        if (!splat || !renderer || !scene) return;

        return new Promise((resolve) => {
            splat.onLoad = () => {
                splat.captureCubemap(renderer).then((capturedTexture) => {
                    scene.environment = capturedTexture;
                    scene.background = capturedTexture;
                    scene.backgroundBlurriness = 0.5;
                    this.environmentMap = capturedTexture;
                    resolve(capturedTexture);
                });
            };
        });
    }

    /**
     * @method loadHDREnvironment
     * @description Loads an HDR environment map from a file path.
     * @param {THREE.WebGLRenderer} renderer - The Three.js renderer.
     * @param {THREE.Scene} scene - The Three.js scene.
     * @param {string} path - The path to the HDR file.
     * @returns {Promise<THREE.Texture>} A promise that resolves with the loaded environment texture.
     */
    async loadHDREnvironment(renderer, scene, path) {
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        pmremGenerator.compileEquirectangularShader();

        return new Promise((resolve, reject) => {
            new RGBELoader()
                .load(path, 
                    (texture) => {
                        const environment = pmremGenerator.fromEquirectangular(texture).texture;
                        scene.environment = environment;
                        scene.background = environment;
                        scene.backgroundBlurriness = 0.5;

                        texture.dispose();
                        pmremGenerator.dispose();
                        
                        this.environmentMap = environment;
                        resolve(environment);
                    },
                    undefined,
                    reject
                );
        });
    }

    /**
     * @method createEnvironmentProbes
     * @description Creates a grid of spheres to act as environment probes for testing materials.
     * @param {number} [gridSize=3] - The number of probes in each dimension of the grid.
     * @returns {THREE.Object3D} An Object3D containing the grid of probe spheres.
     */
    createEnvironmentProbes(gridSize = 3) {
        const probes = new THREE.Object3D();
        const sphereGeometry = new THREE.SphereGeometry(0.05, 32, 32);

        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                for (let k = 0; k < gridSize; k++) {
                    const roughness = i / (gridSize - 1);
                    const metalness = j / (gridSize - 1);
                    const color = k / (gridSize - 1);
                    
                    const sphere = new THREE.Mesh(
                        sphereGeometry,
                        new THREE.MeshStandardMaterial({
                            color: new THREE.Color(color, color, color),
                            roughness,
                            metalness,
                        })
                    );

                    sphere.position
                        .set(i, j, k)
                        .subScalar((gridSize - 1) / 2)
                        .multiplyScalar(0.25);
                    
                    probes.add(sphere);
                }
            }
        }

        return probes;
    }

    /**
     * @method dispose
     * @description Disposes of the environment map to free up resources.
     */
    dispose() {
        if (this.environmentMap) {
            this.environmentMap.dispose();
        }
    }
}
