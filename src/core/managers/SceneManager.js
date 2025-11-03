/**
 * @file Manages multiple Three.js scenes, their states, and associated managers.
 * @module SceneManager
 */

import * as THREE from 'three';

/**
 * @class SceneManager
 * @description Handles the creation, activation, updating, and disposal of multiple scenes.
 * It coordinates with other managers like CameraManager and EnvironmentManager.
 */
export class SceneManager {
    /**
     * @constructor
     * @param {THREE.WebGLRenderer} renderer - The Three.js renderer instance.
     */
    constructor(renderer) {
        this.renderer = renderer;
        
        this.scenes = new Map();
        this.activeScene = null;
        
        this.environmentManager = null;
        this.cameraManager = null;
        this.componentManager = null;
        
        this.states = new Map();
        
        /**
         * @property {object} debugObject - An object holding scene-related parameters for debugging.
         */
        this.debugObject = {
            activeScene: null,
            fog: {
                enabled: false,
                color: '#000000',
                near: 1,
                far: 1000
            },
            background: {
                enabled: true,
                color: '#000000',
                alpha: 1
            },
            shadows: {
                enabled: true,
                type: THREE.PCFSoftShadowMap,
                autoUpdate: true
            },
            toneMapping: {
                enabled: true,
                type: THREE.ACESFilmicToneMapping,
                exposure: 1
            }
        };

        this.initializeRenderer();
    }

    /**
     * @method initializeRenderer
     * @description Configures the renderer with initial shadow and tone mapping settings from the debug object.
     */
    initializeRenderer() {
        this.renderer.shadowMap.enabled = this.debugObject.shadows.enabled;
        this.renderer.shadowMap.type = this.debugObject.shadows.type;
        this.renderer.shadowMap.autoUpdate = this.debugObject.shadows.autoUpdate;
        
        this.renderer.toneMapping = this.debugObject.toneMapping.type;
        this.renderer.toneMappingExposure = this.debugObject.toneMapping.exposure;
    }

    /**
     * @method setManagers
     * @description Injects dependencies for other managers.
     * @param {EnvironmentManager} environmentManager - The environment manager instance.
     * @param {CameraManager} cameraManager - The camera manager instance.
     * @param {ComponentManager} componentManager - The component manager instance.
     */
    setManagers(environmentManager, cameraManager, componentManager) {
        this.environmentManager = environmentManager;
        this.cameraManager = cameraManager;
        this.componentManager = componentManager;
    }

    /**
     * @method createScene
     * @description Creates a new scene with optional configuration.
     * @param {string} name - The name to identify the scene.
     * @param {object} [options={}] - Optional configuration for the scene.
     * @param {string} [options.environment] - Path to an environment map.
     * @param {string} [options.camera] - The name of the camera to use.
     * @param {string} [options.controls] - The name of the controls to use.
     * @returns {THREE.Scene} The created scene.
     */
    createScene(name, options = {}) {
        const scene = new THREE.Scene();
        
        if (this.debugObject.fog.enabled) {
            scene.fog = new THREE.Fog(
                this.debugObject.fog.color,
                this.debugObject.fog.near,
                this.debugObject.fog.far
            );
        }

        if (this.debugObject.background.enabled) {
            scene.background = new THREE.Color(this.debugObject.background.color);
        }

        this.scenes.set(name, scene);
        this.states.set(name, {
            components: new Set(),
            environment: options.environment || null,
            camera: options.camera || 'perspective',
            controls: options.controls || 'orbit'
        });

        return scene;
    }

    /**
     * @method setActiveScene
     * @description Sets the currently active scene for rendering and updates.
     * @param {string} name - The name of the scene to activate.
     */
    setActiveScene(name) {
        const scene = this.scenes.get(name);
        const state = this.states.get(name);
        
        if (!scene || !state) return;

        this.activeScene = scene;
        this.debugObject.activeScene = name;

        if (this.cameraManager) {
            this.cameraManager.setActive(state.camera); // Assuming setActive handles both camera and controls
        }

        if (this.environmentManager && state.environment) {
            this.environmentManager.setEnvironmentMapPath(state.environment);
        }
    }

    /**
     * @method addToScene
     * @description Adds an object to a specified scene.
     * @param {string} sceneName - The name of the scene.
     * @param {THREE.Object3D} object - The object to add.
     * @param {object} [options={}] - Optional data to associate with the object.
     */
    addToScene(sceneName, object, options = {}) {
        const scene = this.scenes.get(sceneName);
        const state = this.states.get(sceneName);
        
        if (!scene || !state) return;

        scene.add(object);
        state.components.add({
            object,
            options
        });
    }

    /**
     * @method removeFromScene
     * @description Removes an object from a specified scene.
     * @param {string} sceneName - The name of the scene.
     * @param {THREE.Object3D} object - The object to remove.
     */
    removeFromScene(sceneName, object) {
        const scene = this.scenes.get(sceneName);
        const state = this.states.get(sceneName);
        
        if (!scene || !state) return;

        scene.remove(object);
        state.components.forEach(component => {
            if (component.object === object) {
                state.components.delete(component);
            }
        });
    }

    /**
     * @method update
     * @description Updates the active scene and renders it.
     * @param {number} deltaTime - The time elapsed since the last frame.
     */
    update(deltaTime) {
        if (!this.activeScene) return;

        if (this.cameraManager) {
            this.cameraManager.update(deltaTime);
        }

        if (this.cameraManager?.activeCamera) {
            this.renderer.render(this.activeScene, this.cameraManager.activeCamera);
        }
    }

    /**
     * @method updateFromDebug
     * @description Updates renderer and scene properties from the `debugObject`.
     */
    updateFromDebug() {
        this.renderer.shadowMap.enabled = this.debugObject.shadows.enabled;
        this.renderer.shadowMap.type = this.debugObject.shadows.type;
        this.renderer.toneMapping = this.debugObject.toneMapping.type;
        this.renderer.toneMappingExposure = this.debugObject.toneMapping.exposure;

        if (this.activeScene) {
            if (this.debugObject.fog.enabled) {
                this.activeScene.fog = new THREE.Fog(
                    this.debugObject.fog.color,
                    this.debugObject.fog.near,
                    this.debugObject.fog.far
                );
            } else {
                this.activeScene.fog = null;
            }

            if (this.debugObject.background.enabled) {
                this.activeScene.background = new THREE.Color(this.debugObject.background.color);
            } else {
                this.activeScene.background = null;
            }
        }
    }

    /**
     * @method dispose
     * @description Disposes all scenes and their contents to free up resources.
     */
    dispose() {
        this.scenes.forEach((scene, name) => {
            const state = this.states.get(name);
            if (state) {
                state.components.forEach(component => {
                    if (component.object.dispose) {
                        component.object.dispose();
                    }
                });
            }
            scene.traverse(object => {
                if (object.geometry) {
                    object.geometry.dispose();
                }
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(material => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
        });

        this.scenes.clear();
        this.states.clear();
    }
}
