import MovieCard from "@/components/home/MovieCard";
import { Movie } from "@/types/movie";

interface Props {
  movies: Movie[];
}

export default function TrendingMovies({ movies }: Props) {
  return (
    <section>
      <p className="section-label">Tendances</p>
      <h2 className="section-title mb-8">Films du moment</h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
