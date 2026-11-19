function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function renderCatalogRail(splats, activeId) {
  return splats
    .map((splat) => {
      const active = splat.id === activeId;
      const kind = splat.source?.kind === "ply" ? "PLY" : "Luma";
      return `<button type="button" class="catalog-card${active ? " is-active" : ""}" data-splat-id="${escapeHtml(splat.id)}" aria-pressed="${active}"><span class="catalog-card-kicker">${escapeHtml(kind)}</span><span class="catalog-card-title">${escapeHtml(splat.title)}</span></button>`;
    })
    .join("");
}
