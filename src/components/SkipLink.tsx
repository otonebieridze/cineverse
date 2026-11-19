import { ACCENT_BUTTON_CLASS_NAME } from "@/components/Button";

export const MAIN_CONTENT_ID = "main-content";

// An in-page fragment link, not a route, so a plain <a> is correct here (not next/link).
// Hidden until focused, so keyboard users can jump past the header on every page.
export function SkipLink() {
  return (
    <a
      href={`#${MAIN_CONTENT_ID}`}
      className={`${ACCENT_BUTTON_CLASS_NAME} sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-4 focus:z-20 focus:px-5 focus:py-2.5`}
    >
      Skip to content
    </a>
  );
}
