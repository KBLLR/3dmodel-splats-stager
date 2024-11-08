import { BasicRenderer } from "@renderers/BasicRenderer";
import * as THREE from "three";

export class CinematicRenderer extends BasicRenderer {
  constructor(params = {}) {
    super(params);

    // Enhanced cinematic settings
    this.toneMapping = THREE.ACESFilmicToneMapping;
    this.toneMappingExposure = 1.2;
    this.outputColorSpace = THREE.SRGBColorSpace;

    // Post-processing properties
    this.enableBloom = true;
    this.enableVignette = true;
    this.enableFilmGrain = true;

    // Extend debug object with cinematic properties
    this.debugObject = {
      ...this.debugObject,
      bloom: {
        enabled: true,
        intensity: 1,
        threshold: 0.9,
        radius: 0.8,
      },
      vignette: {
        enabled: true,
        darkness: 0.5,
        offset: 0.5,
      },
      filmGrain: {
        enabled: true,
        intensity: 0.35,
      },
      chromaticAberration: {
        enabled: true,
        offset: 0.005,
      },
    };
  }

  updateFromDebug() {
    super.updateFromDebug();
    // Additional cinematic updates will go here when we add post-processing
  }
}
