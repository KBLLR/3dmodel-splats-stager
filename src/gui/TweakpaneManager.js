import * as THREE from "three";
import { Pane } from "tweakpane";
import { FOG_PRESETS } from "@presets/fogPresets";
import { CAMERA_MOVEMENT_PRESETS } from "@presets/cameraPresets";
import { EnvPresets, getPresetsByCategory } from "@presets/EnvPresets";

export class TweakpaneManager {
  constructor() {
    this.pane = new Pane();
    this.bindings = new Map();
    this.folders = new Map();
  }

  // Backwards-compatible alias accepting either a name string or an options object
  addFolder(arg) {
    if (typeof arg === "string") {
      return this.createFolder(arg);
    }
    if (arg && typeof arg === "object") {
      const { title, ...options } = arg;
      return this.createFolder(title, options);
    }
    return this.createFolder(String(arg));
  }

  createFolder(name, options = {}) {
    const folder = this.pane.addFolder({ title: name, ...options });
    this.folders.set(name, folder);
    return folder;
  }

  createPresetBinding(folder, params, presetOptions, onChange) {
    const options = Object.fromEntries(
      Object.keys(presetOptions).map((key) => [key, key]),
    );

    return folder
      .addBinding(params, "preset", {
        options,
        label: "Preset",
      })
      .on("change", onChange);
  }

  setupFogControls(scene) {
    const fogParams = {
      enabled: true,
      preset: "SOFT_BLUE",
      color: FOG_PRESETS.SOFT_BLUE.color,
      density: FOG_PRESETS.SOFT_BLUE.density,
      description: FOG_PRESETS.SOFT_BLUE.description,
    };

    const fogFolder = this.createFolder("Fog Controls");

    // Enable/disable fog
    fogFolder
      .addBinding(fogParams, "enabled", {
        label: "Enable Fog",
      })
      .on("change", ({ value }) => {
        scene.fog = value
          ? new THREE.FogExp2(fogParams.color, fogParams.density)
          : null;
      });

    // Preset selector
    this.createPresetBinding(fogFolder, fogParams, FOG_PRESETS, ({ value }) => {
      const selectedPreset = FOG_PRESETS[value];
      fogParams.color = selectedPreset.color;
      fogParams.density = selectedPreset.density;
      fogParams.description = selectedPreset.description;

      if (scene.fog) {
        scene.fog.color.set(fogParams.color);
        scene.fog.density = fogParams.density;
      }
      this.pane.refresh();
    });

    // Description
    fogFolder.addBinding(fogParams, "description", {
      view: "text",
      label: "Description",
      readonly: true,
    });

    return fogParams;
  }

  setupRendererControls(renderer) {
    const rendererFolder = this.createFolder("Renderer");

    const rendererParams = {
      toneMapping: "ACESFilmic",
      toneMappingExposure: 1.0,
      colorSpace: "sRGB",
      shadowMapType: "PCFSoft",
    };

    // Tone Mapping
    rendererFolder
      .addBinding(rendererParams, "toneMapping", {
        options: {
          None: "None",
          Linear: "Linear",
          Reinhard: "Reinhard",
          Cineon: "Cineon",
          ACESFilmic: "ACESFilmic",
        },
      })
      .on("change", ({ value }) => {
        const toneMappingTypes = {
          None: THREE.NoToneMapping,
          Linear: THREE.LinearToneMapping,
          Reinhard: THREE.ReinhardToneMapping,
          Cineon: THREE.CineonToneMapping,
          ACESFilmic: THREE.ACESFilmicToneMapping,
        };
        renderer.toneMapping = toneMappingTypes[value];
      });

    // Exposure
    rendererFolder
      .addBinding(rendererParams, "toneMappingExposure", {
        min: 0,
        max: 2,
        step: 0.01,
      })
      .on("change", ({ value }) => {
        renderer.toneMappingExposure = value;
      });

    // Color Space
    rendererFolder
      .addBinding(rendererParams, "colorSpace", {
        options: {
          Linear: "Linear",
          sRGB: "sRGB",
        },
      })
      .on("change", ({ value }) => {
        const colorSpaces = {
          Linear: THREE.LinearSRGBColorSpace,
          sRGB: THREE.SRGBColorSpace,
        };
        renderer.outputColorSpace = colorSpaces[value];
      });

    // Shadow Map Type
    rendererFolder
      .addBinding(rendererParams, "shadowMapType", {
        options: {
          Basic: "Basic",
          PCF: "PCF",
          PCFSoft: "PCFSoft",
          VSM: "VSM",
        },
      })
      .on("change", ({ value }) => {
        const shadowMapTypes = {
          Basic: THREE.BasicShadowMap,
          PCF: THREE.PCFShadowMap,
          PCFSoft: THREE.PCFSoftShadowMap,
          VSM: THREE.VSMShadowMap,
        };
        renderer.shadowMap.type = shadowMapTypes[value];
        renderer.shadowMap.needsUpdate = true;
      });

    return rendererParams;
  }

  setupEnvironmentControls(environment, scene, renderer) {
    const envFolder = this.createFolder("Environment");

    // Create category tabs
    const categories = [
      "sunset",
      "night",
      "puresky",
      "urban",
      "studio",
      "stylized",
    ];
    const tabPages = envFolder.addTab({
      pages: categories.map((cat) => ({
        title: cat.charAt(0).toUpperCase() + cat.slice(1),
      })),
    });

    // Environment params
    const envParams = {
      currentPreset: null,
      intensity: environment.debugObject.intensity,
      blur: environment.debugObject.blur,
      rotation: environment.debugObject.rotation,
      backgroundEnabled: true,
    };

    // Add presets to each category tab
    categories.forEach((category, index) => {
      const categoryPresets = getPresetsByCategory(category);
      const page = tabPages.pages[index];

      // Skip empty categories
      if (Object.keys(categoryPresets).length === 0) return;

      // Preset selector for this category
      page
        .addBinding({ preset: Object.keys(categoryPresets)[0] }, "preset", {
          options: Object.fromEntries(
            Object.entries(categoryPresets).map(([key, preset]) => [
              preset.name,
              key,
            ]),
          ),
          label: "Environment",
        })
        .on("change", async (ev) => {
          const preset = EnvPresets[ev.value];
          envParams.currentPreset = preset;

          // Update environment parameters
          Object.assign(environment.debugObject, {
            path: preset.path,
            ...preset.settings,
          });

          // Load new environment
          const newEnvMap = await environment.load(renderer);
          if (newEnvMap) {
            scene.environment = newEnvMap;
            if (envParams.backgroundEnabled) {
              scene.background = newEnvMap;
              scene.backgroundBlurriness = environment.debugObject.blur;
            }
          }
        });
    });

    // Add common controls
    const controls = envFolder.addFolder({ title: "Adjustments" });

    // Intensity control
    controls
      .addBinding(environment.debugObject, "intensity", {
        min: 0,
        max: 2,
        step: 0.05,
        label: "Intensity",
      })
      .on("change", () => environment.updateFromDebug(scene));

    // Blur control
    controls
      .addBinding(environment.debugObject, "blur", {
        min: 0,
        max: 1,
        step: 0.01,
        label: "Background Blur",
      })
      .on("change", () => {
        if (scene.background === environment.envMap) {
          scene.backgroundBlurriness = environment.debugObject.blur;
        }
      });

    // Rotation control
    controls
      .addBinding(environment.debugObject, "rotation", {
        min: -Math.PI,
        max: Math.PI,
        step: 0.1,
        label: "Rotation",
      })
      .on("change", () => environment.updateFromDebug(scene));

    // Background toggle
    controls
      .addBinding(envParams, "backgroundEnabled", {
        label: "Show Background",
      })
      .on("change", ({ value }) => {
        scene.background = value ? environment.envMap : null;
      });

    // Quick mood presets
    const moodPresets = {
      bright: {
        intensity: 1.2,
        blur: 0,
        rotation: 0,
      },
      moody: {
        intensity: 0.8,
        blur: 0.2,
        rotation: Math.PI,
      },
      dramatic: {
        intensity: 1.4,
        blur: 0.1,
        rotation: Math.PI * 0.5,
      },
    };

    controls
      .addBinding({ mood: "bright" }, "mood", {
        options: {
          Bright: "bright",
          Moody: "moody",
          Dramatic: "dramatic",
        },
        label: "Quick Mood",
      })
      .on("change", (ev) => {
        const preset = moodPresets[ev.value];
        Object.assign(environment.debugObject, preset);
        environment.updateFromDebug(scene);
        if (scene.background === environment.envMap) {
          scene.backgroundBlurriness = preset.blur;
        }
      });

    return envParams;
  }

  setupCameraMovement() {
    const movementParams = {
      preset: "STATIC",
      description: CAMERA_MOVEMENT_PRESETS.STATIC.name,
      movement: CAMERA_MOVEMENT_PRESETS.STATIC.movement,
      stabilization: CAMERA_MOVEMENT_PRESETS.STATIC.stabilization,
      shake: { intensity: null, frequency: null },
    };

    const movementFolder = this.createFolder("Camera Movement");

    // Movement Preset Selector
    this.createPresetBinding(
      movementFolder,
      movementParams,
      CAMERA_MOVEMENT_PRESETS,
      ({ value }) => {
        const selectedPreset = CAMERA_MOVEMENT_PRESETS[value];
        movementParams.movement = selectedPreset.movement;
        movementParams.stabilization = selectedPreset.stabilization;
        movementParams.description = selectedPreset.name;
      },
    );

    return movementParams;
  }

  refresh() {
    this.pane.refresh();
  }

  dispose() {
    this.pane.dispose();
  }
}
