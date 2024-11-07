export class KTX2Encoder {
    constructor() {
        this.type = 'ktx2';
        this.isCustomEncoder = true;
        this.transcoderPath = '/ktx2/';
        
        this.debugObject = {
            transcoderPath: this.transcoderPath,
            format: 'auto',
            quality: 'medium',
            compression: 'auto'
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
