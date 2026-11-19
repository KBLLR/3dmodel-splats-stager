/**
 * Prefix a site-root asset path with Vite's base so GitHub Pages
 * (served from /3dmodel-splats-stager/) and `vite` dev (served from /)
 * resolve the same public files. Absolute http(s), data, and blob URLs
 * are left alone. Already-prefixed paths are not prefixed twice.
 */
export function assetUrl(path) {
  if (typeof path !== "string" || path.length === 0) return path;
  if (/^[a-z][a-z0-9+.-]*:/i.test(path)) return path;

  const base = import.meta.env?.BASE_URL || "/";
  const prefix = base.endsWith("/") ? base : `${base}/`;
  if (path === prefix || path.startsWith(prefix)) return path;

  const relative = path.startsWith("/") ? path.slice(1) : path;
  return `${prefix}${relative}`;
}
