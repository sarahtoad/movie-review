// app/watchlist/page.tsx
"use client";

import { useEffect, useState } from "react";

import WatchlistCard from "@/components/profile/WatchlistCard";
import EmptyState from "@/components/profile/EmptyState";
import ProfileTabs from "@/components/profile/ProfileTabs";

import { Eye } from "lucide-react";

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWatchlist() {
      try {
        const res = await fetch("http://localhost:4000/api/users/me", {
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(JSON.stringify(data));
        }

        setWatchlist(data.user.watchlist ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadWatchlist();
  }, []);

  // Filter out the deleted movie from state dynamically
  function handleRemoveWatchlist(movieId: string) {
    setWatchlist((prev) => prev.filter((item) => item.movie.id !== movieId));
  }

  if (loading) {
    return <p className="py-20 text-center">Chargement...</p>;
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <header className="mb-8">
        <p className="section-label">Profil</p>
        <h1 className="page-title">Ma watchlist</h1>
        <p className="page-subtitle">
          Les films que vous souhaitez regarder prochainement.
        </p>
      </header>

      <ProfileTabs />

      <div className="mt-10">
        {watchlist.length > 0 ? (
          <div className="space-y-4">
            {watchlist.map((item: any) => (
              <WatchlistCard
                key={item.id || item.movie.id}
                onRemove={handleRemoveWatchlist}
                movie={{
                  id: item.movie.id,
                  title: item.movie.title,
                  poster:
                    item.movie.posterUrl ??
                    item.movie.poster ??
                    "/images/default-movie.jpg",
                  year: item.movie.year,
                  genre:
                    item.movie.genres
                      ?.map((g: any) => g.genre?.name || g.name)
                      .filter(Boolean)
                      .join(", ") || "Inconnu",
                  duration: item.movie.runtime
                    ? `${item.movie.runtime} min`
                    : "-",
                  rating: item.movie.averageRating,
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Eye size={40} />}
            title="Votre watchlist est vide"
            description="Ajoutez des films à votre liste pour ne jamais oublier ceux que vous souhaitez regarder."
            buttonText="Découvrir des films"
            buttonHref="/movies"
          />
        )}
      </div>
    </div>
  );
}