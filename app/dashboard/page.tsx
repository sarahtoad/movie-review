"use client";

import { useEffect, useState } from "react";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ReviewCard from "@/components/profile/ReviewCard";
import MovieCard from "@/components/profile/MovieCard";
import {
  Film,
  Star,
  Heart,
  Eye,
  ThumbsUp,
} from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
          {
            credentials: "include",
          }
        );

        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error);
        }

        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <p className="py-20 text-center text-muted">
        Chargement...
      </p>
    );
  }

  if (!data) {
    return (
      <p className="py-20 text-center text-red-500">
        Impossible de charger le dashboard.
      </p>
    );
  }

  const stats = [
    {
      label: "Films",
      value: data.stats.movies,
      icon: Film,
    },
    {
      label: "Avis",
      value: data.stats.reviews,
      icon: Star,
    },
    {
      label: "Favoris",
      value: data.stats.favorites,
      icon: Heart,
    },
    {
      label: "À voir",
      value: data.stats.watchlist,
      icon: Eye,
    },
    {
      label: "Likes",
      value: data.stats.likes,
      icon: ThumbsUp,
    },
  ];

  const latestMovie = data.user.moviesAdded?.[0];
  const latestReview = data.user.reviews?.[0];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <header className="mb-8">
        <p className="section-label">Espace perso</p>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Votre activité récente et un aperçu de votre compte.
        </p>
      </header>

      <ProfileTabs />

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section className="surface-panel p-6">
            <p className="section-label">Dernier ajout</p>

            <h2 className="section-title mb-6 !text-2xl">
              Dernier film
            </h2>

            {latestMovie ? (
              <MovieCard movie={latestMovie} />
            ) : (
              <p className="text-muted">
                Aucun film ajouté.
              </p>
            )}
          </section>

          <section className="surface-panel p-6">
            <p className="section-label">Avis</p>

            <h2 className="section-title mb-6 !text-2xl">
              Dernier avis
            </h2>

            {latestReview ? (
              <ReviewCard review={latestReview} />
            ) : (
              <p className="text-muted">
                Aucun avis publié.
              </p>
            )}
          </section>
        </div>

        <aside className="surface-panel h-fit p-6 lg:sticky lg:top-28">
          <p className="section-label">Compte</p>

          <h2 className="section-title mb-6 !text-2xl">
            Statistiques
          </h2>

          <ul className="space-y-3">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <li
                  key={stat.label}
                  className="flex items-center justify-between rounded-md border border-border bg-elevated/40 px-4 py-3"
                >
                  <span className="flex items-center gap-3 text-sm text-muted">
                    <Icon
                      size={16}
                      className="text-accent"
                    />
                    {stat.label}
                  </span>

                  <span className="font-display text-xl font-semibold text-accent">
                    {stat.value}
                  </span>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </div>
  );
}