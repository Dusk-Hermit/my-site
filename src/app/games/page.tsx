import { getAllGames } from "@/lib/games";
import { GameCard } from "@/components/GameCard";

export default async function GamesPage() {
  const games = await getAllGames();
  if (games.length === 0) {
    return <div className="py-20 text-center"><p className="text-lg text-[var(--color-accent)]/40">即将上线</p><p className="mt-1 text-sm text-[var(--color-accent)]/30">小游戏正在开发中...</p></div>;
  }
  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--color-accent)]">小游戏</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">{games.map((g) => <GameCard key={g.slug} {...g} />)}</div>
    </div>
  );
}
