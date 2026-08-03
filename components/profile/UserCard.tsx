import Image from "next/image";
import Link from "next/link";
import { MapPin, CalendarDays } from "lucide-react";
import { User } from "@/types/user";

type UserCardProps = {
    user: User;
  };

export default function UserCard({ user }: UserCardProps) {
  return (
    <Link
      href={`/users/${user.username}`}
      className="group flex items-center gap-5 rounded-xl border border-[#33364A] bg-[#1B1D2B] p-5 transition-all duration-300 hover:border-[#F0B429] hover:-translate-y-1"
    >
      {/* Avatar */}

      <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-[#33364A] group-hover:border-[#F0B429]">
        <Image
          src={user.avatar}
          alt={user.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Informations */}

      <div className="flex-1">

        <div className="flex items-center justify-between">

          <div>
            <h3 className="text-lg font-semibold text-white">
              {user.name}
            </h3>

            <p className="text-sm text-[#F0B429]">
              @{user.username}
            </p>
          </div>

        </div>

        {user.bio && (
          <p className="mt-3 line-clamp-2 text-sm text-[#C7C4B8]">
            {user.bio}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-5 text-xs text-[#8B8FA8]">

          {user.location && (
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              {user.location}
            </div>
          )}

          {user.joinedAt && (
            <div className="flex items-center gap-1">
              <CalendarDays size={14} />
              Depuis {user.joinedAt}
            </div>
          )}

        </div>

      </div>
    </Link>
  );
}