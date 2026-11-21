export function isValidTmdbId(id: string): boolean {
  return /^\d+$/.test(id);
}
