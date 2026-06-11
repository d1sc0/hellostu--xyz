import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://hellostu.xyz',
  vite: {
    css: {
      devSourcemap: true,
    },
  },
  markdown: {
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
    react(),
  ],
});
