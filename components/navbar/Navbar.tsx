"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "../logo/Logo";
import { Bell, Search, Plus, UserCircle2, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useState, useEffect } from "react";

const links = [
  { name: "Accueil", href: "/" },
  { name: "Films", href: "/movies" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Profil", href: "/profile" },
];

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  // Fermer le menu mobile lors d'un changement de page
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    if (!search.trim()) return;

    router.push(`/movies?search=${encodeURIComponent(search)}`);
    setIsOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-ink/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-6 px-6">
        <Logo size="sm" />

        {/* Search Bar - Desktop */}
        <form
          onSubmit={handleSearch}
          className="relative hidden w-full max-w-sm xl:block"
        >
          <Search
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            size={17}
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un film..."
            className="w-full rounded-full border border-border bg-surface/80 py-2.5 pl-11 pr-4 text-sm text-cream outline-none transition placeholder:text-muted/70 focus:border-accent/60 focus:bg-surface"
          />
        </form>

        {/* Nav Links - Desktop */}
        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3.5 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-elevated text-accent"
                    : "text-muted hover:bg-elevated/50 hover:text-cream"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Actions & Mobile Menu Toggle */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/movies/add"
            className="btn-primary hidden !px-3.5 !py-2 lg:inline-flex"
          >
            <Plus size={16} />
            Ajouter
          </Link>

          <Link
            href="/notifications"
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-cream transition hover:border-accent hover:text-accent"
          >
            <Bell size={17} />
          </Link>

          <Link
            href="/profile"
            aria-label="Profil"
            title={user?.name}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-cream transition hover:border-accent hover:text-accent"
          >
            <UserCircle2 size={20} />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            aria-label="Se déconnecter"
            title="Se déconnecter"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-muted transition hover:border-[#A63446] hover:text-[#E07A87] sm:flex"
          >
            <LogOut size={17} />
          </button>

          {/* Hamburger Button (Visible only on Mobile/Tablet) */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-cream transition hover:border-accent hover:text-accent lg:hidden"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="border-b border-border/80 bg-ink px-6 py-4 space-y-4 lg:hidden">
          {/* Search Bar - Mobile */}
          <form onSubmit={handleSearch} className="relative w-full">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
              size={17}
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un film..."
              className="w-full rounded-full border border-border bg-surface/80 py-2.5 pl-11 pr-4 text-sm text-cream outline-none transition placeholder:text-muted/70 focus:border-accent/60 focus:bg-surface"
            />
          </form>

          {/* Nav Links - Mobile */}
          <nav className="flex flex-col gap-1">
            {links.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-elevated text-accent"
                      : "text-muted hover:bg-elevated/50 hover:text-cream"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Actions */}
          <div className="pt-2 border-t border-border/50 flex flex-col gap-2">
            <Link
              href="/movies/add"
              className="btn-primary flex items-center justify-center gap-2 w-full !py-2.5"
            >
              <Plus size={16} />
              Ajouter un film
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full rounded-lg border border-border bg-surface py-2.5 text-sm font-medium text-muted transition hover:border-[#A63446] hover:text-[#E07A87]"
            >
              <LogOut size={16} />
              Se déconnecter
            </button>
          </div>
        </div>
      )}
    </header>
  );
}