export const BasisConfig = {
    defaults: {
        transcoderPath: '/basis/',
        format: 'auto',
        quality: 128,
        compression: {
            mode: 'default',  // 'default', 'fast', or 'high'
            quality: 128,     // 1-255
            uastc: false,     // Use UASTC for higher quality
            mipmaps: true,
            powerOfTwo: true,
            flipY: false
        },
        targets: {
            android: 'etc1s',
            ios: 'pvrtc',
            desktop: 'bc7'
        }
    },

    presets: {
        highQuality: {
            quality: 255,
            compression: {
                mode: 'high',
                uastc: true
            }
        },
        mediumQuality: {
            quality: 128,
            compression: {
                mode: 'default',
                uastc: false
            }
        },
        fastCompression: {
            quality: 75,
            compression: {
                mode: 'fast',
                uastc: false
            }
        }
    },

    validate(config) {
        return {
            quality: Math.max(1, Math.min(255, config.quality)),
            format: ['auto', 'etc1s', 'uastc'].includes(config.format) 
                ? config.format 
                : 'auto'
        };
    }
};
