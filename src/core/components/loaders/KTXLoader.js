import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader';
import * as THREE from 'three';

export class CustomKTXLoader {
    constructor(renderer) {
        this.type = 'ktx';
        this.isCustomLoader = true;
        this.loader = new KTX2Loader();
        this.cache = new Map();
        
        if (renderer) {
            this.loader.setTranscoderPath('/basis/');
            this.loader.detectSupport(renderer);
        }
        
        this.debugObject = {
            transcoderPath: '/basis/'
        };
    }

    async load(path, onProgress = null) {
        if (this.cache.has(path)) {
            return this.cache.get(path).clone();
        }

        try {
            const texture = await new Promise((resolve, reject) => {
                this.loader.load(
                    path,
                    resolve,
                    onProgress,
                    reject
                );
            });

            this.cache.set(path, texture);
            return texture;

        } catch (error) {
            console.error('Error loading KTX:', error);
            throw error;
        }
    }

    dispose() {
        this.cache.forEach(texture => texture.dispose());
        this.cache.clear();
    }

    updateRenderer(renderer) {
        this.loader.detectSupport(renderer);
    }
}
