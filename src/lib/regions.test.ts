import { describe, expect, it } from "vitest";
import { getRegionName, regionFromLanguage } from "@/lib/regions";

describe("regionFromLanguage", () => {
  it.each([
    ["en-US", "US"],
    ["en-GB", "GB"],
    ["pt-BR", "BR"],
  ])("uses the region written in %s", (language, region) => {
    expect(regionFromLanguage(language)).toBe(region);
  });

  it.each([
    ["en", "US"],
    ["ka", "GE"],
    ["de", "DE"],
  ])("uses the likeliest region for a bare language like %s", (language, region) => {
    expect(regionFromLanguage(language)).toBe(region);
  });

  it("falls back to the US for a region that isn't a country", () => {
    expect(regionFromLanguage("es-419")).toBe("US");
  });

  it("falls back to the US for an invalid language tag", () => {
    expect(regionFromLanguage("not a language!")).toBe("US");
  });
});

describe("getRegionName", () => {
  it.each([
    ["GE", "Georgia"],
    ["US", "United States"],
    ["AQ", "Antarctica"],
  ])("names %s in English", (code, name) => {
    expect(getRegionName(code)).toBe(name);
  });

  it("shows the code when the country has no name", () => {
    expect(getRegionName("QM")).toBe("QM");
  });

  it("shows the code when it isn't a valid region code", () => {
    expect(getRegionName("not a code")).toBe("not a code");
  });
});
