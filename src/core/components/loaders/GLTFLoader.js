import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader";

export class CustomGLTFLoader {
  constructor(params = {}) {
    const {
      dracoPath = "/draco/",
      ktx2Path = "/ktx2/",
      withDraco = true,
      withKTX2 = true,
    } = params;

    this.type = "gltf";
    this.isCustomLoader = true;

    this.loader = new GLTFLoader();
    this.dracoLoader = null;
    this.ktx2Loader = null;

    if (withDraco) {
      this.dracoLoader = new DRACOLoader();
      this.dracoLoader.setDecoderPath(dracoPath);
      this.loader.setDRACOLoader(this.dracoLoader);
    }

    if (withKTX2) {
      this.ktx2Loader = new KTX2Loader();
      this.ktx2Loader.setTranscoderPath(ktx2Path);
      this.loader.setKTX2Loader(this.ktx2Loader);
    }

    this.cache = new Map();
    this.debugObject = {
      dracoPath,
      ktx2Path,
      withDraco,
      withKTX2,
    };
  }

  async load(path, onProgress = null) {
    // Check cache first
    if (this.cache.has(path)) {
      return this.cache.get(path).clone();
    }

    try {
      const gltf = await new Promise((resolve, reject) => {
        this.loader.load(path, resolve, onProgress, reject);
      });

      // Cache the result
      this.cache.set(path, gltf.scene.clone());

      return gltf;
    } catch (error) {
      console.error("Error loading GLTF:", error);
      throw error;
    }
  }

  dispose() {
    if (this.dracoLoader) {
      this.dracoLoader.dispose();
    }
    if (this.ktx2Loader) {
      this.ktx2Loader.dispose();
    }
    // Clear cache
    this.cache.forEach((model) => {
      model.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => this.disposeMaterial(mat));
          } else {
            this.disposeMaterial(child.material);
          }
        }
      });
    });
    this.cache.clear();
  }

  disposeMaterial(material) {
    Object.keys(material).forEach((prop) => {
      if (!material[prop]) return;
      if (material[prop].isTexture) {
        material[prop].dispose();
      }
    });
    material.dispose();
  }
}
