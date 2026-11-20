import Link from "next/link";

const NAV_LINKS = [
  { href: "/movies", label: "Browse" },
  { href: "/search", label: "Search" },
  { href: "/favorites", label: "Favorites" },
];

const LINK_CLASS_NAME =
  "rounded-md text-sm font-medium transition-colors hover:text-foreground sm:text-base";

const ACTIVE_LINK_CLASS_NAME =
  "text-foreground underline decoration-accent decoration-2 underline-offset-8";

function isCurrent(href: string, currentPath: string | null): boolean {
  return currentPath === href || Boolean(currentPath?.startsWith(`${href}/`));
}

type NavLinksProps = {
  currentPath: string | null;
};

export function NavLinks({ currentPath }: NavLinksProps) {
  return (
    <ul className="flex gap-3 sm:gap-6">
      {NAV_LINKS.map(({ href, label }) => {
        const current = isCurrent(href, currentPath);

        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={current ? "page" : undefined}
              className={`${LINK_CLASS_NAME} ${current ? ACTIVE_LINK_CLASS_NAME : "text-muted"}`}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
