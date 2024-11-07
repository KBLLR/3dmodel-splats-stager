export const CAMERA_PRESETS = {
  DEFAULT: {
    name: "Default",
    focalLength: 35,
    fstop: 2.8,
    focusDistance: 20,
    bokehScale: 2,
    filmGrain: 0.5,
  },
  WIDE_SHOT: {
    name: "Wide Shot",
    focalLength: 24,
    fstop: 5.6,
    focusDistance: 50,
    bokehScale: 1,
    filmGrain: 0.3,
  },
  CLOSE_UP: {
    name: "Close Up",
    focalLength: 85,
    fstop: 1.4,
    focusDistance: 10,
    bokehScale: 3,
    filmGrain: 0.6,
  },
  PORTRAIT: {
    name: "Portrait",
    focalLength: 50,
    fstop: 1.8,
    focusDistance: 15,
    bokehScale: 2,
    filmGrain: 0.4,
  },
  DRAMATIC: {
    name: "Dramatic",
    focalLength: 35,
    fstop: 1.2,
    focusDistance: 30,
    bokehScale: 4,
    filmGrain: 0.7,
  },
  ARCHITECTURAL: {
    name: "Architectural",
    focalLength: 24,
    fstop: 8,
    focusDistance: 100,
    bokehScale: 0,
    filmGrain: 0.2,
    verticalAlignment: true,
  },
  MACRO: {
    name: "Macro",
    focalLength: 100,
    fstop: 2.8,
    focusDistance: 0.3,
    bokehScale: 4,
    filmGrain: 0.4,
    minimumFocusDistance: 0.2,
  },
  CINEMATIC_ANAMORPHIC: {
    name: "Anamorphic",
    focalLength: 35,
    fstop: 2.0,
    focusDistance: 25,
    bokehScale: 3,
    filmGrain: 0.5,
    anamorphicRatio: 2,
    lensFlare: true,
  },
  DRONE_SHOT: {
    name: "Drone",
    focalLength: 18,
    fstop: 4,
    focusDistance: 200,
    bokehScale: 1,
    filmGrain: 0.2,
    stabilization: true,
  },
  SECURITY_CAM: {
    name: "Security",
    focalLength: 28,
    fstop: 5.6,
    focusDistance: 30,
    bokehScale: 0,
    filmGrain: 0.8,
    nightVision: true,
    distortion: 0.2,
  },
  MICROSCOPE: {
    name: "Microscope",
    focalLength: 200,
    fstop: 16,
    focusDistance: 0.1,
    bokehScale: 5,
    filmGrain: 0.3,
    magnification: 100,
  },
};

export const CAMERA_MOVEMENT_PRESETS = {
  STATIC: {
    name: "Static",
    movement: false,
    stabilization: true,
  },
  HANDHELD: {
    name: "Handheld",
    movement: true,
    shake: {
      intensity: 0.1,
      frequency: 2,
    },
    stabilization: false,
  },
  CRANE: {
    name: "Crane",
    movement: true,
    path: "arc",
    speed: 0.5,
    smoothing: 0.9,
  },
  DOLLY: {
    name: "Dolly",
    movement: true,
    path: "linear",
    speed: 0.3,
    smoothing: 0.95,
  },
  ORBIT: {
    name: "Orbit",
    movement: true,
    path: "circular",
    speed: 0.2,
    radius: 10,
    height: 5,
  },
};

// Validation rules
export const validateCameraPreset = (preset) => {
  const required = ["focalLength", "fstop", "focusDistance"];
  const valid = required.every((prop) => preset.hasOwnProperty(prop));
  if (!valid) {
    throw new Error("Invalid camera preset: missing required properties");
  }
  return true;
};

// Compatibility rules
export const CAMERA_COMPATIBILITY = {
  SCENE_TYPE: {
    normal: ["DEFAULT", "WIDE_SHOT", "CLOSE_UP", "PORTRAIT"],
    lumaLabs: ["WIDE_SHOT", "CINEMATIC_ANAMORPHIC", "DRONE_SHOT"],
    specialEffect: ["DRAMATIC", "HORROR", "SECURITY_CAM"],
  },
  ENVIRONMENT: {
    dark: ["NOIR", "SECURITY_CAM", "DRAMATIC"],
    bright: ["DEFAULT", "PORTRAIT", "DRONE_SHOT"],
  },
};
