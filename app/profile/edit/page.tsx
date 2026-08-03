"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { Camera, Save, Image as ImageIcon } from "lucide-react";

export default function EditProfilePage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  // Fichiers prêts à être uploadés
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();

        if (!res.ok) throw new Error(JSON.stringify(data));

        const user = data.user || data;
        setName(user.name ?? "");
        setUsername(user.username ?? "");
        setEmail(user.email ?? "");
        setBio(user.bio ?? "");
        setAvatarUrl(user.avatar ?? null);
        setBannerUrl(user.banner ?? null);
      } catch (err) {
        console.error("Erreur lors du chargement :", err);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  // Handlers pour la prévisualisation locale
  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  const handleBannerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      setBannerUrl(URL.createObjectURL(file));
    }
  };

  async function saveProfile() {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("bio", bio);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }
      if (bannerFile) {
        formData.append("banner", bannerFile);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
        {
          method: "PATCH",
          credentials: "include",
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(data));

      alert("Profil mis à jour avec succès !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour du profil.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="py-20 text-center text-cream">Chargement...</p>;
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-10">
        <p className="section-label">Profil</p>
        <h1 className="page-title">Modifier le profil</h1>
        <p className="page-subtitle">
          Mettez à jour vos informations personnelles et vos images.
        </p>
      </header>

      <div className="surface-panel overflow-hidden p-6 sm:p-8">
        {/* Banner Section */}
        <div className="relative mb-16 h-44 w-full rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 overflow-hidden border border-border">
          {bannerUrl ? (
            <img
              src={bannerUrl}
              alt="Bannière"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted">
              <ImageIcon className="mr-2" size={20} /> Aucune bannière
            </div>
          )}

          <label
            htmlFor="banner-upload"
            className="absolute bottom-3 right-3 flex cursor-pointer items-center gap-2 rounded-md bg-ink/80 px-3 py-1.5 text-xs text-cream backdrop-blur-md transition hover:bg-ink"
          >
            <Camera size={14} />
            Changer la bannière
          </label>
          <input
            id="banner-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleBannerChange}
          />

          {/* Avatar Section Overlay */}
          <div className="absolute -bottom-10 left-6">
            <div className="relative h-24 w-24 rounded-full border-4 border-ink bg-gradient-to-br from-accent to-[#A63446] overflow-hidden flex items-center justify-center font-display text-3xl font-semibold text-ink">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                (name[0] || "U").toUpperCase()
              )}

              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 transition hover:opacity-100"
              >
                <Camera size={20} className="text-white" />
              </label>
            </div>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
        </div>

        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            saveProfile();
          }}
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-cream">
              Nom complet
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-border bg-ink px-4 py-3 text-cream outline-none transition focus:border-accent/60"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-cream">
              Nom d&apos;utilisateur
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-md border border-border bg-ink px-4 py-3 text-cream outline-none transition focus:border-accent/60"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-cream">
              Adresse e-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-border bg-ink px-4 py-3 text-cream outline-none transition focus:border-accent/60"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-cream">
              Biographie
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full resize-y rounded-md border border-border bg-ink px-4 py-3 text-cream outline-none transition focus:border-accent/60"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}