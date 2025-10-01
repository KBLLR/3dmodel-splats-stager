/**
 * @file Handles the registration and management of light components.
 * @module LightHandler
 */

import {
  AmbientLight,
  DirectionalLight,
  PointLight,
  SpotLight,
  RectAreaLight,
} from "@lights";

/**
 * @class LightHandler
 * @description Manages a registry of default and custom light types for easy instantiation and manipulation.
 */
export class LightHandler {
  /**
   * @constructor
   * @description Initializes the light registry and populates it with default light types.
   */
  constructor() {
    this.registry = new Map();
    this.debugObjects = new Map();
    this.initializeDefaults();
  }

  /**
   * @method initializeDefaults
   * @description Registers a set of default light types (ambient, directional, point, etc.).
   */
  initializeDefaults() {
    const defaults = {
      ambient: new AmbientLight(),
      directional: new DirectionalLight(),
      point: new PointLight(),
      spot: new SpotLight(),
      rectArea: new RectAreaLight(),
    };

    Object.entries(defaults).forEach(([name, light]) => {
      this.register(name, light);
    });
  }

  /**
   * @method register
   * @description Adds a new light type to the registry.
   * @param {string} name - The name to identify the light type.
   * @param {THREE.Light} light - The light instance to register as a template.
   */
  register(name, light) {
    this.registry.set(name, light);
    this.debugObjects.set(name, light.debugObject || {});
  }

  /**
   * @method get
   * @description Retrieves a light template from the registry by its name.
   * @param {string} name - The name of the light type to retrieve.
   * @returns {THREE.Light|undefined} The light instance, or undefined if not found.
   */
  get(name) {
    return this.registry.get(name);
  }

  /**
   * @method updateFromDebug
   * @description Updates a light's properties from its associated debug object.
   * @param {string} name - The name of the light to update.
   */
  updateFromDebug(name) {
    const light = this.get(name);
    const debugData = this.debugObjects.get(name);

    if (light?.updateFromDebug) {
      light.updateFromDebug(debugData);
    }
  }

  /**
   * @method dispose
   * @description Disposes all registered lights and clears the registry.
   */
  dispose() {
    this.registry.forEach((light) => {
      if (light.dispose) light.dispose();
    });
    this.registry.clear();
    this.debugObjects.clear();
  }
}
