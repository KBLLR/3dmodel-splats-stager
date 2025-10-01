/**
 * @file Orchestrates various managers to create and control a complete 3D stage.
 * @module StageManager
 */

import { SceneManager } from './SceneManager';
import { CameraManager } from './CameraManager';
import { ComponentManager } from './ComponentManager';
import { EnvironmentManager } from './EnvironmentManager';
import { LightingManager } from './LightingManager';

/**
 * @class StageManager
 * @description Ties together lower-level managers (Scene, Camera, Component, etc.) to provide
 * a simple interface for creating and controlling a complete 3D stage.
 */
export class StageManager {
  /**
   * @constructor
   * @param {THREE.WebGLRenderer} renderer - The Three.js renderer instance.
   * @param {HTMLElement} container - The container element for the renderer.
   */
  constructor(renderer, container) {
    this.renderer = renderer;
    this.container = container;

    this.sceneManager = new SceneManager(renderer);
    this.cameraManager = new CameraManager(renderer, container);
    this.componentManager = new ComponentManager();

    this.environmentManager = null;
    this.lightingManager = null;
  }

  /**
   * @method createStage
   * @description Creates a new stage (scene) and sets up its environment and lighting managers.
   * @param {string} name - The name to identify the stage.
   * @param {object} [options={}] - Optional configuration for the stage's scene.
   * @returns {THREE.Scene} The newly created scene.
   */
  createStage(name, options = {}) {
    const scene = this.sceneManager.createScene(name, options);

    this.environmentManager = new EnvironmentManager(this.renderer, scene);
    this.lightingManager = new LightingManager(scene);

    this.sceneManager.setManagers(
      this.environmentManager,
      this.cameraManager,
      this.componentManager,
    );

    return scene;
  }

  /**
   * @method setActiveStage
   * @description Sets the active stage for rendering.
   * @param {string} name - The name of the stage to activate.
   */
  setActiveStage(name) {
    this.sceneManager.setActiveScene(name);
    if (this.lightingManager) {
      this.lightingManager.setScene(this.sceneManager.activeScene);
    }
  }

  /**
   * @method addToStage
   * @description Adds an object to the currently active stage.
   * @param {THREE.Object3D} object - The object to add.
   */
  addToStage(object) {
    if (this.sceneManager.activeScene) {
      this.sceneManager.activeScene.add(object);
    }
  }

  /**
   * @method update
   * @description Updates all managers. Should be called in the animation loop.
   * @param {number} deltaTime - The time elapsed since the last frame.
   */
  update(deltaTime) {
    this.sceneManager.update(deltaTime);
    this.lightingManager?.update();
  }

  /**
   * @method resize
   * @description Handles resize events for the renderer and cameras.
   * @param {number} width - The new width.
   * @param {number} height - The new height.
   */
  resize(width, height) {
    this.cameraManager.updateAspect(width, height);
    this.renderer.setSize(width, height);
  }

  /**
   * @method dispose
   * @description Disposes of all resources managed by the stage and its sub-managers.
   */
  dispose() {
    this.lightingManager?.dispose();
    this.environmentManager?.dispose();
    this.componentManager.dispose();
    this.sceneManager.dispose();
  }
}
