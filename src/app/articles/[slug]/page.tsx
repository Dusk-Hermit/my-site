import { getAllArticles } from "@/lib/articles";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "content", "articles", `${slug}.mdx`);
  if (!fs.existsSync(filePath)) notFound();
  const raw = fs.readFileSync(filePath, "utf-8");
  const bodyMatch = raw.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
  const body = bodyMatch ? bodyMatch[1].trim() : raw;
  return (
    <article className="prose prose-zinc max-w-none py-8">
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </article>
  );
}
