import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

// Preload all HDR assets under src/assets to get proper URLs via Vite
const HDR_ASSETS = import.meta.glob(
  "/src/assets/environmentMaps/hdr/**/*",
  { as: "url", eager: true },
);

export class HDRIEnvironment {
  constructor(params = {}) {
    const {
      path = null,
      intensity = 1.0,
      blur = 0,
      rotation = 0,
      exposure = 1.0,
    } = params;

    this.type = "hdr";
    this.isCustomEnvironment = true;
    this.loader = new RGBELoader();
    this.loader.setDataType(THREE.FloatType); // Changed to FloatType for better precision
    this.envMap = null;
    this.pmremGenerator = null;

    this.debugObject = {
      intensity,
      blur,
      rotation,
      path,
      exposure,
    };
  }

  async load(renderer) {
    if (!this.debugObject.path) {
      console.warn("No HDRI path provided");
      return this.createFallbackEnvironment(renderer);
    }

    // Configure renderer
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMappingExposure = this.debugObject.exposure;

    // Create PMREM Generator
    this.pmremGenerator = new THREE.PMREMGenerator(renderer);
    this.pmremGenerator.compileEquirectangularShader();

    try {
      const resolvedUrl = this.resolveAssetUrl(this.debugObject.path);
      const texture = await this.loadTexture(resolvedUrl);
      return this.processTexture(texture, renderer);
    } catch (error) {
      console.error("Error loading HDRI:", error);
      return this.createFallbackEnvironment(renderer);
    }
  }

  resolveAssetUrl(rawPath) {
    if (!rawPath) return null;
    // Normalize leading slash and build candidate keys
    const normalized = rawPath.replace(/^\/+/, "");
    const keyExact = `/src/assets/${normalized}`;
    if (HDR_ASSETS[keyExact]) return HDR_ASSETS[keyExact];

    // Fallback: match by ending path (e.g., environmentMaps/hdr/file.hdr)
    const hit = Object.keys(HDR_ASSETS).find((k) => k.endsWith(normalized));
    if (hit) return HDR_ASSETS[hit];

    console.warn(
      `HDRIEnvironment: Asset not found in glob map for path "${rawPath}"; using raw path`,
    );
    return rawPath;
  }

  loadTexture(url) {
    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          resolve(texture);
        },
        undefined,
        reject,
      );
    });
  }

  processTexture(texture, renderer) {
    if (!this.pmremGenerator) {
      this.pmremGenerator = new THREE.PMREMGenerator(renderer);
      this.pmremGenerator.compileEquirectangularShader();
    }

    const renderTarget = this.pmremGenerator.fromEquirectangular(texture);
    this.envMap = renderTarget.texture;

    // Apply initial settings
    this.envMap.mapping = THREE.EquirectangularReflectionMapping;
    this.applyIntensity();

    // Cleanup
    texture.dispose();
    renderTarget.dispose();
    this.pmremGenerator.dispose();
    this.pmremGenerator = null;

    return this.envMap;
  }

  createFallbackEnvironment(renderer) {
    const size = 256;
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(size, {
      type: THREE.FloatType,
      colorSpace: THREE.SRGBColorSpace,
    });

    const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);
    const fallbackScene = new THREE.Scene();

    // Add basic lighting
    fallbackScene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    fallbackScene.add(directionalLight);

    // Create and process fallback environment
    cubeCamera.update(renderer, fallbackScene);
    this.envMap = cubeRenderTarget.texture;
    this.applyIntensity();

    return this.envMap;
  }

  applyIntensity() {
    if (this.envMap) {
      this.envMap.intensity = this.debugObject.intensity;
    }
  }

  setRotation(scene) {
    if (!this.envMap || !scene) return;

    const rotationMatrix = new THREE.Matrix4();
    rotationMatrix.makeRotationY(this.debugObject.rotation);

    if (scene.environment === this.envMap) {
      scene.environment.matrix = rotationMatrix;
      scene.environment.matrixAutoUpdate = false;
    }
  }

  updateFromDebug(scene, renderer) {
    if (this.envMap) {
      this.applyIntensity();
      this.setRotation(scene);

      if (renderer) {
        renderer.toneMappingExposure = this.debugObject.exposure;
      }
    }
  }

  dispose() {
    if (this.envMap) {
      this.envMap.dispose();
      this.envMap = null;
    }
    if (this.pmremGenerator) {
      this.pmremGenerator.dispose();
      this.pmremGenerator = null;
    }
  }
}
