/**
 * The three approved layouts. They only change where the original
 * Studio Labs plates, title, and metadata sit (`data-layout` on body).
 * Switching layout must not reload the splat.
 */
export const LAYOUTS = [
  {
    id: "studio",
    label: "Studio",
    description: "Original frame: date plate top left, display type along the bottom, settings top right.",
  },
  {
    id: "editorial",
    label: "Editorial",
    description: "Display type takes the left, the date plate moves to the right column.",
  },
  {
    id: "catalog",
    label: "Catalog",
    description: "A rail of the original plates lists every splat. The selected record keeps the bottom title.",
  },
];

export function isLayout(id) {
  return LAYOUTS.some((layout) => layout.id === id);
}

export function normalizeLayout(id, fallback = "studio") {
  return isLayout(id) ? id : fallback;
}

export function applyLayout(root, id) {
  const layout = normalizeLayout(id);
  if (root?.dataset) root.dataset.layout = layout;
  return layout;
}
