import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PersonDetails } from "@/components/PersonDetails";
import type { PersonDetails as PersonDetailsData } from "@/types/tmdb";

const PERSON: PersonDetailsData = {
  id: 1,
  name: "Ada Lovelace",
  biography: "First paragraph.\n\nSecond paragraph.",
  birthday: "1815-12-10",
  deathday: null,
  place_of_birth: "London, England",
  profile_path: "/ada.jpg",
};

function textsOf(elements: HTMLElement[]) {
  return elements.map((element) => element.textContent);
}

describe("PersonDetails", () => {
  it("shows the name as the main heading", () => {
    render(<PersonDetails person={PERSON} />);

    expect(screen.getByRole("heading", { level: 1, name: "Ada Lovelace" })).toBeInTheDocument();
  });

  it("shows the photo described by the person's name", () => {
    render(<PersonDetails person={PERSON} />);

    expect(screen.getByRole("img", { name: "Photo of Ada Lovelace" })).toBeInTheDocument();
  });

  it("shows a decorative initial instead of a photo when there is none", () => {
    render(<PersonDetails person={{ ...PERSON, profile_path: null }} />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("A")).toHaveAttribute("aria-hidden", "true");
  });

  it("lists the known facts with readable dates", () => {
    render(<PersonDetails person={PERSON} />);

    expect(textsOf(screen.getAllByRole("term"))).toEqual(["Born", "Place of birth"]);
    expect(textsOf(screen.getAllByRole("definition"))).toEqual([
      "December 10, 1815",
      "London, England",
    ]);
    expect(screen.getByText("December 10, 1815")).toHaveAttribute("datetime", "1815-12-10");
  });

  it("shows the date of death when there is one", () => {
    render(<PersonDetails person={{ ...PERSON, deathday: "1852-11-27" }} />);

    expect(textsOf(screen.getAllByRole("term"))).toEqual(["Born", "Place of birth", "Died"]);
    expect(screen.getByText("November 27, 1852")).toBeInTheDocument();
  });

  it("leaves the facts out when none are known", () => {
    render(
      <PersonDetails person={{ ...PERSON, birthday: null, place_of_birth: null, deathday: null }} />,
    );

    expect(screen.queryByRole("term")).not.toBeInTheDocument();
  });

  it("shows each biography paragraph", () => {
    render(<PersonDetails person={PERSON} />);

    expect(screen.getByRole("heading", { level: 2, name: "Biography" })).toBeInTheDocument();
    expect(screen.getByText("First paragraph.")).toBeInTheDocument();
    expect(screen.getByText("Second paragraph.")).toBeInTheDocument();
  });

  it("says so when there is no biography", () => {
    render(<PersonDetails person={{ ...PERSON, biography: "" }} />);

    expect(screen.getByText("No biography available.")).toBeInTheDocument();
  });
});
