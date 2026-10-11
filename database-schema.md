# 神兽数据库 Schema（中英对照）

> 设计原则：一份数据同时驱动 ① 网页渲染 ② JSON-LD 结构化数据（吃 Google 富摘要）③ D&D 素材包生成 ④ 未来多语言扩展。

## 1. 身份字段 Identity

| 字段 | 类型 | 说明 | 示例 |
|---|---|---|---|
| `id` | string | 唯一 slug，全库不变 | `nine-tailed-fox` |
| `name.en` | string | 英文主名（SEO 标题用） | `Nine-Tailed Fox` |
| `name.zh_cn` | string | 简体名 | `九尾狐` |
| `name.zh_tw` | string | 繁体名 | `九尾狐` |
| `name.pinyin` | string | 带调号拼音 | `jiǔ wěi hú` |
| `name.pinyin_plain` | string | 无调号拼音（URL/标签用） | `jiu wei hu` |
| `name.wade_giles` | string | 威妥玛拼法（老文献检索兼容） | `chiu-wei hu` |
| `name.alt_names` | array | 别名/变体（覆盖全部搜索写法） | `["Jiuweihu", "Nine-tailed Vulpine"]` |

## 2. 分类字段 Taxonomy

| 字段 | 类型 | 说明 |
|---|---|---|
| `taxonomy.category` | enum | `divine_beast` 神兽 / `fierce_beast` 凶兽 / `auspicious_beast` 祥兽 / `deity` 神 / `strange_being` 异人 / `hybrid` 异兽 |
| `taxonomy.four_perils` | bool | 是否四大凶兽 |
| `taxonomy.four_divine` | bool | 是否四灵/四神 |
| `taxonomy.element` | enum | `fire/water/wood/metal/earth/wind/thunder/light/darkness/none` |

## 3. 出处字段 Source（核心信任资产）

| 字段 | 类型 | 说明 |
|---|---|---|
| `source.chapter_zh` | string | 所属卷目（中文） |
| `source.chapter_en` | string | 卷目英译 |
| `source.passages` | array | 原文条目数组，每条含 `text_zh` / `text_en` / `note`。译文必须是原创，可参考 Strassberg/Birrell 但不得照抄 |
| `source.modern_location` | string | 对应现代地理考据（如有） |

## 4. 内容字段 Content

| 字段 | 类型 | 说明 |
|---|---|---|
| `content.summary` | string | 80–120 词英文概述（meta description 来源） |
| `content.appearance` | string | 外貌描述段落 |
| `content.abilities` | array | 能力列表 |
| `content.symbolism` | string | 象征意义 |
| `content.cultural_references` | array | 现代影视/游戏/动漫出现记录（每条 `{work, year, note}`） |
| `content.comparison_articles` | array | 关联对比页（如 vs kitsune / vs kumiho） |

## 5. 媒体字段 Media

| 字段 | 类型 | 说明 |
|---|---|---|
| `media.historical_illustration` | object | 古图引用：`{edition: "Ming Hu Wenhuan", source: "public_domain", file: ""}` |
| `media.ai_art_prompt` | string | AI 生图提示词（统一风格关键词保持系列感） |

## 6. D&D 5E 字段

| 字段 | 类型 | 说明 |
|---|---|---|
| `dnd5e.name` | string | 英文卡名 |
| `dnd5e.cr` | number | 挑战等级 |
| `dnd5e.size` | enum | Tiny/Small/Medium/Large/Huge/Gargantuan |
| `dnd5e.type` | string | 如 `celestial (shapechanger)` |
| `dnd5e.alignment` | string | 5E 阵营 |
| `dnd5e.stat_block` | markdown | 完整 5E stat block |
| `dnd5e.lore_box` | string | 给 DM 使用的世界观说明 |

## 7. SEO 字段

| 字段 | 类型 | 说明 |
|---|---|---|
| `seo.primary_keyword` | string | 主词 |
| `seo.secondary_keywords` | array | 长尾词 |
| `seo.meta_title` | string | ≤60 字符 |
| `seo.meta_description` | string | ≤155 字符 |
| `seo.related_entries` | array | 站内互链词条 id |
| `seo.people_also_ask` | array | 该词真实出现的 PAA 问句 |

## 8. 单条 JSON 骨架

```json
{
  "id": "",
  "name": {
    "en": "", "zh_cn": "", "zh_tw": "",
    "pinyin": "", "pinyin_plain": "", "wade_giles": "",
    "alt_names": []
  },
  "taxonomy": {
    "category": "", "four_perils": false,
    "four_divine": false, "element": ""
  },
  "source": {
    "chapter_zh": "", "chapter_en": "",
    "passages": [{ "text_zh": "", "text_en": "", "note": "" }],
    "modern_location": ""
  },
  "content": {
    "summary": "", "appearance": "", "abilities": [],
    "symbolism": "", "cultural_references": [],
    "comparison_articles": []
  },
  "media": {
    "historical_illustration": { "edition": "", "source": "public_domain", "file": "" },
    "ai_art_prompt": ""
  },
  "dnd5e": {
    "name": "", "cr": 0, "size": "", "type": "", "alignment": "",
    "stat_block": "", "lore_box": ""
  },
  "seo": {
    "primary_keyword": "", "secondary_keywords": [],
    "meta_title": "", "meta_description": "",
    "related_entries": [], "people_also_ask": []
  }
}
```

## 9. 生产规范

1. **译文原创**：以 Strassberg/Birrell 为底本理解，逐句重写；原文逐字保留。
2. **拼音规范**：带调号版本给读者，无调号版本进 URL 和标签。
3. **古图只用公有领域**：明·胡文焕《山海经图》、清·汪绂《山海经存》、日本《怪奇鸟兽图卷》。
4. **AI 图统一风格后缀**：`, dark fantasy illustration, traditional Chinese ink wash texture, muted gold and vermillion palette, bestiary plate style, white background` —— 保证 200 张图看起来像同一套图鉴。
5. **D&D 数值纪律**：CR 与 HP/DPR 按 5E DMG 第 274 页表格校验，不拍脑袋。
