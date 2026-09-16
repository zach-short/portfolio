# Project stories — PLAN

**STATUS: PLANNED — APPROVED at GATE 2, 2026-09-16** (*"approved, join the room yourself,
fallbacks are fine, copy good, emoney"*). Design: `DESIGN.md`, D1–D8, frozen. **The whole run is
authorized**; phases do not each need re-approval. P1 is on the board as `PASSOFF.md` item 10.
Written on Fable 5.1; the build phases are assigned Opus 5, so the scoping session hands off
after GATE 2 rather than building (`~/.claude/rules/model-routing.md`: a build on the wrong
tier is handed off, not done).

The design is *what and why*; this is *in what order, by whom, done when*. A phase whose
done-when is only "gates pass" has no done-when — gates here cannot see a screen
(`CLAUDE.md`, *Gates that lie*), so every phase below names the proof a green build cannot
supply.

---

## 0. Facts verified 2026-09-16 — these supersede `DESIGN.md` where they differ

Written the same day as the design, so `DESIGN.md` §1 is this plan's baseline. The rows below
are the ones that go stale between sessions. **Every phase re-runs them as its first step and
edits this table**; where the two disagree, this table wins and says so.

| Fact | Value 2026-09-16, **re-run by P1 the same day** | How to re-check |
|---|---|---|
| `main` | **`daede6d`** — moved a third time between the hand-off and P1's first command: Zach committed step 14's three owed doc files (`astro-rebuild/DESIGN.md` +30/−2, and this folder's `DESIGN.md` and `PLAN.md`, new). So the design and this plan are **tracked and present in the worktree**, which they were not when P1 was written. `git branch --no-merged main` still empty | `git -C /Users/zachshort/Projects/portfolio log --oneline -1 main` |
| Live worktrees | `item6-survey` (`ea4feb7`), `item7-cutover` (`6dcafd7`), `item8-registry-pin` (`7e0fbc4`, merged, worktree still present), plus **`item10-stories` (`daede6d`) — this phase's.** `setup-scratch` is gone, pruned by step 15 | `git -C /Users/zachshort/Projects/portfolio worktree list` |
| Zach's uncommitted set | **`.gitignore` modified only**; `.claude/worktrees/` untracked. The three doc files left it when `daede6d` landed | `git status --short` — never stage either |
| Next free `HANDOFF` step | **16** — step 15 (`item8-registry-pin` proved and merged) landed after this plan was written. The cell's own warning held: it said 15 and 15 was taken | `grep -nE '^\*\*[0-9]+\. ' HANDOFF.md \| tail -1`, read it, do not trust this cell |
| Build baseline | `bun run build` exit 0 in this worktree, **65 emitted HTML files** — the log prints **66** prerender lines, the 66th being D10's `roman-to-interger` redirect, which writes no file (`file not created, response body was empty`). "66 pages" in P1's done-when is the **emitted-file** count, so the target is 66 files / 67 lines | `find dist/client -name '*.html' \| wc -l`, beside the log |
| Furlough's raw screens | `design/store/raw/01.png` … `10.png` exist | `ls ~/Projects/furlough/design/store/raw` |
| `sharp` | 0.35.4, transitive | `node -p "require('/Users/zachshort/Projects/portfolio/node_modules/sharp/package.json').version"` |
| The three sites | all 200; EZH and E-Money both redirect apex → `www`. **Furlough's App Store link is live**: `apps.apple.com/app/id6810006594` → 200 at `apps.apple.com/us/app/furlough/id6810006594` | `curl -sI -L -m 10 <url> -o /dev/null -w '%{http_code} %{url_effective}\n'` |
| Item 7 | **`DONE — HANDOFF 13`**, closed by another session on 2026-09-16 while this was being scoped: the site is **live on the Worker** at `www.zacharyshort.com` (61/61 slugs 200, apex answering too) and the Pages project is gone. Consequence for BD-2: the first deploy of this branch publishes the slugs for good | `PASSOFF.md` row 7; `HANDOFF.md` step 13 |
| Context7 | **still not available** in P1 — `ToolSearch` returned no `resolve-library-id` / `query-docs`. Astro facts came from `node_modules/astro` again | `ToolSearch` for it; if present, prefer it for `astro:assets` and `transition:*` |

---

## 1. Decisions taken since ratification

Build-level calls that *implement* the design, numbered so a later deviation can cite them.
Each carries a one-line reversal.

- **BD-1 — Images live in `src/assets/projects/<slug>/0N.png` and render through
  `astro:assets` `<Image>`.** Why: sized WebP/AVIF with `width`/`height` for free; `public/`
  would ship raw PNGs at 1 MB each. Reversal: move to `public/projects/` and use `<img>` with
  hand-set dimensions.
- **BD-2 — Slugs are `furlough`, `ezhomesteading`, `emoney`.** Why: they match the products'
  own domains and have no hyphen to mistype. **A slug is a published URL the moment Zach
  deploys** — the same class of invariant as the LeetCode filenames (`CLAUDE.md` rule 2); after
  that it changes only by redirect. Reversal: before the first deploy, rename freely; after,
  add a redirect in `astro.config.mjs` and keep both answering.
- **BD-3 — One data module, `src/lib/projects.ts`.** Exports `projects` (an array) and the
  `Project` / `Frame` types; screens are `import`ed `ImageMetadata`. Both the home page and the
  story page read it; nothing else describes a project. Reversal: a content collection under
  `src/content/projects/` — heavier, and a zod schema buys nothing for three entries.
- **BD-4 — The story script is `src/lib/story.ts`, armed by the story page's own `<script>`
  on `astro:page-load` and disconnected on `astro:before-swap`.** Why: `Base.astro` should not
  learn a page-specific script; `setup.astro` mounts its own island the same way. Reversal:
  move the call into `Base.astro`'s existing listener.
- **BD-5 — Without JS the phone shows frame 1's screen and every frame's copy is readable;
  frames 2–5's screens are not seen.** Why: the alternative is five phones or a stacked layout
  for a fraction of a percent of visitors who can click through to the product. Reversal: a
  `<noscript>` block that un-sticks the phone and stacks one screen under each frame.
- **BD-6 — Captures are taken in the desktop app's Browser pane at a custom 390×844
  viewport.** The pane screenshots at 2× (a 375×812 tab returned a 750×1624 frame on
  2026-09-16), so no scaling step. Reversal: headless Chrome the way `store-shots.sh` does it,
  if the pane's PNG carries a scrollbar or an alpha channel that `sharp` mishandles.
- **BD-7 — The phone recipe is Furlough's `.phone` (DESIGN §1 G8) with its two hand-written
  `rgba()` glows rewritten as `color-mix` on `--ember` / `--amber`.** Why: the rebuild's BD-5
  found that a port's hand-written rgba shades are exactly how accent literals sneak back in.
  Reversal: none — it is the rebuild's own rule.
- **BD-8 — Every screen's `alt` is its frame's headline.** Why: the screen *is* content, so
  `alt=""` is wrong, and the headline is the one sentence already written about it. Reversal:
  a dedicated `alt` field on `Frame`.

- **BD-9 — The phone's width comes from the captures' aspect, not from S-2's 350 px.** S-2 reads
  350×672, an aspect of 0.521; Furlough's ten captures are 1206×2622, an aspect of 0.460
  (`sips`, 2026-09-16). Filling a 0.521 bezel with a 0.460 image means cropping ~12 % of its
  height, and `raw/10.png` — frame 5, whose headline is *"Nothing to tap but Close."* — carries
  the Close button in the bottom 8 % of the frame. Cropping either end damages a screen: the top
  holds `01`/`02`'s settings pill, the bottom holds `01`/`02`'s tab bar and `10`'s Close. So the
  **height** keeps S-2's 672 px, which is the number that decides whether a sticky phone fits a
  laptop viewport, and the **width** is derived: `calc(var(--phone-h) * 1206 / 2622)` = 309 px.
  This is S-2's own mobile idiom ("40 vh tall, width from the aspect") applied to desktop, and
  the emitted `<img>` agrees — `width="350" height="761"`, the same 0.460. Reversal: set
  `--phone-w: 350px` and add `object-position` tuning, accepting a clipped Close button.
- **BD-10 — `imageService: 'compile'` on the Cloudflare adapter.** Not cosmetic: without it BD-1
  does not happen at all. `@astrojs/cloudflare` 14.3.1 defaults `imageService` to
  `'cloudflare-binding'`, whose `transformAtBuild` is `false`
  (`node_modules/@astrojs/cloudflare/dist/utils/image-config.js:3-12`), so `<Image>` copies the
  source file untouched and defers every resize to the Images binding at request time. Measured
  2026-09-16: the first build emitted the five source PNGs byte for byte, **172–978 KB each**,
  against S-10's 150 KB cap. `'compile'` runs sharp at build time and leaves the runtime service
  as passthrough. Safe because every page here is prerendered and nothing else on the site uses
  `astro:assets` (grep over `src/`, 2026-09-16). After: ten WebP, largest **39.7 KB**. Reversal:
  drop the option and raise S-10 to ~1 MB, or set `format`/`quality` by hand.

**Numbering note.** §3 reserved `BD-9` for a lowered *mobile* phone height if H6 failed. The
aspect deviation above came first and took the number; a mobile-height change would now be
`BD-11`. Renumbered here rather than leaving a gap.

---

## 2. Phases

| # | Phase | Driver | Subagents | Est. context | Why that shape |
|---|---|---|---|---|---|
| P1 | The story page, on Furlough | Opus 5 | none | full | Everything visible is decided here, against five screens that already exist; no external wait |
| P2 | EZHomesteading and E-Money: captures and frames | Opus 5 | none | comfortable | Waits on Zach (a room, an account); verified on the page P1 built |
| P3 | The home page: cards, thumbnails, copy | Opus 5 | none | comfortable | Touches settled copy and the first thing a visitor sees; the morph needs P1's `transition:name` |
| P4 | Runtime pass and close-out | Sonnet 5 | none | comfortable | Mechanical: collate, archive, index, memory |

**Lane C, serial.** P1 → P2 → P3: each changes the shape the next builds on. P4 runs after Zach
has walked `RUNTIME-PASS.md`. All four in one worktree, `.claude/worktrees/item10-stories`,
branch `item10-stories` from `main`.

**Why Opus 5 drives P1–P3.** The discriminator is whether a failure can be silent
(`docs/AGENT-PRACTICES.md` Part 4). Here every failure is loud — a red build, a wrong screen, a
heavy page, a headline the screenshot contradicts — and the one silent risk, a false product
claim, is caught by Zach reading the copy at GATE 2 (R7) and by P2's H2 table, not by a model.
No Deep phase, no Deep review.

---

### P1 — The story page, on Furlough

**Status: BUILT 2026-09-16, commit `3e2d790`. RUNTIME PASS OWED.** Every gate is
green — `bun run build` exit 0 at 66 pages, `bunx tsc --noEmit` exit 0,
`wrangler deploy --dry-run` exit 0 — and every *Walked* row below is **owed**: the Browser pane
starts dev servers only in the primary tree, so P1 never saw the page. `RUNTIME-PASS.md` P1
carries the eight entries, marked `NOT WALKED`. Full account: `HANDOFF.md` step 16.

Scope, executable without re-reading the design:

1. **Worktree, then the fresh-checkout recipe.**
   `git -C /Users/zachshort/Projects/portfolio worktree add .claude/worktrees/item10-stories -b item10-stories main`,
   then in it `bun install && bun run build` — exit 0, count the pages from the log (expect
   65). Set `PASSOFF.md` row 10 to `IN FLIGHT — P1` **before the first edit** (the row lives in
   the primary tree; `PASSOFF.md` is gitignored and exists only there).
2. **Re-run §0** and edit its table.
3. **Copy Furlough's five screens out**, read-only on the source:
   `raw/01.png → 01.png`, `02 → 02`, `06 → 03`, `08 → 04`, `10 → 05`, into
   `src/assets/projects/furlough/`. Record `shasum -a 256` of each source/destination pair in
   the ledger step. Nothing under `~/Projects/furlough` is edited (DESIGN §8).
4. **`src/lib/projects.ts`** (BD-3). Types: `Frame { eyebrow; headline; sub; screen:
   ImageMetadata }`, `Project { slug; title; blurb; tech: string[]; link; linkLabel; frames:
   Frame[] }`. Furlough's entry from DESIGN §7.2 and §7.3, **verbatim**. Named exports, no
   `any` (E1, T1). Only Furlough in P1; P2 adds the other two.
5. **`src/pages/projects/[slug].astro`.** `getStaticPaths` over `projects`;
   `<Base title={project.title} description={project.blurb}>`; renders `<ProjectStory
   project={project} />`. Model it on `src/pages/blog/leetcode/[slug].astro`.
6. **`src/components/ProjectStory.astro`.** The heading row: eyebrow *Project*, `h1.display`
   carrying `transition:name={`project-${project.slug}`}`, the tech chips, and the
   `Go to site ↗` glass button (S-9: under the phone on desktop, after the last frame on
   mobile). The `.story` grid at ≥ 860 px: `.stage` sticky at `top: calc(<nav height> + 32px)`
   holding `.phone` (BD-7, S-2) with the five stacked `<Image>`s (`loading="eager"` on the
   first, `lazy` on the rest; `widths={[350, 700]}` and a `sizes`); the inline SVG `.line`
   with one `<path>` and five `<circle>` dots in the column gap; the `.frames` column of
   `<section data-frame={i}>` with eyebrow, `h2.display`, sub. Below 640 px `.stage` sticks
   at the top at S-2's mobile height. All CSS in the component's `<style>`, tokens only
   (S1); S-2, S-3, S-4, S-8 are custom properties at the top of that block, written once.
7. **`src/lib/story.ts`** (BD-4): `export function startStory(root: HTMLElement)` — one
   `IntersectionObserver` over `[data-frame]`, `threshold: 0.5`, `rootMargin` so the active
   frame is the one nearest the middle of the viewport; it writes `root.dataset.active = i`
   and `--progress = i / (n − 1)`; it returns a disconnect. The page's `<script>` arms it on
   `astro:page-load` and disconnects on `astro:before-swap`. Reduced motion needs no branch
   here — CSS handles it — but `reveal.ts`'s early-return shape is the house style if one is
   wanted. Functions ≤ 15 lines (L1).
8. **State in CSS, from that one attribute.** Screens: all `opacity: 0`, the active one
   `opacity: 1`, `transition: opacity S-4 var(--ease)`. Tilt: `--ry: calc(S-3 − 2 × S-3 ×
   var(--progress))` on `.phone`, transitioned. Line, stepped baseline:
   `stroke-dashoffset: calc(var(--len) × (1 − var(--progress)))`, transitioned. Enhancement:
   `@supports (animation-timeline: scroll())` drives the same offset from a scroll timeline so
   it is continuous. `@media (prefers-reduced-motion: reduce)`: every transition off, `--ry:
   0deg`, the line drawn in full.
9. **Gates and proofs** — the done-when list, in order, each redirected to a file and its
   exit code read from a second file (`CLAUDE.md` rule 4).
10. **Record it.** A `HANDOFF.md` step at the next free number (read it); `As built:` notes
    under D1, D2, D3, D4 for every deviation; `RUNTIME-PASS.md` entries for
    `/projects/furlough` (goal / where / what the right answer is); the row on the board.

Subagents: **none.**

**Done when:**

- `bun run build` exit 0, **66 pages** (65 + `/projects/furlough`); `bunx tsc --noEmit` exit 0
  and `--listFiles` names `projects.ts`, `story.ts` and the page; `bunx wrangler deploy
  --dry-run -c dist/server/wrangler.json` exit 0.
- **Walked, desktop:** `astro dev` in the Browser pane, `/projects/furlough` — five frames;
  the screen changes as each frame is entered; the tilt sweeps from `+S-3` to `−S-3`; the
  line draws to each dot; `Go to site ↗` resolves to `https://apps.apple.com/app/id6810006594`;
  console clean; every request 200. Screenshots at frames 1, 3 and 5.
- **Walked, 375×812:** the phone sticks at the top; each frame's headline and sub-line are
  fully visible below it without scrolling the frame itself. **Report the pixel room** (DESIGN
  §5 H6). If it does not fit, S-2's mobile height comes down and the change is a `BD-9`.
- **Reduced motion, in `dist/`:** the story's emitted CSS contains a
  `prefers-reduced-motion` block that zeroes `--ry` and removes the transitions. The OS toggle
  is Zach's to flip; say so.
- **No JS:** with the script disabled, frame 1's screen shows and all five frames' copy is
  visible (BD-5).
- **Firefox baseline:** with the `@supports` block temporarily removed, the line still draws in
  steps as frames activate. Restore it; report it.
- **Weight:** every image emitted for the page under `dist/client/_astro/` ≤ **150 KB**
  (S-10); the page's total transfer at desktop ≤ **800 KB** (S-11), from the network panel.
- **Observer hygiene:** navigate `/` → `/projects/furlough` → `/` → `/projects/furlough`; a
  `console.count` in `startStory` (removed after) shows the observer armed once per visit and
  disconnected between.
- **Accent grep:** `grep -rniE 'E5563D|F59E4A|FFD59A|229, ?86, ?61|245, ?158, ?74|255, ?213, ?154' src/ dist/`
  → nothing; `#0FA79A` and `#7DE8D0` still exactly once each in `src/`. Lowercase too — the built
  CSS lowercases hex (`PASSOFF.md` header).

**Watch for:** the wall is `transition:persist`ed and fixed behind everything — a sticky
`.stage` needs `isolation: isolate` and a z-index above `main`'s stacking context or the glow
paints over the phone; `@/*` is the repo root, so image imports are `@/src/assets/…` (H7);
`<Image>` refuses a missing `alt` at build time — BD-8; `getStaticPaths` typing under
`astro/tsconfigs/strict`; **do not edit `Base.astro`** — the page arms its own script (BD-4);
`scroll-behavior: smooth` on `html` (`global.css`) interacts with any programmatic scroll —
there should be none.

---

### P2 — EZHomesteading and E-Money: captures and frames

**Status: OPEN. Waits on P1, and on Zach's E-Money room code** — ask for it in the first
message. GATE 2 (2026-09-16) settled the rest: EZHomesteading uses the public fallbacks; a session
may join the room as one player.

Scope:

1. **Re-run §0**; row 10 → `IN FLIGHT — P2`.
2. **EZHomesteading, public.** Browser pane at 390×844 (BD-6): the home, then `/market`.
   Screenshot at scale 1 and save the 2× PNG as `src/assets/projects/ezhomesteading/01.png`,
   `02.png`. If `/market` signed out shows only the shopping-area prompt, that *is* frame 2's
   screen and the sub-line still holds; if it shows nothing usable, fall to fallback order and
   say so.
3. **EZHomesteading, frames 3–5 = the public fallbacks 3′, 4′, 5′** (GATE 2, 2026-09-16) — a
   listing page (`/l/<id>`, the deep-link path), a store page, the sell entry — captured the
   same way as step 2. Find a listing and a store from the live market feed; if the sell entry
   needs sign-in, capture what a signed-out visitor sees and judge whether the sub-line still
   holds; if not, cut the frame (D4) and record it.
4. **E-Money** — join Zach's room from the Browser pane as one player (authorized at GATE 2,
   2026-09-16; the code comes from him). Five screens per DESIGN §7.5; the pay / request drawer
   captured *open*. **Never type a credential**; a signed-in screen is his to capture. Do not
   create a room yourself — that is a different write than the one he authorized.
5. **The H2 check, written down.** For each of the ten frames, one row in §5.1: headline,
   screen file, the `file:line` or the on-screen element that backs the claim, ✓ or cut. The
   **verify at build** items in DESIGN §7.3–§7.5 are resolved here; a claim that fails is cut,
   never softened. A cut frame is recorded as an `As built:` under D4 and the story runs four.
6. **Add both entries** to `src/lib/projects.ts`, copy verbatim from DESIGN §7.2, §7.4, §7.5.
7. **Gates and walks:** both pages, both widths, the same *Walked* and *Weight* rows as P1.
8. **Record it:** ledger step; `As built:` under D4 for any frame cut or swapped;
   `RUNTIME-PASS.md` entries for both pages.

Subagents: **none.**

**Done when:** build exit 0, **68 pages**; ten files under `src/assets/projects/{ezhomesteading,
emoney}/`, each `0N.png` named for its frame; each emitted image ≤ 150 KB; §5.1's ten rows
filled; both pages walked at both widths with screenshots at frames 1 and 5; `grep -niE
'producer|co-?op' src/lib/projects.ts` → nothing (DESIGN §1 G12); P1's accent grep repeated,
still clean.

**Watch for:** EZHomesteading's light pages inside the dark phone — S-6 (on `--ground`, a 1 px
`--edge` inset, no glow); capture E-Money's *room*, not its landing; a capture that includes the
pane's own scrollbar (BD-6's reversal); the rent drawer closes on blur — capture it in one
batch.

---

### P3 — The home page: cards, thumbnails, copy

**Status: OPEN. Waits on P2** (three complete entries in the data module).

Scope:

1. **Re-run §0**; row 10 → `IN FLIGHT — P3`.
2. **`src/pages/index.astro`.** Delete the hardcoded `projects` array; import from
   `src/lib/projects.ts`; render the three cards in module order (D5). Each card: the
   thumbnail — `<Image>` of frame 1's screen, `widths={[180, 360]}`, in a small `.phone` at a
   fixed 8° — the `h3.display` carrying `transition:name={`project-${slug}`}`, the blurb, the
   chips, the story link on the title and thumbnail, and a small `Site ↗` (`rel="noopener"`) to
   `project.link`. **Bocas leaves with the array.**
3. **Hero:** the two strings from DESIGN §7.1, verbatim. **`src/site.ts`:** `description`
   from §7.1, verbatim; nothing else in that file moves.
4. The head `<meta name="description">` and `og:description` follow from `Base.astro`; verify
   them in `dist/client/index.html`.
5. **Gates and walks.**
6. **Record it:** ledger step; `As built:` under D5, D6, D7; `RUNTIME-PASS.md` entries for `/`.

Subagents: **none.**

**Done when:** build exit 0, 68 pages; `grep -rniE 'bocas' src dist` → nothing; the hero and
description strings in `dist/client/index.html` match DESIGN §7.1 byte for byte; walked `/` at
desktop and 375×812 — three cards in order, thumbnails render, the three `Site ↗` hrefs are the
real domains, a card click lands on its story **with the title morph seen** in Chrome (a
mid-transition screenshot is not required; seeing it is, and saying so is); S-7 — the thumbnail
bytes actually requested by `/` (network panel) sum to ≤ 120 KB; console clean.

**Watch for:** two links inside one card — the card body must not be an `<a>` wrapping another
`<a>` (invalid HTML); put the story link on the title and thumbnail, the site link as a sibling;
the reveal delay `--d` per card carries over; the description string is also the OG
description; the `Explore Projects` button still targets `#projects`.

---

### P4 — Runtime pass and close-out

**Status: OPEN. Waits on Zach walking `RUNTIME-PASS.md`** — P1–P3's entries, pasted into each
hand-back as Block B.

Scope: findings from the walk fold back as a **new board item**, never as ad-hoc fixes. Then
`docs/AGENT-PRACTICES.md` Part 7's archiving ritual: `git ls-files | xargs grep -l
project-stories` for referrers, split runtime paths from prose citations; commit the folder in
its final state; `mv` to `~/Projects/archive/portfolio/project-stories/`; **verify each file
arrived before trusting the deletion**; add the line to `~/Projects/archive/portfolio/INDEX.md`
(it has no entries yet — this is its first); move the slug invariant (BD-2) into `HANDOFF.md`
Invariants so it outlives this folder; update memory.

Subagents: **none.**

**Done when:** the folder is out of the repo, the index line exists, `HANDOFF.md` Invariants
carries the slug rule, and a ledger step records the close.

---

## 3. Dials

| # | Dial | Value | Set by |
|---|---|---|---|
| S-1 | Frames per project | 5; Furlough uses 1, 2, 6, 8, 10 of its ten | D8 |
| S-2 | Phone size | 350×672 at ≥ 860 px; 40 vh tall below 640 px, width from the aspect | default; P1 may lower the mobile height as `BD-9` if H6 fails |
| S-3 | Tilt sweep | ±12° | default |
| S-4 | Cross-fade | 0.45 s on `--ease` | default |
| S-5 | Capture viewport | 390×844 CSS px at 2× | default |
| S-6 | Light screens | on `--ground`, 1 px `--edge` inset, no glow | default; P2 judges on EZHomesteading |
| S-7 | Home thumbnails, together | ≤ 120 KB | default |
| S-8 | Line | 3 px sharp over a 40 px halo at 35 % opacity | default |
| S-9 | Story CTA | under the phone on desktop; after the last frame on mobile | default |
| S-10 | Per emitted image | ≤ 150 KB | new here |
| S-11 | Story page transfer, desktop | ≤ 800 KB | new here |

S-1 lives in `src/lib/projects.ts` as the length of each `frames` array; S-2, S-3, S-4, S-8 are
custom properties at the head of `ProjectStory.astro`'s `<style>`; S-5, S-7, S-10, S-11 are
proof thresholds, checked, not coded. No number is written twice.

---

## 4. Seams reserved, deliberately not built

- **Bocas Adventures** — deleted, not reserved (D5). No route, no redirect, nothing.
- **A `/projects` index page.** The home page is the index.
- **Furlough's other five frames** (3, 4, 5, 7, 9) and **its Mac screens** — a one-line
  addition to the data module and five more files.
- **The Expo app's screens for EZHomesteading.** Zach chose the web app (GATE 1 Q5).
- **EZHomesteading's stateful frames** — the basket, the order chat, the pickup route
  (`DESIGN.md` §7.4 rows 3–5). Copy written, screens never captured; GATE 2 chose the public
  fallbacks. A one-row swap in the data module the day a screen exists.
- **The horizontal panorama** (DESIGN §3 B2) and **any auto-advance** (B3).
- **Per-project OG images.** The rebuild's §4 already reserves them.
- **A `<noscript>` stacked layout** — BD-5's reversal.
- **A story for the survey or the blog.** They are not projects on this page.

---

## 5. Repo hazards, with live numbers as of 2026-09-16

- `main` at `269d4aa` (verified 2026-09-16 at the end of scoping; it moved twice that day); three live worktrees; **`.gitignore` is Zach's** — never staged. A git
  block for the worktree carries its own `cd` in the same command (`CLAUDE.md` rule 7).
- **`bun run build` does not typecheck** (`CLAUDE.md`, *Gates that lie*). Run
  `bunx tsc --noEmit` as well, unpiped, and check `--listFiles` sees the new files.
- **65 pages** at `5b64d57` (`HANDOFF.md` Environment); `269d4aa` changed only the pin, so expect the same, but count from the build log; 66 after P1, 68 after P2.
- No lint, no tests, no CI. Every rule in `docs/conventions-typescript.md` is *review*.
- **`npm publish` and `bun run deploy` are live hazards** from this directory (`CLAUDE.md`,
  *Never do this*). Print the deploy command; Zach runs it.
- Item 7 closed 2026-09-16 (`HANDOFF` 13) and the site is live, so `bun run deploy` now publishes over a working site — one more reason no session runs it. `.gitignore` is still in Zach's uncommitted set; `wrangler.jsonc` and `CLAUDE.md` are nobody's to touch here.
- **`HANDOFF.md` and `PASSOFF.md` live only in the primary tree** (gitignored globally). Edit
  them at `/Users/zachshort/Projects/portfolio/`, never inside the worktree, never in a git block.

### 5.1 The H2 table — filled by P2

| Frame | Headline | Screen file | Backing: `file:line` or the on-screen element | ✓ / cut |
|---|---|---|---|---|
| EZH 1 | Sold by the hands that grew it. | | | |
| EZH 2 | Set your area. See what's ripe. | | | |
| EZH 3 | It says who grew it. *(3′)* | | | |
| EZH 4 | A neighborhood stand. *(4′)* | | | |
| EZH 5 | Got more than you can eat? *(5′)* | | | |
| EM 1 | One code. Every phone at the table. | | | |
| EM 2 | A bank that never runs out of bills. | | | |
| EM 3 | Pay it, or ask for it. | | | |
| EM 4 | Make an offer. | | | |
| EM 5 | The pot in the middle. | | | |

Furlough's five are checked once in P1: the headline of frame 3 against `raw/06.png`
(DESIGN §7.3, *verify at build*).

---

## 6. Session protocol

`docs/AGENT-PRACTICES.md` — Part 1 (the twelve rules), Part 5 (context: measure it after the
mandatory reading and before opening a second front), Part 6 (the worktree and the shared
index), Part 7 (close-out: the ledger step, Blocks A/B/C, what was and was not verified).

Specific to this project: work in `.claude/worktrees/item10-stories` on branch `item10-stories`
from `main`; run `bun install && bun run build` there before believing any gate; walk pages in
the desktop app's Browser pane (`HANDOFF.md` Environment: it can); Zach in chat, batched, before
any decision that is his; never deploy; the two git blocks with the worktree `cd` prefixed, no
attribution trailers, `.gitignore` never listed; read `docs/conventions-typescript.md` in full
before the first edit (R11).
