/**
 * @file Defines the DracoEncoder class for handling Draco mesh compression settings.
 * @module DracoEncoder
 */

/**
 * @class DracoEncoder
 * @description Manages settings for Draco mesh compression.
 */
export class DracoEncoder {
  /**
   * @constructor
   * @description Initializes the DracoEncoder with default settings.
   */
  constructor() {
    /**
     * @property {string} type - The type of the encoder.
     */
    this.type = "draco";
    /**
     * @property {boolean} isCustomEncoder - Flag indicating this is a custom encoder.
     */
    this.isCustomEncoder = true;
    /**
     * @property {string} decoderPath - The path to the Draco decoder files.
     */
    this.decoderPath = "/draco/";

    /**
     * @property {object} debugObject - An object holding the encoder's settings for debugging.
     * @property {string} debugObject.decoderPath - The path to the decoder.
     * @property {object} debugObject.quantization - The quantization settings.
     * @property {number} debugObject.quantization.position - Position quantization.
     * @property {number} debugObject.quantization.normal - Normal quantization.
     * @property {number} debugObject.quantization.uv - UV quantization.
     * @property {number} debugObject.quantization.color - Color quantization.
     */
    this.debugObject = {
      decoderPath: this.decoderPath,
      quantization: {
        position: 11,
        normal: 8,
        uv: 10,
        color: 8,
      },
    };
  }

  /**
   * @method setDecoderPath
   * @description Sets the path to the Draco decoder files.
   * @param {string} path - The new path to the decoder.
   */
  setDecoderPath(path) {
    this.decoderPath = path;
    this.debugObject.decoderPath = path;
  }

  /**
   * @method updateSettings
   * @description Updates the encoder's settings from a given object.
   * @param {object} settings - An object containing settings to update.
   */
  updateSettings(settings) {
    Object.assign(this.debugObject, settings);
  }
}
