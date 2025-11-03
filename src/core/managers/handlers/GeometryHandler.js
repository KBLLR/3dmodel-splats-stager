/**
 * @file Handles the registration and management of geometry components.
 * @module GeometryHandler
 */

import { Box, Sphere, Plane, Circle, Cylinder } from "@geometries";

/**
 * @class GeometryHandler
 * @description Manages a registry of default and custom geometry types for easy instantiation and manipulation.
 */
export class GeometryHandler {
  /**
   * @constructor
   * @description Initializes the geometry registry and populates it with default shapes.
   */
  constructor() {
    this.registry = new Map();
    this.debugObjects = new Map();
    this.initializeDefaults();
  }

  /**
   * @method initializeDefaults
   * @description Registers a set of default geometries (box, sphere, plane, etc.).
   */
  initializeDefaults() {
    const defaults = {
      box: new Box(),
      sphere: new Sphere(),
      plane: new Plane(),
      circle: new Circle(),
      cylinder: new Cylinder(),
    };

    Object.entries(defaults).forEach(([name, geometry]) => {
      this.register(name, geometry);
    });
  }

  /**
   * @method register
   * @description Adds a new geometry type to the registry.
   * @param {string} name - The name to identify the geometry type.
   * @param {THREE.BufferGeometry} geometry - The geometry instance to register.
   */
  register(name, geometry) {
    this.registry.set(name, geometry);
    this.debugObjects.set(name, geometry.debugObject || {});
  }

  /**
   * @method get
   * @description Retrieves a geometry instance from the registry by its name.
   * @param {string} name - The name of the geometry type to retrieve.
   * @returns {THREE.BufferGeometry|undefined} The geometry instance, or undefined if not found.
   */
  get(name) {
    return this.registry.get(name);
  }

  /**
   * @method updateFromDebug
   * @description Updates a geometry's properties from its associated debug object.
   * @param {string} name - The name of the geometry to update.
   */
  updateFromDebug(name) {
    const geometry = this.get(name);
    const debugData = this.debugObjects.get(name);

    if (geometry?.updateFromDebug) {
      geometry.updateFromDebug(debugData);
    }
  }

  /**
   * @method dispose
   * @description Disposes all registered geometries and clears the registry.
   */
  dispose() {
    this.registry.forEach((geometry) => geometry.dispose());
    this.registry.clear();
    this.debugObjects.clear();
  }
}
