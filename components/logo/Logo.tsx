import Link from "next/link";

type LogoProps = {
  size?: "sm" | "md" | "lg";
};

export default function Logo({ size = "md" }: LogoProps) {
  const titleSize = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const dotSize = {
    sm: "h-2 w-2",
    md: "h-2.5 w-2.5",
    lg: "h-3 w-3",
  };

  return (
    <Link
      href="/"
      className="group flex items-center gap-2.5 transition-opacity hover:opacity-90"
    >
      <span
        className={`${dotSize[size]} rounded-full bg-accent shadow-[0_0_14px_rgba(240,180,41,0.55)] transition-transform duration-300 group-hover:scale-110`}
      />

      <span
        className={`${titleSize[size]} font-display font-semibold tracking-[0.14em]`}
      >
        <span className="text-cream">CINE</span>
        <span className="text-accent">HUB</span>
      </span>
    </Link>
  );
}
