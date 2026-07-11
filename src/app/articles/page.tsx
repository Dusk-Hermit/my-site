import { getAllArticles } from "@/lib/articles";
import { ArticleCard } from "@/components/ArticleCard";

export default async function ArticlesPage() {
  const articles = await getAllArticles();
  if (articles.length === 0) {
    return (
      <div className="py-20 text-center text-zinc-400">
        <p className="text-lg">还没有文章</p>
        <p className="mt-1 text-sm">Agent 正在写作中...</p>
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-3xl font-bold">文章</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {articles.map((article) => <ArticleCard key={article.slug} {...article} />)}
      </div>
    </div>
  );
}
