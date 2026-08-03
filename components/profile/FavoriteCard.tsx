// components/profile/FavoriteCard.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Trash2 } from "lucide-react";

interface FavoriteCardProps {
  onRemove: (movieId: string) => void;
  movie: {
    id: string;
    title: string;
    poster: string;
    year: number;
    genre: string;
    duration?: string;
    rating?: number;
  };

}

export default function FavoriteCard({ movie, onRemove }: FavoriteCardProps) {
  const [deleting, setDeleting] = useState(false);

  const handleRemove = async () => {
    setDeleting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/favorites/${movie.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (res.ok) {
        onRemove(movie.id);
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.message || "Erreur lors de la suppression");
      }
    } catch (err) {
      console.error("Erreur lors de la suppression du favori:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-surface p-4 transition hover:border-accent/40">
      <div className="flex items-center gap-4">
        <img
          src={movie.poster}
          alt={movie.title}
          className="h-20 w-14 rounded object-cover"
        />
        <div>
          <h3 className="font-semibold text-white">{movie.title}</h3>
          <p className="text-sm text-muted">
            {movie.genre} • {movie.year} • {movie.duration}
          </p>
          {movie.rating !== undefined && (
            <div className="mt-1 flex items-center gap-1 text-sm text-accent">
              <Star size={14} fill="currentColor" />
              <span>{movie.rating}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={`/movies/${movie.id}`}
          className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-black transition hover:opacity-90"
        >
          Voir
        </Link>
        <button
          onClick={handleRemove}
          disabled={deleting}
          className="rounded-md border border-border p-2 text-muted transition hover:border-red-500 hover:text-red-500 disabled:opacity-50"
          title="Retirer des favoris"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}