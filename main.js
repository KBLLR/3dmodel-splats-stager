import "./style.css";
import * as THREE from "three";
import { Pane } from "tweakpane";
import Stats from "stats.js";
import { CinematicRenderer } from "@renderers/CinematicRenderer";
import { CinematicCamera } from "@cameras/CinematicCamera";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { HDRIEnvironment } from "@components/environments/HDRIEnvironment";
import { FOG_PRESETS } from "@presets/fogPresets"; // Ensure path is correct
import { CAMERA_MOVEMENT_PRESETS } from "@presets/cameraPresets"; // Adjust the path if necessary

// Initialize Tweakpane
const pane = new Pane();

// Fog parameters with initial description
const fogParams = {
  enabled: true,
  preset: "SOFT_BLUE",
  color: FOG_PRESETS.SOFT_BLUE.color,
  density: FOG_PRESETS.SOFT_BLUE.density,
  description: FOG_PRESETS.SOFT_BLUE.description, // Initial description
};

// Fog controls within a folder
const fogFolder = pane.addFolder({ title: "Fog Controls" });

// Dropdown options for fog presets
const options = Object.fromEntries(
  Object.keys(FOG_PRESETS).map((key) => [key, key]),
);

// Enable/disable fog
fogFolder
  .addBinding(fogParams, "enabled", { label: "Enable Fog" })
  .on("change", ({ value }) => {
    scene.fog = value
      ? new THREE.FogExp2(fogParams.color, fogParams.density)
      : null;
  });

// Fog preset dropdown with description
fogFolder
  .addBinding(fogParams, "preset", {
    options: options,
    label: "Preset",
  })
  .on("change", ({ value }) => {
    const selectedPreset = FOG_PRESETS[value];
    fogParams.color = selectedPreset.color;
    fogParams.density = selectedPreset.density;
    fogParams.description = selectedPreset.description; // Update description
    if (scene.fog) {
      scene.fog.color.set(fogParams.color);
      scene.fog.density = fogParams.density;
    }
    pane.refresh(); // Refresh the pane to update description
  });

// Display the description of the selected fog preset
fogFolder.addBinding(fogParams, "description", {
  view: "text", // Set view to text for description
  label: "Description",
  readonly: true,
});

// Camera movement parameters with `shake` properties initially set to null
const movementParams = {
  preset: "STATIC",
  description: CAMERA_MOVEMENT_PRESETS.STATIC.name,
  movement: CAMERA_MOVEMENT_PRESETS.STATIC.movement,
  stabilization: CAMERA_MOVEMENT_PRESETS.STATIC.stabilization,
  shake: { intensity: null, frequency: null }, // Initialize shake properties
};

const movementFolder = pane.addFolder({ title: "Camera Movement" });

const movementOptions = Object.fromEntries(
  Object.keys(CAMERA_MOVEMENT_PRESETS).map((key) => [
    key,
    CAMERA_MOVEMENT_PRESETS[key].name,
  ]),
);

// Dynamic UI elements for `shake`
let shakeIntensityBinding = null;
let shakeFrequencyBinding = null;

// Update movement parameters based on preset selection
movementFolder
  .addBinding(movementParams, "preset", {
    options: movementOptions,
    label: "Movement Preset",
  })
  .on("change", ({ value }) => {
    const selectedPreset = CAMERA_MOVEMENT_PRESETS[value];

    // Update basic parameters
    movementParams.description = selectedPreset.name;
    movementParams.movement = selectedPreset.movement;
    movementParams.stabilization = selectedPreset.stabilization;
    movementParams.shake = selectedPreset.shake || {
      intensity: null,
      frequency: null,
    }; // Handle shake conditionally

    // Remove previous `shake` bindings if they exist
    if (shakeIntensityBinding) {
      movementFolder.remove(shakeIntensityBinding);
      shakeIntensityBinding = null;
    }
    if (shakeFrequencyBinding) {
      movementFolder.remove(shakeFrequencyBinding);
      shakeFrequencyBinding = null;
    }

    // Conditionally add `shake` controls if shake exists in the selected preset
    if (selectedPreset.shake) {
      shakeIntensityBinding = movementFolder.addBinding(
        movementParams.shake,
        "intensity",
        {
          label: "Shake Intensity",
          min: 0,
          max: 1,
        },
      );
      shakeFrequencyBinding = movementFolder.addBinding(
        movementParams.shake,
        "frequency",
        {
          label: "Shake Frequency",
          min: 0,
          max: 10,
        },
      );
    }

    pane.refresh(); // Refresh to apply changes
  });

// Add static bindings for non-conditional fields
movementFolder.addBinding(movementParams, "description", {
  view: "text",
  label: "Description",
  readonly: true,
});
movementFolder.addBinding(movementParams, "movement", { label: "Movement" });
movementFolder.addBinding(movementParams, "stabilization", {
  label: "Stabilization",
});

// Initialize Scene and Renderer
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

// Camera
const camera = new CinematicCamera({
  fov: 75,
  aspect: window.innerWidth / window.innerHeight,
  near: 0.1,
  far: 1000,
  position: { x: 0, y: 2, z: 5 },
});
scene.add(camera);

// Orbit Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePanning = true;

// Infinite Ground
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

// Environment
const environment = new HDRIEnvironment({
  path: "/src/assets/environmentMaps/hdr/placeholder.hdr",
  intensity: 1.0,
});
environment.load(renderer).then((envMap) => {
  scene.environment = envMap;
  scene.background = envMap;
});

// Fog Setup with Default Preset
// Set initial fog
scene.fog = new THREE.FogExp2(fogParams.color, fogParams.density);

// Stats
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  stats.begin();

  controls.update();
  renderer.render(scene, camera);

  stats.end();
}

animate();

// Handle resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
