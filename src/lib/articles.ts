import fs from "fs";
import path from "path";

export type Article = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
};

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx > 0) {
      meta[line.slice(0, colonIdx).trim()] = line.slice(colonIdx + 1).trim();
    }
  }
  return { meta, body: match[2].trim() };
}

export async function getAllArticles(): Promise<Article[]> {
  const dir = path.join(process.cwd(), "content", "articles");
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  const articles: Article[] = [];
  for (const file of files) {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { meta } = parseFrontmatter(raw);
    articles.push({
      slug: file.replace(/\.mdx$/, ""),
      title: meta.title || file,
      date: meta.date || "1970-01-01",
      tags: meta.tags ? meta.tags.split(",").map((t) => t.trim()) : [],
      excerpt: meta.excerpt || "",
    });
  }
  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
