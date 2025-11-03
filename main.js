import "./style.css";
import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { TweakpaneManager } from "@gui/TweakpaneManager";
import { CameraManager } from "@managers/CameraManager";
import { CinematicRenderer } from "@renderers/CinematicRenderer";
import { CinematicCamera } from "@cameras/CinematicCamera";
import { HDRIEnvironment } from "@environments/HDRIEnvironment";
import { EnvPresets } from "@presets/EnvPresets";

const tweakpaneManager = new TweakpaneManager();

// Initialize Scene and Renderer
const scene = new THREE.Scene();
const canvas = document.querySelector("#webgl");

const renderer = new THREE.WebGLRenderer({
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

// Initialize CameraManager
const cameraManager = new CameraManager(renderer, canvas);

// Set the Cinematic Camera as the active camera
cameraManager.setActive("cinematic"); // 'cinematic' is the name given in CameraManager setup

// Extract the active camera and controls from CameraManager
const camera = cameraManager.activeCamera;
const controls = cameraManager.activeControls;

// Environment
const defaultPreset = EnvPresets.sataraNight;
const environment = new HDRIEnvironment({
  path: defaultPreset.path,
  ...defaultPreset.settings,
});

// Initialize Tweakpane Folders
const folderFog = tweakpaneManager.addFolder({ title: "Fog" });
const folderCamera = tweakpaneManager.addFolder({ title: "Camera" });
const folderRenderer = tweakpaneManager.addFolder({ title: "Renderer" });
const folderEnvironment = tweakpaneManager.addFolder({ title: "Environment" });

// Fog Settings
const fogParams = {
  color: 0x999999,
  density: 0.1,
};
folderFog.addBinding(fogParams, "color").on("change", ({ value }) => {
  scene.fog = new THREE.FogExp2(value, fogParams.density);
});
folderFog.addBinding(fogParams, "density").on("change", ({ value }) => {
  scene.fog.density = value;
});

// Camera Movement Settings
const cameraParams = {
  movement: false,
  shake: {
    intensity: 0.1,
    frequency: 0.1,
  },
};
folderCamera.addBinding(cameraParams, "movement");
folderCamera.addBinding(cameraParams.shake, "intensity");
folderCamera.addBinding(cameraParams.shake, "frequency");

// Renderer Settings
const rendererParams = {
  exposure: 1.0,
};
folderRenderer
  .addBinding(rendererParams, "exposure")
  .on("change", ({ value }) => {
    renderer.toneMappingExposure = value;
  });

// Environment Settings
const environmentParams = {
  intensity: 1.0,
};
folderEnvironment
  .addBinding(environmentParams, "intensity")
  .on("change", ({ value }) => {
    environment.debugObject.intensity = value;
    environment.updateFromDebug(scene, renderer);
  });

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

// Sample Mesh
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0x00ff00 }),
);
scene.add(mesh);

// Load Environment HDRI
environment
  .load(renderer)
  .then((envMap) => {
    scene.environment = envMap;
    scene.background = envMap;
    tweakpaneManager.refresh();
  })
  .catch((error) => {
    console.warn(
      "Failed to load HDRI, falling back to color background",
      error,
    );
    scene.background = new THREE.Color(0x666666);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    tweakpaneManager.refresh();
  });


// Set Initial Fog
scene.fog = new THREE.FogExp2(fogParams.color, fogParams.density);

// Stats
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  stats.begin();

  // Update controls
  controls.update();

  if (cameraParams.movement && cameraParams.shake) {
    const { intensity, frequency } = cameraParams.shake;
    const shakeX = Math.sin(Date.now() * frequency) * intensity;
    const shakeY = Math.sin(Date.now() * frequency * 1.1) * intensity;
    camera.position.x += shakeX;
    camera.position.y += shakeY;
  }

  renderer.render(scene, camera);
  stats.end();
}
animate();

// Resize Handling
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  tweakpaneManager.refresh();
});

// Cleanup
window.addEventListener("beforeunload", () => {
  tweakpaneManager.dispose();
  renderer.dispose();
});
