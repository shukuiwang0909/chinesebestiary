# The Chinese Bestiary · 站点包

## 本地运行（Node 18.17+ 或 20.3+  required）

```bash
npm install
npm run dev        # 预览 http://localhost:4321
```

## 部署到 Cloudflare Pages

```bash
npx wrangler login   # 首次授权
npm run deploy       # 构建+索引+上线
```

## 目录结构

```
├── astro.config.mjs          # Astro 配置
├── package.json
├── DEPLOY.md                 # 部署细节
├── src/
│   ├── content.config.ts     # 神兽数据库 schema（字段定义）
│   ├── content/creatures/    # 词条 Markdown（frontmatter = 数据库字段）
│   │   └── nine-tailed-fox.md
│   ├── layouts/Base.astro    # 基础布局（含 Pagefind 搜索）
│   └── pages/
│       ├── index.astro       # 首页（自动索引全部词条）
│       └── creatures/[slug].astro  # 词条页模板
├── database-schema.md        # 数据库字段设计文档
├── seed-list-20.md           # 首批 20 词条清单
├── sample-entry-nine-tailed-fox.md  # 词条质量标杆样张
└── CF-SETUP-GUIDE.md         # Cloudflare 配置手把手教程
```

## 新增词条流程

1. 复制 `src/content/creatures/nine-tailed-fox.md` 改字段 → 新文件 `xxx.md`
2. frontmatter 按 `database-schema.md` 填写（id 用英文 slug）
3. 正文 Markdown 随便写，模板自动渲染所有结构化字段
4. `npm run dev` 看效果 → `npm run deploy` 上线

## 注意

- 每词条必查原文：ctext.org/wiki.pl?if=en（对照原文，别照抄现成英译）
- 新词条 frontmatter 的 `seo.related_entries` 互链让站内形成网
