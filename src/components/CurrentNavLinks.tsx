"use client";

import { usePathname } from "next/navigation";
import { NavLinks } from "@/components/NavLinks";

export function CurrentNavLinks() {
  const pathname = usePathname();

  return <NavLinks currentPath={pathname} />;
}
