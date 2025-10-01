import { getFormattedMonth } from "../utils/dateUtils";
import { SCENE_REQUIREMENTS } from "../presets/sceneRequirements";
import { SCENE_CONFIGS } from "../presets/sceneConfigs";
import * as THREE from "three";

class SceneTest {
  constructor() {
    this.testResults = document.getElementById("testResults");
    this.setupRenderer();
    this.runTests();
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: document.querySelector("canvas"),
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  logResult(message, passed) {
    const result = `${passed ? "✅" : "❌"} ${message}`;
    if (this.testResults) {
      const div = document.createElement("div");
      div.textContent = result;
      div.style.color = passed ? "#4CAF50" : "#f44336";
      this.testResults.appendChild(div);
    }
  }

  validateSceneConfig(config, requirements) {
    const results = [];

    // Detailed camera check
    if (requirements.camera.required) {
      const cameraChecks = {
        type: config.camera?.type === requirements.camera.type,
        preset: config.camera?.preset === requirements.camera.preset,
        position:
          JSON.stringify(config.camera?.position) ===
          JSON.stringify(requirements.camera.position),
        target:
          JSON.stringify(config.camera?.target) ===
          JSON.stringify(requirements.camera.target),
        dof:
          config.camera?.dof &&
          config.camera.dof.focus === requirements.camera.dof.focus &&
          config.camera.dof.aperture === requirements.camera.dof.aperture,
      };

      const cameraValid = Object.values(cameraChecks).every((check) => check);

      results.push({
        name: "Camera Check",
        passed: cameraValid,
        message: `Camera configuration ${cameraValid ? "matches" : "does not match"} requirements`,
        details: !cameraValid
          ? {
              expected: requirements.camera,
              received: config.camera,
              failedChecks: Object.entries(cameraChecks)
                .filter(([, passed]) => !passed)
                .map(([key]) => key),
            }
          : null,
      });
    }

    // Check environment requirements
    if (requirements.environment.required) {
      const envValid =
        config.environment &&
        requirements.environment.types.includes(config.environment.type);

      results.push({
        name: "Environment Check",
        passed: envValid,
        message: "Environment configuration matches requirements",
      });
    }

    return results;
  }

  async runTests() {
    this.logResult("Starting Tests...", true);

    // Test Normal Scene
    const normalResults = this.validateSceneConfig(
      SCENE_CONFIGS.GALLERY,
      SCENE_REQUIREMENTS.NORMAL,
    );

    normalResults.forEach((result) => {
      this.logResult(
        `Normal Scene - ${result.name}: ${result.message}`,
        result.passed,
      );
      if (!result.passed && result.details) {
        console.log("Failed check details:", result.details);
      }
    });

    // Test Luma Scene
    const lumaResults = this.validateSceneConfig(
      SCENE_CONFIGS.LUMA_CITY,
      SCENE_REQUIREMENTS.LUMA_LABS,
    );

    lumaResults.forEach((result) => {
      this.logResult(
        `Luma Scene - ${result.name}: ${result.message}`,
        result.passed,
      );
      if (!result.passed && result.details) {
        console.log("Failed check details:", result.details);
      }
    });

    this.testDateUtils();

    this.logResult("Tests Complete", true);
  }

  testDateUtils() {
    this.logResult("Running Date Utils Tests...", true);
    const testDate = new Date("2023-01-15");
    const month = getFormattedMonth(testDate);
    const passed = month === "Jan";
    this.logResult(`getFormattedMonth should return 'Jan' for January`, passed);
  }
}

// Initialize tests when DOM is ready
window.addEventListener("DOMContentLoaded", () => {
  new SceneTest();
});
