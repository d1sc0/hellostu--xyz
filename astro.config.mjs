import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';
import { remarkImageAlign } from './src/plugins/remark-image-align.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://hellostu.xyz',
  build: {
    inlineStylesheets: 'always',
  },
  vite: {
    css: {
      devSourcemap: true,
    },
  },
  markdown: {
    processor: unified({
      remarkPlugins: [remarkImageAlign],
    }),
    shikiConfig: {
      theme: 'houston',
    },
  },
  integrations: [
    mdx(),
    icon({
      iconDir: 'src/assets/icons',
    }),
    sitemap(),
  ],
});
