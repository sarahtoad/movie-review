"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { Movie } from "@/types/movie";

// Postes statiques de secours (Fallback si l'API ne renvoie aucun film)
const fallbackPosters = [
  {
    id: "fb-1",
    title: "Interstellar",
    rating: 9.4,
    genre: "Sci-Fi",
    tone: "from-[#1a2744] via-[#2a3a5c] to-[#0f1524]",
    accent: "#F0B429",
  },
  {
    id: "fb-2",
    title: "The Batman",
    rating: 8.1,
    genre: "Action",
    tone: "from-[#1c1f2e] via-[#2d3148] to-[#12131C]",
    accent: "#8B8FA8",
  },
  {
    id: "fb-3",
    title: "Dune Two",
    rating: 9.0,
    genre: "Épique",
    tone: "from-[#2a2418] via-[#3d3420] to-[#16120c]",
    accent: "#EDE8DC",
  },
];

// Helper pour résoudre l'URL de l'image poster
function getPosterUrl(poster?: string): string | null {
  if (!poster || typeof poster !== "string") return null;
  if (poster.startsWith("http://") || poster.startsWith("https://")) return poster;
  if (poster.startsWith("/uploads") || poster.startsWith("/posters") || poster.startsWith("/images")) {
    return `${process.env.NEXT_PUBLIC_API_URL}${poster}`;
  }
  if (poster.startsWith("/")) {
    return `https://image.tmdb.org/t/p/w500${poster}`;
  }
  return poster;
}

export default function HeroSection() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatestMovies() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/movies?limit=3`
        );
        if (res.ok) {
          const data = await res.json();
          // Vérification si les données contiennent des films
          const movieList = Array.isArray(data) ? data : data.movies || [];
          setMovies(movieList);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des films pour le Hero:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLatestMovies();
  }, []);

  // Utiliser les 3 premiers films de la DB ou les fallbacks si la DB est vide
  const displayMovies = movies.length >= 1 ? movies : null;

  return (
    <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mb-16 w-screen overflow-hidden border-b border-border">
      {/* Atmospheric backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 80% at 75% 40%, rgba(240, 180, 41, 0.12), transparent 55%),
            radial-gradient(ellipse 50% 60% at 15% 80%, rgba(35, 37, 57, 0.9), transparent 50%),
            linear-gradient(180deg, #161824 0%, #12131C 100%)
          `,
        }}
      />

      <div className="relative mx-auto grid min-h-[72vh] max-w-7xl items-center gap-12 px-6 py-20 lg:min-h-[78vh] lg:grid-cols-2 lg:gap-8 lg:py-28">
        {/* Copy */}
        <div className="relative z-10">
          <p className="section-label animate-fade-up">CineHub</p>

          <h1 className="font-display animate-fade-up-delay max-w-xl text-5xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
            Découvrez des films.
            <br />
            <span className="text-accent">Partagez vos avis.</span>
          </h1>

          <p className="animate-fade-up-delay-2 mt-6 max-w-lg text-base leading-7 text-muted md:text-lg">
            Une plateforme où les passionnés de cinéma ajoutent, notent et
            découvrent les meilleurs films de la communauté.
          </p>

          <div className="animate-fade-up-delay-2 mt-10 flex flex-wrap gap-4">
            <Link href="/movies" className="btn-primary">
              Explorer les films
            </Link>

            <Link href="/movies/add" className="btn-ghost">
              Ajouter un film
            </Link>
          </div>
        </div>

        {/* Right-side animation */}
        <div
          aria-hidden
          className="relative mx-auto hidden h-[420px] w-full max-w-md animate-fade-in lg:block xl:h-[480px] xl:max-w-lg"
        >
          {/* Soft glow */}
          <div className="animate-hero-pulse absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl" />

          {/* Orbiting ring */}
          <div className="animate-hero-orbit absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-accent/25 xl:h-[380px] xl:w-[380px]">
            <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_12px_rgba(240,180,41,0.7)]" />
            <span className="absolute bottom-8 right-6 h-1.5 w-1.5 rounded-full bg-cream/60" />
          </div>

          {/* Film strip scrolling on the far right */}
          <div className="absolute -right-2 top-0 h-full w-10 overflow-hidden rounded-sm border border-border/60 bg-elevated/40 opacity-70">
            <div className="animate-hero-reel flex flex-col gap-2 py-2">
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className="mx-auto h-5 w-6 rounded-[2px] bg-ink/80"
                />
              ))}
            </div>
          </div>

          {/* Floating poster cards */}
          {!loading && (
            <>
              {/* Carte 2 (Gauche) */}
              <div className="absolute left-[8%] top-[12%] animate-hero-float-alt">
                <PosterCard
                  movie={displayMovies?.[1] || displayMovies?.[0] || fallbackPosters[1]}
                  fallbackStyle={fallbackPosters[1]}
                  className="h-52 w-36 opacity-90"
                />
              </div>

              {/* Carte 1 (Centre / Featured) */}
              <div className="absolute right-[12%] top-[6%] z-20 animate-hero-float">
                <PosterCard
                  movie={displayMovies?.[0] || fallbackPosters[0]}
                  fallbackStyle={fallbackPosters[0]}
                  className="h-64 w-44 shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
                  featured
                />
              </div>

              {/* Carte 3 (Bas) */}
              <div className="absolute bottom-[8%] left-[22%] z-10 animate-hero-float-soft">
                <PosterCard
                  movie={displayMovies?.[2] || displayMovies?.[0] || fallbackPosters[2]}
                  fallbackStyle={fallbackPosters[2]}
                  className="h-48 w-32 opacity-95"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

interface PosterCardProps {
  movie: Partial<Movie> & { title?: string; rating?: number | string; genre?: string; poster?: string };
  fallbackStyle: { tone: string; accent: string };
  className?: string;
  featured?: boolean;
}

function PosterCard({
  movie,
  fallbackStyle,
  className = "",
  featured = false,
}: PosterCardProps) {
  const posterSrc = getPosterUrl(movie.poster || (movie as Record<string, unknown>).posterUrl as string);

  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-border/80 bg-surface ${className}`}
    >
      {/* Si l'image existe dans la base de données, on la rend en arrière-plan */}
      {posterSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={posterSrc}
          alt={movie.title || "Film Poster"}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        /* Arrière-plan dégradé dynamique si pas d'image */
        <div className={`absolute inset-0 bg-gradient-to-br ${fallbackStyle.tone}`} />
      )}

      {/* Halo de lumière et superposition sombre pour garder le texte lisible */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20"
      />

      <div className="relative flex h-full flex-col justify-between p-3 z-10">
        <div className="flex items-center justify-between">
          <span className="rounded bg-black/60 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-cream/90 backdrop-blur-sm">
            {movie.genre || "Cinéma"}
          </span>
          {featured && (
            <span className="flex items-center gap-0.5 text-[11px] text-accent font-semibold bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm">
              <Star size={10} fill="currentColor" />
              {movie.rating ?? "N/A"}
            </span>
          )}
        </div>

        <div>
          <p className="font-display text-base font-semibold leading-tight text-white line-clamp-2 drop-shadow">
            {movie.title}
          </p>
          {!featured && (
            <p className="mt-1 flex items-center gap-1 text-[11px] text-accent font-medium">
              <Star size={9} fill="currentColor" />
              {movie.rating ?? "N/A"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}