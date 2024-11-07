import * as THREE from 'three';

export class Sphere extends THREE.SphereGeometry {
    constructor(params = {}) {
        const {
            radius = 1,
            widthSegments = 32,
            heightSegments = 16,
            phiStart = 0,
            phiLength = Math.PI * 2,
            thetaStart = 0,
            thetaLength = Math.PI
        } = params;

        super(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength);

        this.type = 'sphere';
        this.isCustomGeometry = true;
        
        this.debugObject = {
            radius,
            widthSegments,
            heightSegments,
            phiStart,
            phiLength,
            thetaStart,
            thetaLength
        };
    }

    updateFromDebug() {
        const geometry = new THREE.SphereGeometry(
            this.debugObject.radius,
            this.debugObject.widthSegments,
            this.debugObject.heightSegments,
            this.debugObject.phiStart,
            this.debugObject.phiLength,
            this.debugObject.thetaStart,
            this.debugObject.thetaLength
        );
        
        this.copy(geometry);
        geometry.dispose();
    }
}
