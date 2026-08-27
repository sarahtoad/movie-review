"use client";

import { useState } from "react";
import MovieField from "./MovieField";
import DuplicateAlert from "./DuplicateAlert";
import PlatformSelector from "./PlatformSelector";
import { GENRES } from "@/constants/genres";

import { AddMovie } from "@/types/addMovie";


export default function AddMovieForm() {

const [movie, setMovie] = useState<AddMovie>({
  title:"",
  genre:"",
  year:"",
  poster:"",
  synopsis:"",
  duration:"",
  country:"",
  director:"",
  trailer:"",
  platform:"",
  platformLink:""
});

const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);
const [loading, setLoading] = useState(false);

function handleChange(
field:keyof AddMovie,
value:string
){

setMovie({
...movie,
[field]:value
});

}


async function submit() {
  setLoading(true);
  setShowDuplicateAlert(false);

  const payload = {
    title: movie.title,
    posterUrl: movie.poster || undefined,

    genres: movie.genre ? [movie.genre] : [],

    year: Number(movie.year),

    synopsis: movie.synopsis || undefined,

    trailer: movie.trailer || undefined,

    runtime: movie.duration
      ? Number(movie.duration)
      : undefined,

    country: movie.country || undefined,

    director: movie.director || undefined,

    platforms:
      movie.platform && movie.platformLink
        ? [
            {
              name: movie.platform,
              link: movie.platformLink,
            },
          ]
        : [],
  };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/movies`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      if (
        res.status === 409 ||
        data.error?.toLowerCase().includes("existe")
      ) {
        setShowDuplicateAlert(true);
        return;
      }

      throw new Error(JSON.stringify(data));
    }

    alert("Film ajouté !");
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
}


return (

<div className="surface-panel w-full p-6 sm:p-8">


{showDuplicateAlert && <DuplicateAlert />}



<MovieField
label="Titre"
required
value={movie.title}
placeholder="Ex: Interstellar"
onChange={(v)=>handleChange("title",v)}
/>



<div className="grid grid-cols-2 gap-4">


<div>
  <label className="mb-2 block text-sm font-medium text-cream">
    Genres <span className="text-red-500">*</span>
  </label>
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto rounded-md border border-border bg-ink p-3">
    {GENRES.map((g) => {
      const isSelected = movie.genre?.includes(g); // Supposons que movie.genre est un tableau ou gère plusieurs valeurs
      return (
        <label key={g} className="flex items-center gap-2 text-sm text-cream cursor-pointer">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              const currentGenres = Array.isArray(movie.genre) ? movie.genre : [];
              const updated = e.target.checked
                ? [...currentGenres, g]
                : currentGenres.filter((item) => item !== g);
              handleChange("genre", updated);
            }}
            className="rounded border-border text-accent focus:ring-0"
          />
          {g}
        </label>
      );
    })}
  </div>
</div>



<MovieField
label="Année"
required
value={movie.year}
placeholder="2024"
onChange={(v)=>handleChange("year",v)}
/>


</div>



<MovieField
label="Affiche"
required
value={movie.poster}
placeholder="URL de l'image"
onChange={(v)=>handleChange("poster",v)}
/>



<MovieField
label="Synopsis"
type="textarea"
required
value={movie.synopsis}
placeholder="Description du film..."
onChange={(v)=>handleChange("synopsis",v)}
/>



<div className="grid grid-cols-2 gap-4">


{/* État local ou calcul pour heures et minutes */}
<div className="grid grid-cols-2 gap-4">
  <div>
    <label className="mb-2 block text-sm font-medium text-cream">
      Durée <span className="text-red-500">*</span>
    </label>
    <div className="grid grid-cols-2 gap-2">
      <select
        value={Math.floor(Number(movie.duration || 0) / 60)}
        onChange={(e) => {
          const hours = Number(e.target.value);
          const currentTotal = Number(movie.duration || 0);
          const currentMins = currentTotal % 60;
          handleChange("duration", String(hours * 60 + currentMins));
        }}
        className="rounded-md border border-border bg-ink px-3 py-3 text-cream outline-none focus:border-accent/60"
      >
        {[0, 1, 2, 3, 4, 5].map((h) => (
          <option key={h} value={h}>{h} h</option>
        ))}
      </select>

      <select
        value={Number(movie.duration || 0) % 60}
        onChange={(e) => {
          const mins = Number(e.target.value);
          const currentTotal = Number(movie.duration || 0);
          const hours = Math.floor(currentTotal / 60);
          handleChange("duration", String(hours * 60 + mins));
        }}
        className="rounded-md border border-border bg-ink px-3 py-3 text-cream outline-none focus:border-accent/60"
      >
        {[0, 15, 30, 45].map((m) => (
          <option key={m} value={m}>{m} min</option>
        ))}
      </select>
    </div>
  </div>

  <MovieField
    label="Pays"
    value={movie.country}
    placeholder="USA"
    onChange={(v) => handleChange("country", v)}
  />
</div>


</div>



<MovieField
label="Réalisateur"
value={movie.director}
placeholder="Christopher Nolan"
onChange={(v)=>handleChange("director",v)}
/>



<MovieField
label="Bande annonce YouTube"
value={movie.trailer}
required
placeholder="https://youtube.com/..."
onChange={(v)=>handleChange("trailer",v)}
/>



<PlatformSelector
platform={movie.platform}
link={movie.platformLink}
setPlatform={(v)=>handleChange("platform",v)}
setLink={(v)=>handleChange("platformLink",v)}
/>



<button
type="button"
onClick={submit}
className="btn-primary mt-6 w-full"
>

Publier le film

</button>



</div>

);

}