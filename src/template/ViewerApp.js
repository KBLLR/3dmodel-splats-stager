import * as THREE from "three";
import Stats from "stats.js";
import { LumaRenderer } from "@renderers/LumaRenderer";
import { CinematicCamera } from "@cameras/CinematicCamera";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PresetManager } from "@core/PresetManager";
import { PRESET_REGISTRY } from "@presets/index";
import { disposeSplatLoaders, loadSplatSource } from "@splats/SplatSource";
import { listEffects } from "@effects/effectPresets";
import { applyEffect } from "@effects/applyEffect";
import { createCameraRig } from "./cameraRig";
import { COMPOSITIONS, renderComposition } from "./compositions/index";

async function loadNamedPresets(presetManager, type) {
  const names = await presetManager.getPresetNames(type);
  return Promise.all(
    names.map(async (id) => {
      const preset = await presetManager.loadPreset(type, id);
      return { id, name: preset.name || id, preset };
    }),
  );
}

export class ViewerApp {
  constructor({ canvas, uiRoot, grade }) {
    this.canvas = canvas;
    this.uiRoot = uiRoot;
    this.grade = grade;
    this.presetManager = new PresetManager();
    this.subject = new THREE.Group();
    this.subject.name = "splat-subject";
    this.requestId = 0;
    this.currentRelease = null;
    this.disposed = false;

    this.state = {
      splats: [],
      active: null,
      compositionId: "studio",
      compositions: COMPOSITIONS.map(({ id, label }) => ({ id, label })),
      cameras: [],
      cameraId: "WIDE_SHOT",
      movements: [],
      movementId: "STATIC",
      effects: listEffects(),
      effectId: "cinematic",
      statusMessage: "Loading template…",
    };
  }

  async start() {
    if (!this.canvas || !this.uiRoot) {
      throw new Error("Splat template is missing its canvas or UI root");
    }

    this.scene = new THREE.Scene();
    this.renderer = new LumaRenderer({
      canvas: this.canvas,
      antialias: false,
      alpha: false,
    });
    this.camera = new CinematicCamera({
      fov: 50,
      aspect: window.innerWidth / window.innerHeight,
      near: 0.1,
      far: 1000,
      position: { x: 0, y: 1.8, z: 7.5 },
    });
    this.scene.add(this.camera);
    this.scene.add(this.subject);
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.15);
    keyLight.position.set(4, 8, 6);
    this.scene.add(keyLight);

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.enablePan = true;
    this.rig = createCameraRig({ camera: this.camera, controls: this.controls });

    this.stats = new Stats();
    this.stats.showPanel(0);
    this.stats.dom.classList.add("stats-panel");
    document.body.appendChild(this.stats.dom);

    this.uiRoot.addEventListener("click", (event) => this.onClick(event));
    this.uiRoot.addEventListener("change", (event) => this.onChange(event));
    window.addEventListener("resize", () => this.onResize());
    window.addEventListener("beforeunload", () => this.dispose());

    const [splats, cameras, movements] = await Promise.all([
      loadNamedPresets(this.presetManager, PRESET_REGISTRY.MODELS),
      loadNamedPresets(this.presetManager, PRESET_REGISTRY.CAMERA),
      loadNamedPresets(this.presetManager, PRESET_REGISTRY.CAMERA_MOVEMENT),
    ]);

    this.state.splats = splats.map((entry) => entry.preset);
    this.state.cameras = cameras.map(({ id, name }) => ({ id, name }));
    this.state.movements = movements.map(({ id, name }) => ({ id, name }));
    this.cameraPresets = new Map(cameras.map((entry) => [entry.id, entry.preset]));
    this.movementPresets = new Map(movements.map((entry) => [entry.id, entry.preset]));

    const initial = this.state.splats.find((record) => record.demo) ?? this.state.splats[0];
    this.clock = new THREE.Clock();
    this.animate();
    if (initial) {
      await this.selectSplat(initial.id);
    } else {
      this.state.statusMessage = "No splat records found.";
      this.render();
    }
  }

  animate() {
    if (this.disposed) return;
    this.frame = requestAnimationFrame(() => this.animate());
    this.stats.begin();
    this.rig.update(this.clock.getElapsedTime());
    this.renderer.render(this.scene, this.camera);
    this.stats.end();
  }

  render() {
    this.uiRoot.dataset.composition = this.state.compositionId;
    this.uiRoot.innerHTML = renderComposition(this.state.compositionId, this.state);
    if (this.state.active) {
      document.title = `${this.state.active.title} · Splat Template`;
    }
  }

  async selectSplat(id) {
    const record = this.state.splats.find((splat) => splat.id === id);
    if (!record) return;
    const token = ++this.requestId;
    this.state.active = record;
    this.state.cameraId = this.cameraPresets.has(record.defaultCamera) ? record.defaultCamera : "WIDE_SHOT";
    this.state.movementId = this.movementPresets.has(record.defaultMovement) ? record.defaultMovement : "STATIC";
    this.state.effectId = this.state.effects.some((effect) => effect.id === record.defaultEffect)
      ? record.defaultEffect
      : "clean";
    this.state.statusMessage = "Loading source…";
    this.render();
    await this.applyLook();
    if (token !== this.requestId) return;

    try {
      const loaded = await loadSplatSource(record);
      if (token !== this.requestId) {
        loaded.release();
        return;
      }
      this.clearSubject();
      this.subject.add(loaded.object);
      this.currentRelease = loaded.release;
      this.state.statusMessage = "";
    } catch (error) {
      if (token !== this.requestId) return;
      console.error("Splat source failed to load", error);
      this.clearSubject();
      this.state.statusMessage = "The source did not load. Metadata is still available.";
    }
    this.render();
  }

  async applyLook() {
    const cameraPreset = this.cameraPresets.get(this.state.cameraId);
    const movementPreset = this.movementPresets.get(this.state.movementId);
    if (cameraPreset) this.rig.applyPreset(this.state.cameraId, cameraPreset);
    if (movementPreset) this.rig.applyMovement(movementPreset);
    await applyEffect({
      effectId: this.state.effectId,
      scene: this.scene,
      renderer: this.renderer,
      grade: this.grade,
      presetManager: this.presetManager,
    });
  }

  async selectCamera(id) {
    if (!this.cameraPresets.has(id)) return;
    this.state.cameraId = id;
    this.rig.applyPreset(id, this.cameraPresets.get(id));
    const movement = this.movementPresets.get(this.state.movementId);
    if (movement) this.rig.applyMovement(movement);
    this.render();
  }

  selectMovement(id) {
    if (!this.movementPresets.has(id)) return;
    this.state.movementId = id;
    this.rig.applyMovement(this.movementPresets.get(id));
    this.render();
  }

  async selectEffect(id) {
    this.state.effectId = id;
    await applyEffect({
      effectId: id,
      scene: this.scene,
      renderer: this.renderer,
      grade: this.grade,
      presetManager: this.presetManager,
    });
    this.render();
  }

  selectComposition(id) {
    if (!COMPOSITIONS.some((composition) => composition.id === id)) return;
    this.state.compositionId = id;
    this.render();
  }

  onClick(event) {
    const button = event.target.closest("[data-action]");
    if (!button || button.tagName === "SELECT") return;
    const { action, id } = button.dataset;
    if (action === "splat") this.selectSplat(id);
    if (action === "composition") this.selectComposition(id);
    if (action === "effect") this.selectEffect(id);
  }

  onChange(event) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.dataset.action;
    if (action === "splat") this.selectSplat(target.value);
    if (action === "camera") this.selectCamera(target.value);
    if (action === "movement") this.selectMovement(target.value);
  }

  clearSubject() {
    if (this.currentRelease) {
      this.currentRelease();
      this.currentRelease = null;
    }
    while (this.subject.children.length > 0) {
      this.subject.remove(this.subject.children[0]);
    }
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  dispose() {
    this.disposed = true;
    if (this.frame) cancelAnimationFrame(this.frame);
    this.clearSubject();
    disposeSplatLoaders();
    this.renderer?.dispose();
    this.stats?.dom.remove();
  }
}
