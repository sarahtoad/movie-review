// components/reviewcard/ReviewCard.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Edit2, Trash2, Heart, MessageSquare, X } from "lucide-react";

export interface ReviewCardProps {
  review: {
    id: string;
    movieId: string;
    movieTitle: string;
    poster: string;
    rating: number;
    content: string;
    likes: number;
    comments: number;
    createdAt: string;
    isOwner?: boolean;
  };
  onDelete?: (id: string) => void;
  onUpdate?: (updatedReview: { id: string; rating: number; content: string }) => void;
}

export default function ReviewCard({ review, onDelete, onUpdate }: ReviewCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit form state
  const [editRating, setEditRating] = useState(review.rating);
  const [editContent, setEditContent] = useState(review.content);

  // 1. Delete Review
  async function handleDelete() {
    if (!confirm("Voulez-vous vraiment supprimer cet avis ?")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${review.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (res.ok) {
        onDelete?.(review.id);
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.message || "Impossible de supprimer cet avis.");
      }
    } catch (err) {
      console.error("Erreur lors de la suppression de l'avis:", err);
    } finally {
      setIsDeleting(false);
    }
  }

  // 2. Update Review
  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editContent.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${review.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            rating: editRating,
            content: editContent,
          }),
        }
      );

      if (res.ok) {
        onUpdate?.({
          id: review.id,
          rating: editRating,
          content: editContent,
        });
        setIsEditing(false);
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.message || "Erreur lors de la mise à jour.");
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'avis:", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between gap-4 rounded-lg border border-border bg-surface p-4 transition hover:border-accent/40">
        <div className="flex gap-4">
          <img
            src={review.poster}
            alt={review.movieTitle}
            className="h-24 w-16 rounded object-cover flex-shrink-0"
          />
          <div>
            <Link
              href={`/movies/${review.movieId}`}
              className="font-semibold text-white hover:text-accent transition"
            >
              {review.movieTitle}
            </Link>

            <div className="mt-1 flex items-center gap-2 text-sm text-muted">
              <div className="flex items-center gap-1 text-yellow-400 font-medium">
                <Star size={14} fill="currentColor" />
                <span>{review.rating} / 5</span>
              </div>
              <span>•</span>
              <span>Publié le {review.createdAt}</span>
            </div>

            <p className="mt-2 text-sm text-gray-300 line-clamp-3">{review.content}</p>

            <div className="mt-3 flex items-center gap-4 text-xs text-muted">
              <span className="flex items-center gap-1">
                <Heart size={14} /> {review.likes}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare size={14} /> {review.comments}
              </span>
            </div>
          </div>
        </div>

        {/* Owner Controls */}
        {review.isOwner && (
          <div className="flex sm:flex-col items-center justify-end gap-2 border-t sm:border-t-0 border-border pt-3 sm:pt-0">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 rounded-md border border-border p-2 text-xs text-muted transition hover:border-accent hover:text-accent"
              title="Modifier l'avis"
            >
              <Edit2 size={14} />
              <span className="sm:hidden">Modifier</span>
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-1 rounded-md border border-border p-2 text-xs text-muted transition hover:border-red-500 hover:text-red-500 disabled:opacity-50"
              title="Supprimer l'avis"
            >
              <Trash2 size={14} />
              <span className="sm:hidden">Supprimer</span>
            </button>
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-lg rounded-xl bg-surface p-6 shadow-xl border border-border">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold">Modifier l'avis : {review.movieTitle}</h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-muted hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Note</label>
                <select
                  value={editRating}
                  onChange={(e) => setEditRating(Number(e.target.value))}
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
                <label className="block text-sm font-medium mb-1">Avis</label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={4}
                  className="w-full rounded-md border border-border bg-elevated p-2 text-sm focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-md border border-border px-4 py-2 text-sm text-muted hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-black hover:opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}