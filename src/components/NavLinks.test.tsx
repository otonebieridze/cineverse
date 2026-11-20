import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NavLinks } from "@/components/NavLinks";

const LINK_NAMES = ["Browse", "Search", "Favorites"];

function currentLinkNames(): string[] {
  return LINK_NAMES.filter(
    (name) => screen.getByRole("link", { name }).getAttribute("aria-current") === "page",
  );
}

describe("NavLinks", () => {
  it.each([
    ["/movies", "Browse"],
    ["/search", "Search"],
    ["/favorites", "Favorites"],
  ])("marks only the link for %s as the current page", (currentPath, expected) => {
    render(<NavLinks currentPath={currentPath} />);

    expect(currentLinkNames()).toEqual([expected]);
  });

  it("marks the parent link on a nested path", () => {
    render(<NavLinks currentPath="/movies/top-rated" />);

    expect(currentLinkNames()).toEqual(["Browse"]);
  });

  it("does not match a path that only shares a prefix", () => {
    render(<NavLinks currentPath="/searching" />);

    expect(currentLinkNames()).toEqual([]);
  });

  it.each(["/", "/movie/550"])("marks no link on %s", (currentPath) => {
    render(<NavLinks currentPath={currentPath} />);

    expect(currentLinkNames()).toEqual([]);
  });

  it("marks no link while the path is unknown", () => {
    render(<NavLinks currentPath={null} />);

    expect(currentLinkNames()).toEqual([]);
  });
});
