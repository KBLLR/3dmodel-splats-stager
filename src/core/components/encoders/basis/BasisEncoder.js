/**
 * @file Defines the BasisEncoder class for handling Basis Universal texture encoding settings.
 * @module BasisEncoder
 */

/**
 * @class BasisEncoder
 * @description Manages settings for Basis Universal texture encoding.
 */
export class BasisEncoder {
  /**
   * @constructor
   * @description Initializes the BasisEncoder with default settings.
   */
  constructor() {
    /**
     * @property {string} type - The type of the encoder.
     */
    this.type = "basis";
    /**
     * @property {boolean} isCustomEncoder - Flag indicating this is a custom encoder.
     */
    this.isCustomEncoder = true;
    /**
     * @property {string} transcoderPath - The path to the Basis transcoder files.
     */
    this.transcoderPath = "/basis/";

    /**
     * @property {object} debugObject - An object holding the encoder's settings for debugging.
     * @property {string} debugObject.transcoderPath - The path to the transcoder.
     * @property {string} debugObject.format - The texture format.
     * @property {number} debugObject.quality - The encoding quality.
     */
    this.debugObject = {
      transcoderPath: this.transcoderPath,
      format: "auto",
      quality: 128,
    };
  }

  /**
   * @method setTranscoderPath
   * @description Sets the path to the Basis transcoder files.
   * @param {string} path - The new path to the transcoder.
   */
  setTranscoderPath(path) {
    this.transcoderPath = path;
    this.debugObject.transcoderPath = path;
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
