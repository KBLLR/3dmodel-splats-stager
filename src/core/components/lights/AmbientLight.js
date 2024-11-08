import * as THREE from "three";

export class AmbientLight extends THREE.AmbientLight {
  constructor(color = 0xffffff, intensity = 1) {
    super(color, intensity);

    // Additional properties for management
    this.type = "ambient";
    this.isCustomLight = true;
    this.debugObject = {
      color: color,
      intensity: intensity,
    };
  }

  updateFromDebug() {
    this.color.set(this.debugObject.color);
    this.intensity = this.debugObject.intensity;
  }
}
