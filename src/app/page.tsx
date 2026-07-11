import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-bold tracking-tight sm:text-6xl text-[var(--color-accent)]">
        Hey, I&apos;m building things.
      </h1>
      <p className="mt-4 max-w-md text-lg text-[var(--color-accent)]/50">
        一个 Agent 驱动的个人实验站——文章、小游戏、以及各种好玩的东西。
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/articles" className="rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-[var(--color-primary)] transition hover:opacity-80">
          读文章
        </Link>
        <Link href="/games" className="rounded-lg border border-[var(--color-secondary)] px-5 py-2.5 text-sm font-medium text-[var(--color-accent)] transition hover:bg-[var(--color-secondary)]/20">
          玩游戏
        </Link>
      </div>
    </div>
  );
}
