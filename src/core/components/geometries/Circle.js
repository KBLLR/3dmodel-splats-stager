import * as THREE from "three";

export class Circle extends THREE.CircleGeometry {
  constructor(params = {}) {
    const {
      radius = 1,
      segments = 32,
      thetaStart = 0,
      thetaLength = Math.PI * 2,
    } = params;

    super(radius, segments, thetaStart, thetaLength);

    this.type = "circle";
    this.isCustomGeometry = true;

    this.debugObject = {
      radius,
      segments,
      thetaStart,
      thetaLength,
    };
  }

  updateFromDebug() {
    const geometry = new THREE.CircleGeometry(
      this.debugObject.radius,
      this.debugObject.segments,
      this.debugObject.thetaStart,
      this.debugObject.thetaLength,
    );

    this.copy(geometry);
    geometry.dispose();
  }
}
