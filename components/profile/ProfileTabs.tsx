"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Film,
  Star,
  Heart,
  Eye,
  LayoutDashboard,
} from "lucide-react";

const tabs = [
  { name: "Vue d'ensemble", href: "/profile", icon: LayoutDashboard },
  { name: "Films", href: "/profile/movies", icon: Film },
  { name: "Avis", href: "/profile/reviews", icon: Star },
  { name: "Favoris", href: "/profile/favorites", icon: Heart },
  { name: "À voir", href: "/profile/watchlist", icon: Eye },
];

export default function ProfileTabs() {
  const pathname = usePathname();

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max gap-2 border-b border-border pb-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-elevated text-accent"
                  : "text-muted hover:bg-elevated/50 hover:text-cream"
              }`}
            >
              <Icon size={16} />
              {tab.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
