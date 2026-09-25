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
  //
  // **`www`, not the apex.** Verified 2026-09-16: `dig zacharyshort.com A` returns only an SOA —
  // the apex has no A/AAAA/CNAME record and does not resolve, and `curl https://zacharyshort.com/`
  // fails with exit 6 (could not resolve host). The live site is `www.zacharyshort.com`, which is
  // also the only custom domain on the Pages project. Until this was changed every canonical link
  // and every `og:url` on the site named a hostname that does not exist.
  site: 'https://www.zacharyshort.com',
  output: 'static',

  // Item 7 promoted the Worker config over `wrangler.jsonc` on 2026-09-16 and retired the Pages
  // project it used to configure, so the adapter reads the default path and needs no `configPath`.
  //
  // `imageService: 'compile'` is item 10's BD-10, and it is load-bearing rather than cosmetic.
  // @astrojs/cloudflare 14.3.1 defaults this to `'cloudflare-binding'`, whose `transformAtBuild`
  // is false (`dist/utils/image-config.js:3-12`): `<Image>` then copies the original file
  // untouched and defers every resize to the Images binding at request time. Measured
  // 2026-09-16 on the five Furlough captures, that emitted the source PNGs byte for byte —
  // 172–978 KB each, against PLAN.md S-10's 150 KB cap. `'compile'` runs sharp at build time
  // and leaves the runtime service as passthrough, which is what BD-1 assumed all along. Every
  // page here is prerendered, so nothing needs the runtime path. Safe to set now because
  // nothing else on the site uses `astro:assets` (grep over `src/`, 2026-09-16).
  adapter: cloudflare({ imageService: 'compile' }),

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

  // PLAN.md BD-6's `vite.css.postcss: { plugins: [] }` workaround used to sit here. It existed
  // only because Vite found the Next app's `postcss.config.mjs` by search and then rejected
  // @tailwindcss/postcss's plugin shape. Item 7 deleted that file on 2026-09-16 — along with
  // `tailwindcss` and `@tailwindcss/postcss` — so there is no config left to find and the
  // workaround is removed rather than left as cargo. The site's CSS is a hand-written token
  // system and uses no PostCSS plugins at all.
});
