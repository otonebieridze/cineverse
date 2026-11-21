import { expect, test, type Page } from "@playwright/test";

const MOVIE_PATH = "/movie/550";

function castRow(page: Page) {
  return {
    region: page.getByRole("region", { name: "Top cast, scrollable" }),
    back: page.getByRole("button", { name: "Scroll Top cast back" }),
    forward: page.getByRole("button", { name: "Scroll Top cast forward" }),
  };
}

// The buttons start disabled in the server HTML and are enabled once the row has been
// measured after hydration, so this doubles as the "page is interactive" signal.
async function openCastRow(page: Page) {
  await page.goto(MOVIE_PATH);
  const row = castRow(page);
  await expect(row.forward).toHaveAttribute("aria-disabled", "false");
  await expect(row.back).toHaveAttribute("aria-disabled", "true");
  return row;
}

test.describe("top cast row", () => {
  test("scrolls forward and back with the arrow buttons", async ({ page }) => {
    const { back, forward } = await openCastRow(page);

    await forward.click();
    await expect(back).toHaveAttribute("aria-disabled", "false");

    await back.click();
    await expect(back).toHaveAttribute("aria-disabled", "true");
    await expect(forward).toHaveAttribute("aria-disabled", "false");
  });

  test("scrolls with the keyboard when the row is focused", async ({ page }) => {
    const { region, back } = await openCastRow(page);

    await region.focus();
    await page.keyboard.press("ArrowRight");

    await expect(back).toHaveAttribute("aria-disabled", "false");
  });

  test("hides the native scrollbar", async ({ page }) => {
    const { region } = await openCastRow(page);

    await expect(region).toHaveCSS("scrollbar-width", "none");
  });

  test("opens the actor page when a cast card is clicked anywhere", async ({ page }) => {
    const { region } = await openCastRow(page);
    const firstCard = region.getByRole("listitem").first();
    const name = await firstCard.getByRole("link").textContent();

    await firstCard.click();

    await expect(page).toHaveURL(/\/person\/\d+$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(name ?? "");
  });

  test("opens the actor page with the keyboard", async ({ page }) => {
    const { region } = await openCastRow(page);
    const firstLink = region.getByRole("link").first();

    await region.focus();
    await page.keyboard.press("Tab");
    await expect(firstLink).toBeFocused();
    await page.keyboard.press("Enter");

    await expect(page).toHaveURL(/\/person\/\d+$/);
  });
});
