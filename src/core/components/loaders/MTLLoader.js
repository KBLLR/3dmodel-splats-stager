import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';

export class CustomMTLLoader {
    constructor() {
        this.type = 'mtl';
        this.isCustomLoader = true;
        this.loader = new MTLLoader();
        this.cache = new Map();
    }

    async load(path, onProgress = null) {
        if (this.cache.has(path)) {
            return this.cache.get(path).clone();
        }

        try {
            const materials = await new Promise((resolve, reject) => {
                this.loader.load(
                    path,
                    resolve,
                    onProgress,
                    reject
                );
            });

            materials.preload();
            this.cache.set(path, materials);
            return materials;

        } catch (error) {
            console.error('Error loading MTL:', error);
            throw error;
        }
    }

    dispose() {
        this.cache.forEach(materials => {
            Object.values(materials.materials).forEach(material => {
                material.dispose();
            });
        });
        this.cache.clear();
    }
}
