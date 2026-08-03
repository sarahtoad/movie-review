"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

const PUBLIC_ROUTES = ["/login", "/register"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isPublic = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated && !isPublic) {
      router.replace(`/login?next=${encodeURIComponent(pathname || "/")}`);
      return;
    }

    if (isAuthenticated && isPublic) {
      router.replace("/");
    }
  }, [loading, isAuthenticated, isPublic, pathname, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-accent" />
          <p className="text-sm text-muted">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !isPublic) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-accent" />
          <p className="text-sm text-muted">Redirection...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated && isPublic) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-accent" />
      </div>
    );
  }

  return <>{children}</>;
}
