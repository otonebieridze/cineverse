"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const DEBOUNCE_MS = 300;

type SearchInputProps = {
  query: string;
};

export function SearchInput({ query }: SearchInputProps) {
  const router = useRouter();
  const [value, setValue] = useState(query);
  const [requestedQuery, setRequestedQuery] = useState(query);
  const [previousQuery, setPreviousQuery] = useState(query);

  if (query !== previousQuery) {
    setPreviousQuery(query);
    if (query !== requestedQuery) {
      setValue(query);
    }
  }

  useEffect(() => {
    const nextQuery = value.trim();
    if (nextQuery === query) {
      return;
    }

    const timeout = setTimeout(() => {
      setRequestedQuery(nextQuery);
      router.replace(nextQuery ? `/search?q=${encodeURIComponent(nextQuery)}` : "/search", {
        scroll: false,
      });
    }, DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [value, query, router]);

  return (
    <input
      id="search-query"
      name="q"
      type="search"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      placeholder="Search by title…"
      autoComplete="off"
      className="h-12 w-full min-w-0 rounded-full border border-border bg-surface px-5 placeholder:text-muted"
    />
  );
}
