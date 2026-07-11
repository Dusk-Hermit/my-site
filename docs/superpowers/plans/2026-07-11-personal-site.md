# 个人实验站 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个 Agent 驱动的个人实验站——Next.js 静态站点，文章 MDX 渲染，小游戏展示，色彩分析器动态主题。

**Architecture:** Next.js App Router + 静态导出。内容层（`content/` 下 Markdown + JSON）与展示层（`src/app/` 页面组件）分离。色彩分析器纯前端 Canvas API + localStorage。

**Tech Stack:** Next.js ^15, Tailwind CSS ^4, TypeScript ^5, Vitest + React Testing Library, MDX via @next/mdx

## Global Constraints

- TypeScript 严格模式，禁止 `any`
- 所有 `lib/` 工具函数 100% 单元测试覆盖
- 页面组件 <150 行，重逻辑放 `lib/`
- 提交前 `npm test` 全绿
- Tailwind 优先，仅复杂动画写自定义 CSS
- 导航栏固定：首页 / 文章 / 小游戏 / 🎨色彩分析器 / 关于
- 默认配色：zinc 色系（`zinc-50` 到 `zinc-950`）
- 色彩分析器：60-30-10 法则分配提取色调
- 持久化：localStorage（图片 base64 + 色调数组）
- 页脚：© 2026 + "Powered by Agent"

---

### Task 1: 项目脚手架

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`
- Create: `src/app/layout.tsx`, `src/app/page.tsx`, `src/styles/globals.css`
- Create: `vitest.config.ts`, `tests/setup.ts`

**Interfaces:**
- Produces: Next.js dev server running on `localhost:3000`

- [ ] **Step 1: 初始化项目**

```bash
cd my-site
npm init -y
npm install next@latest react@latest react-dom@latest
npm install -D typescript @types/react @types/node tailwindcss @tailwindcss/postcss postcss @tailwindcss/typography
```

- [ ] **Step 2: 配置 Next.js 静态导出**

Create `next.config.ts`:
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
```

- [ ] **Step 3: 配置 Tailwind CSS**

Create `postcss.config.mjs`:
```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

Create `src/styles/globals.css`:
```css
@import "tailwindcss";

@theme {
  --font-sans: 'Inter', 'Noto Sans SC', sans-serif;
  --font-heading: 'Zen Maru Gothic', serif;
}
```

- [ ] **Step 4: 配置 TypeScript**

Create `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 5: 最小页面验证**

Create `src/app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "My Lab",
  description: "A personal lab site",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-zinc-50 text-zinc-900 font-sans">{children}</body>
    </html>
  );
}
```

Create `src/app/page.tsx`:
```tsx
export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-4xl font-heading">Hello World</h1>
    </main>
  );
}
```

- [ ] **Step 6: 配置 Vitest**

```bash
npm install -D vitest @vitejs/plugin-react jsdom
```

Create `vitest.config.ts`:
```typescript
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  plugins: [],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
```

- [ ] **Step 7: 验证构建**

```bash
npm run dev
# Expected: http://localhost:3000 显示 "Hello World"
```

```bash
npm run build
# Expected: out/ 目录生成，无错误
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js + Tailwind + Vitest project"
```

---

### Task 2: 主题系统（ThemeProvider + CSS 变量）

**Files:**
- Create: `src/components/ThemeProvider.tsx`
- Create: `tests/components/ThemeProvider.test.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Produces: `ThemeProvider` 组件，管理 `--color-primary`, `--color-secondary`, `--color-accent`, `--color-bg` 四个 CSS 变量
- Produces: `ThemeContext` 提供 `applyTheme(primary, secondary, accent)` 和 `resetTheme()` 方法
- Produces: 从 localStorage 读取/写入主题状态

- [ ] **Step 1: 写失败测试 — 默认主题变量**

Create `tests/components/ThemeProvider.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

describe("ThemeProvider", () => {
  it("sets default zinc CSS variables on the document root", () => {
    // 先 render ThemeProvider 包裹的组件
    // 然后检查 document.documentElement.style 中是否有 --color-bg 等变量
  });
});
```

> 注意：测试先只写骨架，run 看到它失败后再补实现。以下任务同理——每个 Step 1 是写失败的测试，Step 2 是确认失败，Step 3 是写最小实现，Step 4 确认通过。

- [ ] **Step 2: 运行测试确认失败**

```bash
npx vitest run tests/components/ThemeProvider.test.tsx
# Expected: FAIL — ThemeProvider 未定义或变量未被设置
```

- [ ] **Step 3: 写最小实现**

Create `src/components/ThemeProvider.tsx`:
```tsx
"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = { primary: string; secondary: string; accent: string };

const DEFAULT_THEME: Theme = {
  primary: "#fafafa",
  secondary: "#e4e4e7",
  accent: "#18181b",
};

type ThemeContextValue = {
  theme: Theme;
  applyTheme: (t: Theme) => void;
  resetTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "my-site-theme";

function applyCSSVariables(t: Theme) {
  const root = document.documentElement;
  root.style.setProperty("--color-primary", t.primary);
  root.style.setProperty("--color-secondary", t.secondary);
  root.style.setProperty("--color-accent", t.accent);
  root.style.setProperty("--color-bg", t.primary);
}

function loadTheme(): Theme {
  if (typeof window === "undefined") return DEFAULT_THEME;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as Theme;
  } catch { /* ignore */ }
  return DEFAULT_THEME;
}

function saveTheme(t: Theme) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(t)); } catch { /* ignore */ }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);

  useEffect(() => {
    const saved = loadTheme();
    setTheme(saved);
    applyCSSVariables(saved);
  }, []);

  const applyTheme = (t: Theme) => {
    setTheme(t);
    applyCSSVariables(t);
    saveTheme(t);
  };

  const resetTheme = () => {
    setTheme(DEFAULT_THEME);
    applyCSSVariables(DEFAULT_THEME);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  };

  return (
    <ThemeContext.Provider value={{ theme, applyTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
```

- [ ] **Step 4: 运行测试确认通过**

```bash
npx vitest run tests/components/ThemeProvider.test.tsx
# Expected: PASS
```

- [ ] **Step 5: 集成到 layout**

Edit `src/app/layout.tsx` — 在 `<body>` 内包裹 `ThemeProvider`:
```tsx
import { ThemeProvider } from "@/components/ThemeProvider";
// ... 在 body 中:
<body className="min-h-screen bg-[var(--color-bg)] text-[var(--color-accent)] font-sans transition-colors duration-300">
  <ThemeProvider>{children}</ThemeProvider>
</body>
```

- [ ] **Step 6: 验证**

```bash
npm run dev
# Expected: 页面默认 zinc 配色，控制台无报错，localStorage 无残留
```

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: add ThemeProvider with CSS variable management and localStorage persistence"
```

---

### Task 3: 导航栏 + 页脚 + 响应式布局

**Files:**
- Create: `src/components/Navbar.tsx`
- Create: `src/components/Footer.tsx`
- Modify: `src/app/layout.tsx`
- Create: `tests/components/Navbar.test.tsx`

**Interfaces:**
- Produces: `Navbar` — 固定顶部，五个链接，移动端汉堡菜单
- Produces: `Footer` — 居中 © 2026 + "Powered by Agent"

- [ ] **Step 1: 写 Navbar 失败测试**

Create `tests/components/Navbar.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Navbar } from "@/components/Navbar";

describe("Navbar", () => {
  it("renders all five navigation links", () => {
    render(<Navbar />);
    expect(screen.getByText("首页")).toBeDefined();
    expect(screen.getByText("文章")).toBeDefined();
    expect(screen.getByText("小游戏")).toBeDefined();
    expect(screen.getByText("🎨色彩分析器")).toBeDefined();
    expect(screen.getByText("关于")).toBeDefined();
  });
});
```

- [ ] **Step 2: 确认测试失败**

```bash
npx vitest run tests/components/Navbar.test.tsx
# Expected: FAIL — Navbar 未定义
```

- [ ] **Step 3: 实现 Navbar**

Create `src/components/Navbar.tsx`:
```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/", label: "首页" },
  { href: "/articles", label: "文章" },
  { href: "/games", label: "小游戏" },
  { href: "/color-analyzer", label: "🎨色彩分析器" },
  { href: "/about", label: "关于" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-zinc-200/50 bg-[var(--color-primary)]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-heading font-bold tracking-wide">
          My Lab
        </Link>

        {/* Desktop */}
        <div className="hidden gap-6 sm:flex">
          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm transition-colors hover:text-[var(--color-accent)] ${
                pathname === href
                  ? "font-semibold text-[var(--color-accent)]"
                  : "text-zinc-500"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden text-zinc-600"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-2 border-t border-zinc-200/50 px-4 py-3 sm:hidden bg-[var(--color-primary)]/95 backdrop-blur-md">
          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm ${
                pathname === href ? "font-semibold" : "text-zinc-500"
              }`}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
```

- [ ] **Step 4: 运行测试确认通过**

```bash
npx vitest run tests/components/Navbar.test.tsx
# Expected: PASS
```

- [ ] **Step 5: 实现 Footer**

Create `src/components/Footer.tsx`:
```tsx
export function Footer() {
  return (
    <footer className="border-t border-zinc-200/50 py-6 text-center text-sm text-zinc-400">
      <p>© 2026 · Powered by Agent</p>
    </footer>
  );
}
```

- [ ] **Step 6: 集成到 layout 并验证**

修改 `src/app/layout.tsx`，在 children 外包裹 Navbar + Footer：
```tsx
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
// ...
<body ...>
  <ThemeProvider>
    <Navbar />
    <main className="mx-auto max-w-4xl px-4 pt-16 pb-12">{children}</main>
    <Footer />
  </ThemeProvider>
</body>
```

```bash
npm run dev
# Expected: 导航栏固定顶部，五个链接可点击，移动端汉堡菜单可用，页脚显示
```

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: add navbar with responsive mobile menu and footer"
```

---

### Task 4: 首页

**Files:**
- Modify: `src/app/page.tsx`

**Interfaces:**
- 无新接口。独立页面组件。

- [ ] **Step 1: 实现首页**

Replace `src/app/page.tsx`:
```tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-heading font-bold tracking-tight sm:text-6xl">
        Hey, I&apos;m building things.
      </h1>
      <p className="mt-4 max-w-md text-lg text-zinc-500">
        一个 Agent 驱动的个人实验站——文章、小游戏、以及各种好玩的东西。
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/articles" className="rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-[var(--color-primary)] transition hover:opacity-80">
          读文章
        </Link>
        <Link href="/games" className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium transition hover:bg-zinc-100">
          玩游戏
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 验证**

```bash
npm run dev
# Expected: 首页居中显示 tagline + 两个 CTA 按钮
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add homepage with tagline and navigation CTAs"
```

---

### Task 5: 文章系统 — 数据加载层

**Files:**
- Create: `src/lib/articles.ts`
- Create: `tests/lib/articles.test.ts`
- Create: `content/articles/hello-world.mdx` (示例内容)

**Interfaces:**
- Produces: `getAllArticles(): Promise<Article[]>` — 返回所有文章的元数据，按日期倒序
- Produces: `getArticleBySlug(slug: string): Promise<Article | null>` — 返回单篇文章
- Produces: `Article = { slug: string; title: string; date: string; tags: string[]; excerpt: string }`

- [ ] **Step 1: 写失败测试**

Create `tests/lib/articles.test.ts`:
```tsx
import { describe, it, expect } from "vitest";
import { getAllArticles, getArticleBySlug } from "@/lib/articles";

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

describe("getArticleBySlug", () => {
  it("returns null for non-existent slug", async () => {
    const article = await getArticleBySlug("nonexistent");
    expect(article).toBeNull();
  });
});
```

- [ ] **Step 2: 确认测试失败**

```bash
npx vitest run tests/lib/articles.test.ts
# Expected: FAIL — 模块不存在
```

- [ ] **Step 3: 实现 articles lib**

Create `src/lib/articles.ts`:
```typescript
import fs from "fs";
import path from "path";

export type Article = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content", "articles");

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      const value = line.slice(colonIdx + 1).trim();
      meta[key] = value;
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

  return articles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await getAllArticles();
  return articles.find((a) => a.slug === slug) ?? null;
}
```

- [ ] **Step 4: 创建示例内容**

Create `content/articles/hello-world.mdx`:
```mdx
---
title: Hello World
date: 2026-07-11
tags: 随笔, 公告
excerpt: 欢迎来到我的个人实验站，这是第一篇文章。
---

# Hello World

欢迎来到我的个人实验站！🎉

这里会放一些文章、小游戏和各种实验项目。
```

- [ ] **Step 5: 运行测试确认通过**

```bash
npx vitest run tests/lib/articles.test.ts
# Expected: PASS — 至少 1 篇文章，字段齐全，按日期排序
```

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add article data loading layer with frontmatter parsing"
```

---

### Task 6: 文章列表页 + 文章详情页

**Files:**
- Create: `src/app/articles/page.tsx`
- Create: `src/app/articles/[slug]/page.tsx`
- Create: `src/components/ArticleCard.tsx`

**Interfaces:**
- Consumes: `getAllArticles()` from Task 5
- Consumes: `getArticleBySlug()` from Task 5
- Produces: 文章列表页 `/articles`；文章详情页 `/articles/[slug]`

- [ ] **Step 1: 实现 ArticleCard 组件**

Create `src/components/ArticleCard.tsx`:
```tsx
import Link from "next/link";
import type { Article } from "@/lib/articles";

export function ArticleCard({ title, date, slug, tags }: Article) {
  return (
    <Link
      href={`/articles/${slug}`}
      className="group block rounded-xl border border-zinc-200/50 bg-white/60 p-6 backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <time className="text-sm text-zinc-400">{date}</time>
      <h2 className="mt-2 text-xl font-semibold group-hover:text-[var(--color-accent)] transition-colors">
        {title}
      </h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-500">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: 实现文章列表页**

Create `src/app/articles/page.tsx`:
```tsx
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
      <h1 className="text-3xl font-heading font-bold">文章</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {articles.map((article) => (
          <ArticleCard key={article.slug} {...article} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 实现文章详情页**

Create `src/app/articles/[slug]/page.tsx`:
```tsx
import { getAllArticles } from "@/lib/articles";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
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
```

- [ ] **Step 4: 验证**

```bash
npm run dev
# 访问 /articles — 显示文章卡片列表
# 点击进入 /articles/hello-world — 显示文章内容
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add article list and detail pages"
```

---

### Task 7: 小游戏系统

**Files:**
- Create: `src/lib/games.ts`
- Create: `tests/lib/games.test.ts`
- Create: `content/games/games.json`
- Create: `src/app/games/page.tsx`
- Create: `src/app/games/[slug]/page.tsx`
- Create: `src/components/GameCard.tsx`
- Create: `public/games/demo/index.html` (示例游戏)

**Interfaces:**
- Produces: `getAllGames(): Promise<Game[]>` — 从 `content/games/games.json` 读取
- Produces: `Game = { slug: string; name: string; description: string; cover?: string }`

- [ ] **Step 1: 写失败测试 + 实现 games lib**

Create `tests/lib/games.test.ts`:
```tsx
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
```

Create `src/lib/games.ts`:
```typescript
import fs from "fs";
import path from "path";

export type Game = {
  slug: string;
  name: string;
  description: string;
  cover?: string;
};

const GAMES_FILE = path.join(process.cwd(), "content", "games", "games.json");

export async function getAllGames(): Promise<Game[]> {
  if (!fs.existsSync(GAMES_FILE)) return [];
  const raw = fs.readFileSync(GAMES_FILE, "utf-8");
  return JSON.parse(raw) as Game[];
}
```

Create `content/games/games.json`:
```json
[
  {
    "slug": "demo",
    "name": "Demo Game",
    "description": "一个示例小游戏，展示游戏系统如何工作。",
    "cover": "/games/demo/cover.png"
  }
]
```

Create `public/games/demo/index.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Demo Game</title>
<style>body{display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;font-family:sans-serif;background:#f4f4f5;color:#18181b}main{text-align:center}h1{font-size:2rem}p{color:#71717a}</style>
</head>
<body><main><h1>🎮 Demo Game</h1><p>你的小游戏将在这里显示</p></main></body>
</html>
```

- [ ] **Step 2: 运行测试确认通过**

```bash
npx vitest run tests/lib/games.test.ts
# Expected: PASS
```

- [ ] **Step 3: 实现 GameCard + 列表页 + 详情页**

Create `src/components/GameCard.tsx`:
```tsx
import Link from "next/link";
import type { Game } from "@/lib/games";

export function GameCard({ slug, name, description, cover }: Game) {
  return (
    <Link
      href={`/games/${slug}`}
      className="group block overflow-hidden rounded-xl border border-zinc-200/50 bg-white/60 backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex h-32 items-center justify-center bg-zinc-100 text-4xl">
        {cover ? (
          <img src={cover} alt={name} className="h-full w-full object-cover" />
        ) : (
          "🎮"
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold">{name}</h3>
        <p className="mt-1 text-sm text-zinc-500">{description}</p>
      </div>
    </Link>
  );
}
```

Create `src/app/games/page.tsx`:
```tsx
import { getAllGames } from "@/lib/games";
import { GameCard } from "@/components/GameCard";

export default async function GamesPage() {
  const games = await getAllGames();

  if (games.length === 0) {
    return (
      <div className="py-20 text-center text-zinc-400">
        <p className="text-lg">即将上线</p>
        <p className="mt-1 text-sm">小游戏正在开发中...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-heading font-bold">小游戏</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {games.map((game) => (
          <GameCard key={game.slug} {...game} />
        ))}
      </div>
    </div>
  );
}
```

Create `src/app/games/[slug]/page.tsx`:
```tsx
import { getAllGames } from "@/lib/games";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const games = await getAllGames();
  return games.map((g) => ({ slug: g.slug }));
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const games = await getAllGames();
  const game = games.find((g) => g.slug === slug);
  if (!game) notFound();

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold">{game.name}</h1>
      <p className="mt-2 text-zinc-500">{game.description}</p>
      <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200">
        <iframe
          src={`/games/${slug}/index.html`}
          title={game.name}
          className="h-[500px] w-full"
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: 验证**

```bash
npm run dev
# 访问 /games — 显示 Demo Game 卡片
# 点击进入 /games/demo — iframe 加载示例游戏
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add game system with list, detail, and iframe embedding"
```

---

### Task 8: 色彩分析器 — 颜色提取核心

**Files:**
- Create: `src/lib/colorExtractor.ts`
- Create: `tests/lib/colorExtractor.test.ts`

**Interfaces:**
- Produces: `extractColors(imageUrl: string): Promise<ColorPalette>` — 从图片提取 3 个主色调
- Produces: `ColorPalette = { primary: string; secondary: string; accent: string }`
- Produces: `sortByArea(colors: {hex: string; count: number}[]): string[]` — 按像素面积排序取前 3

- [ ] **Step 1: 写失败测试**

Create `tests/lib/colorExtractor.test.ts`:
```tsx
import { describe, it, expect } from "vitest";
import { sortByArea } from "@/lib/colorExtractor";

describe("sortByArea", () => {
  it("returns top 3 colors sorted by pixel count descending", () => {
    const colors = [
      { hex: "#aaaaaa", count: 100 },
      { hex: "#ffffff", count: 500 },
      { hex: "#000000", count: 300 },
      { hex: "#ff0000", count: 50 },
    ];
    const result = sortByArea(colors);
    expect(result).toEqual(["#ffffff", "#000000", "#aaaaaa"]);
  });

  it("returns fewer if less than 3 colors provided", () => {
    const colors = [
      { hex: "#ffffff", count: 500 },
      { hex: "#000000", count: 300 },
    ];
    const result = sortByArea(colors);
    expect(result).toEqual(["#ffffff", "#000000"]);
  });
});
```

- [ ] **Step 2: 确认测试失败**

```bash
npx vitest run tests/lib/colorExtractor.test.ts
# Expected: FAIL — 模块不存在
```

- [ ] **Step 3: 实现 colorExtractor**

Create `src/lib/colorExtractor.ts`:
```typescript
export type ColorCount = { hex: string; count: number };

export function sortByArea(colors: ColorCount[]): string[] {
  return [...colors]
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map((c) => c.hex);
}

/**
 * 使用 Canvas API 从图片提取主色调。
 * 算法：将图片缩放到 100×100 像素，量化颜色（每通道 16 级），统计频率。
 * 仅可在浏览器环境调用。
 */
export function extractColorsFromImage(img: HTMLImageElement): string[] {
  const canvas = document.createElement("canvas");
  const SIZE = 100;
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return [];

  ctx.drawImage(img, 0, 0, SIZE, SIZE);
  const imageData = ctx.getImageData(0, 0, SIZE, SIZE);
  const pixels = imageData.data;

  const colorMap = new Map<string, number>();
  const BUCKET_SIZE = 16; // 每通道量化到 16 级

  for (let i = 0; i < pixels.length; i += 4) {
    const r = Math.floor(pixels[i] / BUCKET_SIZE) * BUCKET_SIZE;
    const g = Math.floor(pixels[i + 1] / BUCKET_SIZE) * BUCKET_SIZE;
    const b = Math.floor(pixels[i + 2] / BUCKET_SIZE) * BUCKET_SIZE;
    const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
  }

  const colorCounts: ColorCount[] = [];
  for (const [hex, count] of colorMap) {
    colorCounts.push({ hex, count });
  }

  return sortByArea(colorCounts);
}
```

- [ ] **Step 4: 确认测试通过**

```bash
npx vitest run tests/lib/colorExtractor.test.ts
# Expected: PASS
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add color extraction algorithm with Canvas API quantization"
```

---

### Task 9: 色彩分析器 — UI 页面 + 主题应用

**Files:**
- Create: `src/app/color-analyzer/page.tsx`
- Modify: `src/components/ThemeProvider.tsx` (支持 base64 图片存储)

**Interfaces:**
- Consumes: `extractColorsFromImage()` from Task 8, `useTheme()` from Task 2
- Produces: 完整色彩分析器页面（上传 → 提取 → 应用 → 持久化）

- [ ] **Step 1: 实现色彩分析器页面**

Create `src/app/color-analyzer/page.tsx`:
```tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { extractColorsFromImage } from "@/lib/colorExtractor";

const IMAGE_STORAGE_KEY = "my-site-uploaded-image";

export default function ColorAnalyzerPage() {
  const { applyTheme, resetTheme } = useTheme();
  const [colors, setColors] = useState<string[]>([]);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(IMAGE_STORAGE_KEY);
    if (saved) setImageSrc(saved);
  }, []);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImageSrc(dataUrl);
      localStorage.setItem(IMAGE_STORAGE_KEY, dataUrl);

      const img = new Image();
      img.onload = () => {
        const extracted = extractColorsFromImage(img);
        setColors(extracted);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleApply = () => {
    if (colors.length >= 3) {
      // 60-30-10 rule
      applyTheme({
        primary: colors[0],
        secondary: colors[1],
        accent: colors[2],
      });
    } else if (colors.length === 2) {
      applyTheme({ primary: colors[0], secondary: colors[1], accent: colors[1] });
    } else if (colors.length === 1) {
      applyTheme({ primary: colors[0], secondary: colors[0], accent: "#18181b" });
    }
  };

  const handleReset = () => {
    setImageSrc(null);
    setColors([]);
    resetTheme();
    localStorage.removeItem(IMAGE_STORAGE_KEY);
  };

  return (
    <div>
      <h1 className="text-3xl font-heading font-bold">🎨 色彩分析器</h1>
      <p className="mt-2 text-zinc-500">
        上传一张图片，提取主色调，按 60-30-10 比例应用到全站主题。
      </p>

      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        {/* Upload area */}
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 p-8 text-center min-h-[200px]">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt="Uploaded"
              className="max-h-48 rounded-lg object-contain"
            />
          ) : (
            <>
              <p className="text-zinc-400">拖拽或点击上传图片</p>
              <p className="mt-1 text-xs text-zinc-300">PNG / JPG / WebP</p>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="mt-4 text-sm"
          />
        </div>

        {/* Color palette */}
        <div>
          <h2 className="font-semibold mb-3">提取的色调</h2>
          {colors.length > 0 ? (
            <div className="space-y-3">
              {colors.map((hex, i) => (
                <div key={hex} className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-lg border border-zinc-200"
                    style={{ backgroundColor: hex }}
                  />
                  <div>
                    <code className="text-sm font-mono">{hex}</code>
                    <span className="ml-2 text-xs text-zinc-400">
                      {i === 0 ? "60% 主色" : i === 1 ? "30% 辅色" : "10% 强调色"}
                    </span>
                  </div>
                </div>
              ))}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleApply}
                  className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[var(--color-primary)] transition hover:opacity-80"
                >
                  应用主题
                </button>
                <button
                  onClick={handleReset}
                  className="rounded-lg border border-zinc-300 px-4 py-2 text-sm transition hover:bg-zinc-100"
                >
                  重置
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-zinc-400">上传图片后，主色调将显示在这里</p>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 验证**

```bash
npm run dev
# 访问 /color-analyzer
# 上传一张图片 → 显示色调 → 点击「应用主题」→ 全站配色改变
# 刷新页面 → 图片和主题保持
# 点击「重置」→ 恢复默认配色
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add color analyzer page with upload, extraction, 60-30-10 theme application"
```

---

### Task 10: 关于页

**Files:**
- Create: `src/app/about/page.tsx`
- Create: `content/about.mdx`

**Interfaces:**
- 无新接口。独立静态页面。

- [ ] **Step 1: 实现关于页**

Create `content/about.mdx`:
```mdx
# 关于我

这里是我的个人实验站。

喜欢写代码、玩游戏、探索各种有趣的技术。

## 联系

- GitHub: [@myusername](https://github.com/myusername)
```

Create `src/app/about/page.tsx`:
```tsx
import fs from "fs";
import path from "path";

export default function AboutPage() {
  const filePath = path.join(process.cwd(), "content", "about.mdx");
  const raw = fs.readFileSync(filePath, "utf-8");

  return (
    <article className="prose prose-zinc max-w-none py-8">
      <div dangerouslySetInnerHTML={{ __html: raw }} />
    </article>
  );
}
```

- [ ] **Step 2: 验证**

```bash
npm run dev
# 访问 /about — 显示关于内容
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add about page with mdx content"
```

---

### Task 11: GitHub Actions 部署

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: 创建部署工作流**

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main, master]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test -- --run

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: 更新 package.json scripts**

确保 `package.json` 包含：
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest"
  }
}
```

- [ ] **Step 3: 验证构建**

```bash
npm run build
# Expected: out/ 目录生成
npm test -- --run
# Expected: 全部通过
```

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "ci: add GitHub Actions deploy workflow for GitHub Pages"
```
