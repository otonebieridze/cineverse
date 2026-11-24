import { describe, expect, it } from "vitest";
import { findWatchRegion, toWatchProviderData, type WatchRegion } from "@/lib/watchProviders";
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

function dataFor(results: Record<string, WatchProviderCountry>) {
  return toWatchProviderData({ id: 1, results });
}

function usRegion(lists: Omit<WatchProviderCountry, "link">) {
  return findWatchRegion(dataFor({ US: country(lists) }), "US");
}

function labels(region: WatchRegion | null) {
  return region?.groups.map(({ label }) => label);
}

function providerIds(region: WatchRegion | null, label: string) {
  return region?.groups
    .find((group) => group.label === label)
    ?.providers.map(({ provider_id }) => provider_id);
}

describe("watch provider data", () => {
  it("orders the groups Stream, Free, Rent, Buy", () => {
    const region = usRegion({
      buy: [provider(1, 1)],
      rent: [provider(2, 1)],
      ads: [provider(3, 1)],
      flatrate: [provider(4, 1)],
    });

    expect(labels(region)).toEqual(["Stream", "Free", "Rent", "Buy"]);
  });

  it("sorts providers by display priority", () => {
    const region = usRegion({ flatrate: [provider(1, 30), provider(2, 2), provider(3, 15)] });

    expect(providerIds(region, "Stream")).toEqual([2, 3, 1]);
  });

  it("sorts providers with the same priority by name", () => {
    const region = usRegion({ flatrate: [provider(1, 5, "Zeta"), provider(2, 5, "Alpha")] });

    expect(providerIds(region, "Stream")).toEqual([2, 1]);
  });

  it("leaves out groups without providers", () => {
    const region = usRegion({ rent: [provider(1, 1)], buy: [] });

    expect(labels(region)).toEqual(["Rent"]);
  });

  it("merges free and ad-supported providers into Free, listing each provider once", () => {
    const region = usRegion({
      free: [provider(1, 3), provider(2, 9)],
      ads: [provider(3, 1), provider(2, 9)],
    });

    expect(providerIds(region, "Free")).toEqual([3, 1, 2]);
  });

  it("keeps only the fields the page shows", () => {
    const region = usRegion({ flatrate: [provider(1, 1, "Netflix")] });

    expect(region?.groups[0].providers).toEqual([
      { provider_id: 1, provider_name: "Netflix", logo_path: "/logo-1.jpg" },
    ]);
  });

  it("keeps TMDB's watch page link for each country", () => {
    const data = dataFor({
      US: country({ buy: [provider(1, 1)] }),
      DE: { link: "https://www.themoviedb.org/movie/1/watch?locale=DE", buy: [provider(1, 1)] },
    });

    expect(findWatchRegion(data, "DE")?.link).toBe(
      "https://www.themoviedb.org/movie/1/watch?locale=DE",
    );
  });

  // A popular movie lists the same providers in over a hundred countries.
  it("stores each provider's details once, however many countries list it", () => {
    const data = dataFor({
      US: country({ flatrate: [provider(1, 1)] }),
      DE: country({ flatrate: [provider(1, 1)], buy: [provider(1, 1)] }),
    });

    expect(Object.keys(data.providers)).toEqual(["1"]);
    expect(providerIds(findWatchRegion(data, "DE"), "Buy")).toEqual([1]);
  });

  it("leaves out countries without any providers", () => {
    const data = dataFor({ US: country({ buy: [provider(1, 1)] }), GE: country() });

    expect(Object.keys(data.regions)).toEqual(["US"]);
  });

  it("has no countries when the movie has no streaming information", () => {
    expect(dataFor({}).regions).toEqual({});
  });
});

describe("findWatchRegion", () => {
  const data = dataFor({ US: country({ buy: [provider(1, 1)] }) });

  it("returns the chosen country's providers", () => {
    expect(labels(findWatchRegion(data, "US"))).toEqual(["Buy"]);
  });

  it("returns null for a country without streaming information", () => {
    expect(findWatchRegion(data, "GE")).toBeNull();
  });

  it("ignores codes that only match built-in object properties", () => {
    expect(findWatchRegion(data, "constructor")).toBeNull();
  });
});
