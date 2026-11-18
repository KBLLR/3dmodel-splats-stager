import { visibleMeta } from "@splats/fields";

export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function compositionSwitch(compositions, selectedId) {
  const buttons = compositions
    .map((composition) => {
      const active = composition.id === selectedId;
      return `<button type="button" class="segment-button${active ? " is-active" : ""}" data-action="composition" data-id="${escapeHtml(composition.id)}" aria-pressed="${active}">${escapeHtml(composition.label)}</button>`;
    })
    .join("");
  return `<div class="segment" role="group" aria-label="Layout">${buttons}</div>`;
}

export function selectField(label, action, items, selectedId) {
  const options = items
    .map((item) => {
      const selected = item.id === selectedId ? " selected" : "";
      return `<option value="${escapeHtml(item.id)}"${selected}>${escapeHtml(item.name)}</option>`;
    })
    .join("");
  return `<label class="field"><span>${escapeHtml(label)}</span><select data-action="${escapeHtml(action)}" aria-label="${escapeHtml(label)}">${options}</select></label>`;
}

export function effectChips(effects, selectedId) {
  const chips = effects
    .map((effect) => {
      const active = effect.id === selectedId;
      return `<button type="button" class="chip${active ? " is-active" : ""}" data-action="effect" data-id="${escapeHtml(effect.id)}" aria-pressed="${active}">${escapeHtml(effect.name)}</button>`;
    })
    .join("");
  return `<div class="field"><span>Effect</span><div class="chips" role="group" aria-label="Effect">${chips}</div></div>`;
}

export function metaBlock(record) {
  if (!record) {
    return `<p class="empty-meta">No splat selected.</p>`;
  }
  const rows = visibleMeta(record);
  if (rows.length === 0) {
    return `<p class="empty-meta">This record does not show any metadata fields.</p>`;
  }

  const parts = [];
  const details = [];
  rows.forEach((row) => {
    if (row.id === "title") {
      parts.push(`<h1>${escapeHtml(row.value)}</h1>`);
      return;
    }
    if (row.id === "description") {
      parts.push(`<p class="lede">${escapeHtml(row.value)}</p>`);
      return;
    }
    details.push(
      `<div class="meta-row"><dt>${escapeHtml(row.label)}</dt><dd>${escapeHtml(row.value)}</dd></div>`,
    );
  });

  if (details.length > 0) {
    parts.push(`<dl class="meta-list">${details.join("")}</dl>`);
  }
  return `<div class="meta">${parts.join("")}</div>`;
}

export function statusLine(message) {
  return `<p class="status" role="status">${escapeHtml(message || "")}</p>`;
}

export function brand() {
  return `<div class="brand"><span class="brand-mark">Splat</span><span class="brand-sub">Template</span></div>`;
}
