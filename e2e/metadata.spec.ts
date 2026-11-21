import { expect, test, type Page } from "@playwright/test";

// Search results show about 50-60 characters of a title and 120-160 of a description.
const TITLE_LENGTH = { min: 50, max: 60 };
const DESCRIPTION_LENGTH = { min: 120, max: 160 };

const SITE_NAME = "CineVerse";

// Waits for the tag, so it also works for metadata that streams in after the page shell.
async function metaContent(page: Page, selector: string): Promise<string> {
  return (await page.locator(selector).getAttribute("content")) ?? "";
}

async function openGraph(page: Page) {
  const og = (property: string) => metaContent(page, `meta[property="og:${property}"]`);

  return {
    title: await og("title"),
    description: await og("description"),
    siteName: await og("site_name"),
    type: await og("type"),
    image: await og("image"),
    imageWidth: await og("image:width"),
    imageHeight: await og("image:height"),
    imageAlt: await og("image:alt"),
  };
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

    const og = await openGraph(page);
    expect(og.title).toBe(title);
    expect(og.description).toBe(description);
    expect(og.siteName).toBe(SITE_NAME);
    expect(og.image).not.toBe("");
  });

  for (const { path, title } of [
    { path: "/movies", title: "Browse | CineVerse" },
    { path: "/search", title: "Search | CineVerse" },
    { path: "/favorites", title: "Favorites | CineVerse" },
  ]) {
    test(`${path} has its own title and keeps the shared share-card fields`, async ({
      page,
    }) => {
      await page.goto("/");
      const home = await openGraph(page);

      await page.goto(path);
      await expect(page).toHaveTitle(title);
      const og = await openGraph(page);

      expect(og.title).toBe(title);
      expect(og.description).toBe(home.description);
      expect(og.siteName).toBe(SITE_NAME);
      expect(new URL(og.image).pathname).toBe(new URL(home.image).pathname);
      expect(og.imageWidth).toBe(home.imageWidth);
      expect(og.imageHeight).toBe(home.imageHeight);
      expect(og.imageAlt).toBe(home.imageAlt);
    });
  }

  test("the shared share image is served at its plain URL", async ({ page, request }) => {
    await page.goto("/movies");
    const { pathname } = new URL((await openGraph(page)).image);

    const response = await request.get(pathname);

    expect(response.ok()).toBe(true);
    expect(response.headers()["content-type"]).toBe("image/png");
  });

  test("a movie page has the movie's title, description and image", async ({ page }) => {
    await page.goto("/movie/550");
    const movieTitle = await page.getByRole("heading", { level: 1 }).textContent();

    await expect(page).toHaveTitle(`${movieTitle} | CineVerse`);
    const og = await openGraph(page);
    expect(og.title).toBe(movieTitle);
    expect(og.description).not.toBe("");
    expect(og.siteName).toBe(SITE_NAME);
    expect(og.image).toContain("image.tmdb.org");
  });

  // The page's `openGraph` replaces the layout's whole object, so every shared field
  // has to be set again by the page.
  test("a person page has the person's name, biography, photo and profile type", async ({
    page,
  }) => {
    await page.goto("/person/287");
    const name = await page.getByRole("heading", { level: 1 }).textContent();

    await expect(page).toHaveTitle(`${name} | CineVerse`);
    const description = await metaContent(page, 'meta[name="description"]');
    expect(description).not.toBe("");
    expect(description.length).toBeLessThanOrEqual(DESCRIPTION_LENGTH.max);

    const og = await openGraph(page);
    expect(og.title).toBe(name);
    expect(og.description).toBe(description);
    expect(og.siteName).toBe(SITE_NAME);
    expect(og.type).toBe("profile");
    expect(og.image).toContain("image.tmdb.org");
    expect(og.imageAlt).toBe(`Photo of ${name}`);
  });
});
