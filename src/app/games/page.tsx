import { getAllGames } from "@/lib/games";
import { GameCard } from "@/components/GameCard";

export default async function GamesPage() {
  const games = await getAllGames();
  if (games.length === 0) {
    return <div className="py-20 text-center text-zinc-400"><p className="text-lg">即将上线</p><p className="mt-1 text-sm">小游戏正在开发中...</p></div>;
  }
  return (
    <div>
      <h1 className="text-3xl font-bold">小游戏</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">{games.map((g) => <GameCard key={g.slug} {...g} />)}</div>
    </div>
  );
}
