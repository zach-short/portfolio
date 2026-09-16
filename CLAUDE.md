<!-- personal-config v0.1.0 · 2026-09-15 · config 8b28a65e · standard v1.0.2 -->
# portfolio

> **Before writing or editing any code, read the matching code standard in full —
> `docs/conventions-typescript.md` for typescript. Not optional, not conditional on task size. If you have not read it
> this session, read it now.**

> **Before scoping, planning or building a feature, read `docs/AGENT-PRACTICES.md`.** It is the
> process standard. Do not ask how the flow works; it is written down.

## The rules that get broken

Seeded 2026-09-15 from the Part 0 inventory, not yet earned by repeat violation. Replace an
entry with a real incident the first time one happens.

1. **The working tree does not build, and that is not yours to fix.** As of 2026-09-15 the
   primary checkout has uncommitted deletions of `public/leetcode/images/powx-n.png` and
   `powx-n2.png`, which `content/leetcode/powx-n.tsx:8-9` imports. `bun run build` therefore
   exits 1 with `Module not found` before it reaches anything you wrote. They are Zach's
   uncommitted changes. Say the build is red and why; do not restore the images, do not edit
   `powx-n.tsx`, and do not fold either into your diff.
2. **Never rename, delete or re-slug a file in `content/leetcode/`.** The filename is the
   published URL (`app/blog/leetcode/[slug]/page.tsx:14-17`) *and* the outbound link to
   leetcode.com (`app/blog/leetcode/[slug]/page.tsx:123`). `roman-to-interger.tsx` is a typo
   and an indexed URL; it stays until a decision replaces it with a redirect.
3. **A green `bunx tsc --noEmit` does not mean the site builds.** It cannot see a missing
   asset. Run `bun run build` before claiming anything.
4. **Never pipe a gate into `head`, `tail` or `grep` and read `$?`.** You get the pipe's exit
   code, which is almost always 0. Redirect to a file, echo `$?`, then read the file.
5. **`bun run lint` is not a lint gate.** Nothing lints in this repo. Running it will try to
   install ESLint and rewrite `package.json`. See *Commands*.
6. **No drive-by fixes.** There is dead code here (`app/lib/getLeetcodePosts.ts`, `test.go`)
   and a dead link (`app/blog/page.tsx:9` → `/blog/economics`). Note them and raise them; do
   not fold them into an unrelated change.
7. **Ask Zach in one batched message, in chat, in the same turn — before building.** He is
   interactive. A decision built on a guess is built twice.

## Stack

Verified 2026-09-15 from `package.json` and `bun install` output in a clean worktree at `f5c6d7a`.

- **Runtime / package manager:** bun 1.2.9. Lockfile `bun.lock`, 328 packages.
- **Framework:** Next.js 15.3.2, App Router, React 19.1.0 / react-dom 19.1.0.
- **Styling:** Tailwind CSS v4.1.7 through `@tailwindcss/postcss` (`postcss.config.mjs`);
  tokens in `app/globals.css`. Font: `IBM_Plex_Mono` via `next/font/google`
  (`app/layout.tsx:2`).
- **TypeScript:** 5.8.3, `strict: true`, `noEmit`, path alias `@/*` → repo root
  (`tsconfig.json:21-22`).
- **Other deps:** `date-fns` 4.1.0 is the only non-framework runtime dependency.
- **Hosting:** Cloudflare Pages via `@cloudflare/next-on-pages` 1.13.12 and wrangler 4.16.1.
- **CI:** none. `.github/` does not exist.
- **Tests:** none. `find` for `*.test.*`, `*.spec.*`, `__tests__` returned nothing.

## Architecture

1. **Statically generated, with zero client JavaScript.** No `"use client"`, `useState` or
   `useEffect` anywhere — grep over `app components content utils`, 2026-09-15, no hits.
   Everything renders on the server at build time. Do not introduce a client component without
   a decision that says to.
2. **Posts are TSX modules, not markdown.** Each `content/leetcode/<slug>.tsx` default-exports
   a `post` object: `num`, `date`, `tags`, `languages`, `code[]`, free-form JSX `children`,
   and optional `title`, `difficulty`, `complexity`, `performance`, `quote`.
   `content/template.tsx` is the canonical shape; it is not itself loaded.
3. **One loader, at build time.** `utils/get-leetcode-posts.ts:9-15` reads `content/leetcode/`
   with `fs.readdirSync` and dynamic-imports each file by template literal, sorted by date
   descending. `app/blog/leetcode/[slug]/page.tsx:14-17` turns that list into
   `generateStaticParams`. Adding a post means adding a file — there is no index to update.
4. **Filename = slug = URL = LeetCode link.** See rule 2 above.
5. **Two routes opt out of static generation.** `app/not-found.tsx:1` and
   `app/api/hello/route.ts:3` both `export const runtime = "edge"`, so the build prints a
   warning that the edge runtime disables static generation for those pages. Expected, not a
   regression.
6. **The deploy artifact is not `.next`.** `@cloudflare/next-on-pages` compiles `.next` into
   `.vercel/output/static`, which `wrangler.jsonc:12` names as `pages_build_output_dir`.
   Cloudflare Pages project name is `my-next-app` (`wrangler.jsonc:7`).

## Directory map

| Path | Belongs here | Does not |
|---|---|---|
| `app/` | App Router route segments, `layout.tsx`, `globals.css`, `not-found.tsx` | Shared components, data loading, post content |
| `app/blog/components/` | JSX helpers imported *by post content* — `problem-link.tsx` (3 posts), `string-ll-visual.ts` (2 posts) | Anything a route renders directly |
| `app/lib/` | Nothing. `getLeetcodePosts.ts` here is dead — no importers, superseded by `utils/get-leetcode-posts.ts` | Live code |
| `components/` | Components shared by routes *and* post content — `slug-helpers.tsx`, `back-arrow-button.tsx` | Route files |
| `content/leetcode/` | One `.tsx` per solved problem, default-exporting the `post` object. 61 files, 61 distinct `num` values | Components, helpers, drafts |
| `content/template.tsx` | The shape to copy when adding a post | A published post — the loader reads only `content/leetcode/` |
| `utils/` | Build-time data loading (`get-leetcode-posts.ts`) | React components |
| `public/` | Static assets served from `/`; post images under `public/leetcode/images/` | Generated output |
| repo root | `test.go` is orphaned — there is no `go.mod` and nothing compiles it | — |

## Commands

Every command below was run once in a clean worktree at `f5c6d7a` on 2026-09-15 before it was
written here.

Fresh checkout or new worktree — run this before believing any gate:

```bash
bun install --frozen-lockfile && bun run build
```

Gates:

```bash
bun run build
```

```bash
bunx tsc --noEmit
```

```bash
bun run pages:build
```

Dev server (verified: `/` and `/blog/leetcode/3sum` both returned HTTP 200):

```bash
bun run dev
```

**`bun run build` is the real gate.** It compiles *and* runs a full `tsc` pass over the whole
tsconfig program — including files nothing imports (verified 2026-09-15: a type error planted
in the dead `app/lib/getLeetcodePosts.ts` failed the build). `bunx tsc --noEmit` is the same
type check without the compile, and is worth running first because it is seconds rather than a
minute.

### Gates that lie

- **`bunx tsc --noEmit` cannot see a missing image.** `next-env.d.ts` declares `*.png` as a
  wildcard module, so `import image from "@/public/leetcode/images/powx-n.png"` typechecks
  clean whether or not the file exists. Verified 2026-09-15: with both pngs removed,
  `bunx tsc --noEmit` exited 0 and `bun run build` exited 1 with `Module not found`.
- **In a fresh checkout, `bunx tsc --noEmit` fails for a reason that is not yours.**
  `next-env.d.ts` is gitignored and generated by Next; before it exists, tsc exits 1 on
  `content/leetcode/powx-n.tsx:8-9` — the same two lines, for the opposite reason. Run
  `bun run build` once first, then the type check means something.
- **`bun run lint` does not lint.** There is no ESLint config in the repo, no `eslint`
  dependency in `package.json`, and no `eslint` in `node_modules`. `next lint` prompts
  *"How would you like to configure ESLint?"* — with stdin closed it exits 1 having done
  nothing; in an interactive terminal it installs ESLint and edits `package.json`. The
  `Linting and checking validity of types ...` line printed by `bun run build` is doing only
  the type half.
- **A gate piped into `head`, `tail` or `grep` reports the pipe's exit code.** Verified
  2026-09-15: `bunx tsc --noEmit | head -40` printed two real errors and reported `exit=0`.
- **"Gates green" is a small claim here.** There are no tests and no runtime checks. It means
  the site compiled and typechecked — nothing about whether a page looks right. Anything a
  screen shows needs a runtime entry Zach walks (Part 7 of the standard).
- **`env.d.ts` is load-bearing, not junk.** It is 237 KB of generated Cloudflare types, it is
  tracked, and `tsconfig.json:24-25` names it in `types`. Verified 2026-09-15: removing it makes
  `bunx tsc --noEmit` exit 2 with `TS2688`. Regenerate it only with `bun run cf-typegen`, and
  only when a binding actually changed — it rewrites the whole file.

### How it ships

**Merged is not shipped.** There is no CI and no deploy workflow in the repo — `.github/` does
not exist. A deploy is a person running `bun run deploy`
(`bun pages:build && wrangler pages deploy`). `bunx wrangler whoami` on 2026-09-15 returned an
authenticated OAuth token, so that command from this machine publishes for real. Whether the
Cloudflare Pages project `my-next-app` is *also* wired to the GitHub repo for push-to-deploy
cannot be determined from the checkout — ask Zach before assuming either way.

## Where work is written down

- `HANDOFF.md` — what is true: environment, settled decisions, the step log. Read first.
- `PASSOFF.md` — what is next, one standalone prompt per item.

## Never do this

- Never run `bun run deploy`, `bun run preview`, or any `wrangler pages deploy` — wrangler is
  authenticated on this machine and the deploy is real.
- Never run `bun run lint` — it offers to install ESLint and rewrite `package.json`.
- Never run `bun run cf-typegen` unless a Cloudflare binding actually changed — it rewrites the
  tracked 237 KB `env.d.ts` and buries the real diff.
- Never rename, delete or re-slug a file in `content/leetcode/` — the filename is a live URL.
- Never restore or delete the two `public/leetcode/images/powx-n*.png` files to make the build
  go green — those deletions are Zach's uncommitted work.
- Never `git checkout --` or `git stash` to undo an experiment — both reach files that are not
  yours. Copy the file aside and restore it with `cp`.
- Never run `git commit`, `git push`, `git add -A` or `git add .` — print the two blocks instead.
