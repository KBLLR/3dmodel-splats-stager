import * as THREE from 'three';
import { SceneManager } from './SceneManager';
import { CameraManager } from './CameraManager';
import { ComponentManager } from './ComponentManager';
import { EnvironmentManager } from './EnvironmentManager';
import { LightingManager } from './LightingManager';

// StageManager ties together the lower level managers to provide
// a simple interface for creating and controlling a complete stage.
export class StageManager {
  constructor(renderer, container) {
    this.renderer = renderer;
    this.container = container;

    this.sceneManager = new SceneManager(renderer);
    this.cameraManager = new CameraManager(renderer, container);
    this.componentManager = new ComponentManager();

    this.environmentManager = null;
    this.lightingManager = null;
  }

  /**
   * Create a new stage (scene) and set up environment and lighting managers.
   */
  createStage(name, options = {}) {
    const scene = this.sceneManager.createScene(name, options);

    this.environmentManager = new EnvironmentManager(this.renderer, scene);
    this.lightingManager = new LightingManager(scene);

    this.sceneManager.setManagers(
      this.environmentManager,
      this.cameraManager,
      this.componentManager,
    );

    return scene;
  }

  /**
   * Set the active stage for rendering.
   */
  setActiveStage(name) {
    this.sceneManager.setActiveScene(name);
    if (this.lightingManager) {
      this.lightingManager.setScene(this.sceneManager.activeScene);
    }
  }

  /** Add an object to the active stage. */
  addToStage(object) {
    if (this.sceneManager.activeScene) {
      this.sceneManager.activeScene.add(object);
    }
  }

  /** Update all managers each frame. */
  update(deltaTime) {
    this.sceneManager.update(deltaTime);
    this.lightingManager?.update();
  }

  /** Handle resize events. */
  resize(width, height) {
    this.cameraManager.updateAspect(width, height);
    this.renderer.setSize(width, height);
  }

  /** Dispose of all resources. */
  dispose() {
    this.lightingManager?.dispose();
    this.environmentManager?.dispose();
    this.componentManager.dispose();
    this.sceneManager.dispose();
  }
}
