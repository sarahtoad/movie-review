interface Props {
  label: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  type?: "input" | "textarea";
  onChange: (value: string) => void;
}

export default function MovieField({
  label,
  value,
  placeholder,
  required,
  type = "input",
  onChange,
}: Props) {
  const fieldClass =
    "w-full rounded-md border border-border bg-ink p-3 text-cream outline-none transition placeholder:text-muted/50 focus:border-accent/60";

  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm font-medium text-muted">
        {label}
        {required && <span className="text-[#A63446]"> *</span>}
      </label>

      {type === "textarea" ? (
        <textarea
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`min-h-32 resize-y ${fieldClass}`}
        />
      ) : (
        <input
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={fieldClass}
        />
      )}
    </div>
  );
}
