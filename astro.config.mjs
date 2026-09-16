// @ts-check
import { defineConfig } from 'astro/config';

// Static for now. Phase 3 adds the Cloudflare adapter with the one on-demand route that needs
// it (DESIGN.md D1); adding it earlier would put a server runtime under a site that has none.
export default defineConfig({
  // Without this Astro.site is undefined and Base.astro emits no canonical link at all.
  site: 'https://zacharyshort.com',
  output: 'static',

  vite: {
    css: {
      // PLAN.md BD-6: the rebuilt site has no Tailwind — it is a hand-written token system.
      // postcss.config.mjs still belongs to the Next app that has not been deleted yet, and
      // Vite loads it by search and then rejects @tailwindcss/postcss's plugin shape, which
      // fails the build. An inline empty config stops the search. Drop this block when the
      // phase that deletes app/ deletes postcss.config.mjs with it.
      postcss: { plugins: [] },
    },
  },
});
