import * as THREE from "three";

export class CubeEnvironment {
  constructor(params = {}) {
    const {
      paths = {
        px: null,
        nx: null,
        py: null,
        ny: null,
        pz: null,
        nz: null,
      },
      intensity = 1.0,
      rotation = 0,
    } = params;

    this.type = "cube";
    this.isCustomEnvironment = true;
    this.loader = new THREE.CubeTextureLoader();
    this.envMap = null;

    this.debugObject = {
      paths,
      intensity,
      rotation,
    };
  }

  async load() {
    const { paths } = this.debugObject;
    if (!Object.values(paths).every((path) => path)) return;

    try {
      this.envMap = await this.loader.loadAsync([
        paths.px,
        paths.nx,
        paths.py,
        paths.ny,
        paths.pz,
        paths.nz,
      ]);

      this.envMap.intensity = this.debugObject.intensity;
      this.envMap.rotation = this.debugObject.rotation;

      return this.envMap;
    } catch (error) {
      console.error("Error loading Cube Environment:", error);
      throw error;
    }
  }

  updateFromDebug() {
    if (this.envMap) {
      this.envMap.intensity = this.debugObject.intensity;
      this.envMap.rotation = this.debugObject.rotation;
    }
  }

  dispose() {
    if (this.envMap) {
      this.envMap.dispose();
    }
  }
}
