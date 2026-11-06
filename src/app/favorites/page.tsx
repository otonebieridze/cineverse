import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { FavoritesList } from "@/components/FavoritesList";

export const metadata: Metadata = {
  title: "Favorites",
};

export default function FavoritesPage() {
  return (
    <Container className="space-y-10 py-12 sm:py-16">
      <div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Your favorites</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted">
          Movies you&apos;ve saved on this device.
        </p>
      </div>

      <FavoritesList />
    </Container>
  );
}
