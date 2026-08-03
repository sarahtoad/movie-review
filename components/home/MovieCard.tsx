"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Movie } from "@/types/movie";

interface Props {
  movie: Movie;
}

export default function MovieCard({ movie }: Props) {
  const [imgError, setImgError] = useState(false);

  return (
    <article className="group overflow-hidden rounded-lg border border-border bg-surface transition duration-300 hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
      <div className="relative aspect-[2/3] overflow-hidden bg-elevated">
        {!imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={movie.poster}
            alt={movie.title}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div
            className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center"
            style={{
              background: `linear-gradient(145deg, #232539 0%, #1B1D2B 45%, #2a2440 100%)`,
            }}
          >
            <span className="font-display text-5xl font-semibold text-accent/80">
              {movie.title.charAt(0)}
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-muted">
              Affiche
            </span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-70" />

        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md bg-ink/80 px-2.5 py-1 text-sm text-accent backdrop-blur-sm">
          <Star size={13} fill="currentColor" />
          <span className="font-medium">{movie.rating}</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-display text-lg font-semibold leading-snug text-white transition group-hover:text-accent">
          {movie.title}
        </h3>

        <p className="mt-1.5 text-sm text-muted">
          {movie.genre} · {movie.year}
        </p>

        <p className="mt-3 text-xs text-muted/80">{movie.reviews} avis</p>
      </div>
    </article>
  );
}
