import * as THREE from "three";

export class PhysicalMaterial extends THREE.MeshPhysicalMaterial {
  constructor(params = {}) {
    const {
      color = 0xffffff,
      roughness = 0.5,
      metalness = 0.5,
      clearcoat = 0.0,
      clearcoatRoughness = 0.0,
      ior = 1.5,
      reflectivity = 0.5,
      sheen = 0.0,
      sheenRoughness = 0.0,
      sheenColor = 0x000000,
      specularIntensity = 1.0,
      specularColor = 0xffffff,
      transmission = 0.0,
      thickness = 0.0,
      attenuationDistance = Infinity,
      attenuationColor = 0xffffff,
      wireframe = false,
      transparent = false,
      opacity = 1,
    } = params;

    super({
      color,
      roughness,
      metalness,
      clearcoat,
      clearcoatRoughness,
      ior,
      reflectivity,
      sheen,
      sheenRoughness,
      sheenColor,
      specularIntensity,
      specularColor,
      transmission,
      thickness,
      attenuationDistance,
      attenuationColor,
      wireframe,
      transparent,
      opacity,
    });

    this.type = "physical";
    this.isCustomMaterial = true;

    this.debugObject = {
      color,
      roughness,
      metalness,
      clearcoat,
      clearcoatRoughness,
      ior,
      reflectivity,
      sheen,
      sheenRoughness,
      sheenColor,
      specularIntensity,
      specularColor,
      transmission,
      thickness,
      attenuationDistance,
      attenuationColor,
      wireframe,
      transparent,
      opacity,
    };
  }

  updateFromDebug() {
    Object.entries(this.debugObject).forEach(([key, value]) => {
      if (this[key] !== undefined) {
        if (
          ["color", "sheenColor", "specularColor", "attenuationColor"].includes(
            key,
          )
        ) {
          this[key].set(value);
        } else {
          this[key] = value;
        }
      }
    });
  }
}
