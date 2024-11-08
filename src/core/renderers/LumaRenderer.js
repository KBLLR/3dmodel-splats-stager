import { CinematicRenderer } from "@renderers/CinematicRenderer";
import * as THREE from "three";

export class LumaRenderer extends CinematicRenderer {
  constructor(params = {}) {
    super(params);

    // Specific settings for Luma splats
    this.autoClear = true;
    this.premultipliedAlpha = false;

    // Override some settings for better splat rendering
    this.toneMapping = THREE.ACESFilmicToneMapping;
    this.toneMappingExposure = 1;

    // Extended debug object with Luma-specific properties
    this.debugObject = {
      ...this.debugObject,
      splats: {
        pointSize: 1,
        splatAlpha: 1,
        maxPointSize: 32,
      },
    };
  }

  updateFromDebug() {
    super.updateFromDebug();
    // Luma-specific updates will go here
  }
}
