import * as THREE from 'three';

export class ComponentManager {
    constructor() {
        // Component registries
        this.geometries = new Map();
        this.materials = new Map();
        this.lights = new Map();
        this.meshes = new Map();

        // Active components
        this.activeComponents = new Map();
        
        // Debug objects for each component type
        this.debugObjects = {
            geometries: {},
            materials: {},
            lights: {},
            meshes: {}
        };

        this.initializeDefaultComponents();
    }

    initializeDefaultComponents() {
        // Register basic components that are always available
        this.registerGeometry('box', new THREE.BoxGeometry());
        this.registerGeometry('sphere', new THREE.SphereGeometry());
        this.registerGeometry('plane', new THREE.PlaneGeometry());

        this.registerMaterial('basic', new THREE.MeshBasicMaterial());
        this.registerMaterial('standard', new THREE.MeshStandardMaterial());
        this.registerMaterial('physical', new THREE.MeshPhysicalMaterial());

        this.registerLight('ambient', new THREE.AmbientLight());
        this.registerLight('directional', new THREE.DirectionalLight());
        this.registerLight('point', new THREE.PointLight());
    }

    // Geometry methods
    registerGeometry(name, geometry) {
        this.geometries.set(name, geometry);
        this.debugObjects.geometries[name] = geometry.parameters || {};
    }

    getGeometry(name) {
        return this.geometries.get(name);
    }

    // Material methods
    registerMaterial(name, material) {
        this.materials.set(name, material);
        this.debugObjects.materials[name] = {
            color: material.color?.getHex() || 0xffffff,
            opacity: material.opacity || 1,
            ...material.userData
        };
    }

    getMaterial(name) {
        return this.materials.get(name);
    }

    // Light methods
    registerLight(name, light) {
        this.lights.set(name, light);
        this.debugObjects.lights[name] = {
            intensity: light.intensity,
            color: light.color?.getHex() || 0xffffff,
            ...light.userData
        };
    }

    getLight(name) {
        return this.lights.get(name);
    }

    // Mesh creation and management
    createMesh(name, geometryName, materialName) {
        const geometry = this.getGeometry(geometryName);
        const material = this.getMaterial(materialName);

        if (!geometry || !material) {
            throw new Error(`Cannot create mesh: missing geometry or material`);
        }

        const mesh = new THREE.Mesh(geometry, material);
        this.meshes.set(name, mesh);
        this.activeComponents.set(name, mesh);

        return mesh;
    }

    // Component activation/deactivation
    activateComponent(name, component) {
        this.activeComponents.set(name, component);
    }

    deactivateComponent(name) {
        this.activeComponents.delete(name);
    }

    // Update components from debug values
    updateFromDebug(type, name) {
        const debugData = this.debugObjects[type][name];
        if (!debugData) return;

        switch (type) {
            case 'materials': {
                const material = this.getMaterial(name);
                if (material) {
                    material.color?.setHex(debugData.color);
                    material.opacity = debugData.opacity;
                    material.needsUpdate = true;
                }
                break;
            }
            case 'lights': {
                const light = this.getLight(name);
                if (light) {
                    light.intensity = debugData.intensity;
                    light.color?.setHex(debugData.color);
                }
                break;
            }
            // Add other component type updates as needed
        }
    }

    // Resource management
    dispose() {
        // Dispose geometries
        this.geometries.forEach(geometry => geometry.dispose());
        this.geometries.clear();

        // Dispose materials
        this.materials.forEach(material => material.dispose());
        this.materials.clear();

        // Clear other collections
        this.lights.clear();
        this.meshes.clear();
        this.activeComponents.clear();
    }

    // Utility methods
    getAllComponents() {
        return {
            geometries: Array.from(this.geometries.keys()),
            materials: Array.from(this.materials.keys()),
            lights: Array.from(this.lights.keys()),
            meshes: Array.from(this.meshes.keys())
        };
    }

    getActiveComponents() {
        return Array.from(this.activeComponents.entries());
    }
}
