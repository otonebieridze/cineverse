import { expect, test } from "@playwright/test";

// Genre pills are links and the filters panel is a native form, so they work the same
// before and after hydration: there is no hydration race to wait for.
test.describe("browse", () => {
  test("filters movies by genre", async ({ page }) => {
    await page.goto("/movies");
    const genres = page.getByRole("navigation", { name: "Genres" });
    await expect(genres.getByRole("link", { name: "All" })).toHaveAttribute("aria-current", "true");

    await genres.getByRole("link", { name: "Comedy" }).click();

    await expect(page).toHaveURL("/movies?genre=35");
    await expect(genres.getByRole("link", { name: "Comedy" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    await expect(genres.getByRole("link", { name: "All" })).not.toHaveAttribute("aria-current");
    const results = page.getByRole("region", { name: "Comedy" });
    await expect(results.getByRole("article").first()).toBeVisible();
  });

  test("applies sort and minimum rating from the filters panel", async ({ page }) => {
    await page.goto("/movies");

    await page.getByText("Filters", { exact: true }).click();
    await page.getByLabel("Sort by").selectOption({ label: "Top rated" });
    await page.getByLabel("Minimum rating").selectOption({ label: "7+" });
    await page.getByRole("button", { name: "Apply" }).click();

    await expect(page).toHaveURL(
      (url) => url.searchParams.get("sort") === "rating" && url.searchParams.get("rating") === "7",
    );
    const results = page.getByRole("region", { name: "Top rated" });
    await expect(results.getByRole("article").first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Reset filters" })).toBeVisible();
  });
});
