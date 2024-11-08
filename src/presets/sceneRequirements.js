export const SCENE_REQUIREMENTS = {
  NORMAL: {
    camera: {
      required: true,
      type: "cinematic",
      preset: "CINEMATIC",
      dof: {
        required: true,
        focus: "center",
        aperture: 0.1,
      },
    },
    model: {
      required: true,
      type: "glb",
    },
    environment: {
      required: true,
      types: ["skybox", "cubemap"],
      quantity: 1,
    },
    ground: {
      required: true,
      types: ["plane", "sphere"],
      infinite: true,
    },
    fog: {
      required: true,
      quantity: 2,
    },
    audio: {
      environment: {
        required: true,
        quantity: 1,
      },
      background: {
        required: false,
        quantity: 1,
      },
    },
    debugger: {
      defaultState: "disabled",
    },
  },
  LUMA_LABS: {
    camera: {
      required: true,
      type: "cinematic",
      preset: "WIDE_ANGLE",
      fov: "wide",
      dof: {
        required: true,
        focus: 10,
        aperture: 0.08,
      },
    },
    environment: {
      required: true,
      types: ["hdri", "skyshader", "lumaDefault"],
      quantity: 1,
    },
  },
};

export const SCENE_COMPATIBILITY = {
  NORMAL: {
    compatibleCameras: ["DEFAULT", "CINEMATIC", "DRAMATIC"],
    compatibleEnvironments: ["SKYBOX", "CUBEMAP"],
    compatibleAudio: ["CHURCH", "FOREST", "BASEMENT"],
    incompatibleEffects: ["VR", "AR"],
  },
  LUMA_LABS: {
    compatibleCameras: ["WIDE_ANGLE", "CINEMATIC"],
    compatibleEnvironments: ["HDRI", "SKY_SHADER", "LUMA_DEFAULT"],
    incompatibleEffects: ["PIXEL", "GLITCH"],
  },
};
