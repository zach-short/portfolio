# Project stories — DESIGN

**STATUS: RATIFIED 2026-09-16.** GATE 1 was asked in chat on 2026-09-16, the same turn the scope
was finished, and answered by Zach in one message the same day. This file was `SCOPE.md` until
then; §1–§5 are the scope as ratified, §6 is the decisions, §7 the final copy, §8 what does not
change, §9 where this design changes other files. Scoped on Fable 5.1; the build is assigned
Opus 5 in `PLAN.md`.

Opened by Zach in chat on 2026-09-16: *"the wording and content is very plain and doesn't wow at
all. I really like Furlough's App Store image. What about a rotating carousel when you click on
specific projects … a phone-sized screen where as you scroll it changes to another aspect of the
project along the red line that connects the images."*

Process standard: `docs/AGENT-PRACTICES.md` (Profile P, §2.2). Code standard:
`docs/conventions-typescript.md`. Board row: `PASSOFF.md` item 10.

**Read this first.** The rebuild's design (`docs/incomplete/astro-rebuild/DESIGN.md`) is frozen
and this effort sits *on top of* it: D3 (the token system on a sibling accent), D4 (`ClientRouter`),
DIAL-1/DIAL-9 (the teal pair) and DIAL-8 (one link per card, to the real domain) are the decisions
this work touches. Where an option below would change one, it says so and the change is a dated
supersession in that file, never a quiet edit.

---

## 1. What exists, verified 2026-09-16

Every row was checked this session. `~/Projects/furlough/…` paths are read-only reference
(`astro-rebuild/DESIGN.md` §2).

| # | Claim | Verified state | Citation |
|---|---|---|---|
| G1 | The home page is a hero and three project cards, copy carried verbatim from the Next app; each card has one link, to the real domain | `projects[]` at `src/pages/index.astro:7-26`; one `Go to Site →` per card at `:57-59`; hero at `:33-40` | `src/pages/index.astro`; DIAL-8 in `astro-rebuild/DESIGN.md` §4.3 |
| G2 | The hero copy has never been re-picked; it was carried under R7 | *"Copy is never re-picked silently (R7)"*, and Phase 1 recorded *"No copy was re-picked"*. **Zach reopened it himself on 2026-09-16** (the quote at the top), which is the new evidence R8 requires — re-picking it now is a supersession, not a re-litigation | `astro-rebuild/DESIGN.md` §4.4; `HANDOFF.md` step 4 |
| G3 | The home page carries **no image at all**; the site's only images are the fonts, the grain and two post PNGs | `find public -maxdepth 2` → `fonts/`, `noise.png`, `leetcode/images/` (2 files) | `find`, `ls public/leetcode/images \| wc -l` → 2 |
| G4 | `/projects/<slug>` is a **reserved, unbuilt seam**; the `localLink` data that fed it was dropped | `find src/pages -iname 'projects*'` → nothing; the comment at `index.astro:5-6` says `localLink` was dropped | `astro-rebuild/PLAN.md` §4 (line 601); `HANDOFF.md` step 11 |
| G5 | The reference is `board.html`: ten `.frame`s, each an eyebrow + `h1` + `.sub` over a CSS `.device` holding `raw/NN.png`; each frame tilts its device (`--ry` 18° → −18°, plus `--rx`, `--rz`, `--ty`) so the row reads as one arc; **one SVG path** (`.stream`) runs behind all ten, stroked with a gradient, blurred (`feGaussianBlur stdDeviation=26`) under a 5 px sharp line; a `feTurbulence` grain overlay | Read in full 2026-09-16. Rendered by headless Chrome at 1320×2868 per frame and 13200×2868 for the panorama (`sips -g pixelWidth panorama.png` → 13200) | `~/Projects/furlough/design/store/board.html`; `scripts/store-shots.sh:14-24` |
| G6 | The "red line" is Furlough's **sand stream**: gradient stops `#E5563D` → `#F59E4A` → `#FFD59A` (ember → amber → sand). This site's accent is **teal**, `#0FA79A` / `#7DE8D0`, and that pair is settled | `board.html` `<linearGradient id="sand">`; `src/styles/global.css:18-19`; D3, DIAL-1, DIAL-9 ratified 2026-09-15 | `astro-rebuild/DESIGN.md` §5.1 |
| G7 | **Furlough is live on the App Store since 2026-09-15**, has ten real screenshots and ten frames of copy already written by Zach, and is **not one of the three cards** | `appStoreURL: 'https://apps.apple.com/app/id6810006594'` with the comment *"Live on the App Store since 15 September 2026"*; `ls design/store/raw` → `01.png`…`10.png`; `index.astro:7-26` names EZHomesteading, E-Money, Bocas only | `~/Projects/furlough/site/src/site.ts`; `~/Projects/furlough/design/store/raw/`, `LISTING.md` |
| G8 | Furlough's phone recipe exists in CSS: `.phone` 350×672, radius 44, 1 px 16 % white border, ground fill, two radial glows, deep shadow; the hero tilts it `rotateY(-7deg) rotateX(2.5deg)` with a 9 s float, and turns both off under reduced motion | Read 2026-09-16 | `~/Projects/furlough/site/src/components/HeroPage.astro:244-253`; `…/pages/index.astro:913-921` |
| G9 | **EZHomesteading** is live, redirects apex → `www`, and its home renders at 375×812 with no sign-in (headline *"Food from down the road, sold by the hands that grew it."*, a where/what search, a diorama) | `curl -sI -L` → 200, final `https://www.ezhomesteading.com/`; browser screenshot at 375×812, 2026-09-16 | curl; Browser pane |
| G10 | EZHomesteading is a Next.js web app + Expo native app + Go API on one Supabase Postgres schema; orders run through a button-driven chat; the card is authorized at checkout and captured only when the order is fulfilled; multi-stop pickups are route-optimized; Stripe Connect Express per seller | README read 2026-09-16 | `~/Projects/ezhomesteading/README.md` |
| G11 | The native app exists (`com.ezhomesteading.app`, v1.0.1) but **no store link was found** — only two TestFlight audits | `native/app.json`; `grep -rn 'apps.apple.com\|play.google.com\|testflight' web/app web/features docs/README.md` → 2 hits, both TestFlight audits (2026-08-05 and a later pass) | `~/Projects/ezhomesteading/native/app.json`, `docs/README.md:565,706` |
| G12 | EZHomesteading's positioning rules are **ratified and binding on its own copy**: no role words (never *Producer* / *CO-OP* — say "a backyard grower", "a neighborhood stand"); no money percentages ("100 % to the grower" is false); frame by absence (no warehouses, no trucks, no distributors) | Ratified with Zach 2026-08-07; on hold only as a delivery mechanism, positioning still binding | `~/Projects/ezhomesteading/docs/design/homepage-narrative.md` "Positioning decisions (ratified)" |
| G13 | **E-Money** is live; its landing is two buttons, *Join Room* / *Create Room* — every real screen needs a room to exist | Screenshot + page text at 375×812, 2026-09-16 | `https://www.emoney.club/` |
| G14 | E-Money's real features, from the component tree: room by code, player cards, pay / request rent, buy properties from the bank, make offers (trades), manage properties, custom P2P transfers, a Free Parking pot, a dice loader, an **install-app** button and `/install` route; backend is Go + Gin with a gorilla WebSocket per room (`GET /v1/ws/room/:code`) | `ls frontend/components/*`; `find frontend/app -type d` → `install`, `room/[code]`, `join`, `my-rooms`, `create`, `help` | `~/Projects/emoney/frontend/components/`, `backend/README.md` |
| G15 | E-Money's origin story is written down: five hours into a game the bank ran out of bills — *"we had so much money in game that we forced a bank run"* | Read 2026-09-16 | `~/Projects/emoney/frontend/README.md` |
| G16 | **Bocas Adventures** is live; **there is no local repo** (`find ~/Projects -maxdepth 3 -iname '*bocas*'` → nothing; `grep -rl bocasadventures ~/Projects/*/package.json` → nothing). A blue-and-yellow marketing site: a hero, six destination cards (Isla Colón, Red Frog Beach, Starfish Beach, Isla Bastimentos, Bocas Town, Dolphin Bay), a newsletter box, three testimonials with first-name-and-initial attributions, a packages CTA | Screenshot + page text at 375×812, 2026-09-16 | `https://bocasadventures.com/` |
| G17 | The site's motion is three small things: `reveal.ts` (IntersectionObserver, adds `.in`, early-returns under reduced motion), `wall.ts` (rAF glow), and `ClientRouter` page fades; startup scripts are re-armed on `astro:page-load` and a `<noscript>` block keeps `[data-reveal]` visible | Read 2026-09-16 | `src/lib/reveal.ts`; `src/layouts/Base.astro:63-77` |
| G18 | `transition:name` / `transition:persist` are typed in Astro 7.3.2 | `grep -rln "transition:name" node_modules/astro/dist` → `dist/types/public/elements.d.ts` | node_modules, 2026-09-16 |
| G19 | `astro:assets` `<Image>` is available and **unused**: `sharp` 0.35.4 is installed (transitively); `grep -rn "astro:assets" src` → nothing; `src/assets/` does not exist | `node -p require('./node_modules/sharp/package.json').version` → 0.35.4; `node_modules/astro/components/Image.astro` | node_modules, `grep`, `ls` |
| G20 | **CSS scroll-driven animations** (`animation-timeline`): Chrome 115+, Safari 26+, Firefox *preview only*. **View transitions (single-document)**: Chrome 111+, Safari 18+ / iOS 18+, Firefox 144+; 90.2 % global usage | MDN browser-compat-data `css/properties/animation-timeline.json` and caniuse `data.json` (`updated` 1787601763), both fetched 2026-09-16 | scratchpad `bcd-animation-timeline.json`, `caniuse-data.json` |
| G21 | **House precedent, and its lesson.** EZHomesteading's `homepage-scroll-story` — a pinned, frame-scrubbed scroll story on Blender renders — has been **HELD since 2026-08-11** and was archived 2026-08-21. It stalled on *content* (missing reference masters, one still of five), never on scroll code | Banner read 2026-09-16 | `~/Projects/archive/ezhomesteading/homepage-scroll-story/DESIGN.md` |
| G22 | Repo state: `main` at `5b64d57` (~~—~~ **corrected later the same day:** `269d4aa` after item 8 merged; `PLAN.md` §0 wins); branches `astro-rebuild`, `item6-survey`, `item7-cutover`, `item8-registry-pin`, `setup-scratch`; three live worktrees under `.claude/worktrees/`; `.gitignore` is modified in Zach's uncommitted set; item 7 is ~~`HELD` on Zach's deploy~~ — **corrected later the same day:** another session closed it as `DONE — HANDOFF 13` while this was being scoped; the site is live on the Worker. ~~**next free `HANDOFF` step is 13**~~ — 13 was taken by that session; this scoping is step **14**. Next board row is 10 | `git worktree list`, `git status --short`, `HANDOFF.md:1201`, `PASSOFF.md:39` | git, 2026-09-16 |
| G23 | The head `description` still reads *"…my programming portfolio as well as my LeetCode blog page"* | `src/site.ts:8-9` | read 2026-09-16 |
| G24 | Context7 is not available in this session; Astro facts above come from `node_modules` | `ToolSearch` → *"No matching deferred tools found"* | 2026-09-16 |

---

## 2. What this is, and what it is not

**What this is.** Each project gets a *story*: a short run of App Store-style frames — an
eyebrow, a headline, a sub-line and a phone showing that aspect of the product — tied together by
one continuous line, reached from the project's card on the home page. Plus the copy Zach called
plain: the hero, the card blurbs and the head description, re-picked with him (G2).

**What it is not.** These stay out, whoever asks, until a dated supersession says otherwise:

- **A change to the palette.** *"I'm happy with the color palette"* — D3, DIAL-1 and DIAL-9 stand.
- **Any edit to `~/Projects/furlough/site` or `~/Projects/furlough/design`.** Read-only reference.
- **A light theme, a CMS, video, WebGL, Blender renders, or an animation library.** The site's
  motion is three small scripts (G17) and stays that way; G21 is the cautionary tale.
- **Invented screens.** No mock UI drawn in CSS, no AI-generated "screenshots". Every phone shows a
  capture of the real product, or the frame is cut (hazard H2).
- **Claims the products do not back.** Furlough's own listing rule — nothing that is *"only on
  the board"* — applies here (`LISTING.md`, "What it deliberately does not say"), and G12's
  rules apply to every sentence about EZHomesteading on this site too.
- **Bocas's testimonials.** Three first-name-and-initial quotes on a site with no repo (G16) are
  not repeated here.
- **The blog, the survey, the footer line, the About seam, RSS, per-page OG images.** All reserved
  or settled elsewhere (`astro-rebuild/PLAN.md` §4).
- **Restoring, deleting or staging anything in Zach's uncommitted set** — `.gitignore` included.

---

## 3. Options

Each option carries its recommendation and the strongest argument against it. Nothing here is
decided.

### A — Where the story opens

| | Option | For | Strongest argument against |
|---|---|---|---|
| **A1, recommended** | **A page per project at `/projects/<slug>`** — the seam the rebuild reserved (G4). The card links to it; the card's title carries `transition:name` so it morphs into the page's `h1` under `ClientRouter` (G18, D4). The page keeps its own *Go to site ↗*. | The URL is shareable and crawlable; the home page stays a static list; D4 was wired for exactly this and has never had a second page to fade to. | One more click before the real product. Mitigation: the card keeps a small *Site ↗* beside its title. **This partially supersedes DIAL-8** (one link per card) — the card gets two targets again, both live this time; the supersession is recorded in `astro-rebuild/DESIGN.md` §6 if ratified. |
| A2 | An overlay sheet on the home page | No navigation; feels like a native "peek". | Scroll-trapping inside a modal, focus management, URL state, `Escape`, and all of it is client JS on the one page that is meant to be lightest. Worst on phones. |
| A3 | Inline expansion under the grid | Nothing leaves the page. | Layout jump; the other cards vanish below the fold; on a 375 px screen the expansion is the whole viewport. |

### B — How the story scrolls, and what "rotating" means

| | Option | For | Strongest argument against |
|---|---|---|---|
| **B1, recommended** | **Vertical scroll, sticky phone.** Desktop: two columns; the phone sticks in one while the frames (eyebrow / headline / sub) scroll past in the other. As each frame enters, its screen cross-fades in on the phone and the phone's tilt sweeps one step along the arc (`--ry` 18° → −18° across the frames, as the ten devices do in the panorama — **this is the "rotating"**). The line runs down the gap between the columns through a dot at each frame and draws itself as far as the reader has scrolled. Phone (≤ 640 px): the device sticks at the top at ~40 vh, the frames scroll under it, the line runs the left gutter. | It is literally what was asked: *"as you scroll it changes to another aspect … along the line."* Vertical scroll is what a mouse wheel, a trackpad and a thumb all already do. Mechanism is the house one — `IntersectionObserver` marks the active frame (G17), CSS does the fade and tilt. | A sticky phone at the top of a 375×812 viewport leaves ~450 px for copy, so each frame's copy must fit that or the reader sees the phone and one line at a time. Dial 4 sizes it. |
| B2 | **Horizontal panorama** — a `scroll-snap` strip exactly like the image, devices tilted along the arc, the line drawn across all frames. | Closest to the reference. On a phone it is a natural swipe carousel. | On desktop a wheel does not scroll sideways without JS remapping, and remapped wheels feel wrong; keyboard and screen-reader order fight the visual order; the line and the tilt only read when several frames are visible at once, which a 375 px screen never is. |
| B3 | **A rotating carousel** with dots, arrows and auto-advance | Familiar. | Auto-advancing carousels are the pattern users learn to ignore; frames 2–N are seen by whoever clicks, and the line has nothing to draw against. |

**Progressive enhancement inside B1.** Baseline: the line draws to the active frame's dot in steps
(IO only, no scroll listener). Enhancement: `@supports (animation-timeline: scroll())` draws it
continuously (Chrome 115+, Safari 26+; Firefox gets the stepped baseline — G20). Reduced motion:
no tilt sweep, no draw animation, instant swaps — the same three-layer rule Phase 1 proved
(`HANDOFF.md` step 4, proof 3).

### C — The line's colour

| | Option | For | Strongest argument against |
|---|---|---|---|
| **C1, recommended** | **The site's accent**: `--accent` → `--accent-2` → `--accent-glint` (teal → mint → near-white), the same three stops the sand stream uses, in this palette | The palette is settled and Zach is happy with it (§2). Three tokens already exist for exactly this shape of gradient (`global.css:24-26`). | It will not be *red*. If the red is the point — the warmth against the dark — then the palette decision is being reopened, and that is a different, bigger question. |
| C2 | Literally ember/amber, Furlough's stops | Matches the picture. | Reintroduces the hue D3 deliberately moved away from, on the one element that runs the length of every story page. |

### D — What the phones show

| | Option | For | Strongest argument against |
|---|---|---|---|
| **D1, recommended** | **Real captures** of each product at phone size (390×844 CSS px at 2×), run through `astro:assets` (G19) so they ship as sized WebP/AVIF with width and height set. Furlough's ten exist already (G7). EZHomesteading: the live web app at phone width (G9), *or* the Expo app in the simulator — Zach's call, the simulator needs a build. E-Money: needs a room (G13) — either Zach opens one and screenshots his phone, or a throwaway room is created on the live site (a write to his production data — asked, not assumed). Bocas: the live site (G16). | Honest; the product is the content. `sharp` is already installed so no dependency is added. | Some screens need state a visitor cannot reach — an EZH basket, an order chat, an E-Money mid-game. Those frames are either supplied by Zach from his own device or cut. **Content is what stalled G21; this is the hazard, not the code.** |
| D2 | CSS mock screens like `board.html`'s placeholders | No captures needed. | They are fake product UI on a portfolio whose pitch is that the products are real. |
| D3 | Generated imagery | — | Same objection, worse. Out (§2). |

### E — Which projects

| | Option | For | Strongest argument against |
|---|---|---|---|
| **E1, recommended** | **Add Furlough as a fourth card, first.** It is a shipped App Store product as of 2026-09-15 with a Mac companion, ten real screens and ten frames of copy in Zach's own words (G7) — the strongest thing Zach has shipped, and not on the page as of 2026-09-16. | The story is almost free: port five of the ten frames verbatim, screens included. It also makes the hero claim *"all live"* true of four products. | The portfolio then leads with the thing whose visual language the portfolio borrowed (D3's counter-argument: "too close and the site reads as Furlough"). Mitigation: the teal line and the teal glass are what frame it; the Furlough screens are the only warm thing on the page, which reads as *the product*, not *the site*. |
| E2 | Keep the three | No change to what was decided 2026-09-15 | The best work stays off the page. |
| E3 | **Bocas: keep, last** (recommended) / demote to a plain card with no story / drop | Its story is thin (a static guide, G16) but it is live and it is a third stack. Keeping it last with a 3-frame story costs little. | A blue-and-yellow site inside a dark teal frame is the one project that will look *off* on the phone; Dial 6 lets its screens sit on a darker card. |

### F — The copy (R7)

Every word a visitor reads is re-picked *with* Zach, never silently. Appendix A drafted the hero in three
registers, the four card blurbs in each register, and one project's frames in each register as
the sample. The rest were drafted in the chosen register for GATE 2 (§7), the way DIAL-2 was
handled. Furlough's frames are ported from `board.html` verbatim —
they are already Zach's words.

### G — The card itself

| | Option | For | Strongest argument against |
|---|---|---|---|
| **G1, recommended** | Each card carries a **small tilted phone thumbnail** of its first screen beside the title | The home page has no image at all (G3) and that, more than the words, is what reads as plain. The thumbnail is the same `<Image>` at a smaller size, so it costs one more variant, not one more capture. | Four phones on the home page is four images on the page that shipped with zero; dial 7 caps the weight. |
| G2 | Text-only cards, as now | Nothing to load. | The page stays plain above the fold. |

---

## 4. Dials

Every number the design leaves open, each with a recommended default, destined for
`src/lib/projects.ts` or a CSS custom property rather than a constant hardcoded twice.

| # | Dial | Recommended default | Why it is a real question |
|---|---|---|---|
| S-1 | Frames per project | **5** (Furlough: 5 of its 10; Bocas: 3) | Fewer than 4 and the line has nothing to connect; more than 6 and the reader stops scrolling before the CTA. |
| S-2 | Phone size on the story page | **350×672** at ≥ 860 px (Furlough's `.phone`, G8); **~40 vh** tall below 640 px | The mobile size decides how much copy is visible per frame (B1's counter-argument). |
| S-3 | Tilt sweep | **±12°** across the frames (the panorama uses ±18° over ten frames; five frames at ±18° is a lurch per step) | Too little and "rotating" is invisible; too much and the screen is unreadable at the ends. |
| S-4 | Cross-fade duration | **0.45 s** on `--ease` | Slower reads as loading; faster reads as a cut. |
| S-5 | Capture viewport | **390×844 CSS px at 2×** (780×1688) | Matches the iPhone class the phone frame is drawn as; larger is wasted bytes. |
| S-6 | Screen backing for light-themed products (Bocas) | The screen sits on `--ground` with a 1 px `--edge` inset, no glow | Whether a white page inside a dark phone needs a dimming layer is a taste call — seen, not reasoned. |
| S-7 | Home-page image budget | **≤ 120 KB** total for the four thumbnails (WebP, ~180 px wide, 2×) | The page shipped with zero images; this is the line it must not blow through. |
| S-8 | Line stroke | **3 px sharp over a 40 px blurred halo at 35 % opacity** (the panorama: 5 px over 46 px at 55 %, at 13200 px wide) | Scales with page width; the halo is what makes it a *stream* rather than a rule. |
| S-9 | Story page CTA | *Go to site ↗* pinned under the phone on desktop, after the last frame on mobile | Where the visitor leaves for the product decides whether the story is a detour or a runway. |

---

## 5. Hazards this work walks into

- **H1 — The screens are the content, and none exist yet except Furlough's.** E-Money's real
  screens need a room (G13); EZHomesteading's deeper screens need a signed-in account and an
  order; Bocas has no repo (G16). This is precisely where G21 stalled. The plan must capture the
  screens in its *first* phase and cut any frame whose screen cannot be got, rather than build
  the scroll first and wait on images.
- **H2 — Honesty on a portfolio.** A false claim compiles. G12's rules for EZH copy, Furlough's
  own listing rule, and no fabricated screens (§2). Every frame's headline is checked against the
  product before it ships, and the check is written into the done-when.
- **H3 — Image weight on a page that has none.** Four stories × five screens at 2× is several MB
  raw; `astro:assets` must produce WebP/AVIF at sized widths, `loading="lazy"` on every frame past
  the first, and the home page holds to S-7. A green build says nothing about this; the proof is
  `du` on `dist/` and the network panel.
- **H4 — `ClientRouter` plus sticky plus observers.** Scripts must arm on `astro:page-load` and
  disconnect on `astro:before-swap`, or every visit to a story leaves an observer behind
  (`Base.astro:63-77` is the pattern; `startWall`'s once-per-element guard is the precedent).
- **H5 — Reduced motion, three layers.** Tilt, cross-fade and line-draw each need a CSS-only
  fallback so content is visible with no script and no motion; the `[data-reveal]` `<noscript>`
  rule is the model.
- **H6 — The mobile layout is the real design.** A sticky 40 vh phone on a 375 px screen leaves
  ~450 px for a frame's copy. If the copy does not fit, the phone must shrink or move behind the
  copy. Decide on a real phone, not in a desktop window.
- **H7 — `@/*` resolves to the repo root** (`HANDOFF.md` invariant 5), so image imports are
  `@/src/assets/projects/<slug>/01.png`, not `@/assets/…`.
- **H8 — Three worktrees are live and `.gitignore` is Zach's.** This effort branches from `main`
  (`5b64d57`) into its own worktree; the git block carries its own `cd` (`CLAUDE.md` rule 7);
  `.gitignore` is never in the `git add` block.
- **H9 — DIAL-8 is partially superseded by A1.** The card gets a story link *and* a site link.
  Both live; the supersession is recorded under DIAL-8 in `astro-rebuild/DESIGN.md` §6, dated.
- **H10 — Firefox gets the stepped line.** `animation-timeline` is preview-only there (G20). The
  baseline must look finished, not degraded.
- **H11 — Creating an E-Money room on the live site writes to Zach's production data.** Not done
  without his yes; Q5.

---

## 6. Decisions — D1 to D8

GATE 1 was asked in chat on 2026-09-16, the same turn §1–§5 were finished, and answered by Zach
in one message the same day: *"all recommended, warm register, web app screens, I'll open the
room. delete bocas its a dead project."* The answers, recorded against the questions as asked:

| # | Question | Answer, 2026-09-16 | Decision |
|---|---|---|---|
| Q1 | Where a story opens | A1 — a page per project | D1 |
| Q2 | How it scrolls; what "rotating" means | B1 — vertical, sticky phone; the tilt sweep | D2 |
| Q3 | The line's colour | C1 — the site's teal | D3 |
| Q4 | Furlough first? Bocas? | Furlough first, yes. **Bocas: delete — "a dead project"** (not "keep, last" as recommended) | D5 |
| Q5 | Screens | EZHomesteading from the web app at phone width; E-Money from a room Zach opens | D4 |
| Q6 | Register | **Warm** | D6 |
| Q7 | Thumbnails on the cards | Yes | D7 |
| Q8 | Frames per project | 5; Furlough trimmed from 10 | D8 |

**GATE 2, asked and answered 2026-09-16, one message each way** — *"approved, join the room
yourself, fallbacks are fine, copy good, emoney."* Recorded: the plan is approved as written
(`PLAN.md`, all four phases authorized); E-Money's screens come from a room Zach opens, which a
session may **join as one player** — the code is owed at P2's start; EZHomesteading's story uses
the **public fallbacks** 3′, 4′, 5′ of §7.4, and frames 3, 4, 5 (basket, order, route) are
reserved with their copy kept below; §7 is approved verbatim; the slug is `emoney`.

**From here the design is frozen.** It changes by amendment — a new dated `D<n>`, or an
`As built:` note under the decision it deviates from — never by editing a decision in place.

### D1 — A story is a page: `/projects/<slug>`

**Decision.** Each project's story is a prerendered page at `/projects/<slug>`, built from one
data module (`src/lib/projects.ts`) that the home page reads too. The card on the home page
links to it; the card's title and the page's `h1` share a `transition:name`, so under
`ClientRouter` (rebuild D4) the title morphs into the heading. The card also keeps a smaller
*Site ↗* to the real domain, and the story page repeats that link under the phone.

**Defense.** It is the seam the rebuild reserved for exactly this (§1 G4). A page has a URL that
can be sent, a title, a description and a canonical, all for free from `Base.astro`. The home
page stays a static list of three cards with no scroll-trapping or modal state; the only client
script on it is the reveal. And D4 of the rebuild was wired 2026-09-15 with nothing to fade to —
this is the first navigation on the site that a visitor will actually take.

**Strongest argument against, and why it lost.** One more click before the product. It lost
because the click is the point — the story is what makes the visitor *want* the product — and
because the site link never leaves the card.

**Supersedes.** Rebuild DIAL-8, partially — recorded as S1 in
`docs/incomplete/astro-rebuild/DESIGN.md` §6, which says which half dies.

Ratified 2026-09-16.

**As built: the CTA label is per project, and Furlough's is not "Go to site".** 2026-09-16, P1.
This decision names the button *Go to site ↗* for all three, but Furlough's link is an App Store
page (`apps.apple.com/app/id6810006594`, 200 → `/us/app/furlough/id6810006594`, curl 2026-09-16),
not a site. Asked in chat and answered the same day: **"On the App Store ↗"**. `linkLabel` is
therefore a field on `Project` rather than a constant, and EZHomesteading and E-Money still read
*Go to site ↗* when P2 adds them.

### D2 — Vertical scroll, a sticky phone, and the tilt sweep is the "rotating"

**Decision.** On screens ≥ 860 px the story is two columns: the phone sticks in one while the
frames — eyebrow, headline, sub-line — scroll past in the other. Entering a frame cross-fades
that frame's screen onto the phone and steps the phone's tilt one notch along an arc, from
`+S-3` on the first frame to `−S-3` on the last, the way the ten devices turn across Furlough's
panorama. The line runs down the gap between the columns through a dot at each frame and is
drawn as far as the reader has scrolled. Below 640 px the phone sticks at the top at S-2's
mobile height and the frames scroll under it; the line runs the left gutter.

**Mechanism.** Baseline: one `IntersectionObserver` over the frames (the house pattern,
`src/lib/reveal.ts`) sets the active index on the story root; CSS does everything visible from
that one attribute — which screen is opaque, the phone's `--ry`, the line's drawn length in
steps. Enhancement: under `@supports (animation-timeline: scroll())` the line's
`stroke-dashoffset` follows scroll continuously (Chrome 115+, Safari 26+; Firefox keeps the
stepped baseline, §1 G20). Reduced motion: no tilt, no draw animation, instant swaps — the
three-layer rule Phase 1 of the rebuild proved (`HANDOFF.md` step 4, proof 3). No JS: the phone
shows the first frame's screen and every frame's copy is readable; frames 2–5's screens are the
one thing a scriptless visitor does not see, and that is accepted (PLAN.md BD-5).

**Defense.** It is literally what was asked — *"as you scroll it changes to another aspect …
along the line."* Vertical is the axis every input already scrolls. Nothing new is added to
the site's motion budget: an observer, some CSS, one optional `@supports` block.

**Strongest argument against, and why it lost.** On a 375×812 phone a sticky device leaves
about 450 px for a frame's copy (§5 H6). It lost to the alternatives because a horizontal strip
is worse on desktop (a wheel does not scroll sideways) and a click carousel hides frames 2–5;
the mobile room is handled by S-2 and by keeping each frame's copy to a headline and two lines.

Ratified 2026-09-16. Builds on rebuild D4; supersedes nothing.

**As built, 2026-09-16, P1 — six deviations.** The first four are mechanism only, invisible to a
reader. **Numbers 4 and 6 are not**: they were added by the runtime pass, and each is a thing a
reader would have seen. The heading used to end "none of them to what a reader sees" — that was
true of what a green build could show, which is exactly the claim the pass was there to test.

1. **The stacked layout begins at 860 px, not 640 px.** This decision names ≥ 860 px for two
   columns and < 640 px for the stacked phone, and says nothing about the band between. There is
   no sensible third layout for it: at 700 px wide the columns have collapsed, and a 672 px phone
   sticking above its own copy leaves nothing to read. So the one breakpoint is 860 px, and S-2's
   mobile height (40 vh) applies from there down.
2. **The observer's threshold is 0, not the plan's 0.5.** The active frame is "the one nearest
   the middle", which is a zero-height root band (`rootMargin: -50% 0px -50% 0px`). Against a
   zero-height root the intersection ratio never approaches 0.5, so a 0.5 threshold would never
   fire. The rootMargin is what carries the intent; the threshold had to give way.
3. **The dots are HTML elements, not SVG `<circle>`s.** The line's SVG is stretched with
   `preserveAspectRatio="none"` so one path can span a column of unknown height. A filled circle
   inside a non-uniformly scaled SVG renders as an ellipse, and nothing in CSS can undo a scale
   it cannot read. The path stays one `<path>`; the five dots are absolutely positioned
   elements on the same rail.
4. **`position` belongs to the layout rules, not to the phone's recipe.** Added 2026-09-16 by
   P1's runtime pass (`HANDOFF.md` step 17), which is when this decision was first *seen* rather
   than built. The phone's look is written in one block after the two layout rules, and that block
   declared `position: relative` — same specificity, later in source, so **it won the cascade at
   every width**. The consequences were the two things this decision is most about. Stacked, the
   phone was `relative` instead of `sticky`, so **it did not stick at all**: measured at 375×812,
   its top ran 224 → **−781** → **−1790** across frames 1, 3 and 5. That is the same symptom
   `afab8a7` was committed to fix; that fix's reasoning about grid areas was correct and simply
   could never take effect, which is why "built green but never seen" is not a small gap. In
   columns the phone was `relative` while still inheriting the stacked rule's `top: 96px`, so it
   hung 96 px below its own flex slot and **the CTA that is supposed to sit under it ended up
   under it in the other sense** — covered by the phone's lower third. The rule that replaces it:
   the phone's `position` is stated once per layout — `sticky` stacked, `relative` in columns,
   both positioned so `.screen`'s `inset: 0` still resolves against the phone — and `top` is reset
   in the same breath as `position`. The recipe block carries no `position` at all, and says why.

5. **The script writes one custom property the plan did not list.** Plan step 7 has it write
   `root.dataset.active` and `--progress`. CSS cannot read a data attribute as a number, so it
   also writes `--active`. `data-active` is kept and earns its place independently: its presence
   is how the stylesheet distinguishes a scripted visit from a scriptless one, which is what
   keeps BD-5's "every frame's copy is readable" true rather than lucky.

6. **The first frame's copy offset is derived differently from the other four — PLAN.md BD-11.**
   Added 2026-09-16 by the runtime pass. This decision's stacked half says the frames scroll under
   a phone stuck at the top, and the offset that keeps a frame's copy clear of it assumes the
   phone has already reached that stuck position. Frame 1 activates before it has: at 375×812 it
   crosses the middle of the viewport at scrollY 261 and the phone does not pin until 341, so its
   eyebrow and headline were sitting **behind** the phone (−60.1 px and −35.8 px of clearance).
   §3 had reserved a number for "lower the mobile phone height if H6 fails", and the measurement
   killed that remedy: unpinned, the phone's bottom and the copy move down together, so the
   shortfall is −56.28 px at *every* phone height. The first frame gets `--phone-h + 24px`
   instead — the clearance for a phone that shares its top edge. Full working in `PLAN.md` BD-11.

### D3 — The line is the site's accent

**Decision.** The line's gradient is `--accent` → `--accent-2` → `--accent-glint` — the three
stops the sand stream uses, in this palette — with a blurred halo under a sharp line at S-8.
No new colour literal anywhere; the rebuild's rule that `--accent` and `--accent-2` are the only
two hex values in `src/` holds.

**Defense.** The palette is settled (rebuild D3, DIAL-1, DIAL-9) and Zach is happy with it. The
three tokens already exist at `src/styles/global.css:24-26` for exactly this shape of gradient.

**Strongest argument against, and why it lost.** It is not red, and the warmth of the red
against the dark is part of what the panorama has. It lost because making it red reopens the
palette on the one element that runs the length of every story page; Furlough's own screens on
the phone carry the warmth instead, and read as *the product*, not the site.

Ratified 2026-09-16. Explicitly **not** a supersession of rebuild D3 / DIAL-1 / DIAL-9.

**As built: the halo is a filter on the line, not a second line under it.** 2026-09-16, P1. S-8
asks for "3 px sharp over a 40 px halo at 35 %", which reads as two strokes; it is one `<path>`
with `filter: drop-shadow(0 0 20px color-mix(in srgb, var(--accent) 35%, transparent))` on the
SVG element. Two reasons: the plan's step 6 asks for exactly one path, and a CSS filter on the
element resolves in CSS pixels, so the halo stays round under the `preserveAspectRatio="none"`
y-stretch that lets the line span a column of unknown height. A second SVG path would have been
stretched into an oval. **No new colour literal**: the three stops are `var(--accent)`,
`var(--accent-2)` and `var(--accent-glint)`, and the halo `color-mix`es off `--accent`.

### D4 — Real captures only, through `astro:assets`

**Decision.** Every screen on a phone is a capture of the real product at 390×844 CSS px at 2×
(S-5), stored under `src/assets/projects/<slug>/`, rendered with `astro:assets` `<Image>` so it
ships sized, in WebP/AVIF, with `width` and `height` set. Furlough's five come from
`~/Projects/furlough/design/store/raw/` (frames 1, 2, 6, 8, 10 — copied out, never edited in
place). EZHomesteading's come from the live web app at phone width. E-Money's come from a room
Zach opens. **A frame whose screen cannot be captured is cut, never mocked.**

**Defense.** The product is the content, and the pitch of the site is that the products are
real. `sharp` is already installed (§1 G19), so the pipeline adds no dependency.

**Strongest argument against, and why it lost.** Some screens need state a visitor cannot
reach — a basket, an order chat, a mid-game room. It lost because the alternative is fake UI on
a portfolio; the stateful screens are supplied by Zach or replaced by a public screen, and the
choice per frame is PLAN.md's first job (§5 H1).

Ratified 2026-09-16.

**As built: "through `astro:assets`" needed a config change to be true.** 2026-09-16, P1. The
Cloudflare adapter's default image service does no build-time transform, so `<Image>` shipped the
source PNGs untouched at 172–978 KB. `imageService: 'compile'` (PLAN.md BD-10) is what makes this
decision's "sized WebP/AVIF, with `width` and `height` set" actually happen. Furlough's five are
copied byte-identical out of `design/store/raw/` — `shasum -a 256` matched on all five pairs,
and all ten source PNGs are still in place.

**Verify at build, discharged.** §7.3's check on frame 3: `raw/06.png` shows **`60 MIN`** under
`DAILY BUDGET` with the slider at the 60 stop. The headline's *sixty* stands; the panorama's
"fifty-five" is the stale reading, exactly as §7.3 predicted.

### D5 — Furlough joins first; Bocas Adventures leaves the site

**Decision.** The cards are **Furlough, EZHomesteading, E-Money**, in that order. Bocas
Adventures is removed from the site entirely — card, blurb, link — on Zach's word
2026-09-16: *"delete bocas its a dead project."* No Bocas story is built and none is reserved.

**Defense.** Furlough is a shipped App Store product as of 2026-09-15 with a Mac companion, ten
real screens and ten frames of copy in Zach's own words (§1 G7) — the strongest thing he has
shipped, and it was not on the page. Bocas has no repo (§1 G16) and its owner calls it dead;
a dead project on a page whose hero says *"all three are live"* would make the hero false.

**Strongest argument against, and why it lost.** The portfolio then leads with the product
whose visual language the portfolio borrowed (rebuild D3's counter-argument). It lost because
the teal line, the teal glass and the teal wall are what frame every screen; Furlough's warm
screens are the one warm thing on the page and read as its product. **The removal costs no
URL:** no `/projects/bocas*` route ever existed (§1 G4), so nothing indexed breaks.

**Supersedes.** Rebuild §4.3 (the three project cards) — recorded as S2 in
`docs/incomplete/astro-rebuild/DESIGN.md` §6.

Ratified 2026-09-16.

### D6 — Every word is warm, and the words are §7

**Decision.** The hero, the head description, the three card blurbs and the ten new frames
(EZHomesteading's five, E-Money's five) are in the warm register — the one DIAL-2 and DIAL-4
already chose for the survey — and they are the words in §7, final unless amended.
Furlough's five frames are ported **verbatim** from `board.html`; they are already Zach's words
and no register is applied to them.

**Defense.** One voice across the site. The words were offered in three registers with the
scope (Appendix A) and Zach picked warm; the rest were drafted in that register for GATE 2, the
way DIAL-2's copy was drafted in Phase 3 and shown before it shipped.

**Strongest argument against, and why it lost.** Warm runs long, and the mobile frame has room
for a headline and two lines (H6). It lost because the constraint is applied to the words
themselves: every sub-line in §7 is at most two sentences.

**Supersedes.** Rebuild §4.4 (the hero copy, verbatim) — recorded as S3 in
`docs/incomplete/astro-rebuild/DESIGN.md` §6.

Ratified 2026-09-16.

### D7 — Each card carries a phone thumbnail

**Decision.** Each home-page card shows its story's first screen as a small tilted phone beside
the title, rendered from the same `<Image>` at a thumbnail width, under the S-7 weight budget.

**Defense.** The home page ships with no image at all (§1 G3), and that, more than the words,
is what read as plain. The thumbnail is a second size of a capture that already exists.

**Strongest argument against, and why it lost.** Three images on a page that had none. It lost
to a byte budget rather than to an argument: S-7 caps the three thumbnails at 120 KB together,
measured in `dist/`.

Ratified 2026-09-16.

### D8 — Five frames per project

**Decision.** Five frames each. Furlough uses frames 1, 2, 6, 8 and 10 of its ten — The rule,
The Anchor, Budgets, The delay, The shield. EZHomesteading and E-Money get the five in §7.

**Defense.** Fewer than four and the line has nothing to connect; more than six and the reader
stops before the CTA. Furlough's ten were written for a store page that is scrolled sideways
by someone who has already decided to look; five is what a visitor who has not decided will
give.

**Strongest argument against, and why it lost.** Furlough's other five are good and already
made. They lost to length; they are reserved (PLAN.md §4) and can be added by a one-line edit
to the data module if the story feels short on a real phone.

Ratified 2026-09-16.

---

## 7. The copy — final, warm, 2026-09-16

Every string a visitor reads on the affected surfaces. Anything not here is unchanged (§8).
Each product claim traces to §1; the ones marked **verify at build** are checked against the
product by the phase that ships them (§5 H2), and a claim that fails the check is cut, not
softened.

### 7.1 Hero and head description

Hero headline: **Hi, I'm Zach. I build things people actually use.**

Hero lede: **An app blocker with no unblock button. A marketplace for backyard growers. A
Monopoly bank that never runs dry. All three are live, and all three are below.**

Buttons: unchanged — *Explore Projects*, *Blog*.

`site.description` (`src/site.ts`): **Hi, I'm Zach. Apps people actually use, and my LeetCode
write-ups.**

### 7.2 The three cards

| Slug | Title | Tech chips | Blurb | Site link |
|---|---|---|---|---|
| `furlough` | Furlough | Swift, iOS, macOS | The app blocker with no unblock button. Loosening a rule waits a day; the Anchor waits for a tag you left at home. On the App Store since September 2026, with a Mac app that locks with it. | `https://apps.apple.com/app/id6810006594` |
| `ezhomesteading` | EZHomesteading | Next.js, Expo, Go | Food from down the road: a backyard grower drops off surplus, a neighborhood stand sells it, you pick it up on your route. Web and native, on a Go backend. | `https://ezhomesteading.com` |
| `emoney` | E-Money | Go, WebSocket, Next.js | A Monopoly bank that never runs out of bills — built after a real bank run five hours into a game. One room code, every phone at the table, every payment live. | `https://emoney.club` |

The tech chips for EZHomesteading and E-Money are the existing ones (`src/pages/index.astro:12,18`);
Furlough's are new. "Web and native" for EZHomesteading is a stack claim, not a distribution
one — the native app is not on a store (§1 G11), and no sentence on this site says it is.

### 7.3 Furlough — five frames, verbatim from `board.html`

| # | Eyebrow | Headline | Sub-line | Screen |
|---|---|---|---|---|
| 1 | The rule | No unblock button. | Pick the apps that eat your time. Furlough shields them when the time is gone. | `raw/01.png` |
| 2 | The Anchor | Locked till you tap the tag. | One tap locks. Only the NFC tag you paired releases it. Leave the tag at home. | `raw/02.png` |
| 3 | Budgets | Sixty minutes. Then it's gone. | Give every app a daily budget. Spend it whenever you like. | `raw/06.png` |
| 4 | The delay | Loosening waits a day. | Tightening is instant. Loosening waits out the delay you set. You can cancel it while it waits. | `raw/08.png` |
| 5 | The shield | Nothing to tap but Close. | The block screen says which app is closed and what would open it. That is the whole conversation. | `raw/10.png` |

**Verify at build:** frame 3's headline says *sixty*; the panorama rendered 2026-09-14 said
*fifty-five*. `board.html` is the current source and wins, but the build checks that `raw/06.png`
shows a budget the headline does not contradict.

### 7.4 EZHomesteading — five frames, warm

| # | Eyebrow | Headline | Sub-line | Screen | Needs |
|---|---|---|---|---|---|
| 1 | The idea | Sold by the hands that grew it. | Someone near you has more tomatoes than they can eat. A stand down the road sells them. You pick them up on the way home. | Home | public (have it, §1 G9) |
| 2 | The market | Set your area. See what's ripe. | A home base and how far you'll go; the feed shows the stands inside it before anything outside. | `/market` | public — **verify at build** that the feed or its area prompt renders signed out |
| 3 | The basket | Three stands, one checkout. | Fill one basket across sellers. Your card is held at checkout and charged only when the food is actually in your hands. | Basket with items | **Zach's account**; fallback frame 3′ below |
| 4 | The order | No "hey, still coming?" | Every step of an order is a button — propose, accept, ready, picked up — so nothing is ever lost in a message thread. | Order chat | **Zach's account, an order in flight**; fallback 4′ |
| 5 | The route | It plans the drive. | Three pickups become one route, in order, with the drive times worked out. | Pickup route | **Zach's account, multiple pickups**; fallback 5′ |

**GATE 2, 2026-09-16: Zach chose the fallbacks.** The EZHomesteading story ships as frames 1, 2, 3′, 4′, 5′; rows 3, 4 and 5 above are **reserved** (`PLAN.md` §4) with their copy kept for the day a screen exists:

| # | Eyebrow | Headline | Sub-line | Screen |
|---|---|---|---|---|
| 3′ | The listing | It says who grew it. | Every listing names the grower and the place. No warehouse, no truck, no distributor between you. | a public listing page (`/l/<id>`) |
| 4′ | The stand | A neighborhood stand. | One person who likes selling, one place to pick up, and whatever the growers around them dropped off. | a public store page |
| 5′ | The surplus | Got more than you can eat? | List it in a minute — a photo, a price, a pickup place — and let the stand do the selling. | the sell entry (`Got a surplus? Sell it`) — **verify at build** that it renders signed out |

Rules from `homepage-narrative.md` (§1 G12) hold on every line above: no *Producer* / *CO-OP*,
no money percentages, framing by absence only where it is true.

### 7.5 E-Money — five frames, warm

**GATE 2, 2026-09-16:** *"join the room yourself"* — a session may join the room Zach opens as one player, from the Browser pane, to capture these; the room code arrives from him at P2's start.

| # | Eyebrow | Headline | Sub-line | Screen | Needs |
|---|---|---|---|---|---|
| 1 | The room | One code. Every phone at the table. | Make a room, share the code, and everyone's balance is on everyone's screen — live, for the whole game. | the room with players | Zach's room |
| 2 | The bank | A bank that never runs out of bills. | Five hours into a real game the paper ran out and the bank collapsed. This one has no drawer to empty. | buy from the bank | Zach's room |
| 3 | Rent | Pay it, or ask for it. | Land on a property and pay in a tap. Own it and request the rent instead — they see it before they've finished groaning. | the pay / request drawer, open | Zach's room |
| 4 | Trades | Make an offer. | Put a number on someone else's property. Cash and the deed move the moment they accept. | the make-offer screen | Zach's room |
| 5 | Free parking | The pot in the middle. | Fines and taxes land in Free Parking, and whoever lands there takes the lot. | the Free Parking pot | Zach's room — **verify at build**: the rule the app actually implements (`components/navbar/free-parking.tsx`) |

Claims traced: room code and live updates → `backend/README.md` (`GET /v1/ws/room/:code`);
the bank run → `frontend/README.md`; pay / request → `pay.req.rent.component.tsx`,
`pay-req-toggle-switch.tsx`; offers → `components/players/make-offer/`; the bank →
`purchase-properties-bank.tsx`; Free Parking → `components/navbar/free-parking.tsx` (§1 G14).

---

## 8. Rules that survive unchanged

Listing what is *not* changing is how a build phase is stopped from helpfully rewriting it.

- **The palette.** `--accent #0FA79A`, `--accent-2 #7DE8D0`, the three `color-mix` derivatives,
  and the rule that those two are the only hex literals in `src/`. Rebuild D3, DIAL-1, DIAL-9.
- **`ClientRouter`, the wall, the reveal.** Rebuild D4 and the `astro:page-load` arming in
  `Base.astro:63-77`. The story script joins that pattern; it does not replace it.
- **No animation library, no framework on the static pages.** The survey island stays the only
  island (rebuild D5). The story is CSS plus one observer.
- **The footer line, the wordmark, the nav's three links, the button labels.** Rebuild §4.4.
- **`/blog`, `/blog/leetcode`, the 61 URLs, the redirect.** Untouched; rebuild §4.1, D10.
- **The survey, `/setup`, `/p/<id>`, `/api/profile`.** Untouched.
- **`@/*` resolves to the repo root** (`HANDOFF.md` invariant 5). Image imports are
  `@/src/assets/projects/…`.
- **`.gitignore`, `wrangler.jsonc`, `CLAUDE.md`.** Item 7's files and Zach's uncommitted set;
  this effort never stages them.
- **`~/Projects/furlough/site` and `~/Projects/furlough/design`.** Read-only. Copying five PNGs
  *out* of `design/store/raw/` is a read.
- **No deploy from a session.** Shipping is Zach running `bun run deploy`.

---

## 9. Supersession pointers

What this design changes elsewhere, so the next reader of *those* files finds it:

| This decision | Changes | Recorded at |
|---|---|---|
| D1 | Rebuild DIAL-8, partially | `docs/incomplete/astro-rebuild/DESIGN.md` §6 S1, 2026-09-16 |
| D5 | Rebuild §4.3, the three project cards | `docs/incomplete/astro-rebuild/DESIGN.md` §6 S2, 2026-09-16 |
| D6 | Rebuild §4.4, the hero copy and `site.description` | `docs/incomplete/astro-rebuild/DESIGN.md` §6 S3, 2026-09-16 |

Nothing here changes `HANDOFF.md`'s invariants. Invariant 3 (zero client JS) was already retired
by the rebuild; this effort adds one more small script under the same posture.

---

## Appendix A — The drafts offered at GATE 1 (historical)

Kept so the registers that lost are visible. The chosen words are §7; this appendix is not
edited again.

### A.1 Three registers, as offered

Three registers. Each line below is a real candidate, not a placeholder. Claims: *four live
products* assumes Q4 = yes; every product claim traces to §1.

### A.2 The hero — the three offered

**Plain**
> **Zach Short builds apps that ship.**
> Go on the server, Swift on the phone, Next.js and Expo in between. Four products, all live —
> pick one below and scroll.

**Warm**
> **Hi, I'm Zach. I build things people actually use.**
> An app blocker with no unblock button. A marketplace for backyard growers. A Monopoly bank
> that never runs dry. All four are live, and all four are below.

**Terse**
> **Four products. All live.**
> Swift, Go, Next.js, Expo. Scroll.

Buttons stay *Explore Projects* / *Blog* unless asked. The head description (G23) follows the
same register: plain *"Zachary Short — full-stack developer. Four live products and 61 LeetCode
write-ups."* · warm *"Hi, I'm Zach. Apps people actually use, and the LeetCode write-ups behind
them."* · terse *"Zach Short. Four products, 61 solutions."*

### A.3 The card blurbs, all three registers (Bocas included; removed by D5)

| Project | Plain | Warm | Terse |
|---|---|---|---|
| Furlough | An iOS app blocker with no unblock button. Rules loosen only after a delay set in advance; the Anchor lifts only for an NFC tag. On the App Store. | The app blocker with no unblock button. Loosening a rule waits a day; the Anchor waits for a tag you left at home. Shipped to the App Store September 2026, with a Mac app that locks with it. | No unblock button. App Store, September 2026. |
| EZHomesteading | A marketplace where backyard growers sell surplus through a neighborhood stand. Next.js on the web, Expo on the phone, Go underneath. | Food from down the road: a backyard grower drops off surplus, a neighborhood stand sells it, you pick it up on your route. Web and native, on a Go backend. | Backyard surplus, sold down the road. Next.js, Expo, Go. |
| E-Money | A real-time Monopoly bank. One room code, every phone at the table, every transfer live over WebSockets. | A Monopoly bank that never runs out of bills — built after a real bank run five hours into a game. One room code, every phone at the table, every payment live. | The Monopoly bank that never runs dry. Go, WebSockets, Next.js. |
| Bocas Adventures | A travel guide to Bocas del Toro, Panama: six destinations and a way to plan the trip. | A guide to the islands of Bocas del Toro, Panama — the beaches, the reefs, the six places to go — built to be read on a phone in a hammock. | Bocas del Toro, on a phone. |

### A.4 EZHomesteading's frames in three registers — the sample

Five frames; each is eyebrow / headline / sub. The screen each needs is named so H1 is visible.

| # | Screen needed | Plain | Warm | Terse |
|---|---|---|---|---|
| 1 | Home (have it, G9) | THE IDEA / **Food from down the road.** / Backyard growers list what they have. A neighborhood stand sells it. You pick it up. | THE IDEA / **Sold by the hands that grew it.** / Someone near you has more tomatoes than they can eat. A stand down the road sells them. You pick them up on the way home. | THE IDEA / **Down the road.** / Grown near you. Sold near you. |
| 2 | Market feed | THE MARKET / **What's ripe near you.** / Set a shopping area and the feed ranks the stands inside it, nearest first. | THE MARKET / **Set your area. See what's ripe.** / A home base and how far you'll go; the feed shows the stands inside it before anything outside. | THE MARKET / **Your area. What's ripe.** / Nearest first. |
| 3 | Basket | THE BASKET / **One basket, many stands.** / Buy from three sellers in one checkout; the card is authorized now and charged only when the order is fulfilled. | THE BASKET / **Three stands, one checkout.** / Fill one basket across sellers. Your card is held at checkout and charged only when the food is actually in your hands. | THE BASKET / **One checkout.** / Charged when fulfilled, not before. |
| 4 | Order chat | THE ORDER / **Buttons, not a chat box.** / Propose, accept, ready, picked up. Every step is a button, so an order cannot get lost in a thread. | THE ORDER / **No "hey, still coming?"** / Every step of an order is a button — propose, accept, ready, picked up — so nothing is ever lost in a message thread. | THE ORDER / **Buttons, not texts.** / Propose. Accept. Ready. Done. |
| 5 | Route / pickups | THE ROUTE / **Three stops, one route.** / Multi-stop pickups are sequenced automatically with travel times. | THE ROUTE / **It plans the drive.** / Three pickups become one route, in order, with the drive times worked out. | THE ROUTE / **One route.** / Stops in order, times worked out. |

**Frame lists for the rest** (copy drafted at GATE 2 in the chosen register):

- **Furlough, 5 of 10, verbatim from `board.html`:** The rule / The Anchor / Budgets / The delay /
  The shield — headlines *No unblock button.* · *Locked till you tap the tag.* · *Sixty minutes.
  Then it's gone.* · *Loosening waits a day.* · *Nothing to tap but Close.* Screens `raw/01, 02,
  06, 08, 10`.
- **E-Money, 5:** The room (a code, every phone) · The bank (never runs out — G15) · Rent (pay or
  request, live for everyone) · Properties (buy from the bank, make an offer) · The home screen
  (installs like an app — G14's `/install`, verify at build). Screens: all need a room (H11).
- **Bocas, 3:** The archipelago · Six places (the destination grid) · Plan the trip. Screens: the
  live site, all public.
