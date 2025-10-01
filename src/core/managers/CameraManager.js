/**
 * @file Manages cameras and their controls within a Three.js scene.
 * @module CameraManager
 */

import { CinematicCamera } from '../components/cameras/CinematicCamera';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * @class CameraManager
 * @description Handles the creation, storage, activation, and updating of cameras and their associated controls.
 */
export class CameraManager {
    /**
     * @constructor
     * @param {THREE.WebGLRenderer} renderer - The Three.js renderer instance.
     * @param {HTMLElement} container - The DOM element that contains the renderer, used for controls.
     */
    constructor(renderer, container) {
        this.renderer = renderer;
        this.container = container;
        
        this.cameras = new Map();
        this.controls = new Map();
        this.activeCamera = null;
        this.activeControls = null;

        this.setupDefaultCameras();
    }

    /**
     * @method setupDefaultCameras
     * @description Sets up a default cinematic camera and its corresponding orbit controls.
     */
    setupDefaultCameras() {
        // Set up cinematic camera
        const cinematicCamera = new CinematicCamera({
            position: { x: 0, y: 2, z: 10 },
            target: { x: 0, y: 0, z: 0 },
            dof: {
                focus: 'center',
                aperture: 0.1,
                required: true
            }
        });

        this.addCamera('cinematic', cinematicCamera);
        
        // Set up controls
        if (this.renderer) {
            const controls = new OrbitControls(cinematicCamera, this.renderer.domElement);
            this.addControls('cinematic', controls);
        }
    }

    /**
     * @method addCamera
     * @description Adds a camera to the manager.
     * @param {string} name - The name to identify the camera.
     * @param {THREE.Camera} camera - The camera object to add.
     */
    addCamera(name, camera) {
        this.cameras.set(name, camera);
        if (!this.activeCamera) {
            this.activeCamera = camera;
        }
    }

    /**
     * @method addControls
     * @description Adds a controls instance to the manager.
     * @param {string} name - The name to identify the controls, usually matching the camera name.
     * @param {OrbitControls} controls - The controls object to add.
     */
    addControls(name, controls) {
        this.controls.set(name, controls);
        if (!this.activeControls) {
            this.activeControls = controls;
        }
    }

    /**
     * @method getCamera
     * @description Retrieves a camera by its name.
     * @param {string} name - The name of the camera to retrieve.
     * @returns {THREE.Camera|undefined} The camera object, or undefined if not found.
     */
    getCamera(name) {
        return this.cameras.get(name);
    }

    /**
     * @method getControls
     * @description Retrieves a controls instance by its name.
     * @param {string} name - The name of the controls to retrieve.
     * @returns {OrbitControls|undefined} The controls object, or undefined if not found.
     */
    getControls(name) {
        return this.controls.get(name);
    }

    /**
     * @method setActive
     * @description Sets the active camera and controls.
     * @param {string} name - The name of the camera and controls to activate.
     */
    setActive(name) {
        const camera = this.cameras.get(name);
        const controls = this.controls.get(name);

        if (camera) {
            this.activeCamera = camera;
        }

        if (controls) {
            this.activeControls = controls;
        }
    }

    /**
     * @method updateAspect
     * @description Updates the aspect ratio of all managed cameras.
     * @param {number} width - The new width of the viewport.
     * @param {number} height - The new height of the viewport.
     */
    updateAspect(width, height) {
        this.cameras.forEach(camera => {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        });
    }

    /**
     * @method update
     * @description Updates the active controls. This should be called in the animation loop.
     */
    update() {
        if (this.activeControls && this.activeControls.update) {
            this.activeControls.update();
        }
    }
}
