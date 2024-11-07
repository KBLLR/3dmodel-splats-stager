import { LumaSplatsThree } from '@lumaai/luma-web';

export class LumaLabsLoader {
    constructor(params = {}) {
        this.type = 'splat';
        this.isCustomLoader = true;
        this.cache = new Map();
        
        this.debugObject = {
            particleRevealEnabled: true,
            loadingAnimationEnabled: true,
            enableThreeShaderIntegration: true,
            semanticsMask: null,
            source: null
        };
    }

    async load(path, params = {}) {
        if (this.cache.has(path)) {
            return this.cache.get(path);
        }

        try {
            const splat = new LumaSplatsThree({
                source: path,
                particleRevealEnabled: params.particleRevealEnabled ?? this.debugObject.particleRevealEnabled,
                loadingAnimationEnabled: params.loadingAnimationEnabled ?? this.debugObject.loadingAnimationEnabled,
                enableThreeShaderIntegration: params.enableThreeShaderIntegration ?? this.debugObject.enableThreeShaderIntegration
            });

            // Wait for the splat to load
            await new Promise((resolve) => {
                splat.onLoad = () => resolve();
            });

            this.cache.set(path, splat);
            return splat;

        } catch (error) {
            console.error('Error loading Splat:', error);
            throw error;
        }
    }

    setShaderHooks(splat, hooks) {
        if (splat && hooks) {
            splat.setShaderHooks(hooks);
        }
    }

    setupEnvironment(splat, renderer, scene) {
        if (splat && renderer && scene) {
            splat.onLoad = () => {
                splat.captureCubemap(renderer).then((capturedTexture) => {
                    scene.environment = capturedTexture;
                    scene.background = capturedTexture;
                    scene.backgroundBlurriness = 0.5;
                });
            };
        }
    }

    dispose() {
        this.cache.forEach(splat => {
            if (splat.material) {
                splat.material.dispose();
            }
            if (splat.geometry) {
                splat.geometry.dispose();
            }
        });
        this.cache.clear();
    }
}
