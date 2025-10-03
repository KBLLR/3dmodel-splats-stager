/**
 * @file This file serves as the central hub for all presets, exporting them for easy access
 * and defining a registry of preset types.
 * @module presets/index
 */

export * from './sceneRequirements';
export * from './sceneConfigs';
export * from './cameraPresets';

/**
 * @description A central registry of preset types, providing a consistent way to reference different categories of presets.
 * @type {Object.<string, string>}
 */
export const PRESET_REGISTRY = {
    CAMERA: 'camera',
    CAMERA_MOVEMENT: 'camera_movement',
    ENVIRONMENT: 'environment',
    LIGHTING: 'lighting',
    FOG: 'fog',
    AUDIO: 'audio',
    VISUAL: 'visual',
    EFFECTS: 'effects',
    MODELS: 'models',
    SCENES: 'scenes',
    WEATHER: 'weather',
    MATERIALS: 'materials'
};
