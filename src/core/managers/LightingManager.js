import { LightHandler } from './handlers/LightHandler';

// LightingManager manages creation and lifecycle of lights within a scene.
export class LightingManager {
  constructor(scene = null) {
    this.scene = scene;
    this.handler = new LightHandler();
    this.lights = new Map();
  }

  setScene(scene) {
    this.scene = scene;
  }

  /**
   * Add a light of a registered type to the current scene.
   * @param {string} name - Unique identifier for the light instance.
   * @param {string} type - Registered light type handled by LightHandler.
   * @param {object} params - Optional debug parameters to override defaults.
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

  update() {
    this.lights.forEach((light) => {
      light.updateFromDebug?.();
    });
  }

  dispose() {
    this.lights.forEach((light) => {
      if (light.dispose) light.dispose();
    });
    this.lights.clear();
    this.handler.dispose();
  }
}
