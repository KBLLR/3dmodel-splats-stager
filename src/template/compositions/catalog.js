import { brand, compositionSwitch, effectChips, escapeHtml, metaBlock, selectField, statusLine } from "../markup";

export const catalogComposition = {
  id: "catalog",
  label: "Catalog",
  render(state) {
    const cards = state.splats
      .map((splat) => {
        const active = splat.id === state.active?.id;
        const kind = splat.source?.kind === "ply" ? "PLY" : "Luma";
        const demo = splat.demo ? " · Demo" : "";
        return `<button type="button" class="splat-card${active ? " is-active" : ""}" data-action="splat" data-id="${escapeHtml(splat.id)}" aria-pressed="${active}"><span class="card-kicker">${escapeHtml(kind)}${escapeHtml(demo)}</span><span class="card-title">${escapeHtml(splat.title)}</span></button>`;
      })
      .join("");

    return `<div class="shell shell-catalog">
      <header class="topbar">${brand()}${compositionSwitch(state.compositions, state.compositionId)}</header>
      <div class="card-rail" aria-label="Splat catalog">${cards}</div>
      <footer class="catalog-detail panel">
        ${metaBlock(state.active)}
        <div class="catalog-controls">
          ${selectField("Camera", "camera", state.cameras, state.cameraId)}
          ${selectField("Movement", "movement", state.movements, state.movementId)}
          ${effectChips(state.effects, state.effectId)}
        </div>
        ${statusLine(state.statusMessage)}
      </footer>
    </div>`;
  },
};
