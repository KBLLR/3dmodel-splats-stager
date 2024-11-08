import { SCENE_REQUIREMENTS } from './sceneRequirements';

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

export const validateConfig = (config, type) => {
    const requirements = SCENE_REQUIREMENTS[type];
    if (!requirements) {
        throw new Error(`Unknown scene type: ${type}`);
    }
    return true;
};
