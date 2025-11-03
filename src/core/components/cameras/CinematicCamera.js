/**
 * @file Extends the Three.js CinematicCamera with additional features and a simplified constructor.
 * @module CinematicCamera
 */

import { CinematicCamera as ThreeCinematicCamera } from 'three/examples/jsm/cameras/CinematicCamera';

/**
 * @class CinematicCamera
 * @description A custom cinematic camera that extends Three.js's CinematicCamera to provide
 * simplified setup for position, target, and depth of field.
 * @extends {ThreeCinematicCamera}
 */
export class CinematicCamera extends ThreeCinematicCamera {
    /**
     * @constructor
     * @param {object} [params={}] - The parameters for the camera.
     * @param {number} [params.fov=75] - The camera's field of view.
     * @param {number} [params.aspect=window.innerWidth / window.innerHeight] - The camera's aspect ratio.
     * @param {number} [params.near=0.1] - The near clipping plane.
     * @param {number} [params.far=1000] - The far clipping plane.
     * @param {object} [params.position={x: 0, y: 2, z: 10}] - The camera's position.
     * @param {object} [params.target={x: 0, y: 0, z: 0}] - The point the camera is looking at.
     * @param {object} [params.dof] - The depth of field parameters.
     * @param {string|number} [params.dof.focus='center'] - The focus distance. 'center' sets focus to the camera's distance from origin.
     * @param {number} [params.dof.aperture=0.1] - The camera's aperture size.
     * @param {boolean} [params.dof.required=true] - Indicates if DOF is required.
     */
    constructor(params = {}) {
        const {
            fov = 75,
            aspect = window.innerWidth / window.innerHeight,
            near = 0.1,
            far = 1000,
            position = { x: 0, y: 2, z: 10 },
            target = { x: 0, y: 0, z: 0 },
            dof = {
                focus: 'center',
                aperture: 0.1,
                required: true
            }
        } = params;

        super(fov, aspect, near, far);

        this.type = 'cinematic';
        this.isCustomCamera = true;

        // Set position
        this.position.set(position.x, position.y, position.z);
        
        // Set target
        this.lookAt(target.x, target.y, target.z);

        // Set DOF parameters
        this.setLens(35, 1.6);
        this.postprocessing.bokeh.focus = 
            dof.focus === 'center' ? 
            this.position.length() : 
            dof.focus;
        this.postprocessing.bokeh.aperture = dof.aperture;

        /**
         * @property {object} debugObject - An object holding the camera's parameters for debugging purposes.
         */
        this.debugObject = {
            position,
            target,
            dof,
            fov,
            near,
            far
        };
    }

    /**
     * @method updateFromDebug
     * @description Updates the camera's properties from the `debugObject`. This is useful for
     * dynamically updating the camera from a GUI or other debug tools.
     */
    updateFromDebug() {
        // Update position
        this.position.set(
            this.debugObject.position.x,
            this.debugObject.position.y,
            this.debugObject.position.z
        );

        // Update target
        this.lookAt(
            this.debugObject.target.x,
            this.debugObject.target.y,
            this.debugObject.target.z
        );

        // Update DOF
        if (this.debugObject.dof) {
            this.postprocessing.bokeh.focus = 
                this.debugObject.dof.focus === 'center' ? 
                this.position.length() : 
                this.debugObject.dof.focus;
            this.postprocessing.bokeh.aperture = this.debugObject.dof.aperture;
        }

        this.updateProjectionMatrix();
    }
}
