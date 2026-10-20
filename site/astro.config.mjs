// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://chinesebestiary.com',
  output: 'static',
  build: {
    format: 'directory',
  },
  integrations: [sitemap({
    filter: (page) => !page.includes('/404'),
    serialize(item) {
      item.lastmod = new Date().toISOString().split('T')[0];
      return item;
    },
  })],
});
