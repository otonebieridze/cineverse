import { beforeEach, describe, expect, it } from "vitest";
import { useWatchRegionStore } from "@/stores/useWatchRegionStore";

const STORAGE_KEY = "cineverse-watch-region";

function region() {
  return useWatchRegionStore.getState().region;
}

function readStorage(): unknown {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw === null ? null : JSON.parse(raw);
}

// The store is a module-level singleton, so every test starts from a clean slate.
beforeEach(() => {
  useWatchRegionStore.setState({ region: null });
  localStorage.clear();
});

describe("setRegion", () => {
  it("starts without a chosen country, so the browser language decides", () => {
    expect(region()).toBeNull();
  });

  it("remembers the chosen country", () => {
    useWatchRegionStore.getState().setRegion("DE");

    expect(region()).toBe("DE");
  });
});

describe("persistence", () => {
  // Changing this key or shape would silently forget every visitor's chosen country.
  it("saves the chosen country to localStorage under a stable key and shape", () => {
    useWatchRegionStore.getState().setRegion("DE");

    expect(readStorage()).toEqual({ state: { region: "DE" }, version: 0 });
  });

  it("restores the saved country when it rehydrates", async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ state: { region: "GE" }, version: 0 }));

    await useWatchRegionStore.persist.rehydrate();

    expect(region()).toBe("GE");
  });
});
