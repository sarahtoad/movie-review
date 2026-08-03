"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import Logo from "@/components/logo/Logo";
import { useAuth } from "@/components/auth/AuthProvider";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setLoading(true);

    try {
      await register({
        name: name.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
      });
      router.replace("/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Inscription impossible"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-6 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 80% 15%, rgba(240, 180, 41, 0.1), transparent 55%),
            radial-gradient(ellipse 50% 40% at 10% 85%, rgba(35, 37, 57, 0.9), transparent 50%)
          `,
        }}
      />

      <div className="relative w-full max-w-md animate-fade-up">
        <div className="mb-10 flex flex-col items-center text-center">
          <Logo size="md" />
          <p className="section-label mt-8">Rejoindre</p>
          <h1 className="page-title !text-4xl">Créer un compte</h1>
          <p className="mt-2 text-sm text-muted">
            Un compte est requis pour utiliser CineHub.
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
              Nom complet
            </label>
            <input
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="your name here"
              className="w-full rounded-md border border-border bg-ink px-4 py-3 text-cream outline-none transition placeholder:text-muted/50 focus:border-accent/60"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-cream">
              Nom d&apos;utilisateur
            </label>
            <input
              type="text"
              required
              autoComplete="username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value.replace(/\s/g, "").toLowerCase())
              }
              placeholder="@username"
              pattern="[a-zA-Z0-9_]{3,30}"
              title="Lettres, chiffres et underscore (3–30)"
              className="w-full rounded-md border border-border bg-ink px-4 py-3 text-cream outline-none transition placeholder:text-muted/50 focus:border-accent/60"
            />
          </div>

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
                autoComplete="new-password"
                minLength={6}
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

          <div>
            <label className="mb-2 block text-sm font-medium text-cream">
              Confirmer le mot de passe
            </label>
            <input
              type={showPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-md border border-border bg-ink px-4 py-3 text-cream outline-none transition placeholder:text-muted/50 focus:border-accent/60"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            <UserPlus size={16} />
            {loading ? "Création..." : "Créer mon compte"}
          </button>

          <p className="text-center text-sm text-muted">
            Déjà inscrit ?{" "}
            <Link href="/login" className="font-medium text-accent hover:underline">
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
