/**
 * @file Provides a generator for creating and managing Three.js stages.
 * @module StageGenerator
 */

import { StageManager } from '../managers/StageManager';

/**
 * @class StageGenerator
 * @description A simple generator that delegates stage creation and management
 * to StageManager. This keeps configuration handling flexible
 * while exposing a minimal interface for external modules.
 */
export class StageGenerator {
  /**
   * @constructor
   * @param {THREE.WebGLRenderer} renderer - The Three.js renderer instance.
   * @param {HTMLElement} container - The container element for the renderer.
   */
  constructor(renderer, container) {
    /**
     * @property {StageManager} manager - An instance of the StageManager.
     */
    this.manager = new StageManager(renderer, container);
  }

  /**
   * @method create
   * @description Creates a new stage using the provided configuration.
   * This is a convenience wrapper over StageManager.createStage.
   * @param {string} name - The identifier for the stage.
   * @param {object} [config={}] - The stage configuration object.
   * @returns {THREE.Scene} The newly created stage's scene.
   */
  create(name, config = {}) {
    return this.manager.createStage(name, config);
  }

  /**
   * @method setActive
   * @description Sets the active stage for rendering. This is a proxy to StageManager.setActiveStage.
   * @param {string} name - The identifier of the stage to set as active.
   */
  setActive(name) {
    this.manager.setActiveStage(name);
  }

  /**
   * @method update
   * @description Updates the active stage each frame.
   * @param {number} deltaTime - The time elapsed since the last frame.
   */
  update(deltaTime) {
    this.manager.update(deltaTime);
  }

  /**
   * @method resize
   * @description Resizes the underlying renderer and cameras.
   * @param {number} width - The new width.
   * @param {number} height - The new height.
   */
  resize(width, height) {
    this.manager.resize(width, height);
  }

  /**
   * @method dispose
   * @description Disposes of all resources created by the generator.
   */
  dispose() {
    this.manager.dispose();
  }
}

export default StageGenerator;
