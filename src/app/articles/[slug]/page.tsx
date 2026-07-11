import { getAllArticles } from "@/lib/articles";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import { marked } from "marked";

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
  const html = await marked.parse(body);

  return (
    <article className="mx-auto max-w-2xl py-12">
      <div
        className="prose prose-lg prose-zinc font-serif max-w-none
          prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-[var(--color-accent)]
          prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
          prose-p:leading-relaxed prose-p:my-4 prose-p:text-[var(--color-accent)]/80
          prose-a:text-[var(--color-accent)] prose-a:underline prose-a:decoration-[var(--color-secondary)]
          prose-strong:text-[var(--color-accent)] prose-strong:font-semibold
          prose-code:text-sm prose-code:bg-[var(--color-secondary)]/20 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-[var(--color-secondary)]/10 prose-pre:border prose-pre:border-[var(--color-secondary)]/20 prose-pre:rounded-xl
          prose-li:my-1 prose-li:text-[var(--color-accent)]/80 prose-li:leading-relaxed
          prose-blockquote:border-l-[var(--color-accent)] prose-blockquote:bg-[var(--color-surface)]/10 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
          prose-hr:border-[var(--color-secondary)]/30
          prose-table:border-[var(--color-secondary)]/30
          prose-th:bg-[var(--color-surface)]/20
        "
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
