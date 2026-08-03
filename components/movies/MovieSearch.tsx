"use client";

import { Search } from "lucide-react";

export default function MovieSearch() {
  return (
    <div className="relative max-w-md">
      <Search
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
        size={17}
      />
      <input
        type="search"
        placeholder="Rechercher un film..."
        className="w-full rounded-full border border-border bg-surface py-3 pl-11 pr-4 text-sm text-cream outline-none transition placeholder:text-muted/70 focus:border-accent/60"
      />
    </div>
  );
}
