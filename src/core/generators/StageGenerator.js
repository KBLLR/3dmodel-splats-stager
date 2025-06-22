import { StageManager } from '../managers/StageManager';

/**
 * Simple generator that delegates stage creation and management
 * to StageManager. This keeps configuration handling flexible
 * while exposing a minimal interface for external modules.
 */
export class StageGenerator {
  constructor(renderer, container) {
    this.manager = new StageManager(renderer, container);
  }

  /**
   * Create a new stage using the provided configuration.
   * Convenience wrapper over StageManager.createStage.
   *
   * @param {string} name - Identifier for the stage.
   * @param {object} [config={}] - Optional stage configuration.
   * @returns {THREE.Scene}
   */
  create(name, config = {}) {
    return this.manager.createStage(name, config);
  }

  /** Proxy to StageManager.setActiveStage. */
  setActive(name) {
    this.manager.setActiveStage(name);
  }

  /** Update the active stage each frame. */
  update(deltaTime) {
    this.manager.update(deltaTime);
  }

  /** Resize the underlying renderer and cameras. */
  resize(width, height) {
    this.manager.resize(width, height);
  }

  /** Dispose of all resources created by the generator. */
  dispose() {
    this.manager.dispose();
  }
}

export default StageGenerator;
