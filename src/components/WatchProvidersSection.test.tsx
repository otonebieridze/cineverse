import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WatchProvidersSection } from "@/components/WatchProvidersSection";
import type { WatchProvidersResponse } from "@/types/tmdb";

const RESPONSE: WatchProvidersResponse = {
  id: 1,
  results: {
    US: {
      link: "https://www.themoviedb.org/movie/1/watch?locale=US",
      flatrate: [
        { provider_id: 1, provider_name: "Streamly", logo_path: null, display_priority: 1 },
      ],
    },
  },
};

// The section is an async Server Component: await it, then render what it returns.
async function renderSection(response: WatchProvidersResponse | null) {
  const ui = await WatchProvidersSection({ providersPromise: Promise.resolve(response) });
  return render(ui);
}

describe("WatchProvidersSection", () => {
  it("shows a Where to watch section", async () => {
    await renderSection(RESPONSE);

    expect(screen.getByRole("region", { name: "Where to watch" })).toBeInTheDocument();
  });

  it("credits JustWatch as the data source, as TMDB requires", async () => {
    await renderSection(RESPONSE);

    expect(screen.getByText(/Streaming availability data by/)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "JustWatch (opens in a new tab)" }),
    ).toHaveAttribute("href", "https://www.justwatch.com/");
  });

  it("renders nothing when the request failed", async () => {
    const { container } = await renderSection(null);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when no country has streaming information", async () => {
    const { container } = await renderSection({ id: 1, results: {} });

    expect(container).toBeEmptyDOMElement();
  });
});
