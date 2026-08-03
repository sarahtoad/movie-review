import Link from "next/link";

const genres = [
  "Science-fiction",
  "Action",
  "Thriller",
  "Comédie",
  "Drame",
  "Horreur",
];

export default function GenreSection() {
  return (
    <section className="mt-20 border-t border-border pt-16">
      <p className="section-label">Explorer</p>
      <h2 className="section-title mb-8">Genres populaires</h2>

      <div className="flex flex-wrap gap-3">
        {genres.map((genre) => (
          <Link
            key={genre}
            href="/movies"
            className="rounded-md border border-border bg-surface px-5 py-2.5 text-sm text-cream transition hover:border-accent hover:text-accent"
          >
            {genre}
          </Link>
        ))}
      </div>
    </section>
  );
}
