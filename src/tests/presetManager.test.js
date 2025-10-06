/**
 * @file This file contains tests for the PresetManager class.
 * @module presetManagerTest
 */

import { PresetManager } from '../core/PresetManager.js';
import { PRESET_REGISTRY } from '../presets/index.js';
import { CAMERA_PRESETS } from '../presets/cameraPresets.js';

class PresetManagerTest {
  constructor() {
    this.testResults = document.getElementById("testResults");
    this.runTests();
  }

  logResult(message, passed) {
    const result = `${passed ? "✅" : "❌"} ${message}`;
    if (this.testResults) {
      const div = document.createElement("div");
      div.innerHTML = message; // Use innerHTML to render h2 tags
      div.style.color = passed ? "#4CAF50" : "#f44336";
      this.testResults.appendChild(div);
    }
  }

  async runTests() {
    this.logResult("<h2>Starting PresetManager Tests...</h2>", true);

    await this.testInitialization();
    await this.testGetPresetNames();
    await this.testLoadPreset();
    await this.testCaching();

    this.logResult("<h2>PresetManager Tests Complete</h2>", true);
  }

  async testInitialization() {
    const presetManager = new PresetManager();
    this.logResult("PresetManager should initialize", presetManager instanceof PresetManager);
  }

  async testGetPresetNames() {
    const presetManager = new PresetManager();

    // Test for camera presets
    try {
      const cameraPresetNames = await presetManager.getPresetNames(PRESET_REGISTRY.CAMERA);
      const expectedCameraPresetNames = Object.keys(CAMERA_PRESETS);
      this.logResult("getPresetNames should return correct camera preset names", JSON.stringify(cameraPresetNames.sort()) === JSON.stringify(expectedCameraPresetNames.sort()));
    } catch (e) {
      this.logResult(`getPresetNames for camera presets failed: ${e.message}`, false);
    }

    // Test for an invalid preset type
    try {
      await presetManager.getPresetNames('invalid_type');
      this.logResult("getPresetNames should throw an error for an invalid type", false);
    } catch (e) {
      this.logResult("getPresetNames should throw an error for an invalid type", e.message.includes('Unknown preset type'));
    }
  }

  async testLoadPreset() {
    const presetManager = new PresetManager();

    // Test loading a valid camera preset
    try {
      const preset = await presetManager.loadPreset(PRESET_REGISTRY.CAMERA, 'DEFAULT');
      this.logResult("loadPreset should load a valid camera preset", preset === CAMERA_PRESETS.DEFAULT);
    } catch (e) {
      this.logResult(`loadPreset for a valid camera preset failed: ${e.message}`, false);
    }

    // Test loading a non-existent preset
    try {
      await presetManager.loadPreset(PRESET_REGISTRY.CAMERA, 'NON_EXISTENT');
      this.logResult("loadPreset should throw an error for a non-existent preset", false);
    } catch (e) {
      this.logResult("loadPreset should throw an error for a non-existent preset", e.message.includes('not found for type'));
    }

    // Test loading from an invalid preset type
    try {
      await presetManager.loadPreset('invalid_type', 'DEFAULT');
      this.logResult("loadPreset should throw an error for an invalid type", false);
    } catch (e) {
      this.logResult("loadPreset should throw an error for an invalid type", e.message.includes('Unknown preset type'));
    }
  }

  async testCaching() {
    let callCount = 0;
    const mockManifest = {
        [PRESET_REGISTRY.CAMERA]: {
            loader: () => {
                callCount++;
                return Promise.resolve({
                    CAMERA_PRESETS: {
                        'DEFAULT': { "test": "data" }
                    }
                });
            },
            exportName: "CAMERA_PRESETS",
        }
    };

    const presetManager = new PresetManager(mockManifest);

    // Load the same preset twice
    await presetManager.loadPreset(PRESET_REGISTRY.CAMERA, 'DEFAULT');
    await presetManager.loadPreset(PRESET_REGISTRY.CAMERA, 'DEFAULT');

    this.logResult("loadPreset should cache presets and only call loader once", callCount === 1);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  new PresetManagerTest();
});