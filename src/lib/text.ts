const ELLIPSIS = "…";

// Shortens text to at most `maxLength` characters, ellipsis included, without cutting a
// word in half. Line breaks and repeated spaces become single spaces.
export function shortenText(text: string, maxLength: number): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }

  const room = maxLength - ELLIPSIS.length;
  // One extra character, so a word that ends exactly at the limit is kept whole.
  const lastSpace = normalized.slice(0, room + 1).lastIndexOf(" ");
  const shortened = normalized.slice(0, lastSpace > 0 ? lastSpace : room);
  return `${shortened.replace(/[\s.,;:!?-]+$/, "")}${ELLIPSIS}`;
}
