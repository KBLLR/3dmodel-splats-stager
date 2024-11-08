import {
  StandardMaterial,
  PhysicalMaterial,
  BasicMaterial,
  LambertMaterial,
  PhongMaterial,
  ShaderMaterial,
} from "@materials";

export class MaterialHandler {
  constructor() {
    this.registry = new Map();
    this.debugObjects = new Map();
    this.initializeDefaults();
  }

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

  register(name, material) {
    this.registry.set(name, material);
    this.debugObjects.set(name, material.debugObject || {});
  }

  get(name) {
    return this.registry.get(name);
  }

  createShaderMaterial(name, params) {
    const material = new ShaderMaterial(params);
    this.register(name, material);
    return material;
  }

  updateFromDebug(name) {
    const material = this.get(name);
    const debugData = this.debugObjects.get(name);

    if (material?.updateFromDebug) {
      material.updateFromDebug(debugData);
    }
  }

  dispose() {
    this.registry.forEach((material) => material.dispose());
    this.registry.clear();
    this.debugObjects.clear();
  }
}
