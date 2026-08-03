import {
  Film,
  Star,
  Heart,
  Eye,
  ThumbsUp,
} from "lucide-react";

type ProfileStatsProps = {
  stats: {
    movies: number;
    reviews: number;
    favorites: number;
    watchlist: number;
    likes: number;
  };
};

export default function ProfileStats({ stats }: ProfileStatsProps) {
  const items = [
    { title: "Films ajoutés", value: stats.movies, icon: Film },
    { title: "Avis publiés", value: stats.reviews, icon: Star },
    { title: "Favoris", value: stats.favorites, icon: Heart },
    { title: "À voir", value: stats.watchlist, icon: Eye },
    { title: "Likes reçus", value: stats.likes, icon: ThumbsUp },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="group rounded-lg border border-border bg-surface p-5 transition duration-300 hover:-translate-y-1 hover:border-accent/40"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-elevated text-accent">
                <Icon size={18} />
              </div>
              <span className="font-display text-3xl font-semibold text-accent">
                {item.value}
              </span>
            </div>
            <h3 className="text-sm font-medium text-cream">{item.title}</h3>
          </div>
        );
      })}
    </section>
  );
}
