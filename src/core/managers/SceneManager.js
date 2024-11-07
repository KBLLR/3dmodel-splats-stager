import * as THREE from 'three';

export class SceneManager {
    constructor(renderer) {
        this.renderer = renderer;
        
        // Core components
        this.scenes = new Map();
        this.activeScene = null;
        
        // Managers
        this.environmentManager = null;
        this.cameraManager = null;
        this.componentManager = null;
        
        // Scene states
        this.states = new Map();
        
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

    initializeRenderer() {
        // Configure renderer based on debug settings
        this.renderer.shadowMap.enabled = this.debugObject.shadows.enabled;
        this.renderer.shadowMap.type = this.debugObject.shadows.type;
        this.renderer.shadowMap.autoUpdate = this.debugObject.shadows.autoUpdate;
        
        this.renderer.toneMapping = this.debugObject.toneMapping.type;
        this.renderer.toneMappingExposure = this.debugObject.toneMapping.exposure;
    }

    setManagers(environmentManager, cameraManager, componentManager) {
        this.environmentManager = environmentManager;
        this.cameraManager = cameraManager;
        this.componentManager = componentManager;
    }

    createScene(name, options = {}) {
        const scene = new THREE.Scene();
        
        // Setup scene properties
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

        // Store scene and its state
        this.scenes.set(name, scene);
        this.states.set(name, {
            components: new Set(),
            environment: options.environment || null,
            camera: options.camera || 'perspective',
            controls: options.controls || 'orbit'
        });

        return scene;
    }

    setActiveScene(name) {
        const scene = this.scenes.get(name);
        const state = this.states.get(name);
        
        if (!scene || !state) return;

        this.activeScene = scene;
        this.debugObject.activeScene = name;

        // Apply scene state
        if (this.cameraManager) {
            this.cameraManager.setActiveCamera(state.camera, state.controls);
        }

        if (this.environmentManager && state.environment) {
            this.environmentManager.setEnvironmentMapPath(state.environment);
        }
    }

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

    update(deltaTime) {
        if (!this.activeScene) return;

        // Update managers
        if (this.cameraManager) {
            this.cameraManager.update(deltaTime);
        }

        // Render
        if (this.cameraManager?.activeCamera) {
            this.renderer.render(this.activeScene, this.cameraManager.activeCamera);
        }
    }

    updateFromDebug() {
        // Update renderer settings
        this.renderer.shadowMap.enabled = this.debugObject.shadows.enabled;
        this.renderer.shadowMap.type = this.debugObject.shadows.type;
        this.renderer.toneMapping = this.debugObject.toneMapping.type;
        this.renderer.toneMappingExposure = this.debugObject.toneMapping.exposure;

        // Update active scene
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
            // Dispose scene
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
