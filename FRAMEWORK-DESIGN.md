# 站点框架设计（Phase 0 实施版）

> 适用范围：chinesebestiary（The Chinese Bestiary）整站架构。
> Phase 0 = 导航 + 组件层 + 索引页 + About 页。不含任何新板块内容。
> 设计日期：2026-10-11。确认后按文末清单实施。

---

## 1. 设计原则

1. **零新增运行时依赖**。交互全部 CSS-only（mobile 导航用 checkbox hack），不引 JS 框架。
2. **复用现有视觉系统**。CSS 变量沿用 Base.astro 的 `--ink / --paper / --gold / --vermillion`，衬线字体、46rem 阅读栏宽不变；卡片网格区可全宽。
3. **每个板块统一模式**：`/{section}/` 索引页 + `/{section}/{slug}/` 详情模板 + `src/content/{section}/` collection。Phase 0 只落地 creatures 这个模式的索引层，其余板块的 schema 在第 7 节预定义，实现时不再重新设计。
4. **URL 已上线的永久不动**。`/four-perils/`、`/four-divine/` 保持根路径（已有曝光，迁移无收益）。
5. **导航数据驱动**。未来板块上线 = nav 配置里翻一个开关，不改组件。

---

## 2. 站点 IA：现状 → 目标

| URL | 现状 | 目标 | Phase |
|---|---|---|---|
| `/` | 纯文字列表首页 | 卡片网格 + Groups + 预留槽 | 0 |
| `/creatures/` | ❌ 不存在（sitemap 里无此 URL） | 全词条卡片索引页 | **0** |
| `/creatures/{slug}/` | 已有，模板 + 图探测 | 抽公共图片 helper，逻辑不变 | 0 |
| `/four-perils/`、`/four-divine/` | 已有 | 不动 | — |
| `/about/` | ❌ 不存在 | 编辑方法 + 来源声明 + SRD 署名 | **0** |
| `/real-world/` + `/{slug}/` | 无 | 现实原型（批判框架），slug 与词条一致 | 1 |
| `/stories/` + `/{slug}/` | 无 | 民间故事译写 | 2 |
| `/name-generator/` | 无 | 单页工具 | 2 |
| `/versus/` | 无 | 是否建站取决于 Reddit 试错结果 | 3 |

**slug 对齐规则**：real-world 页 slug 必须等于对应词条 id（如 `nine-tailed-fox`）。这样词条页 ↔ 原型页互链、sitemap 分组、将来的 RelatedPanel 自动出链全都零成本。

---

## 3. Phase 0 交付清单（文件级）

新建：
- `site/src/config/nav.ts` — 导航配置（数据驱动）
- `site/src/components/SiteNav.astro` — 顶栏导航，desktop 横排 / mobile CSS-only hamburger
- `site/src/components/SiteFooter.astro` — 扩展页脚
- `site/src/components/CreatureCard.astro` — 词条卡片
- `site/src/utils/creatureImage.ts` — 从 `[slug].astro` 抽出的构建期图片探测 helper
- `site/src/pages/creatures/index.astro` — 词条索引页
- `site/src/pages/about.astro` — About 页

修改：
- `site/src/layouts/Base.astro` — 引入 SiteNav/SiteFooter，补 og tags
- `site/src/pages/index.astro` — `<ul>` 列表 → CreatureCard 网格
- `site/src/pages/creatures/[slug].astro` — 内联图片探测改用共享 helper

---

## 4. 组件设计

### 4.1 `config/nav.ts`
```ts
export interface NavItem {
  label: string;
  href: string;
  enabled?: boolean;   // false = 板块未上线，渲染时过滤
  children?: NavItem[];
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Creatures', href: '/creatures/', children: [
    { label: 'All Creatures', href: '/creatures/' },
    { label: 'Four Perils 四凶', href: '/four-perils/' },
    { label: 'Four Divine 四灵', href: '/four-divine/' },
  ]},
  { label: 'Stories', href: '/stories/', enabled: false },
  { label: 'Real-World', href: '/real-world/', enabled: false },
  { label: 'Name Generator', href: '/name-generator/', enabled: false },
  { label: 'About', href: '/about/' },
];
```

### 4.2 `SiteNav.astro`
- Props：无（读 NAV_ITEMS，过滤 `enabled !== false`）
- desktop：横排链接，有 children 的项做 hover 下拉（纯 CSS `:hover` + 绝对定位）
- mobile（≤46rem）：checkbox hack 汉堡菜单，`<label>` + `<input type="checkbox">` + `~` 兄弟选择器展开，零 JS
- 当前页高亮：与 `Astro.url.pathname` 前缀匹配加 `aria-current="page"` 样式
- 站点标题保留在 header 内，SiteNav 挂在标题下方

### 4.3 `SiteFooter.astro`
内容三区（保持 0.85rem 灰字风格）：
1. 编辑声明（现有文字保留：原文出自山海经、译本为原创）
2. 新增：**内容来源与许可**——古图公有领域/CC 状态摘要 + 链接 `/about/` 与仓库内 `IMAGE-ATTRIBUTIONS.md`
3. 新增：**D&D 署名**——"Stat blocks compatible with Dungeons & Dragons 5th Edition, based on the SRD 5.1 (CC-BY-4.0)"（现行页脚缺这个，法律层面应补）

### 4.4 `CreatureCard.astro`
- Props：`{ id, name, category, element, illustration? }`
- 渲染：卡片 = 图（有则显示，白底边框沿用词条页 figure 样式）+ en 名 + zh + pinyin + category badge（`divine_beast` → "divine beast"）
- 整卡可点（`<a>` 包裹），hover 金框
- 网格：2 列（≥46rem）→ 1 列；无图词条显示文字首字占位块，保证网格对齐

### 4.5 `utils/creatureImage.ts`
把 `[slug].astro` 现有的构建期探测逻辑（`node:fs` 探测 `public/images/creatures/{id}.{jpg,png,gif,webp}`）原样抽成 `getCreatureImage(id): string | null`，返回 `/images/creatures/{file}` 或 null。词条页与卡片共用，行为不变。

---

## 5. 页面设计

### 5.1 首页 `index.astro`（重排）
结构：Hero 文案（保留现有两段）→ Creatures 卡片网格（替掉 `<ul>`，标题保留计数）→ Groups 区（保留）→ 注释占位槽 `<!-- P1: Real-World featured -->` 等，后续板块插入点在设计里先钉死。

### 5.2 `/creatures/` 索引页（新增）
- 全卡片网格 + 顶部按 category 锚点分组（divine beasts / fierce beasts / auspicious beasts / deities / strange beings / hybrids）
- 静态分组渲染，不做 JS 筛选（搜索交给 pagefind）
- title/description 走 SEO 规格：`title: "All Creatures — The Chinese Bestiary"`

### 5.3 About 页（新增，E-E-A-T 核心）
四个小节：
1. **Editorial method**：原文逐字引用 → 新英文直译的流程；transliteration 规则（pinyin 为主， Wade-Giles 并存）；D&D 数值按 DMG p.274 校准的说明
2. **Sources**：山海经版本说明（郭璞注本系统等）；古图来源（明清绘本、Commons 公有领域/CC 清单链到 `IMAGE-ATTRIBUTIONS.md`）
3. **Copyright & licenses**：译文 © 本站；SRD 5.1 CC-BY-4.0 署名全文
4. **Corrections**：欢迎指正，联系方式

### 5.4 Base.astro 改造
- Props 保持 `title, description` 两参（向后兼容所有现有页面），新增可选 `image?: string`（留 og:image 扩展位，Phase 0 不传）
- head 补：`og:title / og:description / og:url / og:type=website / og:site_name`
- body：header 内插 `<SiteNav />`，footer 替换为 `<SiteFooter />`

---

## 6. 明确不做（Phase 0 边界）

- ❌ breadcrumbs（等 /real-world/ 等深层路径上线再做，P1）
- ❌ ClaimCard / VersusCard（各自板块阶段再做）
- ❌ RelatedPanel 重构——词条页已渲染 `related_entries`（[slug].astro:107），互链基础已在
- ❌ dark mode / i18n / JS 交互
- ❌ og:image 逐页图（先把扩展位留好）

---

## 7. 后续板块 schema 预定义（框架层定死，实现不改）

### 7.1 `realworld` collection（P1）
```ts
{
  id: string,                     // 必须等于对应词条 slug
  claim: string,                  // THE CLAIM——假说原文主张
  evidence: string,               // THE EVIDENCE——支持者引用的论据
  scholars_say: string,           // WHAT SCHOLARS SAY——学术反驳（本页主体）
  verdict: enum(['likely', 'unlikely', 'dubious', 'unverified']),
  candidates: array({             // 候选现实动物对照
    name: string,
    image: string,                // Commons 路径
    license: string,              // e.g. "CC BY-SA 4.0 — Author"
    source_url: string,
  }),
  seo: { primary_keyword, meta_title, meta_description },
}
```

### 7.2 `stories` collection（P2）
```ts
{
  id: string,
  title: string,
  source_work: string,            // 《搜神记》/《聊斋志异》等
  era: string,
  summary: string,
  body: string,                   // markdown 正文（英译 + 关键段原文）
  related_creatures: array(string),  // 词条 id
  seo: { ...同上 },
}
```

### 7.3 `/name-generator/`（P2，单页非 collection）
- 前端 JS 随机组合：神兽名 × 五行 × 境界词
- 生成结果卡片链到对应词条页（内链引擎）
- 独立 playful 语气，但共享 Base 布局与页脚

---

## 8. 实施顺序与验证

实施顺序（每步可独立构建）：
1. `utils/creatureImage.ts` 抽取 + `[slug].astro` 改用（行为不变，先验证一次构建）
2. `config/nav.ts` + `SiteNav` + `SiteFooter`，Base.astro 接入
3. `CreatureCard` + 首页重排 + `/creatures/` 索引页
4. About 页
5. 全量验证 → 部署

验证标准（与现行流程一致）：
- `npm run build` 通过，pagefind 索引正常
- sitemap-0.xml 新增 `/creatures/`、`/about/` 两个 URL
- `git add -A && git commit && git push` → 等 2-3 分钟
- 线上抽查：`/creatures/` 200 且含卡片、`/about/` 200、首页导航含 Creatures/About 下拉可用、任一词条页图未回归
