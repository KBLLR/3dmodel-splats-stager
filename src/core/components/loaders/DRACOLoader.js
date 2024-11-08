import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

export class CustomDRACOLoader {
  constructor(params = {}) {
    const { decoderPath = "/draco/" } = params;

    this.type = "draco";
    this.isCustomLoader = true;
    this.loader = new DRACOLoader();
    this.loader.setDecoderPath(decoderPath);
    this.cache = new Map();

    this.debugObject = {
      decoderPath,
    };
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
      console.error("Error loading Draco geometry:", error);
      throw error;
    }
  }

  dispose() {
    this.loader.dispose();
    this.cache.forEach((geometry) => geometry.dispose());
    this.cache.clear();
  }

  updateDecoderPath(path) {
    this.debugObject.decoderPath = path;
    this.loader.setDecoderPath(path);
  }
}
