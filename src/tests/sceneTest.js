/**
 * @file This file contains tests for scene configurations and utility functions.
 * It runs a series of checks and displays the results on the test page.
 * @module sceneTest
 */

import { getFormattedMonth, getCurrentYear } from "../utils/dateUtils";
import { SCENE_REQUIREMENTS } from "../presets/sceneRequirements";
import { SCENE_CONFIGS } from "../presets/sceneConfigs";
import * as THREE from "three";

/**
 * @class SceneTest
 * @description Manages and executes a suite of tests for the application's scene configurations.
 */
class SceneTest {
  /**
   * @constructor
   * @description Initializes the test suite, sets up the renderer, and runs all tests.
   */
  constructor() {
    this.testResults = document.getElementById("testResults");
    this.setupRenderer();
    this.runTests();
  }

  /**
   * @method setupRenderer
   * @description Sets up a WebGL renderer for any tests that might require it.
   */
  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: document.querySelector("canvas"),
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  /**
   * @method logResult
   * @description Logs the result of a test to the DOM.
   * @param {string} message - The message describing the test.
   * @param {boolean} passed - Whether the test passed or failed.
   */
  logResult(message, passed) {
    const result = `${passed ? "✅" : "❌"} ${message}`;
    if (this.testResults) {
      const div = document.createElement("div");
      div.textContent = result;
      div.style.color = passed ? "#4CAF50" : "#f44336";
      this.testResults.appendChild(div);
    }
  }

  /**
   * @method validateSceneConfig
   * @description Validates a given scene configuration against a set of requirements.
   * @param {object} config - The scene configuration to validate.
   * @param {object} requirements - The requirements the configuration must meet.
   * @returns {Array<object>} An array of result objects for each check performed.
   */
  validateSceneConfig(config, requirements) {
    const results = [];

    // Detailed camera check: Verifies that the camera configuration matches the specified requirements.
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

    // Environment check: Ensures the environment configuration is valid and of a supported type.
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

  /**
   * @method runTests
   * @description Executes all test suites and logs their results.
   */
  async runTests() {
    this.logResult("Starting Tests...", true);

    // Test Case: Validate the 'GALLERY' scene configuration against 'NORMAL' requirements.
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

    // Test Case: Validate the 'LUMA_CITY' scene configuration against 'LUMA_LABS' requirements.
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

    // Test Case: Run tests for date utility functions.
    this.testDateUtils();

    this.logResult("Tests Complete", true);
  }

  /**
   * @method testDateUtils
   * @description Runs tests specifically for the date utility functions.
   */
  testDateUtils() {
    this.logResult("Running Date Utils Tests...", true);
    // Test that getFormattedMonth correctly returns the abbreviated month name.
    const testDate = new Date("2023-01-15");
    const month = getFormattedMonth(testDate);
    const passed = month === "Jan";
    this.logResult(`getFormattedMonth should return 'Jan' for January`, passed);

    // Test that getCurrentYear returns the correct year as a string.
    const currentYear = new Date().getFullYear().toString();
    const year = getCurrentYear();
    const yearTestPassed = year === currentYear;
    this.logResult(`getCurrentYear should return the current year (${currentYear})`, yearTestPassed);
  }
}

// Initialize tests when the DOM is ready.
window.addEventListener("DOMContentLoaded", () => {
  new SceneTest();
});
