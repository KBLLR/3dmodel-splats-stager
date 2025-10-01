/**
 * @file Provides a generator for creating and managing Three.js scenes.
 * @module SceneGenerator
 */

import { SceneManager } from '../managers/SceneManager';

/**
 * @class SceneGenerator
 * @description A basic wrapper around SceneManager to generate scenes from
 * configuration objects. This allows scenes to be created and
 * managed with a simple API while keeping the heavy lifting in
 * the existing managers.
 */
export class SceneGenerator {
  /**
   * @constructor
   * @param {THREE.WebGLRenderer} renderer - The Three.js renderer instance.
   */
  constructor(renderer) {
    /**
     * @property {SceneManager} manager - An instance of the SceneManager.
     */
    this.manager = new SceneManager(renderer);
  }

  /**
   * @method create
   * @description Creates a new scene using the provided configuration.
   * @param {string} name - The identifier for the scene.
   * @param {object} [config={}] - The scene configuration object.
   * @returns {THREE.Scene} The newly created scene.
   */
  create(name, config = {}) {
    return this.manager.createScene(name, config);
  }

  /**
   * @method setActive
   * @description Sets the active scene for rendering.
   * @param {string} name - The identifier of the scene to set as active.
   */
  setActive(name) {
    this.manager.setActiveScene(name);
  }

  /**
   * @method update
   * @description Updates the active scene each frame.
   * @param {number} deltaTime - The time elapsed since the last frame.
   */
  update(deltaTime) {
    this.manager.update(deltaTime);
  }

  /**
   * @method dispose
   * @description Disposes all created scenes and their resources.
   */
  dispose() {
    this.manager.dispose();
  }
}

export default SceneGenerator;
