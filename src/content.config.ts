import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
// `import { z } from 'astro:content'` is deprecated, removed in Astro 8 — verified 2026-09-15
// against this repo's installed astro 7.3.2, `node_modules/astro/types/content.d.ts:13-17`.
import { z } from 'astro/zod';

// D2: the 61 TSX solutions become MDX in a zod-checked collection. Base fields from D2
// (renamed per that decision: `num` -> `leetcodeNumber`, `date` -> `pubDate`) plus the optional
// fields the current shape carries, read off content/leetcode/*.tsx 2026-09-15 (PASSOFF item 4
// step 1) — `complexity`, `performance`, `quote` per DESIGN.md §4.4, and `testsPassed`,
// which DESIGN.md's field list omitted but which drives real UI on the current index page
// (red highlight + trailing label, app/blog/leetcode/page.tsx:22,29). `code[]` is deliberately
// not a schema field: PLAN.md Phase 2 step 2 puts each snippet in the MDX body as a fenced
// block so Shiki highlights it, rather than as inert frontmatter data.
const leetcode = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/leetcode' }),
  schema: z.object({
    leetcodeNumber: z.number(),
    title: z.string().optional(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    difficulty: z.enum(['easy', 'medium', 'hard']).default('easy'),
    languages: z.array(z.string()),
    quote: z.string().optional(),
    testsPassed: z.string().optional(),
    complexity: z
      .object({
        time: z.string(),
        space: z.string(),
        timeExplanation: z.string().optional(),
        spaceExplanation: z.string().optional(),
      })
      .optional(),
    performance: z
      .object({
        time: z.number(),
        memory: z.number(),
      })
      .optional(),
  }),
});

export const collections = { leetcode };
