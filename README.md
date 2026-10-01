# portfolio

The source for Zachary Short's personal site, served at https://www.zacharyshort.com. It has a home page with three project cards, a story page for each project that has screenshots, a blog of 61 LeetCode write-ups, and a short setup survey at `/setup` that stores a person's answers and hands back an eight-character id.

The site is almost entirely static. Astro 7 prerenders every page at build time, and two routes opt out to read and write a Cloudflare KV namespace. The result deploys to Cloudflare Workers as `zacharyshort-com`. The survey is the only Preact island on the site.

## Setup

The package manager is bun. Install the dependencies and run a build to confirm the checkout is sound:

```bash
bun install && bun run build
```

## Commands

```bash
bun run dev
```

Starts `astro dev` on port 4321. It has no KV binding, so the two on-demand routes do not work here.

```bash
bunx wrangler dev -c dist/server/wrangler.json --port 8788 --persist-to ./.wrangler/state
```

Runs the built site in a real Worker runtime with the `PROFILES` KV binding. Run `bun run build` first, because the config file it reads is written by the build. The `--persist-to` flag keeps local KV data beside that generated config, and a rebuild clears it.

```bash
bun run build
bunx tsc --noEmit
bun test
```

These are the checks. `bun run build` is `astro build`. It compiles the site and imports every content file, so a post with bad frontmatter fails the build, but it does not typecheck. `bunx tsc --noEmit` does the typecheck. `bun test` runs the one test file, `tests/when-all.test.ts`. There is no linter and no CI.

```bash
bun run preview
```

Serves the last build locally with `astro preview`.

`scripts/portfolio` wraps these commands behind short names (`dev`, `worker`, `build`, `typecheck`, `test`, `gates`, `deploy`). Run `scripts/portfolio help` to list them, or `scripts/portfolio shell` to print a zsh function and completion for it.

## Layout

```
src/pages/           routes: index, blog/, projects/[slug], setup, p/[id], api/profile
src/layouts/         Base.astro: head, canonical link, page transitions, nav, footer
src/components/      shared Astro components; leetcode/ helpers used inside posts;
                     survey/ holds the Preact island, the only .tsx in the repo
src/content/leetcode one .mdx file per solved problem (61 files)
src/content.config.ts  zod schema that validates each post's frontmatter
src/lib/             projects.ts (project copy), story.ts, catalog.ts, profile and
                     KV helpers, survey copy
src/assets/projects/ screenshots for the project story pages
src/styles/          global.css, the hand-written token system (no Tailwind)
public/              fonts and the images used by posts
tests/               bun tests
docs/                working standards for the repo
scripts/portfolio    command dispatcher
```

The project cards on the home page and the story pages both read `src/lib/projects.ts`, which is the only place a project is described. A project with an empty `frames` array gets a card but no `/projects/<slug>` page. E-Money is in that state today.

## Routes

Pages `/`, `/blog`, `/blog/leetcode`, `/blog/leetcode/<slug>`, `/projects/<slug>` and `/setup` are prerendered. Two routes run on demand and need the `PROFILES` KV binding:

- `POST /api/profile` validates a survey result (16 KB limit) and stores it under a new eight-character id.
- `GET /p/<id>` returns the stored profile as JSON. The `setup --from <id>` command in the `personal-config` package fetches this URL, so the response must stay plain JSON and not become a page.

The survey questions come from `catalog.json` in the `personal-config` dependency, which is pinned to an exact version in `package.json`.

## Posts

Each post is `src/content/leetcode/<slug>.mdx`. The filename is the slug, the URL path and the link to leetcode.com, so never rename or delete one. `roman-to-interger` (a typo) is an old indexed URL and is redirected to `roman-to-integer` in `astro.config.mjs`. Required frontmatter is `leetcodeNumber`, `pubDate` and `languages`. The other fields (`title`, `tags`, `difficulty`, `quote`, `testsPassed`, `complexity`, `performance`) are listed in `src/content.config.ts`.

## Deploying

There is no CI and no push-to-deploy. A deploy is a person running `bun run deploy`, which is `wrangler deploy`, from a machine logged in to Cloudflare. The build writes the resolved Worker config to `dist/server/wrangler.json`, and wrangler reads that file rather than `wrangler.jsonc`. Check a deploy first with:

```bash
bunx wrangler deploy --dry-run -c dist/server/wrangler.json
```

`wrangler.jsonc` sets the Worker name, the `PROFILES` binding, the two custom domains and `assets.html_handling: "drop-trailing-slash"`, which keeps every published URL in its no-slash form. The canonical host is `www.zacharyshort.com`. The apex domain has no DNS record that resolves, so `site` in `astro.config.mjs` names the `www` host.

The `name` in `package.json` is still `my-next-app`, and a `prepublishOnly` script exits 1. Both are deliberate. They stop an accidental `npm publish` from this directory, which is a private site and never goes to the registry. Do not rename the package or remove the script.

## Where to read next

`CLAUDE.md` holds the rules for working in this repo, including the gates and the commands that must not be run. `docs/conventions-typescript.md` is the code standard. `docs/incomplete/` holds project design folders, and the ones that are finished are archived under `~/Projects/archive/portfolio/`. `HANDOFF.md` and `PASSOFF.md` are the local ledger and task board, and they are gitignored, so they exist only on the author's machine.
