/**
 * @file Manages the lifecycle of various components like geometries, materials, and lights.
 * @module ComponentManager
 */

import * as THREE from 'three';

/**
 * @class ComponentManager
 * @description Handles the registration, retrieval, creation, and disposal of core Three.js components.
 */
export class ComponentManager {
    /**
     * @constructor
     * @description Initializes component registries, active component maps, and debug objects.
     */
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

    /**
     * @method initializeDefaultComponents
     * @description Registers a set of basic, commonly used components that are always available.
     */
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

    /**
     * @method registerGeometry
     * @description Registers a geometry component.
     * @param {string} name - The name to identify the geometry.
     * @param {THREE.BufferGeometry} geometry - The geometry object to register.
     */
    registerGeometry(name, geometry) {
        this.geometries.set(name, geometry);
        this.debugObjects.geometries[name] = geometry.parameters || {};
    }

    /**
     * @method getGeometry
     * @description Retrieves a geometry by its name.
     * @param {string} name - The name of the geometry to retrieve.
     * @returns {THREE.BufferGeometry|undefined} The geometry object, or undefined if not found.
     */
    getGeometry(name) {
        return this.geometries.get(name);
    }

    /**
     * @method registerMaterial
     * @description Registers a material component.
     * @param {string} name - The name to identify the material.
     * @param {THREE.Material} material - The material object to register.
     */
    registerMaterial(name, material) {
        this.materials.set(name, material);
        this.debugObjects.materials[name] = {
            color: material.color?.getHex() || 0xffffff,
            opacity: material.opacity || 1,
            ...material.userData
        };
    }

    /**
     * @method getMaterial
     * @description Retrieves a material by its name.
     * @param {string} name - The name of the material to retrieve.
     * @returns {THREE.Material|undefined} The material object, or undefined if not found.
     */
    getMaterial(name) {
        return this.materials.get(name);
    }

    /**
     * @method registerLight
     * @description Registers a light component.
     * @param {string} name - The name to identify the light.
     * @param {THREE.Light} light - The light object to register.
     */
    registerLight(name, light) {
        this.lights.set(name, light);
        this.debugObjects.lights[name] = {
            intensity: light.intensity,
            color: light.color?.getHex() || 0xffffff,
            ...light.userData
        };
    }

    /**
     * @method getLight
     * @description Retrieves a light by its name.
     * @param {string} name - The name of the light to retrieve.
     * @returns {THREE.Light|undefined} The light object, or undefined if not found.
     */
    getLight(name) {
        return this.lights.get(name);
    }

    /**
     * @method createMesh
     * @description Creates a mesh from registered geometry and material.
     * @param {string} name - The name to identify the new mesh.
     * @param {string} geometryName - The name of the registered geometry.
     * @param {string} materialName - The name of the registered material.
     * @returns {THREE.Mesh} The created mesh.
     * @throws {Error} If the geometry or material is not found.
     */
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

    /**
     * @method activateComponent
     * @description Adds a component to the active map.
     * @param {string} name - The name of the component.
     * @param {object} component - The component object.
     */
    activateComponent(name, component) {
        this.activeComponents.set(name, component);
    }

    /**
     * @method deactivateComponent
     * @description Removes a component from the active map.
     * @param {string} name - The name of the component to deactivate.
     */
    deactivateComponent(name) {
        this.activeComponents.delete(name);
    }

    /**
     * @method updateFromDebug
     * @description Updates a component's properties from its debug object.
     * @param {string} type - The type of component ('materials', 'lights', etc.).
     * @param {string} name - The name of the component to update.
     */
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

    /**
     * @method dispose
     * @description Disposes all registered components to free up resources.
     */
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

    /**
     * @method getAllComponents
     * @description Gets a list of all registered component names by type.
     * @returns {object} An object containing arrays of component names.
     */
    getAllComponents() {
        return {
            geometries: Array.from(this.geometries.keys()),
            materials: Array.from(this.materials.keys()),
            lights: Array.from(this.lights.keys()),
            meshes: Array.from(this.meshes.keys())
        };
    }

    /**
     * @method getActiveComponents
     * @description Gets an array of all currently active components.
     * @returns {Array<[string, object]>} An array of [name, component] pairs.
     */
    getActiveComponents() {
        return Array.from(this.activeComponents.entries());
    }
}
