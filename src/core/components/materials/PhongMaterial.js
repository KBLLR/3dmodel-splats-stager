/**
 * @file Extends the Three.js MeshPhongMaterial with a debug-friendly interface.
 * @module PhongMaterial
 */

import * as THREE from "three";

/**
 * @class PhongMaterial
 * @description A custom material that extends Three.js's MeshPhongMaterial to provide
 * a simplified constructor and a debug object for easy manipulation.
 * @extends {THREE.MeshPhongMaterial}
 */
export class PhongMaterial extends THREE.MeshPhongMaterial {
  /**
   * @constructor
   * @param {object} [params={}] - The parameters for the material.
   * @param {THREE.Color|number|string} [params.color=0xffffff] - The color of the material.
   * @param {THREE.Color|number|string} [params.emissive=0x000000] - The emissive color of the material.
   * @param {THREE.Color|number|string} [params.specular=0x111111] - The specular color of the material.
   * @param {number} [params.shininess=30] - The shininess of the specular highlight.
   * @param {THREE.Texture|null} [params.map=null] - The color map.
   * @param {THREE.Texture|null} [params.bumpMap=null] - The bump map.
   * @param {number} [params.bumpScale=1] - The scale of the bump map.
   * @param {THREE.Texture|null} [params.normalMap=null] - The normal map.
   * @param {THREE.Vector2} [params.normalScale=new THREE.Vector2(1, 1)] - The scale of the normal map.
   * @param {THREE.Texture|null} [params.displacementMap=null] - The displacement map.
   * @param {number} [params.displacementScale=1] - The scale of the displacement map.
   * @param {number} [params.displacementBias=0] - The bias of the displacement map.
   * @param {THREE.Texture|null} [params.envMap=null] - The environment map.
   * @param {THREE.Combine} [params.combine=THREE.MultiplyOperation] - How the environment map is combined with the surface color.
   * @param {number} [params.reflectivity=1] - The reflectivity of the environment map.
   * @param {number} [params.refractionRatio=0.98] - The ratio of refraction.
   * @param {boolean} [params.wireframe=false] - Whether to render as a wireframe.
   * @param {boolean} [params.transparent=false] - Whether the material is transparent.
   * @param {number} [params.opacity=1] - The opacity of the material.
   */
  constructor(params = {}) {
    const {
      color = 0xffffff,
      emissive = 0x000000,
      specular = 0x111111,
      shininess = 30,
      map = null,
      bumpMap = null,
      bumpScale = 1,
      normalMap = null,
      normalScale = new THREE.Vector2(1, 1),
      displacementMap = null,
      displacementScale = 1,
      displacementBias = 0,
      envMap = null,
      combine = THREE.MultiplyOperation,
      reflectivity = 1,
      refractionRatio = 0.98,
      wireframe = false,
      transparent = false,
      opacity = 1,
    } = params;

    super({
      color,
      emissive,
      specular,
      shininess,
      map,
      bumpMap,
      bumpScale,
      normalMap,
      normalScale,
      displacementMap,
      displacementScale,
      displacementBias,
      envMap,
      combine,
      reflectivity,
      refractionRatio,
      wireframe,
      transparent,
      opacity,
    });

    this.type = "phong";
    this.isCustomMaterial = true;

    /**
     * @property {object} debugObject - An object holding the material's parameters for debugging.
     */
    this.debugObject = {
      color,
      emissive,
      specular,
      shininess,
      bumpScale,
      displacementScale,
      displacementBias,
      reflectivity,
      refractionRatio,
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
        if (["color", "emissive", "specular"].includes(key)) {
          this[key].set(value);
        } else {
          this[key] = value;
        }
      }
    });
  }
}
