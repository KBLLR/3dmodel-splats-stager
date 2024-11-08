import {
  AmbientLight,
  DirectionalLight,
  PointLight,
  SpotLight,
  RectAreaLight,
} from "@lights";

export class LightHandler {
  constructor() {
    this.registry = new Map();
    this.debugObjects = new Map();
    this.initializeDefaults();
  }

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

  register(name, light) {
    this.registry.set(name, light);
    this.debugObjects.set(name, light.debugObject || {});
  }

  get(name) {
    return this.registry.get(name);
  }

  updateFromDebug(name) {
    const light = this.get(name);
    const debugData = this.debugObjects.get(name);

    if (light?.updateFromDebug) {
      light.updateFromDebug(debugData);
    }
  }

  dispose() {
    this.registry.forEach((light) => {
      if (light.dispose) light.dispose();
    });
    this.registry.clear();
    this.debugObjects.clear();
  }
}
