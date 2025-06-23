import { SceneManager } from '../managers/SceneManager';

/**
 * Basic wrapper around SceneManager to generate scenes from
 * configuration objects. This allows scenes to be created and
 * managed with a simple API while keeping the heavy lifting in
 * the existing managers.
 */
export class SceneGenerator {
  constructor(renderer) {
    this.manager = new SceneManager(renderer);
  }

  /**
   * Create a new scene using the provided configuration.
   * @param {string} name - Identifier for the scene.
   * @param {object} [config={}] - Optional scene configuration.
   * @returns {THREE.Scene}
   */
  create(name, config = {}) {
    return this.manager.createScene(name, config);
  }

  /**
   * Set the active scene for rendering.
   * @param {string} name
   */
  setActive(name) {
    this.manager.setActiveScene(name);
  }

  /**
   * Update the active scene each frame.
   * @param {number} deltaTime
   */
  update(deltaTime) {
    this.manager.update(deltaTime);
  }

  /** Dispose all created scenes. */
  dispose() {
    this.manager.dispose();
  }
}

export default SceneGenerator;
