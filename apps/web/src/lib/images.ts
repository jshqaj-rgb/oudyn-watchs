export function isPlaceholderImage(src?: string | null): boolean {
  if (!src) return true;
  return src.startsWith("/images/rolex/") || src.includes("placeholder-watch");
}
