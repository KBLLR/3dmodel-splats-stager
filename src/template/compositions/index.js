import { catalogComposition } from "./catalog";
import { editorialComposition } from "./editorial";
import { studioComposition } from "./studio";

export const COMPOSITIONS = [studioComposition, editorialComposition, catalogComposition];

export function renderComposition(compositionId, state) {
  const composition = COMPOSITIONS.find((item) => item.id === compositionId) ?? studioComposition;
  return composition.render(state);
}
