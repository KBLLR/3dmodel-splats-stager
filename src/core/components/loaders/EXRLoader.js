import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader";
import * as THREE from "three";

export class CustomEXRLoader {
  constructor() {
    this.type = "exr";
    this.isCustomLoader = true;
    this.loader = new EXRLoader();
    this.cache = new Map();

    this.debugObject = {
      dataType: THREE.HalfFloatType,
    };
  }

  async load(path, onProgress = null) {
    if (this.cache.has(path)) {
      return this.cache.get(path).clone();
    }

    try {
      this.loader.setDataType(this.debugObject.dataType);

      const texture = await new Promise((resolve, reject) => {
        this.loader.load(path, resolve, onProgress, reject);
      });

      texture.mapping = THREE.EquirectangularReflectionMapping;
      this.cache.set(path, texture);

      return texture;
    } catch (error) {
      console.error("Error loading EXR:", error);
      throw error;
    }
  }

  dispose() {
    this.cache.forEach((texture) => texture.dispose());
    this.cache.clear();
  }
}
