// app/reviews/page.tsx
"use client";

import { useEffect, useState } from "react";
import ReviewCard from "@/components/profile/ReviewCard";
import EmptyState from "@/components/profile/EmptyState";
import ProfileTabs from "@/components/profile/ProfileTabs";
import { MessageSquare } from "lucide-react";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(JSON.stringify(data));
        }

        setReviews(data.user?.reviews ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadReviews();
  }, []);

  // Remove deleted review from local state
  function handleDeleteReview(deletedId: string) {
    setReviews((prev) => prev.filter((rev) => rev.id !== deletedId));
  }

  // Update existing review in local state
  function handleUpdateReview(updatedReview: any) {
    setReviews((prev) =>
      prev.map((rev) => (rev.id === updatedReview.id ? { ...rev, ...updatedReview } : rev))
    );
  }

  if (loading) {
    return <p className="py-20 text-center">Chargement...</p>;
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <header className="mb-8">
        <p className="section-label">Profil</p>
        <h1 className="page-title">Mes avis</h1>
        <p className="page-subtitle">
          Tous les avis que vous avez publiés sur CineHub.
        </p>
      </header>

      <ProfileTabs />

      <div className="mt-10">
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review: any) => (
              <ReviewCard
                key={review.id}
                review={{
                  id: review.id,
                  movieId: review.movie?.id || review.movieId,
                  movieTitle: review.movie?.title || "Film inconnu",
                  poster:
                    review.movie?.posterUrl ??
                    review.movie?.poster ??
                    "/images/default-movie.jpg",
                  rating: review.rating,
                  content: review.content,
                  likes: review.likes ? review.likes.length : 0,
                  comments: review.comments ? review.comments.length : 0,
                  createdAt: new Date(review.createdAt).toLocaleDateString("fr-FR"),
                  isOwner: true,
                }}
                onDelete={handleDeleteReview}
                onUpdate={handleUpdateReview}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<MessageSquare size={40} />}
            title="Aucun avis publié"
            description="Vous n'avez encore publié aucun avis."
            buttonText="Explorer les films"
            buttonHref="/movies"
          />
        )}
      </div>
    </div>
  );
}