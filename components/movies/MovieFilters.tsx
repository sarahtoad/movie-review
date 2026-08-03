"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { GENRES } from "@/constants/genres";

const filters = [
  { label: "Populaires", value: "popular" },
  { label: "Mieux notés", value: "top" },
  { label: "Nouveautés", value: "new" },
];

const genres = [
  "Action",
  "Science-fiction",
  "Drame",
  "Comédie",
  "Thriller",
  "Horreur",
];

export default function MovieFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const active = searchParams.get("sort") ?? "popular";
  const genre = searchParams.get("genre") ?? "";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`/movies?${params.toString()}`);
  }

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      {filters.map((filter) => (
        <button
          key={filter.value}
          type="button"
          onClick={() => updateParam("sort", filter.value)}
          className={`rounded-md border px-4 py-2 text-sm transition ${
            active === filter.value
              ? "border-accent/40 bg-elevated text-accent"
              : "border-border bg-transparent text-muted hover:border-border hover:text-cream"
          }`}
        >
          {filter.label}
        </button>
      ))}

<select
  value={genre}
  onChange={(e) => updateParam("genre", e.target.value)}
  className="rounded-md border border-border bg-surface px-4 py-2 text-sm text-cream outline-none transition focus:border-accent/60"
>
  <option value="">Tous les genres</option>

  {GENRES.map((genre) => (
    <option key={genre} value={genre}>
      {genre}
    </option>
  ))}
</select>
    </div>
  );
}