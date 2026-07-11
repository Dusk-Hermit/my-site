import fs from "fs";
import path from "path";

export type Game = { slug: string; name: string; description: string; cover?: string };

const GAMES_FILE = path.join(process.cwd(), "content", "games", "games.json");

export async function getAllGames(): Promise<Game[]> {
  if (!fs.existsSync(GAMES_FILE)) return [];
  return JSON.parse(fs.readFileSync(GAMES_FILE, "utf-8")) as Game[];
}
