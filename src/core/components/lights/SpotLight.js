import * as THREE from "three";

export class SpotLight extends THREE.SpotLight {
  constructor(
    color = 0xffffff,
    intensity = 1,
    distance = 0,
    angle = Math.PI / 3,
    penumbra = 0,
    decay = 2,
  ) {
    super(color, intensity, distance, angle, penumbra, decay);

    this.type = "spot";
    this.isCustomLight = true;
    this.castShadow = true;
    this.position.set(0, 10, 0);

    this.debugObject = {
      color: color,
      intensity: intensity,
      distance: distance,
      angle: angle,
      penumbra: penumbra,
      decay: decay,
      position: { x: 0, y: 10, z: 0 },
    };
  }

  updateFromDebug() {
    this.color.set(this.debugObject.color);
    this.intensity = this.debugObject.intensity;
    this.distance = this.debugObject.distance;
    this.angle = this.debugObject.angle;
    this.penumbra = this.debugObject.penumbra;
    this.decay = this.debugObject.decay;
    this.position.set(
      this.debugObject.position.x,
      this.debugObject.position.y,
      this.debugObject.position.z,
    );
  }
}
