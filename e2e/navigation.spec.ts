import { expect, test, type Locator, type Page } from "@playwright/test";

const LINK_NAMES = ["Browse", "Search", "Favorites"] as const;

function mainNav(page: Page): Locator {
  return page.getByRole("navigation", { name: "Main" });
}

// Checks every link, so the test also catches more than one link marked as current.
async function expectCurrentLink(page: Page, current: (typeof LINK_NAMES)[number] | null) {
  for (const name of LINK_NAMES) {
    const link = mainNav(page).getByRole("link", { name, exact: true });
    if (name === current) {
      await expect(link).toHaveAttribute("aria-current", "page");
    } else {
      await expect(link).not.toHaveAttribute("aria-current");
    }
  }
}

test.describe("main navigation", () => {
  test("marks the current page and follows navigation", async ({ page }) => {
    await page.goto("/movies");
    await expectCurrentLink(page, "Browse");

    await mainNav(page).getByRole("link", { name: "Search", exact: true }).click();
    await expect(page).toHaveURL("/search");
    await expectCurrentLink(page, "Search");

    await mainNav(page).getByRole("link", { name: "Favorites", exact: true }).click();
    await expect(page).toHaveURL("/favorites");
    await expectCurrentLink(page, "Favorites");
  });

  test("marks no link on the home page", async ({ page }) => {
    await page.goto("/");

    await expectCurrentLink(page, null);
  });

  test("marks no link on a movie details page", async ({ page }) => {
    await page.goto("/movie/550");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    await expectCurrentLink(page, null);
  });
});
