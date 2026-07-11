import Link from "next/link";
import type { Article } from "@/lib/articles";

export function ArticleCard({ title, date, slug, tags }: Article) {
  return (
    <Link href={`/articles/${slug}`} className="group block rounded-xl border border-zinc-200/50 bg-white/60 p-6 backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-lg">
      <time className="text-sm text-zinc-400">{date}</time>
      <h2 className="mt-2 text-xl font-semibold group-hover:text-[var(--color-accent)] transition-colors">{title}</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-500">{tag}</span>
        ))}
      </div>
    </Link>
  );
}
