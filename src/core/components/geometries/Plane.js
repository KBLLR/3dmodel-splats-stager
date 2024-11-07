import * as THREE from 'three';

export class Plane extends THREE.PlaneGeometry {
    constructor(params = {}) {
        const {
            width = 1,
            height = 1,
            widthSegments = 1,
            heightSegments = 1
        } = params;

        super(width, height, widthSegments, heightSegments);

        this.type = 'plane';
        this.isCustomGeometry = true;
        
        this.debugObject = {
            width,
            height,
            widthSegments,
            heightSegments
        };
    }

    updateFromDebug() {
        const geometry = new THREE.PlaneGeometry(
            this.debugObject.width,
            this.debugObject.height,
            this.debugObject.widthSegments,
            this.debugObject.heightSegments
        );
        
        this.copy(geometry);
        geometry.dispose();
    }
}
