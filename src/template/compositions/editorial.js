import { brand, compositionSwitch, effectChips, escapeHtml, metaBlock, selectField, statusLine } from "../markup";

export const editorialComposition = {
  id: "editorial",
  label: "Editorial",
  render(state) {
    const source = state.active?.source?.kind === "ply" ? "PLY reference" : "Luma capture";
    return `<div class="shell shell-editorial">
      <header class="topbar topbar-ghost">${brand()}${compositionSwitch(state.compositions, state.compositionId)}</header>
      <section class="editorial-copy">
        <p class="eyebrow">${escapeHtml(source)}</p>
        ${metaBlock(state.active)}
        <div class="editorial-controls">
          ${selectField("Splat", "splat", state.splats.map((splat) => ({ id: splat.id, name: splat.title })), state.active?.id)}
          ${selectField("Camera", "camera", state.cameras, state.cameraId)}
          ${selectField("Movement", "movement", state.movements, state.movementId)}
          ${effectChips(state.effects, state.effectId)}
        </div>
        ${statusLine(state.statusMessage)}
      </section>
    </div>`;
  },
};
