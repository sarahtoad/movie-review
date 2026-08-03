export interface Movie {
    id: string;
    title: string;
    poster: string;
    year: number;
    genre: string;
    duration: string;
    rating: number;
    reviews: number;
    status?: "Vu" | "À voir" | "Favori";
    isFavorite?: boolean;
    isWatchlist?: boolean;
    addedBy?: string | { username?: string; name?: string };
  }