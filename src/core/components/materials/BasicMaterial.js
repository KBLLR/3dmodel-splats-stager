import * as THREE from "three";

export class BasicMaterial extends THREE.MeshBasicMaterial {
  constructor(params = {}) {
    const {
      color = 0xffffff,
      map = null,
      alphaMap = null,
      aoMap = null,
      aoMapIntensity = 1,
      envMap = null,
      refractionRatio = 0.98,
      wireframe = false,
      wireframeLinewidth = 1,
      transparent = false,
      opacity = 1,
      side = THREE.FrontSide,
    } = params;

    super({
      color,
      map,
      alphaMap,
      aoMap,
      aoMapIntensity,
      envMap,
      refractionRatio,
      wireframe,
      wireframeLinewidth,
      transparent,
      opacity,
      side,
    });

    this.type = "basic";
    this.isCustomMaterial = true;

    this.debugObject = {
      color,
      aoMapIntensity,
      refractionRatio,
      wireframe,
      wireframeLinewidth,
      transparent,
      opacity,
      side,
    };
  }

  updateFromDebug() {
    Object.entries(this.debugObject).forEach(([key, value]) => {
      if (this[key] !== undefined) {
        if (key === "color") {
          this[key].set(value);
        } else {
          this[key] = value;
        }
      }
    });
  }
}
