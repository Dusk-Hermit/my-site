import Link from "next/link";
import type { Game } from "@/lib/games";

export function GameCard({ slug, name, description }: Game) {
  return (
    <Link href={`/games/${slug}`} className="group block overflow-hidden rounded-xl border border-zinc-200/50 bg-white/60 backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-32 items-center justify-center bg-zinc-100 text-4xl">🎮</div>
      <div className="p-4">
        <h3 className="font-semibold">{name}</h3>
        <p className="mt-1 text-sm text-zinc-500">{description}</p>
      </div>
    </Link>
  );
}
