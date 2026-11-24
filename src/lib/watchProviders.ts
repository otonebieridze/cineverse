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

// Only the fields the page renders.
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

export type WatchProviderData = {
  providers: Record<number, WatchProviderSummary>;
  regions: Record<
    string,
    { link: string; groups: Partial<Record<WatchGroupLabel, number[]>> }
  >;
};

function sortedProviders(
  country: WatchProviderCountry,
  keys: readonly ProviderListKey[],
): WatchProvider[] {
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

  return providers.toSorted(
    (a, b) =>
      a.display_priority - b.display_priority || a.provider_name.localeCompare(b.provider_name),
  );
}

export function toWatchProviderData(response: WatchProvidersResponse): WatchProviderData {
  const data: WatchProviderData = { providers: {}, regions: {} };

  for (const [code, country] of Object.entries(response.results)) {
    const groups: Partial<Record<WatchGroupLabel, number[]>> = {};

    for (const { label, keys } of WATCH_GROUPS) {
      const providers = sortedProviders(country, keys);
      if (providers.length === 0) {
        continue;
      }
      groups[label] = providers.map(({ provider_id, provider_name, logo_path }) => {
        data.providers[provider_id] = { provider_id, provider_name, logo_path };
        return provider_id;
      });
    }

    if (Object.keys(groups).length > 0) {
      data.regions[code] = { link: country.link, groups };
    }
  }

  return data;
}

// The code can come from localStorage, so only the countries themselves count as a match.
export function findWatchRegion(data: WatchProviderData, code: string): WatchRegion | null {
  if (!Object.hasOwn(data.regions, code)) {
    return null;
  }

  const { link, groups } = data.regions[code];
  return {
    link,
    groups: WATCH_GROUPS.flatMap(({ label }) => {
      const ids = groups[label];
      return ids ? [{ label, providers: ids.map((id) => data.providers[id]) }] : [];
    }),
  };
}
