import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Pagination } from "@/components/Pagination";

const GENRE_PARAMS = { genre: "28" };

describe("Pagination", () => {
  it("renders nothing when there is only one page", () => {
    const { container } = render(
      <Pagination pathname="/movies" params={GENRE_PARAMS} page={1} totalPages={1} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("shows the current page and the total", () => {
    render(<Pagination pathname="/movies" params={GENRE_PARAMS} page={2} totalPages={5} />);

    expect(screen.getByRole("navigation", { name: "Pagination" })).toHaveTextContent(
      "Page 2 of 5",
    );
  });

  it("disables Previous on the first page and links Next to page 2", () => {
    render(<Pagination pathname="/movies" params={GENRE_PARAMS} page={1} totalPages={5} />);

    expect(screen.queryByRole("link", { name: "Previous" })).not.toBeInTheDocument();
    expect(screen.getByText("Previous")).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByRole("link", { name: "Next" })).toHaveAttribute(
      "href",
      "/movies?genre=28&page=2",
    );
  });

  it("links Previous from page 2 to the clean URL without a page param", () => {
    render(<Pagination pathname="/movies" params={GENRE_PARAMS} page={2} totalPages={5} />);

    expect(screen.getByRole("link", { name: "Previous" })).toHaveAttribute(
      "href",
      "/movies?genre=28",
    );
  });

  it("disables Next on the last page", () => {
    render(<Pagination pathname="/movies" params={GENRE_PARAMS} page={5} totalPages={5} />);

    expect(screen.queryByRole("link", { name: "Next" })).not.toBeInTheDocument();
    expect(screen.getByText("Next")).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByRole("link", { name: "Previous" })).toHaveAttribute(
      "href",
      "/movies?genre=28&page=4",
    );
  });

  it("keeps the existing search params on every link", () => {
    render(<Pagination pathname="/search" params={{ q: "dune" }} page={3} totalPages={5} />);

    expect(screen.getByRole("link", { name: "Previous" })).toHaveAttribute(
      "href",
      "/search?q=dune&page=2",
    );
    expect(screen.getByRole("link", { name: "Next" })).toHaveAttribute(
      "href",
      "/search?q=dune&page=4",
    );
  });
});
