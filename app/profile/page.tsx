"use client";

import { useEffect, useState } from "react";

import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ActivityCard from "@/components/profile/ActivityCard";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
          {
            credentials: "include",
          }
        );
  
        console.log("Status:", res.status);
  
        const data = await res.json();
  
        console.log(data);
  
        if (!res.ok) {
          throw new Error(JSON.stringify(data));
        }
  
        setUser(data.user);
        setStats(data.stats);
        setActivities(data.activities ?? []);
      } catch (err) {
        console.error("PROFILE ERROR:", err);
      } finally {
        setLoading(false);
      }
    }
  
    loadProfile();
    
  }, []);

  if (loading) return <p>Chargement...</p>;

  if (!user) return <p>Utilisateur introuvable</p>;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <ProfileHeader user={user} />

      <div className="mt-8">
        <ProfileTabs />
      </div>

      {stats && (
        <div className="mt-8">
          <ProfileStats stats={stats} />
        </div>
      )}

      <section className="surface-panel mt-10 p-6">
        <p className="section-label">Timeline</p>
        <h2 className="section-title mb-6 !text-2xl">
          Activité récente
        </h2>

        <div className="space-y-4">
          {activities.map((activity: any) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </section>
    </div>
  );
}