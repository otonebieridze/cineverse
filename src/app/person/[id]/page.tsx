import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Container } from "@/components/Container";
import { KnownForMovies } from "@/components/KnownForMovies";
import { MovieGridSkeleton } from "@/components/MovieGridSkeleton";
import { PersonDetails } from "@/components/PersonDetails";
import { getImageUrl } from "@/lib/images";
import {
  DEFAULT_OPEN_GRAPH_IMAGE,
  SHARED_OPEN_GRAPH,
  SITE_DESCRIPTION,
} from "@/lib/siteMetadata";
import { shortenText } from "@/lib/text";
import { getPersonDetails, getPersonMovieCredits } from "@/lib/tmdb";

// Search results and link previews show about 160 characters of a description.
const DESCRIPTION_MAX_LENGTH = 160;

export async function generateMetadata({
  params,
}: PageProps<"/person/[id]">): Promise<Metadata> {
  const { id } = await params;
  const person = await getPersonDetails(id);

  if (!person) {
    return { title: "Person not found" };
  }

  const description = person.biography
    ? shortenText(person.biography, DESCRIPTION_MAX_LENGTH)
    : SITE_DESCRIPTION;
  // TMDB profile photos are 2:3, so the w500 size is 500×750.
  const photoUrl = getImageUrl(person.profile_path, "w500");

  return {
    title: person.name,
    description,
    openGraph: {
      ...SHARED_OPEN_GRAPH,
      type: "profile",
      title: person.name,
      description,
      url: `/person/${person.id}`,
      images: [
        photoUrl
          ? { url: photoUrl, width: 500, height: 750, alt: `Photo of ${person.name}` }
          : DEFAULT_OPEN_GRAPH_IMAGE,
      ],
    },
  };
}

export default async function PersonPage({ params }: PageProps<"/person/[id]">) {
  const { id } = await params;
  // Started before awaiting the details so both requests run in parallel. A failure only
  // hides the "Known for" section instead of the whole page.
  const creditsPromise = getPersonMovieCredits(id).catch(() => null);
  const person = await getPersonDetails(id);

  if (!person) {
    notFound();
  }

  return (
    <>
      <PersonDetails person={person} />
      <Container className="pb-12 sm:pb-16">
        <Suspense fallback={<MovieGridSkeleton />}>
          <KnownForMovies creditsPromise={creditsPromise} />
        </Suspense>
      </Container>
    </>
  );
}
