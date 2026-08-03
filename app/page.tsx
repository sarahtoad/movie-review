"use client";

import { useEffect, useState } from "react";

import HeroSection from "@/components/home/HeroSection";
import TrendingMovies from "@/components/home/TrendingMovies";
import CommunityFeed from "@/components/home/CommunityFeed";
import GenreSection from "@/components/home/GenreSection";
import RecommendedMovies from "@/components/home/RecommendedMovies";

export default function HomePage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMovies() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/movies`,
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(JSON.stringify(data));
        }

        const formatted = data.movies.map((movie: any) => {
          // Calcul dynamique et robuste du nombre exact d'avis
          const reviewsCount =
            typeof movie.reviewsCount === "number"
              ? movie.reviewsCount
              : Array.isArray(movie.reviews)
              ? movie.reviews.length
              : movie._count?.reviews ?? 0;

          return {
            id: movie.id,
            title: movie.title,
            poster: movie.posterUrl,
            year: movie.year,
            genre:
              movie.genres?.map((g: any) => g.genre.name).join(", ") ??
              "Unknown",
            duration: movie.runtime ? `${movie.runtime} min` : "",
            rating: movie.averageRating ?? 0,
            reviews: reviewsCount, // Le nombre d'avis exact
            addedBy: movie.addedBy?.username ?? "",
            status: "",
          };
        });

        setMovies(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, []);

  if (loading) {
    return <p className="py-20 text-center">Chargement...</p>;
  }

  return (
    <div>
      <HeroSection />

      <div className="mx-auto max-w-7xl px-6 pb-10">
        <TrendingMovies movies={movies} />

        <div className="mt-20 grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecommendedMovies movies={movies} />
          </div>

          <CommunityFeed />
        </div>

        <GenreSection />
      </div>
    </div>
  );
}