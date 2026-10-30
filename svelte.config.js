import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    // Fully static marketing site — prerendered in src/routes/+layout.ts.
    // 404.html is the shell nginx serves (with a 404 status) for any path
    // that has no prerendered page; it renders src/routes/+error.svelte.
    adapter: adapter({ fallback: '404.html' })
  }
};

export default config;
