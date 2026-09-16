# Project stories — RUNTIME-PASS

What a person has to look at, because no gate here can. One entry per surface: **goal**, **where**,
**the right answer**. Started 2026-09-16 by P1; P2 and P3 append, P4 collates and closes.

A green `bun run build` in this repo means *it compiled and every content file imported* — nothing
more (`CLAUDE.md`, *Gates that lie*). Everything below is outside that.

Run against the worktree, not the primary tree. **`astro dev` does not work here** — corrected
2026-09-16 by P1's walk (`HANDOFF.md` step 17): the Cloudflare adapter's workerd dev runner loses
an SSR dep the moment Vite re-optimises. Serve the built output instead, which has no Vite in the
loop and is closer to production:

```bash
cd /Users/zachshort/Projects/portfolio/.claude/worktrees/item10-stories && bun run build
cd /Users/zachshort/Projects/portfolio/.claude/worktrees/item10-stories && bunx wrangler dev -c dist/server/wrangler.json --port 8788 --persist-to ./.wrangler/state
```

**`wrangler dev` serves `dist/`, so a rebuild orphans it** — `astro build` wipes `dist/` and the
running worker then 404s everything. Stop the server, rebuild, start it again; `lsof -nP
-iTCP:8788 -sTCP:LISTEN -t` finds a stale pid.

---

## P1 — `/projects/furlough`

**Status 2026-09-16: WALKED — all eight entries pass.** `HANDOFF.md` step 17. **Two real defects
were found by looking and fixed in the same session**, both in `src/components/ProjectStory.astro`
and neither visible to any gate:

1. **`.phone` never resolved to `position: sticky` at any width.** The phone recipe block declared
   `position: relative` *after* both layout rules, same specificity, so it won the cascade
   everywhere. Stacked, that meant **the phone did not stick at all** — it scrolled off the top
   exactly as it did before `afab8a7`, whose grid-area half was correct but could never take
   effect. In columns it meant the phone inherited the stacked rule's `top: 96px` as a relative
   offset, hanging 96 px low, **with the CTA underneath it rather than beneath it**.
2. **Frame 1's copy sat behind the phone at 375×812** (eyebrow −60.1 px, headline −35.8 px).
   Recorded as **BD-11**.

*How it was served.* `bunx wrangler dev` on the built output, driven by **headless Chrome over the
DevTools protocol**, because the desktop app's Browser pane could not paint: the session had no
window open, so `document.visibilityState` was permanently `hidden`, `requestAnimationFrame` never
ticked (0 ticks in 2 s) and **`IntersectionObserver` never delivered a single callback** — a
freshly-armed observer did not even fire its initial one. The first walk therefore read
`data-active: 0` at every scroll position and looked like a dead page. It was a frozen rendering
lifecycle, not a defect. **Anything that depends on the rendering lifecycle has to be walked in a
browser that is actually rendering**; a hidden pane silently reports "nothing happens".

### 1. The five frames advance, and the screen follows

- **Goal.** Scrolling changes which screen is on the phone, once per frame, in order.
- **Where.** `http://localhost:4331/projects/furlough` at a desktop width (≥ 860 px).
- **Right answer.** Five frames. As each headline reaches the middle of the viewport its screen
  cross-fades in over 0.45 s. Order: the Furlough home (hourglass, Instagram countdown) → the
  Anchor screen (anchor icon, five held app icons) → the Rule screen showing **60 MIN** → the
  delay screen → the grey block screen whose only button is **Close**. Nothing flickers between
  two screens at a frame boundary, and no frame leaves the phone blank.
- **WALKED 2026-09-16, 1440×900.** `data-active` stepped **0 → 1 → 2 → 3 → 4** — all five, at
  `scrollY = 372 + 792 i`. `--progress` **0 → 0.25 → 0.5 → 0.75 → 1**. Exactly **one** screen at
  `opacity: 1` per frame, every other at 0. The active frame's headline matched the active screen
  at all five: *No unblock button.* / *Locked till you tap the tag.* / *Sixty minutes. Then it's
  gone.* (the capture shows `60 MIN` under `DAILY BUDGET`, slider on the 60 stop — §7.3's check
  confirmed on screen, not just in the file) / *Loosening waits a day.* / *Nothing to tap but
  Close.* (the **Close** button is visible and uncropped — BD-9's whole reason). Dots lit
  cumulatively 1→2→3→4→5 (reached `opacity: 1`, ahead `0.22`). Inactive frames dim to `0.45`.
  **The sticky phone holds**: `.stage` rect top **96.0 px on every frame** (95.8 on the last, the
  document's final pixel), and the phone's own layout top pinned at **96** — its *visual* rect top
  reads 88.2 / 92.1 / 96.0 / 92.1 / 87.9 because the 12° perspective rotation expands the box
  symmetrically, which is why it is exactly 96 at frame 3 where the tilt is zero. **Never
  negative.** Console clean; **16 requests, all 200** except the pre-existing `/favicon.ico` 404,
  which this site has never had (on `main`, not ours).

### 2. The tilt sweeps, and the line draws

- **Goal.** D2's "rotating" is visible, and the line tracks the reader.
- **Where.** Same page, same width.
- **Right answer.** The phone is tilted right on frame 1, square on frame 3, tilted left on
  frame 5 — a sweep from +12° to −12°, not a jump. The teal line in the column gap is drawn from
  the top down to the current frame's dot; dots behind the reader are bright, dots ahead are
  dim. In Chrome the draw is continuous with the scroll; in Firefox it steps frame to frame.
  Both are correct — see entry 6.
- **WALKED 2026-09-16.** Read as the prompt directed — `--ry` off the custom property, the dash
  offset as a **string** — after step 16's probe returned `null` for both by trying to parse an
  angle out of `matrix3d()` and to coerce `strokeDashoffset` to a number. `--ry` reads
  `calc(12deg - 2 * 12deg * P)` with P stepping 0 → 0.25 → 0.5 → 0.75 → 1, i.e. **+12° → +6° → 0°
  → −6° → −12°**, and the resolved `transform` agrees: `matrix3d` m13 is **−0.207912** at frame 1
  (`sin 12°`), the **identity** at frame 3, **+0.207912** at frame 5. Sampling the transform every
  120 ms across a jump from frame 1 to frame 5 gives +12° → +0.39° → −7.84° → −10.56° → −11.70° →
  −11.98°: **a sweep, eased over `--sweep: 0.6s`, not a jump.** Dash offset falls
  **`1px` → `0.758762px` → `0.499939px` → `0.241115px` → `0px`** — continuous, and the off-quarter
  values are the signature of the scroll timeline driving it rather than the stepped baseline.

### 3. The CTA goes to the App Store

- **Goal.** The one outbound link on the page is right.
- **Where.** The button under the phone, labelled **On the App Store ↗**.
- **Right answer.** It opens `https://apps.apple.com/app/id6810006594` in a new tab, landing on
  Furlough's App Store page. *(computed: the href is in `dist/client/projects/furlough/index.html`
  and the URL returned 200 to curl on 2026-09-16.)*
- **WALKED 2026-09-16** in the live DOM: text `On the App Store ↗`, `href`
  `https://apps.apple.com/app/id6810006594`, `target="_blank"`, `rel="noopener noreferrer"`,
  rendered 184×52 and on screen. The link itself was **not clicked** — it leaves the site, and
  step 16 already has curl's 200 to `apps.apple.com/us/app/furlough/id6810006594`.
- **This entry caught defect 1.** The CTA was rendering **on top of the phone's screen**, not
  below it: the phone hung 96 px low, so its box ran to y=862 while the stage ended at 846 and the
  button sat at 794–846, entirely inside the phone's footprint. Fixed; the CTA now sits **28 px
  below the phone** (the stage's flex `gap`), phone bottom 766 → CTA top 794. Seen in
  `desktop-frame3.png` and `desktop-frame5.png`.

### 4. The phone does not eat the copy at 375×812

- **Goal.** DESIGN §5 H6 — the mobile room question, the one real risk in this layout.
- **Where.** Same page at 375×812.
- **Right answer.** The phone sticks below the nav at 40 vh (≈ 325 px) tall and ≈ 149 px wide.
  Each frame's eyebrow, headline **and** sub-line are fully visible *below* the phone at the
  moment that frame goes active — no line of copy is behind the phone, and nothing needs a
  second scroll to finish reading. **Report the pixel room**: the gap between the phone's bottom
  edge and the bottom of the viewport. *(computed: ≈ 411 px available against ≈ 203 px of copy.
  The frame's top padding that produces this is derived in `ProjectStory.astro`, not tuned by
  eye — so this entry is the one most worth actually looking at.)*
- **WALKED 2026-09-16 at 375×812, and it earned its place — it failed.** The phone measures
  **149.4 × 324.8 px** and sticks at `top: 72`, as designed. **Pixel room, measured: 414.3 /
  415.2 / 414.3 / 413.4 px on frames 2–5** against ≈ 203 px of copy (copy blocks 145–175.3 px
  tall) — the computed ≈ 411 px was right for those four.
- **Frame 1 was not.** Its eyebrow cleared the phone by **−60.1 px** and its headline by
  **−35.8 px**: both sat *behind* the phone at the moment the frame went active. Cause: the
  derived `padding-top` assumes the phone is already pinned at `--stick-top`, and at 375×812
  frame 1 crosses the middle of the viewport at **scrollY 261** while the phone does not pin until
  **scrollY 341** — so it is still 80 px lower, at the top of its own grid area.
- **The remedy this file and P1's done-when both name — lower S-2's mobile height — provably
  cannot fix it.** Unpinned, the phone's bottom edge and the copy move down together, so the
  deficit is **−56.28 px at every `--phone-h`** (checked at 40/34/30/25 vh: identical). The fix is
  in the derivation instead: unpinned, the phone and the frame share a top edge, so the first
  frame needs `--phone-h + 24px` of clearance — note it contains no `--stick-top` term. Recorded
  as **BD-11**. After the fix, clearance is **22.2 / 22.4 / 23.7 / 23.3 / 21.8 px** on frames 1–5,
  every eyebrow, headline and sub-line fully inside the viewport, nothing needing a second scroll.
  Frame 1's room reads 331.2 px because the phone is legitimately still unpinned there.

### 5. Without JavaScript, nothing is lost but the screens

- **Goal.** BD-5 holds.
- **Where.** Same page, JS disabled.
- **Right answer.** The phone shows frame 1's screen. All five eyebrows, headlines and sub-lines
  are visible and at full opacity — not dimmed. The CTA still links out. *(computed: all fifteen
  strings are in the static HTML, and the dim rule is keyed on `[data-active]`, which only the
  script adds.)*
- **WALKED 2026-09-16** with script execution disabled in the browser, and the styles read
  through the DevTools **CSS domain** rather than page script — so the measurement does not need
  the JavaScript it is testing. `data-active` is **absent** from the story root (attributes:
  `class`, `data-story`, `style`, `data-astro-cid-…`). All five `.frame` opacities are **`1`** —
  full, not dimmed — which is the point: BD-5 holds *because* the dim rule is keyed on
  `[data-active]`, verified rather than assumed. Screens read `[1, 0, 0, 0, 0]`: frame 1's shows,
  the other four do not, exactly as BD-5 accepts. The CTA is `display: flex`, `visibility:
  visible`.

### 6. The Firefox baseline

- **Goal.** The `@supports (animation-timeline: scroll())` block is an enhancement, never the
  mechanism.
- **Where.** Same page in Firefox (or Chrome with that block commented out).
- **Right answer.** The line still advances — in five steps rather than continuously — and every
  other behaviour is identical. *(computed: the stepped rule is emitted outside the `@supports`
  block in `dist/client/_astro/_slug_*.css`.)*
- **WALKED 2026-09-16 as "Chrome with that block commented out".** Real Firefox was not an
  option — it is not installed on this machine (`/Applications` holds only Safari, `mdfind -name
  Firefox.app` returns nothing, not on `PATH`). The `@supports` condition was falsified at source,
  rebuilt and re-served; with it not matching, the dash offset steps **`calc(1px)` → `calc(0.75px)`
  → `calc(0.5px)` → `calc(0.25px)` → `0%`** — exactly `1 − --progress` — carried by
  `transition: stroke-dashoffset 0.6s` with **zero CSS animations on the path**, proving the
  scroll timeline really was gone. `data-active` and `--progress` stepped identically; nothing
  else changed. **The block was then restored and rebuilt** — the file's SHA-256 matches the copy
  taken before the edit (`7a49286b…`), `@supports (animation-timeline: scroll())` is back at
  `ProjectStory.astro:316`, and the emitted CSS carries it once.

### 7. Reduced motion

- **Goal.** The third of the three layers actually engages. **The OS toggle is Zach's to flip;
  P1 verified this in `dist/`, not on screen.**
- **Where.** Same page with System Settings → Accessibility → Display → Reduce motion on.
- **Right answer.** Screens swap instantly, the phone sits square (no tilt, ever), and the line
  is drawn full length from the start. Nothing animates. *(computed: the emitted CSS carries
  `@media (prefers-reduced-motion:reduce){.phone{--ry:0deg;transition:none;transform:none} …
  .line-path{stroke-dashoffset:0;transition:none;animation:none}}`.)*
- **WALKED 2026-09-16 — no longer only a `dist/` claim, and Zach did not have to flip anything.**
  The media feature was emulated in the browser (`Emulation.setEmulatedMedia`), so the rule was
  exercised rather than read: `matchMedia('(prefers-reduced-motion: reduce)').matches` is **true**,
  and at both ends of the page the phone reads **`--ry: 0deg`**, `transform: none`,
  `transition: none / 0s`, the screens' transition duration **`0s`**, and the line's
  `stroke-dashoffset` **`0px`** — drawn in full from the start. The screens still swap (frame 5
  shows `[0,0,0,0,1]`), instantly. **What is still Zach's**: whether the real OS toggle behaves
  the same as the emulated media feature. Nothing in this pass suggests it would not.

### 8. Observer hygiene across navigation

- **Goal.** The `ClientRouter` does not leave observers running.
- **Where.** `/` → `/projects/furlough` → back → `/projects/furlough`, console open.
- **Right answer.** The console is clean and the frames still advance on the second visit — the
  observer is re-armed per visit, not stacked. Nothing throws on the pages that have no story.
- **WALKED 2026-09-16**, `/` → `/projects/furlough` → `history.back()` → `/projects/furlough`,
  all three hops through the `ClientRouter` (`astro:before-swap` / `after-swap` / `page-load`
  fired in order on each). Arming was counted by **wrapping `window.IntersectionObserver` before
  the first navigation** rather than by the `console.count` in `startStory` the prompt suggested:
  it is the same evidence — one construction per `startStory` call — but it needs no edit to
  `src/lib/story.ts`, no rebuild cycle, and leaves nothing behind to remove. Result: **exactly one
  story observer per visit** (`rootMargin: -50% 0px -50% 0px`), constructed on visit 1 and again
  on visit 2, with **one `disconnect` in between**, on leaving. The other observer constructed on
  each page (`rootMargin: 0px 0px -10% 0px`) is `reveal.ts`, present on every page including `/`.
  Not stacked. **The frames still advance on the second visit** — scrolled to frame 4 both times,
  `data-active: 3`, `--progress: 0.75`. Console clean on all three pages but for the pre-existing
  `/favicon.ico` 404; nothing threw on `/`, which has no story.

### Weight — S-10 and S-11, from the network panel

**WALKED 2026-09-16**, replacing step 16's figure computed off disk. A desktop visit is **16
requests, 232.7 KB on the wire** against S-11's 800 KB cap. Largest emitted image **16.0 KB**
(`03…webp`) against S-10's 150 KB — the five screens total 56.7 KB, since each `<Image>` serves
one of its two widths, not both. The heaviest single asset on the page is `/noise.png` at 64.2 KB,
which is the wall's grain and pre-dates this work.

---

## P2 — `/projects/ezhomesteading`, `/projects/emoney`

*Appended by P2.*

## P3 — `/`

*Appended by P3.*
