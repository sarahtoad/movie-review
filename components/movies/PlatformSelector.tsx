interface Props {
  platform: string;
  link: string;
  setPlatform: (v: string) => void;
  setLink: (v: string) => void;
}

export default function PlatformSelector({
  platform,
  link,
  setPlatform,
  setLink,
}: Props) {
  return (
    <div className="mt-6">
      <h3 className="section-label !mb-4">Où regarder ?</h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="rounded-md border border-border bg-ink p-3 text-cream outline-none transition focus:border-accent/60"
        >
          <option value="">Choisir</option>
          <option>Netflix</option>
          <option>Prime Video</option>
          <option>Disney+</option>
          <option>Apple TV</option>
        </select>

        <input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://..."
          className="rounded-md border border-border bg-ink p-3 text-cream outline-none transition placeholder:text-muted/50 focus:border-accent/60"
        />
      </div>
    </div>
  );
}
