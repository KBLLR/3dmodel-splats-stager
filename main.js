import "./style.css";
import { CoreManager } from "./src/core/CoreManager.js";

class App {
  constructor() {
    this.core = new CoreManager();
    this.animate = this.animate.bind(this);
    this.animate();
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.core.update();
  }
}

// Start the application when DOM is loaded
window.addEventListener("DOMContentLoaded", () => {
  new App();
});
