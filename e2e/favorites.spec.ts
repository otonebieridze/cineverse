import { expect, test } from "@playwright/test";

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
