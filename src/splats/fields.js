const FIELD_LABELS = {
  title: "Title",
  description: "Description",
  captureDate: "Captured",
  tags: "Tags",
  location: "Location",
  source: "Source",
};

export function fieldLabel(field) {
  return FIELD_LABELS[field] ?? field;
}

export function fieldValue(record, field) {
  switch (field) {
    case "title":
      return record.title || "Untitled";
    case "description":
      return record.description || "No description";
    case "captureDate":
      return record.captureDate || "Not recorded";
    case "tags":
      return Array.isArray(record.tags) && record.tags.length > 0 ? record.tags.join(" · ") : "None";
    case "location":
      return record.location || "Not recorded";
    case "source":
      if (record.source?.kind === "luma") return "Luma capture";
      if (record.source?.kind === "ply") return "PLY reference";
      return "Unknown source";
    default:
      return "";
  }
}

export function visibleMeta(record) {
  const fields = Array.isArray(record.visibleFields) ? record.visibleFields : [];
  return fields
    .filter((field) => Object.prototype.hasOwnProperty.call(FIELD_LABELS, field))
    .map((field) => ({
      id: field,
      label: fieldLabel(field),
      value: fieldValue(record, field),
    }));
}
