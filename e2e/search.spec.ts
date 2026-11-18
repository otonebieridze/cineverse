import { expect, test } from "@playwright/test";

test("shows results while typing a movie title", async ({ page }) => {
  await page.goto("/search");
  const searchBox = page.getByRole("searchbox", { name: "Search movies by title" });

  // Typing before React has hydrated the input is lost. Clearing and filling is safe to
  // repeat, so retry it until the debounced search updates the URL.
  await expect(async () => {
    await searchBox.clear();
    await searchBox.fill("Inception");
    await expect(page).toHaveURL("/search?q=Inception", { timeout: 2_000 });
  }).toPass({ timeout: 10_000 });

  await expect(
    page.getByRole("heading", { level: 2, name: 'Results for "Inception"' }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Inception", exact: true }).first()).toBeVisible();
});
