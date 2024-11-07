export const DracoConfig = {
    defaults: {
        decoderPath: '/draco/',
        quantization: {
            position: 11,    // 1-16
            normal: 8,       // 1-16
            color: 8,        // 1-16
            uv: 10,          // 1-16
            generic: 8       // 1-16
        },
        compression: {
            level: 7,        // 0-10
            preserveNormals: true,
            preservePositions: true
        },
        attributes: {
            POSITION: true,
            NORMAL: true,
            COLOR: true,
            UV: true
        }
    },

    presets: {
        highQuality: {
            quantization: {
                position: 14,
                normal: 10,
                color: 10,
                uv: 12
            },
            compression: {
                level: 9,
                preserveNormals: true
            }
        },
        mediumQuality: {
            quantization: {
                position: 11,
                normal: 8,
                color: 8,
                uv: 10
            },
            compression: {
                level: 7,
                preserveNormals: true
            }
        },
        fastCompression: {
            quantization: {
                position: 8,
                normal: 6,
                color: 6,
                uv: 8
            },
            compression: {
                level: 4,
                preserveNormals: false
            }
        }
    },

    validate(config) {
        const clampQuantization = (value) => Math.max(1, Math.min(16, value));
        const clampCompression = (value) => Math.max(0, Math.min(10, value));

        return {
            quantization: {
                position: clampQuantization(config.quantization.position),
                normal: clampQuantization(config.quantization.normal),
                color: clampQuantization(config.quantization.color),
                uv: clampQuantization(config.quantization.uv)
            },
            compression: {
                level: clampCompression(config.compression.level)
            }
        };
    }
};
