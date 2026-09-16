# PLAN — Astro rebuild of zacharyshort.com

**Status: PLANNED, awaiting GATE 2** (written 2026-09-15). No code has been written. The design
is `DESIGN.md`, frozen and ratified 2026-09-15; this file is *in what order, by whom, done when*.
Where this file's §0 and `DESIGN.md` §1 disagree, **this file wins** — it is the later pass.

**GATE 2 gates every phase below.** Once Zach approves the plan, it authorizes the whole run —
phases do not each need re-approval (`docs/AGENT-PRACTICES.md` GATE 2).

**Phase names and board numbers are not the same numbers.** The names below are the ones the
rebuild's pass-off used and a reader may already have seen; the board in `PASSOFF.md` numbers
every work item, including the two documentation ones. The mapping is fixed here (BD-2):

| Phase | Board item | Lane |
|---|---|---|
| Phase 1 — scaffold, tokens, layout, home | `PASSOFF` item 3 | A |
| Phase 2 — 61 solutions to MDX | `PASSOFF` item 4 | A |
| Phase B — personal-config: catalog, `--from`, publish | `PASSOFF` item 5 | B |
| Phase 3 — survey island, KV, result page | `PASSOFF` item 6 | A |
| Phase 4 — Workers cutover | `PASSOFF` item 7 | A |

---

## 0. Facts verified 2026-09-15 — these supersede `DESIGN.md` where they differ

The second verification pass the standard requires at build time (`docs/AGENT-PRACTICES.md`
Stage 4 §0). **Every number here rots.** Re-run this section at the start of each phase — 2.4
requires it of any resumed effort, and every phase after the first is one.

### 0.1 The blocker — the only gate is red, and not because of this rebuild

`bun run build` fails in the working tree. `content/leetcode/powx-n.tsx:8-9` statically imports
`@/public/leetcode/images/powx-n.png` and `powx-n2.png`; both are in Zach's uncommitted
deletions and `public/leetcode/images/` is empty on disk.

Reproduced 2026-09-15 in an **isolated detached worktree at `f5c6d7a`** with the two deletions
replicated, so it is the code and not a dirty tree: `Module not found: Can't resolve
'@/public/leetcode/images/powx-n.png'` … `Build failed because of webpack errors`, exit 1.
`powx-n.tsx` is the only one of the 61 posts that imports an image
(`grep -rln "images/" content/leetcode/` → one file).

**The gate that does not catch it, reproduced 2026-09-15 in the same worktree.** Sequence
matters: build once first, so the gitignored `next-env.d.ts` exists and declares the `*.png`
wildcard, *then* delete the images.

```
bunx tsc --noEmit > t1.txt 2>&1 ; echo $?   ->  0, and t1.txt is empty
bun run build     > b1.txt 2>&1 ; echo $?   ->  1, two "Module not found"
```

And the compounding trap, reproduced alongside it: `bun run build 2>&1 | head -5` reports **exit
0**, because a pipe reports the pipe's exit code. **A done-when that gates on `tsc` alone, or
that pipes a gate into `head` or `grep`, is green while the site does not build.** It is the one
hazard here that makes a phase lie about itself.

Two consequences that bind every phase:

- **No phase can claim "gates green" until this is resolved**, and a session that runs the build
  and sees red **must not attribute it to its own work**. Check this file first.
- **No session may decide it.** `DESIGN.md` §2 puts restoring or deleting those files out of
  scope. It is a GATE 2 question for Zach — restore the two PNGs, convert the post without its
  images, or drop the post — and **Phase 2 cannot convert `powx-n` faithfully until he answers.**

### 0.2 The inherited facts, now checked

`DESIGN.md` §1.4 carried these as leads, not facts (R3). Re-verified 2026-09-15 against
docs.astro.build by the session that ran this item concurrently and yielded; its write-up is the
citation, and the doc pages it names are the source.

| # | Design said | Verified 2026-09-15 | Effect |
|---|---|---|---|
| I1 | `glob()` reads MD/MDX/JSON/YAML, not TSX | **Confirmed, and wider than recorded:** Markdown, MDX, Markdoc, JSON, YAML or TOML. `.tsx` unsupported | D2's premise holds |
| I2 | `@astrojs/cloudflare` is Workers-only | **Confirmed:** the adapter no longer supports deployment on Cloudflare Pages; Workers-only since v13 / Astro 6, current v14.3.1 | D8's forcing reason holds |
| I3 | An adapter is needed for `prerender = false` | **Confirmed:** `output: 'static'` stays the default, one route opts out with `export const prerender = false`, and the rest of the site remains static | D1's shape is supported, not a workaround |
| I4 | `<ClientRouter />` replaced `ViewTransitions` | **Confirmed**, from `astro:transitions` — **and it already ships CSS disabling all view-transition animation under `prefers-reduced-motion`** | **Phase 1 must not hand-write reduced-motion for transitions.** Only the ported `reveal` and `wall` need their own guard |
| I6 | Claude Code deep-link shape | **Not re-verified.** Still a lead | Phase 3 re-verifies at code.claude.com/docs/en/deep-links before building rung 1 |
| I7 | `personal-config` free on npm | **Still 404 on 2026-09-15** (`npm view personal-config version`). Not a standing fact | Phase B re-checks immediately before publishing |

### 0.3 Live numbers

| Fact | Value on 2026-09-15 | Command that produced it |
|---|---|---|
| Posts to convert | 61 | `ls content/leetcode/*.tsx \| wc -l` |
| Of those, needing hand conversion | 4 (`add-two-numbers`, `fibonacci-number`, `happy-number`, `reverse-linked-list`) | `grep -rl` for `problem-link` and `string-ll-visual` over `content/` |
| Of those, importing an image | 1 (`powx-n`) — see §0.1 | `grep -rln "images/" content/leetcode/` |
| Routes, as of 2026-09-15 | 6 | `find app -type f` |
| Client JS, as of 2026-09-15 | none | `grep -rlE '"use client"\|useState\|useEffect' app components content utils \| wc -l` → 0 |
| Versions to pin | `astro` 7.3.2, `@astrojs/mdx` 8.0.1, `@astrojs/preact` 6.0.5, `@astrojs/cloudflare` 14.3.1 | `npm view <pkg> version`, each run once |
| Furlough's Astro | 7.3.2, sole dependency — the port lands on exactly the reference's version | `~/Projects/furlough/site/package.json` |
| personal-config HEAD | `07c3bbd`, tree clean — **it moved twice during 2026-09-15**, from `0d4500e` with 24 uncommitted files, through `33f3b37`, to `07c3bbd` (`git rev-list --count 0d4500e..07c3bbd` → 2) | `git -C ~/Projects/personal-config log --oneline -1` |
| personal-config gates | **Green at HEAD.** Reported 2026-09-15 by the concurrent session, in a clean detached worktree at `07c3bbd`: `bun run typecheck` 0, `bun run lint` 0 over 82 files, `bun test` 312 pass / 0 fail over 23 files. **Not reproduced by this session** | its write-up, path in `HANDOFF` step 2 |
| Next free `HANDOFF` step | **3**, after this session takes 2 | read `HANDOFF.md`'s step log — never trust a number written elsewhere |
| Board items taken | 1–7 | read `PASSOFF.md` |
| Mandatory reading, before any work | ~29k tokens (`CLAUDE.md`, `HANDOFF.md`, `PASSOFF.md`, `docs/AGENT-PRACTICES.md`, `docs/conventions-typescript.md`, `DESIGN.md`) | `wc -c <files> \| awk '{print $1/4}'` — 117,608 bytes |

**Superseded 2026-09-15, recorded rather than deleted (R5).** This section first said personal-config's
gates were green at `0d4500e` and **had not been re-run** since. That absence was wrong: a full
re-run was already recorded in personal-config's own ledger at `33f3b37` — its `HANDOFF` step 17,
*"Re-ran the whole gate after item 5 landed"*, verified 2026-09-15 by reading
`~/Projects/personal-config/HANDOFF.md:1006` — and a further run at `07c3bbd` is the row above.
The failure was asserting an absence in another repo from notes about it instead of from its
ledger; see §6.

**One fact changes shape during this effort and will invalidate the ledger's Environment table:
the gate command.** As of 2026-09-15 `bun run build` is `next build` (`HANDOFF.md` Environment).
From Phase 1 it is `astro build`. The phase that changes it owes `HANDOFF.md` an edited
Environment row in the same commit, or every later session runs the wrong gate.

---

## 1. Decisions taken since ratification

Build-level calls made after GATE 1 that merely implement a ratified decision
(`docs/AGENT-PRACTICES.md` R12). Each carries its one-line reversal. A call that would have
changed a `D<n>` is not here — it stops and goes to Zach.

- **BD-1 — The project folder is `docs/incomplete/astro-rebuild/`.** Implements D12 using the
  path Appendix A of the standard fixes. *Reverse:* move the folder, then
  `git ls-files | xargs grep -l astro-rebuild` and fix the referrers.
- **BD-2 — Phase names are kept and mapped to board numbers rather than renumbered.** The names
  `Phase 1..4` predate this plan; renaming them would strand anyone holding the old ones.
  *Reverse:* renumber the board rows to match, editing the mapping table and every `PASSOFF.md`
  row in one commit.
- **BD-3 — `REBUILD-PASSOFF.md` is deleted, not archived in the repo.** Its verified content is
  in `DESIGN.md` §1 and §3 and its phase table is the board. It was never committed (untracked),
  so the deletion is unrecoverable from git; the session that deleted it copied it to its
  scratchpad first and named the path in its hand-back. *Reverse:* restore from that copy within
  the session, or from `DESIGN.md`, which carries everything that was verified.
- **BD-4 — The 61-slug list in `DESIGN.md` §4.1 is the parity checklist**, rather than a list
  regenerated per phase. A list regenerated from `content/leetcode/` after Phase 2 has deleted
  those files proves nothing. *Reverse:* none needed; it is a frozen copy by design.

---

## 2. Phases

| # | Phase | Driver | Subagents | Est. context | Why that shape |
|---|---|---|---|---|---|
| 1 | Scaffold, tokens, base layout, nav, footer, home | Default (Opus 5) | none | comfortable | One platform, ~10 new files, no content. The judgment is visual and the failure is loud |
| 2 | 61 solutions to MDX, content config, `[slug]`, redirect | Mechanical (Sonnet 5), escalate to Default on a non-obvious failure | Mechanical relay over the 57 plain files, in bounded batches | full | 61 files is the definition of a sweep; the 4 exceptions are named up front so they do not surprise a Mechanical session |
| B | personal-config: `bun run catalog` + freshness test, `setup --from`, npm publish | Default (Opus 5) | none | comfortable | Different repo, different gates, no dependency on the site. Runs in parallel with 1 and 2 |
| 3 | Survey island, POST + KV, `/p/<id>`, result page with three rungs | Default (Opus 5) | one narrow Deep review, conditionally — see the phase | full | The only interactive surface and the only server route. Failure here is visible but subtle |
| 4 | Workers cutover, wrangler config, domain, retire Pages, delete dead files | Default (Opus 5) | Mechanical, two bounded jobs | tight | It touches deploy, and deploys from this machine are real. Named delegation below |

Ceilings, from `docs/AGENT-PRACTICES.md` Part 5: Mechanical ~500k, Default ~400k, Deep ~250k;
start landing 100k below. **Nothing is planned above `tight`.** Phase 4 is `tight` and names
what it delegates if it runs long.

**No phase is assigned Deep.** The discriminator is whether a failure can be silent (Part 4),
and every failure mode here is loud — a red build, a missing URL, a visibly wrong screen. The
one candidate for a narrow Deep *review* is Phase 3's stored-profile path, and it is named
there rather than assumed.

---

### Phase 1 — Scaffold, tokens, base layout, nav, footer, home

**Status: PLANNED.** Board item 3. Lane A. Driver: Default (Opus 5). Waits on: GATE 2.

**Scope.**

1. Scaffold Astro 7.3.2 in place on `astro-rebuild`: `astro.config.mjs` with `output: 'static'`,
   `package.json` scripts (`dev`, `build`, `preview`), the adapter **not yet** wired — Phase 3
   adds it with the route that needs it (I3, confirmed).
2. Port the **whole** `:root` block from Furlough's `src/styles/global.css` (`DESIGN.md` F3 —
   fourteen colour and shape tokens plus five font stacks and `--ease`), replacing `--ember`
   with the hue Zach picks at GATE 2 (DIAL-1) and keeping every other token's name and role.
   Copy the eleven font files and their three OFL texts into `public/fonts` (F4).
3. Port `src/lib/reveal.ts` and `src/lib/wall.ts` verbatim from Furlough (F5). **Do not port
   `hourglass.ts`.** Re-read both files before porting — `DESIGN.md` F5's description of what
   they do is inherited, not re-verified.
4. Build `src/layouts/Base.astro`: head, font preloads, `<ClientRouter />` (D4), the header with
   the `zs` wordmark and the nav, and the footer with the three contact links (`DESIGN.md` §4.2,
   verbatim, including the GitHub target unless GATE 2 changes it).
5. Build `src/pages/index.astro` from `app/page.tsx`: hero copy verbatim (§4.4), the three
   project cards verbatim (§4.3) with their links set by DIAL-8, and the two hero buttons. The
   nav's "About" link was dead on 2026-09-15 (G20) — leave it pointing at `#contact` unless
   GATE 2 says otherwise, and say so in the hand-back rather than inventing an About section.
6. Decide and record whether Tailwind is kept at all (I5). D3 ports a hand-written token system;
   if nothing needs Tailwind, dropping it is a build-level call — record it as a `BD-n` here.

**Subagents.** None. The whole phase is judgment about a screen, and a subagent boundary throws
away exactly that.

**Done when.**

- `bun install --frozen-lockfile && bun run build` exits 0 — redirect to a file, echo `$?`, then
  read the file. **Never pipe a gate into `head`/`grep` and read `$?`** (`CLAUDE.md` rule 4).
  If it is red on `powx-n.tsx:8-9`, that is §0.1 and not your work.
- `HANDOFF.md`'s Environment table is edited in the same commit to say `bun run build` is now
  `astro build`, with the date.
- **Proof a green gate cannot supply, all four:**
  1. Zach opens `http://localhost:4321/` and sees the hero copy verbatim, the three project
     cards in order, and the three contact links — and says so.
  2. Side by side with furloughapp.com, the type scale, glass and spacing read as the same
     system and the accent reads as a different one — DIAL-1's whole purpose.
  3. With the OS "Reduce motion" setting **on**, `/` shows all content — nothing stays hidden
     waiting for a reveal that will not fire — and the wall glow is static. Note that
     `<ClientRouter />` already disables its own animations under that setting (I4), so this
     check is about `reveal` and `wall` only; do not hand-write a transition guard.
  4. `grep -r "E5563D" dist/ src/` returns nothing: the Furlough accent is gone, not overridden.

**Watch for.**

- **The zero-JS invariant is being retired deliberately here** (`HANDOFF.md` Invariant 3, D4).
  Say so in the ledger step; do not let a later session "fix" the reveal script as a regression.
- `@/*` resolves to the repo root, not `src/` (G22). Set the alias explicitly rather than
  assuming either convention.
- The two stale worktrees and the live branch `setup-scratch` recorded in §5 — `git worktree list`
  before creating another.

---

### Phase 2 — The 61 solutions become MDX

**Status: PLANNED.** Board item 4. Lane A. Driver: Mechanical (Sonnet 5), escalating to Default
on any failure that is not obvious. Waits on: GATE 2, then Phase 1, **and on Zach's answer to
§0.1** before `powx-n` can be converted.

**Scope.**

1. Write `src/content.config.ts`: one `leetcode` collection, `glob()` over
   `src/content/leetcode/*.mdx`, zod schema `title`, `difficulty`, `tags`, `leetcodeNumber`,
   `pubDate`, `languages` (D2), plus the optional fields the current shape carries —
   `complexity`, `performance`, `quote` (`DESIGN.md` §4.4).
2. Convert the **57 plain posts** in bounded batches: the `post` object's scalars into
   frontmatter, the prose into the body, each `code[]` entry into a fenced block tagged with its
   language for Shiki.
3. Convert the **4 posts that import helpers** by hand: `add-two-numbers` (both helpers),
   `fibonacci-number`, `happy-number` (`ProblemLink`), `reverse-linked-list` (`StrLLVisual`).
   Port `problem-link.tsx` and `string-ll-visual.ts` as components first.
4. Build `src/pages/blog/leetcode/[slug].astro` and the index, **sorted by date descending** —
   the current loader's order (`utils/get-leetcode-posts.ts`), and a thing a gate cannot see.
5. Add the D10 redirect: `roman-to-integer` becomes the canonical slug and file;
   `roman-to-interger` redirects to it permanently. Both URLs resolve afterwards. The Cloudflare
   adapter documents `_headers` and `_redirects` in `public/` for exactly this, so it can be one
   line rather than a route — verify that against the adapter's docs before choosing.
6. Rebuild `/blog` without the Economics link (D9, G16), and update the site description that
   advertises it (G19, `app/layout.tsx:11-12`).
7. Delete the Next.js content pipeline **only after** the parity check below passes:
   `content/leetcode/`, `utils/get-leetcode-posts.ts`, `app/blog/**`, `components/slug-helpers.tsx`.

**Subagents.** A Mechanical relay over the 57 plain files, in batches with a **bounded,
countable work-list** and the relay contract from Part 5 in every prompt: *stop at roughly 2/3
of your budget signals and return a pass-off prompt naming exactly what is left.* Log each relay
in the ledger step, so the record says the sweep took N passes. Give any analytical subagent its
own worktree — a subagent in the shared tree edits source even when asked only to review.

**Done when.**

- `bun run build` (now `astro build`) exits 0, checked without a pipe.
- **Proof a green gate cannot supply, all five:**
  1. A script lists every built post URL under `dist/blog/leetcode/` and diffs it against the 61
     slugs frozen in `DESIGN.md` §4.1 (BD-4). **Zero differences in both directions** — a missing
     URL and an invented one are both failures. Paste the empty diff into the ledger step.
  2. `roman-to-integer` resolves *and* `roman-to-interger` returns a permanent redirect to it,
     checked with `curl -sI` against `astro preview`; both status lines pasted into the step.
  3. The outbound leetcode.com link on `roman-to-integer` opens the real problem. It did not on
     2026-09-15 (G8, G9), and that is the bug D10 exists to fix.
  4. Zach opens `add-two-numbers` (both helper components), `powx-n` (whatever §0.1 decided) and
     three others: the prose, the highlighted code and the helper visuals render.
  5. `/blog/leetcode` lists all 61 newest-first, and `/blog` shows one card, not two.

**Watch for.**

- **Never rename, delete or re-slug a file to make something tidy** (G8, `CLAUDE.md` rule 2).
  The filename is an indexed URL *and* the outbound link. D10's redirect is the only exception
  and it adds a URL rather than removing one.
- **`powx-n` is blocked on §0.1** and is the single post that is. Convert the other 60 and stop
  on that one rather than deciding its images yourself.
- A content file that throws at import **fails the build** — it does not silently 404
  (`HANDOFF.md` Known facts, verified 2026-09-15). A green build genuinely means all imported.
- Escalate to Default the moment a failure is not obvious (Part 4). "It turned out to be simple"
  is a judgement only the assigned tier gets to make.

---

### Phase B — personal-config: `catalog`, `setup --from`, npm publish

**Status: PLANNED.** Board item 5. **Lane B — a different repo** (`~/Projects/personal-config`).
Driver: Default (Opus 5). Waits on: GATE 2 only. Runs in parallel with Phases 1 and 2.

**Scope.**

1. `src/commands/catalog.ts` + a `bun run catalog` script, emitting `catalog.json`: the 30
   questions (P1), the 28 long forms (P2), and a catalog version. Read from `src/questions/`,
   which is browser-safe — **not** through `src/phases/run.ts`, which is not (P3).
2. `tests/catalog.test.ts`, the freshness test: it fails when a question changes and the
   committed `catalog.json` does not.
3. `setup --from <url|path>` in `src/lib/args.ts` (P5) and `src/commands/setup.ts`, resolving a
   local path, an https URL, and — if Zach says yes to DIAL-5 — a bare short id.
4. Publish `personal-config` to npm (I7 — still 404 on 2026-09-15; re-check immediately before).
5. Pin the catalog into the portfolio as a git dependency (D6). **This is the one step that
   touches Lane A's `package.json`** — do not run it while Phase 1 is in flight.

**Subagents.** None.

**Done when.**

- In `~/Projects/personal-config`: `bun run typecheck`, `bun run lint` and `bun test` all exit 0.
  **Re-run them first, before touching anything** — they were last measured green at `0d4500e`
  and have not been run at `07c3bbd` (§0.3).
- **Proof a green gate cannot supply, all three:**
  1. The freshness test is *demonstrated to fail*: edit one question's text, run `bun test`
     (red), revert, run again (green). A freshness test nobody has seen fail is a test that
     passes because it asserts nothing.
  2. From a throwaway directory with no checkout,
     `bunx personal-config@<published version> setup --from <url>` produces a profile JSON
     byte-identical to the one uploaded. **This is where P6 bites**: the published `bin` points
     at `src/cli.ts`, a TypeScript entry that a plain `npx`/`node` install cannot run. If that
     proof fails, rung 3 of D7 is a line the result page cannot honestly print.
  3. `catalog.json` round-trips: its questions, grouped by phase, match
     `{you: 10, discover: 6, practices: 14}` (P1), and the two conditional questions and the one
     hidden derived question are present with their conditions intact.

**Watch for.**

- personal-config moved twice on 2026-09-15 (§0.3). Check `git log` and `git status` on entry;
  a doc's commit hash here has already been stale twice.
- An npm publish is irreversible in the way that matters: the version number is spent. Publish
  only after proof 2 passes locally against `npm pack`.

---

### Phase 3 — Survey island, KV store, result page

**Status: PLANNED.** Board item 6. Lane A. Driver: Default (Opus 5). Waits on: GATE 2, then
Phase 1 (layout and tokens) and Phase B (the catalog and `--from`).

**Scope.**

1. Add `@astrojs/cloudflare` 14.3.1 and make exactly one route on demand — `output: 'static'`
   stays, the route opts out with `export const prerender = false` (I3, confirmed).
2. `src/pages/setup.astro` — title copy from DIAL-4 — hosting the Preact island `client:load`
   (D5), driven by `catalog.json` (D6).
3. The island: 30 questions in three phases, the two conditionals (`track-mode` when
   `owned !== false`, `tracker` when `mode === 'team'`), the hidden derived
   `commit-policy-practice`, the long-form bodies from the 28 choices files, and back-navigation.
4. `POST /api/profile` — store the profile in KV under a short id (DIAL-6), return the id.
   `GET /p/<id>` — return the stored profile. Retention per DIAL-3.
5. The result page's three rungs (D7), in order, with the deep link's prompt under 1000
   characters (I6) and the copy from DIAL-2.

**Subagents.** None by default. **One narrow Deep review is warranted if and only if** the
stored-profile path grows a rule that could be silently wrong — an overwrite, a collision, or a
retention sweep. A wrong id that 404s is loud; a wrong id that returns *someone else's profile*
is silent, and that is the Deep tier's whole discriminator. Scope such a review to id generation
and the read/write path only, in its own worktree, verdict only.

**Done when.**

- `bun run build` exits 0, and the on-demand route is exercised under a real `wrangler dev` —
  not only `astro dev`, where the KV binding is a stub.
- **Re-verify I6 first**, at code.claude.com/docs/en/deep-links. It is the last inherited fact
  still unchecked, and rung 1 is built directly on it.
- **Proof a green gate cannot supply, all six:**
  1. Zach completes all 30 questions at `/setup` on a desktop **and** on a phone, and reaches a
     result page.
  2. Rung 1 opens Claude Code with the prompt pre-filled and **not sent**.
  3. Rung 1 is *also* tried on a machine that has never run Claude Code interactively, where the
     handler is not registered and the link does nothing. Rungs 2 and 3 exist for that visitor;
     if they are not obviously present when rung 1 silently fails, the page is wrong.
  4. The deep link's `q` length is printed and is **under 1000 characters**.
  5. `GET /p/<id>` from a browser with no session returns the same profile; a wrong id returns
     404, not a 500 and not someone else's profile.
  6. The conditional and hidden questions behave: `track-mode` and `tracker` appear only under
     their conditions, `commit-policy-practice` is never shown and is present in the output.

**Watch for.**

- This is the site's only island and only server route. Everything else stays static (D1).
- Islands lose state across navigations unless `transition:persist` (I4) — D4 avoids the problem
  by keeping the survey on one page. If the survey ever spans two pages, D4 needs a supersession,
  not a workaround.
- The stored profile is protected by unguessability alone (`DESIGN.md` §2: no auth). DIAL-6 is
  therefore a security parameter, not a cosmetic one.

---

### Phase 4 — Workers cutover

**Status: PLANNED.** Board item 7. Lane A. Driver: Default (Opus 5). Waits on: GATE 2, then
Phases 2 and 3.

**Scope.**

1. `wrangler.jsonc` for a Workers project with static assets (D8), new project name, KV binding
   for Phase 3's store.
2. Move the domain to the new Worker. **Zach runs every command that publishes.**
3. Retire the Pages project `my-next-app` (G21) — after, never before, the domain answers from
   Workers.
4. Delete what the rebuild orphans: `app/lib/getLeetcodePosts.ts` and `test.go` (G14, both
   confirmed dead), plus whatever Phase 2 left behind. **Not** `env.d.ts` (G15) unless the
   bindings it types are genuinely gone — and then regenerate with `bun run cf-typegen` rather
   than hand-editing.
5. Update `HANDOFF.md`'s Environment and Code map, and `CLAUDE.md`'s Commands and *Never do
   this*, to describe the Workers deploy. The old "never run `bun run deploy`" rule keeps its
   force under whatever the new command is.

**Subagents.** Mechanical, two bounded jobs, each in its own worktree: (a) the referrer sweep —
`git ls-files | xargs grep -l <filename>` for every file proposed for deletion, splitting hits
into *read at runtime* and *bare prose citations*, because only the first kind blocks a deletion
(`docs/AGENT-PRACTICES.md` Archiving); (b) the 61-URL `curl` pass against the preview URL.

**Done when.**

- `bun run build` exits 0 and `wrangler deploy --dry-run` succeeds.
- **Proof a green gate cannot supply, all four:**
  1. Against the **preview** URL, all 61 slugs from `DESIGN.md` §4.1 return 200 and
     `roman-to-interger` returns a 301 to `roman-to-integer`. Paste the count and both status lines.
  2. After the domain moves, the same pass runs against `zacharyshort.com` and gets the same
     answers, and the response headers show it is served by the Worker.
  3. The Pages project is retired only after proof 2, and Zach confirms the retirement himself.
  4. Every file deleted in step 4 has its referrer grep pasted into the ledger step, with the
     runtime/prose split stated.

**Watch for.**

- **Deploys from this machine are real.** `bunx wrangler whoami` was authenticated on 2026-09-15
  (G21). No session runs `bun run deploy`, `bun run preview` or any `wrangler pages deploy`
  (`CLAUDE.md` *Never do this*). Print the command; Zach runs it.
- **Merged is not shipped** (`HANDOFF.md`). Whether the Pages project is *also* wired to
  `zach-short/portfolio` for push-to-deploy could not be determined from the checkout on
  2026-09-15. **Ask Zach before assuming either way** — it is the one thing that could publish
  the rebuild before anyone intends it.
- `env.d.ts` is load-bearing and 237 KB (G15). Regenerating it buries a real diff.

---

## 3. Dials

All eight live in `DESIGN.md` §5 with their recommended defaults and the reason each is a real
question. A ninth is now open and is **not** a dial but a blocker: §0.1, the two deleted PNGs.

| Dial | Consumed by |
|---|---|
| DIAL-1 accent hue | Phase 1, step 2 — blocks the token port |
| DIAL-2 survey prompt copy · DIAL-4 `/setup` title | Phase 3, steps 2 and 5 |
| DIAL-3 KV retention · DIAL-6 short-id shape | Phase 3, step 4 |
| DIAL-5 `--from` accepts a bare short id | Phase B, step 3 |
| DIAL-7 GitHub contact link · DIAL-8 project-card links | Phase 1, steps 4 and 5 |
| §0.1 the `powx-n` images | Phase 2, and every phase's ability to claim a green gate |

**DIAL-1, DIAL-7 and DIAL-8 block Phase 1. §0.1 blocks one post in Phase 2.** The rest can be
answered while Phase 1 runs.

---

## 4. Seams reserved, deliberately not built

So the next effort need not guess whether an omission was considered.

- **A `/blog/economics` route.** D9 cuts the link; the route is not reserved, stubbed or
  redirected. Re-adding it is a new decision.
- **A `/projects/<slug>` route.** G17 found all six card links pointing at one that does not
  exist. DIAL-8's default sends them to the real domains instead. The route is *reserved* — the
  data already carries `localLink` — and deliberately not built.
- **An About section.** The nav has linked "About" to `#contact` since before this effort (G20).
  Left exactly as it is.
- **An MCP server or Claude Code plugin** (`DESIGN.md` §2). D7's rungs are the whole delivery surface.
- **Auth on the survey**, and any per-visitor profile listing. DIAL-6's unguessable id is the
  only access control, on purpose.
- **A light theme.** Single-scheme dark, as Furlough is (F3).
- **RSS and per-post OG images.** Both are cheap on Astro and neither was asked for.
- **Any change to `~/Projects/furlough/site`.** Read-only reference.

---

## 5. Repo hazards, with live numbers as of 2026-09-15

- **The only gate is red and it is not yours** — §0.1. Read it before reporting any build failure.
- **`bunx tsc --noEmit` cannot see a missing asset**, and in a checkout that has never been built
  it fails on those same two lines for the opposite reason (G4). Build once, then the type check
  means something.
- **Never pipe a gate into `head`, `tail` or `grep` and read `$?`** — you get the pipe's exit
  code (`CLAUDE.md` rule 4).
- **`bun run lint` is not a lint gate** in the portfolio; it tries to install ESLint and rewrite
  `package.json` (G5). personal-config is the opposite — `bun run lint` there is real.
- **There are no tests and no CI here** (G5). "Gates green" means compiled and typechecked and
  nothing else.
- **Numbered shared resources, exactly two:** step numbers in `HANDOFF.md` (next free: **3**) and
  item numbers in `PASSOFF.md` (1–7 taken). Derive the next by reading the file immediately
  before using it, never from a number written in a doc — including this one.
- **Two sessions took this board item on 2026-09-15 and collided** (`HANDOFF` step 2 and its
  corrections). **Mark a row `IN FLIGHT` before the first edit, not after.** That is the check
  that would have caught it.
- **Stale worktrees still point at these repos**, from earlier sessions — two under a
  `personal-config` scratchpad (one on branch `setup-scratch`, one detached at `57c829d`) and one
  at `~/Projects/personal-config/.claude/worktrees/admiring-shamir-ed32f3`. Run `git worktree list`
  before creating another; branch `setup-scratch` in the portfolio is still live.
- **Several sessions run in this checkout.** Never `git add -A` or `git add .`; never
  `git checkout --` or `git stash` to undo an experiment — copy the file aside and restore with
  `cp`. Never run `git commit` or `git push`: print the two blocks.
- **Lane A and Lane B share exactly one file**, `package.json`, at Phase B step 5.

---

## 6. Session protocol

- Read `docs/AGENT-PRACTICES.md` — it is the process standard — and `docs/conventions-typescript.md`
  in full before any code. Both are `review`-only: nothing in this repo lints or tests, so a green
  gate says nothing about either (G5).
- On entry to any fresh worktree: `bun install --frozen-lockfile && bun run build`. Both halves;
  the build is what generates the gitignored `next-env.d.ts` — until Phase 1 replaces the
  toolchain, at which point this recipe changes and the phase that changes it updates
  `HANDOFF.md` in the same commit.
- Re-run §0 at the start of every phase (`docs/AGENT-PRACTICES.md` 2.4).
- **Set your board row to `IN FLIGHT` before your first edit.**
- **Verify a self-correction as rigorously as the claim it corrects.** An over-correction costs a
  reader exactly what the original error would have — the record asserting that something true is
  false. On 2026-09-15 a sound claim about this repo's commit count was retracted within minutes
  of a plausible-sounding reason and had to be restored; the check was one `git rev-list --count`.
- **Before recording that another repo has not done something, read that repo's ledger — not your
  notes about it.** R4 says grep before recording an absence; across a repo boundary the ledger
  *is* the grep. Twice on 2026-09-15 a claim about personal-config was made from a second-hand
  summary and was wrong both times: the Furlough token list, and a gate re-run that had existed
  for hours.
- **A stale existence check is not a check.** `cat >` truncates silently, and on 2026-09-15 a
  session overwrote another's `PLAN.md` having checked that the file did not exist ten minutes
  and eight tool calls earlier. Test immediately before the write, or write to a temp path and
  move.
- Close out with Part 7: the ledger step at the next free number, then the three blocks in chat —
  the pass-off prompt, the runtime entries, and the next session's model on its own line.
- State plainly which of "gates green, not seen running" and "walked it and saw it" you are
  claiming, per item (R10).
