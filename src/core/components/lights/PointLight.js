import * as THREE from "three";

export class PointLight extends THREE.PointLight {
  constructor(color = 0xffffff, intensity = 1, distance = 0, decay = 2) {
    super(color, intensity, distance, decay);

    this.type = "point";
    this.isCustomLight = true;
    this.castShadow = true;
    this.position.set(0, 5, 0);

    this.debugObject = {
      color: color,
      intensity: intensity,
      distance: distance,
      decay: decay,
      position: { x: 0, y: 5, z: 0 },
    };
  }

  updateFromDebug() {
    this.color.set(this.debugObject.color);
    this.intensity = this.debugObject.intensity;
    this.distance = this.debugObject.distance;
    this.decay = this.debugObject.decay;
    this.position.set(
      this.debugObject.position.x,
      this.debugObject.position.y,
      this.debugObject.position.z,
    );
  }
}
