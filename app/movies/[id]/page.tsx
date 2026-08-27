"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Star, Clock, Calendar, ArrowLeft, Heart, Eye, MessageSquare, Send, ExternalLink } from "lucide-react";

interface Genre {
  id: string;
  name: string;
}

interface Platform {
  name: string;
  link?: string;
  url?: string;
}

interface Review {
  id: string;
  rating: number;
  content: string;
  createdAt: string;
  user: {
    name: string;
    avatar?: string;
  };
}

interface MovieDetails {
  id: string;
  title: string;
  synopsis?: string;
  description?: string;
  posterUrl?: string;
  poster?: string;
  year: number;
  runtime?: number;
  director?: string;
  country?: string;
  trailer?: string;
  platforms?: Platform[];
  averageRating?: number;
  genres?: { genre: Genre }[] | Genre[];
  reviews?: Review[];
  isFavorite?: boolean;
  inWatchlist?: boolean;
}

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const movieId = params?.id as string;

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // User Actions State
  const [isFavorite, setIsFavorite] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);

  // Review Form State
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!movieId) return;

    async function fetchMovieDetails() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/movies/${movieId}`,
          {
            credentials: "include",
          }
        );

        if (!res.ok) {
          throw new Error("Impossible de charger les détails du film.");
        }

        const data = await res.json();
        const movieData = data.movie || data;

        setMovie(movieData);
        setIsFavorite(movieData.isFavorite ?? false);
        setInWatchlist(movieData.inWatchlist ?? false);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Une erreur est survenue.");
      } font-medium {
        setLoading(false);
      }
    }

    fetchMovieDetails();
  }, [movieId]);

  // Helper pour garantir une URL valide avec protocole HTTP/HTTPS
  const getValidUrl = (rawUrl?: string, platformName?: string, movieTitle?: string) => {
    if (rawUrl && rawUrl.trim() !== "") {
      return rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;
    }
    // Si l'URL est absente en BDD, génère un lien de recherche explicite
    const query = encodeURIComponent(`regarder ${movieTitle || ""} ${platformName || ""}`);
    return `https://www.google.com/search?q=${query}`;
  };

  // Toggle Favorite Action
  async function toggleFavorite() {
    try {
      const method = isFavorite ? "DELETE" : "POST";
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/favorites/${movieId}`,
        {
          method,
          credentials: "include",
        }
      );

      if (res.ok) {
        setIsFavorite(!isFavorite);
      }
    } catch (err) {
      console.error("Erreur favoris:", err);
    }
  }

  // Toggle Watchlist Action
  async function toggleWatchlist() {
    try {
      const method = inWatchlist ? "DELETE" : "POST";
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/watchlist/${movieId}`,
        {
          method,
          credentials: "include",
        }
      );

      if (res.ok) {
        setInWatchlist(!inWatchlist);
      }
    } catch (err) {
      console.error("Erreur watchlist:", err);
    }
  }

  // Submit Review Action
  async function handleAddReview(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/movies/${movieId}/reviews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            rating: newRating,
            content: newComment,
          }),
        }
      );

      if (res.ok) {
        const reviewAdded = await res.json();
        setMovie((prev) =>
          prev
            ? {
                ...prev,
                reviews: [reviewAdded, ...(prev.reviews || [])],
              }
            : null
        );
        setNewComment("");
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.message || "Impossible de publier l'avis.");
      }
    } catch (err) {
      console.error("Erreur lors de l'envoi de l'avis:", err);
    } finally {
      setSubmittingReview(false);
    }
  }

  if (loading) {
    return <p className="py-24 text-center text-muted">Chargement du film...</p>;
  }

  if (error || !movie) {
    return (
      <div className="mx-auto max-w-4xl py-24 text-center">
        <p className="text-red-400 mb-4">{error || "Film non trouvé."}</p>
        <Link
          href="/movies"
          className="inline-flex items-center gap-2 text-sm text-accent hover:underline"
        >
          <ArrowLeft size={16} /> Retour au catalogue
        </Link>
      </div>
    );
  }

  // Formatting helper for genres
  const genreList = Array.isArray(movie.genres)
    ? movie.genres.map((g: any) => g.genre?.name || g.name || g).filter(Boolean)
    : [];

  const posterSrc = movie.posterUrl || movie.poster || "/images/default-movie.jpg";

  // Formatting helper for YouTube Trailer Embed URL
  const getEmbedUrl = (url?: string) => {
    if (!url) return "";
    if (url.includes("watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    if (url.includes("youtu.be/")) {
      return url.replace("youtu.be/", "www.youtube.com/embed/");
    }
    return url;
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-white transition mb-8"
      >
        <ArrowLeft size={18} />
        Retour
      </button>

      {/* Main Movie Presentation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Poster Column */}
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-border bg-surface shadow-lg">
          <img
            src={posterSrc}
            alt={movie.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Details Column */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">{movie.title}</h1>
            
            {/* Metadata Tags */}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted">
              <span className="flex items-center gap-1.5 text-yellow-400 font-semibold">
                <Star size={16} fill="currentColor" />
                {movie.averageRating ? movie.averageRating.toFixed(1) : "N/A"} / 5
              </span>

              {movie.year && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={16} />
                  {movie.year}
                </span>
              )}

              {movie.runtime && (
                <span className="flex items-center gap-1.5">
                  <Clock size={16} />
                  {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}min
                </span>
              )}
            </div>
          </div>

          {/* Genres */}
          {genreList.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {genreList.map((genre, idx) => (
                <span
                  key={idx}
                  className="rounded-full bg-elevated px-3 py-1 text-xs font-medium text-accent border border-border"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={toggleFavorite}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${
                isFavorite
                  ? "border-red-500 bg-red-500/10 text-red-500"
                  : "border-border hover:border-red-500 text-muted hover:text-white"
              }`}
            >
              <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
              {isFavorite ? "Dans vos favoris" : "Ajouter aux favoris"}
            </button>

            <button
              onClick={toggleWatchlist}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${
                inWatchlist
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border hover:border-accent text-muted hover:text-white"
              }`}
            >
              <Eye size={18} />
              {inWatchlist ? "Dans la watchlist" : "Ajouter à la watchlist"}
            </button>
          </div>

          {/* Synopsis */}
          <div className="border-t border-border pt-6">
            <h2 className="text-lg font-semibold text-white mb-2">Synopsis</h2>
            <p className="text-sm leading-relaxed text-gray-300">
              {movie.synopsis || movie.description || "Aucun synopsis disponible pour ce film."}
            </p>
          </div>

          {/* Informations complémentaires */}
          <div className="grid grid-cols-2 gap-4 border-t border-border pt-6 text-sm">
            {movie.director && (
              <div>
                <span className="block text-muted text-xs">Réalisateur</span>
                <span className="font-semibold text-white">{movie.director}</span>
              </div>
            )}

            {movie.country && (
              <div>
                <span className="block text-muted text-xs">Pays d'origine</span>
                <span className="font-semibold text-white">{movie.country}</span>
              </div>
            )}
          </div>

          {/* Section d'accès direct / Où regarder */}
          {movie.platforms && movie.platforms.length > 0 && (
            <div className="border-t border-border pt-6">
              <h2 className="text-lg font-semibold text-white mb-3">Où regarder</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {movie.platforms.map((p, idx) => {
                  const targetUrl = getValidUrl(p.link || p.url, p.name, movie.title);
                  return (
                    <a
                      key={idx}
                      href={targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-lg border border-border bg-surface p-3 transition hover:border-accent hover:bg-elevated group"
                    >
                      <div className="overflow-hidden">
                        <span className="font-semibold text-white group-hover:text-accent transition block truncate">
                          {p.name}
                        </span>
                        <span className="text-xs text-muted block truncate">
                          {targetUrl}
                        </span>
                      </div>
                      <ExternalLink size={16} className="text-muted group-hover:text-accent shrink-0 ml-2" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bande-annonce */}
          {movie.trailer && (
            <div className="border-t border-border pt-6">
              <h2 className="text-lg font-semibold text-white mb-3">Bande-annonce</h2>
              <div className="aspect-video w-full overflow-hidden rounded-xl border border-border bg-surface">
                <iframe
                  src={getEmbedUrl(movie.trailer)}
                  title="Bande annonce"
                  className="h-full w-full"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 border-t border-border pt-10">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <MessageSquare size={22} className="text-accent" />
          Avis de la communauté
        </h2>

        {/* Add Review Form */}
        <form onSubmit={handleAddReview} className="mb-8 rounded-xl border border-border bg-surface p-4 sm:p-6">
          <h3 className="text-sm font-semibold text-white mb-3">Laisser un avis</h3>
          
          <div className="mb-4">
            <label className="block text-xs font-medium text-muted mb-1">Note</label>
            <select
              value={newRating}
              onChange={(e) => setNewRating(Number(e.target.value))}
              className="rounded-md border border-border bg-elevated p-2 text-sm text-white focus:border-accent outline-none"
            >
              {[5, 4, 3, 2, 1].map((val) => (
                <option key={val} value={val}>
                  {val} ★
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Partagez votre avis sur ce film..."
              rows={3}
              className="w-full rounded-md border border-border bg-elevated p-3 text-sm text-white placeholder-muted focus:border-accent outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submittingReview}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black hover:opacity-90 disabled:opacity-50"
          >
            <Send size={16} />
            {submittingReview ? "Publication..." : "Publier l'avis"}
          </button>
        </form>

        {/* Review List */}
        {movie.reviews && movie.reviews.length > 0 ? (
          <div className="space-y-4">
            {movie.reviews.map((rev) => (
              <div key={rev.id} className="rounded-xl border border-border bg-surface p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-white">
                    {rev.user?.name || "Utilisateur"}
                  </span>
                  <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold">
                    <Star size={13} fill="currentColor" />
                    <span>{rev.rating} / 5</span>
                  </div>
                </div>
                <p className="text-sm text-gray-300">{rev.content}</p>
                {rev.createdAt && (
                  <p className="text-xs text-muted">
                    {new Date(rev.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted text-center py-6">
            Aucun avis n'a été publié pour ce film pour le moment.
          </p>
        )}
      </div>
    </div>
  );
}