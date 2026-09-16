# DESIGN — Astro rebuild of zacharyshort.com

**Status: RATIFIED 2026-09-15.** Decisions D1–D12 were ratified by Zach in chat on 2026-09-15
and are frozen from here: this file changes by **amendment** — a new dated `D<n>`, a dated
supersession naming what it replaces, or an `As built:` note under the decision it deviates
from — never by editing a decision in place (`docs/AGENT-PRACTICES.md` Stage 3).

**Written 2026-09-15**, in this repo, on branch `astro-rebuild`. It carries forward
`REBUILD-PASSOFF.md`, which was untracked scratch and is deleted by the same session that wrote
this file; its content now lives here (§1, §3) and on the board (`PASSOFF.md`).

**Read order for anyone picking this up:** `HANDOFF.md` (what is true of the repo) → this file
(what was decided and why) → `PLAN.md` (in what order, done when) → `PASSOFF.md` (what is next).
`docs/AGENT-PRACTICES.md` is the process standard and `docs/conventions-typescript.md` is the
code standard; read the latter in full before any code.

---

## 1. Ground truth, verified 2026-09-15

Every option and every decision below is only meaningful against this table. Rows marked
**ledger** are taken from `HANDOFF.md` — written 2026-09-15 by the Part 0 adaptation session,
which ran each command once in a clean worktree at `f5c6d7a` — and are **not** re-derived here.
Rows marked **this session** were re-verified on 2026-09-15 by the command in the citation.
Rows marked **inherited** were verified by an earlier session against a source outside this
repo and have **not** been re-checked; each names where it must be re-verified before it is
built on.

**A citation naming `REBUILD-PASSOFF.md` points at a file that no longer exists** — it was
untracked scratch, deleted 2026-09-15 by `HANDOFF` step 2 once its content moved here. Those
citations are kept so the provenance of an inherited claim stays visible, not because the file
can be re-read.

### 1.1 The portfolio as it stands

| # | Claim | Verified | Citation |
|---|---|---|---|
| G1 | Next.js 15.3.2, App Router, React 19.1.0 / react-dom 19.1.0, Tailwind v4.1.7, TypeScript 5.8.3 `strict` | ledger | `HANDOFF.md` Environment; `CLAUDE.md` Stack, from `package.json` at `f5c6d7a` |
| G2 | bun 1.2.9, lockfile `bun.lock`, 328 packages | ledger | `HANDOFF.md` Environment — `bun install --frozen-lockfile`, 6.0s |
| G3 | **`bun run build` is the only real gate.** It compiles *and* typechecks the whole tsconfig program, including files nothing imports | ledger | `HANDOFF.md` Known facts — verified by planting a type error in the dead `app/lib/getLeetcodePosts.ts` |
| G4 | `bunx tsc --noEmit` is the same type check without the compile; it exits 0 only *after* a build has generated the gitignored `next-env.d.ts` | ledger | `HANDOFF.md` Environment + Known facts |
| G5 | **No lint, no tests, no CI.** `bun run lint` is `next lint` with no ESLint config and no `eslint` dependency; `find` for `*.test.*`, `*.spec.*`, `__tests__` returns nothing; `.github/` does not exist | ledger | `HANDOFF.md` Environment rows 6–8 |
| G6 | Routes are exactly: `/`, `/blog`, `/blog/leetcode`, `/blog/leetcode/[slug]`, `/api/hello`, plus `not-found` | this session | `find app -type f` → 12 files, 6 of them routes |
| G7 | 61 posts in `content/leetcode/*.tsx`, 61 `num:` fields | this session | `ls content/leetcode/*.tsx \| wc -l` → 61; `grep -h "num:" content/leetcode/*.tsx \| wc -l` → 61 |
| G8 | **Filename = slug = published URL = outbound leetcode.com link.** Renaming a file breaks an indexed URL and silently points the outbound link at a problem that does not exist | ledger | `HANDOFF.md` Invariant 1 — `utils/get-leetcode-posts.ts:9-15`, `app/blog/leetcode/[slug]/page.tsx:14-17` and `:123` |
| G9 | `roman-to-interger` is a typo **and** a live indexed URL | this session | `ls content/leetcode/ \| grep -i roman` → `roman-to-interger.tsx` |
| G10 | **Zero client JavaScript.** No `"use client"`, `useState` or `useEffect` anywhere | this session | `grep -rlE '"use client"\|useState\|useEffect' app components content utils \| wc -l` → 0 |
| G11 | Exactly **4 distinct** content files import a helper component: `problem-link.tsx` by `add-two-numbers`, `fibonacci-number`, `happy-number`; `string-ll-visual.ts` by `add-two-numbers`, `reverse-linked-list` | this session | `grep -rl` for each helper over `content/` |
| G12 | Exactly **one** post imports an image (`powx-n.tsx`). Both pngs are tracked in git and deleted in the working tree, so `public/leetcode/images/` is empty on disk | this session | `git ls-files public/leetcode/images` → 2; `ls public/leetcode/images \| wc -l` → 0; `grep -rl public/leetcode/images content/ \| wc -l` → 1 |
| G13 | ~~**The working tree does not build**, because of G12's deletions~~ — **SUPERSEDED 2026-09-15.** Zach answered `PLAN.md` §0.1: the PNGs come back. Both restored byte-identical to `HEAD`, `bun run build` exit 0, 66/66 pages. G12 still describes the deletions accurately *as of the date it was written* | ledger | `HANDOFF.md` step 3; `PLAN.md` §0.1 |
| G14 | Dead code: `app/lib/getLeetcodePosts.ts` (no importers) and `test.go` (no `go.mod`) | ledger | `HANDOFF.md` Known facts |
| G15 | **Not dead, despite `REBUILD-PASSOFF.md` claiming so:** `env.d.ts` (named in `tsconfig.json:24-25`; removing it gives `TS2688`) and `app/blog/components/problem-link.tsx` (3 importers) | ledger | `HANDOFF.md` Known facts — the correction and its disproof |
| G16 | `/blog/economics` is a dead link on the blog index | this session | `app/blog/page.tsx:9` |
| G17 | **There is no `/projects` route, and all six project-card links point at one** — each card renders `project.localLink` (`projects/<slug>`) twice, for "View Project →" and "Go to Site →". The real domain in `project.link` is never rendered | this session | `app/page.tsx:63-87` (the data) and `:119`, `:125` (both links); `find app -type f` shows no `app/projects` |
| G18 | The GitHub contact link points at `github.com/zachmshort` — the **old** username. `REBUILD-PASSOFF.md` records that Zach corrected the repo's git remote owner from `zachmshort` to `zach-short` on 2026-09-15 | this session | `app/page.tsx:155` |
| G19 | The site description advertises the Economics blog that D9 cuts | this session | `app/layout.tsx:11-12` |
| G20 | The header nav's "About" link points at `#contact`; there is no About section | this session | `app/page.tsx:21-23` |
| G21 | Deploy target as of 2026-09-15: Cloudflare Pages project `my-next-app`, output `.vercel/output/static` (not `.next`), produced by `bun run pages:build`. `bunx wrangler whoami` was authenticated on 2026-09-15, so a deploy from this machine is real | ledger | `HANDOFF.md` Invariant 4 and Environment; `wrangler.jsonc:7`, `:12` |
| G22 | `@/*` resolves to the repo root, not `src/` | ledger | `HANDOFF.md` Invariant 5 — `tsconfig.json:21-22` |
| G23 | Existing code-standard exceptions, left alone deliberately: three `post: any` sites (T1), two unnecessary default exports (E1), one camelCase filename (F1) | ledger | `docs/conventions-typescript.md` preamble; `HANDOFF.md` Known facts |

### 1.2 The Furlough site, the visual reference

Reference only. **Editing `~/Projects/furlough/site` is out of scope** (§2).

| # | Claim | Verified | Citation |
|---|---|---|---|
| F1 | Astro 7.3.2, and astro is its **only** dependency | this session | `node -p "require('./node_modules/astro/package.json').version"` → `7.3.2`; `~/Projects/furlough/site/package.json` has one dependency |
| F2 | Deploy is `astro build && wrangler pages deploy dist --project-name furlough --commit-dirty=true` | this session | `~/Projects/furlough/site/package.json` scripts.deploy |
| F3 | Tokens live in one `:root` block: `--ground #0F0D0B`, `--ember #E5563D`, `--amber #F59E4A`, `--cream #F5EFE6`, `--muted #B8AFA3`, `--faint #90877B`, `--moss #7BC96F`, `--pending #F2B544`, `--sand-light #FFD59A`, `--card rgba(255,255,255,.06)`, `--edge rgba(255,255,255,.12)`, `--edge-strong rgba(255,255,255,.28)`, `--radius 20px`, `--ease cubic-bezier(.2,.7,.2,1)`, plus `--display` / `--display-mid` / `--display-small` / `--body` / `--mono` | this session | `sed -n '/:root/,/}/p' ~/Projects/furlough/site/src/styles/global.css` |
| F4 | Fonts are self-hosted and OFL: Bricolage Grotesque (3 weights), Onest (4), Geist Mono (1), each with its OFL text file | this session | `ls ~/Projects/furlough/site/public/fonts` → 11 files including `OFL-*.txt` |
| F5 | Motion utilities are `src/lib/reveal.ts` (IntersectionObserver reveal) and `src/lib/wall.ts` (orbiting radial glow, transforms only). `src/lib/hourglass.ts` is Furlough-specific — **do not port it** | this session (files exist) / inherited (what each does) | `ls ~/Projects/furlough/site/src/lib`; behaviour from `REBUILD-PASSOFF.md`, source `~/Projects/furlough/design/DESIGN.md`. Re-read the two files before porting in Phase 1 |

### 1.3 personal-config, the survey's source of truth

| # | Claim | Verified | Citation |
|---|---|---|---|
| P1 | **30 questions**, phased `you` 10 / `discover` 6 / `practices` 14 | this session | `bun -e` importing `src/questions/index.ts` and counting `ALL_QUESTIONS` by phase → `total 30 {"you":10,"discover":6,"practices":14}` |
| P2 | 28 long forms in `docs/choices/*.md` | this session | `ls docs/choices/*.md \| wc -l` → 28 |
| P3 | `src/phases/run.ts` is **not** browser-safe: line 1 imports `BACK`, a runtime value that drags in clack. `src/questions/` itself is browser-safe | this session (line 1) / ledger (the disproof) | `sed -n '1p' src/phases/run.ts` → `import { BACK, type Prompter } from '../lib/ask.ts';`; `REBUILD-PASSOFF.md` records a subagent claiming otherwise on 2026-09-15 and its disproof |
| P4 | **No `catalog` command exists.** `src/commands/` holds `archive`, `context`, `handoff`, `passoff`, `setup`, `undo`, `worktree` | this session | `ls src/commands/` |
| P5 | **No `--from` flag exists.** `grep` for `--from` in `src/lib/args.ts` returns nothing | this session | `grep -rn "'--from'\|\"--from\"\|from:" src/lib/args.ts` → no hits |
| P6 | `package.json` `bin.personal-config` points at `src/cli.ts` — a **TypeScript** entry point, which runs under Bun but not under a plain `node`/`npx` install | this session | `~/Projects/personal-config/package.json` |
| P7 | HEAD is `07c3bbd`, working tree clean. `REBUILD-PASSOFF.md`'s "gates green at `57c829d`" is stale — the other session's `archive` / `handoff` / `passoff` / `worktree` commands have landed | this session | `git -C ~/Projects/personal-config log --oneline -1`; `git status --short` → empty |
| P8 | Profiles are `profiles/zach.json` and `profiles/starter.json` | this session | `ls ~/Projects/personal-config/profiles/` |

### 1.4 Inherited facts — not re-verified on 2026-09-15

Each of these was verified by an earlier session against a source outside both repos. They are
carried because a decision rests on them, and each names where it is re-verified. **Treat them
as leads, not facts** (`docs/AGENT-PRACTICES.md` R3).

| # | Claim | Source | Re-verify before |
|---|---|---|---|
| I1 | Astro's content-layer `glob()` loader reads MD/MDX/JSON/YAML — **not TSX** | docs.astro.build, read 2026-09-08 | Phase 2 (board item 4). It is the whole reason D2 converts the 61 files |
| I2 | `@astrojs/cloudflare` 14.3.1 is **Workers-only** and no longer supports Pages | npm, read 2026-09-08 | Phase 5 (board item 7). If wrong, D8's "retire the Pages project" loses its forcing reason |
| I3 | Any `prerender = false` route, and Astro Actions, need an adapter | docs.astro.build, 2026-09-08 | Phase 4 (board item 6) |
| I4 | `<ClientRouter />` replaced `ViewTransitions`; islands lose state across navigations unless `transition:persist` | docs.astro.build, 2026-09-08 | Phase 1 (board item 3) |
| I5 | Tailwind v4 integrates via `@tailwindcss/vite` | docs.astro.build, 2026-09-08 | Phase 1, **only if** Tailwind is kept — D3 ports a hand-written token system, so Tailwind may not be needed at all |
| I6 | Claude Code deep links: `claude-cli://open?repo=owner/name&q=<url-encoded>` opens a terminal in the person's clone with the prompt **pre-filled, not sent**; `q` max 5000 chars, over 1000 adds a review warning; `cwd=` beats `repo=`; **the handler registers only after the person's first interactive prompt**, so a copy-paste fallback is mandatory. VS Code variant `vscode://anthropic.claude-code/open` | code.claude.com/docs/en/deep-links, read 2026-09-15 | Phase 4 (board item 6) |
| I7 | The npm package name `personal-config` was free (404) on 2026-09-15 | npm, 2026-09-15 | Phase 3 (board item 5), immediately before publishing |
| I8 | The wizard with `--yes` picks the first repo alphabetically under `--projects-dir` (`src/commands/setup.ts`, `scans.slice(0, 1)`); its ownership guard compares the remote owner to `identity.githubLogin` | `REBUILD-PASSOFF.md`, 2026-09-15 | Any future wizard run. Not needed again for this effort — the wizard has already run (HANDOFF 1) |

---

## 2. What this is, and what it is not

**What this is.** A rewrite of zacharyshort.com onto Astro, in place, on branch `astro-rebuild`
of `zach-short/portfolio` (D11): the visual language of furloughapp.com applied to a four-route
personal site, the 61 LeetCode write-ups carried across without losing a single published URL,
and a new `/setup` page that runs personal-config's 30-question survey in the browser and hands
the visitor a configured repo in one click (D7).

**What it is not.** These stay out, whoever asks, until a dated supersession says otherwise:

- **An Economics blog.** D9 cuts the link; nothing replaces it.
- **An MCP server or a Claude Code plugin.** D7's three rungs are a deep link, a copyable
  command, and a downloadable profile. Nothing else.
- **Any edit to `~/Projects/furlough/site`.** It is the visual reference and is read-only here.
- **A light theme.** The design is dark-first and single-scheme, as Furlough's is (F3's
  `color-scheme: dark`).
- **Auth or accounts on the survey.** The short id in D7 is an unguessable handle, not a login.
- **Any change to `standard/AGENT-PRACTICES.boilerplate.md` in personal-config.**
- **Restoring or deleting `public/leetcode/images/powx-n*.png`** to make a build go green
  (G12, G13). Those deletions are Zach's.
- **Renaming, deleting or re-slugging anything in `content/leetcode/`** as a convenience (G8).
  D10's redirect is the *one* sanctioned exception, and it adds a route rather than removing a URL.

---

## 3. Decisions — D1 to D12

All twelve were ratified by Zach in chat on **2026-09-15**. Each carries its defense *including
the strongest argument against it*, which is what stops that argument returning in three weeks
as a new objection (`docs/AGENT-PRACTICES.md` 8.4). **Do not relitigate these** (R8); genuinely
new evidence produces a dated supersession in §6, not a quiet reversal.

### D1 — Astro 7, static output plus one on-demand route

Ratified 2026-09-15. The site builds static; exactly one route runs on demand (D7's POST
endpoint), which is what requires an adapter (I3).

*Defense.* The site is four routes and a content folder (G6), so a rewrite is small and buys a
zero-runtime baseline that matches what the site already is (G10). **Against: rewrite cost —
Next 15 already does all of this, and the 61 posts worked on 2026-09-15.** Answered by the size: four
routes, one loader, 61 content files whose conversion is mechanical (D2), against a permanent
reduction in framework surface. The honest cost is Phase 2, and it is bounded at 61 files.

### D2 — The 61 TSX solutions become MDX in a content collection with a zod schema

Ratified 2026-09-15. Schema fields: `title`, `difficulty`, `tags`, `leetcodeNumber`, `pubDate`,
`languages`. Code fences are highlighted by Shiki.

*Defense.* Astro's content layer cannot load TSX (I1), so the current shape — a default-exported
object with free-form JSX `children` — cannot survive as it is. A zod schema also converts the
post shape from convention into a checked contract, which is what the three `post: any` sites
(G23) are the absence of. **Against: the files that import helper components need hand
conversion.** True, and now counted: **exactly 4 of 61** (G11). The other 57 are mechanical,
which is why Phase 2 is Mechanical-tier with the 4 escalated.

### D3 — Port Furlough's token system, glass, type scale, eyebrow labels, and the reveal and wall utilities, with a sibling accent hue

Ratified 2026-09-15. Fonts are reused as-is (F4). `hourglass.ts` is not ported (F5).

*Defense.* The system is already built, self-hosted, OFL-licensed and proven on a live site
(F1–F5); rebuilding it would be inventing a second one. **Against: the same accent makes this
read as a Furlough page** — which is exactly why the accent is a sibling hue, not `--ember`.
That hue is the one dial this decision leaves open (§5, DIAL-1).

### D4 — `<ClientRouter />` for page fades

Ratified 2026-09-15. The survey lives on one page, so no `transition:persist` is needed (I4).

*Defense.* Cross-page fades are the difference between a site that feels designed and one that
flashes white. **Against: it puts a router script on a site whose defining property, as of
2026-09-15, is zero client JS (G10).** Answered by D3 already landing JS for `reveal` and `wall`: the zero-JS
invariant is *being deliberately retired* by this rebuild, not accidentally broken, and the
budget is a small script rather than a framework. Both utilities and the router honour
`prefers-reduced-motion`.

### D5 — The survey is a Preact island, `client:load`, at `/setup`

Ratified 2026-09-15.

*Defense.* One interactive widget on one page should not decide the whole site's runtime.
**Against: React is roughly ten times the runtime for one widget** — which is the argument
*for* Preact, and the reason React was not chosen. The counter-argument to Preact is a second
toolchain to learn; answered by it being one Astro integration and one JSX pragma.

### D6 — The site consumes a generated `catalog.json`, pinned as a git dependency

Ratified 2026-09-15. A new `bun run catalog` script in personal-config produces questions + the
28 long forms + a catalog version, committed there with a freshness test; the portfolio pins it
as a git dependency. Not a TS-source import.

*Defense.* Two hard facts force a build step: `src/phases/run.ts` is not browser-safe (P3), and
the 28 long forms are markdown files on disk (P2) that no browser import reaches. A committed
artifact with a freshness test also makes drift a failing test in the repo that owns the
questions. **Against: a pin means the site can lag the wizard.** That is the point — alignment
becomes a deliberate bump with a diff, instead of the site silently changing when someone edits
a question.

### D7 — The result page has three rungs, backed by a short-id profile store

Ratified 2026-09-15. Rung 1: "Open in Claude Code" deep link. Rung 2: copy a `claude "…"`
command. Rung 3: download the profile JSON with a `bunx personal-config setup --from ./profile.json`
line. A POST endpoint stores the profile under a short id in Cloudflare KV; `GET /p/<id>`
returns it; the prompt stays under 1000 characters and points at that URL. Requires
`setup --from <url|path>` in personal-config (P5) and an npm publish (I7). **No MCP, no plugin.**

*Defense.* The whole product claim is "one click to a configured repo", and the deep link is the
only rung that delivers it. **Against: the deep-link handler registers only after the person's
first interactive Claude Code prompt (I6)** — so for a first-time visitor rung 1 silently does
nothing. That is precisely why rungs 2 and 3 are not optional extras but required fallbacks, and
why the prompt is kept under the 1000-character review-warning threshold (I6) by pointing at the
stored profile instead of inlining it.

### D8 — Deploy to Cloudflare Workers with static assets, via `@astrojs/cloudflare`; retire Pages project `my-next-app`

Ratified 2026-09-15. New project name.

*Defense.* D7 needs a server route, and `@astrojs/cloudflare` 14.3.1 is Workers-only (I2), so
Pages cannot host this site with its adapter. **Against: Pages worked on 2026-09-15 and hosted the site
fine (G21).** True for a purely static site — which this stops being at D7. The migration is
also the moment the deploy stops being `bun run pages:build` into `.vercel/output/static`
(G21), so the old project is retired rather than left answering on a stale build.

### D9 — Cut the Economics link

Ratified 2026-09-15. `/blog/economics` is a dead link (G16).

*Defense.* It has never resolved. **Against: it advertises intent, and the site description
names an Economics blog (G19).** Answered by the description changing with it — a promise on a
personal site that has not been kept in a year reads worse than its absence.

### D10 — Redirect `roman-to-interger` to `roman-to-integer`

Ratified 2026-09-15.

*Defense.* The typo is a live indexed URL (G9) and the filename is also what builds the outbound
leetcode.com link (G8), so on 2026-09-15 that link pointed at a LeetCode problem that does not exist.
**Against: touching a published URL at all.** Answered by the shape: the corrected slug becomes
canonical *and* the old one keeps resolving via a redirect — nothing is removed. This is the one
sanctioned exception to G8, and it adds a route rather than deleting one.

### D11 — Rewrite in place, on branch `astro-rebuild` of `zach-short/portfolio`

Ratified 2026-09-15.

*Defense.* The 61 URLs, the domain and the deploy target all live in this repo's history; the
redirect in D10 and the cutover in D8 both need to land where the old URLs were served from.
**Against: a new repo would leave the Next.js history behind cleanly.** Answered by what a clean
history costs here — a second remote, a second deploy identity, and a migration of the very
URLs this effort exists to preserve.

### D12 — Wizard first, profile `zach`; ledger profile **plus** one project folder for this rebuild

Ratified 2026-09-15. Done as `HANDOFF` step 1 (the wizard run and Part 0) and this step.

*Defense.* The rebuild is also the first repo personal-config sets up end to end, so it doubles
as the wizard's dogfood. The two documentation shapes do different jobs: the ledger and board
are the repo's permanent record, the project folder is this effort's and is archived when it
closes (`docs/AGENT-PRACTICES.md` 2.2, Stage 8). **Against: two documentation systems at once
is one more than anyone maintains.** Answered by the archive step — the folder is temporary by
construction, and the standing rules it leaves behind move into the ledger.

---

## 4. Rules that survive unchanged

Listing what is *not* changing is how a build phase is stopped from helpfully rewriting it
(`docs/AGENT-PRACTICES.md` Stage 3).

### 4.1 The 61 published URLs

Every one of these resolved at `https://zacharyshort.com/blog/leetcode/<slug>` on 2026-09-15 and
must resolve after the rebuild. The slug is also what builds the outbound `leetcode.com/problems/<slug>/description`
link (G8). This list is the parity checklist for Phase 2's done-when — verified 2026-09-15 by
`ls content/leetcode/*.tsx`, 61 entries:

```
3sum                                              add-binary
add-digits                                        add-two-numbers
best-time-to-buy-and-sell-stock                   binary-search
binary-tree-inorder-traversal                     binary-tree-preorder-traversal
check-if-a-string-is-an-acronym-of-words          contains-duplicates
convert-1d-array-into-2d-array                    convert-sorted-array-to-binary-search-tree
convert-sorted-list-to-binary-search-tree         create-binary-tree-from-descriptions
create-hello-world-function                       distribute-candies
divisible-and-non-divisible-sums-difference       fibonacci-number
find-all-numbers-disappeared-in-array             find-resultant-array-after-removing-anagrams
find-the-index-of-the-first-occurence-in-a-string first-missing-positive
group-anagrams                                    happy-number
invert-binary-tree                                length-of-last-word
linked-list-cycle                                 longest-common-prefix
majority-element                                  max-consecutive-ones
maximum-candies-you-can-get-from-boxes            maximum-count-of-positive-integer-and-negative-integer
merge-sorted-array                                merge-two-binary-trees
merge-two-sorted-lists                            middle-of-linked-list
min-max-game                                      minimum-size-subarray-sum
minimum-sum-of-four-digit-number-after-splitting-digits
missing-number                                    move-zeroes
n-ary-tree-postorder-traversal                    n-ary-tree-preorder-traversal
palindrome-number                                 powx-n
remove-duplicates-from-sorted-array               remove-element
remove-linked-list-elements                       reverse-linked-list
reverse-odd-levels-of-binary-tree                 roman-to-interger
same-tree                                         search-insert-position
single-number                                     sqrtx
sum-of-digits-of-string-after-convert             third-maximum-number
two-sum                                           valid-anagram
valid-palindrome                                  valid-parentheses
```

Two notes that are part of the rule. **`roman-to-interger` is on this list and stays resolving**
— D10 makes `roman-to-integer` canonical and redirects the typo; it does not remove it.
**`powx-n` is the one post with images** (G12), and they are deleted in the working tree — Phase 2
converts the post either way and the images are Zach's to restore.

Three route-level URLs survive alongside them: `/`, `/blog`, `/blog/leetcode`.

### 4.2 The contact links

From `app/page.tsx:149`, `:155`, `:163`, verified 2026-09-15. Same three, same order, in the
rebuilt footer:

| Label | Target |
|---|---|
| Email | `mailto:zach.short@fantomworks.com` |
| GitHub | `https://github.com/zach-short` — **changed 2026-09-15, DIAL-7** |
| LinkedIn | `https://www.linkedin.com/in/zachary-short-12a1ab2a8/` |

**Answered 2026-09-15 (DIAL-7).** The target was `https://github.com/zachmshort` (`app/page.tsx:155`),
the old username (G18). Zach's call is **`zach-short`**, matching this repo's own remote
`git@github.com:zach-short/portfolio.git`. Email and LinkedIn carry forward verbatim.

### 4.3 The three project cards

From `app/page.tsx:63-87`, verified 2026-09-15. Same three, same order, same copy:

| Title | Description | Tech | Site |
|---|---|---|---|
| EZHomesteading | A peer-to-peer marketplace connecting small organic farms & gardens with locals. | Next.js, Expo, MongoDB | ezhomesteading.com |
| E-Money | A minimal real time monopoly funds & properties tracker. | Go, WebSocket, Next.js | emoney.club |
| Bocas Adventures | A site exposing travellers to the beauty of island life in Bocas del Toro & connecting them to local attractions. | Next.js | bocasadventures.com |

**Answered 2026-09-15 (DIAL-8).** On 2026-09-15 both links on every card pointed at
`projects/<slug>` and no such route exists (G17), so all six were dead, while the real domain in
`project.link` was never rendered. **Zach's call: one link per card, to the real domain.** The two
buttons — `View Project →` and `Go to Site →` (`app/page.tsx:118-128`) — collapse to a single
`Go to Site →` whose href is `project.link` (`https://ezhomesteading.com`, `https://emoney.club`,
`https://bocasadventures.com`). `localLink` is no longer rendered; the `projects/<slug>` route stays
a reserved, unbuilt seam (`PLAN.md` §4).

### 4.4 Everything else that survives

- **The hero copy**, verbatim: "Hi, I'm Zach" and "Tired of slow devs, sluggish sites, and
  overcomplicated apps? Me too." (`app/page.tsx:36-42`). Copy is never re-picked silently (R7).
- **The footer line**: "Let's build something that meets your needs on a timeline you deserve."
  (`app/page.tsx:145`).
- **The wordmark** `zs` in the header (`app/page.tsx:17`).
- **The post shape's meaning**, if not its file format: `num`, `date`, `tags`, `languages`,
  `code[]`, prose body, and the optional `title`, `difficulty`, `complexity`, `performance`,
  `quote` (`content/template.tsx`). D2 renames and schematizes; it does not drop a field without
  saying so here.
- **The build-time-only data flow.** Posts are read at build time and rendered on the server;
  the survey island (D5) is the single deliberate exception on the whole site.

---

## 5. Dials — every number and word this design leaves open

Each has a recommended default. Every one is asked at GATE 2; none is a build-level call.

| # | Dial | Recommended default | Why it is a real question |
|---|---|---|---|
| DIAL-1 | The accent hue that replaces `--ember #E5563D` (D3) | Three swatches on the same `--ground #0F0D0B`, offered at GATE 2 | Too close and the site reads as Furlough (D3's counter-argument); too far and the ported glass and type scale stop cohering |
| DIAL-2 | The survey prompt copy — the words the `/setup` result page hands to Claude Code (D7) | Three registers — plain, warm, terse — offered at GATE 2 | R7: user-facing copy is never picked silently. It is also the first thing a stranger sees the product do |
| DIAL-3 | KV retention for stored profiles (D7) | Keep forever — a profile is about a kilobyte | The alternative is a TTL, which silently breaks a bookmarked `/p/<id>` link |
| DIAL-4 | The `/setup` page title copy | Offered at GATE 2 alongside DIAL-2 | Same rule as DIAL-2; it is also the `<title>` and the OG title |
| DIAL-5 | Whether `setup --from` accepts a bare short id as well as a URL or path (D7) | Yes — `setup --from a1b2c3` resolves against the site's origin | It shortens rung 2's command below the point where a person reads it as a wall of text; the cost is a resolution rule inside personal-config |
| DIAL-6 | Short-id length and alphabet (D7) | 8 characters, lowercase alphanumeric, crypto-random | Unguessability is the only access control on a stored profile (§2: no auth) |
| DIAL-7 | The GitHub contact link (§4.2) | Carry `zachmshort` forward verbatim | G18: it is the old username and may already be a redirect or a dead account |
| DIAL-8 | Where the three project cards' links point (§4.3) | Both links go to the real domain in `project.link` | G17: all six were dead on 2026-09-15 and `project.link` is never rendered |
| DIAL-9 | Whether `--amber #F59E4A` follows the accent, or stays warm (D3) | Opened 2026-09-15, no default yet | The accent is not a lone token: `global.css:15-16` defines `--ember` and `--amber` as a warm pair and the wall renders both (`Base.astro:56`, `global.css:61-62`). A teal `--ember` beside an orange `--amber` is a clash, not a sibling accent |

### 5.1 Answers — GATE 2, 2026-09-15

Given by Zach in chat: *restore the pngs, teal accent, warm copy, plan approved.* Recorded by
`HANDOFF` step 3. **An answer here is not a licence to reopen a D** (§3 stays frozen); it fills
in the parameter that D left open.

| # | Answer | Enough to build on? |
|---|---|---|
| DIAL-1 | **Teal** | **No, not yet** — a hue, not a swatch. §5 promised three swatches on `--ground #0F0D0B`; the exact value is still to pick and Phase 1 step 2 is blocked on it |
| DIAL-2 | The **warm** register | Yes, as a register. The words themselves are drafted in Phase 3 and shown before they ship |
| DIAL-4 | The **warm** register, with DIAL-2 | Same |
| DIAL-3 · DIAL-5 · DIAL-6 | Not answered | They keep their recommended defaults above and block only Phase B / Phase 3 |
| DIAL-7 | **`https://github.com/zach-short`** | Yes. Changed from `zachmshort` on the evidence that this repo's own remote is `git@github.com:zach-short/portfolio.git` — the old username was never verified to redirect |
| DIAL-8 | **One link per card, to the real domain** | Yes. The two buttons collapse to a single `Go to Site →` pointing at `project.link`. `localLink` and the `projects/<slug>` route stay unbuilt (§4, reserved seam) |
| DIAL-9 | Not answered — opened by this pass | Blocks Phase 1 step 2 alongside DIAL-1 |
| §0.1 (not a dial) | **The PNGs come back** | Yes — restored and verified, `HANDOFF` step 3 |

---

## 6. Supersessions

None yet. Each entry, when there is one, is dated, states what it replaces, and says which half
dies when the replacement is partial (`docs/AGENT-PRACTICES.md` Stage 3).

## 7. As built

Empty until Phase 1 lands. Every deviation from a decision above is written back **under that
decision** as an `As built:` paragraph — not as a changelog here, and not in a commit message.
