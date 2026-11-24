import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { WatchProviders } from "@/components/WatchProviders";
import { toWatchProviderData } from "@/lib/watchProviders";
import { useWatchRegionStore } from "@/stores/useWatchRegionStore";
import type { WatchProvider } from "@/types/tmdb";

function provider(id: number, name: string, displayPriority: number): WatchProvider {
  return {
    provider_id: id,
    provider_name: name,
    logo_path: `/logo-${id}.jpg`,
    display_priority: displayPriority,
  };
}

const DATA = toWatchProviderData({
  id: 1,
  results: {
    US: {
      link: "https://www.themoviedb.org/movie/1/watch?locale=US",
      flatrate: [provider(1, "Streamly", 1), provider(2, "FlixNow", 2)],
      free: [provider(3, "Free TV", 1)],
      rent: [provider(4, "Rent Shop", 1)],
      buy: [provider(4, "Rent Shop", 1), provider(5, "Movie Store", 2)],
    },
    DE: {
      link: "https://www.themoviedb.org/movie/1/watch?locale=DE",
      flatrate: [provider(6, "Kino Plus", 1)],
    },
  },
});

function stubBrowserLanguage(language: string) {
  vi.spyOn(navigator, "language", "get").mockReturnValue(language);
}

// The country picker appears once the saved choice and the browser language are known.
async function renderWatchProviders() {
  render(<WatchProviders data={DATA} />);
  return screen.findByRole("combobox", { name: "Country" });
}

function headingTexts() {
  return screen.getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent);
}

beforeEach(() => {
  useWatchRegionStore.setState({ region: null });
  localStorage.clear();
  stubBrowserLanguage("en-US");
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("WatchProviders", () => {
  it("shows the country of the browser language by default", async () => {
    stubBrowserLanguage("de-DE");

    const select = await renderWatchProviders();

    expect(select).toHaveDisplayValue("Germany");
    expect(screen.getByText("Kino Plus")).toBeInTheDocument();
  });

  it("shows the remembered country instead of the browser language's", async () => {
    stubBrowserLanguage("de-DE");
    useWatchRegionStore.setState({ region: "US" });

    const select = await renderWatchProviders();

    expect(select).toHaveDisplayValue("United States");
    expect(screen.queryByText("Kino Plus")).not.toBeInTheDocument();
  });

  it("groups providers under Stream, Free, Rent and Buy", async () => {
    await renderWatchProviders();

    expect(headingTexts()).toEqual(["Stream", "Free", "Rent", "Buy"]);
  });

  it("lists each provider by name, in the given order", async () => {
    await renderWatchProviders();

    expect(
      within(screen.getByRole("list", { name: "Stream" }))
        .getAllByRole("listitem")
        .map((item) => item.textContent),
    ).toEqual(["Streamly", "FlixNow"]);
  });

  it("treats logos as decorative because the name is written next to them", async () => {
    await renderWatchProviders();

    expect(screen.getByText("Streamly")).toBeInTheDocument();
    expect(screen.queryAllByRole("img")).toEqual([]);
  });

  it("links to TMDB's watch page for the country in a new tab", async () => {
    await renderWatchProviders();
    const link = screen.getByRole("link", {
      name: "See all options on TMDB (opens in a new tab)",
    });

    expect(link).toHaveAttribute("href", "https://www.themoviedb.org/movie/1/watch?locale=US");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("lists the countries with streaming information by name", async () => {
    const select = await renderWatchProviders();

    expect(
      within(select)
        .getAllByRole("option")
        .map((option) => option.textContent),
    ).toEqual(["Germany", "United States"]);
  });

  it("says so when the country has no streaming information", async () => {
    stubBrowserLanguage("ka");

    const select = await renderWatchProviders();

    expect(select).toHaveDisplayValue("Georgia");
    expect(screen.getByText("No streaming information for Georgia.")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /See all options/ })).not.toBeInTheDocument();
  });

  it("shows the chosen country's providers and remembers the choice", async () => {
    const user = userEvent.setup();
    const select = await renderWatchProviders();

    await user.selectOptions(select, "Germany");

    expect(screen.getByText("Kino Plus")).toBeInTheDocument();
    expect(screen.queryByText("Streamly")).not.toBeInTheDocument();
    expect(useWatchRegionStore.getState().region).toBe("DE");
  });

  it("stays quiet on load and announces a changed country politely", async () => {
    const user = userEvent.setup();
    const select = await renderWatchProviders();
    const status = screen.getByRole("status");

    expect(status).toBeEmptyDOMElement();

    await user.selectOptions(select, "Germany");

    expect(status).toHaveTextContent("Showing streaming options for Germany.");
  });

  it("announces when the chosen country has no streaming information", async () => {
    const user = userEvent.setup();
    stubBrowserLanguage("ka");
    const select = await renderWatchProviders();

    await user.selectOptions(select, "United States");
    await user.selectOptions(select, "Georgia");

    expect(screen.getByRole("status")).toHaveTextContent("No streaming information for Georgia.");
  });
});
