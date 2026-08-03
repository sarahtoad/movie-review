import MovieCard from "./MovieCard";
import { Movie } from "@/types/movie";

interface Props {
  movies: Movie[];
}

export default function RecommendedMovies({ movies }: Props) {
  return (
    <section>
      <p className="section-label">Pour vous</p>
      <h2 className="section-title mb-8">Recommandés</h2>

      <div className="grid gap-6 sm:grid-cols-2">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
