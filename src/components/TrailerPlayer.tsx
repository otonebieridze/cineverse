"use client";

import Image from "next/image";
import { useLayoutEffect, useState } from "react";
import { PlayIcon } from "@/components/PlayIcon";

type TrailerPlayerProps = {
  videoKey: string;
  title: string;
  backdropUrl: string | null;
};

export function TrailerPlayer({ videoKey, title, backdropUrl }: TrailerPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  useLayoutEffect(() => {
    return () => setIsPlaying(false);
  }, [videoKey]);

  return (
    <div className="relative aspect-video max-w-4xl overflow-hidden rounded-card bg-surface shadow-card">
      {isPlaying ? (
        <iframe
          ref={(iframe) => iframe?.focus()}
          src={`https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          aria-label={`Play ${title}`}
          className="group absolute inset-0 flex items-center justify-center focus-visible:-outline-offset-4"
        >
          {backdropUrl && (
            <Image
              src={backdropUrl}
              alt=""
              fill
              sizes="(min-width: 1024px) 56rem, 100vw"
              className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-105"
            />
          )}
          <span className="absolute inset-0 bg-background/40 transition-colors group-hover:bg-background/20" />
          <span className="relative flex size-16 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-card transition-transform motion-safe:group-hover:scale-110 sm:size-20">
            <PlayIcon className="size-7 sm:size-8" />
          </span>
        </button>
      )}
    </div>
  );
}
