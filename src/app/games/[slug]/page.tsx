import { getAllGames } from "@/lib/games";
import { notFound } from "next/navigation";
import Game2048 from "@/components/Game2048";

export async function generateStaticParams() {
  return (await getAllGames()).map((g) => ({ slug: g.slug }));
}

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = (await getAllGames()).find((g) => g.slug === slug);
  if (!game) notFound();

  // 2048 内联渲染，其他游戏用 iframe
  if (slug === "2048") {
    return (
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-accent)]">{game.name}</h1>
        <p className="mt-2 text-[var(--color-accent)]/50">{game.description}</p>
        <Game2048 />
      </div>
    );
  }

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
