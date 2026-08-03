"use client";

import { useEffect, useState } from "react";

export default function CommunityFeed() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadActivities() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/activities/feed`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error(JSON.stringify(data));
        }

        // Gestion flexible : accepte un tableau direct OU un objet { activities: [...] }
        const rawList = Array.isArray(data) ? data : data.activities ?? [];

        const formatted = rawList.map((activity: any) => ({
          id: activity.id,
          user:
            activity.user?.name ??
            activity.user?.username ??
            "Utilisateur anonyme",
          text: activity.description,
          time: new Date(activity.createdAt).toLocaleString("fr-FR", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));

        setActivities(formatted);
      } catch (err) {
        console.error("Erreur lors du chargement du fil d'actualité:", err);
      } finally {
        setLoading(false);
      }
    }

    loadActivities();
  }, []);

  if (loading) {
    return (
      <aside className="surface-panel h-fit p-6">
        <p className="text-sm text-muted">Chargement du fil d'actualité...</p>
      </aside>
    );
  }

  return (
    <aside className="surface-panel h-fit p-6 lg:sticky lg:top-28">
      <p className="section-label">Communauté</p>
      <h2 className="section-title mb-6 !text-2xl">
        Fil d'actualité
      </h2>

      {activities.length === 0 ? (
        <p className="text-sm text-muted">Aucune activité récente pour le moment.</p>
      ) : (
        <div className="space-y-1">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="border-b border-border py-4 last:border-b-0"
            >
              <p className="text-sm leading-relaxed">
                <span className="font-semibold text-white">
                  {activity.user}
                </span>{" "}
                <span className="text-muted">
                  {activity.text}
                </span>
              </p>

              <p className="mt-1.5 text-xs text-muted/70">
                {activity.time}
              </p>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}