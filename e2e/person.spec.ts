import { expect, test } from "@playwright/test";

// A long-established TMDB person with a photo, a biography and a known birthday.
const PERSON_PATH = "/person/287";

test.describe("actor page", () => {
  test("shows the person's photo, facts and biography", async ({ page }) => {
    await page.goto(PERSON_PATH);

    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).not.toBeEmpty();
    const name = await heading.textContent();

    await expect(page.getByRole("img", { name: `Photo of ${name}` })).toBeVisible();
    await expect(page.getByRole("term").first()).toHaveText("Born");
    await expect(page.getByRole("definition").first()).toHaveText(/^[A-Z][a-z]+ \d{1,2}, \d{4}$/);
    await expect(page.getByRole("heading", { level: 2, name: "Biography" })).toBeVisible();
  });

  test("lists the movies the person is known for", async ({ page }) => {
    await page.goto(PERSON_PATH);

    const knownFor = page.getByRole("region", { name: "Known for" });
    const firstMovie = knownFor.getByRole("article").first();
    await expect(firstMovie).toBeVisible();
    await expect(firstMovie.getByRole("link")).toHaveAttribute("href", /^\/movie\/\d+$/);
  });
});
