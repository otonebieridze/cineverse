import { describe, expect, it } from "vitest";
import { shortenText } from "@/lib/text";

describe("shortenText", () => {
  it("keeps text that already fits, with whitespace collapsed", () => {
    expect(shortenText("  A short\n\nbiography.  ", 160)).toBe("A short biography.");
  });

  it("cuts long text at a word boundary and adds an ellipsis", () => {
    const shortened = shortenText("One two three four five", 12);

    expect(shortened).toBe("One two…");
    expect(shortened.length).toBeLessThanOrEqual(12);
  });

  it("keeps a word that ends exactly at the limit", () => {
    expect(shortenText("One two three four", 14)).toBe("One two three…");
  });

  it("drops punctuation left in front of the ellipsis", () => {
    expect(shortenText("He was born, raised and trained", 16)).toBe("He was born…");
  });

  it("cuts a single word that is longer than the limit", () => {
    expect(shortenText("Supercalifragilistic", 10)).toBe("Supercali…");
  });
});
