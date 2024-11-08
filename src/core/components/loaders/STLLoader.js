import { STLLoader } from "three/examples/jsm/loaders/STLLoader";

export class CustomSTLLoader {
  constructor() {
    this.type = "stl";
    this.isCustomLoader = true;
    this.loader = new STLLoader();
    this.cache = new Map();
  }

  async load(path, onProgress = null) {
    if (this.cache.has(path)) {
      return this.cache.get(path).clone();
    }

    try {
      const geometry = await new Promise((resolve, reject) => {
        this.loader.load(path, resolve, onProgress, reject);
      });

      this.cache.set(path, geometry.clone());
      return geometry;
    } catch (error) {
      console.error("Error loading STL:", error);
      throw error;
    }
  }

  dispose() {
    this.cache.forEach((geometry) => geometry.dispose());
    this.cache.clear();
  }
}
