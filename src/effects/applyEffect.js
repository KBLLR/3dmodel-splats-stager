import * as THREE from "three";
import { PRESET_REGISTRY } from "@presets/index";
import { EFFECT_PRESETS } from "./effectPresets";

export async function applyEffect({ effectId, scene, renderer, grade, presetManager }) {
  const effect = EFFECT_PRESETS[effectId] ?? EFFECT_PRESETS.clean;
  renderer.toneMappingExposure = effect.exposure;

  if (renderer.debugObject) {
    renderer.debugObject.toneMappingExposure = effect.exposure;
    renderer.debugObject.vignette = {
      ...(renderer.debugObject.vignette || {}),
      enabled: effect.vignette > 0,
      darkness: effect.vignette,
    };
    renderer.debugObject.filmGrain = {
      ...(renderer.debugObject.filmGrain || {}),
      enabled: effect.grain > 0,
      intensity: effect.grain,
    };
  }

  if (grade) {
    grade.style.setProperty("--grade-vignette", String(effect.vignette));
    grade.style.setProperty("--grade-grain", String(effect.grain));
  }

  if (!effect.fog) {
    scene.fog = null;
    const color = new THREE.Color(effect.background);
    scene.background = color;
    renderer.setClearColor(color, 1);
    return effect;
  }

  const fogPreset = await presetManager.loadPreset(PRESET_REGISTRY.FOG, effect.fog);
  const color = new THREE.Color(fogPreset.color || effect.background);
  scene.fog = new THREE.FogExp2(color, effect.fogDensity);
  scene.background = color;
  renderer.setClearColor(color, 1);
  return effect;
}
