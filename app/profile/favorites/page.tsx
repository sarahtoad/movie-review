"use client";

import { useEffect, useState } from "react";
import FavoriteCard from "@/components/profile/FavoriteCard";
import EmptyState from "@/components/profile/EmptyState";
import ProfileTabs from "@/components/profile/ProfileTabs";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavorites() {
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

        setFavorites(data.user.favorites ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadFavorites();
  }, []);

  // Remove favorited item dynamically from state
  const handleRemoveFavorite = (movieId: string) => {
    setFavorites((prev) => prev.filter((fav) => fav.movie.id !== movieId));
  };

  if (loading) {
    return <p className="py-20 text-center">Chargement...</p>;
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <header className="mb-8">
        <p className="section-label">Profil</p>
        <h1 className="page-title">Mes favoris</h1>
        <p className="page-subtitle">
          Les films que vous avez ajoutés à vos favoris.
        </p>
      </header>

      <ProfileTabs />

      <div className="mt-10">
        {favorites.length > 0 ? (
          <div className="space-y-4">
            {favorites.map((favorite: any) => {
              const movieObj = {
                id: favorite.movie.id,
                title: favorite.movie.title,
                poster:
                  favorite.movie.posterUrl ??
                  favorite.movie.poster ??
                  "/images/default-movie.jpg",
                year: favorite.movie.year,
                genre:
                  favorite.movie.genres
                    ?.map((g: any) => g.genre.name)
                    .join(", ") ?? "Non renseigné",
                duration: favorite.movie.runtime
                  ? `${favorite.movie.runtime} min`
                  : "-",
                rating: favorite.movie.averageRating,
              };

              return (
                <FavoriteCard
                  key={favorite.id || favorite.movie.id}
                  onRemove={handleRemoveFavorite}
                  movie={movieObj}
                />
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={<Heart size={40} />}
            title="Aucun film favori"
            description="Vous n'avez pas encore ajouté de films à vos favoris."
            buttonText="Découvrir des films"
            buttonHref="/movies"
          />
        )}
      </div>
    </div>
  );
}