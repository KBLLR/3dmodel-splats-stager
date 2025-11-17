export const EnvPresets = {
  // Sunset/Dusk Environments
  pointeSunset03: {
    name: "Pointe Sunset Warm",
    path: "/environmentMaps/hdr/T_HDR360_Pointe_Sunset_03.hdr",
    settings: {
      intensity: 1.2,
      backgroundBlur: 0,
      environmentBlur: 0,
      sunIntensity: 0.8,
      ambientIntensity: 1.0,
      backgroundEnabled: true,
    },
    category: "sunset",
  },
  pointeSunset08: {
    name: "Pointe Sunset Cool",
    path: "/environmentMaps/hdr/T_HDR360_Pointe_Sunset_08.hdr",
    settings: {
      intensity: 1.1,
      backgroundBlur: 0,
      environmentBlur: 0,
      sunIntensity: 0.7,
      ambientIntensity: 0.9,
      backgroundEnabled: true,
    },
    category: "sunset",
  },

  // Night Environments
  sataraNight: {
    name: "Satara Night",
    path: "/environmentMaps/hdr/satara_night_no_lamps_2k.hdr",
    settings: {
      intensity: 0.8,
      backgroundBlur: 0.1,
      environmentBlur: 0.05,
      sunIntensity: 0.2,
      ambientIntensity: 0.8,
      backgroundEnabled: true,
    },
    category: "night",
  },
  blaubeurenNight: {
    name: "Blaubeuren Night",
    path: "/environmentMaps/hdr/blaubeuren_night_2k.hdr",
    settings: {
      intensity: 0.7,
      backgroundBlur: 0,
      environmentBlur: 0,
      sunIntensity: 0.1,
      ambientIntensity: 0.9,
      backgroundEnabled: true,
    },
    category: "night",
  },
  nightBridge: {
    name: "Night Bridge",
    path: "/environmentMaps/hdr/night_bridge_2k.hdr",
    settings: {
      intensity: 0.9,
      backgroundBlur: 0.05,
      environmentBlur: 0,
      sunIntensity: 0.3,
      ambientIntensity: 0.8,
      backgroundEnabled: true,
    },
    category: "night",
  },

  // Pure Sky Environments
  autumnField: {
    name: "Autumn Field Sky",
    path: "/environmentMaps/hdr/autumn_field_puresky_2k.hdr",
    settings: {
      intensity: 1.3,
      backgroundBlur: 0,
      environmentBlur: 0,
      sunIntensity: 1.0,
      ambientIntensity: 1.0,
      backgroundEnabled: true,
    },
    category: "puresky",
  },
  kloppenheim: {
    name: "Kloppenheim Sky",
    path: "/environmentMaps/hdr/kloppenheim_02_puresky_2k.hdr",
    settings: {
      intensity: 1.2,
      backgroundBlur: 0,
      environmentBlur: 0,
      sunIntensity: 1.1,
      ambientIntensity: 0.9,
      backgroundEnabled: true,
    },
    category: "puresky",
  },

  // Urban/City Environments
  shanghaiBund: {
    name: "Shanghai Bund",
    path: "/environmentMaps/hdr/shanghai_bund_2k.hdr",
    settings: {
      intensity: 1.1,
      backgroundBlur: 0.1,
      environmentBlur: 0.05,
      sunIntensity: 0.4,
      ambientIntensity: 0.9,
      backgroundEnabled: true,
    },
    category: "urban",
  },
  neoTokyo: {
    name: "Neo Tokyo",
    path: "/environmentMaps/hdr/neo_tokyo.hdr",
    settings: {
      intensity: 1.2,
      backgroundBlur: 0.15,
      environmentBlur: 0.1,
      sunIntensity: 0.3,
      ambientIntensity: 1.0,
      backgroundEnabled: true,
    },
    category: "urban",
  },

  // Studio/Indoor Environments
  softbox: {
    name: "Softbox Studio",
    path: "/environmentMaps/hdr/softbox.hdr",
    settings: {
      intensity: 1.0,
      backgroundBlur: 0,
      environmentBlur: 0,
      sunIntensity: 0.2,
      ambientIntensity: 1.2,
      backgroundEnabled: false,
    },
    category: "studio",
  },
  creepyBathroom: {
    name: "Creepy Bathroom",
    path: "/environmentMaps/hdr/creepy_bathroom_2k.hdr",
    settings: {
      intensity: 0.8,
      backgroundBlur: 0.2,
      environmentBlur: 0.1,
      sunIntensity: 0.1,
      ambientIntensity: 0.7,
      backgroundEnabled: true,
    },
    category: "indoor",
  },

  // Stylized
  grungePop: {
    name: "Grunge Pop",
    path: "/environmentMaps/hdr/grunge_pop.hdr",
    settings: {
      intensity: 1.4,
      backgroundBlur: 0,
      environmentBlur: 0,
      sunIntensity: 0.6,
      ambientIntensity: 1.1,
      backgroundEnabled: true,
    },
    category: "stylized",
  },
  comic: {
    name: "Comic Style",
    path: "/environmentMaps/hdr/comic.hdr",
    settings: {
      intensity: 1.3,
      backgroundBlur: 0,
      environmentBlur: 0,
      sunIntensity: 0.8,
      ambientIntensity: 1.0,
      backgroundEnabled: true,
    },
    category: "stylized",
  },
};
export const getPresetsByCategory = (category) => {
  return Object.entries(EnvPresets)
    .filter(([, preset]) => preset.category === category)
    .reduce((acc, [key, preset]) => ({ ...acc, [key]: preset }), {});
};

export const categories = [
  { id: "sunset", label: "Sunset" },
  { id: "night", label: "Night" },
  { id: "puresky", label: "Pure Sky" },
  { id: "urban", label: "Urban" },
  { id: "studio", label: "Studio" },
  { id: "stylized", label: "Stylized" },
];
