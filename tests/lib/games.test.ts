import { describe, it, expect } from "vitest";
import { getAllGames } from "@/lib/games";

describe("getAllGames", () => {
  it("returns game array with required fields", async () => {
    const games = await getAllGames();
    expect(Array.isArray(games)).toBe(true);
    if (games.length > 0) {
      expect(games[0].slug).toBeTruthy();
      expect(games[0].name).toBeTruthy();
    }
  });
});
