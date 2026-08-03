"use client";

import Link from "next/link";
import { CalendarDays, MapPin, Pencil } from "lucide-react";
import PosterImage from "@/components/ui/PosterImage";

type ProfileHeaderProps = {
  user: {
    name: string;
    username: string;
    bio: string;
    avatar: string;
    banner: string;
    location?: string;
    joinedAt: string;
  };
};

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className="relative h-52 w-full overflow-hidden sm:h-64">
        <PosterImage
          src={user.banner}
          alt="Bannière"
          className="h-full w-full object-cover"
          fallbackClassName="!h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
      </div>

      <div className="relative px-6 pb-8 sm:px-8">
        <div className="-mt-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-ink sm:h-36 sm:w-36">
              <PosterImage
                src={user.avatar}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="pb-1">
              <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">
                {user.name}
              </h1>
              <p className="mt-1 text-accent">@{user.username}</p>
              <p className="mt-4 max-w-xl leading-7 text-soft">{user.bio}</p>

              <div className="mt-4 flex flex-wrap gap-5 text-sm text-muted">
                {user.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={15} />
                    {user.location}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <CalendarDays size={15} />
                  Membre depuis {user.joinedAt}
                </div>
              </div>
            </div>
          </div>

          <Link href="/profile/edit" className="btn-primary shrink-0 self-start lg:self-auto">
            <Pencil size={16} />
            Modifier le profil
          </Link>
        </div>
      </div>
    </section>
  );
}
