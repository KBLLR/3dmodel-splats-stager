export class DracoEncoder {
    constructor() {
        this.type = 'draco';
        this.isCustomEncoder = true;
        this.decoderPath = '/draco/';
        
        this.debugObject = {
            decoderPath: this.decoderPath,
            quantization: {
                position: 11,
                normal: 8,
                uv: 10,
                color: 8
            }
        };
    }

    setDecoderPath(path) {
        this.decoderPath = path;
        this.debugObject.decoderPath = path;
    }

    updateSettings(settings) {
        Object.assign(this.debugObject, settings);
    }
}
