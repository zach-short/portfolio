<!-- personal-config v0.1.0 · 2026-09-15 · config 8b28a65e · standard v1.0.2 -->
# portfolio

> **Before writing or editing any code, read the matching code standard in full —
> `docs/conventions-typescript.md` for typescript. Not optional, not conditional on task size. If you have not read it
> this session, read it now.**

> **Before scoping, planning or building a feature, read `docs/AGENT-PRACTICES.md`.** It is the
> process standard. Do not ask how the flow works; it is written down.

## The rules that get broken

Seeded 2026-09-15 from the Part 0 inventory. Rewritten 2026-09-16 by the Workers cutover, which
deleted most of the files the original entries pointed at. Replace an entry with a real incident
the first time one happens.

1. **Do not fix a red build by reaching into Zach's uncommitted changes.** The seeding incident
   is closed and the rule is what outlives it: on 2026-09-15 the checkout carried uncommitted
   deletions of two PNGs that a post imported, so `bun run build` exited 1 before reaching
   anything a session wrote. He decided the images come back (`PLAN.md` §0.1, `HANDOFF` step 3).
   Standing rule: when a gate is red because of something in his uncommitted work, say so and
   name the file — do not restore, delete or edit your way around it. He decides; you report.
2. **Never rename, delete or re-slug a file in `src/content/leetcode/`.** The filename is the
   published URL (`src/pages/blog/leetcode/[slug].astro`) *and* the outbound link to
   leetcode.com. `roman-to-interger` is a typo and an indexed URL; since 2026-09-15 it is served
   by a 301 to `roman-to-integer` (D10) and **both must keep answering**.
3. **A green `bunx tsc --noEmit` does not mean the site builds**, and since the Astro rebuild it
   means even less — see *Gates that lie*. Run `bun run build` before claiming anything.
4. **Never pipe a gate into `head`, `tail` or `grep` and read `$?`.** You get the pipe's exit
   code, which is almost always 0. Redirect to a file, echo `$?`, then read the file.
5. **There is no lint gate.** Nothing lints in this repo and `bun run lint` no longer exists —
   the cutover deleted it along with Next. Do not add one without a decision.
6. **No drive-by fixes.** Note what you find and raise it; do not fold it into an unrelated
   change.
7. **A git block for work done in a worktree must carry its own `cd`, in the same command.**
   Earned 2026-09-16, not seeded. Item 7 was built on branch `item7-cutover` in
   `.claude/worktrees/item7-cutover`, and its hand-back put the directory in prose above the
   blocks. Both were run from the main tree instead, and both failed on exactly
   `wrangler.worker.jsonc` and `src/env.d.ts` — the two files item 6 created in `34175ae`, which
   do not exist on `astro-rebuild`. Every other path existed in both trees, so the error named
   only those two and looked like a git problem rather than a wrong-directory problem. **The
   danger is the near miss**: had the paths all happened to exist in both trees, the command
   would have run clean against the wrong branch. Same rule as the npm one below, same reason —
   prefix the `cd`, do not describe it.
8. **Ask Zach in one batched message, in chat, in the same turn — before building.** He is
   interactive. A decision built on a guess is built twice.

## Stack

Verified 2026-09-16 from `package.json` and `bun install` output in a clean worktree at
`34175ae`, after the Workers cutover removed the Next.js tree.

- **Runtime / package manager:** bun. Lockfile `bun.lock`, **292 packages** — down from 575
  before the cutover dropped Next, React, Tailwind, `@cloudflare/next-on-pages` and `vercel`.
- **Framework:** **Astro 7.3.2**, `output: 'static'`, with `@astrojs/mdx` 8.0.1 and
  `@astrojs/preact` 6.0.5 / `preact` 10.29.8.
- **Styling:** a hand-written token system in `src/styles/global.css`. **No Tailwind and no
  PostCSS plugins** — both were deleted 2026-09-16. `--accent` / `--accent-2` at the head of
  `:root` are the only two hex literals; anything else `color-mix`es off them.
- **TypeScript:** 5.x via `astro/tsconfigs/strict`, path alias `@/*` → **repo root**, not `src/`.
- **Other deps:** `date-fns`, and `personal-config` pinned as a git dependency (D6) for the
  survey catalog.
- **Hosting:** **Cloudflare Workers** with static assets, via `@astrojs/cloudflare` 14.3.1 and
  wrangler `^4.132.0`. Worker name `zacharyshort-com` (`wrangler.jsonc`). The Pages project
  `my-next-app` is retired by this cutover.
- **CI:** none. `.github/` does not exist.
- **Tests:** none.

## Architecture

1. **Static by default, with exactly two on-demand routes.** Every page is prerendered at build
   time; only `src/pages/api/profile.ts` and `src/pages/p/[id].ts` set
   `export const prerender = false`, because both need the KV binding. 65 pages in `dist/client`.
2. **Posts are MDX, not TSX.** Each `src/content/leetcode/<slug>.mdx` carries frontmatter
   validated by the zod schema in `src/content.config.ts` (D2). Astro's content layer cannot
   load TSX, which is why the 61 posts were converted on 2026-09-15.
3. **Filename = slug = URL = LeetCode link.** See rule 2 above.
4. **The survey is the only interactive thing on the site.** One Preact island at `/setup`
   (`client:load`), 30 questions, posting to `/api/profile` and reading back from `/p/<id>`.
   Everything else ships zero client JavaScript.
5. **The deploy artifact is `dist/`.** The adapter writes the resolved Worker config to
   `dist/server/wrangler.json`, filling in `main` and `assets` — that generated file is what
   `wrangler dev` and `wrangler deploy` read, not `wrangler.jsonc` directly.
6. **Trailing slashes are the asset server's business, not Astro's.** `wrangler.jsonc` sets
   `assets.html_handling: "drop-trailing-slash"` so the 61 published URLs are served at their
   canonical, no-slash form, the way the Pages site served them. Astro's own `trailingSlash`
   option cannot do this for prerendered pages — its own types say so. Do not simplify that
   line away; it decides the shape of every indexed URL on the site.

## Directory map

| Path | Belongs here | Does not |
|---|---|---|
| `src/pages/` | Route files, including the two on-demand ones | Shared components, post content |
| `src/layouts/` | `Base.astro` — takes `title` and `description`, emits the canonical link | Route files |
| `src/components/` | Shared `.astro` components; `leetcode/` holds helpers imported by post content | Post content |
| `src/components/survey/` | The Preact island and its CSS — the only `.tsx` in the repo | Anything a static route renders |
| `src/content/leetcode/` | One `.mdx` per solved problem. 61 files | Components, helpers, drafts |
| `src/lib/` | Build-time and request-time helpers — the catalog, the profile store, the short id | React components |
| `src/styles/` | `global.css`, the token system | Component-scoped CSS |
| `public/` | Static assets served from `/`; post images under `public/leetcode/images/` | Generated output |
| repo root | `env.d.ts` — see *Gates that lie* | Application code |

## Commands

Every command below was run once in a clean worktree at `34175ae` on 2026-09-16 before it was
written here.

Fresh checkout or new worktree — run this before believing any gate:

```bash
bun install && bun run build
```

Gates:

```bash
bun run build
```

```bash
bunx tsc --noEmit
```

```bash
bunx wrangler deploy --dry-run -c dist/server/wrangler.json
```

Dev server — plain Astro, no KV binding:

```bash
bun run dev
```

**A real Worker, with the KV binding**, which is what the two on-demand routes need:

```bash
bunx wrangler dev -c dist/server/wrangler.json --port 8788 --persist-to ./.wrangler/state
```

**`bun run build` is the real gate**, and it is a smaller claim than it used to be — see below.

### Gates that lie

- **`bun run build` typechecks almost nothing.** It is `astro build`. No `astro check` is
  installed, so a green build means *it compiled and every content file imported*. That last
  part is real and worth having: a content file that throws at import fails the build rather
  than silently 404ing.
- **`bunx tsc --noEmit` exits 0 over a program that may not contain what you think.** Check with
  `--listFiles` rather than assuming — a type check that sees nothing also exits 0.
- **A gate piped into `head`, `tail` or `grep` reports the pipe's exit code.** Verified
  2026-09-15: `bunx tsc --noEmit | head -40` printed two real errors and reported `exit=0`.
- **`env.d.ts` is no longer load-bearing, and the rule that used to sit here said the opposite.**
  It is 237 KB of generated Cloudflare types for the retired Pages project. Verified 2026-09-16:
  `tsconfig.json` **excludes** it, nothing in the program references `CloudflareEnv`, and
  `bunx tsc --noEmit` exits 0. The live binding types are hand-written in `src/env.d.ts`
  instead. It survives only because deleting it was outside the cutover's confirmed scope —
  **raise it rather than deleting it on your own.** If you ever do regenerate it,
  `bun run cf-typegen` rewrites the whole file and buries the real diff.
- **A green build says nothing about the URL *shape*.** The cutover found that Workers' default
  `auto-trailing-slash` inverted the trailing-slash convention against the Pages site — every
  one of the 61 indexed URLs would have gained a redirect hop, with the build green throughout.
  Only `curl -sI` against a real `wrangler dev` catches that class of thing.
- **"Gates green" is a small claim here.** There are no tests and no runtime checks. Anything a
  screen shows needs a runtime entry walked — and you can walk one yourself: the desktop app's
  browser drives `wrangler dev` fine.

### How it ships

**Merged is not shipped.** There is no CI and no deploy workflow — `.github/` does not exist.
**Verified 2026-09-16 with `bunx wrangler pages project list`: the Pages project was not wired to
the GitHub repo (`Git Provider: No`)**, so pushing has never published this site. That was an
open worry from 2026-09-15 and it is now closed.

A deploy is a person running `bun run deploy`, which is now `wrangler deploy`. `bunx wrangler
whoami` returns an authenticated OAuth token with `workers (write)`, so that command from this
machine publishes for real.

The site serves from **`www.zacharyshort.com`**. The apex `zacharyshort.com` has no DNS record —
verified 2026-09-16, `dig` returns only an SOA and `curl` fails to resolve it — so `site` in
`astro.config.mjs` names the `www` host. Do not "fix" it to the apex; that would point every
canonical link on the site at a hostname that does not exist.

## Where work is written down

- `HANDOFF.md` — what is true: environment, settled decisions, the step log. Read first.
- `PASSOFF.md` — what is next, one standalone prompt per item.

**Both are gitignored globally** (`~/.config/git/ignore:5-6`), so they live only in the main
working tree — not in any worktree, and never in a commit. Edit them at
`/Users/zachshort/Projects/portfolio/`, and never list them in a git block.

## Never do this

- Never run `bun run deploy` or any `wrangler deploy` without `--dry-run` — wrangler is
  authenticated on this machine and the deploy is real. Print the command; Zach runs it.
- Never create, rename or delete a Cloudflare resource — a KV namespace, a Worker, a custom
  domain. Print the command; Zach runs it.
- **Never run `npm publish` from this directory, and `"private": true` is not a guard.** npm is
  logged in as `zach-short` from 2026-09-16. That day a publish meant for
  `~/Projects/personal-config` was run here instead: npm 11.19.0 ignored `package.json`'s
  `"private": true`, packed **123 files, 571.8 kB** of this repo and sent it to the registry as
  `my-next-app@0.1.0`. **The only thing that stopped it was a stranger owning that name**
  (`pavankumar_2211`, 2023-12-10), so the registry refused the version. Two consequences, both
  deliberate: **`package.json`'s `name` is still `my-next-app`** even though nothing here is a
  Next app — verified 2026-09-16 that `zacharyshort-com` is free on the registry, so renaming to
  it would delete the collision that saved this repo — and a `prepublishOnly` script now exits 1,
  which guards regardless of the name. **Do not rename the package and do not remove that
  script.**
- Never rename, delete or re-slug a file in `src/content/leetcode/` — the filename is a live URL.
- Never restore or delete anything in Zach's uncommitted changes to make a gate go green.
- Never `git checkout --` or `git stash` to undo an experiment — both reach files that are not
  yours, and the stash stack is shared across every worktree. Copy the file aside and restore it
  with `cp`.
- Never run `git commit`, `git push`, `git add -A` or `git add .` — print the two blocks instead.
