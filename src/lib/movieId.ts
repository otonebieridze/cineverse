export function isValidMovieId(id: string): boolean {
  return /^\d+$/.test(id);
}
