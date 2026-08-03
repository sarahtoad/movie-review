"use client";

import Link from "next/link";
import { Heart, Eye, Star, Clock } from "lucide-react";
import PosterImage from "@/components/ui/PosterImage";

type MovieCardProps = {
  movie: {
    id: string;
    title: string;
    poster: string;
    year: number;
    genre: string;
    duration: string;
    rating: number;
    reviews: number;
    status?: "watched" | "watchlist" | "favorite";
  };
};

const statusLabel = {
  watched: "Vu",
  watchlist: "À voir",
  favorite: "Favori",
};

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="group overflow-hidden rounded-lg border border-border bg-surface transition duration-300 hover:-translate-y-1.5 hover:border-accent/40">
      <Link href={`/movies/${movie.id}`} className="block">
        <div className="relative aspect-[2/3] overflow-hidden">
          <PosterImage
            src={movie.poster}
            alt={movie.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />

          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-md bg-ink/85 px-2.5 py-1 text-accent backdrop-blur-sm">
            <Star size={13} fill="currentColor" />
            <span className="text-sm font-medium">{movie.rating}</span>
          </div>

          {movie.status && (
            <div className="absolute bottom-3 left-3 rounded-md bg-ink/85 px-2.5 py-1 text-xs text-cream backdrop-blur-sm">
              {statusLabel[movie.status]}
            </div>
          )}
        </div>

        <div className="space-y-3 p-4">
          <div>
            <h3 className="font-display line-clamp-1 text-xl font-semibold text-white transition group-hover:text-accent">
              {movie.title}
            </h3>
            <p className="mt-1 text-sm text-muted">
              {movie.genre} · {movie.year}
            </p>
          </div>

          <div className="flex items-center justify-between text-sm text-muted">
            <div className="flex items-center gap-2">
              <Clock size={14} />
              {movie.duration}
            </div>
            <span>{movie.reviews} avis</span>
          </div>
        </div>
      </Link>

      <div className="flex gap-2 px-4 pb-4">
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-2 rounded-md bg-elevated py-2 text-sm text-muted transition hover:bg-accent hover:text-ink"
        >
          <Heart size={15} />
          Favori
        </button>
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-2 rounded-md bg-elevated py-2 text-sm text-muted transition hover:bg-accent hover:text-ink"
        >
          <Eye size={15} />
          Voir
        </button>
      </div>
    </article>
  );
}
