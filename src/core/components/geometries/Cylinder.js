import * as THREE from "three";

export class Cylinder extends THREE.CylinderGeometry {
  constructor(params = {}) {
    const {
      radiusTop = 1,
      radiusBottom = 1,
      height = 1,
      radialSegments = 32,
      heightSegments = 1,
      openEnded = false,
      thetaStart = 0,
      thetaLength = Math.PI * 2,
    } = params;

    super(
      radiusTop,
      radiusBottom,
      height,
      radialSegments,
      heightSegments,
      openEnded,
      thetaStart,
      thetaLength,
    );

    this.type = "cylinder";
    this.isCustomGeometry = true;

    this.debugObject = {
      radiusTop,
      radiusBottom,
      height,
      radialSegments,
      heightSegments,
      openEnded,
      thetaStart,
      thetaLength,
    };
  }

  updateFromDebug() {
    const geometry = new THREE.CylinderGeometry(
      this.debugObject.radiusTop,
      this.debugObject.radiusBottom,
      this.debugObject.height,
      this.debugObject.radialSegments,
      this.debugObject.heightSegments,
      this.debugObject.openEnded,
      this.debugObject.thetaStart,
      this.debugObject.thetaLength,
    );

    this.copy(geometry);
    geometry.dispose();
  }
}
