// @ts-check
import { defineConfig } from 'astro/config';

// O Netlify define a variável URL no build com o domínio principal do site.
const site = process.env.SITE_URL || process.env.URL || 'http://localhost:4321';

export default defineConfig({
  site,
  build: { inlineStylesheets: 'auto' },
  compressHTML: true,
});
