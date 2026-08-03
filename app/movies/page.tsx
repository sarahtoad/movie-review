// app/movies/page.tsx
"use client";

import { useEffect, useState } from "react";
import MovieSearch from "@/components/movies/MovieSearch";
import MovieFilters from "@/components/movies/MovieFilters";
import MovieGrid from "@/components/movies/MovieGrid";
import { Movie } from "@/types/movie";

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMovies() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/movies`
        );

        if (!res.ok) {
          throw new Error("Impossible de récupérer les films");
        }

        const data = await res.json();
        
        // Handle array payload whether nested under .movies or returned directly
        const rawList = Array.isArray(data) ? data : data.movies || [];
        
        // Normalize properties across different backend structures
        const normalizedMovies = rawList.map((m: Record<string, unknown>) => ({
          ...m,
          id: m.id || m._id,
          poster: m.poster || m.posterUrl || m.poster_path || m.image || "",
        })) as Movie[];

        setMovies(normalizedMovies);
      } catch (err) {
        console.error("Erreur lors du chargement des films:", err);
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center">
        Chargement...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <header className="mb-10">
        <p className="section-label">Catalogue</p>
        <h1 className="page-title">Films</h1>
        <p className="page-subtitle">
          Découvrez les films ajoutés par la communauté.
        </p>
      </header>

      <MovieSearch />
      <MovieFilters />

      <MovieGrid movies={movies} />
    </div>
  );
}