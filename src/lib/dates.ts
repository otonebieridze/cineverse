// TMDB dates are plain calendar days ("1963-12-18"), which `new Date` reads as UTC midnight.
// Formatting them in UTC too keeps the same day for viewers in every time zone; in local
// time, anyone west of UTC would see the day before.
const DATE_FORMAT = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" });

export function formatDate(isoDate: string): string | null {
  const date = new Date(isoDate);
  return Number.isNaN(date.getTime()) ? null : DATE_FORMAT.format(date);
}
