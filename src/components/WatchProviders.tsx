"use client";

import { type ChangeEvent, useEffect, useState, useSyncExternalStore } from "react";
import { ExternalLink } from "@/components/ExternalLink";
import { WatchProviderGroups } from "@/components/WatchProviderGroups";
import {
  WATCH_PROVIDERS_BODY_CLASS_NAME,
  WatchProvidersSkeleton,
} from "@/components/WatchProvidersSkeleton";
import { getRegionName, regionFromLanguage } from "@/lib/regions";
import { findWatchRegion, type WatchProviderData } from "@/lib/watchProviders";
import { useWatchRegionHydrated, useWatchRegionStore } from "@/stores/useWatchRegionStore";

type WatchProvidersProps = {
  data: WatchProviderData;
};

function subscribeToLanguage(onChange: () => void) {
  window.addEventListener("languagechange", onChange);
  return () => window.removeEventListener("languagechange", onChange);
}

function getLanguage() {
  return navigator.language;
}

// The server can't know the visitor's language, so it renders the placeholder.
function getServerLanguage() {
  return null;
}

function emptyMessage(regionName: string) {
  return `No streaming information for ${regionName}.`;
}

export function WatchProviders({ data }: WatchProvidersProps) {
  const hydrated = useWatchRegionHydrated();
  const chosenRegion = useWatchRegionStore((state) => state.region);
  const setRegion = useWatchRegionStore((state) => state.setRegion);
  const language = useSyncExternalStore(subscribeToLanguage, getLanguage, getServerLanguage);
  // Set only when the visitor changes the country, so loading the page announces nothing.
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    if (!useWatchRegionStore.persist.hasHydrated()) {
      void useWatchRegionStore.persist.rehydrate();
    }
  }, []);

  if (!hydrated || language === null) {
    return <WatchProvidersSkeleton />;
  }

  const browserRegion = regionFromLanguage(language);
  const region = chosenRegion ?? browserRegion;
  const watchRegion = findWatchRegion(data, region);
  const regionName = getRegionName(region);
  // Countries with data, plus the current and browser-language countries even without data,
  // so a visitor who switched away can always switch back to their own country.
  const codes = new Set([...Object.keys(data.regions), region, browserRegion]);
  const options = [...codes]
    .map((code) => ({ code, name: getRegionName(code) }))
    .toSorted((a, b) => a.name.localeCompare(b.name));

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const code = event.target.value;
    const name = getRegionName(code);
    setRegion(code);
    setAnnouncement(
      findWatchRegion(data, code)
        ? `Showing streaming options for ${name}.`
        : emptyMessage(name),
    );
  }

  return (
    <div className={WATCH_PROVIDERS_BODY_CLASS_NAME}>
      <label className="block w-full sm:w-72">
        <span className="text-sm font-medium text-muted">Country</span>
        <select
          value={region}
          onChange={handleChange}
          className="mt-2 h-11 w-full rounded-full border border-border bg-background px-4 text-sm"
        >
          {options.map(({ code, name }) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
      </label>

      {watchRegion ? (
        <>
          <WatchProviderGroups groups={watchRegion.groups} />
          <p className="mt-6 text-sm">
            <ExternalLink
              href={watchRegion.link}
              className="rounded-sm font-medium text-accent underline-offset-4 hover:underline"
            >
              See all options on TMDB
            </ExternalLink>
          </p>
        </>
      ) : (
        <p className="mt-6 text-muted">{emptyMessage(regionName)}</p>
      )}

      <p role="status" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}
