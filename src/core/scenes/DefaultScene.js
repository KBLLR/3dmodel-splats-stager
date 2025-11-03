/**
 * @file Defines a default scene with a black background and a camera.
 * @module DefaultScene
 */

import * as THREE from 'three';
import { Camera } from '../cameras/Camera.js';

/**
 * @class DefaultScene
 * @description A basic Three.js scene that includes a default camera and a black background.
 * @extends {THREE.Scene}
 */
export class DefaultScene extends THREE.Scene {
  /**
   * @constructor
   * @description Creates an instance of DefaultScene, initializes the camera, and sets the background.
   */
  constructor() {
    super();
    /**
     * @property {Camera} camera - The default camera for the scene.
     */
    this.camera = new Camera();
    this.initialize();
  }

  /**
   * @method initialize
   * @description Sets the initial properties of the scene, such as the background color.
   */
  initialize() {
    this.background = new THREE.Color('#000000');
  }
}
