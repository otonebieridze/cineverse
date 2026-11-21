import { NotFoundMessage } from "@/components/NotFoundMessage";

export default function NotFound() {
  return (
    <NotFoundMessage
      title="Person not found"
      message="We couldn't find the person you're looking for."
    />
  );
}
