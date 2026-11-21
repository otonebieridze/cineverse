import { expect, test } from "@playwright/test";

test.describe("not found pages", () => {
  test("shows the 404 page with a 404 status for an unknown URL", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist");

    expect(response?.status()).toBe(404);
    await expect(page).toHaveTitle("Page not found | CineVerse");
    await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
  });

  test("takes the user back home from the 404 page", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");

    await page.getByRole("link", { name: "Back to home" }).click();

    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { name: "Trending this week" })).toBeVisible();
  });

  test("shows the movie not found page for an invalid movie id", async ({ page }) => {
    await page.goto("/movie/not-a-number");

    await expect(page).toHaveTitle("Movie not found | CineVerse");
    await expect(page.getByRole("heading", { level: 1, name: "Movie not found" })).toBeVisible();
  });

  for (const { reason, path } of [
    { reason: "an invalid person id", path: "/person/not-a-number" },
    { reason: "a person TMDB doesn't know", path: "/person/999999999" },
  ]) {
    test(`shows the person not found page for ${reason}`, async ({ page }) => {
      await page.goto(path);

      await expect(page).toHaveTitle("Person not found | CineVerse");
      await expect(
        page.getByRole("heading", { level: 1, name: "Person not found" }),
      ).toBeVisible();
    });
  }
});
