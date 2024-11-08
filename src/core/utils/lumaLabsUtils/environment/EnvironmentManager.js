import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

export class EnvironmentManager {
    constructor() {
        this.environmentMap = null;
    }

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

    dispose() {
        if (this.environmentMap) {
            this.environmentMap.dispose();
        }
    }
}
