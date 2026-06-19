import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    // Fully static marketing site — prerendered in src/routes/+layout.ts.
    adapter: adapter({ fallback: undefined })
  }
};

export default config;
