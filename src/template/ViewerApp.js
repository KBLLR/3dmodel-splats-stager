/**
 * Studio Labs viewer. The HTML plates, type, and Tweakpane are the original
 * UI. Layouts rearrange those plates. Records, effects, and the PLY/Luma
 * loaders stay behind that shell.
 */
import * as THREE from "three";
import { Pane } from "tweakpane";
import Stats from "stats.js";
import { LumaRenderer } from "@renderers/LumaRenderer";
import { CinematicCamera } from "@cameras/CinematicCamera";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PresetManager } from "@core/PresetManager";
import { PRESET_REGISTRY } from "@presets/index";
import { visibleMeta } from "@splats/fields";
import { disposeSplatLoaders, loadSplatSource } from "@splats/SplatSource";
import { listEffects } from "@effects/effectPresets";
import { applyEffect } from "@effects/applyEffect";
import { createCameraRig } from "./cameraRig";
import { renderCatalogRail } from "./catalogRail";
import { LAYOUTS, applyLayout } from "./layouts";
import {
  applySettingsVisibility,
  initialLayout,
  isSettingsShortcut,
  parseViewerSearch,
  readStoredSettings,
  resolveSplash,
  toggleSettingsHidden,
  writeStoredSettings,
} from "./settingsState";

async function loadNamedPresets(presetManager, type) {
  const names = await presetManager.getPresetNames(type);
  const entries = await Promise.all(
    names.map(async (id) => {
      const preset = await presetManager.loadPreset(type, id);
      return { id, name: preset.name || id, preset };
    }),
  );
  return entries;
}

function namedOptions(entries) {
  return Object.fromEntries(entries.map((entry) => [entry.name || entry.id, entry.id]));
}

export class ViewerApp {
  constructor({ canvas, grade, settingsButton } = {}) {
    this.canvas = canvas;
    this.grade = grade;
    this.settingsButton = settingsButton;
    this.presetManager = new PresetManager();
    this.subject = new THREE.Group();
    this.subject.name = "splat-subject";
    this.requestId = 0;
    this.currentRelease = null;
    this.disposed = false;
    this.stored = readStoredSettings();
    this.url = parseViewerSearch(typeof window !== "undefined" ? window.location.search : "");
    this.effects = listEffects();
    this.cameraPresets = new Map();
    this.movementPresets = new Map();
    this.shakeIntensityBinding = null;
    this.shakeFrequencyBinding = null;
    this.movementFolder = null;
    this.fogOptions = {};

    this.params = {
      fogEnabled: true,
      fogPreset: "SOFT_BLUE",
      fogDescription: "",
      movement: "STATIC",
      movementDescription: "",
      movementOn: false,
      stabilization: true,
      camera: "WIDE_SHOT",
      cameraState: "Manual",
      autoRotate: Boolean(this.stored.autoRotate),
      autoRotateSpeed: Number.isFinite(this.stored.autoRotateSpeed) ? this.stored.autoRotateSpeed : 2,
      splat: "",
      layout: initialLayout(typeof window !== "undefined" ? window.location.search : "", this.stored),
      effect: "clean",
      background: this.stored.backgroundCustom ? this.stored.background : "#242424",
      showSplash: true,
      splashTitle: "",
      splashSubtitle: "",
      splashText: "",
      showMetadata: this.stored.showMetadata !== false,
      theme: this.url.theme === "light" || this.stored.theme === "light" ? "light" : "dark",
      presentation: Boolean(this.stored.presentation),
      status: "",
    };
    this.shake = { intensity: 0, frequency: 0 };
    this.records = [];
    this.active = null;
    this.backgroundCustom = Boolean(this.stored.backgroundCustom);
    this.urlApplied = false;
  }

  async start() {
    if (!this.canvas) throw new Error("Viewer is missing its canvas");

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.params.background);
    this.renderer = new LumaRenderer({
      canvas: this.canvas,
      antialias: false,
      alpha: false,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(this.params.background, 1);

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
    this.rig = createCameraRig({
      camera: this.camera,
      controls: this.controls,
      domElement: this.canvas,
      onUserInteract: () => {
        this.params.cameraState = "Manual";
        this.pane?.refresh();
      },
    });
    this.rig.setAutoRotate(this.params.autoRotate, this.params.autoRotateSpeed);

    this.stats = new Stats();
    this.stats.showPanel(0);
    this.stats.dom.classList.add("stats-panel");
    document.body.appendChild(this.stats.dom);

    this.clock = new THREE.Clock();
    this.animate();

    const [models, cameras, movements] = await Promise.all([
      loadNamedPresets(this.presetManager, PRESET_REGISTRY.MODELS),
      loadNamedPresets(this.presetManager, PRESET_REGISTRY.CAMERA),
      loadNamedPresets(this.presetManager, PRESET_REGISTRY.CAMERA_MOVEMENT),
    ]);
    this.records = models.map((entry) => entry.preset);
    this.cameraEntries = cameras;
    this.movementEntries = movements;
    this.cameraPresets = new Map(cameras.map((entry) => [entry.id, entry.preset]));
    this.movementPresets = new Map(movements.map((entry) => [entry.id, entry.preset]));

    await this.loadFogOptions();
    this.buildPane();
    await this.applyFogPreset(this.params.fogPreset);
    this.applyChrome();
    this.bindInput();

    const requested = this.url.splat;
    const initial =
      this.records.find((record) => record.id === requested) ||
      this.records.find((record) => record.demo) ||
      this.records[0];

    if (initial) {
      await this.selectSplat(initial.id);
    } else {
      this.params.status = "No splat records found.";
      this.pane.refresh();
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

  buildPane() {
    const container = document.querySelector("#viewer-settings");
    this.pane = new Pane({ container });

    const fogFolder = this.pane.addFolder({ title: "Fog Controls" });
    fogFolder.addBinding(this.params, "fogEnabled", { label: "Enable Fog" }).on("change", ({ value }) => {
      this.scene.fog = value ? new THREE.FogExp2(this.fogColor, this.fogDensity) : null;
    });
    fogFolder
      .addBinding(this.params, "fogPreset", { options: this.fogOptions, label: "Preset" })
      .on("change", async ({ value }) => {
        await this.applyFogPreset(value);
      });
    fogFolder.addBinding(this.params, "fogDescription", {
      readonly: true,
      label: "Description",
    });

    this.movementFolder = this.pane.addFolder({ title: "Camera Movement" });
    this.movementFolder
      .addBinding(this.params, "movement", {
        options: namedOptions(this.movementEntries),
        label: "Movement Preset",
      })
      .on("change", ({ value }) => {
        this.selectMovement(value);
      });
    this.movementFolder.addBinding(this.params, "movementDescription", {
      readonly: true,
      label: "Description",
    });
    this.movementFolder.addBinding(this.params, "movementOn", { label: "Movement" }).on("change", ({ value }) => {
      const preset = { ...(this.movementPresets.get(this.params.movement) || {}), movement: value };
      this.rig.applyMovement(preset);
      this.params.cameraState = this.rig.isAnimating() ? "Animating" : "Manual";
    });
    this.movementFolder.addBinding(this.params, "stabilization", { label: "Stabilization" });

    const cameraFolder = this.pane.addFolder({ title: "Camera", expanded: false });
    cameraFolder
      .addBinding(this.params, "camera", {
        options: namedOptions(this.cameraEntries),
        label: "Preset",
      })
      .on("change", ({ value }) => {
        this.selectCamera(value);
      });
    cameraFolder.addBinding(this.params, "cameraState", { readonly: true, label: "Control" });
    cameraFolder.addBinding(this.params, "autoRotate", { label: "Auto-rotate" }).on("change", ({ value }) => {
      this.setAutoRotate(value);
    });
    cameraFolder
      .addBinding(this.params, "autoRotateSpeed", { label: "Rotate speed", min: 0.2, max: 8, step: 0.1 })
      .on("change", ({ value }) => {
        this.params.autoRotateSpeed = value;
        this.rig.setAutoRotate(this.params.autoRotate, value);
        this.persist();
      });
    cameraFolder.addButton({ title: "Reset view" }).on("click", () => {
      this.resetView();
    });
    cameraFolder.addButton({ title: "Stop cinematic" }).on("click", () => {
      this.rig.stopForUser();
      this.params.cameraState = "Manual";
      this.pane.refresh();
    });

    const stageFolder = this.pane.addFolder({ title: "Stage", expanded: false });
    stageFolder
      .addBinding(this.params, "splat", {
        options: Object.fromEntries(this.records.map((record) => [record.title, record.id])),
        label: "Splat",
      })
      .on("change", ({ value }) => {
        if (value && value !== this.active?.id) this.selectSplat(value);
      });
    stageFolder
      .addBinding(this.params, "layout", {
        options: Object.fromEntries(LAYOUTS.map((layout) => [layout.label, layout.id])),
        label: "Layout",
      })
      .on("change", ({ value }) => {
        this.setLayout(value);
      });
    stageFolder
      .addBinding(this.params, "effect", {
        options: Object.fromEntries(this.effects.map((effect) => [effect.name, effect.id])),
        label: "Effect",
      })
      .on("change", ({ value }) => {
        this.selectEffect(value);
      });
    stageFolder.addBinding(this.params, "background", { view: "color", label: "Background" }).on("change", ({ value }) => {
      this.backgroundCustom = true;
      this.applyBackground(value);
      this.persist();
    });
    stageFolder.addBinding(this.params, "status", { readonly: true, label: "Status" });

    const splashFolder = this.pane.addFolder({ title: "Splash", expanded: false });
    splashFolder.addBinding(this.params, "showSplash", { label: "Show splash" }).on("change", () => {
      this.markSplashCustom();
      this.writeSplashDom();
    });
    splashFolder.addBinding(this.params, "splashTitle", { label: "Title" }).on("change", () => {
      this.markSplashCustom();
      this.writeSplashDom();
    });
    splashFolder.addBinding(this.params, "splashSubtitle", { label: "Subtitle" }).on("change", () => {
      this.markSplashCustom();
      this.writeSplashDom();
    });
    splashFolder.addBinding(this.params, "splashText", { label: "Text" }).on("change", () => {
      this.markSplashCustom();
      this.writeSplashDom();
    });
    splashFolder.addButton({ title: "Use record text" }).on("click", () => {
      this.resetSplashToRecord();
    });

    const viewFolder = this.pane.addFolder({ title: "View", expanded: false });
    viewFolder.addBinding(this.params, "showMetadata", { label: "Metadata" }).on("change", () => {
      this.writeSplashDom();
      this.persist();
    });
    viewFolder
      .addBinding(this.params, "theme", {
        options: { Dark: "dark", Light: "light" },
        label: "Theme",
      })
      .on("change", ({ value }) => {
        this.applyTheme(value);
        this.persist();
      });
    viewFolder.addBinding(this.params, "presentation", { label: "Hide all UI" }).on("change", ({ value }) => {
      this.applyPresentation(value);
      this.persist();
    });
  }

  async loadFogOptions() {
    const names = await this.presetManager.getPresetNames(PRESET_REGISTRY.FOG);
    names.forEach((name) => {
      this.fogOptions[name] = name;
    });
  }

  async applyFogPreset(name) {
    const preset = await this.presetManager.loadPreset(PRESET_REGISTRY.FOG, name);
    this.fogColor = preset.color;
    this.fogDensity = preset.density;
    this.params.fogPreset = name;
    this.params.fogDescription = preset.description || "";
    if (this.params.fogEnabled && preset.color) {
      this.scene.fog = new THREE.FogExp2(preset.color, preset.density);
    } else if (!preset.color) {
      this.params.fogEnabled = false;
      this.scene.fog = null;
    }
    this.pane?.refresh();
  }

  bindInput() {
    this.onKeyDown = (event) => {
      if (!isSettingsShortcut(event)) return;
      event.preventDefault();
      this.toggleSettings();
    };
    window.addEventListener("keydown", this.onKeyDown);
    this.settingsButton?.addEventListener("click", () => this.toggleSettings());
    document.querySelector(".ui-container")?.addEventListener("click", (event) => this.onUiClick(event));
    window.addEventListener("resize", () => this.onResize());
    window.addEventListener("beforeunload", () => this.dispose());
  }

  onUiClick(event) {
    const splatButton = event.target.closest("[data-splat-id]");
    if (splatButton) {
      this.selectSplat(splatButton.dataset.splatId);
      return;
    }
    const cameraButton = event.target.closest("[data-camera-action]");
    if (!cameraButton) return;
    const action = cameraButton.dataset.cameraAction;
    if (action === "reset") this.resetView();
    if (action === "stop") {
      this.rig.stopForUser();
      this.params.cameraState = "Manual";
      this.pane.refresh();
    }
    if (action === "autorotate") this.setAutoRotate(!this.params.autoRotate);
  }

  applyChrome() {
    applyLayout(document.body, this.params.layout);
    applyLayout(document.documentElement, this.params.layout);
    this.applyTheme(this.params.theme);
    this.applyPresentation(this.params.presentation);
    const hidden = Boolean(this.stored.settingsHidden);
    applySettingsVisibility(document.body, hidden);
    applySettingsVisibility(document.documentElement, hidden);
    this.stored.settingsHidden = hidden;
    this.syncAutoRotateButton();
    this.writeCatalog();
    this.writeSplashDom();
  }

  toggleSettings() {
    const hidden = toggleSettingsHidden(Boolean(this.stored.settingsHidden));
    this.stored.settingsHidden = hidden;
    applySettingsVisibility(document.body, hidden);
    applySettingsVisibility(document.documentElement, hidden);
    this.persist();
  }

  setLayout(id) {
    this.params.layout = applyLayout(document.body, id);
    applyLayout(document.documentElement, this.params.layout);
    this.persist();
    this.pane?.refresh();
  }

  setAutoRotate(enabled) {
    this.params.autoRotate = Boolean(enabled);
    this.rig.setAutoRotate(this.params.autoRotate, this.params.autoRotateSpeed);
    this.syncAutoRotateButton();
    this.persist();
    this.pane?.refresh();
  }

  syncAutoRotateButton() {
    const button = document.querySelector("[data-camera-action='autorotate']");
    if (!button) return;
    button.setAttribute("aria-pressed", String(this.params.autoRotate));
  }

  applyTheme(theme) {
    this.params.theme = theme === "light" ? "light" : "dark";
    const light = this.params.theme === "light";
    if (light) {
      document.body.dataset.theme = "light";
      document.documentElement.dataset.theme = "light";
    } else {
      delete document.body.dataset.theme;
      delete document.documentElement.dataset.theme;
    }
  }

  applyPresentation(on) {
    this.params.presentation = Boolean(on);
    const value = this.params.presentation ? "on" : "off";
    document.body.dataset.presentation = value;
    document.documentElement.dataset.presentation = value;
  }

  applyBackground(color) {
    this.params.background = color;
    const next = new THREE.Color(color);
    this.scene.background = next;
    this.renderer.setClearColor(next, 1);
  }

  writeCatalog() {
    const rail = document.querySelector("#catalog-rail");
    if (!rail) return;
    rail.innerHTML = renderCatalogRail(this.records, this.active?.id);
  }

  splashBody() {
    if (!this.params.showMetadata) return "";
    const lines = [];
    if (this.params.splashText) lines.push(this.params.splashText);
    if (this.active) {
      const extra = visibleMeta(this.active).filter((row) => row.id !== "title" && row.id !== "description");
      if (extra.length > 0) {
        lines.push(extra.map((row) => `${row.label}: ${row.value}`).join(" · "));
      }
    }
    return lines.join("\n");
  }

  writeSplashDom() {
    const title = document.querySelector(".title-banner-bottom");
    const subtitle = document.querySelector(".subtitle-banner-bottom");
    const intro = document.querySelector(".intro");
    const bottom = document.querySelector(".text-banner-bottom");
    const top = document.querySelector(".banner-top-left");
    const foot = document.querySelector(".banner-bottom-center");
    if (title) title.textContent = this.params.splashTitle;
    if (subtitle) subtitle.textContent = this.params.splashSubtitle;
    const body = this.splashBody();
    if (intro) intro.textContent = body;
    if (bottom) bottom.textContent = body;
    if (top) top.hidden = !this.params.showSplash;
    if (foot) foot.hidden = !this.params.showSplash;
    if (this.params.splashTitle) {
      document.title = `${this.params.splashTitle} · 3D Model Splats Stager`;
    }
  }

  applySplash(splash, { customized = false } = {}) {
    this.params.showSplash = splash.showSplash;
    this.params.splashTitle = splash.title;
    this.params.splashSubtitle = splash.subtitle;
    this.params.splashText = splash.text;
    if (this.active && customized) this.markSplashCustom();
    this.writeSplashDom();
  }

  markSplashCustom() {
    if (!this.active) return;
    this.stored.splashes = this.stored.splashes || {};
    this.stored.splashes[this.active.id] = {
      title: this.params.splashTitle,
      subtitle: this.params.splashSubtitle,
      text: this.params.splashText,
      showSplash: this.params.showSplash,
      customized: true,
    };
    this.persist();
  }

  resetSplashToRecord() {
    if (this.active) {
      this.stored.splashes = this.stored.splashes || {};
      delete this.stored.splashes[this.active.id];
    }
    const splash = resolveSplash({
      record: this.active,
      search: window.location.search,
      stored: null,
    });
    this.applySplash(splash);
    this.persist();
    this.pane.refresh();
  }

  pickId(map, preferred, fallback) {
    if (preferred && map.has(preferred)) return preferred;
    if (fallback && map.has(fallback)) return fallback;
    return map.keys().next().value;
  }

  async selectSplat(id) {
    const record = this.records.find((item) => item.id === id);
    if (!record) return;
    const token = ++this.requestId;
    this.active = record;
    this.params.splat = record.id;

    const storedSplash = this.stored.splashes?.[record.id];
    const splash = resolveSplash({
      record,
      search: window.location.search,
      stored: storedSplash?.customized ? storedSplash : null,
    });
    this.applySplash(splash);

    const cameraPref = this.urlApplied ? null : this.url.camera;
    const movementPref = this.urlApplied ? null : this.url.movement;
    const effectPref = this.urlApplied ? null : this.url.effect;
    this.urlApplied = true;
    const cameraId = this.pickId(this.cameraPresets, cameraPref, record.defaultCamera);
    const movementId = this.pickId(this.movementPresets, movementPref, record.defaultMovement);
    const requestedEffect = effectPref || record.defaultEffect;
    const effectId = this.effects.some((effect) => effect.id === requestedEffect) ? requestedEffect : "clean";

    this.params.camera = cameraId;
    this.params.movement = movementId;
    this.params.effect = effectId;
    this.params.status = "Loading source…";
    this.writeCatalog();
    this.pane?.refresh();

    const cameraPreset = this.cameraPresets.get(cameraId);
    const movementPreset = this.movementPresets.get(movementId);
    this.rig.rememberHome(cameraId, cameraPreset, movementPreset);
    if (cameraPreset) this.rig.applyPreset(cameraId, cameraPreset);
    if (movementPreset) this.applyMovementPreset(movementPreset);
    await this.selectEffect(effectId);
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
      this.params.status = "";
    } catch (error) {
      if (token !== this.requestId) return;
      console.error("Splat source failed to load", error);
      this.clearSubject();
      this.params.status = "The source did not load. The splash still shows the record.";
    }
    this.pane?.refresh();
  }

  selectCamera(id) {
    const preset = this.cameraPresets.get(id);
    if (!preset) return;
    this.params.camera = id;
    this.rig.applyPreset(id, preset);
    const movement = this.movementPresets.get(this.params.movement);
    if (movement) this.applyMovementPreset(movement);
    this.pane?.refresh();
  }

  selectMovement(id) {
    const preset = this.movementPresets.get(id);
    if (!preset) return;
    this.params.movement = id;
    this.applyMovementPreset(preset);
    this.pane?.refresh();
  }

  applyMovementPreset(preset) {
    this.params.movementDescription = preset.name || this.params.movement;
    this.params.movementOn = Boolean(preset.movement);
    this.params.stabilization = preset.stabilization !== false;
    this.shake.intensity = preset.shake?.intensity ?? 0;
    this.shake.frequency = preset.shake?.frequency ?? 0;
    this.syncShakeBindings(preset);
    this.rig.applyMovement(preset);
    this.params.cameraState = this.rig.isAnimating() ? "Animating" : "Manual";
  }

  syncShakeBindings(preset) {
    if (!this.movementFolder) return;
    if (this.shakeIntensityBinding) this.movementFolder.remove(this.shakeIntensityBinding);
    if (this.shakeFrequencyBinding) this.movementFolder.remove(this.shakeFrequencyBinding);
    this.shakeIntensityBinding = null;
    this.shakeFrequencyBinding = null;
    if (!preset?.shake) return;
    this.shakeIntensityBinding = this.movementFolder.addBinding(this.shake, "intensity", {
      label: "Shake Intensity",
      min: 0,
      max: 1,
    });
    this.shakeFrequencyBinding = this.movementFolder.addBinding(this.shake, "frequency", {
      label: "Shake Frequency",
      min: 0,
      max: 10,
    });
  }

  async selectEffect(id) {
    this.params.effect = id;
    const effect = await applyEffect({
      effectId: id,
      scene: this.scene,
      renderer: this.renderer,
      grade: this.grade,
      presetManager: this.presetManager,
    });
    if (this.backgroundCustom) {
      this.applyBackground(this.params.background);
    } else if (effect?.background) {
      this.params.background = effect.background;
    }
    if (effect?.fog) {
      this.params.fogEnabled = true;
      await this.applyFogPreset(effect.fog);
      if (Number.isFinite(effect.fogDensity) && this.scene.fog) {
        this.scene.fog.density = effect.fogDensity;
        this.fogDensity = effect.fogDensity;
      }
    } else if (effect) {
      this.params.fogEnabled = false;
      this.params.fogPreset = "NONE";
      this.params.fogDescription = "No fog effect";
      this.scene.fog = null;
    }
    this.pane?.refresh();
    return effect;
  }

  resetView() {
    if (!this.active) return;
    const cameraId = this.pickId(this.cameraPresets, null, this.active.defaultCamera);
    const movementId = this.pickId(this.movementPresets, null, this.active.defaultMovement);
    const cameraPreset = this.cameraPresets.get(cameraId);
    const movementPreset = this.movementPresets.get(movementId);
    this.params.camera = cameraId;
    this.params.movement = movementId;
    this.rig.rememberHome(cameraId, cameraPreset, movementPreset);
    this.rig.resetView();
    if (movementPreset) this.applyMovementPreset(movementPreset);
    this.pane?.refresh();
  }

  persist() {
    this.stored = {
      ...this.stored,
      settingsHidden: Boolean(this.stored.settingsHidden),
      layout: this.params.layout,
      theme: this.params.theme,
      presentation: this.params.presentation,
      showMetadata: this.params.showMetadata,
      autoRotate: this.params.autoRotate,
      autoRotateSpeed: this.params.autoRotateSpeed,
      background: this.backgroundCustom ? this.params.background : this.stored.background,
      backgroundCustom: this.backgroundCustom,
      splashes: this.stored.splashes || {},
    };
    writeStoredSettings(this.stored);
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
    if (this.disposed) return;
    this.disposed = true;
    if (this.frame) cancelAnimationFrame(this.frame);
    window.removeEventListener("keydown", this.onKeyDown);
    this.rig?.dispose();
    this.clearSubject();
    disposeSplatLoaders();
    this.renderer?.dispose();
    this.stats?.dom.remove();
  }
}
