import { afterEach, describe, expect, it, vi } from "vitest";
import { formatDate } from "@/lib/dates";

describe("formatDate", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("formats a TMDB date as a readable day", () => {
    expect(formatDate("1963-12-18")).toBe("December 18, 1963");
  });

  it("shows the same day for viewers west of UTC", async () => {
    // The formatter is created on import, so load a fresh copy inside the new time zone.
    vi.stubEnv("TZ", "America/Los_Angeles");
    vi.resetModules();
    const { formatDate: formatDateInLosAngeles } = await import("@/lib/dates");

    expect(formatDateInLosAngeles("2000-01-01")).toBe("January 1, 2000");
  });

  it.each(["", "unknown", "1963-13-45"])("returns null for the invalid date %j", (isoDate) => {
    expect(formatDate(isoDate)).toBeNull();
  });
});
