import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    pubDate: z.date(),
    description: z.string(),
    draft: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    category: z.enum(['Work', 'Rest', 'Play']),
  }),
});

const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    pubDate: z.date().optional(),
    description: z.string().optional(),
    body: z.string().optional(),
  }),
});

export const collections = { posts, pages };
