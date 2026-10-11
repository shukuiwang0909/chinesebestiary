import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const creatures = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/creatures' }),
  schema: z.object({
    // === 身份 Identity ===
    id: z.string(),
    name: z.object({
      en: z.string(),
      zh_cn: z.string(),
      zh_tw: z.string(),
      pinyin: z.string(),
      pinyin_plain: z.string(),
      wade_giles: z.string().optional(),
      alt_names: z.array(z.string()).default([]),
    }),
    // === 分类 Taxonomy ===
    taxonomy: z.object({
      category: z.enum(['divine_beast', 'fierce_beast', 'auspicious_beast', 'deity', 'strange_being', 'hybrid']),
      four_perils: z.boolean().default(false),
      four_divine: z.boolean().default(false),
      element: z.enum(['fire', 'water', 'wood', 'metal', 'earth', 'wind', 'thunder', 'light', 'darkness', 'none']).default('none'),
    }),
    // === 出处 Source ===
    source: z.object({
      chapter_zh: z.string(),
      chapter_en: z.string(),
      passages: z.array(z.object({
        text_zh: z.string(),
        text_en: z.string(),
        note: z.string().optional(),
      })),
      modern_location: z.string().optional(),
    }),
    // === 内容 Content ===
    content_summary: z.string(),
    appearance: z.string().optional(),
    abilities: z.array(z.string()).default([]),
    symbolism: z.string().optional(),
    cultural_references: z.array(z.object({
      work: z.string(),
      year: z.union([z.string(), z.number()]),
      note: z.string().optional(),
    })).default([]),
    // === 媒体 Media ===
    media: z.object({
      historical_illustration: z.string().optional(),
      ai_art_prompt: z.string().optional(),
    }).default({}),
    // === D&D 5E ===
    dnd5e: z.object({
      name: z.string().optional(),
      cr: z.union([z.string(), z.number()]).optional(),
      stat_block: z.string().optional(),
    }).optional(),
    // === SEO ===
    seo: z.object({
      primary_keyword: z.string(),
      secondary_keywords: z.array(z.string()).default([]),
      meta_title: z.string(),
      meta_description: z.string(),
      related_entries: z.array(z.string()).default([]),
    }),
  }),
});

const realworld = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/realworld' }),
  schema: z.object({
    id: z.string(),
    claim: z.string(),
    evidence: z.string(),
    scholars_say: z.string(),
    verdict: z.enum(['likely', 'unlikely', 'dubious', 'unverified']),
    candidates: z.array(z.object({
      name: z.string(),
      image: z.string(),
      license: z.string(),
      source_url: z.string(),
    })).default([]),
    seo: z.object({
      primary_keyword: z.string(),
      meta_title: z.string(),
      meta_description: z.string(),
    }),
  }),
});

export const collections = { creatures, realworld };
