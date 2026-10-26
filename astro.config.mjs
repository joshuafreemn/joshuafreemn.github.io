import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://joshuafreemn.space',
  // Legacy pages in public/ link to "page.html", so keep file-style output.
  build: { format: 'file' },
});
