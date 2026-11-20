import { expect, test, type Page } from "@playwright/test";

// Search results show about 50-60 characters of a title and 120-160 of a description.
const TITLE_LENGTH = { min: 50, max: 60 };
const DESCRIPTION_LENGTH = { min: 120, max: 160 };

async function metaContent(page: Page, selector: string): Promise<string> {
  return (await page.locator(selector).getAttribute("content")) ?? "";
}

test.describe("page metadata", () => {
  test("home has a descriptive title and description of search-friendly length", async ({
    page,
  }) => {
    await page.goto("/");

    const title = await page.title();
    expect(title).toMatch(/^CineVerse\b/);
    expect(title.length).toBeGreaterThanOrEqual(TITLE_LENGTH.min);
    expect(title.length).toBeLessThanOrEqual(TITLE_LENGTH.max);

    const description = await metaContent(page, 'meta[name="description"]');
    expect(description.length).toBeGreaterThanOrEqual(DESCRIPTION_LENGTH.min);
    expect(description.length).toBeLessThanOrEqual(DESCRIPTION_LENGTH.max);

    expect(await metaContent(page, 'meta[property="og:title"]')).toBe(title);
    expect(await metaContent(page, 'meta[property="og:description"]')).toBe(description);
  });

  for (const { path, title } of [
    { path: "/movies", title: "Browse | CineVerse" },
    { path: "/search", title: "Search | CineVerse" },
    { path: "/favorites", title: "Favorites | CineVerse" },
  ]) {
    test(`${path} uses the page title template`, async ({ page }) => {
      await page.goto(path);

      await expect(page).toHaveTitle(title);
    });
  }

  test("a movie page is titled after the movie", async ({ page }) => {
    await page.goto("/movie/550");
    const movieTitle = await page.getByRole("heading", { level: 1 }).textContent();

    await expect(page).toHaveTitle(`${movieTitle} | CineVerse`);
  });
});
