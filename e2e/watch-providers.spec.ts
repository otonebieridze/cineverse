import { expect, test, type Page } from "@playwright/test";

// A long-established movie that is available somewhere. Providers change over time, so the
// tests check structure only, never which services are listed.
const MOVIE_PATH = "/movie/550";

function whereToWatch(page: Page) {
  const section = page.getByRole("region", { name: "Where to watch" });
  return { section, country: section.getByRole("combobox", { name: "Country" }) };
}

test.describe("where to watch", () => {
  test("shows a labelled country picker and credits JustWatch", async ({ page }) => {
    await page.goto(MOVIE_PATH);
    const { section, country } = whereToWatch(page);

    await expect(country).toBeVisible();
    await expect(section.getByRole("link", { name: /^JustWatch/ })).toHaveAttribute(
      "href",
      /justwatch\.com/,
    );
  });

  test("remembers the chosen country after a reload", async ({ page }) => {
    await page.goto(MOVIE_PATH);
    // The picker only appears after hydration, once the browser's country is known.
    const { country } = whereToWatch(page);
    await expect(country).toBeVisible();
    const current = await country.inputValue();
    const codes = await country
      .getByRole("option")
      .evaluateAll((options) => options.map((option) => (option as HTMLOptionElement).value));
    const other = codes.find((code) => code !== current) ?? "";
    expect(other).not.toBe("");

    await country.selectOption(other);
    await expect(country).toHaveValue(other);
    await page.reload();

    await expect(country).toHaveValue(other);
  });
});
