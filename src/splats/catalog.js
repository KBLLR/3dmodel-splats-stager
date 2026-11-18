/**
 * One JSON file per splat. The old LUMA_SPLATS and LUMA_MODELS lists are derived
 * from these records so a capture URL lives in one place.
 *
 * TREE is not a record. In src/config/lumaSplats.js it repeated AUTOVAN's URL.
 * In src/presets/lumaLabsModels.js the same id was truncated with a trailing "l".
 */

const recordModules = import.meta.glob("./records/*.json", {
  eager: true,
  import: "default",
});

function assertRecord(record) {
  if (!record || typeof record.id !== "string" || typeof record.title !== "string") {
    throw new Error("Splat record is missing an id or title");
  }
  if (!record.source || (record.source.kind !== "luma" && record.source.kind !== "ply")) {
    throw new Error(`Splat record ${record.id} has an unknown source kind`);
  }
  if (typeof record.source.url !== "string" || record.source.url.length === 0) {
    throw new Error(`Splat record ${record.id} is missing a source URL`);
  }
  if (!Array.isArray(record.visibleFields)) {
    throw new Error(`Splat record ${record.id} is missing visibleFields`);
  }
}

export const SPLAT_RECORDS = Object.values(recordModules)
  .map((record) => {
    assertRecord(record);
    return record;
  })
  .sort((a, b) => Number(Boolean(b.demo)) - Number(Boolean(a.demo)) || a.title.localeCompare(b.title));

export const MODEL_PRESETS = Object.fromEntries(SPLAT_RECORDS.map((record) => [record.id, record]));

function legacyMap(listName) {
  return Object.fromEntries(
    SPLAT_RECORDS.filter(
      (record) =>
        record.source.kind === "luma" &&
        record.legacyKey &&
        Array.isArray(record.legacyLists) &&
        record.legacyLists.includes(listName),
    ).map((record) => [record.legacyKey, record.source.url]),
  );
}

export const LUMA_SPLATS = legacyMap("lumaSplats");
export const LUMA_MODELS = legacyMap("lumaModels");

export function getSplatRecord(id) {
  return MODEL_PRESETS[id] ?? null;
}

export function listSplatRecords() {
  return SPLAT_RECORDS;
}
