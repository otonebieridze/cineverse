import Form from "next/form";
import { SearchInput } from "@/components/SearchInput";

type SearchFormProps = {
  query: string;
};

export function SearchForm({ query }: SearchFormProps) {
  return (
    <Form action="/search" role="search" className="flex max-w-2xl gap-3">
      <label htmlFor="search-query" className="sr-only">
        Search movies by title
      </label>
      <SearchInput query={query} />
      <button
        type="submit"
        className="h-12 shrink-0 rounded-full bg-accent px-6 font-medium text-accent-foreground transition-opacity hover:opacity-90"
      >
        Search
      </button>
    </Form>
  );
}
