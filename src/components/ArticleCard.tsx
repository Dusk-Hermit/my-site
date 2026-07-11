import Link from "next/link";
import type { Article } from "@/lib/articles";

export function ArticleCard({ title, date, slug, tags }: Article) {
  return (
    <Link href={`/articles/${slug}`} className="group block rounded-xl border border-[var(--color-secondary)]/30 bg-[var(--color-primary)]/10 backdrop-blur-sm p-6 transition hover:-translate-y-1 hover:shadow-lg">
      <time className="text-sm text-[var(--color-accent)]/40">{date}</time>
      <h2 className="mt-2 text-xl font-semibold text-[var(--color-accent)] transition-colors">{title}</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="rounded-full bg-[var(--color-secondary)]/15 px-2.5 py-0.5 text-xs text-[var(--color-accent)]/50">{tag}</span>
        ))}
      </div>
    </Link>
  );
}
