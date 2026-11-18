/**
 * Applies a cinematic camera preset: lens values from the preset, framing from
 * a staging map. Movement presets animate that framing.
 */

const STAGING = {
  DEFAULT: { position: [0, 1.4, 4.2], target: [0, 0.8, 0] },
  WIDE_SHOT: { position: [0, 1.8, 7.5], target: [0, 0.9, 0] },
  CLOSE_UP: { position: [0.35, 1.25, 2.1], target: [0, 1.15, 0] },
  PORTRAIT: { position: [0.2, 1.35, 3.2], target: [0, 1.1, 0] },
  DRAMATIC: { position: [-1.2, 1.1, 3.4], target: [0, 1, 0] },
  ARCHITECTURAL: { position: [0, 1.6, 9], target: [0, 1.4, 0] },
  MACRO: { position: [0.1, 1, 1.2], target: [0, 0.95, 0] },
  CINEMATIC_ANAMORPHIC: { position: [0.8, 1.5, 5], target: [0, 1, 0] },
  DRONE_SHOT: { position: [2.5, 6, 8], target: [0, 0.5, 0] },
  SECURITY_CAM: { position: [3.2, 2.4, 4], target: [0, 0.8, 0] },
  MICROSCOPE: { position: [0, 0.8, 0.8], target: [0, 0.7, 0] },
};

export function focalLengthToFov(focalLength, sensorHeight = 24) {
  const length = Number(focalLength) > 0 ? Number(focalLength) : 35;
  const fov = (2 * Math.atan(sensorHeight / (2 * length)) * 180) / Math.PI;
  return Math.min(100, Math.max(8, fov));
}

export function createCameraRig({ camera, controls }) {
  const state = {
    presetId: "DEFAULT",
    preset: null,
    movement: { movement: false },
    reduceMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  };

  function place(time = 0) {
    const staging = STAGING[state.presetId] ?? STAGING.DEFAULT;
    const [baseX, baseY, baseZ] = staging.position;
    const target = staging.target;
    const movement = state.movement || {};
    const animate = movement.movement && !state.reduceMotion;

    let x = baseX;
    let y = baseY;
    let z = baseZ;

    if (animate && movement.path === "circular") {
      const speed = movement.speed ?? 0.2;
      const radius = movement.radius ?? Math.hypot(baseX, baseZ);
      x = Math.cos(time * speed) * radius;
      z = Math.sin(time * speed) * radius;
      y = movement.height ?? baseY;
    } else if (animate && movement.path === "linear") {
      const dolly = 1 + Math.sin(time * (movement.speed ?? 0.3)) * 0.28;
      x = baseX * dolly;
      y = baseY;
      z = baseZ * dolly;
    } else if (animate && movement.path === "arc") {
      y = baseY + Math.sin(time * (movement.speed ?? 0.5)) * 1.1;
    } else if (animate && movement.shake) {
      const intensity = movement.shake.intensity ?? 0;
      const frequency = movement.shake.frequency ?? 1;
      x += Math.sin(time * frequency) * intensity;
      y += Math.sin(time * frequency * 1.1) * intensity * 0.6;
    }

    camera.position.set(x, y, z);
    controls.target.set(target[0], target[1], target[2]);
    camera.lookAt(target[0], target[1], target[2]);
    controls.enabled = !animate;
  }

  return {
    applyPreset(presetId, preset) {
      state.presetId = presetId;
      state.preset = preset;
      camera.fov = focalLengthToFov(preset.focalLength);
      camera.focus = preset.focusDistance;
      camera.aperture = Math.min(0.25, 0.45 / (preset.fstop || 2.8));
      if (camera.debugObject) {
        camera.debugObject.fov = camera.fov;
        camera.debugObject.dof = {
          focus: camera.focus,
          aperture: camera.aperture,
        };
      }
      camera.updateProjectionMatrix();
      place(0);
      controls.update();
    },
    applyMovement(movement) {
      state.movement = movement || { movement: false };
      place(0);
      controls.update();
    },
    update(time) {
      if (state.movement?.movement && !state.reduceMotion) {
        place(time);
      } else if (controls.enabled) {
        controls.update();
      }
    },
  };
}
