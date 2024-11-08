import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";

export class CustomSVGLoader {
  constructor() {
    this.type = "svg";
    this.isCustomLoader = true;
    this.loader = new SVGLoader();
    this.cache = new Map();
  }

  async load(path, onProgress = null) {
    if (this.cache.has(path)) {
      return this.cache.get(path);
    }

    try {
      const data = await new Promise((resolve, reject) => {
        this.loader.load(path, resolve, onProgress, reject);
      });

      this.cache.set(path, data);
      return data;
    } catch (error) {
      console.error("Error loading SVG:", error);
      throw error;
    }
  }

  dispose() {
    this.cache.clear();
  }
}
