/**
 * @file Manages the creation and lifecycle of lights within a scene.
 * @module LightingManager
 */

import { LightHandler } from './handlers/LightHandler';

/**
 * @class LightingManager
 * @description Manages the creation, removal, and updating of lights within a Three.js scene.
 */
export class LightingManager {
  /**
   * @constructor
   * @param {THREE.Scene|null} [scene=null] - The scene to which the lights will be added.
   */
  constructor(scene = null) {
    this.scene = scene;
    this.handler = new LightHandler();
    this.lights = new Map();
  }

  /**
   * @method setScene
   * @description Sets or changes the scene the manager is controlling.
   * @param {THREE.Scene} scene - The new scene.
   */
  setScene(scene) {
    this.scene = scene;
  }

  /**
   * @method addLight
   * @description Adds a light of a registered type to the current scene.
   * @param {string} name - A unique identifier for the light instance.
   * @param {string} type - The registered light type, handled by `LightHandler`.
   * @param {object} [params={}] - Optional parameters to override the light's default settings.
   * @returns {THREE.Light} The created light object.
   */
  addLight(name, type, params = {}) {
    const template = this.handler.get(type);
    if (!template) throw new Error(`Unknown light type: ${type}`);

    const light = template.clone ? template.clone() : template;
    if (light.debugObject) {
      Object.assign(light.debugObject, params);
      if (light.updateFromDebug) {
        light.updateFromDebug();
      }
    }

    this.lights.set(name, light);
    if (this.scene) {
      this.scene.add(light);
    }
    return light;
  }

  /**
   * @method removeLight
   * @description Removes a light from the scene and disposes of it.
   * @param {string} name - The name of the light to remove.
   */
  removeLight(name) {
    const light = this.lights.get(name);
    if (!light) return;
    if (this.scene) {
      this.scene.remove(light);
    }
    if (light.dispose) {
      light.dispose();
    }
    this.lights.delete(name);
  }

  /**
   * @method update
   * @description Updates all managed lights, typically from their debug objects. Should be called in the animation loop.
   */
  update() {
    this.lights.forEach((light) => {
      light.updateFromDebug?.();
    });
  }

  /**
   * @method dispose
   * @description Disposes all managed lights and clears the handler.
   */
  dispose() {
    this.lights.forEach((light) => {
      if (light.dispose) light.dispose();
    });
    this.lights.clear();
    this.handler.dispose();
  }
}
