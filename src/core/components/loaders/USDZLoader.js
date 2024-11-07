import { USDZLoader } from 'three/examples/jsm/loaders/USDZLoader';

export class CustomUSDZLoader {
    constructor() {
        this.type = 'usdz';
        this.isCustomLoader = true;
        this.loader = new USDZLoader();
        this.cache = new Map();
    }

    async load(path, onProgress = null) {
        if (this.cache.has(path)) {
            return this.cache.get(path).clone();
        }

        try {
            const scene = await new Promise((resolve, reject) => {
                this.loader.load(
                    path,
                    resolve,
                    onProgress,
                    reject
                );
            });

            this.cache.set(path, scene.clone());
            return scene;

        } catch (error) {
            console.error('Error loading USDZ:', error);
            throw error;
        }
    }

    dispose() {
        this.cache.forEach(scene => {
            scene.traverse(child => {
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
