import Form from "next/form";
import { Button } from "@/components/Button";
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
      <Button type="submit" className="h-12 shrink-0 px-6">
        Search
      </Button>
    </Form>
  );
}
