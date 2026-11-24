import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type WatchRegionState = {
  // The country the visitor picked, or null to follow the browser language.
  region: string | null;
  setRegion: (region: string) => void;
};

export const useWatchRegionStore = create<WatchRegionState>()(
  persist(
    (set) => ({
      region: null,
      setRegion: (region) => set({ region }),
    }),
    {
      name: "cineverse-watch-region",
      partialize: ({ region }) => ({ region }),
      skipHydration: true,
    },
  ),
);

function subscribeToHydration(onChange: () => void) {
  return useWatchRegionStore.persist.onFinishHydration(onChange);
}

function getHasHydrated() {
  return useWatchRegionStore.persist.hasHydrated();
}

export function useWatchRegionHydrated(): boolean {
  return useSyncExternalStore(subscribeToHydration, getHasHydrated, () => false);
}
