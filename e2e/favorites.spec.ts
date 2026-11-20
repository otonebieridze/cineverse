import { expect, test, type Page } from "@playwright/test";

test("saves a favorite that persists after reload", async ({ page }) => {
  // The empty state only renders once React has hydrated and loaded saved favorites
  // from localStorage, so it is a reliable signal that the app is interactive.
  await page.goto("/favorites");
  await expect(page.getByText("You haven't saved any movies yet.")).toBeVisible();

  // Navigating client-side from a hydrated page renders the next page's buttons
  // already interactive, so the click below cannot be lost.
  const mainNav = page.getByRole("navigation", { name: "Main" });
  await mainNav.getByRole("link", { name: "Browse" }).click();
  await expect(page).toHaveURL("/movies");

  const heart = page.getByRole("button", { name: /^Favorite / }).first();
  await expect(heart).toHaveAttribute("aria-pressed", "false");
  const title = ((await heart.getAttribute("aria-label")) ?? "").replace(/^Favorite /, "");
  expect(title).not.toBe("");

  // A toggle is not safe to repeat, so it is clicked exactly once and never retried.
  await heart.click();
  await expect(heart).toHaveAttribute("aria-pressed", "true");

  await mainNav.getByRole("link", { name: "Favorites" }).click();
  await expect(page).toHaveURL("/favorites");
  const savedMovie = page.getByRole("link", { name: title, exact: true });
  await expect(savedMovie).toBeVisible();

  // After a full reload the list waits for hydration again; the retrying assertion
  // passes only once the favorite has been restored from localStorage.
  await page.reload();
  await expect(savedMovie).toBeVisible();
  await expect(page.getByRole("button", { name: `Favorite ${title}` })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

test.describe("favorites page layout stability", () => {
  const SAVED_MOVIES = [
    { id: 27205, title: "Inception", poster_path: null, release_date: "2010-07-16", vote_average: 8.4 },
    { id: 550, title: "Fight Club", poster_path: null, release_date: "1999-10-15", vote_average: 8.4 },
  ];

  // Same conditions as Lighthouse mobile: phone viewport and a 4x slower CPU, so the
  // server-rendered placeholder is painted before saved favorites load after hydration.
  test.use({ viewport: { width: 412, height: 823 } });

  test.beforeEach(async ({ page }) => {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });

    // Sums layout shifts that were not caused by user input, like Cumulative Layout Shift.
    await page.addInitScript(() => {
      const shifts = { total: 0 };
      Object.assign(window, { layoutShifts: shifts });
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as (PerformanceEntry & {
          value: number;
          hadRecentInput: boolean;
        })[]) {
          if (!entry.hadRecentInput) {
            shifts.total += entry.value;
          }
        }
      }).observe({ type: "layout-shift", buffered: true });
    });
  });

  async function totalLayoutShift(page: Page): Promise<number> {
    // Layout shifts are reported after the frame that caused them, so let two frames pass.
    return page.evaluate(
      () =>
        new Promise<number>((resolve) =>
          requestAnimationFrame(() =>
            requestAnimationFrame(() =>
              resolve((window as unknown as { layoutShifts: { total: number } }).layoutShifts.total),
            ),
          ),
        ),
    );
  }

  test("does not shift the layout when there are no favorites", async ({ page }) => {
    await page.goto("/favorites");
    await expect(page.getByText("You haven't saved any movies yet.")).toBeVisible();

    expect(await totalLayoutShift(page)).toBeLessThan(0.01);
  });

  test("does not shift the layout when saved favorites load", async ({ page }) => {
    await page.addInitScript((favorites) => {
      localStorage.setItem(
        "cineverse-favorites",
        JSON.stringify({ state: { favorites }, version: 0 }),
      );
    }, SAVED_MOVIES);
    await page.goto("/favorites");
    await expect(page.getByRole("link", { name: "Inception", exact: true })).toBeVisible();

    expect(await totalLayoutShift(page)).toBeLessThan(0.01);
  });
});
