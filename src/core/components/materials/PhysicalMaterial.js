/**
 * @file Extends the Three.js MeshPhysicalMaterial with a debug-friendly interface.
 * @module PhysicalMaterial
 */

import * as THREE from "three";

/**
 * @class PhysicalMaterial
 * @description A custom material that extends Three.js's MeshPhysicalMaterial to provide
 * a simplified constructor and a debug object for easy manipulation.
 * @extends {THREE.MeshPhysicalMaterial}
 */
export class PhysicalMaterial extends THREE.MeshPhysicalMaterial {
  /**
   * @constructor
   * @param {object} [params={}] - The parameters for the material.
   * @param {THREE.Color|number|string} [params.color=0xffffff] - The color of the material.
   * @param {number} [params.roughness=0.5] - The roughness of the material.
   * @param {number} [params.metalness=0.5] - The metalness of the material.
   * @param {number} [params.clearcoat=0.0] - The clearcoat intensity.
   * @param {number} [params.clearcoatRoughness=0.0] - The roughness of the clearcoat.
   * @param {number} [params.ior=1.5] - The index of refraction.
   * @param {number} [params.reflectivity=0.5] - The reflectivity of the material.
   * @param {number} [params.sheen=0.0] - The sheen intensity.
   * @param {number} [params.sheenRoughness=0.0] - The roughness of the sheen.
   * @param {THREE.Color|number|string} [params.sheenColor=0x000000] - The color of the sheen.
   * @param {number} [params.specularIntensity=1.0] - The intensity of the specular highlight.
   * @param {THREE.Color|number|string} [params.specularColor=0xffffff] - The color of the specular highlight.
   * @param {number} [params.transmission=0.0] - The amount of light transmitted through the material.
   * @param {number} [params.thickness=0.0] - The thickness of the material (for transmission).
   * @param {number} [params.attenuationDistance=Infinity] - The distance at which the light attenuation occurs.
   * @param {THREE.Color|number|string} [params.attenuationColor=0xffffff] - The color of the attenuation.
   * @param {boolean} [params.wireframe=false] - Whether to render as a wireframe.
   * @param {boolean} [params.transparent=false] - Whether the material is transparent.
   * @param {number} [params.opacity=1] - The opacity of the material.
   */
  constructor(params = {}) {
    const {
      color = 0xffffff,
      roughness = 0.5,
      metalness = 0.5,
      clearcoat = 0.0,
      clearcoatRoughness = 0.0,
      ior = 1.5,
      reflectivity = 0.5,
      sheen = 0.0,
      sheenRoughness = 0.0,
      sheenColor = 0x000000,
      specularIntensity = 1.0,
      specularColor = 0xffffff,
      transmission = 0.0,
      thickness = 0.0,
      attenuationDistance = Infinity,
      attenuationColor = 0xffffff,
      wireframe = false,
      transparent = false,
      opacity = 1,
    } = params;

    super({
      color,
      roughness,
      metalness,
      clearcoat,
      clearcoatRoughness,
      ior,
      reflectivity,
      sheen,
      sheenRoughness,
      sheenColor,
      specularIntensity,
      specularColor,
      transmission,
      thickness,
      attenuationDistance,
      attenuationColor,
      wireframe,
      transparent,
      opacity,
    });

    this.type = "physical";
    this.isCustomMaterial = true;

    /**
     * @property {object} debugObject - An object holding the material's parameters for debugging.
     */
    this.debugObject = {
      color,
      roughness,
      metalness,
      clearcoat,
      clearcoatRoughness,
      ior,
      reflectivity,
      sheen,
      sheenRoughness,
      sheenColor,
      specularIntensity,
      specularColor,
      transmission,
      thickness,
      attenuationDistance,
      attenuationColor,
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
        if (
          ["color", "sheenColor", "specularColor", "attenuationColor"].includes(
            key,
          )
        ) {
          this[key].set(value);
        } else {
          this[key] = value;
        }
      }
    });
  }
}
