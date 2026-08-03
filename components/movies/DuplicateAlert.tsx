
export default function DuplicateAlert() {
  return (
    <div className="mb-6 flex gap-4 rounded-md border border-[#6E2230] bg-[#A63446]/10 p-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#A63446] text-sm font-semibold text-[#A63446]">
        !
      </div>

      <div>
        <h3 className="font-semibold text-white">Ce film existe déjà.</h3>
        <p className="mt-1 text-sm text-muted">
          Un film similaire existe déjà dans CineHub.
        </p>
        <button
          type="button"
          className="mt-3 rounded-md bg-[#A63446] px-4 py-2 text-sm text-white transition hover:brightness-110"
        >
          Voir la fiche existante
        </button>
      </div>
    </div>
  );
}
