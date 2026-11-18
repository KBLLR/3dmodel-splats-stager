import { brand, compositionSwitch, effectChips, escapeHtml, metaBlock, selectField, statusLine } from "../markup";

export const studioComposition = {
  id: "studio",
  label: "Studio",
  render(state) {
    const splats = state.splats
      .map((splat) => {
        const active = splat.id === state.active?.id;
        const badge = splat.demo ? `<em>Demo</em>` : "";
        return `<button type="button" class="splat-button${active ? " is-active" : ""}" data-action="splat" data-id="${escapeHtml(splat.id)}" aria-pressed="${active}"><span>${escapeHtml(splat.title)}</span>${badge}</button>`;
      })
      .join("");

    return `<div class="shell shell-studio">
      <header class="topbar">${brand()}${compositionSwitch(state.compositions, state.compositionId)}</header>
      <aside class="panel">
        <p class="eyebrow">Library</p>
        <div class="splat-list" role="listbox" aria-label="Splats">${splats}</div>
        <p class="eyebrow">Showing</p>
        ${metaBlock(state.active)}
        ${selectField("Camera", "camera", state.cameras, state.cameraId)}
        ${selectField("Movement", "movement", state.movements, state.movementId)}
        ${effectChips(state.effects, state.effectId)}
        ${statusLine(state.statusMessage)}
      </aside>
    </div>`;
  },
};
