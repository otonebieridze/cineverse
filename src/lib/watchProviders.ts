import type { WatchProvider, WatchProviderCountry, WatchProvidersResponse } from "@/types/tmdb";

type ProviderListKey = Exclude<keyof WatchProviderCountry, "link">;

// The groups in display order, and the TMDB lists that feed each one.
export const WATCH_GROUPS = [
  { label: "Stream", keys: ["flatrate"] },
  { label: "Free", keys: ["free", "ads"] },
  { label: "Rent", keys: ["rent"] },
  { label: "Buy", keys: ["buy"] },
] as const satisfies readonly { label: string; keys: readonly ProviderListKey[] }[];

export type WatchGroupLabel = (typeof WATCH_GROUPS)[number]["label"];

// Only the fields the page renders, so the client receives as little as possible.
export type WatchProviderSummary = Pick<
  WatchProvider,
  "provider_id" | "provider_name" | "logo_path"
>;

export type WatchGroup = {
  label: WatchGroupLabel;
  providers: WatchProviderSummary[];
};

export type WatchRegion = {
  // TMDB's watch page for this country; TMDB gives no links to the services themselves.
  link: string;
  groups: WatchGroup[];
};

export type WatchRegions = Record<string, WatchRegion>;

function toGroupProviders(
  country: WatchProviderCountry,
  keys: readonly ProviderListKey[],
): WatchProviderSummary[] {
  const seen = new Set<number>();
  const providers = keys
    .flatMap((key) => country[key] ?? [])
    .filter(({ provider_id }) => {
      if (seen.has(provider_id)) {
        return false;
      }
      seen.add(provider_id);
      return true;
    });

  return providers
    .toSorted(
      (a, b) =>
        a.display_priority - b.display_priority || a.provider_name.localeCompare(b.provider_name),
    )
    .map(({ provider_id, provider_name, logo_path }) => ({ provider_id, provider_name, logo_path }));
}

export function toWatchRegions(response: WatchProvidersResponse): WatchRegions {
  const regions: WatchRegions = {};

  for (const [code, country] of Object.entries(response.results)) {
    const groups = WATCH_GROUPS.map(({ label, keys }) => ({
      label,
      providers: toGroupProviders(country, keys),
    })).filter(({ providers }) => providers.length > 0);

    if (groups.length > 0) {
      regions[code] = { link: country.link, groups };
    }
  }

  return regions;
}

// The code can come from localStorage, so only the countries themselves count as a match.
export function findWatchRegion(regions: WatchRegions, code: string): WatchRegion | null {
  return Object.hasOwn(regions, code) ? regions[code] : null;
}
