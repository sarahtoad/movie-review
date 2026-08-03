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
    Genre
  </label>

  <select
  value={movie.genre}
  onChange={(e) => handleChange("genre", e.target.value)}
  className="w-full rounded-md border border-border bg-ink px-4 py-3 text-cream outline-none transition focus:border-accent/60"
>
  <option value="">Sélectionnez un genre</option>

  {GENRES.map((genre) => (
    <option key={genre} value={genre}>
      {genre}
    </option>
  ))}
</select>
</div>



<MovieField
label="Année"
value={movie.year}
placeholder="2024"
onChange={(v)=>handleChange("year",v)}
/>


</div>



<MovieField
label="Affiche"
value={movie.poster}
placeholder="URL de l'image"
onChange={(v)=>handleChange("poster",v)}
/>



<MovieField
label="Synopsis"
type="textarea"
value={movie.synopsis}
placeholder="Description du film..."
onChange={(v)=>handleChange("synopsis",v)}
/>



<div className="grid grid-cols-2 gap-4">


<MovieField
label="Durée"
value={movie.duration}
placeholder="150"
onChange={(v)=>handleChange("duration",v)}
/>



<MovieField
label="Pays"
value={movie.country}
placeholder="USA"
onChange={(v)=>handleChange("country",v)}
/>


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