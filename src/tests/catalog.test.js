/**
 * Checks that the splat catalog replaced the duplicate Luma lists.
 */
import { PresetManager } from "../core/PresetManager.js";
import { PRESET_REGISTRY } from "../presets/index.js";
import { LUMA_MODELS, LUMA_SPLATS, SPLAT_RECORDS } from "../splats/catalog.js";

const AUTOVAN_URL = "https://lumalabs.ai/capture/5be32ec6-b11f-44eb-bbb7-57c5beee0d75";

class CatalogTest {
  constructor() {
    this.testResults = document.getElementById("testResults");
    this.runTests();
  }

  logResult(message, passed) {
    if (!this.testResults) return;
    const div = document.createElement("div");
    div.textContent = `${passed ? "✅" : "❌"} ${message}`;
    div.style.color = passed ? "#4CAF50" : "#f44336";
    this.testResults.appendChild(div);
  }

  async runTests() {
    this.logResult("Catalog keeps AUTOVAN's capture URL", LUMA_SPLATS.AUTOVAN === AUTOVAN_URL);
    this.logResult("TREE is not a separate LUMA_SPLATS entry", LUMA_SPLATS.TREE === undefined);
    this.logResult("TREE is not a separate LUMA_MODELS entry", LUMA_MODELS.TREE === undefined);
    this.logResult(
      "LUMA_MODELS does not keep the truncated TREE URL",
      Object.values(LUMA_MODELS).every((url) => !String(url).includes("57c5beee0d75l")),
    );
    this.logResult(
      "LUMA_MODELS is a subset of the consolidated URLs",
      Object.values(LUMA_MODELS).every((url) => Object.values(LUMA_SPLATS).includes(url)),
    );

    const demos = SPLAT_RECORDS.filter((record) => record.demo);
    this.logResult("At least two demo records use Luma URLs", demos.length >= 2 && demos.every((record) => record.source.kind === "luma"));
    this.logResult(
      "Every record names the fields the UI may show",
      SPLAT_RECORDS.every((record) => Array.isArray(record.visibleFields) && record.visibleFields.length > 0),
    );

    const presetManager = new PresetManager();
    try {
      const names = await presetManager.getPresetNames(PRESET_REGISTRY.MODELS);
      const autovan = await presetManager.loadPreset(PRESET_REGISTRY.MODELS, "autovan");
      this.logResult(
        "MODELS preset loads the autovan record",
        names.includes("autovan") && autovan.source.url === AUTOVAN_URL,
      );
    } catch (error) {
      this.logResult(`MODELS preset failed: ${error.message}`, false);
    }

    this.logResult("Catalog Tests Complete", true);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  new CatalogTest();
});
