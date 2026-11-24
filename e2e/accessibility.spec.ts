import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// Every page is at zero violations, so any new violation fails the test.
const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"];

const SAVED_MOVIES = [
  { id: 27205, title: "Inception", poster_path: null, release_date: "2010-07-16", vote_average: 8.4 },
  { id: 550, title: "Fight Club", poster_path: null, release_date: "1999-10-15", vote_average: 8.4 },
];

// Waits until streamed sections have replaced their loading skeletons, so axe scans
// the finished page rather than a placeholder.
async function waitForContent(page: Page) {
  await expect(page.getByRole("heading", { level: 1 })).toBeAttached();
  await expect(page.getByText(/^Loading .+…$/)).toHaveCount(0);
}

async function expectNoAccessibilityViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
  const summary = violations.map(
    ({ id, impact, nodes }) =>
      `${id} (${impact}): ${nodes.map(({ target }) => target.join(" ")).join(", ")}`,
  );

  expect(summary).toEqual([]);
}

const PAGES = [
  { name: "home", path: "/" },
  { name: "browse with the filters panel open", path: "/movies?sort=rating&rating=7" },
  { name: "search results", path: "/search?q=Inception" },
  { name: "404 page", path: "/this-page-does-not-exist" },
  { name: "person details", path: "/person/287" },
  { name: "person not found", path: "/person/not-a-number" },
];

test.describe("accessibility", () => {
  for (const { name, path } of PAGES) {
    test(`${name} has no accessibility violations`, async ({ page }) => {
      await page.goto(path);
      await waitForContent(page);

      await expectNoAccessibilityViolations(page);
    });
  }

  test("favorites with saved movies has no accessibility violations", async ({ page }) => {
    // Saves favorites before the app loads, as a returning visitor would have them.
    await page.addInitScript((favorites) => {
      localStorage.setItem(
        "cineverse-favorites",
        JSON.stringify({ state: { favorites }, version: 0 }),
      );
    }, SAVED_MOVIES);
    await page.goto("/favorites");
    await expect(page.getByRole("link", { name: "Inception", exact: true })).toBeVisible();

    await expectNoAccessibilityViolations(page);
  });

  test("movie details has no accessibility violations", async ({ page }) => {
    await page.goto("/movies");
    const firstMovie = page.getByRole("region", { name: "Popular movies" }).getByRole("article").first();
    await firstMovie.getByRole("link").click();
    await expect(page).toHaveURL(/\/movie\/\d+$/);
    await waitForContent(page);

    await expectNoAccessibilityViolations(page);
  });

  test("movie details with the cast row scrolled has no accessibility violations", async ({
    page,
  }) => {
    await page.goto("/movie/550");
    await waitForContent(page);
    const forward = page.getByRole("button", { name: "Scroll Top cast forward" });
    const back = page.getByRole("button", { name: "Scroll Top cast back" });
    await expect(forward).toHaveAttribute("aria-disabled", "false");

    await forward.click();
    await expect(back).toHaveAttribute("aria-disabled", "false");

    await expectNoAccessibilityViolations(page);
  });

  test("movie details where to watch has no accessibility violations", async ({ page }) => {
    await page.goto("/movie/550");
    await waitForContent(page);
    const section = page.getByRole("region", { name: "Where to watch" });
    await expect(section.getByRole("combobox", { name: "Country" })).toBeVisible();

    await expectNoAccessibilityViolations(page);
  });

  test("where to watch without streaming information has no accessibility violations", async ({
    page,
  }) => {
    // A saved country that never has streaming data shows the empty state.
    await page.addInitScript(() => {
      localStorage.setItem(
        "cineverse-watch-region",
        JSON.stringify({ state: { region: "AQ" }, version: 0 }),
      );
    });
    await page.goto("/movie/550");
    await expect(page.getByText("No streaming information for Antarctica.")).toBeVisible();

    await expectNoAccessibilityViolations(page);
  });

  test("the first Tab reveals a skip link that jumps to the main content", async ({ page }) => {
    // Wait for streamed content: until it arrives, <main> has nothing to focus and the
    // next Tab after the jump would land in the footer.
    await page.goto("/movies");
    await waitForContent(page);
    const skipLink = page.getByRole("link", { name: "Skip to content" });

    await page.keyboard.press("Tab");
    await expect(skipLink).toBeFocused();
    // Hidden links are 1×1 px; once focused it must be a real, readable button.
    expect((await skipLink.boundingBox())?.width).toBeGreaterThan(100);

    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main-content$/);
    await page.keyboard.press("Tab");
    await expect(page.locator("main :focus")).toHaveCount(1);
  });
});
