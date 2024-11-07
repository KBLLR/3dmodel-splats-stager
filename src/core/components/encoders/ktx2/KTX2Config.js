export const KTX2Config = {
    defaults: {
        transcoderPath: '/ktx2/',
        format: 'auto',
        quality: 'medium',
        compression: {
            method: 'auto',    // 'auto', 'etc1s', 'uastc'
            level: 'medium',   // 'fast', 'medium', 'slow'
            rdo: true,         // Rate Distortion Optimization
            rdoLevel: 1.0,     // 0.0-4.0
            mipmaps: true
        },
        targets: {
            webgl1: ['etc1', 'pvrtc'],
            webgl2: ['etc2', 'astc', 'bc7']
        }
    },

    presets: {
        highQuality: {
            quality: 'high',
            compression: {
                method: 'uastc',
                level: 'slow',
                rdo: true,
                rdoLevel: 2.0
            }
        },
        mediumQuality: {
            quality: 'medium',
            compression: {
                method: 'auto',
                level: 'medium',
                rdo: true,
                rdoLevel: 1.0
            }
        },
        fastCompression: {
            quality: 'low',
            compression: {
                method: 'etc1s',
                level: 'fast',
                rdo: false
            }
        }
    },

    validate(config) {
        const validQualities = ['low', 'medium', 'high'];
        const validMethods = ['auto', 'etc1s', 'uastc'];
        const validLevels = ['fast', 'medium', 'slow'];

        return {
            quality: validQualities.includes(config.quality) 
                ? config.quality 
                : 'medium',
            compression: {
                method: validMethods.includes(config.compression.method)
                    ? config.compression.method
                    : 'auto',
                level: validLevels.includes(config.compression.level)
                    ? config.compression.level
                    : 'medium',
                rdoLevel: Math.max(0, Math.min(4, config.compression.rdoLevel))
            }
        };
    }
};
