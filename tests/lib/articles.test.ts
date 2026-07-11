import { describe, it, expect } from "vitest";
import { getAllArticles } from "@/lib/articles";

describe("getAllArticles", () => {
  it("returns articles sorted by date descending", async () => {
    const articles = await getAllArticles();
    expect(articles.length).toBeGreaterThan(0);
    for (let i = 1; i < articles.length; i++) {
      expect(new Date(articles[i - 1].date).getTime())
        .toBeGreaterThanOrEqual(new Date(articles[i].date).getTime());
    }
  });
  it("each article has required fields", async () => {
    const articles = await getAllArticles();
    for (const a of articles) {
      expect(a.slug).toBeTruthy();
      expect(a.title).toBeTruthy();
      expect(a.date).toBeTruthy();
      expect(Array.isArray(a.tags)).toBe(true);
    }
  });
});
