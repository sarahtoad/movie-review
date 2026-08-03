"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import Logo from "@/components/logo/Logo";
import { useAuth } from "@/components/auth/AuthProvider";

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email.trim(), password);
      router.replace(next.startsWith("/") ? next : "/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connexion impossible");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative w-full max-w-md animate-fade-up">
      <div className="mb-10 flex flex-col items-center text-center">
        <Logo size="md" />
        <p className="section-label mt-8">Bienvenue</p>
        <h1 className="page-title !text-4xl">Connexion</h1>
        <p className="mt-2 text-sm text-muted">
          Connectez-vous pour rejoindre la communauté CineHub.
        </p>
      </div>

      <form onSubmit={onSubmit} className="surface-panel space-y-5 p-6 sm:p-8">
        {error && (
          <div className="rounded-md border border-[#A63446]/40 bg-[#A63446]/10 px-4 py-3 text-sm text-[#E07A87]">
            {error}
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-cream">
            Adresse e-mail
          </label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@exemple.com"
            className="w-full rounded-md border border-border bg-ink px-4 py-3 text-cream outline-none transition placeholder:text-muted/50 focus:border-accent/60"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-cream">
            Mot de passe
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-md border border-border bg-ink px-4 py-3 pr-12 text-cream outline-none transition placeholder:text-muted/50 focus:border-accent/60"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition hover:text-cream"
              aria-label={showPassword ? "Masquer" : "Afficher"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogIn size={16} />
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        <p className="text-center text-sm text-muted">
          Pas encore de compte ?{" "}
          <Link
            href="/register"
            className="font-medium text-accent hover:underline"
          >
            Créer un compte
          </Link>
        </p>
      </form>

    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-6 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 20% 20%, rgba(240, 180, 41, 0.1), transparent 55%),
            radial-gradient(ellipse 50% 40% at 90% 80%, rgba(35, 37, 57, 0.9), transparent 50%)
          `,
        }}
      />

      <Suspense
        fallback={
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-accent" />
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
