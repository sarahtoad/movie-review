import MovieCard from "./MovieCard";
import { Movie } from "@/types/movie";

interface Props {
  movies: Movie[];
}

export default function MovieGrid({ movies }: Props) {
  return (
    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
