"use client";

import { useEffect, useState } from "react";
import NotificationList from "@/components/notifications/NotificationList";

export default function NotificationsPage() {
  
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/notifications`,
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(JSON.stringify(data));
        }

        const formatted = data.map((notification: any) => ({
          id: notification.id,
          type: notification.type.toLowerCase(),
          user:
            notification.actor?.name ??
            notification.actor?.username ??
            "Utilisateur",
          message: notification.message,
          movie: notification.movie?.title ?? "",
          time: new Date(notification.createdAt).toLocaleString("fr-FR"),
          read: notification.read,
        }));

        setNotifications(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();
  }, []);

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-10">
        <p className="section-label">Compte</p>
        <h1 className="page-title">Notifications</h1>
        <p className="page-subtitle">
          Restez informé des activités de la communauté.
        </p>
      </header>

      <div className="surface-panel p-4 sm:p-6">
        <NotificationList notifications={notifications} />
      </div>
    </div>
  );
}