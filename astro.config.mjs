// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import preact from '@astrojs/preact';

// Still static. Phase 3 added the adapter for D7's profile store, and only the two routes that
// need the KV binding opt out with `export const prerender = false` (I3, confirmed 2026-09-15)
// — every page on the site is still prerendered at build time.
export default defineConfig({
  // Without this Astro.site is undefined and Base.astro emits no canonical link at all.
  site: 'https://zacharyshort.com',
  output: 'static',

  // The Worker config is `wrangler.worker.jsonc`, not `wrangler.jsonc`: the latter still
  // configures the Pages project that serves the live Next.js site and belongs to board item 7.
  adapter: cloudflare({ configPath: './wrangler.worker.jsonc' }),

  // D5: Preact, not React — one interactive widget on one page should not decide the whole
  // site's runtime, and React is roughly ten times the runtime for it.
  integrations: [mdx(), preact()],

  // D10: the typo slug redirects to the corrected one. Empirically tested 2026-09-15 against
  // this repo, not assumed from docs — and the first result was a false positive (a stale
  // preview daemon), corrected by a clean rebuild + single fresh `astro preview` start, repeated
  // twice with consistent results. Under `output: 'static'` with no adapter, Astro always emits
  // a real static page at the redirect's own path (a `<meta http-equiv="refresh">` shell with a
  // `noindex` + canonical to the target), and `astro preview` serves that file — `curl -sI`
  // against it shows `200`, not a 3xx, here and even for a redirect with no dynamic-route
  // collision. A `public/_redirects` file changes nothing: `astro preview` doesn't read it
  // either. This is a static-output ceiling, not a config choice — Phase 4's own redirect proof
  // runs against the deployed Worker (Cloudflare's real redirect handling), which is where a
  // true 3xx is actually expected; re-verify there rather than assuming this config alone
  // produces one. See `HANDOFF.md` for the full account.
  redirects: {
    '/blog/leetcode/roman-to-interger': '/blog/leetcode/roman-to-integer',
  },

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
