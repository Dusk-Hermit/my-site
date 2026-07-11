# Spec: 个人实验站 (Personal Lab Site)

## Objective

构建一个个人实验网站，用于展示文章、小游戏和各类实验项目。核心定位是「Agent 驱动的个人实验室」——所有内容通过 Markdown 文件管理，Agent 可直接编辑发布。部署到 GitHub Pages（零端口暴露，安全第一）。

**用户故事：**
- 作为站点所有者，我可以通过编辑 Markdown 文件来发布文章，无需手动操作 HTML/CSS
- 作为站点所有者，我可以将小游戏（纯前端 HTML/JS）放到网站上供他人游玩
- 作为站点所有者，我可以在「实验室」板块上传喜欢的二次元插画，自动提取色调并应用到全站主题
- 作为访问者，我可以浏览文章、玩游戏、查看实验项目
- 作为 Agent，我可以直接编辑 `content/` 目录下的 .md/.mdx 文件来更新网站内容

## Tech Stack

| 层 | 技术 | 版本 |
|---|------|------|
| 框架 | Next.js (App Router) | ^15 |
| 样式 | Tailwind CSS | ^4 |
| 内容 | MDX (next-mdx-remote 或 @next/mdx) | latest |
| 语言 | TypeScript | ^5 |
| 包管理 | npm | latest |
| 部署 | GitHub Pages + GitHub Actions | — |
| 色彩提取 | Canvas API (纯前端) | — |
| 持久化 | localStorage | — |

## Commands

```bash
# 开发
npm run dev          # 本地预览 http://localhost:3000

# 构建
npm run build        # 静态导出到 out/

# 测试
npm test -- --watchAll=false

# Lint
npm run lint

# 类型检查
npx tsc --noEmit
```

## Project Structure

```
my-site/
├── content/                  # 📝 所有内容（Agent 编辑的主要区域）
│   ├── articles/             #   文章 (.mdx)
│   │   └── hello-world.mdx
│   └── games/                #   游戏元数据 (.json) — 描述名称、路径、封面
│       └── games.json
├── public/                   # 🎮 静态资源
│   ├── games/                #   小游戏独立 HTML/JS 文件
│   │   └── snake/
│   └── images/               #   站点图片（图标等，不含插画）
├── src/
│   ├── app/                  # Next.js App Router 页面
│   │   ├── layout.tsx        #   根布局（导航栏 + 页脚 + 主题 Provider）
│   │   ├── page.tsx          #   首页
│   │   ├── articles/         #   文章列表 + 文章详情
│   │   ├── games/            #   游戏列表 + 游戏内嵌
│   │   ├── lab/              #   实验室（含色彩分析器）
│   │   └── about/            #   关于页
│   ├── components/           # 共享组件
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ArticleCard.tsx
│   │   ├── GameCard.tsx
│   │   └── ThemeProvider.tsx #   主题状态管理
│   ├── lib/                  # 工具函数
│   │   ├── articles.ts       #   文章加载/解析
│   │   ├── games.ts          #   游戏列表加载
│   │   └── colorExtractor.ts #   Canvas 色彩提取
│   └── styles/               # 全局样式
│       └── globals.css
├── tests/                    # 测试
│   ├── lib/
│   │   ├── articles.test.ts
│   │   ├── games.test.ts
│   │   └── colorExtractor.test.ts
│   └── components/
├── docs/superpowers/
│   ├── specs/                # 规格说明书
│   └── plans/                # 实现计划
├── .github/workflows/
│   └── deploy.yml            # GitHub Actions 部署到 Pages
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Code Style

```typescript
// ✅ 组件：函数式 + 显式 Props 类型
type ArticleCardProps = {
  title: string;
  date: string;
  slug: string;
  tags: string[];
};

export function ArticleCard({ title, date, slug, tags }: ArticleCardProps) {
  return (
    <Link href={`/articles/${slug}`} className="group block rounded-xl bg-white/10 p-6 backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-lg">
      <time className="text-sm text-zinc-400">{date}</time>
      <h2 className="mt-2 text-xl font-semibold">{title}</h2>
      <div className="mt-3 flex gap-2">
        {tags.map(tag => <Tag key={tag} name={tag} />)}
      </div>
    </Link>
  );
}
```

**约定：**
- 文件名：PascalCase（组件）、kebab-case（工具模块）、camelCase（测试文件）
- 导出：优先 named export，页面组件用 default export（Next.js 要求）
- 类型：所有 Props 显式定义 interface/type，禁止 `any`
- 注释：仅在逻辑不直观时写注释，代码本身就是文档
- Tailwind：优先用 Tailwind class，仅在复杂动画/交互时写自定义 CSS

## Testing Strategy

| 层级 | 框架 | 位置 | 要求 |
|------|------|------|------|
| 单元测试 | Vitest + React Testing Library | `tests/` | 所有 `lib/` 工具函数 100% 覆盖 |
| 组件测试 | Vitest + RTL | `tests/components/` | 核心组件（Navbar、ArticleCard、GameCard、ThemeProvider） |
| E2E | Playwright（后续添加） | `e2e/` | 暂不要求 |

**测试原则：**
- 先写测试，看到它失败，再写实现（TDD）
- 测试文件名：`<source-filename>.test.ts`
- 运行：`npm test` 必须全绿才允许 commit

## Boundaries

**Always do:**
- 运行 `npm test` 全绿后再 commit
- 所有新功能先写测试
- 遵循 TypeScript 严格模式，禁止 `any`
- Markdown 文件内容变更直接 commit（不需要跑测试）
- 页面组件保持简洁（<150 行），重逻辑放 `lib/`

**Ask first:**
- 添加新的 npm 依赖
- 修改 `.github/workflows/deploy.yml`
- 修改 `next.config.ts` 或 `tailwind.config.ts`
- 改变目录结构
- 使用外部 CDN 资源

**Never do:**
- Commit 密钥、Token、密码
- 修改 `.gitignore` 以包含敏感文件
- 删除已有测试而不替换
- 在 `content/` 中放入非 Markdown/JSON 的二进制文件

## Feature Specs

### F1: 导航与页面框架
- 固定顶部导航栏：首页 / 文章 / 小游戏 / 实验室 / 关于
- 移动端响应式（汉堡菜单）
- 页脚：版权 © 2026 + "Powered by Agent"

### F2: 文章系统
- 文章列表页：按日期倒序显示文章卡片（标题、日期、标签、摘要）
- 文章详情页：从 `content/articles/*.mdx` 渲染完整 MDX 内容
- 支持标签筛选
- 空状态：无文章时显示友好提示

### F3: 小游戏系统
- 游戏列表页：显示游戏卡片（名称、封面图、简介）
- 游戏详情页：内嵌 iframe 加载 `public/games/<name>/index.html`
- 游戏元数据来自 `content/games/games.json`
- 空状态：无游戏时显示「即将上线」

### F4: 实验室 — 色彩分析器 🎨
- 位于 `/lab` 页面
- 初始状态：空白的图片上传区域 + 提示文字
- 上传图片后：
  - 使用 Canvas API 提取图片的主色调（3-5 个主要颜色）
  - 在页面上展示提取的色调色板
  - 显示上传的图片缩略图
- 「应用主题」按钮：将提取的色调应用到全站 CSS 变量
- 持久化：
  - 图片以 base64 存 localStorage
  - 提取的色调存 localStorage
  - 下次打开网站自动恢复上次的主题和图片
- 「重置」按钮：清除上传的图片和主题，恢复默认配色

### F5: 关于页
- 静态页面，从 `content/about.mdx` 渲染
- 包含社交链接

## Visual Design

- **基调**：现代二次元插画风——干净、大量留白、清爽干练
- **配色（默认）**：中性灰白底（`zinc-50` 到 `zinc-950`），柔和过渡
- **卡片**：半透明毛玻璃（`bg-white/10 backdrop-blur-sm`），微圆角，hover 上浮
- **字体**：Inter（正文）+ Noto Sans SC（中文），标题用 Zen Maru Gothic
- **首页**：不放置插画，保持简洁——一句 tagline + 最新内容摘要
- **动画**：页面切换淡入、卡片 staggered 渐现，点到为止
- **主题色**：由实验室的色彩分析器动态覆盖，默认使用 Tailwind zinc 色系

## Success Criteria

- [ ] `npm run build` 成功生成静态 `out/` 目录
- [ ] `npm test` 全部通过
- [ ] 本地 `npm run dev` 可正常浏览所有五个页面
- [ ] 文章可从 `.mdx` 文件正确渲染
- [ ] 小游戏 iframe 正确加载
- [ ] 色彩分析器：上传图片 → 提取色调 → 应用主题 → 刷新页面后主题保留
- [ ] 移动端导航栏正常折叠展开
- [ ] GitHub Pages 部署后公网可访问

## Open Questions

- [ ] GitHub 账号是否已有？需要创建仓库并配置 GitHub Pages
- [ ] 域名：使用默认 `<username>.github.io` 还是购买自定义域名？
- [ ] 插画图源：后续用免费可商用图源、AI 生成、还是标注引用知名画师？
