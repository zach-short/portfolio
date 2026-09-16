// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// Static for now. Phase 3 adds the Cloudflare adapter with the one on-demand route that needs
// it (DESIGN.md D1); adding it earlier would put a server runtime under a site that has none.
export default defineConfig({
  // Without this Astro.site is undefined and Base.astro emits no canonical link at all.
  site: 'https://zacharyshort.com',
  output: 'static',
  integrations: [mdx()],

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
