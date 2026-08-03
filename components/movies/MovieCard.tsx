"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Heart, MessageSquare, X, ImageOff, User } from "lucide-react";
import { Movie } from "@/types/movie";

interface Props {
  movie: Movie;
}

interface Review {
  id: string;
  rating: number;
  content: string;
  createdAt: string;
  user: { name: string; avatar: string };
}

export default function MovieCard({ movie }: Props) {
  const [imgError, setImgError] = useState(false);
  const [favorite, setFavorite] = useState(movie.isFavorite ?? false);

  // Review Modal States
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Resolution de l'auteur ayant ajoute le film
  const addedByUsername =
    typeof movie.addedBy === "string"
      ? movie.addedBy
      : movie.addedBy?.username || movie.addedBy?.name || null;

  // 1. Resolve potential Backend field variations
  const rawPoster =
    movie.poster ||
    (movie as unknown as Record<string, unknown>).posterUrl ||
    (movie as unknown as Record<string, unknown>).poster_path ||
    (movie as unknown as Record<string, unknown>).image;

  // 2. Normalize relative paths to absolute URLs
  const getPosterSrc = (url: unknown): string | null => {
    if (typeof url !== "string" || !url.trim()) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (
      url.startsWith("/uploads") ||
      url.startsWith("/posters") ||
      url.startsWith("/images")
    ) {
      return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
    }
    if (url.startsWith("/")) {
      return `https://image.tmdb.org/t/p/w500${url}`;
    }
    return url;
  };

  const posterSrc = getPosterSrc(rawPoster);

  // Toggle Favorite logic
  async function toggleFavorite() {
    const method = favorite ? "DELETE" : "POST";
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/favorites/${movie.id}`,
      {
      method,
      credentials: "include",
    });
    if (res.ok) setFavorite(!favorite);
  }

  // Fetch Reviews when Modal opens
  async function openReviewModal() {
    setIsReviewOpen(true);
    setLoadingReviews(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/movies/${movie.id}/reviews`
      );
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des avis:", err);
    } finally {
      setLoadingReviews(false);
    }
  }

  // Submit New Review
  async function handleAddReview(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/movies/${movie.id}/reviews`,
        {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          movieId: movie.id,
          rating, 
          content 
        }),
      });

      if (res.ok) {
        const newReview = await res.json();
        setReviews((prev) => [newReview, ...prev]);
        setContent("");
      } else {
        const errorData = await res.json();
        console.error("Server Error:", errorData);
        alert(errorData.error || errorData.message || "Failed to post review");
      }
    } catch (err) {
      console.error("Erreur lors de l'envoi de l'avis:", err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <article className="group overflow-hidden rounded-lg border border-border bg-surface transition hover:-translate-y-1 hover:border-accent/40">
        {/* Fixed Aspect Ratio Image Container */}
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-elevated">
          {!imgError && posterSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={posterSrc}
              alt={movie.title}
              referrerPolicy="no-referrer"
              onError={() => {
                console.error(`[Poster Error] Failed to load image for "${movie.title}". Attempted URL:`, posterSrc);
                setImgError(true);
              }}
              className="absolute inset-0 h-full w-full object-cover object-center transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center bg-zinc-800 text-zinc-400">
              <ImageOff size={24} />
              <span className="text-xs font-medium line-clamp-2">{movie.title}</span>
            </div>
          )}

          <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded bg-black/80 px-2 py-1 text-sm font-medium text-white backdrop-blur-sm z-10">
            <Star size={13} fill="currentColor" className="text-yellow-400" />
            {movie.rating ?? "N/A"}
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold line-clamp-1">{movie.title}</h3>
          <p className="text-sm text-muted">{movie.genre} • {movie.year}</p>

          {/* Nom du membre ayant ajoute le film */}
          {addedByUsername && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted/80">
              <User size={13} className="text-accent" />
              <span>Ajouté par <strong className="font-medium text-white">{addedByUsername}</strong></span>
            </p>
          )}

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              onClick={toggleFavorite}
              className={`rounded-md border p-2 text-sm transition ${
                favorite ? "border-red-500 text-red-500" : "border-border hover:border-red-500"
              }`}
            >
              <Heart size={16} fill={favorite ? "currentColor" : "none"} className="mx-auto mb-1" />
              Favori
            </button>

            <button
              onClick={openReviewModal}
              className="flex items-center justify-center gap-2 rounded-md border border-border p-2 text-sm hover:border-accent"
            >
              <MessageSquare size={16} />
              Avis
            </button>

            <Link
              href={`/movies/${movie.id}`}
              className="col-span-2 flex items-center justify-center rounded-md bg-accent p-2 text-sm font-medium text-black hover:opacity-90"   
            >
              Voir
            </Link>
          </div>
        </div>
      </article>

      {/* REVIEWS MODAL */}
      {isReviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-lg rounded-xl bg-surface p-6 shadow-xl border border-border">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-xl font-bold">Avis : {movie.title}</h3>
              <button
                onClick={() => setIsReviewOpen(false)}
                className="text-muted hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Add Review Form */}
            <form onSubmit={handleAddReview} className="my-4 space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Note (1 à 5)</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full rounded-md border border-border bg-elevated p-2 text-sm"
                >
                  {[5, 4, 3, 2, 1].map((num) => (
                    <option key={num} value={num}>
                      {num} ★
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Écrivez votre avis ici..."
                  rows={3}
                  className="w-full rounded-md border border-border bg-elevated p-2 text-sm focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-md bg-accent py-2 text-sm font-semibold text-black hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? "Publication..." : "Publier l'avis"}
              </button>
            </form>

            {/* Existing Reviews List */}
            <div className="max-h-60 overflow-y-auto space-y-3 border-t border-border pt-4">
              <h4 className="text-sm font-semibold text-muted">Avis des membres</h4>
              {loadingReviews ? (
                <p className="text-center text-sm text-muted">Chargement...</p>
              ) : reviews.length === 0 ? (
                <p className="text-center text-sm text-muted">Aucun avis pour le moment.</p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="rounded-lg bg-elevated p-3 text-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold">{rev.user?.name || "Utilisateur"}</span>
                      <span className="text-yellow-400 font-bold">{rev.rating} ★</span>
                    </div>
                    <p className="text-muted">{rev.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}