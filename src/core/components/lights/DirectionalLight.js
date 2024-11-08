import * as THREE from "three";

export class DirectionalLight extends THREE.DirectionalLight {
  constructor(color = 0xffffff, intensity = 1) {
    super(color, intensity);

    this.type = "directional";
    this.isCustomLight = true;
    this.castShadow = true;
    this.position.set(5, 5, 5);

    this.debugObject = {
      color: color,
      intensity: intensity,
      position: { x: 5, y: 5, z: 5 },
    };
  }

  updateFromDebug() {
    this.color.set(this.debugObject.color);
    this.intensity = this.debugObject.intensity;
    this.position.set(
      this.debugObject.position.x,
      this.debugObject.position.y,
      this.debugObject.position.z,
    );
  }
}
