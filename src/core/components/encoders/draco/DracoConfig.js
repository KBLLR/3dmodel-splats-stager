/**
 * @file This file contains the configuration for the Draco mesh compression encoder.
 * It includes default settings, quality presets, and a validation function.
 * @module DracoConfig
 */

/**
 * @description Configuration object for the Draco mesh compression encoder.
 * Contains default settings, quality presets, and a validation function.
 */
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

    /**
     * Validates the given Draco configuration, ensuring quantization and compression levels are within valid ranges.
     *
     * @param {object} config - The configuration object to validate.
     * @param {object} config.quantization - The quantization settings.
     * @param {number} config.quantization.position - Position quantization.
     * @param {number} config.quantization.normal - Normal quantization.
     * @param {number} config.quantization.color - Color quantization.
     * @param {number} config.quantization.uv - UV quantization.
     * @param {object} config.compression - The compression settings.
     * @param {number} config.compression.level - The compression level.
     * @returns {object} A new object with the validated properties.
     */
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
