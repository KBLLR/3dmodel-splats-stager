/**
 * Settings that sit on top of the original viewer: hide/show, splash copy,
 * and a few view flags. Defaults come from the splat record, then a saved
 * edit, then the URL (so a shared link wins).
 */
import { normalizeLayout } from "./layouts";

export const SETTINGS_KEY = "splats-stager.settings.v1";

export const ORIGINAL_SPLASH = {
  title: "Innovate –",
  subtitle: "with a human touch.",
  text: "This Text will be auto-generated based on the Stage resulting of our generator. AI will come after to assist.",
  showSplash: true,
};

function nonEmpty(value) {
  return typeof value === "string" && value.trim() ? value : "";
}

export function readStoredSettings(storage) {
  const store = storage || (typeof localStorage !== "undefined" ? localStorage : null);
  if (!store) return {};
  try {
    const raw = store.getItem(SETTINGS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function writeStoredSettings(settings, storage) {
  const store = storage || (typeof localStorage !== "undefined" ? localStorage : null);
  if (!store) return;
  try {
    store.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Private mode and blocked storage should not break the viewer.
  }
}

export function parseViewerSearch(search = "") {
  const query = search.startsWith("?") || search === "" ? search : `?${search}`;
  const params = new URLSearchParams(query);
  const splashFlag = params.get("splash");
  return {
    title: params.get("title"),
    subtitle: params.get("subtitle"),
    text: params.get("text") ?? params.get("intro"),
    showSplash: splashFlag == null ? null : splashFlag !== "0" && splashFlag !== "false",
    layout: params.get("layout"),
    splat: params.get("splat"),
    camera: params.get("camera"),
    movement: params.get("movement"),
    effect: params.get("effect"),
    theme: params.get("theme"),
  };
}

export function resolveSplash({ record = null, search = "", stored = null } = {}) {
  const url = parseViewerSearch(search);
  const fromRecord = {
    title: nonEmpty(record?.title) || ORIGINAL_SPLASH.title,
    subtitle: nonEmpty(record?.subtitle) || ORIGINAL_SPLASH.subtitle,
    text: nonEmpty(record?.description) || ORIGINAL_SPLASH.text,
    showSplash: true,
  };

  const pick = (key) => {
    if (nonEmpty(url[key])) return url[key];
    if (stored && nonEmpty(stored[key])) return stored[key];
    return fromRecord[key];
  };

  let showSplash = fromRecord.showSplash;
  if (stored && typeof stored.showSplash === "boolean") showSplash = stored.showSplash;
  if (typeof url.showSplash === "boolean") showSplash = url.showSplash;

  return {
    title: pick("title"),
    subtitle: pick("subtitle"),
    text: pick("text"),
    showSplash,
  };
}

export function toggleSettingsHidden(hidden) {
  return !hidden;
}

export function settingsToggleLabel(hidden) {
  return hidden ? "Show settings" : "Hide settings";
}

export function isSettingsShortcut(event) {
  if (!event || event.metaKey || event.ctrlKey || event.altKey) return false;
  const target = event.target;
  if (target && typeof target.closest === "function") {
    if (target.closest("input, textarea, select, [contenteditable='true']")) return false;
  }
  return event.key === "h" || event.key === "H" || event.key === ".";
}

export function applySettingsVisibility(root, hidden) {
  const isHidden = Boolean(hidden);
  if (root?.dataset) root.dataset.settings = isHidden ? "hidden" : "open";
  const scope = root?.querySelector ? root : document;
  const button = scope.querySelector?.("[data-settings-toggle]") || document.querySelector("[data-settings-toggle]");
  if (!button) return isHidden;
  button.setAttribute("aria-expanded", isHidden ? "false" : "true");
  button.setAttribute("aria-label", settingsToggleLabel(isHidden));
  button.title = `${settingsToggleLabel(isHidden)} (H or .)`;
  const text = button.querySelector("[data-settings-label]");
  if (text) text.textContent = isHidden ? "Show" : "Hide";
  return isHidden;
}

export function initialLayout(search, stored) {
  const url = parseViewerSearch(search);
  return normalizeLayout(url.layout || stored?.layout, "studio");
}
