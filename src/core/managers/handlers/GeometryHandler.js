import * as THREE from 'three';
import { Box, Sphere, Plane, Circle, Cylinder } from '@geometries';

export class GeometryHandler {
    constructor() {
        this.registry = new Map();
        this.debugObjects = new Map();
        this.initializeDefaults();
    }

    initializeDefaults() {
        const defaults = {
            'box': new Box(),
            'sphere': new Sphere(),
            'plane': new Plane(),
            'circle': new Circle(),
            'cylinder': new Cylinder()
        };

        Object.entries(defaults).forEach(([name, geometry]) => {
            this.register(name, geometry);
        });
    }

    register(name, geometry) {
        this.registry.set(name, geometry);
        this.debugObjects.set(name, geometry.debugObject || {});
    }

    get(name) {
        return this.registry.get(name);
    }

    updateFromDebug(name) {
        const geometry = this.get(name);
        const debugData = this.debugObjects.get(name);
        
        if (geometry?.updateFromDebug) {
            geometry.updateFromDebug(debugData);
        }
    }

    dispose() {
        this.registry.forEach(geometry => geometry.dispose());
        this.registry.clear();
        this.debugObjects.clear();
    }
}
