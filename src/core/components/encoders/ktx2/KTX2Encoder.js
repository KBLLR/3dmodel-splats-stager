/**
 * @file Defines the KTX2Encoder class for handling KTX2 texture encoding settings.
 * @module KTX2Encoder
 */

/**
 * @class KTX2Encoder
 * @description Manages settings for KTX2 texture encoding.
 */
export class KTX2Encoder {
  /**
   * @constructor
   * @description Initializes the KTX2Encoder with default settings.
   */
  constructor() {
    /**
     * @property {string} type - The type of the encoder.
     */
    this.type = "ktx2";
    /**
     * @property {boolean} isCustomEncoder - Flag indicating this is a custom encoder.
     */
    this.isCustomEncoder = true;
    /**
     * @property {string} transcoderPath - The path to the KTX2 transcoder files.
     */
    this.transcoderPath = "/ktx2/";

    /**
     * @property {object} debugObject - An object holding the encoder's settings for debugging.
     * @property {string} debugObject.transcoderPath - The path to the transcoder.
     * @property {string} debugObject.format - The texture format.
     * @property {string} debugObject.quality - The encoding quality.
     * @property {string} debugObject.compression - The compression method.
     */
    this.debugObject = {
      transcoderPath: this.transcoderPath,
      format: "auto",
      quality: "medium",
      compression: "auto",
    };
  }

  /**
   * @method setTranscoderPath
   * @description Sets the path to the KTX2 transcoder files.
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
