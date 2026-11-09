import { NotFoundMessage } from "@/components/NotFoundMessage";

export default function NotFound() {
  return (
    <NotFoundMessage
      title="Movie not found"
      message="We couldn't find the movie you're looking for."
    />
  );
}
