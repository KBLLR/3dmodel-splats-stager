/**
 * @file PresetManager.js
 * @description This file contains the PresetManager class, which is responsible for dynamically loading presets.
 */

import { PRESET_REGISTRY } from "@presets/index";

/**
 * @class PresetManager
 * @description Manages loading presets on demand to reduce initial memory footprint.
 */
export class PresetManager {
  /**
   * @property {Object.<string, {loader: Function, exportName: string}>} manifest
   * @description A mapping of preset types to their dynamic import loaders and export names.
   * @private
   */
  #manifest;

  /**
   * @property {Map<string, any>} cache
   * @description A cache to store loaded presets and avoid redundant fetches.
   * @private
   */
  #cache;

  /**
   * @constructor
   * @param {Object} [manifest] - An optional manifest object for testing or custom presets.
   * @description Initializes the PresetManager with a manifest of available presets.
   */
  constructor(manifest) {
    this.#cache = new Map();
    this.#manifest = manifest || {
      [PRESET_REGISTRY.CAMERA]: {
        loader: () => import("@presets/cameraPresets"),
        exportName: "CAMERA_PRESETS",
      },
      [PRESET_REGISTRY.CAMERA_MOVEMENT]: {
        loader: () => import("@presets/cameraPresets"),
        exportName: "CAMERA_MOVEMENT_PRESETS",
      },
      [PRESET_REGISTRY.FOG]: {
        loader: () => import("@presets/fogPresets"),
        exportName: "FOG_PRESETS",
      },
    };
  }

  /**
   * @method getPresetNames
   * @description Retrieves the names of all available presets for a given type.
   * @param {string} type - The type of preset to retrieve (e.g., 'camera', 'fog').
   * @returns {Promise<string[]>} A promise that resolves to an array of preset names.
   */
  async getPresetNames(type) {
    const manifestEntry = this.#manifest[type];
    if (!manifestEntry) {
      throw new Error(`Unknown preset type: ${type}`);
    }

    const module = await manifestEntry.loader();
    const presetData = module[manifestEntry.exportName];
    return Object.keys(presetData);
  }

  /**
   * @method loadPreset
   * @description Loads a specific preset by type and name.
   * @param {string} type - The type of preset to load.
   * @param {string} name - The name of the preset to load.
   * @returns {Promise<any>} A promise that resolves to the loaded preset data.
   */
  async loadPreset(type, name) {
    const cacheKey = `${type}-${name}`;
    if (this.#cache.has(cacheKey)) {
      return this.#cache.get(cacheKey);
    }

    const manifestEntry = this.#manifest[type];
    if (!manifestEntry) {
      throw new Error(`Unknown preset type: ${type}`);
    }

    const module = await manifestEntry.loader();
    const presetData = module[manifestEntry.exportName];
    const preset = presetData[name];

    if (!preset) {
      throw new Error(`Preset "${name}" not found for type "${type}"`);
    }

    this.#cache.set(cacheKey, preset);
    return preset;
  }
}