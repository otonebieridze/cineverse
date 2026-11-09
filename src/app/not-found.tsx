import type { Metadata } from "next";
import { NotFoundMessage } from "@/components/NotFoundMessage";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <NotFoundMessage
      title="Page not found"
      message="We couldn't find the page you're looking for."
    />
  );
}
