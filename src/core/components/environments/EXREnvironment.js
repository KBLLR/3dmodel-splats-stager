import * as THREE from "three";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader";

export class EXREnvironment {
  constructor(params = {}) {
    const { path = null, intensity = 1.0, blur = 0, rotation = 0 } = params;

    this.type = "exr";
    this.isCustomEnvironment = true;
    this.loader = new EXRLoader();
    this.envMap = null;

    this.debugObject = {
      intensity,
      blur,
      rotation,
      path,
    };
  }

  async load(renderer) {
    if (!this.debugObject.path) return;

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    try {
      const texture = await this.loader.loadAsync(this.debugObject.path);
      texture.mapping = THREE.EquirectangularReflectionMapping;

      this.envMap = pmremGenerator.fromEquirectangular(texture).texture;

      texture.dispose();
      pmremGenerator.dispose();

      return this.envMap;
    } catch (error) {
      console.error("Error loading EXR:", error);
      throw error;
    }
  }

  updateFromDebug() {
    if (this.envMap) {
      this.envMap.intensity = this.debugObject.intensity;
      this.envMap.blur = this.debugObject.blur;
      this.envMap.rotation = this.debugObject.rotation;
    }
  }

  dispose() {
    if (this.envMap) {
      this.envMap.dispose();
    }
  }
}
