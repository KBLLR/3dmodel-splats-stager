import * as THREE from "three";

export class RectAreaLight extends THREE.RectAreaLight {
  constructor(color = 0xffffff, intensity = 1, width = 10, height = 10) {
    super(color, intensity, width, height);

    this.type = "rectArea";
    this.isCustomLight = true;
    this.position.set(0, 5, 0);
    this.lookAt(0, 0, 0);

    this.debugObject = {
      color: color,
      intensity: intensity,
      width: width,
      height: height,
      position: { x: 0, y: 5, z: 0 },
    };
  }

  updateFromDebug() {
    this.color.set(this.debugObject.color);
    this.intensity = this.debugObject.intensity;
    this.width = this.debugObject.width;
    this.height = this.debugObject.height;
    this.position.set(
      this.debugObject.position.x,
      this.debugObject.position.y,
      this.debugObject.position.z,
    );
    this.lookAt(0, 0, 0);
  }
}
