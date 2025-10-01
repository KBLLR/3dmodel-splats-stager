/**
 * @file This file contains the configuration for the KTX2 texture encoder.
 * It includes default settings, quality presets, and a validation function.
 * @module KTX2Config
 */

/**
 * @description Configuration object for the KTX2 texture encoder.
 * Contains default settings, quality presets, and a validation function.
 */
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

    /**
     * Validates the given KTX2 configuration, ensuring quality, method, and levels are valid.
     *
     * @param {object} config - The configuration object to validate.
     * @param {string} config.quality - The quality preset to validate.
     * @param {object} config.compression - The compression settings.
     * @param {string} config.compression.method - The compression method to validate.
     * @param {string} config.compression.level - The compression level to validate.
     * @param {number} config.compression.rdoLevel - The RDO level to validate.
     * @returns {object} A new object with the validated properties.
     */
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
