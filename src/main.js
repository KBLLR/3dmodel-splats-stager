/**
 * @file This is the main entry point for the 3D Model Splats Stager application.
 * It sets up the Three.js scene, renderer, camera, and controls.
 * It also initializes the UI for controlling fog and camera movement.
 *
 * @module main
 */
import "./style.css";
import * as THREE from "three";
import { Pane } from "tweakpane";
import Stats from "stats.js";
import { CinematicRenderer } from "@renderers/CinematicRenderer";
import { CinematicCamera } from "./core/cameras/CinematicCamera";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { HDRIEnvironment } from "@components/environments/HDRIEnvironment";
import { PresetManager } from "@core/PresetManager";
import { PRESET_REGISTRY } from "@presets/index";

const pane = new Pane();
const presetManager = new PresetManager();

const fogParams = {
  enabled: true,
  preset: "SOFT_BLUE",
  color: 0, // Initial value
  density: 0, // Initial value
  description: "", // Initial value
};

const movementParams = {
  preset: "STATIC",
  description: "",
  movement: false,
  stabilization: true,
  shake: { intensity: null, frequency: null },
};

async function setupUI() {
  // Fog Controls
  const fogFolder = pane.addFolder({ title: "Fog Controls" });
  const fogPresetNames = await presetManager.getPresetNames(PRESET_REGISTRY.FOG);
  const fogOptions = Object.fromEntries(fogPresetNames.map((key) => [key, key]));

  const initialFogPreset = await presetManager.loadPreset(
    PRESET_REGISTRY.FOG,
    fogParams.preset,
  );
  fogParams.color = initialFogPreset.color;
  fogParams.density = initialFogPreset.density;
  fogParams.description = initialFogPreset.description;

  fogFolder.addBinding(fogParams, "enabled", { label: "Enable Fog" }).on("change", ({ value }) => {
    scene.fog = value ? new THREE.FogExp2(fogParams.color, fogParams.density) : null;
  });

  fogFolder
    .addBinding(fogParams, "preset", { options: fogOptions, label: "Preset" })
    .on("change", async ({ value }) => {
      const selectedPreset = await presetManager.loadPreset(PRESET_REGISTRY.FOG, value);
      fogParams.color = selectedPreset.color;
      fogParams.density = selectedPreset.density;
      fogParams.description = selectedPreset.description;
      if (scene.fog) {
        scene.fog.color.set(fogParams.color);
        scene.fog.density = fogParams.density;
      }
      pane.refresh();
    });

  fogFolder.addBinding(fogParams, "description", {
    view: "text",
    label: "Description",
    readonly: true,
  });

  // Camera Movement Controls
  const movementFolder = pane.addFolder({ title: "Camera Movement" });
  const movementPresetNames = await presetManager.getPresetNames(
    PRESET_REGISTRY.CAMERA_MOVEMENT,
  );
  const movementOptions = Object.fromEntries(
    movementPresetNames.map((key) => [key, key]),
  );

  const initialMovementPreset = await presetManager.loadPreset(
    PRESET_REGISTRY.CAMERA_MOVEMENT,
    movementParams.preset,
  );
  movementParams.description = initialMovementPreset.name;
  movementParams.movement = initialMovementPreset.movement;
  movementParams.stabilization = initialMovementPreset.stabilization;

  let shakeIntensityBinding = null;
  let shakeFrequencyBinding = null;

  movementFolder
    .addBinding(movementParams, "preset", {
      options: movementOptions,
      label: "Movement Preset",
    })
    .on("change", async ({ value }) => {
      const selectedPreset = await presetManager.loadPreset(
        PRESET_REGISTRY.CAMERA_MOVEMENT,
        value,
      );

      movementParams.description = selectedPreset.name;
      movementParams.movement = selectedPreset.movement;
      movementParams.stabilization = selectedPreset.stabilization;
      movementParams.shake = selectedPreset.shake || { intensity: null, frequency: null };

      if (shakeIntensityBinding) movementFolder.remove(shakeIntensityBinding);
      if (shakeFrequencyBinding) movementFolder.remove(shakeFrequencyBinding);
      shakeIntensityBinding = null;
      shakeFrequencyBinding = null;

      if (selectedPreset.shake) {
        shakeIntensityBinding = movementFolder.addBinding(movementParams.shake, "intensity", {
          label: "Shake Intensity",
          min: 0,
          max: 1,
        });
        shakeFrequencyBinding = movementFolder.addBinding(movementParams.shake, "frequency", {
          label: "Shake Frequency",
          min: 0,
          max: 10,
        });
      }
      pane.refresh();
    });

  movementFolder.addBinding(movementParams, "description", {
    view: "text",
    label: "Description",
    readonly: true,
  });
  movementFolder.addBinding(movementParams, "movement", { label: "Movement" });
  movementFolder.addBinding(movementParams, "stabilization", { label: "Stabilization" });

  pane.refresh();
}

/**
 * @description Initialize Scene and Renderer.
 * @type {THREE.Scene}
 */
const scene = new THREE.Scene();
const canvas = document.querySelector("#webgl");
const renderer = new CinematicRenderer({
  canvas,
  antialias: true,
  alpha: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * @description The main camera for the scene.
 * @type {CinematicCamera}
 */
const camera = new CinematicCamera({
  fov: 75,
  aspect: window.innerWidth / window.innerHeight,
  near: 0.1,
  far: 1000,
  position: { x: 0, y: 2, z: 5 },
});
scene.add(camera);

/**
 * @description Orbit controls for camera manipulation.
 * @type {OrbitControls}
 */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePanning = true;

/**
 * @description An infinite ground plane.
 * @type {THREE.Mesh}
 */
const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x999999,
  roughness: 0.8,
  metalness: 0.2,
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

/**
 * @description The HDRI environment for the scene.
 * @type {HDRIEnvironment}
 */
const environment = new HDRIEnvironment({
  path: "/src/assets/environmentMaps/hdr/placeholder.hdr",
  intensity: 1.0,
});
environment.load(renderer).then((envMap) => {
  scene.environment = envMap;
  scene.background = envMap;
});

/**
 * @description Fog setup with a default preset.
 */
scene.fog = new THREE.FogExp2(fogParams.color, fogParams.density);

/**
 * @description Performance statistics panel.
 * @type {Stats}
 */
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

/**
 * @description The main animation loop.
 */
function animate() {
  requestAnimationFrame(animate);
  stats.begin();

  controls.update();
  renderer.render(scene, camera);

  stats.end();
}

setupUI().then(() => {
  scene.fog = new THREE.FogExp2(fogParams.color, fogParams.density);
  animate();
});

/**
 * @description Handles window resize events.
 */
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
