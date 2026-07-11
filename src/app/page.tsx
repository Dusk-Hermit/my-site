import Link from "next/link";
import { getAllArticles } from "@/lib/articles";

export default async function Home() {
  const articles = await getAllArticles();
  const latest = articles.slice(0, 2);

  return (
    <div className="space-y-20 pb-8">
      {/* Hero */}
      <section className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <div className="mb-6 flex gap-2">
          {["#fafafa","#e4e4e7","#d4d4d8","#a1a1aa","#18181b"].map((c, i) => (
            <div key={i} className="h-3 w-3 rounded-full" style={{ background: `var(--color-${['primary','secondary','surface','muted','accent'][i]})`, boxShadow: `0 0 0 2px var(--color-${['primary','secondary','surface','muted','accent'][i]})` }} />
          ))}
        </div>
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl text-[var(--color-accent)]">Hey, I&apos;m building things.</h1>
        <p className="mt-4 max-w-md text-lg text-[var(--color-accent)]/50">一个 Agent 驱动的个人实验站——文章、小游戏、以及各种好玩的东西。</p>
        <div className="mt-8 flex gap-4">
          <Link href="/articles" className="rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-[var(--color-primary)] transition hover:opacity-80">读文章</Link>
          <Link href="/color-analyzer" className="rounded-lg border border-[var(--color-secondary)] px-5 py-2.5 text-sm font-medium text-[var(--color-accent)] transition hover:bg-[var(--color-secondary)]/20">🎨 换个配色</Link>
        </div>
      </section>

      {/* Color palette showcase */}
      <section>
        <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-[var(--color-muted)]">当前主题色</h2>
        <div className="mt-3 flex justify-center gap-1 rounded-xl overflow-hidden">
          {["primary","secondary","surface","muted","accent"].map((k) => (
            <div key={k} className="h-16 flex-1 flex items-end justify-center pb-1" style={{ backgroundColor: `var(--color-${k})` }}>
              <span className="text-[10px] font-mono opacity-60" style={{ color: k==="accent"?"var(--color-primary)":"var(--color-accent)" }}>{k}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Latest articles */}
      {latest.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[var(--color-accent)]">最新文章</h2>
            <Link href="/articles" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors">查看全部 →</Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {latest.map((a) => (
              <Link key={a.slug} href={`/articles/${a.slug}`} className="group rounded-xl border border-[var(--color-secondary)]/30 bg-[var(--color-surface)]/10 p-5 transition hover:-translate-y-1 hover:shadow-lg">
                <time className="text-xs text-[var(--color-muted)]">{a.date}</time>
                <h3 className="mt-1 font-semibold text-[var(--color-accent)]">{a.title}</h3>
                <p className="mt-1 text-sm text-[var(--color-accent)]/50 line-clamp-2">{a.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Quick links */}
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { href: "/articles", emoji: "📝", title: "文章", desc: "阅读技术文章和思考", color: "primary" },
          { href: "/games", emoji: "🎮", title: "小游戏", desc: "浏览器内的小游戏合集", color: "secondary" },
          { href: "/color-analyzer", emoji: "🎨", title: "色彩分析器", desc: "上传图片，改变整个网站的配色", color: "surface" },
        ].map(({ href, emoji, title, desc, color }) => (
          <Link key={href} href={href} className="group rounded-xl p-6 text-center transition hover:-translate-y-1 hover:shadow-lg" style={{ backgroundColor: `var(--color-${color})20` }}>
            <span className="text-3xl">{emoji}</span>
            <h3 className="mt-2 font-semibold text-[var(--color-accent)]">{title}</h3>
            <p className="mt-1 text-sm text-[var(--color-accent)]/50">{desc}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
