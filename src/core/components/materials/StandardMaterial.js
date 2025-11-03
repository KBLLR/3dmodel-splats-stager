/**
 * @file Extends the Three.js MeshStandardMaterial with a debug-friendly interface.
 * @module StandardMaterial
 */

import * as THREE from "three";

/**
 * @class StandardMaterial
 * @description A custom material that extends Three.js's MeshStandardMaterial to provide
 * a simplified constructor and a debug object for easy manipulation.
 * @extends {THREE.MeshStandardMaterial}
 */
export class StandardMaterial extends THREE.MeshStandardMaterial {
  /**
   * @constructor
   * @param {object} [params={}] - The parameters for the material.
   * @param {THREE.Color|number|string} [params.color=0xffffff] - The color of the material.
   * @param {number} [params.roughness=0.5] - The roughness of the material.
   * @param {number} [params.metalness=0.5] - The metalness of the material.
   * @param {THREE.Texture|null} [params.map=null] - The color map.
   * @param {THREE.Texture|null} [params.normalMap=null] - The normal map.
   * @param {THREE.Texture|null} [params.roughnessMap=null] - The roughness map.
   * @param {THREE.Texture|null} [params.metalnessMap=null] - The metalness map.
   * @param {THREE.Texture|null} [params.aoMap=null] - The ambient occlusion map.
   * @param {number} [params.aoMapIntensity=1] - The intensity of the ambient occlusion map.
   * @param {THREE.Color|number|string} [params.emissive=0x000000] - The emissive color of the material.
   * @param {number} [params.emissiveIntensity=1] - The intensity of the emissive light.
   * @param {THREE.Texture|null} [params.emissiveMap=null] - The emissive map.
   * @param {THREE.Texture|null} [params.bumpMap=null] - The bump map.
   * @param {number} [params.bumpScale=1] - The scale of the bump map.
   * @param {THREE.Texture|null} [params.displacementMap=null] - The displacement map.
   * @param {number} [params.displacementScale=1] - The scale of the displacement map.
   * @param {number} [params.displacementBias=0] - The bias of the displacement map.
   * @param {THREE.Texture|null} [params.envMap=null] - The environment map.
   * @param {boolean} [params.wireframe=false] - Whether to render as a wireframe.
   * @param {boolean} [params.transparent=false] - Whether the material is transparent.
   * @param {number} [params.opacity=1] - The opacity of the material.
   */
  constructor(params = {}) {
    const {
      color = 0xffffff,
      roughness = 0.5,
      metalness = 0.5,
      map = null,
      normalMap = null,
      roughnessMap = null,
      metalnessMap = null,
      aoMap = null,
      aoMapIntensity = 1,
      emissive = 0x000000,
      emissiveIntensity = 1,
      emissiveMap = null,
      bumpMap = null,
      bumpScale = 1,
      displacementMap = null,
      displacementScale = 1,
      displacementBias = 0,
      envMap = null,
      wireframe = false,
      transparent = false,
      opacity = 1,
    } = params;

    super({
      color,
      roughness,
      metalness,
      map,
      normalMap,
      roughnessMap,
      metalnessMap,
      aoMap,
      aoMapIntensity,
      emissive,
      emissiveIntensity,
      emissiveMap,
      bumpMap,
      bumpScale,
      displacementMap,
      displacementScale,
      displacementBias,
      envMap,
      wireframe,
      transparent,
      opacity,
    });

    this.type = "standard";
    this.isCustomMaterial = true;

    /**
     * @property {object} debugObject - An object holding the material's parameters for debugging.
     */
    this.debugObject = {
      color,
      roughness,
      metalness,
      aoMapIntensity,
      emissive,
      emissiveIntensity,
      bumpScale,
      displacementScale,
      displacementBias,
      wireframe,
      transparent,
      opacity,
    };
  }

  /**
   * @method updateFromDebug
   * @description Updates the material's properties from the `debugObject`.
   */
  updateFromDebug() {
    Object.entries(this.debugObject).forEach(([key, value]) => {
      if (this[key] !== undefined) {
        if (key === "color" || key === "emissive") {
          this[key].set(value);
        } else {
          this[key] = value;
        }
      }
    });
  }
}
