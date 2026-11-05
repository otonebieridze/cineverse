import Form from "next/form";

type SearchFormProps = {
  defaultValue: string;
};

export function SearchForm({ defaultValue }: SearchFormProps) {
  return (
    <Form action="/search" role="search" className="flex max-w-2xl gap-3">
      <label htmlFor="search-query" className="sr-only">
        Search movies by title
      </label>
      <input
        id="search-query"
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder="Search by title…"
        autoComplete="off"
        className="h-12 w-full min-w-0 rounded-full border border-border bg-surface px-5 placeholder:text-muted"
      />
      <button
        type="submit"
        className="h-12 shrink-0 rounded-full bg-accent px-6 font-medium text-accent-foreground transition-opacity hover:opacity-90"
      >
        Search
      </button>
    </Form>
  );
}
