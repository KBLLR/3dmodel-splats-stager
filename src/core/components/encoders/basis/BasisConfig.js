/**
 * @file This file contains the configuration for the Basis Universal texture encoder.
 * It includes default settings, quality presets, and a validation function.
 * @module BasisConfig
 */

/**
 * @description Configuration object for the Basis Universal texture encoder.
 * Contains default settings, quality presets, and a validation function.
 */
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

    /**
     * Validates the given configuration object, ensuring values are within valid ranges.
     *
     * @param {object} config - The configuration object to validate.
     * @param {number} config.quality - The quality level to validate.
     * @param {string} config.format - The format to validate.
     * @returns {{quality: number, format: string}} A new object with the validated properties.
     */
    validate(config) {
        return {
            quality: Math.max(1, Math.min(255, config.quality)),
            format: ['auto', 'etc1s', 'uastc'].includes(config.format) 
                ? config.format 
                : 'auto'
        };
    }
};
