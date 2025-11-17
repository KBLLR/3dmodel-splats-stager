/**
 * @file This file contains preset configurations for different types of scenes.
 * @module sceneConfigs
 */

import { SCENE_REQUIREMENTS } from './sceneRequirements';

/**
 * @description A collection of preset configurations for various scenes, detailing camera, environment, fog, and other settings.
 * @type {Object.<string, object>}
 */
export const SCENE_CONFIGS = {
    GALLERY: {
        type: 'NORMAL',
        camera: {
            type: 'cinematic',
            preset: 'CINEMATIC',
            dof: {
                required: true,
                focus: 'center',
                aperture: 0.1
            }
        },
        environment: {
            type: 'skybox',
            preset: 'ART_GALLERY'
        },
        ground: {
            type: 'plane',
            material: 'REFLECTIVE'
        },
        fog: {
            type: 'EXP2',
            density: 0.02,
            color: '#ffffff'
        },
        audio: {
            environment: 'ir-room.wav',
            background: 'murmur.mp3'
        }
    },
    LUMA_CITY: {
        type: 'LUMA_LABS',
        camera: {
            type: 'cinematic',
            preset: 'WIDE_ANGLE',
            fov: 'wide',
            dof: {
                required: true,
                focus: 10,
                aperture: 0.08
            }
        },
        environment: {
            type: 'hdri',
            preset: 'CITY_SUNSET'
        }
    }
};

/**
 * @description Validates a scene configuration against its required properties.
 * @param {object} config - The scene configuration object to validate.
 * @param {string} type - The type of the scene, used to look up requirements.
 * @returns {boolean} True if the configuration is valid.
 * @throws {Error} If the scene type is unknown.
 */
export const validateConfig = (config, type) => {
    const requirements = SCENE_REQUIREMENTS[type];
    if (!requirements) {
        throw new Error(`Unknown scene type: ${type}`);
    }
    // Note: Actual validation logic against requirements is not implemented here.
    return true;
};
