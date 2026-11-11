import Image from "next/image";
import { MovieSection } from "@/components/MovieSection";
import { getImageUrl } from "@/lib/images";
import type { MovieCredits } from "@/types/tmdb";

export const CAST_LIMIT = 12;

type CastListProps = {
  creditsPromise: Promise<MovieCredits | null>;
};

export async function CastList({ creditsPromise }: CastListProps) {
  const credits = await creditsPromise;
  const cast = credits?.cast.slice(0, CAST_LIMIT) ?? [];

  if (cast.length === 0) {
    return null;
  }

  return (
    <MovieSection id="cast" title="Top cast">
      <div
        role="region"
        aria-label="Top cast, scrollable"
        tabIndex={0}
        className="-mx-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
      >
        <ul className="flex gap-4 sm:gap-6">
          {cast.map((member) => {
            const photoUrl = getImageUrl(member.profile_path, "w185");

            return (
              <li key={member.credit_id} className="w-28 shrink-0 sm:w-32">
                <div className="relative aspect-2/3 overflow-hidden rounded-card bg-surface shadow-card">
                  {photoUrl ? (
                    <Image
                      src={photoUrl}
                      alt={`Photo of ${member.name}`}
                      fill
                      sizes="(min-width: 640px) 8rem, 7rem"
                      className="object-cover"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="flex h-full items-center justify-center text-3xl font-semibold text-muted"
                    >
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>
                <p className="mt-3 line-clamp-2 text-sm font-semibold leading-snug">
                  {member.name}
                </p>
                {member.character && (
                  <p className="mt-1 line-clamp-2 text-sm text-muted">{member.character}</p>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </MovieSection>
  );
}
