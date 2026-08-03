// components/ui/PosterImage.tsx
"use client";

import { useState } from "react";

interface PosterImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
}

export default function PosterImage({ src, alt, className = "", fallbackClassName }: PosterImageProps) {
  const [error, setError] = useState(false);

  // Default fallback if URL fails or is empty
  const fallbackSrc = "/images/default-movie.jpg";

  if (error || !src) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-elevated p-4 text-center text-xs text-muted">
        <span>{alt || "Pas d'affiche"}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className={`h-full w-full object-cover object-center ${className}`}
    />
  );
}