import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

export class CustomFBXLoader {
    constructor() {
        this.type = 'fbx';
        this.isCustomLoader = true;
        this.loader = new FBXLoader();
        this.cache = new Map();
    }

    async load(path, onProgress = null) {
        if (this.cache.has(path)) {
            return this.cache.get(path).clone();
        }

        try {
            const object = await new Promise((resolve, reject) => {
                this.loader.load(
                    path,
                    resolve,
                    onProgress,
                    reject
                );
            });

            this.cache.set(path, object.clone());
            return object;

        } catch (error) {
            console.error('Error loading FBX:', error);
            throw error;
        }
    }

    dispose() {
        this.cache.forEach(object => {
            object.traverse(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(mat => mat.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
        });
        this.cache.clear();
    }
}