import Link from "next/link";
import type { Game } from "@/lib/games";

export function GameCard({ slug, name, description }: Game) {
  return (
    <Link href={`/games/${slug}`} className="group block overflow-hidden rounded-xl border border-[var(--color-secondary)]/30 bg-[var(--color-primary)]/10 backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-32 items-center justify-center bg-[var(--color-secondary)]/20 text-4xl">🎮</div>
      <div className="p-4">
        <h3 className="font-semibold text-[var(--color-accent)]">{name}</h3>
        <p className="mt-1 text-sm text-[var(--color-accent)]/50">{description}</p>
      </div>
    </Link>
  );
}
