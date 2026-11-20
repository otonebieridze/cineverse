import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ScrollRow } from "@/components/ScrollRow";

type ScrollMetrics = { scrollLeft?: number; scrollWidth: number; clientWidth: number };

function setScrollMetrics(element: HTMLElement, { scrollLeft = 0, ...sizes }: ScrollMetrics) {
  Object.defineProperties(element, {
    scrollLeft: { configurable: true, value: scrollLeft },
    scrollWidth: { configurable: true, value: sizes.scrollWidth },
    clientWidth: { configurable: true, value: sizes.clientWidth },
  });
  fireEvent.scroll(element);
}

function stubReducedMotion(reduce: boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: reduce && query === "(prefers-reduced-motion: reduce)",
    media: query,
  }));
}

function renderRow() {
  render(
    <ScrollRow label="Top cast">
      <li>Actor one</li>
      <li>Actor two</li>
    </ScrollRow>,
  );

  const region = screen.getByRole("region", { name: "Top cast, scrollable" });
  const scrollBy = vi.fn();
  region.scrollBy = scrollBy;

  return {
    region,
    scrollBy,
    back: screen.getByRole("button", { name: "Scroll Top cast back" }),
    forward: screen.getByRole("button", { name: "Scroll Top cast forward" }),
  };
}

describe("ScrollRow", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        disconnect() {}
      },
    );
    stubReducedMotion(false);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders a focusable, named scroll region with the items", () => {
    const { region } = renderRow();

    expect(region).toHaveAttribute("tabindex", "0");
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("points both buttons at the scroll region", () => {
    const { region, back, forward } = renderRow();

    expect(back).toHaveAttribute("aria-controls", region.id);
    expect(forward).toHaveAttribute("aria-controls", region.id);
  });

  it("disables both buttons when the items fit, and they do nothing", async () => {
    const user = userEvent.setup();
    const { region, scrollBy, back, forward } = renderRow();
    setScrollMetrics(region, { scrollWidth: 800, clientWidth: 800 });

    await user.click(back);
    await user.click(forward);

    expect(back).toHaveAttribute("aria-disabled", "true");
    expect(forward).toHaveAttribute("aria-disabled", "true");
    expect(scrollBy).not.toHaveBeenCalled();
  });

  it("enables only the forward button at the start of an overflowing row", () => {
    const { region, back, forward } = renderRow();
    setScrollMetrics(region, { scrollWidth: 2000, clientWidth: 1000 });

    expect(back).toHaveAttribute("aria-disabled", "true");
    expect(forward).toHaveAttribute("aria-disabled", "false");
  });

  it("enables only the back button at the end of the row", () => {
    const { region, back, forward } = renderRow();
    setScrollMetrics(region, { scrollLeft: 1000, scrollWidth: 2000, clientWidth: 1000 });

    expect(back).toHaveAttribute("aria-disabled", "false");
    expect(forward).toHaveAttribute("aria-disabled", "true");
  });

  it("scrolls by most of the visible width, smoothly", async () => {
    const user = userEvent.setup();
    const { region, scrollBy, back, forward } = renderRow();
    setScrollMetrics(region, { scrollLeft: 500, scrollWidth: 2000, clientWidth: 1000 });

    await user.click(forward);
    await user.click(back);

    expect(scrollBy).toHaveBeenNthCalledWith(1, { left: 800, behavior: "smooth" });
    expect(scrollBy).toHaveBeenNthCalledWith(2, { left: -800, behavior: "smooth" });
  });

  it("jumps without animation when the user prefers reduced motion", async () => {
    stubReducedMotion(true);
    const user = userEvent.setup();
    const { region, scrollBy, forward } = renderRow();
    setScrollMetrics(region, { scrollWidth: 2000, clientWidth: 1000 });

    await user.click(forward);

    expect(scrollBy).toHaveBeenCalledWith({ left: 800, behavior: "auto" });
  });
});
