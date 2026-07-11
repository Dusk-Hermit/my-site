import { getAllGames } from "@/lib/games";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return (await getAllGames()).map((g) => ({ slug: g.slug }));
}

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = (await getAllGames()).find((g) => g.slug === slug);
  if (!game) notFound();
  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-accent)]">{game.name}</h1>
      <p className="mt-2 text-[var(--color-accent)]/50">{game.description}</p>
      <div className="mt-6 overflow-hidden rounded-xl border border-[var(--color-secondary)]">
        <iframe src={`/my-site/games/${slug}/index.html`} title={game.name} className="h-[500px] w-full" />
      </div>
    </div>
  );
}
