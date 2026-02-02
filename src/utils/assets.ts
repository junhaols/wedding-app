/**
 * Prepend Vite's base URL to asset paths.
 * In dev: base = '/'
 * In production (gh-pages): base = '/wedding-app/'
 */
const base = import.meta.env.BASE_URL;

export function assetUrl(path: string): string {
  // If path already starts with base, return as-is
  if (path.startsWith(base)) return path;
  // Remove leading slash from path, base already ends with /
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${cleanPath}`;
}
