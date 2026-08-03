import AddMovieForm from "@/components/movies/AddMovieForm";

export default function AddMoviePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-10">
        <p className="section-label">Catalogue</p>
        <h1 className="page-title">Ajouter un film</h1>
        <p className="page-subtitle">
          Partagez un film avec la communauté CineHub.
        </p>
      </header>

      <AddMovieForm />
    </div>
  );
}
