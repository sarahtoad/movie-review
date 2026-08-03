import Link from "next/link";
import Logo from "@/components/logo/Logo";

const navigation = [
  { name: "Accueil", href: "/" },
  { name: "Films", href: "/movies" },
  { name: "Ajouter un film", href: "/movies/add" },
  { name: "Profil", href: "/profile" },
];

const explore = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Notifications", href: "/notifications" },
  { name: "Favoris", href: "/profile/favorites" },
  { name: "À voir", href: "/profile/watchlist" },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-ink">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="max-w-sm lg:col-span-1">
          <Logo size="md" />
          <p className="mt-5 text-sm leading-7 text-muted">
            Découvrez, partagez et notez les films que vous aimez. CineHub
            réunit une communauté de passionnés pour ajouter des films et
            publier leurs avis.
          </p>
        </div>

        <div>
          <h3 className="section-label !mb-5">Navigation</h3>
          <ul className="space-y-3">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="text-sm text-muted transition hover:text-accent"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="section-label !mb-5">Explorer</h3>
          <ul className="space-y-3">
            {explore.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="text-sm text-muted transition hover:text-accent"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="section-label !mb-5">Communauté</h3>
          <p className="mb-6 text-sm leading-7 text-muted">
            Partagez vos découvertes cinématographiques avec la communauté.
          </p>
          <Link href="/register" className="btn-primary">
            Créer un compte
          </Link>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-sm text-muted md:flex-row">
          <p>© {new Date().getFullYear()} CineHub. Tous droits réservés.</p>
          <p>Pour les passionnés de cinéma.</p>
        </div>
      </div>
    </footer>
  );
}
