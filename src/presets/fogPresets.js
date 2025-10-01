/**
 * @file This file contains a collection of presets for fog effects.
 * @module fogPresets
 */

/**
 * @description A collection of fog presets, each with a color, density, and description.
 * These can be used to quickly set atmospheric effects in a scene.
 * @type {Object.<string, {color: string|null, density: number, description: string}>}
 */
export const FOG_PRESETS = {
  NONE: {
    color: null,
    density: 0,
    description: "No fog effect",
  },
  SOFT_BLUE: {
    color: "#e0e1ff",
    density: 0.08,
    description: "Gentle, ethereal blue haze",
  },
  MORNING_MIST: {
    color: "#d4e1ff",
    density: 0.12,
    description: "Cool, crisp morning atmosphere",
  },
  WARM_DAWN: {
    color: "#fff1e6",
    density: 0.1,
    description: "Soft, warm morning light",
  },
  FOREST_HAZE: {
    color: "#e6ffe6",
    density: 0.15,
    description: "Misty forest atmosphere",
  },
  TWILIGHT_PURPLE: {
    color: "#f0e6ff",
    density: 0.13,
    description: "Mystical evening ambiance",
  },
  DEEP_BLUE: {
    color: "#2c3e50",
    density: 0.18,
    description: "Dense, mysterious darkness",
  },
  DARK_TEAL: {
    color: "#2d545e",
    density: 0.16,
    description: "Deep underwater feeling",
  },
  DARK_ATMOSPHERE: {
    color: "#1a1a1a",
    density: 0.2,
    description: "Heavy, oppressive darkness",
  },
  MIDNIGHT_BLUE: {
    color: "#34495e",
    density: 0.17,
    description: "Clear night sky atmosphere",
  },
  SUNSET_ORANGE: {
    color: "#ff9966",
    density: 0.11,
    description: "Warm sunset glow",
  },
  DRAMATIC_RED: {
    color: "#ff6b6b",
    density: 0.14,
    description: "Intense, passionate atmosphere",
  },
  BRIGHT_TEAL: {
    color: "#4ecdc4",
    density: 0.09,
    description: "Fresh, tropical feeling",
  },
  RICH_PURPLE: {
    color: "#9b59b6",
    density: 0.15,
    description: "Royal, luxurious atmosphere",
  },
  FULL_MOON: {
    color: "#C4C9D6",
    density: 0.12,
    description: "Clear, bright moonlit night",
  },
  BLUE_MOON: {
    color: "#A5B5D9",
    density: 0.14,
    description: "Rare, ethereal moonlight",
  },
  BLOOD_MOON: {
    color: "#8B0000",
    density: 0.16,
    description: "Ominous red moonlight",
  },
  GOLDEN_HOUR: {
    color: "#FFA500",
    density: 0.1,
    description: "Perfect photography lighting",
  },
  MAGIC_HOUR: {
    color: "#4B0082",
    density: 0.13,
    description: "Magical twilight moment",
  },
  DAWN: {
    color: "#FF7F50",
    density: 0.11,
    description: "Early morning light",
  },
  DUSK: {
    color: "#483D8B",
    density: 0.15,
    description: "Evening settling in",
  },
  MISTY_MOUNTAINS: {
    color: "#E6E6FA",
    density: 0.17,
    description: "High altitude fog",
  },
  DESERT_HEAT: {
    color: "#FFD700",
    density: 0.08,
    description: "Shimmering heat haze",
  },
  ARCTIC_CHILL: {
    color: "#F0FFFF",
    density: 0.14,
    description: "Crisp, cold atmosphere",
  },
  STORM_COMING: {
    color: "#4A4A4A",
    density: 0.19,
    description: "Threatening weather",
  },
  ETHEREAL: {
    color: "#DDA0DD",
    density: 0.12,
    description: "Dreamlike atmosphere",
  },
};
