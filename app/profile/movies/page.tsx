// app/profile/movies/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EmptyState from "@/components/profile/EmptyState";
import ProfileTabs from "@/components/profile/ProfileTabs";
import { Film, Plus, Star, MessageSquare, Trash2, Edit3, ExternalLink, X } from "lucide-react";

export default function MyMoviesPage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingMovie, setEditingMovie] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editYear, setEditYear] = useState<number | string>("");
  const [editRuntime, setEditRuntime] = useState<number | string>("");
  const [submittingEdit, setSubmittingEdit] = useState(false);

  useEffect(() => {
    async function loadMovies() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        setMovies(data.user?.moviesAdded ?? []);
      } catch (err) {
        console.error("Erreur lors du chargement des films:", err);
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, []);

  // 1. DELETE ACTION
  async function handleDeleteMovie(id: string) {
    if (!id) {
      alert("ID du film introuvable.");
      return;
    }

    if (!confirm("Voulez-vous vraiment supprimer ce film de CineHub ?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/movies/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (res.ok) {
        // Remove the deleted movie from state using normalized ID matching
        setMovies((prev) => prev.filter((movie) => (movie.id || movie._id) !== id));
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.message || errData.error || "Erreur lors de la suppression.");
      }
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      alert("Impossible de contacter le serveur backend pour supprimer le film.");
    }
  }

  // 2. OPEN EDIT MODAL
  function handleOpenEdit(movie: any) {
    setEditingMovie(movie);
    setEditTitle(movie.title || "");
    setEditYear(movie.year || "");
    setEditRuntime(movie.runtime || "");
  }

  // 3. SUBMIT EDIT ACTION
  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingMovie) return;

    const movieId = editingMovie.id || editingMovie._id;
    setSubmittingEdit(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/movies/${movieId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            title: editTitle,
            year: Number(editYear),
            runtime: Number(editRuntime),
          }),
        }
      );

      if (res.ok) {
        setMovies((prev) =>
          prev.map((m) =>
            (m.id || m._id) === movieId
              ? { ...m, title: editTitle, year: Number(editYear), runtime: Number(editRuntime) }
              : m
          )
        );
        setEditingMovie(null);
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.message || "Erreur lors de la modification.");
      }
    } catch (err) {
      console.error("Erreur lors de la modification:", err);
    } finally {
      setSubmittingEdit(false);
    }
  }

  const totalReviews = movies.reduce((acc, m) => acc + (m.reviewsCount || m._count?.reviews || 0), 0);
  const avgRating = movies.length
    ? (movies.reduce((acc, m) => acc + (m.averageRating || 0), 0) / movies.length).toFixed(1)
    : "0.0";

  if (loading) {
    return <p className="py-20 text-center text-muted">Chargement...</p>;
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <p className="section-label">Profil</p>
          <h1 className="page-title">Mes films</h1>
          <p className="page-subtitle">Gérez la liste des films que vous avez ajoutés.</p>
        </div>

        <Link
          href="/movies/add"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
        >
          <Plus size={18} />
          Ajouter un film
        </Link>
      </div>

      <ProfileTabs />

      {/* Metrics Header */}
      {movies.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="flex items-center gap-3 text-muted">
              <Film size={20} className="text-accent" />
              <span className="text-xs uppercase font-semibold">Films publiés</span>
            </div>
            <p className="mt-2 text-3xl font-bold text-white">{movies.length}</p>
          </div>

          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="flex items-center gap-3 text-muted">
              <Star size={20} className="text-yellow-400" />
              <span className="text-xs uppercase font-semibold">Note moyenne</span>
            </div>
            <p className="mt-2 text-3xl font-bold text-white">{avgRating} / 5</p>
          </div>

          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="flex items-center gap-3 text-muted">
              <MessageSquare size={20} className="text-blue-400" />
              <span className="text-xs uppercase font-semibold">Avis reçus</span>
            </div>
            <p className="mt-2 text-3xl font-bold text-white">{totalReviews}</p>
          </div>
        </div>
      )}

      {/* Movie List */}
      <div className="mt-8">
        {movies.length > 0 ? (
          <div className="space-y-3">
            {movies.map((movie) => {
              const movieId = movie.id || movie._id;
              const genres =
                movie.genres?.map((g: any) => g.genre?.name || g.name).filter(Boolean).join(", ") ||
                "Non classé";
              const posterSrc = movie.posterUrl || movie.poster || "/images/default-movie.jpg";

              return (
                <div
                  key={movieId}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-border bg-surface p-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={posterSrc}
                      alt={movie.title}
                      className="h-20 w-14 rounded-md object-cover bg-elevated flex-shrink-0"
                    />

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white text-base">{movie.title}</h3>
                        <span className="rounded bg-elevated px-2 py-0.5 text-xs text-muted">
                          {movie.year}
                        </span>
                      </div>
                      <p className="text-xs text-muted">
                        {genres} {movie.runtime ? `• ${movie.runtime} min` : ""}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {/* VOIR: Navigates to Movie Details */}
                    <Link
                      href={`/movies/${movieId}`}
                      className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted hover:border-accent hover:text-accent"
                    >
                      <ExternalLink size={14} />
                      Voir
                    </Link>

                    {/* MODIFIER: Opens inline edit modal */}
                    <button
                      onClick={() => handleOpenEdit(movie)}
                      className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted hover:border-accent hover:text-accent"
                    >
                      <Edit3 size={14} />
                      Modifier
                    </button>

                    {/* SUPPRIMER: Triggers delete request */}
                    <button
                      onClick={() => handleDeleteMovie(movieId)}
                      className="flex items-center gap-1.5 rounded-lg border border-border p-2 text-xs font-medium text-muted hover:border-red-500 hover:text-red-500"
                      title="Supprimer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={<Film size={40} />}
            title="Aucun film publié"
            description="Vous n'avez encore partagé aucun film avec la communauté."
            buttonText="Proposer un film"
            buttonHref="/movies/add"
          />
        )}
      </div>

      {/* EDIT MODAL */}
      {editingMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-lg rounded-xl bg-surface p-6 border border-border">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold text-white">Modifier : {editingMovie.title}</h3>
              <button onClick={() => setEditingMovie(null)} className="text-muted hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-white">Titre du film</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-md border border-border bg-elevated p-2 text-sm text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-white">Année</label>
                  <input
                    type="number"
                    value={editYear}
                    onChange={(e) => setEditYear(e.target.value)}
                    className="w-full rounded-md border border-border bg-elevated p-2 text-sm text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-white">Durée (minutes)</label>
                  <input
                    type="number"
                    value={editRuntime}
                    onChange={(e) => setEditRuntime(e.target.value)}
                    className="w-full rounded-md border border-border bg-elevated p-2 text-sm text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingMovie(null)}
                  className="rounded-md border border-border px-4 py-2 text-sm text-muted hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submittingEdit}
                  className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-black hover:opacity-90 disabled:opacity-50"
                >
                  {submittingEdit ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}