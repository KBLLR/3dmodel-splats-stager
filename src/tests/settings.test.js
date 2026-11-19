/**
 * Settings hide toggle and splash text. These run in the scene test page.
 */
import { assetUrl } from "../template/assetUrl.js";
import { applyLayout } from "../template/layouts.js";
import {
  ORIGINAL_SPLASH,
  applySettingsVisibility,
  isSettingsShortcut,
  resolveSplash,
  toggleSettingsHidden,
} from "../template/settingsState.js";

class SettingsTest {
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

  runTests() {
    const record = {
      title: "Autovan",
      subtitle: "Vehicle",
      description: "From the record.",
    };
    const stored = {
      title: "Saved title",
      subtitle: "Saved sub",
      text: "Saved text",
      showSplash: false,
    };

    const fromRecord = resolveSplash({ record, search: "", stored: null });
    this.logResult("Splash title defaults to the splat record", fromRecord.title === "Autovan");
    this.logResult("Splash subtitle defaults to the record", fromRecord.subtitle === "Vehicle");
    this.logResult("Splash text defaults to the record description", fromRecord.text === "From the record.");
    this.logResult("Splash is visible unless hidden", fromRecord.showSplash === true);

    const fromStore = resolveSplash({ record, search: "", stored });
    this.logResult("A saved splash edit overrides the record", fromStore.title === "Saved title");
    this.logResult("A saved splash can hide the plates", fromStore.showSplash === false);

    const fromUrl = resolveSplash({ record, search: "?title=From%20URL&splash=1", stored });
    this.logResult("?title= overrides a saved splash title", fromUrl.title === "From URL");
    this.logResult("?splash=1 shows the plates again", fromUrl.showSplash === true);
    this.logResult("URL does not blank the other saved fields", fromUrl.subtitle === "Saved sub");

    const fallback = resolveSplash({ record: null, search: "", stored: null });
    this.logResult("Missing record keeps the original Studio Labs title", fallback.title === ORIGINAL_SPLASH.title);
    this.logResult(
      "Missing record keeps the original subtitle",
      fallback.subtitle === ORIGINAL_SPLASH.subtitle,
    );

    const introParam = resolveSplash({ record, search: "?intro=Intro%20copy", stored: null });
    this.logResult("?intro= sets the editable splash text", introParam.text === "Intro copy");

    const root = document.createElement("div");
    const button = document.createElement("button");
    button.setAttribute("data-settings-toggle", "");
    const label = document.createElement("span");
    label.setAttribute("data-settings-label", "");
    button.appendChild(label);
    root.appendChild(button);
    document.body.appendChild(root);

    applySettingsVisibility(root, false);
    this.logResult("Settings start expanded", button.getAttribute("aria-expanded") === "true");
    this.logResult("Expanded toggle reads Hide settings", button.getAttribute("aria-label") === "Hide settings");
    this.logResult("Settings root is open", root.dataset.settings === "open");

    const hidden = toggleSettingsHidden(false);
    applySettingsVisibility(root, hidden);
    this.logResult("Hide toggle flips the flag", hidden === true);
    this.logResult("Hidden toggle collapses aria-expanded", button.getAttribute("aria-expanded") === "false");
    this.logResult("Hidden toggle reads Show settings", button.getAttribute("aria-label") === "Show settings");
    this.logResult("Hidden label text is Show", label.textContent === "Show");
    this.logResult("Settings root is hidden", root.dataset.settings === "hidden");

    const shown = toggleSettingsHidden(true);
    applySettingsVisibility(root, shown);
    this.logResult("Toggle again opens settings", shown === false && root.dataset.settings === "open");

    this.logResult(
      "H is the settings shortcut",
      isSettingsShortcut({ key: "h", target: document.body }) === true,
    );
    this.logResult(
      "Period is the settings shortcut",
      isSettingsShortcut({ key: ".", target: document.body }) === true,
    );
    const field = document.createElement("input");
    this.logResult(
      "Shortcut ignores text fields",
      isSettingsShortcut({ key: "h", target: field }) === false,
    );
    this.logResult(
      "Shortcut ignores modified keys",
      isSettingsShortcut({ key: "h", metaKey: true, target: document.body }) === false,
    );

    const stage = document.createElement("div");
    stage.dataset.splat = "autovan";
    const editorial = applyLayout(stage, "editorial");
    this.logResult("Editorial layout does not change the loaded splat", stage.dataset.splat === "autovan");
    this.logResult("Editorial layout is recorded on the shell", editorial === "editorial");
    this.logResult("Unknown layout falls back to studio", applyLayout(stage, "nope") === "studio");
    this.logResult("Catalog layout is accepted", applyLayout(stage, "catalog") === "catalog");

    const hdr = assetUrl("/environmentMaps/hdr/softbox.hdr");
    const base = import.meta.env.BASE_URL || "/";
    this.logResult(
      "HDR preset paths are base-relative",
      hdr === `${base}environmentMaps/hdr/softbox.hdr`,
    );
    this.logResult("Remote URLs are not rewritten", assetUrl("https://example.com/a.hdr") === "https://example.com/a.hdr");
    this.logResult("Base prefix is not applied twice", assetUrl(hdr) === hdr);

    root.remove();
    this.logResult("Settings Tests Complete", true);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  new SettingsTest();
});
