/**
 * @file Handles the registration and management of material components.
 * @module MaterialHandler
 */

import {
  StandardMaterial,
  PhysicalMaterial,
  BasicMaterial,
  LambertMaterial,
  PhongMaterial,
  ShaderMaterial,
} from "@materials";

/**
 * @class MaterialHandler
 * @description Manages a registry of default and custom material types for easy instantiation and manipulation.
 */
export class MaterialHandler {
  /**
   * @constructor
   * @description Initializes the material registry and populates it with default material types.
   */
  constructor() {
    this.registry = new Map();
    this.debugObjects = new Map();
    this.initializeDefaults();
  }

  /**
   * @method initializeDefaults
   * @description Registers a set of default material types (standard, physical, basic, etc.).
   */
  initializeDefaults() {
    const defaults = {
      standard: new StandardMaterial(),
      physical: new PhysicalMaterial(),
      basic: new BasicMaterial(),
      lambert: new LambertMaterial(),
      phong: new PhongMaterial(),
    };

    Object.entries(defaults).forEach(([name, material]) => {
      this.register(name, material);
    });
  }

  /**
   * @method register
   * @description Adds a new material type to the registry.
   * @param {string} name - The name to identify the material type.
   * @param {THREE.Material} material - The material instance to register.
   */
  register(name, material) {
    this.registry.set(name, material);
    this.debugObjects.set(name, material.debugObject || {});
  }

  /**
   * @method get
   * @description Retrieves a material instance from the registry by its name.
   * @param {string} name - The name of the material type to retrieve.
   * @returns {THREE.Material|undefined} The material instance, or undefined if not found.
   */
  get(name) {
    return this.registry.get(name);
  }

  /**
   * @method createShaderMaterial
   * @description Creates a new ShaderMaterial and registers it.
   * @param {string} name - The name to identify the new shader material.
   * @param {object} params - The parameters for the ShaderMaterial constructor.
   * @returns {ShaderMaterial} The created ShaderMaterial instance.
   */
  createShaderMaterial(name, params) {
    const material = new ShaderMaterial(params);
    this.register(name, material);
    return material;
  }

  /**
   * @method updateFromDebug
   * @description Updates a material's properties from its associated debug object.
   * @param {string} name - The name of the material to update.
   */
  updateFromDebug(name) {
    const material = this.get(name);
    const debugData = this.debugObjects.get(name);

    if (material?.updateFromDebug) {
      material.updateFromDebug(debugData);
    }
  }

  /**
   * @method dispose
   * @description Disposes all registered materials and clears the registry.
   */
  dispose() {
    this.registry.forEach((material) => material.dispose());
    this.registry.clear();
    this.debugObjects.clear();
  }
}
