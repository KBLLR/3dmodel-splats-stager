/**
 * @file Extends the Three.js MeshBasicMaterial with a debug-friendly interface.
 * @module BasicMaterial
 */

import * as THREE from "three";

/**
 * @class BasicMaterial
 * @description A custom material that extends Three.js's MeshBasicMaterial to provide
 * a simplified constructor and a debug object for easy manipulation.
 * @extends {THREE.MeshBasicMaterial}
 */
export class BasicMaterial extends THREE.MeshBasicMaterial {
  /**
   * @constructor
   * @param {object} [params={}] - The parameters for the material.
   * @param {THREE.Color|number|string} [params.color=0xffffff] - The color of the material.
   * @param {THREE.Texture|null} [params.map=null] - The color map.
   * @param {THREE.Texture|null} [params.alphaMap=null] - The alpha map.
   * @param {THREE.Texture|null} [params.aoMap=null] - The ambient occlusion map.
   * @param {number} [params.aoMapIntensity=1] - The intensity of the ambient occlusion map.
   * @param {THREE.Texture|null} [params.envMap=null] - The environment map.
   * @param {number} [params.refractionRatio=0.98] - The ratio of refraction.
   * @param {boolean} [params.wireframe=false] - Whether to render as a wireframe.
   * @param {number} [params.wireframeLinewidth=1] - The width of the wireframe lines.
   * @param {boolean} [params.transparent=false] - Whether the material is transparent.
   * @param {number} [params.opacity=1] - The opacity of the material.
   * @param {THREE.Side} [params.side=THREE.FrontSide] - Which side of faces to render.
   */
  constructor(params = {}) {
    const {
      color = 0xffffff,
      map = null,
      alphaMap = null,
      aoMap = null,
      aoMapIntensity = 1,
      envMap = null,
      refractionRatio = 0.98,
      wireframe = false,
      wireframeLinewidth = 1,
      transparent = false,
      opacity = 1,
      side = THREE.FrontSide,
    } = params;

    super({
      color,
      map,
      alphaMap,
      aoMap,
      aoMapIntensity,
      envMap,
      refractionRatio,
      wireframe,
      wireframeLinewidth,
      transparent,
      opacity,
      side,
    });

    this.type = "basic";
    this.isCustomMaterial = true;

    /**
     * @property {object} debugObject - An object holding the material's parameters for debugging.
     */
    this.debugObject = {
      color,
      aoMapIntensity,
      refractionRatio,
      wireframe,
      wireframeLinewidth,
      transparent,
      opacity,
      side,
    };
  }

  /**
   * @method updateFromDebug
   * @description Updates the material's properties from the `debugObject`.
   */
  updateFromDebug() {
    Object.entries(this.debugObject).forEach(([key, value]) => {
      if (this[key] !== undefined) {
        if (key === "color") {
          this[key].set(value);
        } else {
          this[key] = value;
        }
      }
    });
  }
}
