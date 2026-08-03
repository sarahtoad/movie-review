import Link from "next/link";
import {
  Film,
  Heart,
  MessageSquare,
  Star,
  Eye,
} from "lucide-react";
import PosterImage from "@/components/ui/PosterImage";

type ActivityType =
  | "movie"
  | "review"
  | "favorite"
  | "watchlist"
  | "like";

type ActivityCardProps = {
  activity: {
    id: string;
    type: ActivityType;
    movie: string;
    movieId: string;
    poster: string;
    date: string;
    description: string;
  };
};

export default function ActivityCard({ activity }: ActivityCardProps) {
  const getIcon = () => {
    switch (activity.type) {
      case "movie":
        return <Film size={16} />;
      case "review":
        return <MessageSquare size={16} />;
      case "favorite":
        return <Heart size={16} />;
      case "watchlist":
        return <Eye size={16} />;
      case "like":
        return <Star size={16} />;
      default:
        return <Film size={16} />;
    }
  };

  const getTitle = () => {
    switch (activity.type) {
      case "movie":
        return "A ajouté un film";
      case "review":
        return "A publié un avis";
      case "favorite":
        return "A ajouté aux favoris";
      case "watchlist":
        return "A ajouté à sa watchlist";
      case "like":
        return "A aimé un avis";
      default:
        return "Activité";
    }
  };

  return (
    <div className="flex gap-4 rounded-lg border border-border bg-ink/40 p-4 transition hover:border-accent/40 sm:gap-5 sm:p-5">
      <Link
        href={`/movies/${activity.movieId}`}
        className="relative h-28 w-20 shrink-0 overflow-hidden rounded-md"
      >
        <PosterImage
        src={activity.poster || "/images/default-movie.jpg"}
        alt={activity.movie || "Movie"}
        className="h-full w-full object-cover"
/>
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-accent">
            {getIcon()}
            <span className="font-medium">{getTitle()}</span>
          </div>

          <Link
            href={`/movies/${activity.movieId}`}
            className="font-display text-lg font-semibold text-white transition hover:text-accent sm:text-xl"
          >
            {activity.movie}
          </Link>

          <p className="mt-2 text-sm leading-6 text-soft">
            {activity.description}
          </p>
        </div>

        <span className="mt-3 text-xs text-muted">{activity.date}</span>
      </div>
    </div>
  );
}
