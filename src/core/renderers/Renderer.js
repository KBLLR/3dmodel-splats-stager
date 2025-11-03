import * as THREE from "three";

export class Renderer extends THREE.WebGLRenderer {
  constructor(params = {}) {
    const {
      canvas,
      antialias = true,
      alpha = true,
      powerPreference = "high-performance",
      stencil = false,
    } = params;

    super({
      canvas,
      antialias,
      alpha,
      powerPreference,
      stencil,
    });

    this.type = "renderer";
    this.isCustomRenderer = true;

    // Basic setup
    this.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.setClearColor(0x000000, 0);
    this.setSize(window.innerWidth, window.innerHeight);

    // Updated settings for r155+
    this.outputColorSpace = THREE.SRGBColorSpace;
    this.toneMapping = THREE.ACESFilmicToneMapping;
    this.toneMappingExposure = 1;

    // Shadows
    this.shadowMap.enabled = true;
    this.shadowMap.type = THREE.PCFSoftShadowMap;

    // Debug parameters
    this.debugObject = {
      clearColor: "#000000",
      clearAlpha: 0,
      toneMappingExposure: 1,
      toneMapping: "ACESFilmic",
      colorSpace: "sRGB",
      shadowMapType: "PCFSoft",
      antialias: true,
      pixelRatio: window.devicePixelRatio,
    };
  }

  updateFromDebug() {
    const toneMappingTypes = {
      None: THREE.NoToneMapping,
      Linear: THREE.LinearToneMapping,
      Reinhard: THREE.ReinhardToneMapping,
      Cineon: THREE.CineonToneMapping,
      ACESFilmic: THREE.ACESFilmicToneMapping,
    };

    const colorSpaces = {
      Linear: THREE.LinearSRGBColorSpace,
      sRGB: THREE.SRGBColorSpace,
    };

    const shadowMapTypes = {
      Basic: THREE.BasicShadowMap,
      PCF: THREE.PCFShadowMap,
      PCFSoft: THREE.PCFSoftShadowMap,
      VSM: THREE.VSMShadowMap,
    };

    this.setClearColor(
      this.debugObject.clearColor,
      this.debugObject.clearAlpha,
    );
    this.toneMapping = toneMappingTypes[this.debugObject.toneMapping];
    this.toneMappingExposure = this.debugObject.toneMappingExposure;
    this.outputColorSpace = colorSpaces[this.debugObject.colorSpace];
    this.shadowMap.type = shadowMapTypes[this.debugObject.shadowMapType];
    this.shadowMap.needsUpdate = true;

    this.setPixelRatio(Math.min(this.debugObject.pixelRatio, 2));
  }

  resize(width, height) {
    this.setSize(width, height);
    this.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
}
