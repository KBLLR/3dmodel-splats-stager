export class BasisEncoder {
  constructor() {
    this.type = "basis";
    this.isCustomEncoder = true;
    this.transcoderPath = "/basis/";

    this.debugObject = {
      transcoderPath: this.transcoderPath,
      format: "auto",
      quality: 128,
    };
  }

  setTranscoderPath(path) {
    this.transcoderPath = path;
    this.debugObject.transcoderPath = path;
  }

  updateSettings(settings) {
    Object.assign(this.debugObject, settings);
  }
}
