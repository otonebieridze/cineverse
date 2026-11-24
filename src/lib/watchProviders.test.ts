import { describe, expect, it } from "vitest";
import { findWatchRegion, toWatchRegions, type WatchRegion } from "@/lib/watchProviders";
import type { WatchProvider, WatchProviderCountry } from "@/types/tmdb";

function provider(id: number, displayPriority: number, name = `Provider ${id}`): WatchProvider {
  return {
    provider_id: id,
    provider_name: name,
    logo_path: `/logo-${id}.jpg`,
    display_priority: displayPriority,
  };
}

function country(lists: Omit<WatchProviderCountry, "link"> = {}): WatchProviderCountry {
  return { link: "https://www.themoviedb.org/movie/1/watch?locale=US", ...lists };
}

function regionsFor(results: Record<string, WatchProviderCountry>) {
  return toWatchRegions({ id: 1, results });
}

function labels(region: WatchRegion | undefined) {
  return region?.groups.map(({ label }) => label);
}

function providerIds(region: WatchRegion | undefined, label: string) {
  return region?.groups
    .find((group) => group.label === label)
    ?.providers.map(({ provider_id }) => provider_id);
}

describe("toWatchRegions", () => {
  it("orders the groups Stream, Free, Rent, Buy", () => {
    const { US } = regionsFor({
      US: country({
        buy: [provider(1, 1)],
        rent: [provider(2, 1)],
        ads: [provider(3, 1)],
        flatrate: [provider(4, 1)],
      }),
    });

    expect(labels(US)).toEqual(["Stream", "Free", "Rent", "Buy"]);
  });

  it("sorts providers by display priority", () => {
    const { US } = regionsFor({
      US: country({ flatrate: [provider(1, 30), provider(2, 2), provider(3, 15)] }),
    });

    expect(providerIds(US, "Stream")).toEqual([2, 3, 1]);
  });

  it("sorts providers with the same priority by name", () => {
    const { US } = regionsFor({
      US: country({ flatrate: [provider(1, 5, "Zeta"), provider(2, 5, "Alpha")] }),
    });

    expect(providerIds(US, "Stream")).toEqual([2, 1]);
  });

  it("leaves out groups without providers", () => {
    const { US } = regionsFor({ US: country({ rent: [provider(1, 1)], buy: [] }) });

    expect(labels(US)).toEqual(["Rent"]);
  });

  it("merges free and ad-supported providers into Free, listing each provider once", () => {
    const { US } = regionsFor({
      US: country({ free: [provider(1, 3), provider(2, 9)], ads: [provider(3, 1), provider(2, 9)] }),
    });

    expect(providerIds(US, "Free")).toEqual([3, 1, 2]);
  });

  it("keeps only the fields the page shows", () => {
    const { US } = regionsFor({ US: country({ flatrate: [provider(1, 1, "Netflix")] }) });

    expect(US?.groups[0].providers).toEqual([
      { provider_id: 1, provider_name: "Netflix", logo_path: "/logo-1.jpg" },
    ]);
  });

  it("keeps TMDB's watch page link for each country", () => {
    const { DE } = regionsFor({
      DE: {
        link: "https://www.themoviedb.org/movie/1/watch?locale=DE",
        buy: [provider(1, 1)],
      },
    });

    expect(DE?.link).toBe("https://www.themoviedb.org/movie/1/watch?locale=DE");
  });

  it("leaves out countries without any providers", () => {
    const regions = regionsFor({ US: country({ buy: [provider(1, 1)] }), GE: country() });

    expect(Object.keys(regions)).toEqual(["US"]);
  });

  it("returns no countries when the movie has no streaming information", () => {
    expect(regionsFor({})).toEqual({});
  });
});

describe("findWatchRegion", () => {
  const regions = regionsFor({ US: country({ buy: [provider(1, 1)] }) });

  it("returns the chosen country's providers", () => {
    expect(labels(findWatchRegion(regions, "US") ?? undefined)).toEqual(["Buy"]);
  });

  it("returns null for a country without streaming information", () => {
    expect(findWatchRegion(regions, "GE")).toBeNull();
  });

  it("ignores codes that only match built-in object properties", () => {
    expect(findWatchRegion(regions, "constructor")).toBeNull();
  });
});
