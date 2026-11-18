/**
 * Presentation grades. Fog color comes from the fog presets. Vignette and grain
 * are overlays. Exposure is applied on the renderer. No splat is generated here.
 */
export const EFFECT_PRESETS = {
  clean: {
    name: "Clean",
    exposure: 1,
    fog: null,
    fogDensity: 0,
    vignette: 0,
    grain: 0,
    background: "#101114",
  },
  soft: {
    name: "Soft",
    exposure: 1.05,
    fog: "MORNING_MIST",
    fogDensity: 0.02,
    vignette: 0.28,
    grain: 0.07,
    background: "#17191f",
  },
  cinematic: {
    name: "Cinematic",
    exposure: 1.12,
    fog: "TWILIGHT_PURPLE",
    fogDensity: 0.035,
    vignette: 0.48,
    grain: 0.14,
    background: "#121018",
  },
  night: {
    name: "Night",
    exposure: 0.82,
    fog: "MIDNIGHT_BLUE",
    fogDensity: 0.045,
    vignette: 0.62,
    grain: 0.1,
    background: "#07080c",
  },
};

export function listEffects() {
  return Object.entries(EFFECT_PRESETS).map(([id, preset]) => ({
    id,
    name: preset.name,
  }));
}
