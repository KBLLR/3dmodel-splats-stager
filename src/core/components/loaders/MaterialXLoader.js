import { MaterialXLoader } from 'three/examples/jsm/loaders/MaterialXLoader';

export class CustomMaterialXLoader {
    constructor() {
        this.type = 'materialx';
        this.isCustomLoader = true;
        this.loader = new MaterialXLoader();
        this.cache = new Map();
    }

    async load(path, onProgress = null) {
        if (this.cache.has(path)) {
            return this.cache.get(path).clone();
        }

        try {
            const materialData = await new Promise((resolve, reject) => {
                this.loader.load(
                    path,
                    resolve,
                    onProgress,
                    reject
                );
            });

            this.cache.set(path, materialData);
            return materialData;

        } catch (error) {
            console.error('Error loading MaterialX:', error);
            throw error;
        }
    }

    dispose() {
        this.cache.forEach(materialData => {
            if (materialData.material) materialData.material.dispose();
        });
        this.cache.clear();
    }
}
