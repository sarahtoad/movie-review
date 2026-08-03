import Link from "next/link";
import { Film } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
  buttonText?: string;
  buttonHref?: string;
  icon?: React.ReactNode;
};

export default function EmptyState({
  title,
  description,
  buttonText,
  buttonHref,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface px-8 py-20 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-elevated text-accent">
        {icon ?? <Film size={32} />}
      </div>

      <h2 className="font-display text-2xl font-semibold text-white">{title}</h2>

      <p className="mt-3 max-w-md leading-7 text-muted">{description}</p>

      {buttonText && buttonHref && (
        <Link href={buttonHref} className="btn-primary mt-8">
          {buttonText}
        </Link>
      )}
    </div>
  );
}
